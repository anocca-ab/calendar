import { Sandpack } from "@codesandbox/sandpack-react";
import type { SandpackFiles } from "@codesandbox/sandpack-react";
import { commonFiles } from "./common_files";

export function SandPackPlayground({ files }: { files: SandpackFiles }) {
  return (
    <Sandpack
      template="react-ts"
      theme="auto"
      options={{
        editorHeight: 600,
        editorWidthPercentage: 40,
        rtl: true,
      }}
      customSetup={{
        dependencies: {
          // "@mui/material": "latest",
          "@emotion/styled": "latest",
          "@emotion/react": "latest",
          "react-icons": "latest",
          "@fontsource/roboto": "latest",
        },
      }}
      files={{ ...commonFiles, ...files }}
    />
  );
}
