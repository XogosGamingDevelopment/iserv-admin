import { useEffect, useState } from "react";
import toast, { Toast } from "react-hot-toast";

type SuccessToastProps = {
  t: Toast;
  message: string;
};

/* Dark toast with a teal dot (styles: .is-toast in theme.css). */
const SuccessToast: React.FC<SuccessToastProps> = ({ t, message }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div
      role="status"
      className={`toast-box is-toast is-toast-ok ${animate ? "show" : ""} ${!t.visible ? "hide" : ""}`}
    >
      <span className="is-toast-dot" aria-hidden="true"></span>
      <span className="is-toast-msg">{message}</span>
      <button type="button" className="is-toast-close" aria-label="Dismiss" onClick={() => toast.dismiss(t.id)}>
        ✕
      </button>
    </div>
  );
};

export default SuccessToast;
