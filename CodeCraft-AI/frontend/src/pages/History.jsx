import { useEffect, useState } from 'react';
import { getGenerationById, getHistory } from '../api.js';
import CodeBox from '../components/CodeBox.jsx';
import './History.css';

function formatDate(isoString) {
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
}

function History() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getHistory();
        if (data.success) {
          setItems(data.history);
        } else {
          setError('Unable to load history.');
        }
      } catch (err) {
        setError('Unable to load history.');
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleSelect = async (id) => {
    try {
      const data = await getGenerationById(id);
      if (data.success) {
        setSelected(data.generation);
      }
    } catch (err) {
      setError('Unable to load that generation.');
    }
  };

  return (
    <div className="history">
      <div className="panel history-list-panel">
        <h2>Previous Generations</h2>

        {loading && <p className="history-status">Loading history…</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && items.length === 0 && !error && (
          <div className="empty-state">No generations yet — go build something on the Generator page.</div>
        )}

        <ul className="history-list">
          {items.map((item) => (
            <li key={item.id}>
              <button
                className={selected?.id === item.id ? 'history-item active' : 'history-item'}
                onClick={() => handleSelect(item.id)}
              >
                <span className="history-prompt">{item.prompt}</span>
                <span className="history-meta">
                  <span className="language-badge">{item.language}</span>
                  <span className="history-date">{formatDate(item.created_at)}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="panel history-detail-panel">
        <h2>Details</h2>

        {!selected && (
          <div className="empty-state">Select a previous generation to view its code.</div>
        )}

        {selected && (
          <>
            <CodeBox code={selected.generated_code} language={selected.language} />
            {selected.explanation && (
              <div className="explanation-box">
                <h3>Code Explanation</h3>
                <p>{selected.explanation}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default History;
