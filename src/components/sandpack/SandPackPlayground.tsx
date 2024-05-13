import { Sandpack } from "@codesandbox/sandpack-react";
import { files } from "./files";

export function SandPackPlayground() {
  return (
    <Sandpack
      template="react-ts"
      theme="auto"
      options={{
        editorHeight: 500,
        rtl: true,
      }}
      customSetup={{
        dependencies: {
          "@mui/material": "latest",
          "@emotion/styled": "latest",
          "@emotion/react": "latest",
          "react-icons": "latest",
        },
      }}
      files={files}
    />
  );
}
