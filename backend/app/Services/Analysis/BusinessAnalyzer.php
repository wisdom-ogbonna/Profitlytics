<?php

namespace App\Services\Analysis;

use App\Services\Analysis\AnalyzerInterface;

class BusinessAnalyzer implements AnalyzerInterface
{
    public function generatePrompt(array $data): string
    {
        $datasetJson = json_encode(array_slice($data, 0, 50));

        return <<<EOT
You are a professional business data analyst.

Given this business dataset:

$datasetJson

Return the following JSON:
{
  "summary": "Brief summary of the dataset",
  "issues": "Any missing, inconsistent, or outlier data patterns",
  "trends": "Notable business trends, correlations, or performance patterns",
  "insights": "3 actionable business insights (e.g., about customers, sales, conversion)",
  "recommendations": "Business suggestions to improve growth, reduce churn, or optimize performance",
  "additional_data_needed": "What data would improve future business decisions"
}
EOT;
    }
}
