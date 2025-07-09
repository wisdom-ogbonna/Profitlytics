<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Http;

class DataAnalysisController extends Controller
{
    public function analyze(Request $request)
    {
        // 1. Validate file input
        $request->validate([
            'excel_file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        // 2. Load Excel data
        $rawData = Excel::toArray([], $request->file('excel_file'));
        if (empty($rawData) || count($rawData[0]) < 2) {
            return response()->json(['error' => 'Uploaded file is empty or not properly formatted.'], 422);
        }

        // 3. Extract headers and data rows
        $headers = $rawData[0][0];              // First row = headers
        $rows = array_slice($rawData[0], 1);    // Remaining rows = data

        // 4. Convert to associative array
        $structured = array_filter(array_map(function ($row) use ($headers) {
            return count($row) === count($headers)
                ? array_combine($headers, $row)
                : null;
        }, $rows));

        // 5. Clean each value
        $cleaned = array_map(function ($row) {
            return array_map(fn($v) => trim((string)$v), $row);
        }, $structured);

        // 6. Generate basic column statistics
        $columnStats = [];
        foreach ($headers as $col) {
            $values = array_column($cleaned, $col);
            $numericValues = array_filter($values, fn($v) => is_numeric($v));
            $count = count($numericValues);

            if ($count > 0) {
                $mean = array_sum($numericValues) / $count;
                $columnStats[$col] = [
                    'count' => $count,
                    'mean'  => round($mean, 2),
                    'min'   => min($numericValues),
                    'max'   => max($numericValues),
                ];
            }
        }

        // 7. Extract chart data (X: first column, Y: second column if numeric)
        $xField = $headers[0] ?? 'X';
        $yField = $headers[1] ?? 'Y';

        $chartLabels = [];
        $chartValues = [];

        foreach ($cleaned as $row) {
            $chartLabels[] = $row[$xField] ?? 'N/A';
            $chartValues[] = is_numeric($row[$yField] ?? null) ? (float)$row[$yField] : 0;
        }

        // 8. Prepare AI analysis prompt
        $datasetJson = json_encode(array_slice($cleaned, 0, 50));

        $prompt = <<<EOT
You are a professional data analyst.

Given this dataset:

$datasetJson

Return the following in JSON format (no extra text, no markdown):
{
  "summary": "Brief summary of the dataset",
  "issues": "Any missing or inconsistent data patterns",
  "trends": "Trends or correlations you observe",
  "insights": "3 key business insights",
  "recommendations": "Actionable business suggestions",
  "additional_data_needed": "Data that would improve future analysis"
}
EOT;

        // 9. Send to OpenAI API
        $response = Http::withToken(env('OPENAI_API_KEY'))->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a professional data analyst. Return valid JSON only.'],
                ['role' => 'user', 'content' => $prompt]
            ],
            'temperature' => 0.3,
        ]);

        // 10. Handle and decode AI response
        $rawAi = $response->json()['choices'][0]['message']['content'] ?? null;
        $start = strpos($rawAi, '{');
        $jsonText = $start !== false ? substr($rawAi, $start) : $rawAi;

        try {
            $aiInsights = json_decode($jsonText, true);
            if (!$aiInsights) {
                throw new \Exception('Invalid JSON from AI');
            }
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to parse AI output.',
                'raw' => $rawAi
            ], 500);
        }

        // 11. Return structured analytics
        return response()->json([
            'columns'     => $headers,
            'preview'     => array_slice($cleaned, 0, 5),
            'stats'       => $columnStats,
            'chart_data'  => [
                'x_field' => $xField,
                'y_field' => $yField,
                'labels'  => $chartLabels,
                'values'  => $chartValues,
            ],
            'ai_analysis' => $aiInsights
        ]);
    }
}
