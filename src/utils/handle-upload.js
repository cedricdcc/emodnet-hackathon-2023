//this file will handle a csv file and will return the data in a json format
export const convertData = (data) => {
    const delimiter = (data) => {
        const delimiters = [',', ';', '|', '\t'];
        const delimiterCount = delimiters.map((delimiter) => {
            return data.split(delimiter).length;
        });
        const max = Math.max(...delimiterCount);
        return delimiters[delimiterCount.indexOf(max)];
    };
    //first discover what the delimiter is of the csv file, the data is a string
    const delimiter_data = delimiter(data);
    //split the data into an array of rows
    const rows = data.split('\n');
    let headers = rows[0].split(delimiter_data);
    let json = [];
    for (let i = 1; i < rows.length; i++) {
        let obj = {};
        let currentline = rows[i].split(delimiter_data);
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        json.push(obj);
    }
    return json;
}