import React from "react";
import { Route, Routes } from "react-router-dom";
import CustomPaginationActionsTable from "./Conta/Conta";
export default function MainRoutes() {
  return (
    <Routes>
      <Route
        path="/conta/:numConta"
        element={<CustomPaginationActionsTable />}
      />
    </Routes>
  );
}
