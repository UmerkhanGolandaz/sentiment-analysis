const modelStats = {
  dataset: {
    total_reviews: 46173,
    clean_reviews: 38260,
    removed_neutral: 7913,
    train_size: 30608,
    test_size: 7652,
    features: 50000,
    columns: ['Ratings', 'Reviews', 'movie_name', 'Resenhas', 'genres', 'Description', 'emotion'],
    num_columns: 7
  },
  bias: {
    emotions: {
      sadness: 17339, joy: 7861, anticipation: 7336, optimism: 4812,
      anger: 3638, fear: 3460, disgust: 1670, surprise: 57
    },
    emotion_pct: {
      sadness: 37.6, joy: 17.0, anticipation: 15.9, optimism: 10.4,
      anger: 7.9, fear: 7.5, disgust: 3.6, surprise: 0.1
    },
    imbalance_ratio: 304.2,
    sentiment_counts: { negative: 16324, positive: 21936 },
    sentiment_pct: { negative: 42.7, positive: 57.3 },
    ratings: {
      '1': 3009, '2': 4272, '3': 4335, '4': 4708, '5': 4021,
      '6': 3892, '7': 4798, '8': 5358, '9': 4810, '10': 6970
    }
  },
  models: {
    no_reg: {
      name: 'No Regularization (C=1e9)',
      train_acc: 1.0000, test_acc: 0.9664, overfit_gap: 0.0336,
      confusion_matrix: [[3136, 129], [128, 4259]],
      roc: { auc: 0.9930 },
      report: {
        Negative: { precision: 0.96, recall: 0.96, 'f1-score': 0.96 },
        Positive: { precision: 0.97, recall: 0.97, 'f1-score': 0.97 }
      }
    },
    l2: {
      name: 'L2 Regularization (C=1.0)',
      train_acc: 0.9768, test_acc: 0.9548, overfit_gap: 0.0220,
      confusion_matrix: [[3091, 174], [172, 4215]],
      roc: { auc: 0.9900 },
      report: {
        Negative: { precision: 0.95, recall: 0.95, 'f1-score': 0.95 },
        Positive: { precision: 0.96, recall: 0.96, 'f1-score': 0.96 }
      }
    },
    l1: {
      name: 'L1 Regularization (C=1.0)',
      train_acc: 0.9518, test_acc: 0.9361, overfit_gap: 0.0157,
      confusion_matrix: [[3044, 221], [268, 4119]],
      roc: { auc: 0.9820 },
      report: {
        Negative: { precision: 0.92, recall: 0.93, 'f1-score': 0.93 },
        Positive: { precision: 0.95, recall: 0.94, 'f1-score': 0.94 }
      }
    }
  },
  sparsity: {
    total_features: 50000,
    no_reg_zeros: 0,
    l2_zeros: 0,
    l1_zeros: 48904
  },
  top_features: {
    positive: [
      { word: 'great', coef: 8.0891 }, { word: 'loved', coef: 5.4155 },
      { word: 'fun', coef: 5.3428 }, { word: 'perfect', coef: 5.2364 },
      { word: 'amazing', coef: 5.2213 }, { word: 'excellent', coef: 4.8771 },
      { word: 'enjoyed', coef: 4.7807 }, { word: 'reviews', coef: 4.4341 },
      { word: 'fantastic', coef: 4.2091 }, { word: 'definitely', coef: 4.1855 },
      { word: 'liked', coef: 4.0325 }, { word: 'wonderful', coef: 3.9031 },
      { word: 'entertaining', coef: 3.8643 }, { word: 'beautiful', coef: 3.8237 },
      { word: 'superb', coef: 3.8053 }
    ],
    negative: [
      { word: 'worst', coef: -7.4148 }, { word: 'boring', coef: -6.4234 },
      { word: 'awful', coef: -5.8544 }, { word: 'bad', coef: -5.4407 },
      { word: 'terrible', coef: -5.4053 }, { word: 'waste', coef: -5.3683 },
      { word: 'poor', coef: -4.7989 }, { word: 'wasted', coef: -4.7346 },
      { word: 'unfortunately', coef: -4.7108 }, { word: 'fails', coef: -4.5194 },
      { word: 'script', coef: -4.2495 }, { word: 'minutes', coef: -4.2089 },
      { word: 'money', coef: -4.1174 }, { word: 'horrible', coef: -4.0832 },
      { word: 'instead', coef: -3.9969 }
    ]
  },
  tuning: {
    results: [
      { C: 0.01, train: 0.9236, test: 0.9186 },
      { C: 0.1, train: 0.9448, test: 0.9352 },
      { C: 0.5, train: 0.9666, test: 0.9484 },
      { C: 1.0, train: 0.9768, test: 0.9548 },
      { C: 5.0, train: 0.9936, test: 0.9652 },
      { C: 10.0, train: 0.9981, test: 0.9681 },
      { C: 50.0, train: 1.0000, test: 0.9694 }
    ],
    best_C: 50.0,
    best_acc: 0.9694
  }
};

export default modelStats;
