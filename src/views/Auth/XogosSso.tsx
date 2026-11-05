// Lands an admin who signed in through Xogos. iservapp.org/auth sends admins here with a one-time code in the
// URL fragment (#code=...); we trade it for an admin session (POST xogos/admin-handoff) and open the dashboard.
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { setUser } from "../../redux/userSlice";
import useAxios from "../../hooks/useAxios";

const XogosSso: React.FC = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // React strict mode runs effects twice; the code works only once
    started.current = true;
    const code = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("code");
    window.history.replaceState(null, "", window.location.pathname); // drop the code from the address bar
    if (!code) { setError("This sign-in link is missing its code. Please sign in again from Xogos."); return; }
    (async () => {
      try {
        const response: any = await axiosInstance({ url: "xogos/admin-handoff", method: "POST", data: { code } });
        if (response.error || !response.data?.authToken) throw new Error(response.message || "Sign-in failed");
        localStorage.setItem("token", response.data.authToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        dispatch(setUser(response.data.user));
        navigate("/dashboard", { replace: true });
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Sign-in failed. Please try again from Xogos.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="d-flex flex-column flex-center min-vh-100 p-10">
      <div className="bg-body rounded-4 p-15 text-center" style={{ maxWidth: 520 }}>
        <img alt="iServ" src="/mascot-logo.png" className="mb-8" style={{ height: 64 }} />
        {error ? (
          <>
            <h2 className="fw-bolder mb-4">Couldn't sign you in</h2>
            <p className="text-gray-600 fs-6 mb-8">{error}</p>
            <Link to="/login" className="btn btn-primary">Sign in with email</Link>
          </>
        ) : (
          <>
            <h2 className="fw-bolder mb-4">Signing you in through Xogos…</h2>
            <span className="spinner-border text-primary" role="status" />
          </>
        )}
      </div>
    </div>
  );
};

export default XogosSso;
