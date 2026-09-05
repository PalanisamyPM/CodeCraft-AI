import Editor from "@monaco-editor/react";

function CodeEditor({ code, setCode, language }) {

    const languageMap = {
        Python: "python",
        Java: "java",
        C: "c",
        "C++": "cpp",
        JavaScript: "javascript",
        HTML: "html",
        CSS: "css",
        SQL: "sql"
    };

    return (
        <Editor
            height="100%"
            theme="vs-dark"
            language={
                languageMap[language] ||
                "plaintext"
            }
            value={code}
            onChange={(value) =>
                setCode(value || "")
            }
            options={{
                minimap: {
                    enabled: false
                },
                fontSize: 14,
                automaticLayout: true,
                padding: {
                    top: 15
                }
            }}
        />
    );
}

export default CodeEditor;