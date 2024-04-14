import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import { Button } from "@mui/material";
import { CloudDownload } from "@mui/icons-material";
import "../../Style/Dash.css";
import { Alert } from "@mui/material";
import { Close } from "@mui/icons-material";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { CSVLink } from "react-csv";

import { useState } from "react";

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
  return { id, date, name, shipTo, paymentMethod, amount };
}

function preventDefault(event) {
  event.preventDefault();
}

export default function SLTable(props) {
  return (
    <React.Fragment>
      <Title>Login Status</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>SL.NO</TableCell>
            <TableCell>Username</TableCell>
            <TableCell align="right">Date & Time of Login</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {props.data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {props.data.length == 0 ? (
        <div
          style={{ display: "flex", justifyContent: "center", margin: "25px" }}
        >
          <Alert severity="info" style={{ width: "50%" }}>
            No Data to display
          </Alert>
        </div>
      ) : (
        <>{console.log(props.data.length)}</>
      )}
      <CSVLink
        data={props.data}
        filename={"download.csv"}
        className="btn btn-primary"
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px",
          textDecoration: "none",
        }}
      >
        <div style={{ display: "flex" }}>
          <CloudDownload
            style={{
              marginRight: "20px",
              marginTop: "15px",
              color: "lightblue",
            }}
          />
          <p style={{ color: "lightblue", textDecoration: "none" }}>
            {" "}
            DOWNLOAD FULL LIST
          </p>
        </div>
      </CSVLink>
    </React.Fragment>
  );
}
