import sys
from itertools import izip
import cPickle
import urllib, json
import pprint
import time
import xlrd
import heapq
import MySQLdb
import json
import operator
from random import randint
from geopy.distance import vincenty


from collections import namedtuple
from pprint import pprint as pp
 
 
inf = float('inf')
Edge = namedtuple('Edge', 'start, end, cost')


connection = MySQLdb.connect(host="localhost",user="imobivolos",passwd="vP4tgP3B",db="imobivolos_db")
connection.set_character_set('utf8')
x = connection.cursor()

file_location_1 = "car_network_new.xlsx"
file_location_2 = "bus_network_all_nodes.xlsx"
file_location_3 = "walking_network.xlsx"
file_location_4 = "bus_network_bus_stops.xlsx"
file_location_5 = "new_bike_network_latest.xlsx"

workbook_1 = xlrd.open_workbook(file_location_1)
workbook_2 = xlrd.open_workbook(file_location_2)
workbook_3 = xlrd.open_workbook(file_location_3)
workbook_4 = xlrd.open_workbook(file_location_4)
workbook_5 = xlrd.open_workbook(file_location_5)

sheet_1_car = workbook_1.sheet_by_index(0)
sheet_2_bus = workbook_2.sheet_by_index(0)
sheet_3_walk = workbook_3.sheet_by_index(0)
sheet_4_bus_stops = workbook_4.sheet_by_index(0)
sheet_5_bike = workbook_5.sheet_by_index(0)


route_time = 0
 
class Graph():
    def __init__(self, edges):
        self.edges = edges2 = [Edge(*edge) for edge in edges]
        self.vertices = set(sum(([e.start, e.end] for e in edges2), []))
 
    def dijkstra(self, source, dest):
        assert source in self.vertices
        dist = {vertex: inf for vertex in self.vertices}
        previous = {vertex: None for vertex in self.vertices}
        dist[source] = 0
        q = self.vertices.copy()
        neighbours = {vertex: set() for vertex in self.vertices}
        for start, end, cost in self.edges:
            neighbours[start].add((end, cost))
        #pp(neighbours)
 
        while q:
            u = min(q, key=lambda vertex: dist[vertex])
            q.remove(u)
            if dist[u] == inf or u == dest: # Stop the algorithm | destination was found
                break
            for v, cost in neighbours[u]:
                alt = dist[u] + cost
                if alt < dist[v]:                                  # Relax (u,v,a)
                    dist[v] = alt
                    previous[v] = u
        #pp(previous)
        s, u = [], dest
        while previous[u]:
            s.insert(0, u)
            u = previous[u]
        s.insert(0, u)

        return s

def find_bus_code_and_name(node):

    query = "SELECT name, bus_route FROM all_bus_stops WHERE lat = %s AND lng = %s"
    x.execute(query,[node[0],node[1]])
    results = x.fetchall()

    if results:
        return [ results[0][0],results[0][1],x.rowcount, results ]
    else:
        return "none"

def printme( tupleOfTuples ):
	code_list = []
	list = [element for tupl in tupleOfTuples for element in tupl]
	count = 0
	for i in list:
		if count%2 == 1:
			code_list.append(i)
		count+=1
	code_list = "_".join(str(x) for x in code_list)
	return code_list;
		
def point_is_bus_stop(node):

    #print node
    try:
        lat = node[0]
        lng = node[1]
    except TypeError:
        return False
    
    # Find the id of the node
    node_id = 0
    
    # Now check if the node is bus_stop
    query = "SELECT * FROM all_bus_stops WHERE lat = %s AND lng = %s"
    x.execute(query,[lat,lng])
    results = x.fetchall()

    if results:
        return True     # break and return
    else:
        return False    # break and return

