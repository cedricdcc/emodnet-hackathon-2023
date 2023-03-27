# this file will be for testing a bas_uri api

import requests
import json
import time

base_uri = "https://ilvo.max-ics.lu/rayscan-api/observations"
api_key =  "pn89)3sep7d3"
#get the list of all observations
all_observations = requests.get(base_uri, headers={'X-Api-Key': api_key})
#pretty print the json
json_response = json.loads(all_observations.text)
print(json.dumps(json_response, indent=4, sort_keys=True) )

#get depth data from rest.emodnet eg https://rest.emodnet-bathymetry.eu/depth_sample?geom=POINT(3.3233642578125%2055.01953125)
def get_depth_data(lat, lon):
    base_uri = "https://rest.emodnet-bathymetry.eu/depth_sample"
    geom = "POINT(" + str(lon) + "%20" + str(lat) + ")"
    depth_data = requests.get(base_uri, params={'geom': geom})
    return depth_data
#example
print(get_depth_data(55.01953125, 3.3233642578125).text)