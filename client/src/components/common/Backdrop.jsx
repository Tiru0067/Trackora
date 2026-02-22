import React from "react";

const Backdrop = ({ className = "" }) => {
  return (
    <div
      className={`fixed inset-0 bg-black/40 z-40 backdrop-blur-sm ${className}`}
    ></div>
  );
};

export default Backdrop;
