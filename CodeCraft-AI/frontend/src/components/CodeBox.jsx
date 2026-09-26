import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './CodeBox.css';

// Maps our dropdown language names to the identifiers react-syntax-highlighter expects.
const PRISM_LANGUAGE = {
  Python: 'python',
  Java: 'java',
  C: 'c',
  'C++': 'cpp',
  JavaScript: 'javascript',
  HTML: 'markup',
  CSS: 'css',
  SQL: 'sql',
};

const FILE_NAME = {
  Python: 'output.py',
  Java: 'Main.java',
  C: 'output.c',
  'C++': 'output.cpp',
  JavaScript: 'output.js',
  HTML: 'output.html',
  CSS: 'output.css',
  SQL: 'output.sql',
};

function CodeBox({ code, language }) {
  return (
    <div className="code-window editor-frame">
      <div className="editor-titlebar">
        <span className="dot dot-red" />
        <span className="dot dot-yellow" />
        <span className="dot dot-green" />
        <span className="editor-filename">{FILE_NAME[language] || 'output.txt'}</span>
      </div>
      <SyntaxHighlighter
        language={PRISM_LANGUAGE[language] || 'text'}
        style={oneDark}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: '1rem 1.1rem',
          background: 'var(--bg-editor)',
          fontSize: '0.87rem',
          minHeight: '220px',
        }}
        codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBox;
