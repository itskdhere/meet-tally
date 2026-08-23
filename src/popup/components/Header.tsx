import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between pb-0.5">
      <div className="flex items-center gap-2.5">
        <div className="w-7.5 h-7.5 flex items-center justify-center shrink-0">
          <img
            src="/logo.png"
            alt="Meet Tally"
            className="w-full h-full object-contain block"
          />
        </div>
        <div>
          <h1 className="text-[15px] font-bold tracking-tight text-gray-50 leading-tight">
            Meet Tally
          </h1>
          <span className="text-[11px] text-gray-400 block font-normal">
            Controller & Status Indicator
          </span>
        </div>
      </div>
    </header>
  );
};
