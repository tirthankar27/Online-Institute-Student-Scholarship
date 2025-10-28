import React from "react";
export default function Alert(props) {
  const capitalize = (word) => {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };
  return (
    <div
      style={{
        height: "15px",
        top: "131px",
        left: 0,
        right: 0,
        zIndex: 1051,
        position: "fixed",
      }}
    >
      {props.alert && (
        <div
          className={`alert alert-${props.alert.type} alert-dismissible fade show mb-3`}
          role="alert"
          style={{ padding: "8px 14px", fontSize: "15px", lineHeight: "1.4" }}
        >
          {capitalize(props.alert.msg)}
        </div>
      )}
    </div>
  );
}
