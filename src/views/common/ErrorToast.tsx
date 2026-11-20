import { useEffect, useState } from "react";
import toast, { Toast } from "react-hot-toast";

type ErrorToastProps = {
  t: Toast;
  message: string;
  status: number;
};

/* Dark toast with a coral dot (styles: .is-toast in theme.css). */
const ErrorToast: React.FC<ErrorToastProps> = ({ t, message, status }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div
      role="alert"
      className={`toast-box is-toast is-toast-err ${animate ? "show" : ""} ${!t.visible ? "hide" : ""}`}
    >
      <span className="is-toast-dot" aria-hidden="true"></span>
      <span className="is-toast-msg">
        {message}
        {status ? <span className="d-block fs-8 fw-semibold opacity-50">Error {status}</span> : null}
      </span>
      <button type="button" className="is-toast-close" aria-label="Dismiss" onClick={() => toast.dismiss(t.id)}>
        ✕
      </button>
    </div>
  );
};

export default ErrorToast;
