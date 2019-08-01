import React, { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
const Modal = ({ handleClose, show, deleteProfile, children }) => {
  const onKeyUp = useCallback(
    e => {
      // Lookout for ESC key (27)
      if (e.which === 27 && show) {
        handleClose();
      }
    },
    [handleClose, show]
  );

  useEffect(() => {
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [onKeyUp]);

  const backdropStyle = {
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 100
  };

  const modalStyle = {
    backgroundColor: "#fff",
    borderRadius: 5,
    maxWidth: 500,
    minHeight: 250,
    margin: "0 auto",
    padding: 10,
    position: "relative",
    marginTop: 200
  };

  const footerStyle = {
    position: "absolute",
    bottom: 20
  };

  if (!show) {
    return null;
  }
  return (
    <div
      style={backdropStyle}
      id="backdrop"
      className="backdrop"
      onClick={handleClose}
    >
      {/* {children} */}

      <div style={modalStyle} className="modal-content" id="content">
        <p>Are you sure you want to delete your profile?</p>
        <div style={footerStyle} className="modal-buttons">
          {" "}
          <button onClick={handleClose} className="cancel">
            Cancel
          </button>
          <div className="divider" />
          <button onClick={deleteProfile} className="confirm">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
Modal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};
export default Modal;
