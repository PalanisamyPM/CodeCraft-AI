import { useState } from "react";
import api from "../api";
import CodeEditor from "../components/CodeEditor";
import "../styles.css";

function Generator() {

    const [language, setLanguage] = useState("Python");
    const [framework, setFramework] = useState("None");
    const [prompt, setPrompt] = useState("");
    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(false);
    const [explaining, setExplaining] = useState(false);
    const [debugging, setDebugging] = useState(false);
    const [optimizing, setOptimizing] = useState(false);
    const [generatingTests, setGeneratingTests] = useState(false);

    const [explanation, setExplanation] = useState("");
    const [debugResult, setDebugResult] = useState("");
    const [optimizeResult, setOptimizeResult] = useState("");
    const [testResult, setTestResult] = useState("");

    const [output, setOutput] = useState("");
    const [activeTab, setActiveTab] = useState("editor");
    const [error, setError] = useState("");

    // =========================
    // GENERATE CODE
    // =========================

    const generateCode = async () => {

        if (!prompt.trim()) {
            setError("Please describe what you want to build.");
            return;
        }

        setLoading(true);
        setError("");

        setExplanation("");
        setDebugResult("");
        setOptimizeResult("");
        setTestResult("");
        setOutput("");

        try {

            const response = await api.post("/generate", {
                prompt: prompt,
                language: language,
                framework: framework
            });

            if (response.data.success === true) {

                setCode(response.data.result);

                setOutput(
                    "✓ Code generated successfully.\n\n" +
                    "Your AI-generated code is ready in the editor."
                );

            } else {

                setError(
                    response.data.error ||
                    "Code generation failed."
                );
            }

        } catch (err) {

            console.error("GENERATION ERROR:", err);

            if (err.response) {

                setError(
                    err.response.data?.error ||
                    "Backend returned an error."
                );

            } else if (err.request) {

                setError(
                    "Cannot connect to Flask backend. Make sure Flask is running."
                );

            } else {

                setError(
                    err.message ||
                    "Something went wrong."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    // =========================
    // EXPLAIN CODE
    // =========================

    const explainCode = async () => {

        if (!code.trim()) {
            setError("Please generate or enter some code first.");
            return;
        }

        setExplaining(true);
        setError("");

        try {

            const response = await api.post("/explain", {
                code: code,
                language: language
            });

            if (response.data.success === true) {

                setExplanation(response.data.explanation);
                setActiveTab("output");

            } else {

                setError(
                    response.data.error ||
                    "Code explanation failed."
                );
            }

        } catch (err) {

            console.error("EXPLAIN ERROR:", err);

            setError(
                err.response?.data?.error ||
                "Unable to explain code."
            );

        } finally {

            setExplaining(false);
        }
    };


    // =========================
    // DEBUG CODE
    // =========================

    const debugCode = async () => {

        if (!code.trim()) {
            setError("Please generate or enter some code first.");
            return;
        }

        setDebugging(true);
        setError("");

        try {

            const response = await api.post("/debug", {
                code: code,
                language: language
            });

            if (response.data.success === true) {

                setDebugResult(response.data.result);
                setActiveTab("output");

            } else {

                setError(
                    response.data.error ||
                    "Code debugging failed."
                );
            }

        } catch (err) {

            console.error("DEBUG ERROR:", err);

            setError(
                err.response?.data?.error ||
                "Unable to debug code."
            );

        } finally {

            setDebugging(false);
        }
    };


    // =========================
    // OPTIMIZE CODE
    // =========================

    const optimizeCode = async () => {

        if (!code.trim()) {
            setError("Please generate or enter some code first.");
            return;
        }

        setOptimizing(true);
        setError("");

        try {

            const response = await api.post("/optimize", {
                code: code,
                language: language
            });

            if (response.data.success === true) {

                setOptimizeResult(response.data.result);
                setActiveTab("output");

            } else {

                setError(
                    response.data.error ||
                    "Code optimization failed."
                );
            }

        } catch (err) {

            console.error("OPTIMIZE ERROR:", err);

            setError(
                err.response?.data?.error ||
                "Unable to optimize code."
            );

        } finally {

            setOptimizing(false);
        }
    };


    // =========================
    // GENERATE TEST CASES
    // =========================

    const generateTests = async () => {

        if (!code.trim()) {
            setError("Please generate or enter some code first.");
            return;
        }

        setGeneratingTests(true);
        setError("");

        try {

            const response = await api.post("/test-cases", {
                code: code,
                language: language
            });

            if (response.data.success === true) {

                setTestResult(response.data.result);
                setActiveTab("output");

            } else {

                setError(
                    response.data.error ||
                    "Test case generation failed."
                );
            }

        } catch (err) {

            console.error("TEST CASE ERROR:", err);

            setError(
                err.response?.data?.error ||
                "Unable to generate test cases."
            );

        } finally {

            setGeneratingTests(false);
        }
    };


    // =========================
    // COPY CODE
    // =========================

    const copyCode = async () => {

        if (!code.trim()) {
            setError("There is no code to copy.");
            return;
        }

        try {

            await navigator.clipboard.writeText(code);

            setOutput("✓ Code copied to clipboard.");

            setActiveTab("output");

        } catch {

            setError("Unable to copy code.");
        }
    };


    // =========================
    // DOWNLOAD CODE
    // =========================

    const downloadCode = () => {

        if (!code.trim()) {
            setError("There is no code to download.");
            return;
        }

        const extensions = {
            Python: "py",
            Java: "java",
            C: "c",
            "C++": "cpp",
            JavaScript: "js",
            HTML: "html",
            CSS: "css",
            SQL: "sql"
        };

        const extension = extensions[language] || "txt";

        const blob = new Blob(
            [code],
            { type: "text/plain" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = `codecraft.${extension}`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        setOutput(
            `✓ Code downloaded as codecraft.${extension}`
        );

        setActiveTab("output");
    };


    // =========================
    // CLEAR CODE
    // =========================

    const clearCode = () => {

        setCode("");
        setPrompt("");

        setExplanation("");
        setDebugResult("");
        setOptimizeResult("");
        setTestResult("");

        setOutput("");
        setError("");
    };


    return (

        <div className="ide">

            {/* ===================================== */}
            {/* TOP PROMO BAR */}
            {/* ===================================== */}

            <div className="promo-bar">

                <div className="promo-text">

                    <strong>
                        Stop copy pasting code you don't actually understand
                    </strong>

                    <span>
                        Build the coding confidence you need to become a developer companies will fight for
                    </span>

                </div>

                <button className="pro-button">
                    ✨ Become a PRO
                </button>

            </div>


            {/* ===================================== */}
            {/* HEADER */}
            {/* ===================================== */}

            <header className="top-header">

                <div className="brand">

                    <div className="brand-icon">
                        &lt;/&gt;
                    </div>

                    <div>

                        <div className="brand-name">
                            CodeCraft <span>AI</span>
                        </div>

                        <div className="brand-subtitle">
                            AI Code Generator & Assistant
                        </div>

                    </div>

                </div>


                <div className="header-title">

                    <h1>
                        Build. Understand. Improve.
                    </h1>

                    <p>
                        Your AI-powered coding workspace
                    </p>

                </div>


                <button className="header-pro">
                    👑 CodeCraft PRO →
                </button>

            </header>


            {/* ===================================== */}
            {/* MAIN IDE */}
            {/* ===================================== */}

            <div className="workspace">


                {/* ================================= */}
                {/* SIDEBAR */}
                {/* ================================= */}

                <aside className="sidebar">

                    <div className="sidebar-menu">

                        <button className="side-item active">

                            <span>⌘</span>

                            <label>
                                Code Editor
                            </label>

                        </button>


                        <button className="side-item">

                            <span>🤖</span>

                            <label>
                                AI Assistant
                            </label>

                        </button>


                        <button className="side-item">

                            <span>▤</span>

                            <label>
                                Templates
                            </label>

                        </button>


                        <button className="side-item">

                            <span>◷</span>

                            <label>
                                History
                            </label>

                        </button>


                        <button className="side-item">

                            <span>☆</span>

                            <label>
                                Favorites
                            </label>

                        </button>


                        <button className="side-item">

                            <span>⚙</span>

                            <label>
                                Settings
                            </label>

                        </button>


                        <button className="side-item">

                            <span>?</span>

                            <label>
                                Help & Support
                            </label>

                        </button>

                    </div>


                    <div className="sidebar-bottom">

                        <div className="upgrade-link">
                            👑 Upgrade to PRO
                        </div>

                        <div className="user-card">

                            <div className="avatar">
                                PC
                            </div>

                            <div className="user-info">

                                <strong>
                                    CodeCraft User
                                </strong>

                                <span>
                                    Free Plan
                                </span>

                            </div>

                            <span className="arrow">
                               ⌄
                            </span>

                        </div>

                    </div>

                </aside>


                {/* ================================= */}
                {/* CENTER */}
                {/* ================================= */}

                <main className="editor-area">


                    {/* LANGUAGE BAR */}

                    <div className="editor-toolbar">

                        <div className="language-section">

                            <span className="language-icon">
                                🐍
                            </span>

                            <select
                                value={language}
                                onChange={(e) =>
                                    setLanguage(e.target.value)
                                }
                            >

                                <option>Python</option>
                                <option>Java</option>
                                <option>C</option>
                                <option>C++</option>
                                <option>JavaScript</option>
                                <option>HTML</option>
                                <option>CSS</option>
                                <option>SQL</option>

                            </select>

                            <select
                                className="framework-select"
                                value={framework}
                                onChange={(e) =>
                                    setFramework(e.target.value)
                                }
                            >

                                <option>None</option>
                                <option>Flask</option>
                                <option>Django</option>
                                <option>React</option>
                                <option>Node.js</option>

                            </select>

                        </div>


                        <div className="toolbar-right">

                            <button
                                className="toolbar-btn"
                                onClick={copyCode}
                            >
                                📋 Copy
                            </button>

                            <button
                                className="toolbar-btn"
                                onClick={downloadCode}
                            >
                                ↓ Download
                            </button>

                            <button
                                className="toolbar-btn danger"
                                onClick={clearCode}
                            >
                                Clear
                            </button>

                        </div>

                    </div>


                    {/* EDITOR HEADER */}

                    <div className="file-bar">

                        <div className="file-tab">

                            <span>
                                {language === "Python"
                                    ? "main.py"
                                    : `main.${language.toLowerCase()}`}
                            </span>

                            <span className="close-icon">
                                ×
                            </span>

                        </div>


                        <div className="file-actions">

                            <button
                                className="visualize-btn"
                                onClick={() => {
                                    setOutput(
                                        "Visualization mode is ready for execution."
                                    );
                                    setActiveTab("output");
                                }}
                            >
                                Visualize
                            </button>

                            <button
                                className="run-btn"
                                onClick={() => {

                                    setOutput(
                                        "▶ Run requested.\n\n" +
                                        "Code execution can be connected to a secure execution engine in the next stage."
                                    );

                                    setActiveTab("output");

                                }}
                            >
                                Run ▶
                            </button>

                        </div>

                    </div>


                    {/* EDITOR */}

                    <div className="monaco-wrapper">

                        <CodeEditor
                            code={code}
                            setCode={setCode}
                            language={language}
                        />

                        {!code && (

                            <div className="editor-placeholder">

                                <div className="placeholder-icon">
                                    ✨
                                </div>

                                <h2>
                                    Welcome to CodeCraft AI
                                </h2>

                                <p>
                                    Describe what you want to build below
                                </p>

                                <p className="placeholder-example">
                                    Example: "Create a Python calculator with
                                    error handling"
                                </p>

                            </div>

                        )}

                    </div>


                    {/* AI PROMPT */}

                    <div className="prompt-section">

                        <div className="prompt-header">

                            <span>
                                🤖 AI Requirement
                            </span>

                            <span className="shortcut">
                                Ctrl + Enter to generate
                            </span>

                        </div>


                        <div className="prompt-box">

                            <textarea
                                value={prompt}
                                onChange={(e) =>
                                    setPrompt(e.target.value)
                                }
                                placeholder="Describe the application or program you want CodeCraft AI to create..."
                                onKeyDown={(e) => {

                                    if (
                                        e.ctrlKey &&
                                        e.key === "Enter"
                                    ) {
                                        generateCode();
                                    }

                                }}
                            />


                            <button
                                className="generate-main"
                                onClick={generateCode}
                                disabled={loading}
                            >

                                {loading
                                    ? "🤖 Generating..."
                                    : "✨ Generate Code"}

                            </button>

                        </div>

                    </div>

                </main>


                {/* ================================= */}
                {/* OUTPUT */}
                {/* ================================= */}

                <section className="output-area">

                    <div className="output-header">

                        <div className="output-tabs">

                            <button
                                className={
                                    activeTab === "editor"
                                        ? "output-tab active"
                                        : "output-tab"
                                }
                                onClick={() =>
                                    setActiveTab("editor")
                                }
                            >
                                Editor
                            </button>

                            <button
                                className={
                                    activeTab === "output"
                                        ? "output-tab active"
                                        : "output-tab"
                                }
                                onClick={() =>
                                    setActiveTab("output")
                                }
                            >
                                Output
                            </button>

                        </div>


                        <div className="output-icons">

                            <span>
                                ⤴
                            </span>

                            <span>
                                ⋮
                            </span>

                        </div>

                    </div>


                    <div className="output-content">

                        {error && (

                            <div className="error-box">

                                <strong>
                                    ⚠ Error
                                </strong>

                                <p>
                                    {error}
                                </p>

                            </div>

                        )}


                        {output && !error && (

                            <pre className="result-text">
                                {output}
                            </pre>

                        )}


                        {explanation && (

                            <div className="ai-result">

                                <h2>
                                    📖 AI Code Explanation
                                </h2>

                                <pre>
                                    {explanation}
                                </pre>

                            </div>

                        )}


                        {debugResult && (

                            <div className="ai-result">

                                <h2>
                                    🐛 AI Debug Explanation
                                </h2>

                                <pre>
                                    {debugResult}
                                </pre>

                            </div>

                        )}


                        {optimizeResult && (

                            <div className="ai-result">

                                <h2>
                                    ⚡ AI Code Optimization
                                </h2>

                                <pre>
                                    {optimizeResult}
                                </pre>

                            </div>

                        )}


                        {testResult && (

                            <div className="ai-result">

                                <h2>
                                    🧪 AI Generated Test Cases
                                </h2>

                                <pre>
                                    {testResult}
                                </pre>

                            </div>

                        )}


                        {!output &&
                            !explanation &&
                            !debugResult &&
                            !optimizeResult &&
                            !testResult &&
                            !error && (

                                <div className="empty-output">

                                    <div>
                                        ▶
                                    </div>

                                    <h3>
                                        Output
                                    </h3>

                                    <p>
                                        Generate code or run an AI action
                                        to see results here.
                                    </p>

                                </div>

                            )}

                    </div>

                </section>

            </div>


            {/* ===================================== */}
            {/* AI ACTIONS */}
            {/* ===================================== */}

            <section className="ai-actions">

                <div className="ai-actions-title">
                    AI Actions
                </div>


                <div className="action-grid">


                    {/* GENERATE */}

                    <button
                        className="action-card generate-card"
                        onClick={generateCode}
                        disabled={loading}
                    >

                        <div className="action-title">
                            🤖 Generate Code
                        </div>

                        <p>
                            Generate code from natural
                            language description
                        </p>

                    </button>


                    {/* EXPLAIN */}

                    <button
                        className="action-card explain-card"
                        onClick={explainCode}
                        disabled={explaining}
                    >

                        <div className="action-title">
                            📖 Explain Code
                        </div>

                        <p>
                            {explaining
                                ? "Analyzing your code..."
                                : "Get detailed explanation of your code"}
                        </p>

                    </button>


                    {/* DEBUG */}

                    <button
                        className="action-card debug-card"
                        onClick={debugCode}
                        disabled={debugging}
                    >

                        <div className="action-title">
                            🐛 Debug Code
                        </div>

                        <p>
                            {debugging
                                ? "Finding errors..."
                                : "Find and fix errors in your code"}
                        </p>

                    </button>


                    {/* OPTIMIZE */}

                    <button
                        className="action-card optimize-card"
                        onClick={optimizeCode}
                        disabled={optimizing}
                    >

                        <div className="action-title">
                            ⚡ Optimize Code
                        </div>

                        <p>
                            {optimizing
                                ? "Optimizing..."
                                : "Improve performance and code quality"}
                        </p>

                    </button>


                    {/* TEST CASES */}

                    <button
                        className="action-card test-card"
                        onClick={generateTests}
                        disabled={generatingTests}
                    >

                        <div className="action-title">
                            🧪 Test Cases
                        </div>

                        <p>
                            {generatingTests
                                ? "Generating tests..."
                                : "Generate test cases for your code"}
                        </p>

                    </button>

                </div>

            </section>


            {/* ===================================== */}
            {/* STATUS BAR */}
            {/* ===================================== */}

            <footer className="status-bar">

                <div className="status-left">

                    <span>
                        ⓘ
                    </span>

                    <span className="online-dot"></span>

                    <span>
                        Ready to code with AI
                    </span>

                </div>


                <div className="status-right">

                    <span>
                        Ln {code ? code.split("\n").length : 1}
                    </span>

                    <span>
                        Col {code ? code.length : 1}
                    </span>

                    <span>
                        Spaces: 4
                    </span>

                    <span>
                        UTF-8
                    </span>

                    <span>
                        {language}
                    </span>

                    <span className="online-dot"></span>

                </div>

            </footer>

        </div>
    );
}

export default Generator;