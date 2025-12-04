import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "codemirror/mode/htmlmixed/htmlmixed";

import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  ContentState,
} from "draft-js";

import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import { Controlled as CodeMirror } from "react-codemirror2";

export default function HtmlEditor() {
  const [mode, setMode] = useState("rte"); // rte | html
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty()
  );
  const [htmlValue, setHtmlValue] = useState("");

  // Update HTML when rich editor changes
  const handleRTEChange = (state) => {
    setEditorState(state);
    const html = draftToHtml(convertToRaw(state.getCurrentContent()));
    setHtmlValue(html);
  };

  // Save final HTML
  const handleSave = () => {
    let finalHtml = htmlValue;

    // If user saved from RTE mode
    if (mode === "rte") {
      finalHtml = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );
    }

    console.log("FINAL HTML:", finalHtml);
    alert("HTML printed in console");
  };

  return (
    <div className="modal-box">
      {/* Mode Tabs */}
      <div className="tab-buttons">
        <button
          className={mode === "rte" ? "active" : ""}
          onClick={() => setMode("rte")}
        >
          Visual Editor
        </button>

        <button
          className={mode === "html" ? "active" : ""}
          onClick={() => setMode("html")}
        >
          HTML
        </button>
      </div>

      {/* Editor Section */}
      <div className="editor-area">
        {mode === "rte" ? (
          <Editor
            editorState={editorState}
            onEditorStateChange={handleRTEChange}
            toolbarClassName="toolbar"
            wrapperClassName="wrapper"
            editorClassName="editor"
          />
        ) : (
          <CodeMirror
            value={htmlValue}
            options={{
              mode: "htmlmixed",
              lineNumbers: true,
            }}
            onBeforeChange={(editor, data, value) => {
              setHtmlValue(value);
            }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="modal-footer">
        <button className="primary-btn" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}
