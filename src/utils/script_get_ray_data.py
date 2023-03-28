#this script will get the ray data from the rayscan.csv file
#//the csv frile is in ./data/rayscan.csv

import csv
import json
import requests
import time
import os

radius_used = 250

#load in the csv file that is located in ../data/rayscan.csv relative to this script
csv_file =  os.path.join(os.path.dirname(__file__), '../data/rayscan.csv')
species_aphiaid = [
    { "name": 'stekel_rog', "aphiaid": 105883 },
    { "name": 'blonde_rog', "aphiaid": 367297 },
    { "name": 'gevlekte_rog', "aphiaid": 105887 },
    { "name": 'golf_rog', "aphiaid": 105891 },
    { "name": 'kleinoog_rog', "aphiaid": 105885 },
    { "name": 'grootoog_rog', "aphiaid": 105876 }
]

def getDepthData(lat, lon):
    base_uri = "https://rest.emodnet-bathymetry.eu/depth_sample"
    geom = "POINT(" + str(lon) + "%20" + str(lat) + ")"
    depth_data = requests.get(base_uri, params={'geom': geom})
    return depth_data

def getSpeciesOccurences(lat, lon, aphiaid, radius):
    base_uri = "https://emodnet.ec.europa.eu/geoviewer/proxy//https://geo.vliz.be/geoserver/wfs"
    
    #connvert radius from km to degrees
    radius = radius / 111.12
    
    #example url = https://emodnet.ec.europa.eu/geoviewer/proxy//https://geo.vliz.be/geoserver/wfs?service=wfs&request=GetFeature&version=2.0.0&outputFormat=json&typeName=Dataportal:eurobis-obisenv&viewParams=aphiaid:125732;&bbox=55.66993434474112,4.982857423997643,56.34108674739758,5.512717086077309,urn:ogc:def:crs:EPSG::4326&srsname=EPSG:4326
    params = {
        "service": "wfs",
        "request": "GetFeature",
        "version": "2.0.0",
        "outputFormat": "json",
        "typeName": "Dataportal:eurobis-obisenv",
        "viewParams": "aphiaid:" + str(aphiaid) + ";",
        "bbox": str(lat - radius) + "," + str(lon - radius) + "," + str(lat + radius) + "," + str(lon + radius) + ",urn:ogc:def:crs:EPSG::4326",
        "srsname": "EPSG:4326"
    }
    occurence_data = requests.get(base_uri, params=params)
    return occurence_data

#open the csv file
def getRayData():
    alldata = []
    with open(csv_file, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            #take the first row as headers and then loop through the rest of the rows append to the alldata array
            print(row)
            alldata.append(row)
    return alldata
            
all_rayscan_data = getRayData()


speciesbbox = []
#get bbox for each species of ray
for ray in species_aphiaid:
    #get the species name
    name_ray = ray['name']
    min_lat = 1000
    min_lon = 1000
    max_lat = -1000
    max_lon = -1000
    
    for row in all_rayscan_data:
        if row['label'] == name_ray:
            #get the lat and lon
            lat = float(row['lat'])
            lon = float(row['lon'])
            #get the min and max lat and lon
            if lat < min_lat:
                min_lat = lat
            if lat > max_lat:
                max_lat = lat
            if lon < min_lon:
                min_lon = lon
            if lon > max_lon:
                max_lon = lon
    speciesbbox.append({
        "name": name_ray,
        "min_lat": min_lat,
        "min_lon": min_lon,
        "max_lat": max_lat,
        "max_lon": max_lon,
        "aphiaid": ray['aphiaid']
    })

for ray in speciesbbox:
    print(ray)
    #get deph data and occurence data
    #calculate the center of the bbox
    center_bbox_lat = (ray['min_lat'] + ray['max_lat']) / 2
    center_bbox_lon = (ray['min_lon'] + ray['max_lon']) / 2
    
    print(center_bbox_lat)
    print(center_bbox_lon)
    depth_data = getDepthData(center_bbox_lat, center_bbox_lon)
    occurence_data = getSpeciesOccurences(ray['min_lat'], ray['max_lon'], ray['aphiaid'], radius_used)
    print(depth_data)
    print(occurence_data)
    
    #write the json data of the occurence_data to a file in ..data/output/{speciesname}_{min_lat}_{min_lon}.json
    with open(os.path.join(os.path.dirname(__file__), '../data/output/' + ray['name'] + '_' + str(ray['min_lat']) + '_' + str(ray['min_lon']) + '_' + str(ray['max_lat']) + '_' + str(ray['max_lon']) + '_' + str(radius_used) + '_km_radius.json'), 'w') as outfile:
        json.dump(occurence_data.json(), outfile)
    
    time.sleep(3)            