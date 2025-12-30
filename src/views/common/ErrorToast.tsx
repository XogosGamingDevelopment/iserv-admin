import { useEffect, useState } from "react";
import toast, { Toast } from "react-hot-toast";

type ErrorToastProps = {
  t: Toast;
  message: string;
  status: number;
};

const ErrorToast: React.FC<ErrorToastProps> = ({ t, message, status }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div
      className={`toast-box ${animate ? "show" : ""} ${
        !t.visible ? "hide" : ""
      }`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        padding: "12px",
        borderRadius: "5px",
        background:
          "linear-gradient(90deg, rgba(36,0,2,0.2329) 0%, rgba(217,31,31,0.3366) 0%, rgba(253,254,255,1) 100%)",
        color: "#333",
        borderLeft: "4px solid red",
        width: "300px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <span style={{ fontWeight: "bold" }}>
        Error {status}: {message}
      </span>
      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          background: "red",
          color: "white",
          border: "none",
          padding: "5px 8px",
          cursor: "pointer",
          borderRadius: "50%",
          fontWeight: "bold",
        }}
      >
        Xs
      </button>
    </div>
  );
};

export default ErrorToast;
