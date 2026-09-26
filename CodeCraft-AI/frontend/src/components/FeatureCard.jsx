function FeatureCard({ glyph, title, description }) {
  return (
    <div className="feature-card">
      <span className="feature-glyph">{glyph}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default FeatureCard;
