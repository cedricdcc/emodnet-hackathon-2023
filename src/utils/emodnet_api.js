//this file will contain all the functions and api calls to the emodnet api
import axios from 'axios';
//get depth data from rest.emodnet eg https://rest.emodnet-bathymetry.eu/depth_sample?geom=POINT(3.3233642578125%2055.01953125)
export const getDepthData = async (lat, lon) => {
    const url = `https://rest.emodnet-bathymetry.eu/depth_sample?geom=POINT(${lon}%20${lat})`;
    const response = await axios.get(url);
    return response.data;
};