//this component is used to display data from a csv file in a table 
import React, { useEffect, useState } from "react";
import TableFile from "./table";

const CsvFile = (props) => {
    console.log(props);
    //get the data from the csv file from url
    const [csvData, setCsvData] = useState({});
    const [csvRows, setCsvRows] = useState([]);
    const [csvColumns, setCsvColumns] = useState([]);
    //function to convert the csv data to an array
    const csvToArray = (strData, strDelimiter) => {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r \n]*))"
            ),
            "gi"
        );
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            var strMatchedValue;
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter !== strDelimiter)
            ) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );
            } else {
                // We found a non-quoted value.
                strMatchedValue = arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.
        return (arrData);
    }

    //function here that will convert the csv array of arrays into a array of objects
    const csvArrayToObj = (csvArray) => {
        let objArray = [];
        for (let i = 1; i < csvArray.length; i++) {
            objArray[i - 1] = {};
            for (let k = 0; k < csvArray[0].length && k < csvArray[i].length; k++) {
                let key = csvArray[0][k];
                objArray[i - 1][key] = csvArray[i][k]
            }
        }
        return objArray;
    }

    useEffect(() => {
        //process the data passed down from the props
        let unprocesseddata = csvToArray(props.data);
                console.log(unprocesseddata);
                let arrayofobjectsdata = csvArrayToObj(unprocesseddata);
                let columnsdata = [];
                let columnnames = unprocesseddata[0];
                for (let i = 0; i < columnnames.length; i++) {
                    columnsdata.push({
                        Header: columnnames[i],
                        accessor: columnnames[i]
                    });
                }
                setCsvRows(arrayofobjectsdata);
                setCsvColumns(columnsdata);
                setCsvData(unprocesseddata);
    }, []);

    return (
        //if csvData is an empty object, then display loading
        //else display the table
        csvData.length === 0 ? <div className="container">Loading...</div> :
            <div className="container" style={{maxWidth:"100%",overflowX:"auto","border": "#6372ff50 1px solid","background":"#6372ff50","borderRadius":"4px"}}>
                <TableFile data={csvRows} columns={csvColumns} filename={props.data.name} />
            </div>
    );
};

export default CsvFile;