import { useState } from 'react';
import './Predict.css';

const exampleReviews = [
  "This movie was absolutely fantastic! The acting was superb and the plot kept me on the edge of my seat.",
  "Terrible film. Boring plot, awful acting, complete waste of time and money.",
  "An average movie with some good moments but overall nothing special.",
  "One of the best movies I've ever seen. The cinematography was breathtaking and the story was deeply moving.",
  "I couldn't even finish watching it. The script was horrible and the direction was poor.",
];

export default function Predict() {
  const [review, setReview] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    if (!review.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const API_URL = 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'API error');
      } else {
        setResult(data);
      }
    } catch {
      setError('Connecting to server... Please wait 30 seconds and try again (free server wakes up slowly)');
    }
    setLoading(false);
  };

  const handleExample = (text) => {
    setReview(text);
    setResult(null);
    setError('');
  };

  return (
    <div>
      <div className="page-header">
        <h1>Live Sentiment Prediction</h1>
        <p>Type or paste a movie review to analyze its sentiment in real-time</p>
      </div>

      <div className="predict-container">
        <div className="predict-input-section">
          <div className="card">
            <h3>Enter Movie Review</h3>
            <textarea
              className="predict-textarea"
              placeholder="Type your movie review here... e.g., 'This movie was absolutely amazing!'"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={6}
            />
            <div className="predict-actions">
              <button
                className="predict-btn"
                onClick={handlePredict}
                disabled={loading || !review.trim()}
              >
                {loading ? 'Analyzing...' : 'Analyze Sentiment'}
              </button>
              <span className="word-count">{review.split(/\s+/).filter(Boolean).length} words</span>
            </div>

            {error && (
              <div className="predict-error">
                <span>⚠️</span> {error}
              </div>
            )}
          </div>

          <div className="card" style={{ marginTop: 20 }}>
            <h3>Try Example Reviews</h3>
            <div className="examples-list">
              {exampleReviews.map((ex, i) => (
                <button key={i} className="example-btn" onClick={() => handleExample(ex)}>
                  <span className="example-num">#{i + 1}</span>
                  <span className="example-text">{ex.substring(0, 80)}...</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="predict-result-section">
          {result ? (
            <div className="card result-card">
              <div className={`result-badge ${result.sentiment === 'Positive' ? 'positive' : 'negative'}`}>
                <span className="result-emoji">
                  {result.sentiment === 'Positive' ? '😊' : '😞'}
                </span>
                <span className="result-label">{result.sentiment}</span>
              </div>

              <div className="confidence-section">
                <h3>Confidence Level</h3>
                <div className="confidence-bar-container">
                  <div
                    className="confidence-bar"
                    style={{
                      width: `${result.confidence}%`,
                      background: result.sentiment === 'Positive'
                        ? 'linear-gradient(90deg, #00d25b, #00ff6a)'
                        : 'linear-gradient(90deg, #ff4757, #ff6b81)'
                    }}
                  />
                </div>
                <span className="confidence-value">{result.confidence}%</span>
              </div>

              <div className="prob-section">
                <div className="prob-row">
                  <span className="prob-label">Positive Probability</span>
                  <div className="prob-bar-wrap">
                    <div className="prob-bar pos" style={{ width: `${result.positive_prob}%` }} />
                  </div>
                  <span className="prob-value">{result.positive_prob}%</span>
                </div>
                <div className="prob-row">
                  <span className="prob-label">Negative Probability</span>
                  <div className="prob-bar-wrap">
                    <div className="prob-bar neg" style={{ width: `${result.negative_prob}%` }} />
                  </div>
                  <span className="prob-value">{result.negative_prob}%</span>
                </div>
              </div>

              <div className="result-meta">
                <div className="meta-item">
                  <span className="meta-label">Words Analyzed</span>
                  <span className="meta-value">{result.word_count}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Model Used</span>
                  <span className="meta-value">L2 (Best)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="card empty-result">
              <div className="empty-icon">🎬</div>
              <h3>Ready to Analyze</h3>
              <p>Enter a movie review and click "Analyze Sentiment" to see the prediction results here.</p>
              <div className="empty-steps">
                <div className="step"><span>1</span> Enter or select a review</div>
                <div className="step"><span>2</span> Click Analyze</div>
                <div className="step"><span>3</span> See results instantly</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
