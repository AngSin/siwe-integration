import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import UsersTable from "./components/UsersTable";
import Profile from "./components/Profile";
import { WalletContextProvider } from "./context/WalletContext";
import {Page} from "./components/Page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Page />,
    children: [
      {
        path: "/",
        element: <UsersTable />
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ]
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <WalletContextProvider>
    <RouterProvider router={router} />
  </WalletContextProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
