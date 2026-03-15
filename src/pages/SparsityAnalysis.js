import stats from '../data/modelStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SparsityAnalysis() {
  const s = stats.sparsity;

  const sparsityData = [
    {
      name: 'No Reg',
      zeros: s.no_reg_zeros,
      active: s.total_features - s.no_reg_zeros,
      zeroPct: ((s.no_reg_zeros / s.total_features) * 100).toFixed(1),
      activePct: (((s.total_features - s.no_reg_zeros) / s.total_features) * 100).toFixed(1),
    },
    {
      name: 'L2',
      zeros: s.l2_zeros,
      active: s.total_features - s.l2_zeros,
      zeroPct: ((s.l2_zeros / s.total_features) * 100).toFixed(1),
      activePct: (((s.total_features - s.l2_zeros) / s.total_features) * 100).toFixed(1),
    },
    {
      name: 'L1',
      zeros: s.l1_zeros,
      active: s.total_features - s.l1_zeros,
      zeroPct: ((s.l1_zeros / s.total_features) * 100).toFixed(1),
      activePct: (((s.total_features - s.l1_zeros) / s.total_features) * 100).toFixed(1),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Sparsity Analysis</h1>
        <p>L1 regularization drives feature weights to exactly zero, creating sparse models</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-value">{s.total_features.toLocaleString()}</div>
          <div className="stat-label">Total Features</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ff4757' }}>{s.l1_zeros.toLocaleString()}</div>
          <div className="stat-label">L1 Zero Coefficients</div>
          <span className="badge badge-red" style={{ marginTop: 8 }}>
            {((s.l1_zeros / s.total_features) * 100).toFixed(1)}% SPARSE
          </span>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#00d25b' }}>{(s.total_features - s.l1_zeros).toLocaleString()}</div>
          <div className="stat-label">L1 Active Features</div>
          <span className="badge badge-green" style={{ marginTop: 8 }}>
            {(((s.total_features - s.l1_zeros) / s.total_features) * 100).toFixed(1)}% KEPT
          </span>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3>Zero vs Active Coefficients</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sparsityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis type="number" stroke="#888" />
              <YAxis dataKey="name" type="category" stroke="#888" width={60} />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #6c63ff', borderRadius: 8 }}
                formatter={(value) => [value.toLocaleString(), '']}
              />
              <Bar dataKey="active" name="Active Features" fill="#00d25b" stackId="stack" radius={[0, 0, 0, 0]} />
              <Bar dataKey="zeros" name="Zero Features" fill="#ff4757" stackId="stack" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Sparsity Breakdown</h3>
          {sparsityData.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{item.name}</span>
                <span style={{ color: '#888', fontSize: 13 }}>
                  {item.zeros.toLocaleString()} zeros / {s.total_features.toLocaleString()} total
                </span>
              </div>
              <div style={{
                width: '100%', height: 24, background: 'rgba(0,210,91,0.15)',
                borderRadius: 8, overflow: 'hidden', position: 'relative'
              }}>
                <div style={{
                  width: `${item.zeroPct}%`, height: '100%',
                  background: 'linear-gradient(90deg, #ff4757, #ff6b81)',
                  borderRadius: 8, transition: 'width 1s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#fff'
                }}>
                  {Number(item.zeroPct) > 5 ? `${item.zeroPct}% zeros` : ''}
                </div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 24, padding: 16, background: 'rgba(108,99,255,0.05)', borderRadius: 10, border: '1px solid rgba(108,99,255,0.15)' }}>
            <h3 style={{ fontSize: 14, marginBottom: 8 }}>Key Insight</h3>
            <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.7 }}>
              <strong style={{ color: '#6c63ff' }}>L1 (Lasso)</strong> drives 97.8% of features to exactly zero —
              only {(s.total_features - s.l1_zeros).toLocaleString()} words matter for prediction.
              This is <strong>feature selection</strong>.
              <br /><br />
              <strong style={{ color: '#00d2ff' }}>L2 (Ridge)</strong> keeps all features but shrinks their weights —
              creating a <strong>dense model</strong> where every word contributes a little.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
