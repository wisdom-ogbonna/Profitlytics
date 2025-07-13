<?php

namespace App\Services\Analysis;

use App\Services\Analysis\AnalyzerInterface;

class FitnessAnalyzer implements AnalyzerInterface
{
    public function generatePrompt(array $data): string
    {
        $datasetJson = json_encode(array_slice($data, 0, 50));

        return <<<EOT
You are a professional fitness data analyst.

Given this fitness dataset:

$datasetJson

Return the following JSON:
{
  "summary": "Brief summary of the dataset",
  "issues": "Any missing or inconsistent data patterns",
  "trends": "Trends or correlations you observe related to fitness levels or progress",
  "insights": "3 key fitness-related insights from the data",
  "recommendations": "Actionable fitness suggestions to improve performance or health",
  "additional_data_needed": "Data that would improve future analysis"
}
EOT;
    }
}
