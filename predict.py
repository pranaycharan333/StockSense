import joblib
import numpy as np


# ============================================================
# STOCKSENSE - INVENTORY INTELLIGENCE
# ============================================================


# ------------------------------------------------------------
# LOAD TRAINED MODEL
# ------------------------------------------------------------

model = joblib.load("inventory_model.pkl")


# ------------------------------------------------------------
# PREDICTION FUNCTION
# ------------------------------------------------------------

def predict_inventory(
    current_stock,
    daily_usage,
    lead_time,
    reorder_level
):
    """
    Predict inventory demand and calculate stockout risk.

    Parameters:
        current_stock (float):
            Current quantity available.

        daily_usage (float):
            Average quantity consumed per day.

        lead_time (float):
            Supplier delivery time in days.

        reorder_level (float):
            Minimum desired inventory level.

    Returns:
        Dictionary containing:
        - predicted demand
        - days until stockout
        - stockout risk
        - recommended reorder quantity
    """

    # --------------------------------------------------------
    # PREPARE INPUT
    # --------------------------------------------------------

    data = np.array([[
        current_stock,
        daily_usage,
        lead_time,
        reorder_level
    ]])

    # --------------------------------------------------------
    # DEMAND PREDICTION
    # --------------------------------------------------------

    predicted_demand = model.predict(data)[0]

    # --------------------------------------------------------
    # STOCKOUT CALCULATION
    # --------------------------------------------------------

    if daily_usage > 0:

        days_until_stockout = (
            current_stock / daily_usage
        )

    else:

        # No consumption means stockout is not expected
        days_until_stockout = 999


    # --------------------------------------------------------
    # STOCKOUT RISK
    # --------------------------------------------------------

    if days_until_stockout <= lead_time:

        risk = "HIGH"

    elif days_until_stockout <= lead_time + 5:

        risk = "MEDIUM"

    else:

        risk = "LOW"


    # --------------------------------------------------------
    # SAFETY STOCK
    # --------------------------------------------------------

    # Keep approximately 3 days of usage as safety stock
    safety_stock = daily_usage * 3


    # --------------------------------------------------------
    # REORDER CALCULATION
    # --------------------------------------------------------

    target_stock = predicted_demand + safety_stock

    reorder_quantity = max(
        0,
        int(target_stock - current_stock)
    )


    # --------------------------------------------------------
    # FINAL RESULT
    # --------------------------------------------------------

    return {

        "predicted_demand":
            round(float(predicted_demand), 2),

        "days_until_stockout":
            round(float(days_until_stockout), 2),

        "stockout_risk":
            risk,

        "recommended_reorder":
            reorder_quantity
    }


# ============================================================
# DEMO
# ============================================================

if __name__ == "__main__":

    result = predict_inventory(

        current_stock=120,

        daily_usage=20,

        lead_time=5,

        reorder_level=100
    )

    print("\n======================================")
    print(" StockSense AI Prediction")
    print("======================================")

    print(
        "Predicted Demand:",
        result["predicted_demand"]
    )

    print(
        "Days Until Stockout:",
        result["days_until_stockout"]
    )

    print(
        "Stockout Risk:",
        result["stockout_risk"]
    )

    print(
        "Recommended Reorder:",
        result["recommended_reorder"]
    )

    print("======================================")