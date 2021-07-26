import React from "react";
import { useTable, useFlexLayout } from "react-table";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useVirtual } from "react-virtual";

const data = new Array(10000).fill(true).map((elt, index) => ({
  index,
  firstName: "jane" + index,
  lastName: "doe" + index,
  age: 25 + Math.round(Math.random() * 100)
}));

const columns = [
  {
    Header: "Index",
    accessor: "index"
  },
  {
    Header: "First Name",
    accessor: "firstName"
  },
  {
    Header: "Last Name",
    accessor: "lastName"
  },
  {
    Header: "Age",
    accessor: "age"
  }
];

const Table = ({ columns, data }) => {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data
    },
    useFlexLayout
  );

  const parentRef = React.useRef();
  const rowVirtualizer = useVirtual({
    size: data.length,
    parentRef,
    estimateSize: React.useCallback(() => 35, [])
  });

  return (
    <MaUTable {...getTableProps()}>
      <TableHead>
        {headerGroups.map(headerGroup => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <TableCell {...column.getHeaderProps()}>
                {column.render("Header")}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <div
        ref={parentRef}
        style={{
          display: "block",
          height: "200px",
          overflow: "auto",
          width: `100%`
        }}
      >
        {/*rows.map((row, i) => {
          console.log("prepare row");
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })*/}
        <TableBody
          className="ListInner"
          style={{
            display: "block",
            height: `${rowVirtualizer.totalSize}px`,
            position: "relative"
          }}
        >
          {rowVirtualizer.virtualItems.map(virtualRow => {
            const row = rows[virtualRow.index];
            prepareRow(row);
            return (
              <TableRow
                key={virtualRow.index}
                ref={virtualRow.measureRef}
                {...row.getRowProps({
                  style: {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`
                  }
                })}
              >
                {row.cells.map(cell => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </div>
    </MaUTable>
  );
};

export default function App() {
  return (
    <div className="App">
      <Table columns={columns} data={data} />
    </div>
  );
}
