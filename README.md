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

## 🏗️ Project Architecture & Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER (Browser)                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Frontend (CRA)                    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │  │
│  │  │Dashboard │ │ Predict  │ │  Bias    │ │ Model  │ │  │
│  │  │  Page    │ │  Page    │ │ Analysis │ │ Compare│ │  │
│  │  ├──────────┤ ├──────────┤ ├──────────┤ ├────────┤ │  │
│  │  │ Sparsity │ │   Top    │ │           │ │        │ │  │
│  │  │ Analysis │ │ Features │ │           │ │        │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │  │
│  │                        │                            │  │
│  │              ┌─────────┴──────────┐                 │  │
│  │              │  Axios / Fetch     │                 │  │
│  │              │  API Client        │                 │  │
│  │              └─────────┬──────────┘                 │  │
│  └────────────────────────┼────────────────────────────┘  │
└───────────────────────────┼────────────────────────────────┘
                            │ POST /api/predict
                            │ { "review": "text..." }
                            ▼
              ┌───────────────────────────────┐
              │   Python Backend (Flask)      │
              │   Running on localhost:5000    │
              │   or Render (free tier)       │
              └───────────────┬───────────────┘
                              │
              ┌───────────────▼───────────────┐
              │   Trained Logistic Regression │
              │   Model (L2 Regularized)      │
              │   + TF-IDF Vectorizer         │
              └───────────────────────────────┘
```

### 🔄 Complete Workflow

#### 1️⃣ Data Collection & Preprocessing
- **Dataset:** 46,173 movie reviews from a public dataset
- **7 columns:** Ratings (1–10), Reviews (text), movie_name, Resenhas, genres, Description, emotion
- **Cleaning:** Removed duplicates and noisy entries → **38,260 clean reviews**
- **Neutral Removal:** Removed 7,913 neutral reviews (ratings 5 & 6) to create a binary classification task
- **Label Assignment:** Ratings ≤ 4 → **Negative**, Ratings ≥ 7 → **Positive**
- **Final Split:** 30,608 training samples / 7,652 test samples

#### 2️⃣ Feature Engineering
- **TF-IDF Vectorization** (Term Frequency — Inverse Document Frequency)
- Extracts **50,000 features** from the review text
- Captures the importance of each word relative to the document and the entire corpus
- Converts raw text into numerical feature vectors for model training

#### 3️⃣ Model Training (3 Variants)
All models use **Logistic Regression** from scikit-learn with different regularization strategies:

- **No Regularization (C=1e9):** Maximum likelihood estimation without penalty. Perfect training accuracy (100%) but slight overfitting (3.36% gap).
- **L2 Regularization / Ridge (C=1.0):** Adds squared coefficient magnitude penalty. Best balance — 97.68% train / 95.48% test with only 2.20% overfit gap.
- **L1 Regularization / Lasso (C=1.0):** Adds absolute coefficient magnitude penalty. Produces **97.8% sparsity** (48,904 of 50,000 coefficients forced to zero), making it memory-efficient but slightly less accurate.

#### 4️⃣ Hyperparameter Tuning
- Tested C values from 0.01 to 50.0
- **Best configuration:** C = 50.0 with L2 regularization → **96.94% test accuracy**
- Results show clear trade-off: higher C → higher train accuracy but increased overfitting

#### 5️⃣ Frontend Visualization
The React dashboard visualizes all training results through 6 interactive pages:

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
