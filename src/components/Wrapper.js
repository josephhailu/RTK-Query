import React from "react";

export const Wrapper = ({ children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "15px" }}>
      {children}
    </div>
  );
};
