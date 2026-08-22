import React from "react";
import { IconBrandGithub } from "@tabler/icons-react";

export const Footer: React.FC = () => {
  const version = chrome.runtime?.getManifest?.()?.version || "1.0.0";

  return (
    <footer className="footer">
      <span>Meet Tally v{version}</span>
      <a
        href="https://github.com/itskdhere/meet-tally"
        target="_blank"
        rel="noreferrer noopener"
        className="github-link"
        title="View GitHub Repository"
      >
        <IconBrandGithub size={13} stroke={1.5} />
        <span>itskdhere/meet-tally</span>
      </a>
    </footer>
  );
};
