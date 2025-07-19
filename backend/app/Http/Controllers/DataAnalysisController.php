<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Maatwebsite\Excel\Facades\Excel;

class DataAnalysisController extends Controller
{
    public function analyze(Request $request)
    {
        $request->validate([
            'excel_file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        $rawData = Excel::toArray([], $request->file('excel_file'));

        if (empty($rawData) || count($rawData[0]) < 2) {
            return response()->json(['error' => 'Invalid or empty Excel file.'], 422);
        }

        $headers = $rawData[0][0];
        $rows = array_slice($rawData[0], 1);

        // Convert to associative arrays
        $structured = array_filter(array_map(function ($row) use ($headers) {
            return count($row) === count($headers) ? array_combine($headers, $row) : null;
        }, $rows));

        // Clean up values
        $cleaned = array_map(function ($row) {
            return array_map(fn($v) => trim((string) $v), $row);
        }, $structured);

        // Basic statistics
        $columnStats = [];
        foreach ($headers as $col) {
            $values = array_column($cleaned, $col);
            $numeric = array_filter($values, fn($v) => is_numeric($v));
            $count = count($numeric);

            if ($count > 0) {
                $columnStats[$col] = [
                    'count' => $count,
                    'mean'  => round(array_sum($numeric) / $count, 2),
                    'min'   => min($numeric),
                    'max'   => max($numeric),
                ];
            }
        }

        // Generate multiple chart datasets
        $charts = [];
        for ($i = 1; $i < count($headers); $i++) {
            $yField = $headers[$i];
            $xField = $headers[0];

            $chart = [
                'x_field' => $xField,
                'y_field' => $yField,
                'type'    => 'auto', // front-end can decide: line, bar, scatter
                'data'    => [],
            ];

            foreach ($cleaned as $row) {
                $x = $row[$xField] ?? null;
                $y = $row[$yField] ?? null;

                if ($x !== null && is_numeric($y)) {
                    $chart['data'][] = ['x' => $x, 'y' => (float) $y];
                }
            }

            if (!empty($chart['data'])) {
                $charts[] = $chart;
            }
        }

        // Generate prompt for AI
        $datasetJson = json_encode(array_slice($cleaned, 0, 50));

        $prompt = <<<EOT
You are a professional data analyst.

Given the following dataset:

$datasetJson

Respond ONLY in JSON format, without any markdown or explanation. Structure:
{
  "summary": "...",
  "issues": "...",
  "trends": "...",
  "insights": ["...", "...", "..."],
  "recommendations": ["...", "..."],
  "additional_data_needed": "..."
}
EOT;

        // Call OpenAI API
        $response = Http::withToken(env('OPENAI_API_KEY'))->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'temperature' => 0.3,
            'messages' => [
                ['role' => 'system', 'content' => 'You are a professional data analyst. Return JSON only.'],
                ['role' => 'user', 'content' => $prompt],
            ],
        ]);

        // Parse AI response
        $aiRaw = $response->json()['choices'][0]['message']['content'] ?? '{}';
        $aiJson = json_decode($this->extractJson($aiRaw), true);

        if (!$aiJson || !is_array($aiJson)) {
            return response()->json([
                'error' => 'Invalid AI response format.',
                'raw'   => $aiRaw
            ], 500);
        }

        return response()->json([
            'columns'     => $headers,
            'preview'     => array_slice($cleaned, 0, 5),
            'stats'       => $columnStats,
            'charts'      => $charts,
            'ai_analysis' => $aiJson,
        ]);
    }

    private function extractJson(string $text): string
    {
        $start = strpos($text, '{');
        return $start !== false ? substr($text, $start) : '{}';
    }
}
