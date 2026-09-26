import { useState } from 'react';
import { generateCode } from '../api.js';
import CodeBox from '../components/CodeBox.jsx';
import Loader from '../components/Loader.jsx';
import './Generator.css';

const LANGUAGES = ['Python', 'Java', 'C', 'C++', 'JavaScript', 'HTML', 'CSS', 'SQL'];

const FILE_EXTENSIONS = {
  Python: 'py',
  Java: 'java',
  C: 'c',
  'C++': 'cpp',
  JavaScript: 'js',
  HTML: 'html',
  CSS: 'css',
  SQL: 'sql',
};

function Generator() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('Python');
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a programming requirement.');
      return;
    }

    setError('');
    setLoading(true);
    setCode('');
    setExplanation('');

    try {
      const data = await generateCode(prompt, language);
      if (data.success) {
        setCode(data.code);
        setExplanation(data.explanation);
      } else {
        setError(data.error || 'Unable to generate code. Please try again.');
      }
    } catch (err) {
      setError('Unable to generate code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    if (!code) return;
    const extension = FILE_EXTENSIONS[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated_code.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setCode('');
    setExplanation('');
    setError('');
  };

  return (
    <div className="generator">
      <div className="panel left-panel">
        <h2>What do you want to build?</h2>

        <textarea
          className="prompt-input"
          placeholder="Example: Create a Python program to calculate the average of 5 numbers."
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={9}
        />

        <label className="field-label" htmlFor="language-select">
          Programming language
        </label>
        <select
          id="language-select"
          className="language-select"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        {error && <p className="error-message">{error}</p>}

        <button className="btn btn-primary" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating…' : 'Generate Code'}
        </button>
      </div>

      <div className="panel right-panel">
        <div className="right-panel-header">
          <h2>Generated Code</h2>
          <div className="code-actions">
            <button className="btn btn-ghost" onClick={handleCopy} disabled={!code}>
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button className="btn btn-ghost" onClick={handleDownload} disabled={!code}>
              Download
            </button>
            <button className="btn btn-ghost danger" onClick={handleClear} disabled={!code}>
              Clear
            </button>
          </div>
        </div>

        {loading && <Loader />}

        {!loading && code && <CodeBox code={code} language={language} />}

        {!loading && !code && (
          <div className="empty-state">Your generated code will appear here.</div>
        )}

        {!loading && explanation && (
          <div className="explanation-box">
            <h3>Code Explanation</h3>
            <p>{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Generator;
