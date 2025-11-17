# MOF Water Capture - Model Performance Report

**Date**: 2025-11-17T21-17-06
**Dataset**: MOF Materials for Atmospheric Water Capture
**Samples**: 7 MOF materials
**Features**: 8 (surface_area_m2g, pore_volume_cm3g, pore_size_angstrom, hydrophilicity, thermal_stability_K, cost_per_kg, max_water_uptake, daily_water_yield)
**Target**: Water uptake classification

## Model Results

| Model   |   Accuracy |
|:--------|-----------:|
| RFC     |   0.333333 |
| XGBoost |   0.666667 |
| LR      |   1        |

## Dataset Info
- **Source**: https://github.com/ModelEarth/grid/tree/main/water/capture/mof
- **Features CSV**: mof-features.csv
- **Targets CSV**: mof-targets-water-uptake.csv
