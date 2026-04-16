import { useEffect, useId, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { cn } from "@flcn-lms/ui/lib/utils";
export function RichEditor({ name, defaultValue = "", placeholder, className, minHeight = 160, mode = "full", }) {
    const uid = useId().replace(/:/g, "");
    const toolbarRef = useRef(null);
    const editorRef = useRef(null);
    const hiddenRef = useRef(null);
    const quillRef = useRef(null);
    useEffect(() => {
        if (!toolbarRef.current || !editorRef.current || quillRef.current)
            return;
        const quill = new Quill(editorRef.current, {
            theme: "snow",
            placeholder,
            modules: {
                toolbar: toolbarRef.current,
                history: { delay: 1000, maxStack: 100, userOnly: true },
            },
        });
        if (defaultValue) {
            quill.clipboard.dangerouslyPasteHTML(defaultValue);
            quill.setSelection(quill.getLength(), 0);
        }
        quill.on("text-change", () => {
            if (hiddenRef.current) {
                hiddenRef.current.value =
                    quill.getText().trim() === "" ? "" : quill.getSemanticHTML();
            }
        });
        quillRef.current = quill;
        return () => {
            if (toolbarRef.current)
                toolbarRef.current.innerHTML = buildToolbarHTML(mode);
            if (editorRef.current)
                editorRef.current.innerHTML = "";
            quillRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (<div className={cn("overflow-hidden rounded-md border border-input", className)}>
      {/* Scoped style — lives outside editorRef so Quill never wipes it */}
      <style>{`#re-${uid} .ql-editor { min-height: ${minHeight}px; padding: 0.75rem; font-size: 0.875rem; font-family: inherit; } #re-${uid} .ql-editor.ql-blank::before { font-style: normal; color: var(--muted-foreground); }`}</style>

      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue}/>

      <div ref={toolbarRef} className="border-b border-input bg-muted/40 [&_.ql-formats]:mr-2" dangerouslySetInnerHTML={{ __html: buildToolbarHTML(mode) }}/>

      <div id={`re-${uid}`} ref={editorRef}/>
    </div>);
}
function buildToolbarHTML(mode) {
    if (mode === "basic") {
        return `
      <span class="ql-formats">
        <button class="ql-bold"></button>
        <button class="ql-italic"></button>
        <button class="ql-underline"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-link"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-clean"></button>
      </span>
    `;
    }
    return `
    <span class="ql-formats">
      <select class="ql-header">
        <option value="1"></option>
        <option value="2"></option>
        <option value="3"></option>
        <option selected></option>
      </select>
    </span>
    <span class="ql-formats">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-color"></select>
      <select class="ql-background"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-blockquote"></button>
      <button class="ql-code-block"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-align"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-link"></button>
      <button class="ql-image"></button>
      <button class="ql-formula"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-clean"></button>
    </span>
  `;
}
