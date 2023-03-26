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