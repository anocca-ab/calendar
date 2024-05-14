import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import type { SandpackFiles } from "@codesandbox/sandpack-react";
import { useState } from "react";
import { commonFiles } from "./common_files";

export function CustomSandPackPlayground({
  files,
  height,
}: {
  files: SandpackFiles;
  height: number;
}) {
  const [editorViewable, setEditorViewable] = useState(true);

  const customSetup = {
    dependencies: {
      //   "@mui/material": "latest",
      "@emotion/styled": "latest",
      "@emotion/react": "latest",
      "react-icons": "latest",
    },
  };

  return (
    <SandpackProvider
      template="react-ts"
      files={{ ...commonFiles, ...files }}
      customSetup={customSetup}
      theme="auto"
    >
      <SandpackLayout style={{ height: `${height}px` }}>
        <SandpackPreview
          style={{ height: "100%" }}
          actionsChildren={
            <button onClick={() => setEditorViewable(!editorViewable)}>
              {editorViewable ? "Hide Editor" : "Show Editor"}
            </button>
          }
        />
        {editorViewable && <SandpackCodeEditor style={{ height: "100%" }} />}
      </SandpackLayout>
    </SandpackProvider>
  );
}
