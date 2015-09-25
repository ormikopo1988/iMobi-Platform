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
from random import randint
from geopy.distance import vincenty


from collections import namedtuple
from pprint import pprint as pp
 
file_location_1 = "bus_network_bus_stops_2.xlsx"
workbook = xlrd.open_workbook(file_location_1)
sheet = workbook.sheet_by_index(0)

file_location_2 = "bus_network_all_nodes_2.xlsx"
workbook_2 = xlrd.open_workbook(file_location_2)
sheet_2_bus = workbook_2.sheet_by_index(0)

file_location_3 = "bus_network_bus_stops.xlsx"
workbook_3 = xlrd.open_workbook(file_location_3)
sheet_3 = workbook_3.sheet_by_index(0)

connection = MySQLdb.connect(host="localhost",user="root",passwd="",db="i-mobi")
connection.set_character_set('utf8')
x = connection.cursor()


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
		#print results[0][0]
		#print "true"
		return True     # break and return
	else:
		#print "false"
		return False    # break and return


 


for row in range(1,sheet_3.nrows):
	x.execute("""INSERT INTO all_bus_stops (name,bus_route,stop_code,direction,lat,lng) VALUES (%s,%s,%s,%s,%s,%s)""",[sheet_3.cell_value(row, 1),sheet_3.cell_value(row, 2),sheet_3.cell_value(row, 3),sheet_3.cell_value(row, 4),sheet_3.cell_value(row, 6),sheet_3.cell_value(row, 5)])
	# point_lat = sheet_2_bus.cell_value(row, 4)
	# point_lng = sheet_2_bus.cell_value(row, 3)
	# nearest_point1 = (point_lat, point_lng)
	# print point_is_bus_stop(nearest_point1)

	# point_lat = sheet_2_bus.cell_value(row, 6)
	# point_lng = sheet_2_bus.cell_value(row, 5)
	# nearest_point2 = (point_lat, point_lng)

	# print point_is_bus_stop(nearest_point2)
	connection.commit()



   