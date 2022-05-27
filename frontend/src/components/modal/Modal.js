import React from "react";
import ReactDom from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import "./modal.scss";

const MODAL_STYLES = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#2f323",
  padding: "50px",
  zIndex: 1000,
};

const OVERLAY_STYLES = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, .7)",
  zIndex: 1000,
};

const BUTTON_DIV = {
  position: "relative",
};

const BUTTON_STYLES = {
  position: "absolute",
  top: -40,
  right: -40,
  color: "darkred",
  cursor: "pointer",
};

export default function Modal({ open, children, onClose }) {
  if (!open) return null;

  return ReactDom.createPortal(
    <>
      <div className="modal-overlay" style={OVERLAY_STYLES} />
      <div className="modal" style={MODAL_STYLES}>
        <div className="button-div" style={BUTTON_DIV}>
          <CloseIcon onClick={onClose} style={BUTTON_STYLES} />
        </div>
        {children}
      </div>
    </>,
    document.getElementById("portal")
  );
}
