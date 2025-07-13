<?php

namespace App\Services\Analysis;

use App\Services\Analysis\AnalyzerInterface;

class SportsAnalyzer implements AnalyzerInterface
{
    public function generatePrompt(array $data): string
    {
        $datasetJson = json_encode(array_slice($data, 0, 50));

        return <<<EOT
You are a professional sports data analyst.

Given this sports performance dataset:

$datasetJson

Return the following JSON:
{
  "summary": "Brief summary of the dataset",
  "issues": "Any missing, inconsistent, or unusual data patterns",
  "trends": "Performance trends, patterns, or correlations between key metrics",
  "insights": "3 key insights about player/team performance",
  "recommendations": "Actionable suggestions to improve sports performance or strategy",
  "additional_data_needed": "Any data that would enhance future sports analysis"
}
EOT;
    }
}
