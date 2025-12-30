import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";

interface QuillEditorProps {
  readOnly?: boolean;
  defaultValue?: any;
  onTextChange?: (content: string) => void;
  onSelectionChange?: (range: any) => void;
}

const QuillEditor = forwardRef<any, QuillEditorProps>(
  (
    { readOnly = false, defaultValue, onTextChange, onSelectionChange },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<any>(null); // Store Quill instance

    useLayoutEffect(() => {
      if (quillRef.current) {
        quillRef.current.enable(!readOnly);
      }
    }, [readOnly]);

    useEffect(() => {
      if (!quillRef.current && containerRef.current) {
        // Create Quill editor only once
        quillRef.current = new (window as any).Quill(containerRef.current, {
          modules: { toolbar: true },
          placeholder: "Type your text here...",
          theme: "snow",
        });

        if (defaultValue) {
          quillRef.current.root.innerHTML = defaultValue;
        }

        // Handle text change
        quillRef.current.on("text-change", () => {
          onTextChange?.(quillRef.current.root.innerHTML);
        });

        // Handle selection change
        quillRef.current.on("selection-change", (range: any) => {
          onSelectionChange?.(range);
        });

        // Set ref to the current Quill instance
        if (ref) {
          if (typeof ref === "function") {
            ref(quillRef.current);
          } else {
            ref.current = quillRef.current;
          }
        }
      }

      return () => {
        quillRef.current = null;
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        className="min-h-100px mb-2 ql-container ql-snow"
        ref={containerRef}
      ></div>
    );
  }
);

QuillEditor.displayName = "QuillEditor";

export default QuillEditor;
