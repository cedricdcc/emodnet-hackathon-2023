//this component will show a table of the data

export default function CSVTable({ data }) {
    //the data is an array of object with the keys being the column names
    console.log(data)
    return (
        <div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        {Object.keys(data[0]).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            {Object.keys(row).map((key) => (
                                <td key={key}>{row[key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};