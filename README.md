# StockSense AI

AI-powered inventory intelligence module for the StockSense Inventory Management System.

## Overview

StockSense AI analyzes inventory information and provides:

- Future demand prediction
- Days until stockout
- Stockout risk classification
- Recommended reorder quantity

The current MVP uses a Random Forest Regression model trained on simulated inventory data.

## AI Model

### Algorithm

Random Forest Regressor

### Input Features

The model uses:

1. Current stock
2. Average daily usage
3. Supplier lead time
4. Reorder level

### Output

The prediction module returns:

- `predicted_demand`
- `days_until_stockout`
- `stockout_risk`
- `recommended_reorder`

## Example

Input:

```text
Current stock: 120
Daily usage: 20
Supplier lead time: 5 days
Reorder level: 100