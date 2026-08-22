import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="brand">
        <div className="brand-logo">
          <img src="/logo.png" alt="Meet Tally" className="brand-logo-img" />
        </div>
        <div className="brand-info">
          <h1 className="brand-title">Meet Tally</h1>
          <span className="brand-sub">Control & Status Indicator</span>
        </div>
      </div>
    </header>
  );
};