def find_min_bus_hour(all_hours,bus_hour):


    time_min = str(bus_hour).split(".")
    given_route_time_m = 0 
    if len(time_min) == 2:
        given_route_time_m = 60*int(time_min[0]) + int(time_min[1])   #total time in minutes
    else:
        if time_min[0] != 'None':
            given_route_time_m = 60*int(time_min[0])

    min_threashold = -100
    min_route_time = 0
    hours_list = []
    
    for hour in all_hours:
        hour_min = str(hour).split(".")
        if len(hour_min) == 2:
            current_route_time_m = 60*int(hour_min[0]) + int(hour_min[1])   #total time in minutes
        else:
            current_route_time_m = 60*int(hour_min[0])              #total time in minutes
        # print "------------"
        # print given_route_time_m
        # print current_route_time_m
        # print "--------------"
        curr_min_threashold = int(current_route_time_m) - int(given_route_time_m)
        if curr_min_threashold >=0:     #current_route_time_m >= given_route_time_m
            hours_list.append(curr_min_threashold)
        else:
            hours_list.append(9999)

    min_index, min_value = min(enumerate(hours_list), key=operator.itemgetter(1))
    # print "bus_hour: %s" % bus_hour
    # print "hours_list %s:" % hours_list
    # print min_value
    # print all_hours
    # print all_hours[min_index]

    if min_value == 9999:
        
        new_bus_hour_m = int(str(bus_hour).split(".")[1])+1
        bus_hour = str(bus_hour).split(".")
        # print new_bus_hour_m
        bus_hour = bus_hour[0] + "." + str(new_bus_hour_m)
        return bus_hour
    else:
        return all_hours[min_index]

def find_bus_hour(bus_details,point,bus_hour):


    all_hours = []
    data_to_return = 0

    if bus_details[2] == "going":

        file_location = "bus_routes_hours/%s.xlsx" % bus_details[1]
        workbook = xlrd.open_workbook(file_location)
        sheet = workbook.sheet_by_index(0) 

        for col in range(sheet.ncols):
         
            if str(sheet.cell_value(0,col)) == str(point[1]) and str(sheet.cell_value(1,col)) == str(point[0]):

                item_to_search_col = col
                for row in range(2,sheet.nrows):
                    if route_time == sheet.cell_value(row,item_to_search_col):
                        return sheet.cell_value(row,item_to_search_col)
                    else:
                        all_hours.append(sheet.cell_value(row,item_to_search_col))  # all hours of the col
                
                data_to_return = find_min_bus_hour(all_hours,bus_hour)
                #print "data_to_return %s:" % data_to_return
                return data_to_return

    else:   # return
    
        file_location = "bus_routes_hours/%s_r.xlsx" % bus_details[1]
        workbook = xlrd.open_workbook(file_location)
        sheet = workbook.sheet_by_index(0) 

        for col in range(sheet.ncols):
         
            if str(sheet.cell_value(0,col)) == str(point[1]) and str(sheet.cell_value(1,col)) == str(point[0]):

                item_to_search_col = col
                for row in range(2,sheet.nrows):
                    if route_time == sheet.cell_value(row,item_to_search_col):
                        return sheet.cell_value(row,item_to_search_col)
                    else:
                        all_hours.append(sheet.cell_value(row,item_to_search_col))
                data_to_return = find_min_bus_hour(all_hours,bus_hour)
                #print "data_to_return %s:" % data_to_return
                return data_to_return
        

    # print "NOOOONNEEE"


