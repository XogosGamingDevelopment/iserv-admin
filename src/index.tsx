import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Provider } from "react-redux";
import App from "./App";
import { Toaster } from "react-hot-toast";
import { store } from "./redux/store";
import "./style.css";

// Google sign-in client: Amplify env var REACT_APP_GOOGLE_CLIENT_ID (the iServ Google Cloud project), else the original client.
const GOOGLE_CLIENT_ID = (process.env.REACT_APP_GOOGLE_CLIENT_ID || "").trim() || "313663891598-4bkv5u1re3f0p92190k8n2shpatbkcat.apps.googleusercontent.com";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <React.StrictMode>
      <Toaster position="top-right" reverseOrder={false} />
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
