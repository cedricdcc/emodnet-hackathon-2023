//page that will be for uploading the data and processing it

import React, { useState } from "react";
import Navigation from "../components/navbar";
import ReactFileReader from "react-file-reader";
import { convertData } from "../utils/handle-upload";
import CSVTable from "../components/csvtable";
import $ from "jquery";

export default function Upload() {

    const [data, setData] = useState("");
    console.log(data);
    const handleFiles = (files) => {
        let reader = new FileReader();
        reader.onload = function (e) {
            // Use reader.result
            //console.log(reader.result);
            setData(convertData(reader.result));
            //when the data is uploaded, the class of the upload button will change to show that the data is uploaded
            $(".upload").addClass("upload-success");
            //change text to show that the data is uploaded
            $(".upload").text("Data uploaded");

        }
        setData(reader.readAsText(files[0]));
    }

    return (
        <div className="container">
            <Navigation />
            <h1>Upload</h1>
            <ReactFileReader handleFiles={handleFiles} fileTypes={'.csv'}>
                <button className='upload'>Upload</button>
            </ReactFileReader>
            <h3>Uploaded data</h3>
            {data && <CSVTable data={data} />}
        </div>
    );
};