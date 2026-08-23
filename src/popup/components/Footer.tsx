import React from "react";
import { IconBrandGithub } from "@tabler/icons-react";

export const Footer: React.FC = () => {
  const version = chrome.runtime?.getManifest?.()?.version || "1.0.0";

  return (
    <footer className="flex items-center justify-between text-[10.5px] text-gray-500 py-1 px-0.5">
      <span>Meet Tally v{version}</span>
      <a
        href="https://github.com/itskdhere/meet-tally"
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1.5 text-gray-400 font-medium text-[10.5px] no-underline transition-colors duration-200 py-1 px-1.5 rounded hover:text-gray-100 hover:bg-white/8"
        title="View GitHub Repository"
      >
        <IconBrandGithub size={13} stroke={1.5} />
        <span>itskdhere/meet-tally</span>
      </a>
    </footer>
  );
};
