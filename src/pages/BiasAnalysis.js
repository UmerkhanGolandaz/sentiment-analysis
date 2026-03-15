import stats from '../data/modelStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function BiasAnalysis() {
  const emotionData = Object.entries(stats.bias.emotions)
    .map(([name, count]) => ({ name, count, pct: stats.bias.emotion_pct[name] }))
    .sort((a, b) => b.count - a.count);

  const ratingData = Object.entries(stats.bias.ratings)
    .map(([rating, count]) => ({ rating, count }));

  const sentimentPie = [
    { name: 'Negative (1-4)', value: stats.bias.sentiment_counts.negative },
    { name: 'Positive (7-10)', value: stats.bias.sentiment_counts.positive },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Data Bias Analysis</h1>
        <p>Understanding why we switched from emotion labels to rating-based labels</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ff4757' }}>{stats.bias.imbalance_ratio}x</div>
          <div className="stat-label">Emotion Imbalance Ratio</div>
          <span className="badge badge-red" style={{ marginTop: 8 }}>HIGHLY BIASED</span>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#00d25b' }}>1.34x</div>
          <div className="stat-label">Rating-based Balance Ratio</div>
          <span className="badge badge-green" style={{ marginTop: 8 }}>GOOD BALANCE</span>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ffa500' }}>{stats.dataset.removed_neutral.toLocaleString()}</div>
          <div className="stat-label">Neutral Reviews Removed (5-6)</div>
          <span className="badge badge-orange" style={{ marginTop: 8 }}>NOISE REMOVED</span>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3>Original Emotion Labels (BIASED - 304x)</h3>
          <p style={{ color: '#ff4757', fontSize: 12, marginBottom: 12, marginTop: -8 }}>
            Sadness: 17,339 vs Surprise: 57 — model can't learn from this!
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emotionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #ff4757', borderRadius: 8 }}
                formatter={(value, name) => [value.toLocaleString(), name === 'count' ? 'Count' : name]}
              />
              <Bar dataKey="count" fill="#ff4757" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Ratings Distribution (BALANCED)</h3>
          <p style={{ color: '#00d25b', fontSize: 12, marginBottom: 12, marginTop: -8 }}>
            Ratings 1-10 are evenly spread — much better for training!
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="rating" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #00d25b', borderRadius: 8 }}
                formatter={(value) => [value.toLocaleString(), 'Count']}
              />
              <Bar dataKey="count" fill="#00d25b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>New Sentiment Labels (from Ratings)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={sentimentPie}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                <Cell fill="#ff4757" />
                <Cell fill="#00d25b" />
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #6c63ff', borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Why We Changed Labels</h3>
          <div style={{ lineHeight: 2, fontSize: 14 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <span className="badge badge-red">Problem</span>
              <span style={{ color: '#ccc' }}>Emotion labels are 304x biased</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <span className="badge badge-red">Problem</span>
              <span style={{ color: '#ccc' }}>Ambiguous emotions like "anticipation"</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <span className="badge badge-green">Solution</span>
              <span style={{ color: '#ccc' }}>Use Ratings (1-10) as ground truth</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <span className="badge badge-green">Solution</span>
              <span style={{ color: '#ccc' }}>Remove neutral reviews (rating 5-6)</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <span className="badge badge-blue">Result</span>
              <span style={{ color: '#ccc' }}>Accuracy jumped from ~71% to ~97%</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="badge badge-blue">Result</span>
              <span style={{ color: '#ccc' }}>Balance ratio: 304x → 1.34x</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