def calc_Dijkstra_Route(mode,route_optimization,source,destination):

    all_edges_car = {}
    all_edges_walk = {}
    all_edges_transit = {}
    route_total_length = route_total_time = route_total_cost = route_total_money = 0 
    all_nodes = []       # All the nodes of the network
    g = []
    
    source = source.split("_")[0]
    destination = destination.split("_")[0]
    if mode == "DRIVING":
        for row in range(3,sheet_1_car.nrows):
            
            pos1 = str(sheet_1_car.cell_value(row, 5)) + "," + str(sheet_1_car.cell_value(row, 4))
            pos2 = str(sheet_1_car.cell_value(row, 7)) + "," + str(sheet_1_car.cell_value(row, 6))
            #x.execute("""INSERT INTO all_points (lat,lng,lat_2,lng_2) VALUES (%s,%s,%s,%s)""",[sheet_1_car.cell_value(row, 4),sheet_1_car.cell_value(row, 3),sheet_1_car.cell_value(row, 6),sheet_1_car.cell_value(row, 5)])

            if pos1 not in all_nodes:
                all_nodes.append(pos1);
            if pos2 not in all_nodes:
                all_nodes.append(pos2)
            if route_optimization == "money":
                g.append((pos1,pos2,sheet_1_car.cell_value(row, 8)))
            elif route_optimization == "speed" or route_optimization == "number_of_tr":
                g.append((pos1,pos2,sheet_1_car.cell_value(row, 9)))
            else:   # co2
                g.append((pos1,pos2,sheet_1_car.cell_value(row, 11)))
            #connection.commit()
    elif mode == "WALKING":
        for row in range(2,sheet_3_walk.nrows):
            pos1 = str(sheet_3_walk.cell_value(row, 4)) + "," + str(sheet_3_walk.cell_value(row, 3))
            pos2 = str(sheet_3_walk.cell_value(row, 6)) + "," + str(sheet_3_walk.cell_value(row, 5))
            if pos1 not in all_nodes:
                all_nodes.append(pos1);
            if pos2 not in all_nodes:
                all_nodes.append(pos2)

            if route_optimization == "money":
                g.append((pos1,pos2,sheet_3_walk.cell_value(row, 8)))
            elif route_optimization == "speed" or route_optimization == "number_of_tr":
                g.append((pos1,pos2,sheet_3_walk.cell_value(row, 8)))
            else:   # co2
                g.append((pos1,pos2,sheet_3_walk.cell_value(row, 8)))
    elif mode == "TRANSIT":
       
        for row in range(1,sheet_2_bus.nrows):
            pos1 = str(sheet_2_bus.cell_value(row, 4)) + "," + str(sheet_2_bus.cell_value(row, 3))
            pos2 = str(sheet_2_bus.cell_value(row, 6)) + "," + str(sheet_2_bus.cell_value(row, 5))
            #print pos1
            #print pos2
            #x.execute("""INSERT INTO all_points (lat,lng,lat_2,lng_2) VALUES (%s,%s,%s,%s)""",[sheet_2_bus.cell_value(row, 4),sheet_2_bus.cell_value(row, 3),sheet_2_bus.cell_value(row, 6),sheet_2_bus.cell_value(row, 5)])

            if pos1 not in all_nodes:
                all_nodes.append(pos1); 
            if pos2 not in all_nodes:
                all_nodes.append(pos2)
            if route_optimization == "money":       # Ticket price
                g.append((pos1,pos2,1))
            elif route_optimization == "speed" or route_optimization == "number_of_tr":
                g.append((pos1,pos2,sheet_2_bus.cell_value(row, 8)))
            else:   # co2
                g.append((pos1,pos2,sheet_2_bus.cell_value(row, 10)))

            #connection.commit()

    elif mode == "BICYCLING":
        for row in range(3,sheet_5_bike.nrows):
            pos1 = str(sheet_5_bike.cell_value(row, 4)) + "," + str(sheet_5_bike.cell_value(row, 3))
            pos2 = str(sheet_5_bike.cell_value(row, 6)) + "," + str(sheet_5_bike.cell_value(row, 5))
            #x.execute("""INSERT INTO all_points (lat,lng,lat_2,lng_2) VALUES (%s,%s,%s,%s)""",[sheet_3_walk.cell_value(row, 4),sheet_3_walk.cell_value(row, 3),sheet_3_walk.cell_value(row, 6),sheet_3_walk.cell_value(row, 5)])
            if pos1 not in all_nodes:
                all_nodes.append(pos1);
            if pos2 not in all_nodes:
                all_nodes.append(pos2)

            if route_optimization == "money":
                g.append((pos1,pos2,1))
            elif route_optimization == "speed" or route_optimization == "number_of_tr":
                g.append((pos1,pos2,sheet_5_bike.cell_value(row, 8)))
            else:   # co2
                g.append((pos1,pos2,1))
            #connection.commit()

    # If the source point is not in the network
    source_not_exists = False
    nearest_to_source_point = 0
    if source not in all_nodes:      # then, find the nearest point which is closest to source and add this edge to network
        # print "SOURCE NOOOO"
        source_not_exists = True
        nearest_point_lat_src = 0
        nearest_point_lng_src = 0
        min_dis = 99999
        source_point = (pos1_lat, pos1_lng.split("_")[0])

        # Iterate through all nodes of the network
        for point in all_nodes:
            point_lat_lng = point.split(",")
            point_lat = point_lat_lng[0]
            point_lng = point_lat_lng[1]
            
            nearest_point = (point_lat, point_lng)
            #print nearest_point
            if mode == "TRANSIT":
                if not point_is_bus_stop(nearest_point):    # The nearet point must only be a bus stop
                    #print "no"
                    continue
            #print "go on 1"
            dis = vincenty(source_point, nearest_point).miles
            if dis < min_dis:
                min_dis = dis
                nearest_point_lat_src = point_lat
                nearest_point_lng_src = point_lng
                ####### NEW ##########
                nearest_to_source_point = str(nearest_point_lat_src) + "," + str(nearest_point_lng_src)
                # print nearest_to_source_point
                ######################
            #else --> continue
        g.append((source,nearest_to_source_point, 0))    # Add the new edge with cost 0

    # print "nearest_to_source_point %s" % nearest_to_source_point
    # If the destination point is not in the network
    destination_not_exists = False
    nearest_to_dest_point = 0
   
    if destination not in all_nodes:      # then, find the nearest point which is closest to destination and add this edge to network
        # print "DESTINATION NOOOO"
        min_dis = 99999
        destination_not_exists = True
       
        nearest_point_lat_ds = 0
        nearest_point_lng_ds = 0
       
        destination_point = (pos2_lat, pos2_lng.split("_")[0])

        for point in all_nodes:

            point_lat_lng = point.split(",")
            point_lat = point_lat_lng[0]
            point_lng = point_lat_lng[1]
            
            nearest_point = (point_lat, point_lng)

            if mode == "TRANSIT":
                if not point_is_bus_stop(nearest_point):    # The nearet point must only be a bus stop
                    continue
            #print "go on 2"
            dis = vincenty(destination_point, nearest_point).miles
            if dis < min_dis:
                min_dis = dis
                nearest_point_lat_ds = point_lat
                nearest_point_lng_ds = point_lng  
                ####### NEW ##########
                nearest_to_dest_point = str(nearest_point_lat_ds) + "," + str(nearest_point_lng_ds)
                #print nearest_to_dest_point
                ######################

        g.append((nearest_to_dest_point, destination, 0))    # Add the new edge with cost 0
    #print nearest_to_dest_point
    graph = Graph(g)
    
    source_nearest_points = []
    destination_nearest_points = []
    # if source/desination are not in the network, then connect them with their nearest nodes             
    if source_not_exists and not destination_not_exists:    # source doesn't exist and destination exists
        
        while len(graph.dijkstra(nearest_to_source_point, destination)) == 1:  # route doesn't exists
 
            # all_nodes_new.remove(nearest_to_source_point) 
            nearest_point_lat_src = 0
            nearest_point_lng_src = 0
            min_dis = 99999
            source_point = (pos1_lat, pos1_lng.split("_")[0])

            # Iterate through all nodes of the network
            for point in all_nodes:
                if point not in source_nearest_points:
                    point_lat_lng = point.split(",")
                    point_lat = point_lat_lng[0]
                    point_lng = point_lat_lng[1]
                    
                    nearest_point = (point_lat, point_lng)

                    if mode == "TRANSIT":
                        if not point_is_bus_stop(nearest_point):    # The nearet point must only be a bus stop
                            continue
                    else:
                        dis = vincenty(source_point, nearest_point).miles
                        if dis < min_dis:
                            source_nearest_points.append(point)
                            min_dis = dis
                            nearest_point_lat_src = point_lat
                            nearest_point_lng_src = point_lng
                            
                            nearest_to_source_point = str(nearest_point_lat_src) + "," + str(nearest_point_lng_src)
       
        g.append((source, nearest_to_source_point, 0))    # Add the new edge with cost 0

    elif not source_not_exists and destination_not_exists: # source exists and destination doesn't exist
        while len(graph.dijkstra(source, nearest_to_dest_point)) == 1:  # route doesn't exist
 
            # all_nodes_new.remove(nearest_to_dest_point) 
            nearest_point_lat_src = 0
            nearest_point_lng_src = 0
            min_dis = 99999
            destination_point = (pos2_lat, pos2_lng.split("_")[0])

            # Iterate through all nodes of the network
            for point in all_nodes:
                if point not in destination_nearest_points:
                    point_lat_lng = point.split(",")
                    point_lat = point_lat_lng[0]
                    point_lng = point_lat_lng[1]
                    
                    nearest_point = (point_lat, point_lng)
                    if mode == "TRANSIT":
                        if not point_is_bus_stop(nearest_point):    # The nearet point must only be a bus stop
                            continue
                    dis = vincenty(destination_point, nearest_point).miles
                    if dis < min_dis:
                        destination_nearest_points.append(point)
                        min_dis = dis
                        nearest_point_lat = point_lat
                        nearest_point_lng = point_lng
                        
                        nearest_to_dest_point = str(nearest_point_lat) + "," + str(nearest_point_lng)
       
        g.append((nearest_to_dest_point, destination, 0))    # Add the new edge with cost 0

    elif source_not_exists and destination_not_exists:       # both source and destination don't exist
        # print "both source and destination don't exist"
        
        while len(graph.dijkstra(nearest_to_source_point, nearest_to_dest_point)) == 1:  # route doesn't exist
            
            nearest_point_lat = 0
            nearest_point_lng = 0
            min_dis = 99999
            source_point = (pos1_lat, pos1_lng.split("_")[0])

            # Iterate through all nodes of the network
            for point in all_nodes:
                if point not in source_nearest_points:
                    # print "p0"
                    
                    point_lat_lng = point.split(",")
                    point_lat = point_lat_lng[0]
                    point_lng = point_lat_lng[1]
                    
                    nearest_point = (point_lat, point_lng)

                    if mode == "TRANSIT":
                        if not point_is_bus_stop(nearest_point):    # The nearet point must only be a bus stop
                            continue
                    dis = vincenty(source_point, nearest_point).miles
                    if dis < min_dis:
                        source_nearest_points.append(point)
                        min_dis = dis
                        nearest_point_lat = point_lat
                        nearest_point_lng = point_lng
                        
                        nearest_to_source_point = str(nearest_point_lat) + "," + str(nearest_point_lng)
                        # break
           
            nearest_point_lat = 0
            nearest_point_lng = 0
            min_dis = 99999
            destination_point = (pos2_lat, pos2_lng.split("_")[0])

            
            # Iterate through all nodes of the network
            for point in all_nodes:
                if point not in destination_nearest_points:
                    # print "p1"
                    
                    point_lat_lng = point.split(",")
                    point_lat = point_lat_lng[0]
                    point_lng = point_lat_lng[1]
                    
                    nearest_point = (point_lat, point_lng)
                    if mode == "TRANSIT":
                        if not point_is_bus_stop(nearest_point):    # The nearet point must only be a bus stop
                            continue
                    dis = vincenty(destination_point, nearest_point).miles
                    if dis < min_dis:
                        destination_nearest_points.append(point)
                        min_dis = dis
                        nearest_point_lat = point_lat
                        nearest_point_lng = point_lng
                        
                        nearest_to_dest_point = str(nearest_point_lat) + "," + str(nearest_point_lng)
                        # break
        # print "oute of while"
        # print  nearest_to_source_point 
        # print  nearest_to_dest_point 
        g.append((source,nearest_to_source_point, 0))    # Add the new edge with cost 0
        g.append((nearest_to_dest_point, destination, 0))    # Add the new edge with cost 0
    #elif not source_not_exists and not destination_not_exists: # both source and destination exists    
        
        
    #print g

    graph = Graph(g)
    dijkstra_results = graph.dijkstra(source, destination)
    # print dijkstra_results

    # print "*********************************"


    # Optimize Dijkstra's retured points
    # opt_dijkstra_results = []
    # all_pairs = zip(dijkstra_results,dijkstra_results[1:])[::2]
    # for pair in all_pairs:

    #     point1 = pair[0]
    #     point2 = pair[1]

    #     dis = vincenty(point1, point2).miles
        
    #     if dis < 0.025:
    #         opt_dijkstra_results.append(point1) # or point 2
    #     else:
    #         opt_dijkstra_results.append(point1) # or point 2
    #         opt_dijkstra_results.append(point2) # or point 2

    all_pairs = zip(dijkstra_results,dijkstra_results[1:])[::2]
    for pair in all_pairs:
        # Find time and length of the route
        if mode == "DRIVING":
            for row in range(3,sheet_1_car.nrows):
                pos1 = str(sheet_1_car.cell_value(row, 5)) + "," + str(sheet_1_car.cell_value(row, 4))
                pos2 = str(sheet_1_car.cell_value(row, 7)) + "," + str(sheet_1_car.cell_value(row, 6))

                if pos1 == pair[0] and pos2 == pair[1]:
                    route_total_length = route_total_length + sheet_1_car.cell_value(row, 2)
                    route_total_time = route_total_time + sheet_1_car.cell_value(row, 9)
                    route_total_cost = route_total_cost + sheet_1_car.cell_value(row, 11)
                    route_total_money = route_total_money + sheet_1_car.cell_value(row, 8)
        elif mode == "WALKING":
            for row in range(2,sheet_3_walk.nrows):
                pos1 = str(sheet_3_walk.cell_value(row, 4)) + "," + str(sheet_3_walk.cell_value(row, 3))
                pos2 = str(sheet_3_walk.cell_value(row, 6)) + "," + str(sheet_3_walk.cell_value(row, 5))

                if pos1 == pair[0] and pos2 == pair[1]:
                    route_total_length = route_total_length + sheet_3_walk.cell_value(row, 2)
                    route_total_time = route_total_time + sheet_3_walk.cell_value(row, 8)
        elif mode == "BICYCLING":
            for row in range(3,sheet_5_bike.nrows):
                pos1 = str(sheet_5_bike.cell_value(row, 4)) + "," + str(sheet_5_bike.cell_value(row, 3))
                pos2 = str(sheet_5_bike.cell_value(row, 6)) + "," + str(sheet_5_bike.cell_value(row, 5))

                if pos1 == pair[0] and pos2 == pair[1]:
                    route_total_length = route_total_length + sheet_5_bike.cell_value(row, 2)
                    route_total_time = route_total_time + sheet_5_bike.cell_value(row, 8)
        elif mode == "TRANSIT":
            for row in range(2,sheet_2_bus.nrows):
                pos1 = str(sheet_2_bus.cell_value(row, 4)) + "," + str(sheet_2_bus.cell_value(row, 3))
                pos2 = str(sheet_2_bus.cell_value(row, 6)) + "," + str(sheet_2_bus.cell_value(row, 5))

                if pos1 == pair[0] and pos2 == pair[1]:
                    route_total_length = route_total_length + sheet_2_bus.cell_value(row, 2)
                    route_total_time = route_total_time + sheet_2_bus.cell_value(row, 8)
                    route_total_cost = route_total_cost + sheet_2_bus.cell_value(row, 10)

    if mode == "TRANSIT":

        # dijkstra_results = opt_dijkstra_results
        all_pairs = zip(dijkstra_results,dijkstra_results[1:])[::2]
        c = -1
        bus_codes = []
        point_id = 0
        current_bus_hour = 0
        flag = True
        all_bus_stops = []
        for index,i in enumerate(dijkstra_results):
            if index == 0:  # source
                if source_not_exists:
                    dijkstra_results[index] = dijkstra_results[index] + "-new_point" 
                continue
            if index == len(dijkstra_results) - 1:  # destination
                if destination_not_exists:
                    dijkstra_results[len(dijkstra_results)-1] = dijkstra_results[len(dijkstra_results)-1] + "-new_point" 
                continue
            else:
               
                point_lat_lng = i.split(",")
                point_lat = point_lat_lng[0]
                point_lng = point_lat_lng[1]
                    
                point = (point_lat, point_lng)
                if point_is_bus_stop(point):     # Check if the current point is a bus stop or just a node
                    
                    bus_details = find_bus_code_and_name(point)     # [bus_stop_name,bus_route,bus_direction,number_of_results,whole_result_object]
					#bus_codes = bus_details[4] #bus_codes -> results
                    #if flag :
                        #flag = False
                        #current_bus_hour = find_bus_hour(bus_details,point,route_time)
                    #else:
                    	#if bus_details[1] not in all_bus_stops:
							#current_bus_hour = find_bus_hour(bus_details,point,current_bus_hour)
							
							# print "A BUS STOP"
							# print current_bus_hour
							#all_bus_stops.append(bus_details[1])
                        #else:
							#print "none"
                    t = printme(bus_details[3]) # e.g ['1', '3', '15', '49'] for one bus stop
                    data = "%s_%s" % (bus_details[0],t) # edw eixe current_bus_hour anti gia bus_details[3] to vazw anti autou gia na dw posa results epistrefei to query pou kanw, dld posa diaforetika lewforeia pernane apo kathe stasi
                    dijkstra_results[index] = dijkstra_results[index] + "-%s" % data 
                else:
                    bus_details = "none"
                    dijkstra_results[index] = dijkstra_results[index] + "-%s" % bus_details 
                
                #break   # break the loop and continue with the next node
               

       
        return [route_total_time,route_total_length,route_total_cost,route_total_money,dijkstra_results]   
    else:               
        return [route_total_time,route_total_length,route_total_cost,route_total_money,dijkstra_results]   
  

