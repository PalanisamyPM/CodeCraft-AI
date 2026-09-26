import { useNavigate } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard.jsx';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-copy">
          <h1>CodeCraft AI</h1>
          <p className="tagline">Turn your ideas into code with AI</p>
          <p className="hero-description">
            Describe your programming requirement in simple English and CodeCraft AI will
            generate the code for you.
          </p>
          <button className="btn btn-primary btn-large" onClick={() => navigate('/generator')}>
            Start Generating
          </button>
        </div>

        <div className="hero-demo editor-frame" aria-hidden="true">
          <div className="editor-titlebar">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
            <span className="editor-filename">reverse_string.py</span>
          </div>
          <div className="hero-demo-body">
            <p className="hero-demo-prompt">
              <span className="hero-demo-label">Prompt</span>
              "Reverse a string that the user types in"
            </p>
            <pre className="hero-demo-code">
              <code>
                <span className="tok-def">def</span> reverse_string(text):{'\n'}
                {'    '}
                <span className="tok-comment"># slicing with a step of -1 walks the string backwards</span>
                {'\n'}
                {'    '}
                <span className="tok-key">return</span> text[::-1]{'\n\n'}
                text = <span className="tok-key">input</span>(<span className="tok-string">"Enter text: "</span>
                ){'\n'}
                <span className="tok-key">print</span>(reverse_string(text))
              </code>
            </pre>
          </div>
        </div>
      </section>

      <section className="features">
        <FeatureCard
          glyph=">_"
          title="AI Code Generation"
          description="Describe what you need in plain English and get working source code back in seconds."
        />
        <FeatureCard
          glyph="/**/"
          title="Code Explanation"
          description="Every snippet comes with a short, beginner-friendly explanation of how it works."
        />
        <FeatureCard
          glyph="↓"
          title="Code Download"
          description="Copy the result to your clipboard, or download it as a ready-to-run file."
        />
      </section>
    </div>
  );
}

export default Home;
