#this script will get the ray data from the rayscan.csv file
#//the csv frile is in ./data/rayscan.csv
import csv
import json
import requests
import time
import os

radius_used = 250
startdate = "2015-01-01"
enddate = "2020-12-14"
min_depth = 3 # TODO figure out with metadata of api call what all the different depth values are
max_depth = 3

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
    geom = "POINT(" + str(lon) + " " + str(lat) + ")"
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
'''
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
'''
'''
#foreach ray in all_rayscan_data get the depth data    
all_depth_data = []
for ray in all_rayscan_data:
    #get the lat and lon
    lat = float(ray['lat'])
    lon = float(ray['lon'])
    #get the depth data
    depth_data = getDepthData(lat, lon)
    all_depth_data.append({
        "name": ray['label'],
        "rayscan_id": ray['rayscan_id'],
        "lat": lat,
        "lon": lon,
        "depth": depth_data.json()
    })
    time.sleep(3)

#write the json data of the all_depth_data to a file in ..data/output/all_depth_data.json
with open(os.path.join(os.path.dirname(__file__), '../data/output/all_depth_data.json'), 'w') as outfile:
    json.dump(all_depth_data, outfile)
'''

#https://erddap.emodnet-physics.eu/erddap/griddap/INSITU_GLO_TS_OA_REP_OBSERVATIONS_013_002_b_TEMP.json?TEMP_PCTVAR%5B(1990-01-15T00:00:00.000Z):1:(2020-12-15T00:00:00.000Z)%5D%5B(1040):1:(1260)%5D%5B(56.86113551250406):1:(58.737384055147714)%5D%5B(0.9140157739689023):1:(2.452539578936701)%5D%2CTEMP_ERR%5B(1990-01-15T00:00:00.000Z):1:(2020-12-15T00:00:00.000Z)%5D%5B(1040):1:(1260)%5D%5B(56.86113551250406):1:(58.737384055147714)%5D%5B(0.9140157739689023):1:(2.452539578936701)%5D%2CTEMP%5B(1990-01-15T00:00:00.000Z):1:(2020-12-15T00:00:00.000Z)%5D%5B(1040):1:(1260)%5D%5B(56.86113551250406):1:(58.737384055147714)%5D%5B(0.9140157739689023):1:(2.452539578936701)%5D
#1040 is min depth => 1260 is max depth

def getTempTemporalGeoloaction(startdate,enddate,latitude,longitude,min_depth,max_depth):
    #get the data from the erddap server
    url = "https://erddap.emodnet-physics.eu/erddap/griddap/INSITU_GLO_TS_OA_REP_OBSERVATIONS_013_002_b_TEMP.json?TEMP_PCTVAR%5B(" + startdate + "T00:00:00.000Z):1:(" + enddate + "T00:00:00.000Z)%5D%5B(" + str(min_depth) + "):1:(" + str(max_depth) + ")%5D%5B(" + str(latitude) + "):1:(" + str(latitude) + ")%5D%5B(" + str(longitude) + "):1:(" + str(longitude) + ")%5D%2CTEMP_ERR%5B(" + startdate + "T00:00:00.000Z):1:(" + enddate + "T00:00:00.000Z)%5D%5B(" + str(min_depth) + "):1:(" + str(max_depth) + ")%5D%5B(" + str(latitude) + "):1:(" + str(latitude) + ")%5D%5B(" + str(longitude) + "):1:(" + str(longitude) + ")%5D%2CTEMP%5B(" + startdate + "T00:00:00.000Z):1:(" + enddate + "T00:00:00.000Z)%5D%5B(" + str(min_depth) + "):1:(" + str(max_depth) + ")%5D%5B(" + str(latitude) + "):1:(" + str(latitude) + ")%5D%5B(" + str(longitude) + "):1:(" + str(longitude) + ")%5D"
    print(url)
    temp_data = requests.get(url)
    print(temp_data)
    return temp_data

all_temp_data = []
for ray in all_rayscan_data:
    #read in the all_temp_data.json
    with open(os.path.join(os.path.dirname(__file__), '../data/output/all_temp_data.json'), 'r') as outfile:
        all_current_temp_data = json.load(outfile)
    #get the lat and lon
    lat = float(ray['lat'])
    lon = float(ray['lon'])
    #get the temp data 
    temp_data = getTempTemporalGeoloaction(startdate, enddate, lat, lon, min_depth, max_depth)
    all_current_temp_data.append({
        "name": ray['label'],
        "rayscan_id": ray['rayscan_id'],
        "lat": lat,
        "lon": lon,
        "depth": temp_data.json()
    })
    #print a statement when 10% of the data is collected
    x = 10
    if len(all_temp_data) % 10 == 0:
        print(str(x) + "% of the data is collected")
        x += 10
    
    time.sleep(3)

    #save the data to a json file
    with open(os.path.join(os.path.dirname(__file__), '../data/output/all_temp_data.json'), 'w') as outfile:
        json.dump(all_current_temp_data, outfile)

#https://emodnet.ec.europa.eu/geoviewer/proxy//https://drive.emodnet-geology.eu/geoserver/wms?service=wfs&request=GetFeature&version=2.0.0&outputFormat=shape-zip&typeName=gtk%3Aseabed_substrate_1m%2Cgtk%3Aseabed_substrate_250k%2Cgtk%3Aseabed_substrate_100k%2Cgtk%3Aseabed_substrate_70k_multiscale%2Cgtk%3Aseabed_substrate_60k_multiscale%2Cgtk%3Aseabed_substrate_50k_multiscale%2Cgtk%3Aseabed_substrate_45k_multiscale%2Cgtk%3Aseabed_substrate_30k_multiscale%2Cgtk%3Aseabed_substrate_25k_multiscale%2Cgtk%3Aseabed_substrate_20k_multiscale%2Cgtk%3Aseabed_substrate_15k_multiscale%2Cgtk%3Aseabed_substrate_10k_multiscale%2Cgtk%3Aseabed_substrate_5k_multiscale%2Cgtk%3Aseabed_substrate_1k5_multiscale&cql_filter=1%3D1+AND+BBOX%28geom%2C54.5721122904788%2C3.0154141417297957%2C54.984886969860405%2C3.052939112582667%2C%27urn%3Aogc%3Adef%3Acrs%3AEPSG%3A%3A4326%27%29&srsname=EPSG%3A4326