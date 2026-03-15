import stats from '../data/modelStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

export default function ModelComparison() {
  const accuracyData = Object.entries(stats.models).map(([key, model]) => ({
    name: key === 'no_reg' ? 'No Reg' : key.toUpperCase(),
    fullName: model.name,
    train: +(model.train_acc * 100).toFixed(2),
    test: +(model.test_acc * 100).toFixed(2),
    gap: +(model.overfit_gap * 100).toFixed(2),
  }));

  const tuningData = stats.tuning.results.map(r => ({
    C: `C=${r.C}`,
    train: +(r.train * 100).toFixed(2),
    test: +(r.test * 100).toFixed(2),
  }));

  return (
    <div>
      <div className="page-header">
        <h1>Model Comparison</h1>
        <p>Compare No Regularization vs L1 vs L2 — overfitting analysis and confusion matrices</p>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {Object.entries(stats.models).map(([key, model]) => (
          <div className="card" key={key}>
            <h3 style={{ fontSize: 14, marginBottom: 16 }}>{model.name}</h3>

            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 42, fontWeight: 800, color: '#fff' }}>
                {(model.test_acc * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: '#888' }}>Test Accuracy</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Precision</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#6c63ff' }}>
                  {model.report.Positive.precision.toFixed(2)}
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Recall</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#00d2ff' }}>
                  {model.report.Positive.recall.toFixed(2)}
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>F1-Score</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#00d25b' }}>
                  {model.report.Positive['f1-score'].toFixed(2)}
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Overfit Gap</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: model.overfit_gap > 0.03 ? '#ff4757' : '#ffa500' }}>
                  {(model.overfit_gap * 100).toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Confusion Matrix */}
            <h3 style={{ marginTop: 16, fontSize: 13 }}>Confusion Matrix</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
              <thead>
                <tr>
                  <th style={{ padding: 6, fontSize: 11, color: '#666' }}></th>
                  <th style={{ padding: 6, fontSize: 11, color: '#888', textAlign: 'center' }}>Pred Neg</th>
                  <th style={{ padding: 6, fontSize: 11, color: '#888', textAlign: 'center' }}>Pred Pos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: 6, fontSize: 11, color: '#888' }}>Actual Neg</td>
                  <td style={{
                    padding: 8, textAlign: 'center', fontWeight: 700, fontSize: 14,
                    background: 'rgba(0,210,91,0.1)', borderRadius: 4, color: '#00d25b'
                  }}>{model.confusion_matrix[0][0]}</td>
                  <td style={{
                    padding: 8, textAlign: 'center', fontWeight: 700, fontSize: 14,
                    background: 'rgba(255,71,87,0.05)', borderRadius: 4, color: '#ff4757'
                  }}>{model.confusion_matrix[0][1]}</td>
                </tr>
                <tr>
                  <td style={{ padding: 6, fontSize: 11, color: '#888' }}>Actual Pos</td>
                  <td style={{
                    padding: 8, textAlign: 'center', fontWeight: 700, fontSize: 14,
                    background: 'rgba(255,71,87,0.05)', borderRadius: 4, color: '#ff4757'
                  }}>{model.confusion_matrix[1][0]}</td>
                  <td style={{
                    padding: 8, textAlign: 'center', fontWeight: 700, fontSize: 14,
                    background: 'rgba(0,210,91,0.1)', borderRadius: 4, color: '#00d25b'
                  }}>{model.confusion_matrix[1][1]}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Train vs Test Accuracy</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis domain={[88, 101]} stroke="#888" />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #6c63ff', borderRadius: 8 }}
              />
              <Legend />
              <Bar dataKey="train" name="Train %" fill="#6c63ff" radius={[6, 6, 0, 0]} />
              <Bar dataKey="test" name="Test %" fill="#00d2ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Hyperparameter Tuning (C value)</h3>
          <p style={{ color: '#888', fontSize: 12, marginTop: -8, marginBottom: 12 }}>
            Best C = {stats.tuning.best_C} with {(stats.tuning.best_acc * 100).toFixed(2)}% accuracy
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={tuningData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="C" stroke="#888" tick={{ fontSize: 11 }} />
              <YAxis domain={[90, 101]} stroke="#888" />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #6c63ff', borderRadius: 8 }}
              />
              <Legend />
              <Line type="monotone" dataKey="train" name="Train %" stroke="#6c63ff" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="test" name="Test %" stroke="#00d2ff" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
