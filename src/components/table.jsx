//this component will render a table with the data from the csv file

import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination, useFilters, useSortBy } from "react-table";
import { CSVLink } from "react-csv";
//import "react-resizable/css/styles.css";

const TableFile = (props) => {
  console.log(props);

  //define auseState const for the csv data
  const [filteredRows, setFilteredRows] = useState([]);
  const [csvData, setCsvData] = useState([]);
  console.log(filteredRows);

  useEffect(() => {
    //function that will remake the csv data by taking parts out of the filtered rows
    const makeCsvData = () => {
      const csvData = [];
      //the first row of the csv file is the column names
      csvData.push(props.columns.map((column) => column.Header));
      //the rest of the rows are the data
      for (let i = 0; i < filteredRows.length; i++) {
        let rowdata = [];
        //for each column in the row, get the value
        for (let j = 0; j < props.columns.length; j++) {
          rowdata.push(filteredRows[i].values[props.columns[j].Header]);
        }
        csvData.push(rowdata);
      }
      console.log(csvData);

      return csvData;
    };
    setCsvData(makeCsvData());
  }, [filteredRows]);

  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length;
    console.log(count);
    setFilteredRows(preFilteredRows);

    return (
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
          //get all the rows that match the filter
        }}
        placeholder={`Search ${count} records...`}
        style={{
          padding: "0.2rem",
          margin: "10px 10px 10px 10px",
          float: "center",
        }}
      />
    );
  }

  const columns = React.useMemo(() => props.columns, [props.columns]);
  const data = React.useMemo(() => props.data, [props.data]);
  const defaultColumn = useMemo(() => {
    return {
      Filter: DefaultColumnFilter,
    };
  }, []);

  // Define the table columns and data
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // Set initial pagination state
      defaultColumn,
    },
    useFilters, // Use the useFilters Hook to add column filters
    useSortBy, // Use the useSortBy Hook to add sorting
    usePagination // Use pagination
  );

  // Extract the table instance properties and functions
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setFilter,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  // Memoize the pagination UI elements to avoid unnecessary re-renders
  const pagination = useMemo(() => {
    return (
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const pageNumber = e.target.value
                ? Number(e.target.value) - 1
                : 0;
              gotoPage(pageNumber);
            }}
            style={{ width: "50px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            tableInstance.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 25, 50, 75, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    );
  }, [
    canNextPage,
    canPreviousPage,
    gotoPage,
    pageIndex,
    pageOptions.length,
    pageSize,
    nextPage,
    previousPage,
    tableInstance,
  ]);

  // Render the table pagination UI
  return (
    <>
      <CSVLink data={csvData} filename={props.filename + ".csv"} className="btn btn-primary" style={{ "float": "left", "margin": "20px" }}>Download Current Rows</CSVLink>
      {pagination}
      <table
        {...getTableProps()}
        className="csv-table"
        style={{ marginLeft: "-1rem" }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <div
                    style={{
                      textAlign: "center",
                      float: "none",
                    }}
                  >
                    {column.render("Header")}
                  </div>
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TableFile;
