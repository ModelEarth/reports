# Tree Canopy Multi-Model Analysis

Comprehensive ML analysis comparing 4 models for forest canopy density prediction.

## Models Tested
- ✅ Random Forest Classifier (96.33% accuracy) - BEST
- ✅ XGBoost (95.72% accuracy, 0.66s training) - FASTEST
- ✅ Logistic Regression (91.55% accuracy)
- ✅ Random Bits Forest (85.22% accuracy, 100% recall)

## Key Findings
- RFC achieves highest accuracy for critical forest management applications
- XGBoost offers best speed/accuracy balance (11.7x faster with only 0.6% accuracy drop)
- Tree density varies significantly with elevation, slope, and aspect
- Moderate slopes show optimal conditions for dense canopy

## Files
- `TREE_CANOPY_REPORT.md` - Full analysis report
- `tree_canopy_dashboard.png` - Visual summary
- `tree_canopy_roc_curves.png` - Model ROC comparison
- `tree_density_by_elevation.csv` - Altitude analysis
- `tree_density_by_slope.csv` - Terrain analysis
- `tree_density_by_aspect.csv` - Direction analysis
- `tree_canopy_model_metrics.csv` - Model performance data

**Analysis by:** Akhil Guska  
**Date:** November 12, 2025  
**Project:** ModelEarth ML Pipeline
```

6. Click **"Commit new file"**

---

### **Step 2: Upload Tree Canopy Files**

1. Click into the `tree-canopy-all-models-2025-11-12` folder you just created
2. Click **"Add file"** → **"Upload files"**
3. Drag and drop ALL 7 Tree Canopy files:
   - tree_density_by_elevation.csv
   - tree_density_by_slope.csv
   - tree_density_by_aspect.csv
   - tree_canopy_model_metrics.csv
   - TREE_CANOPY_REPORT.md
   - tree_canopy_dashboard.png
   - tree_canopy_roc_curves.png
4. Commit message: `Add tree canopy multi-model analysis with density reports`
5. Click **"Commit changes"**

---

### **Step 3: Add Timing Analysis to Eye Blinks**

1. Go back to `2025` folder
2. Click into: `eye-blinks-all-models-2025-11-06` folder
3. Click **"Add file"** → **"Upload files"**
4. Upload: `TIMING_ANALYSIS.md`
5. Commit message: `Add timing analysis report`
6. Click **"Commit changes"**

---

### **Step 4: Verify Everything is Uploaded**

Check that these URLs work:
- https://github.com/akhilaguska27/reports/tree/main/2025/tree-canopy-all-models-2025-11-12
- https://github.com/akhilaguska27/reports/blob/main/2025/tree-canopy-all-models-2025-11-12/TREE_CANOPY_REPORT.md
- https://github.com/akhilaguska27/reports/blob/main/2025/eye-blinks-all-models-2025-11-06/TIMING_ANALYSIS.md

---
