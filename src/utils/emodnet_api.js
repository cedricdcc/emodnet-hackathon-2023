//this file will contain all the functions and api calls to the emodnet api
import axios from 'axios';
//get depth data from rest.emodnet eg https://rest.emodnet-bathymetry.eu/depth_sample?geom=POINT(3.3233642578125%2055.01953125)
export const getDepthData = async (lat, lon) => {
    const url = `https://rest.emodnet-bathymetry.eu/depth_sample?geom=POINT(${lon}%20${lat})`;
    const response = await axios.get(url);
    return response.data;
};

// https://emodnet.ec.europa.eu/geoviewer/proxy//https://geo.vliz.be/geoserver/wfs?service=wfs&request=GetFeature&version=2.0.0&outputFormat=json&typeName=Dataportal:eurobis-obisenv&viewParams=aphiaid:125732;&bbox=55.66993434474112,4.982857423997643,56.34108674739758,5.512717086077309,urn:ogc:def:crs:EPSG::4326&srsname=EPSG:4326
export const getSpeciesData = async (lat, lon, aphiaid, radius) => {
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