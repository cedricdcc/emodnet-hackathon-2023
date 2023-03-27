//this script will get the ray data from the rayscan.csv file
//the csv frile is in ./data/rayscan.csv
const fs = require('fs');
const axios = require('axios');
const results = [];

const species_aphiaid = [
    { name: 'stekel_rog', aphiaid: 105883 },
    { name: 'blonde_rog', aphiaid: 367297 },
    { name: 'gevlekte_rog', aphiaid: 105887 },
    { name: 'golf_rog', aphiaid: 105891 },
    { name: 'kleinoog_rog', aphiaid: 105885 },
    { name: 'grootoog_rog', aphiaid: 105876 },
]

//get depth data from rest.emodnet eg https://rest.emodnet-bathymetry.eu/depth_sample?geom=POINT(3.3233642578125%2055.01953125)
const getDepthData = async (lat, lon) => {
    const url = `https://rest.emodnet-bathymetry.eu/depth_sample?geom=POINT(${lon}%20${lat})`;
    const response = await axios.get(url);
    return response.data;
};

// https://emodnet.ec.europa.eu/geoviewer/proxy//https://geo.vliz.be/geoserver/wfs?service=wfs&request=GetFeature&version=2.0.0&outputFormat=json&typeName=Dataportal:eurobis-obisenv&viewParams=aphiaid:125732;&bbox=55.66993434474112,4.982857423997643,56.34108674739758,5.512717086077309,urn:ogc:def:crs:EPSG::4326&srsname=EPSG:4326
const getSpeciesData = async (lat, lon, aphiaid, radius) => {
    /*
    get species data from emodnet
    :param lat: latitude
    :param lon: longitude
    :param aphiaid: aphiaid of the species
    :param radius: radius of the search area in kms
    */
    //convert radius from kms to degrees
    const radiusInDegrees = radius / 111.12; //111.12 is the average distancein km between two points on the earth in degrees
    const url = `https://emodnet.ec.europa.eu/geoviewer/proxy//https://geo.vliz.be/geoserver/wfs?service=wfs&request=GetFeature&version=2.0.0&outputFormat=json&typeName=Dataportal:eurobis-obisenv&viewParams=aphiaid:${aphiaid};&bbox=${lat - radiusInDegrees},${lon - radiusInDegrees},${lat + radiusInDegrees},${lon + radiusInDegrees},urn:ogc:def:crs:EPSG::4326&srsname=EPSG:4326`;
    const response = await axios.get(url);
    return response.data;
}

fs.createReadStream('./src/data/rayscan.csv')
    .on('data', (data) => {
        const lines = data.toString().split('\n');

        //get the headers from the first line
        const headers = lines[0].split(',');
        //remove the first line
        lines.shift();

        //loop through the lines
        lines.forEach((line) => {
            const obj = {};
            const currentline = line.split(',');

            //loop through the headers and add the values to the object
            headers.forEach((header, index) => {
                obj[header] = currentline[index];
            });
            results.push(obj);
        });
    })
    .on('end', () => {
        console.log(results);
        //go over the results and get the lowest and highest lat and lon

        speciesbbox = [];

        for(let i = 0; i < species_aphiaid.length; i++) {
            let minLat = 1000;
            let maxLat = -1000;
            let minLon = 1000;
            let maxLon = -1000;

            results.forEach((result) => {
                //check if the species name == the species name in the species_aphiaid array
                if (result.label == species_aphiaid[i].name) {
                    const lat = parseFloat(result.lat);
                    const lon = parseFloat(result.lon);
                    if (lat < minLat) {
                        minLat = lat;
                    }
                    if (lat > maxLat) {
                        maxLat = lat;
                    }
                    if (lon < minLon) {
                        minLon = lon;
                    }
                    if (lon > maxLon) {
                        maxLon = lon;
                    }
                }
            });

            speciesbbox.push({
                name: species_aphiaid[i].name,
                aphiaid: species_aphiaid[i].aphiaid,
                minLat: minLat,
                maxLat: maxLat,
                minLon: minLon,
                maxLon: maxLon
            });


        }
        for(let i = 0; i < speciesbbox.length; i++) {
            //set timeout to prevent too many requests
            setTimeout(async () => {
                console.log(speciesbbox[i]);
                const depthData = await getDepthData(speciesbbox[i].minLat, speciesbbox[i].minLon);
                console.log(depthData);
                const speciesData = await getSpeciesData(speciesbbox[i].minLat, speciesbbox[i].minLon, speciesbbox[i].aphiaid, 500);
                console.log(speciesData);
            }, 2500*i);
        }
    });



// Path: src\utils\script_get_species_data.js


