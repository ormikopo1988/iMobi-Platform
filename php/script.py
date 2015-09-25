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
 
 
inf = float('inf')
Edge = namedtuple('Edge', 'start, end, cost')


file_location_1 = "bus_routes_hours/bus_1_daily.xlsx"
workbook = xlrd.open_workbook(file_location_1)

sheet = workbook.sheet_by_index(0)

item = [22.940166,39.364523]

for col in range(sheet.ncols):
		if sheet.cell_value(0,col) == item[0] and sheet.cell_value(1,col) == item[1]:
			item_to_search_col = col
			print item_to_search_col
			for row in range(2,sheet.nrows):
				print sheet.cell_value(row,item_to_search_col)




   