import React from "react";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("modal-root");

const Modal = ({ children }) => {
  const el = document.createElement("div");

  React.useEffect(() => {
    modalRoot.appendChild(el);
    return () => modalRoot.removeChild(el);
  }, [el]);

  return ReactDOM.createPortal(children, el);
};

export default Modal;
