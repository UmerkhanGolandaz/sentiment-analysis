# 🎬 Sentiment Analysis - Movie Review Classifier

A comprehensive **Machine Learning-powered Sentiment Analysis** dashboard for movie reviews. This project trains **Logistic Regression** models (with and without regularization) on **46,173 movie reviews** to classify sentiment as **Positive** or **Negative**. The frontend provides an interactive dashboard to explore model performance, bias analysis, sparsity insights, top feature words, and live predictions.

> **Live Demo:** [UmerkhanGolandaz.github.io/sentiment-analysis](https://UmerkhanGolandaz.github.io/sentiment-analysis)

---

## 🧠 Project Overview

The goal of this project is to build, compare, and analyze **Logistic Regression classifiers** for sentiment analysis on movie reviews. Three variants are trained:

| Model | Train Accuracy | Test Accuracy | Overfit Gap | AUC Score | Sparsity |
|-------|---------------|--------------|-------------|-----------|----------|
| No Regularization (C=1e9) | 100.00% | 96.64% | 3.36% | 0.993 | 0% (dense) |
| L2 Regularization (Ridge) | 97.68% | 95.48% | 2.20% | 0.990 | 0% (dense) |
| L1 Regularization (Lasso) | 95.18% | 93.61% | 1.57% | 0.982 | **97.8% sparse** |

The project also addresses a critical **data bias problem** — the original emotion labels had a **304× imbalance** (Sadness: 17,339 vs Surprise: 57), which was resolved by switching to **rating-based labels** (1–10), improving both balance (1.34×) and accuracy (~71% → ~97%).

---

## 🏗️ Project Architecture

The project follows a **two-phase architecture**: an offline ML training pipeline produces model artifacts, and a React SPA consumes those results both via hardcoded stats and a live prediction API.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PHASE 1: OFFLINE ML PIPELINE                     │
│                                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────────────────────┐  │
│  │  Raw Dataset  │───▶│ Preprocessing│───▶│  TF-IDF Vectorization    │  │
│  │  46,173 rows  │    │ → Clean      │    │  50,000 features         │  │
│  │  7 columns    │    │ → Remove     │    │  Text → Numeric vectors  │  │
│  │               │    │   neutral    │    │                           │  │
│  └──────────────┘    └──────────────┘    └──────────────┬────────────┘  │
│                                                         │               │
│                                                         ▼               │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                  Model Training (Logistic Regression)            │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │   │
│  │  │  No Regularization│  │  L2 (Ridge)      │  │  L1 (Lasso)  │  │   │
│  │  │  C = 1e9         │  │  C = 1.0         │  │  C = 1.0     │  │   │
│  │  │  100% train      │  │  97.68% train    │  │  95.18% train│  │   │
│  │  │  96.64% test     │  │  95.48% test     │  │  93.61% test │  │   │
│  │  └──────────────────┘  └──────────────────┘  └───────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    Artifacts Exported                            │   │
│  │  ┌──────────────────────┐  ┌──────────────────────────────────┐  │   │
│  │  │  modelStats.js       │  │  Trained Model + TF-IDF Vectorizer│  │   │
│  │  │  (Hardcoded JS obj)  │  │  (serialized via pickle)         │  │   │
│  │  └──────────┬───────────┘  └───────────────┬──────────────────┘  │   │
│  └─────────────┼──────────────────────────────┼──────────────────────┘   │
└────────────────┼──────────────────────────────┼──────────────────────────┘
                 │                              │
                 ▼                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PHASE 2: REACT FRONTEND (SPA)                     │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                          App.js (Root)                          │   │
│  │           State-based page routing via activePage state          │   │
│  └──────────┬───────────┬──────────┬──────────┬──────────┬─────────┘   │
│             │           │          │          │          │             │
│             ▼           ▼          ▼          ▼          ▼             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │Dashboard │ │  Bias    │ │  Model   │ │ Sparsity │ │   Top    │     │
│  │          │ │ Analysis │ │Comparison│ │ Analysis │ │ Features │     │
│  │  Reads   │ │  Reads   │ │  Reads   │ │  Reads   │ │  Reads   │     │
│  │ from     │ │ from     │ │ from     │ │ from     │ │ from     │     │
│  │modelStats│ │modelStats│ │modelStats│ │modelStats│ │modelStats│     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  Predict Page (Live API Consumer)                               │   │
│  │                                                                  │   │
│  │  ┌──────────┐         POST /api/predict         ┌────────────┐  │   │
│  │  │  User    │ ──────────────────────────────────▶│   Flask    │  │   │
│  │  │  Types   │  { "review": "amazing movie..." }  │  Backend   │  │   │
│  │  │  Review  │◀──────────────────────────────────│ localhost: │  │   │
│  │  └──────────┘  { sentiment, confidence, ... }    │   5000     │  │   │
│  │                                                   └─────┬──────┘  │   │
│  │                                                         │         │   │
│  │                                                   ┌─────▼──────┐  │   │
│  │                                                   │  Pretrained│  │   │
│  │                                                   │   Model    │  │   │
│  │                                                   │  + TF-IDF  │  │   │
│  │                                                   └────────────┘  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │              Sidebar (Navigation Component)                     │   │
│  │   Dashboard │ Live Prediction │ Bias Analysis │ Model Comparison│   │
│  │   Sparsity Analysis │ Top Features                              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

### 🔄 Complete Workflow

The project operates in two distinct phases:

---

#### PHASE 1 — OFFLINE ML TRAINING (Python / scikit-learn)

This phase is executed outside the frontend repo (in a Jupyter Notebook or Python script) and produces all the data consumed by the React app.

##### Step 1: Data Collection & Preprocessing
| Stage | Detail |
|-------|--------|
| **Raw Dataset** | 46,173 movie reviews with 7 columns: `Ratings`, `Reviews`, `movie_name`, `Resenhas`, `genres`, `Description`, `emotion` |
| **Cleaning** | Remove duplicates, missing values, and noisy entries → **38,260 clean reviews** |
| **Neutral Removal** | Remove 7,913 neutral reviews (ratings 5 & 6) to create a clean binary classification task |
| **Label Assignment** | Ratings 1–4 → **Negative**, Ratings 7–10 → **Positive** |
| **Train/Test Split** | 30,608 training samples (80%) / 7,652 test samples (20%) |

##### Step 2: Feature Engineering — TF-IDF Vectorization
Text data is converted into numerical feature vectors using **TF-IDF (Term Frequency — Inverse Document Frequency)**:

- **Term Frequency (TF):** Measures how frequently a word appears in a review — `TF(t) = (Number of times term t appears) / (Total terms in document)`
- **Inverse Document Frequency (IDF):** Down-weights words that appear frequently across all reviews — `IDF(t) = log(Total documents / Documents containing term t)`
- **TF-IDF Score:** `TF-IDF(t) = TF(t) × IDF(t)` — higher values indicate words that are important to a specific review but rare across the corpus
- **Output:** A sparse matrix of shape `(38,260 × 50,000)` — each review is now a 50,000-dimensional numerical vector

##### Step 3: Model Training (3 Logistic Regression Variants)
Three Logistic Regression classifiers are trained on the TF-IDF vectors:

```
Logistic Regression minimizes:  L(θ) = -Σ[ y⋅log(h(x)) + (1-y)⋅log(1-h(x)) ] + λ⋅R(θ)
                                                                           ↑
                                                              Regularization term
```

| Model | Regularizer `R(θ)` | C (inverse reg strength) | Effect |
|-------|-------------------|-------------------------|--------|
| **No Regularization** | 0 (none) | 1e9 | Maximizes training fit; highest variance |
| **L2 (Ridge)** | ‖θ‖₂² = Σθⱼ² | 1.0 | Penalizes large coefficients; shrinks weights evenly |
| **L1 (Lasso)** | ‖θ‖₁ = Σ\|θⱼ\| | 1.0 | Penalizes absolute magnitude; forces many weights to **exactly zero** |

##### Step 4: Hyperparameter Tuning
- C values tested: `[0.01, 0.1, 0.5, 1.0, 5.0, 10.0, 50.0]`
- Lower C → stronger regularization → lower train accuracy, less overfitting
- Higher C → weaker regularization → higher train accuracy, more overfitting
- **Best found:** C = 50.0 with L2 → **96.94% test accuracy**

##### Step 5: Artifact Export
The training pipeline produces two artifacts:

1. **`modelStats.js`** — All metrics, coefficients, confusion matrices, and tuning results are hardcoded into a JavaScript object for dashboard rendering
2. **Pickled Model + Vectorizer** — The best model (L2, C=1.0) and TF-IDF vectorizer are serialized for the Flask backend to serve live predictions

---

#### PHASE 2 — FRONTEND RENDERING (React SPA)

The React app consumes Phase 1 artifacts in two distinct ways:

##### Pages that read from `modelStats.js` (hardcoded data)
These 5 pages render pre-computed results directly — no API calls needed:

| Page | Data Displayed | Source in modelStats.js |
|------|---------------|----------------------|
| **Dashboard** | Stat cards, accuracy bar chart, sentiment donut, model cards | `dataset`, `models`, `bias.sentiment_pct` |
| **Bias Analysis** | Emotion distribution, ratings distribution, sentiment split | `bias.*` |
| **Model Comparison** | 3 model cards with metrics + confusion matrices + tuning chart | `models.*`, `tuning.*` |
| **Sparsity Analysis** | Zero coefficient counts across models | `sparsity.*` |
| **Top Features** | Top 15 positive & negative words with coefficients | `top_features.*` |

##### Page that calls the live API (Predict)
The **Predict** page sends a `POST` request to the Flask backend:
```
POST http://localhost:5000/api/predict
Content-Type: application/json

{ "review": "This movie was absolutely amazing!" }
```
The Flask backend loads the pretrained model + TF-IDF vectorizer, vectorizes the input, runs prediction, and returns:
```json
{
  "sentiment": "Positive",
  "confidence": 98.5,
  "positive_prob": 98.5,
  "negative_prob": 1.5,
  "word_count": 6
}
```

---

## 📂 Project Structure

```
sentiment-analysis/
├── public/                        # Static assets
│   ├── index.html                 # HTML entry point
│   ├── favicon.ico                # Browser icon
│   ├── manifest.json              # PWA manifest
│   └── robots.txt                 # Crawler rules
├── src/
│   ├── index.js                   # React DOM entry point
│   ├── index.css                  # Global base styles (dark theme)
│   ├── App.js                     # Root component with page routing
│   ├── App.css                    # Layout and component styles
│   ├── assets/
│   │   └── styles/                # Legacy styled-components (unused)
│   │       ├── global.js
│   │       └── variables/
│   │           ├── colors.js
│   │           └── metrics.js
│   ├── components/
│   │   ├── Sidebar.js             # Navigation sidebar
│   │   └── Sidebar.css            # Sidebar styles
│   ├── data/
│   │   └── modelStats.js          # All trained model statistics (hardcoded)
│   ├── pages/
│   │   ├── Dashboard.js           # Overview with stats, charts, model cards
│   │   ├── Predict.js             # Live prediction with API integration
│   │   ├── Predict.css            # Prediction page styles
│   │   ├── BiasAnalysis.js        # Data bias analysis with charts
│   │   ├── ModelComparison.js     # Side-by-side model comparison
│   │   ├── SparsityAnalysis.js    # L1 sparsity visualization
│   │   ├── TopFeatures.js         # Top positive/negative word coefficients
│   │   └── Welcome/               # Legacy welcome page (unused)
│   │       ├── index.js
│   │       └── styles.js
│   └── routes/                    # Legacy React Router config (unused)
│       ├── index.js
│       └── history.js
├── .editorconfig                  # Editor formatting rules
├── .gitignore                     # Git ignore rules
└── package.json                   # Node.js dependencies and scripts
```

---

## 🖥️ Pages & Features

### 1️⃣ Dashboard
- **4 stat cards:** Total Reviews (46,173), Best Accuracy (96.94%), TF-IDF Features (50K), Dataset Columns (7)
- **Train vs Test Accuracy** bar chart comparing all 3 models
- **Sentiment Distribution** donut chart (57.3% Positive / 42.7% Negative)
- **3 Model Performance Cards** with Train/Test Accuracy, Overfit Gap, AUC Score

### 2️⃣ Live Prediction
- Text area for entering movie reviews
- **5 example reviews** for quick testing
- Sends `POST` request to `http://localhost:5000/api/predict`
- Displays: Sentiment (😊/😞), Confidence %, Positive/Negative Probabilities, Word Count
- Error handling for free-tier backend wake-up delays (~30s)

### 3️⃣ Data Bias Analysis
- Original emotion label distribution (Sadness dominated → 304× imbalance)
- Switch to rating-based labels (1–10) → balance improved to 1.34×
- Emotion distribution bar chart, Ratings distribution bar chart, Sentiment donut chart

### 4️⃣ Model Comparison
- Side-by-side comparison of all 3 models
- Each card: Precision, Recall, F1-Score, Overfit Gap, Confusion Matrix
- Hyperparameter tuning chart (C values 0.01 → 50.0)

### 5️⃣ Sparsity Analysis
- Total features: 50,000
- No Reg: 0 zeros (dense)
- L2: 0 zeros (dense)
- **L1: 48,904 zeros (97.8% sparse)** — L1 forces most coefficients to exactly zero

### 6️⃣ Top Features
- **Top 15 Positive Words:** great (8.09), loved (5.42), fun (5.34), perfect (5.24), amazing (5.22), excellent (4.88), enjoyed (4.78), fantastic (4.21), wonderful (3.90), etc.
- **Top 15 Negative Words:** worst (-7.41), boring (-6.42), awful (-5.85), bad (-5.44), terrible (-5.41), waste (-5.37), poor (-4.80), horrible (-4.08), etc.

---

## 🛠️ Tech Stack

### Frontend (This Repository)
| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework for building component-based interfaces |
| **Create React App** | Project scaffolding and build tooling (Webpack, Babel, ESLint) |
| **React DOM** | DOM rendering and reconciliation |
| **Axios** | HTTP client for API requests (though `fetch` is used in Predict.js) |
| **React Router DOM** | Client-side routing (legacy — not currently used) |
| **Recharts** | Charting library for bar, pie, and line charts |
| **Lucide React** | Lightweight icon library |
| **React Icons** | Icon library (Feather Icons used in sidebar) |
| **CSS3** | Styling with dark theme, custom properties, responsive design |
| **GitHub Pages** | Static site hosting and deployment |

### Machine Learning Backend (External)
| Technology | Purpose |
|-----------|---------|
| **Python 3** | Programming language for ML pipeline |
| **Flask** | Lightweight web framework for REST API |
| **scikit-learn** | ML library — Logistic Regression, TF-IDF Vectorizer, model evaluation |
| **Pandas** | Data manipulation and preprocessing |
| **NumPy** | Numerical computing |
| **Matplotlib / Seaborn** | Data visualization (for offline analysis) |
| **Jupyter Notebook** | Exploratory analysis and prototyping |

### Deployment & DevOps
| Technology | Purpose |
|-----------|---------|
| **npm / Node.js** | Package management and build scripts |
| **Git** | Version control |
| **GitHub** | Code hosting and collaboration |
| **GitHub Pages** | Frontend hosting — automated via `gh-pages` package |
| **Render / Heroku** | Backend API hosting (free tier with cold starts) |
| **EditorConfig** | Cross-editor formatting consistency |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/UmerkhanGolandaz/sentiment-analysis.git
cd sentiment-analysis

# Install dependencies
npm install

# Start development server
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
```

Builds the app to the `build/` folder.

### Deploy to GitHub Pages

```bash
npm run deploy
```

Deploys the `build/` folder to the `gh-pages` branch.

---

## 🔌 API Reference

### `POST /api/predict`

Predict sentiment for a movie review.

**Request Body:**
```json
{
  "review": "This movie was absolutely amazing!"
}
```

**Response:**
```json
{
  "sentiment": "Positive",
  "confidence": 98.5,
  "positive_prob": 98.5,
  "negative_prob": 1.5,
  "word_count": 6
}
```

| Field | Type | Description |
|-------|------|-------------|
| `sentiment` | string | "Positive" or "Negative" |
| `confidence` | number | Confidence percentage (0–100) |
| `positive_prob` | number | Probability of positive class |
| `negative_prob` | number | Probability of negative class |
| `word_count` | number | Number of words in review |

---

## 📊 Key Results

### Model Performance Summary
| Metric | No Regularization | L2 (Ridge) | L1 (Lasso) |
|--------|-------------------|-------------|-------------|
| Train Accuracy | 100.00% | 97.68% | 95.18% |
| Test Accuracy | 96.64% | 95.48% | 93.61% |
| Overfit Gap | 3.36% | 2.20% | 1.57% |
| AUC Score | 0.993 | 0.990 | 0.982 |
| Negative Precision | 0.96 | 0.95 | 0.92 |
| Negative Recall | 0.96 | 0.95 | 0.93 |
| Positive Precision | 0.97 | 0.96 | 0.95 |
| Positive Recall | 0.97 | 0.96 | 0.94 |
| Zeros (Sparsity) | 0 | 0 | 48,904 (97.8%) |

### Data Bias Resolution
| Metric | Before (Emotion Labels) | After (Rating Labels) |
|--------|------------------------|----------------------|
| Most Common | Sadness: 17,339 | Rating 10: 6,970 |
| Least Common | Surprise: 57 | Rating 6: 3,892 |
| Imbalance Ratio | **304.2×** | **1.34×** |
| Model Accuracy | ~71% | ~97% |

---

## 📝 License

This project is developed as a **Machine Learning course project** submitted to **Prof. Richa Agnihotri**.

---

## 👨‍💻 Author

**Umerkhan Golandaz**

- GitHub: [@UmerkhanGolandaz](https://github.com/UmerkhanGolandaz)
- Project: [github.com/UmerkhanGolandaz/sentiment-analysis](https://github.com/UmerkhanGolandaz/sentiment-analysis)
