export const mockAIInsights = {
  kpis: {
    forecastDemandNext30Days: 4850,
    demandGrowthRate: "+14.2%",
    stockoutRiskPercentage: 18.5,
    averageDaysUntilStockout: 11.4,
    recommendedReorderUnits: 1850,
    anomaliesDetected: 3
  },
  highRiskProducts: [
    {
      id: "prod-2",
      name: "Heavy-Duty Hydraulic Fluid (5L)",
      sku: "LUB-HYD-005",
      warehouse: "East Coast Gateway",
      currentStock: 38,
      dailyBurnRate: 6.2,
      daysRemaining: 6,
      stockoutRisk: 92,
      riskLevel: "Critical",
      recommendedReorder: 150,
      leadTimeDays: 5,
      impact: "High - Critical machine lubricant downtime"
    },
    {
      id: "prod-5",
      name: "Thermal Conductive Adhesive Tape (50m)",
      sku: "MAT-TAPE-050",
      warehouse: "West Coast Depository",
      currentStock: 24,
      dailyBurnRate: 3.1,
      daysRemaining: 7,
      stockoutRisk: 86,
      riskLevel: "High",
      recommendedReorder: 80,
      leadTimeDays: 4,
      impact: "Medium - Assembly bottleneck"
    },
    {
      id: "prod-8",
      name: "Carbon Steel Hex Flange Bolt (M8x40)",
      sku: "FAS-BLT-M84",
      warehouse: "West Coast Depository",
      currentStock: 85,
      dailyBurnRate: 9.4,
      daysRemaining: 9,
      stockoutRisk: 78,
      riskLevel: "High",
      recommendedReorder: 250,
      leadTimeDays: 6,
      impact: "Medium - Fastener inventory lag"
    },
    {
      id: "prod-13",
      name: "Electronic Barcode Scanner (Handheld BT)",
      sku: "ELE-SCN-BTH",
      warehouse: "Pacific Northwest Annex",
      currentStock: 14,
      dailyBurnRate: 1.1,
      daysRemaining: 12,
      stockoutRisk: 64,
      riskLevel: "Moderate",
      recommendedReorder: 30,
      leadTimeDays: 7,
      impact: "Low - Secondary terminal equipment"
    }
  ],
  anomalies: [
    {
      id: "ano-1",
      title: "Unusual Consumption Velocity",
      product: "Nitrile Inspection Gloves (Powder-Free, XL)",
      warehouse: "East Coast Gateway",
      type: "Spike",
      severity: "Moderate",
      description: "Consumption rate jumped 280% above 30-day baseline over the last 72 hours.",
      suggestedAction: "Audit departmental dispensing logs to rule out bulk hoarding or unrecorded shipment."
    },
    {
      id: "ano-2",
      title: "Recurring Shrinkage Discrepancy",
      product: "Carbon Steel Hex Flange Bolt (M8x40)",
      warehouse: "West Coast Depository",
      type: "Discrepancy",
      severity: "High",
      description: "Three consecutive cycle adjustments detected net losses totaling 35 units over 14 days.",
      suggestedAction: "Initiate warehouse bin surveillance and verify outer pack seal integrity upon receipt."
    },
    {
      id: "ano-3",
      title: "Lead Time Drift",
      product: "Industrial Ball Bearings (12mm)",
      warehouse: "Central Logistics Hub",
      type: "Supplier Delay",
      severity: "Warning",
      description: "Supplier 'Apex Industrial Supplies Ltd' average lead time increased from 4.2 to 8.7 business days.",
      suggestedAction: "Update safety stock threshold by +40 units to buffer extended replenishment window."
    }
  ],
  demandTrends: [
    { month: "May", actualDemand: 3100, predictedDemand: 3050, upperConfidence: 3300, lowerConfidence: 2800 },
    { month: "Jun", actualDemand: 3450, predictedDemand: 3400, upperConfidence: 3650, lowerConfidence: 3150 },
    { month: "Jul", actualDemand: 3820, predictedDemand: 3750, upperConfidence: 4000, lowerConfidence: 3500 },
    { month: "Aug", actualDemand: 4100, predictedDemand: 4180, upperConfidence: 4400, lowerConfidence: 3950 },
    { month: "Sep", actualDemand: 4390, predictedDemand: 4320, upperConfidence: 4600, lowerConfidence: 4050 },
    { month: "Oct (Est)", actualDemand: null, predictedDemand: 4850, upperConfidence: 5200, lowerConfidence: 4500 },
    { month: "Nov (Est)", actualDemand: null, predictedDemand: 5280, upperConfidence: 5700, lowerConfidence: 4860 },
    { month: "Dec (Est)", actualDemand: null, predictedDemand: 5900, upperConfidence: 6450, lowerConfidence: 5350 }
  ],
  recommendations: [
    {
      id: "rec-1",
      priority: "Urgent",
      action: "Trigger Emergency PO for Hydraulic Fluid",
      sku: "LUB-HYD-005",
      warehouse: "East Coast Gateway",
      reason: "Current stock will be completely exhausted in ~6 days at current burn rates.",
      potentialSavings: "$4,200 avoiding line stoppage",
      buttonText: "Approve Purchase Order"
    },
    {
      id: "rec-2",
      priority: "Optimization",
      action: "Inter-Warehouse Stock Rebalancing",
      sku: "ELE-MCU-003",
      warehouse: "Central -> West Coast",
      reason: "Central Hub holds 4.2x safety stock while West Coast demand is projected to spike next week.",
      potentialSavings: "Reduces procurement costs by $3,100",
      buttonText: "Schedule Transfer"
    },
    {
      id: "rec-3",
      priority: "Maintenance",
      action: "Revise Safety Stock for Fasteners",
      sku: "FAS-BLT-M84",
      warehouse: "West Coast Depository",
      reason: "Seasonal uptick historically increases fastener turnover by 35% in Q4.",
      potentialSavings: "Mitigates production line stutter",
      buttonText: "Update Threshold"
    }
  ]
};
