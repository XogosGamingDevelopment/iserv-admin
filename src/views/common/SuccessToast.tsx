import { useEffect, useState } from "react";
import toast, { Toast } from "react-hot-toast";

type SuccessToastProps = {
  t: Toast;
  message: string;
};

const SuccessToast: React.FC<SuccessToastProps> = ({ t, message }) => {
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
          "linear-gradient(90deg, rgba(36,0,2,0.232) 0%, rgba(85,152,53,0.336) 0%, rgba(253,254,255,1) 100%)",
        color: "#333",
        borderLeft: "4px solid green",
        width: "300px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      <span style={{ fontWeight: "bold" }}>Success: {message}</span>
      <button
        onClick={() => toast.dismiss(t.id)}
        style={{
          // background: "red",
          background: "grey",
          color: "white",
          border: "none",
          padding: "5px 8px",
          cursor: "pointer",
          borderRadius: "50%",
          fontWeight: "bold",
        }}
      >
        ✖
      </button>
    </div>
  );
};

export default SuccessToast;
