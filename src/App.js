import React from "react";
import "./App.css";
import Table from "./Table";
import Typography from "@material-ui/core/Typography";

function App() {
  return (
    <div style={{ padding: "24px 32px 0 32px" }}>
      <Typography variant="h4" style={{ padding: "0 0 8px" }}>
        Prospection
      </Typography>
      <Table />
    </div>
  );
}

export default App;
