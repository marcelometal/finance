import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import moment from "moment";

import FiveYears from "./FiveYears";

const REFRESH_INTERVAL = 1000 * 60;
const API_URL = "http://localhost:8080";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
};

// FIXME
const headCells = [
  { id: "symbol", numeric: false, label: "Symbol" },
  { id: "name", numeric: false, label: "Name" },
  { id: "change", numeric: true, label: "Change %" },
  { id: "lastPrice", numeric: true, label: "Last Price" },
  { id: "closingPrice", numeric: true, label: "Closing Price" },
  { id: "lastYearLow", numeric: true, label: "52w low" },
  { id: "lastYearHigh", numeric: true, label: "52w high" },
  { id: "eps", numeric: true, label: "EPS" },
  { id: "lastThreeMonths", numeric: false, label: "Last 3 Months" },
  { id: "lastYear", numeric: false, label: "Last Year" },
  { id: "lastFiveYears", numeric: false, label: "Last 5 Year" }
];

const EnhancedTableHead = props => {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  container: {
    maxHeight: 680
  }
}));

const NumberRow = ({ children }) => {
  const color = parseFloat(children, 10) > 0 ? "green" : "red";
  return <span style={{ color: color, fontWeight: 700 }}>{children}</span>;
};

const EnhancedTable = () => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("change");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [rows, setData] = useState({ data: [] });

  const fetchData = async () => {
    const result = await axios(API_URL);
    setData(result);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Updating...");
      fetchData();
    }, REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fiveYearsData = data => {
    let closePrice = [];
    for (var i = 0, len = data.length; i < len; i++) {
      const date = moment(data[i][0].Date, "DD/MM/YYYY HH:mm:ss").valueOf();
      const close = data[i][4].Close;
      closePrice.push({ t: date, y: close });
    }
    return closePrice;
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.data.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
            aria-label="sticky table"
            className={classes.table}
            size="small"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.data.length}
            />
            <TableBody>
              {stableSort(rows.data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.symbol}
                      style={
                        index % 2
                          ? { backgroundColor: "rgba(242,242,242,0.5)" }
                          : { backgroundColor: "" }
                      }
                    >
                      <TableCell>
                        <span style={{ fontWeight: 700 }}>{row.symbol}</span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: "gray", fontSize: 12 }}>
                          {row.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <NumberRow>{row.change}</NumberRow>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: "orange", fontWeight: 700 }}>
                          {row.lastPrice}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: "blue", fontWeight: 700 }}>
                          {row.closingPrice}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: "gray", fontWeight: 700 }}>
                          {row.lastYearLow}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: "gray", fontWeight: 700 }}>
                          {row.lastYearHigh}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: "gray", fontWeight: 700 }}>
                          {row.eps}
                        </span>
                      </TableCell>
                      <TableCell>
                        <FiveYears
                          data={fiveYearsData(row.lastFiveYearsData)}
                        />
                      </TableCell>
                      <TableCell>
                        <FiveYears
                          data={fiveYearsData(row.lastFiveYearsData)}
                        />
                      </TableCell>
                      <TableCell>
                        <FiveYears
                          data={fiveYearsData(row.lastFiveYearsData)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 30, 50]}
          component="div"
          count={rows.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default EnhancedTable;
