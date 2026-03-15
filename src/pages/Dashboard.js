import stats from '../data/modelStats';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6c63ff', '#00d2ff', '#00d25b', '#ff4757'];

export default function Dashboard() {
  const accuracyData = [
    { name: 'No Reg', train: stats.models.no_reg.train_acc * 100, test: stats.models.no_reg.test_acc * 100 },
    { name: 'L2', train: stats.models.l2.train_acc * 100, test: stats.models.l2.test_acc * 100 },
    { name: 'L1', train: stats.models.l1.train_acc * 100, test: stats.models.l1.test_acc * 100 },
  ];

  const sentimentData = [
    { name: 'Positive', value: stats.bias.sentiment_counts.positive },
    { name: 'Negative', value: stats.bias.sentiment_counts.negative },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Sentiment Analysis using Logistic Regression with L1/L2 Regularization</p>
      </div>

      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(108,99,255,0.15)' }}>
            <span role="img" aria-label="data">📊</span>
          </div>
          <div className="stat-value">{stats.dataset.total_reviews.toLocaleString()}</div>
          <div className="stat-label">Total Reviews</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0,210,91,0.15)' }}>
            <span role="img" aria-label="accuracy">🎯</span>
          </div>
          <div className="stat-value">{(stats.tuning.best_acc * 100).toFixed(1)}%</div>
          <div className="stat-label">Best Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0,210,255,0.15)' }}>
            <span role="img" aria-label="features">🔤</span>
          </div>
          <div className="stat-value">{(stats.dataset.features / 1000).toFixed(0)}K</div>
          <div className="stat-label">TF-IDF Features</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255,71,87,0.15)' }}>
            <span role="img" aria-label="columns">📋</span>
          </div>
          <div className="stat-value">{stats.dataset.num_columns}</div>
          <div className="stat-label">Dataset Columns</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h3>Model Accuracy Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis domain={[85, 100]} stroke="#888" />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #6c63ff', borderRadius: 8 }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="train" name="Train" fill="#6c63ff" radius={[6, 6, 0, 0]} />
              <Bar dataKey="test" name="Test" fill="#00d2ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {sentimentData.map((_, index) => (
                  <Cell key={index} fill={index === 0 ? '#00d25b' : '#ff4757'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid #6c63ff', borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-3">
        {Object.entries(stats.models).map(([key, model]) => (
          <div className="card" key={key}>
            <h3>{model.name}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#888', fontSize: 13 }}>Train Accuracy</span>
              <span className="badge badge-blue">{(model.train_acc * 100).toFixed(2)}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#888', fontSize: 13 }}>Test Accuracy</span>
              <span className="badge badge-green">{(model.test_acc * 100).toFixed(2)}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#888', fontSize: 13 }}>Overfit Gap</span>
              <span className={`badge ${model.overfit_gap > 0.03 ? 'badge-red' : 'badge-orange'}`}>
                {(model.overfit_gap * 100).toFixed(2)}%
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888', fontSize: 13 }}>AUC Score</span>
              <span className="badge badge-blue">{model.roc.auc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
