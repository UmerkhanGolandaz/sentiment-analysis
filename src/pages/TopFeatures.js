import stats from '../data/modelStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TopFeatures() {
  const posData = stats.top_features.positive.map(f => ({
    word: f.word,
    coef: +f.coef.toFixed(2),
  }));

  const negData = stats.top_features.negative.map(f => ({
    word: f.word,
    coef: +Math.abs(f.coef).toFixed(2),
    raw: f.coef,
  }));

  return (
    <div>
      <div className="page-header">
        <h1>Top Features</h1>
        <p>Most important words the model uses to predict positive vs negative sentiment</p>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3 style={{ color: '#00d25b' }}>Top 15 Positive Words</h3>
          <p style={{ color: '#666', fontSize: 12, marginTop: -8, marginBottom: 16 }}>
            Higher coefficient = stronger positive signal
          </p>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={posData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis type="number" stroke="#888" />
              <YAxis dataKey="word" type="category" stroke="#888" width={100} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #00d25b', borderRadius: 8 }}
                formatter={(value) => [value.toFixed(2), 'Coefficient']}
              />
              <Bar dataKey="coef" fill="#00d25b" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ color: '#ff4757' }}>Top 15 Negative Words</h3>
          <p style={{ color: '#666', fontSize: 12, marginTop: -8, marginBottom: 16 }}>
            Higher absolute coefficient = stronger negative signal
          </p>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={negData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis type="number" stroke="#888" />
              <YAxis dataKey="word" type="category" stroke="#888" width={100} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #ff4757', borderRadius: 8 }}
                formatter={(value, name, props) => [props.payload.raw.toFixed(2), 'Coefficient']}
              />
              <Bar dataKey="coef" fill="#ff4757" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3>Word Impact Comparison</h3>
        <p style={{ color: '#666', fontSize: 12, marginTop: -8, marginBottom: 16 }}>
          How the model interprets different words — green means positive, red means negative
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {stats.top_features.positive.slice(0, 10).map((f, i) => (
            <div key={i} style={{
              padding: '10px 18px',
              background: `rgba(0,210,91,${0.1 + (f.coef / 10)})`,
              border: '1px solid rgba(0,210,91,0.3)',
              borderRadius: 20,
              color: '#00d25b',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              {f.word}
              <span style={{ fontSize: 11, opacity: 0.7 }}>+{f.coef.toFixed(1)}</span>
            </div>
          ))}
          {stats.top_features.negative.slice(0, 10).map((f, i) => (
            <div key={i} style={{
              padding: '10px 18px',
              background: `rgba(255,71,87,${0.1 + (Math.abs(f.coef) / 10)})`,
              border: '1px solid rgba(255,71,87,0.3)',
              borderRadius: 20,
              color: '#ff4757',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              {f.word}
              <span style={{ fontSize: 11, opacity: 0.7 }}>{f.coef.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
