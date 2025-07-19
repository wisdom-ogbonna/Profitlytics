<?php

namespace App\Services\Analysis;

use App\Services\Analysis\AnalyzerInterface;

class HealthAnalyzer implements AnalyzerInterface
{
    public function generatePrompt(array $data): string
    {
        $datasetJson = json_encode(array_slice($data, 0, 50));

        return <<<EOT
You are a professional health data analyst.

Given this health dataset:

$datasetJson

Return the following JSON:
{
  "summary": "Brief summary of the dataset",
  "issues": "Any missing or inconsistent data patterns",
  "trends": "Trends or correlations you observe",
  "insights": "3 key health-related insights",
  "recommendations": "Actionable health suggestions",
  "additional_data_needed": "Data that would improve future analysis"
}
EOT;
    }
}
