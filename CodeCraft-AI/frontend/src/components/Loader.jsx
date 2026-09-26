import './Loader.css';

function Loader({ text = 'Generating code…' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader-spinner" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}

export default Loader;