def extract_data(data):

    result = ""
    counter = 0
    for i in data:
        lat_lng = i.split(",")
        if counter == 0:
            result = result + str(lat_lng[0])+","+str(lat_lng[1])       # reverse order
            counter = counter + 1
        else:
            result = result+ ";" + str(lat_lng[0])+","+str(lat_lng[1])   # reverse order
            counter = counter + 1
    

    return result

if __name__ == '__main__':

    pos1_lat = sys.argv[1] 
    pos1_lng = sys.argv[2]
    pos2_lat = sys.argv[3]
    pos2_lng = sys.argv[4]
    route_mode = sys.argv[5]
    route_time = sys.argv[6]
    route_optimization = sys.argv[7]
    
    source = str(pos1_lat) + "," + str(pos1_lng)
    destination = str(pos2_lat) + "," + str(pos2_lng)

    if route_mode == "ANYTHING":
        
        [driving_time,driving_length,driving_cost,driving_money,route_1] = calc_Dijkstra_Route("DRIVING",route_optimization,source,destination)
        [walking_time,walking_length,walking_cost,walking_money,route_2] = calc_Dijkstra_Route("WALKING",route_optimization,source,destination)
        [transit_time,transit_length,transit_cost,transit_money,route_3] = calc_Dijkstra_Route("TRANSIT",route_optimization,source,destination)
        [bicycling_time,bicycling_length,bicycling_cost,bicycling_money,route_4] = calc_Dijkstra_Route("BICYCLING",route_optimization,source,destination)


        result = ""
        if route_optimization == "money":
            best_money = min(driving_money,walking_money,transit_money,bicycling_money)
            
            if best_money == driving_money:
                dijkstra_points = extract_data(route_1)
                result = "way,ANYTHING.DRIVING;"+dijkstra_points + ";data,total_cost."+str(driving_cost)+";data,money."+str(driving_money)+";data,time."+str(driving_time)+";data,length."+str(driving_length)
                print result
            elif best_money == walking_money:
                dijkstra_points = extract_data(route_2)
                result = "way,ANYTHING.WALKING;"+dijkstra_points + ";data,total_cost."+str(walking_cost)+";data,money."+str(walking_money)+";data,time."+str(walking_time)+";data,length."+str(walking_length)
                print result
            elif best_money == transit_money:
                dijkstra_points = extract_data(route_3)
                result = "way,ANYTHING.TRANSIT;"+dijkstra_points + ";data,total_cost."+str(transit_cost)+";data,money."+str(transit_money)+";data,time."+str(transit_time)+";data,length."+str(transit_length)
                print result
            elif best_money == bicycling_money:
                dijkstra_points = extract_data(route_4)
                result = "way,ANYTHING.BICYCLING;"+dijkstra_points + ";data,total_cost."+str(bicycling_cost)+";data,money."+str(bicycling_money)+";data,time."+str(bicycling_time)+";data,length."+str(bicycling_length)
                print result
        elif route_optimization == "co2":
            best_cost = min(driving_cost,walking_cost,transit_cost,bicycling_cost)
            if best_cost == driving_cost:
                dijkstra_points = extract_data(route_1)
                result = "way,ANYTHING.DRIVING;"+dijkstra_points + ";data,total_cost."+str(driving_cost)+";data,money."+str(driving_money)+";data,time."+str(driving_time)+";data,length."+str(driving_length)
                print result
            elif best_cost == walking_cost:
                dijkstra_points = extract_data(route_2)
                result = "way,ANYTHING.WALKING;"+dijkstra_points + ";data,total_cost."+str(walking_cost)+";data,money."+str(walking_money)+";data,time."+str(walking_time)+";data,length."+str(walking_length)
                print result
            elif best_cost == transit_cost:
                dijkstra_points = extract_data(route_3)
                result = "way,ANYTHING.TRANSIT;"+dijkstra_points + ";data,total_cost."+str(transit_cost)+";data,money."+str(transit_money)+";data,time."+str(transit_time)+";data,length."+str(transit_length)
                print result
            elif best_cost == bicycling_cost:
                dijkstra_points = extract_data(route_4)
                result = "way,ANYTHING.BICYCLING;"+dijkstra_points + ";total_cost."+str(bicycling_cost)+";data,money."+str(bicycling_money)+";data,time."+str(bicycling_time)+";data,length."+str(bicycling_length)
                print result
        elif route_optimization == "speed" or route_optimization == "number_of_tr":
            
            best_time = min(driving_time,walking_time,transit_time,bicycling_time)
            if best_time == driving_time or best_time == transit_time:
                dijkstra_points = extract_data(route_1)
                result = "way,ANYTHING.DRIVING;"+dijkstra_points + ";data,total_cost."+str(driving_cost)+";data,money."+str(driving_money)+";data,time."+str(driving_time)+";data,length."+str(driving_length)
                print result
            elif best_time == walking_time:
                dijkstra_points = extract_data(route_2)
                result = "way,ANYTHING.WALKING;"+dijkstra_points + ";data,total_cost."+str(walking_cost)+";data,money."+str(walking_money)+";data,time."+str(walking_time)+";data,length."+str(walking_length)
                print result
            # elif best_time == transit_time:
            #     dijkstra_points = extract_data(route_3)
            #     result = "way,ANYTHING.TRANSIT;"+dijkstra_points + ";data,total_cost."+str(transit_cost)+";data,money."+str(transit_money)+";data,time."+str(transit_time)+";data,length."+str(transit_length)
            #     print result
            elif best_time == bicycling_time:
                dijkstra_points = extract_data(route_4)
                result = "way,ANYTHING.BICYCLING;"+dijkstra_points + ";data,total_cost."+str(bicycling_cost)+";data,money."+str(bicycling_money)+";data,time."+str(bicycling_time)+";data,length."+str(bicycling_length)
                print result
    else:

        if route_mode == "TRANSIT":
            [route_total_time,route_total_length,route_total_cost,route_total_money,route] = calc_Dijkstra_Route(route_mode,route_optimization,source,destination)
            dijkstra_points = extract_data(route)
            result = "way,TRANSIT;"+dijkstra_points + ";" + "time."+str(route_total_time)+",length."+str(route_total_length)
        else:
            [route_total_time,route_total_length,route_total_cost,route_total_money,route] = calc_Dijkstra_Route(route_mode,route_optimization,source,destination)
            dijkstra_points = extract_data(route)
            result = "way,OTHER;"+dijkstra_points + ";" + "time."+str(route_total_time)+",length."+str(route_total_length)
       
        print result