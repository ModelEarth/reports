# Eye Blinks Multi-Model Comparison - Timing Analysis

## Total Runtime Breakdown

### Data Processing (Estimated)
- Data loading and preprocessing: ~30 seconds
- Train/test split: <1 second

### Model Training Times (Measured)
- Random Bits Forest (RBF): 241.19 seconds
- XGBoost (XGB): 0.92 seconds  
- Random Forest Classifier (RFC): 1.25 seconds
- Logistic Regression (LR): 4.36 seconds

### Analysis & Visualization (Estimated)
- Feature importance calculation: ~60 seconds
- ROC curves generation: ~15 seconds
- Confusion matrices: ~10 seconds  
- Training time chart: ~5 seconds
- Metrics dashboard: ~10 seconds
- HTML dashboard creation: ~10 seconds

### Total Estimated Runtime
**~377 seconds (6.3 minutes)**

## Key Observations

1. **RBF dominates total time** - 241s of 377s (64% of total runtime)
2. **Other models are very fast** - Combined <7 seconds for RFC+XGB+LR
3. **Analysis overhead** - ~125 seconds for feature importance and visualizations
4. **RBF's longer training time justified** by superior accuracy (94.29% vs 90.22%)

## Performance vs Time Tradeoff

| Model | Accuracy | Training Time | Time/Accuracy Ratio |
|-------|----------|---------------|-------------------|
| RBF   | 94.29%   | 241.19s      | 2.56s per 1%     |
| XGB   | 90.22%   | 0.92s        | 0.01s per 1%     |
| RFC   | 85.55%   | 1.25s        | 0.01s per 1%     |
| LR    | 63.48%   | 4.36s        | 0.07s per 1%     |

**Recommendation:** Use XGBoost for real-time applications, RBF for highest accuracy requirements.

Generated: 2025-11-12 21:52:11
