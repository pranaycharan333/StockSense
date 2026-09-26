import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor

# ============================================================
# STOCKSENSE - INVENTORY DEMAND FORECASTING MODEL
# ============================================================
#
# Features:
# 1. Current stock
# 2. Average daily usage
# 3. Supplier lead time
# 4. Reorder level
#
# Target:
# Future / predicted demand
#
# NOTE:
# This is MVP training data for the hackathon.
# Replace with real historical inventory data when available.
# ============================================================


# ------------------------------------------------------------
# TRAINING DATA
# ------------------------------------------------------------

X = np.array([
    # current_stock, daily_usage, lead_time, reorder_level

    [500, 20, 5, 100],
    [400, 25, 5, 100],
    [300, 30, 6, 120],
    [250, 35, 7, 150],
    [200, 40, 7, 150],
    [150, 45, 8, 180],
    [100, 50, 8, 200],

    [600, 15, 4, 80],
    [450, 18, 5, 100],
    [350, 22, 5, 100],
    [250, 28, 6, 120],
    [180, 35, 7, 150]
])


# Future demand corresponding to each training example
y = np.array([
    120,
    140,
    180,
    220,
    260,
    300,
    350,
    90,
    110,
    140,
    170,
    220
])


# ------------------------------------------------------------
# CREATE MODEL
# ------------------------------------------------------------

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)


# ------------------------------------------------------------
# TRAIN
# ------------------------------------------------------------

model.fit(X, y)


# ------------------------------------------------------------
# SAVE MODEL
# ------------------------------------------------------------

joblib.dump(model, "inventory_model.pkl")


print("======================================")
print(" StockSense AI Model")
print("======================================")
print("Model trained successfully!")
print("Model saved as: inventory_model.pkl")
print("Training samples:", len(X))
print("======================================")