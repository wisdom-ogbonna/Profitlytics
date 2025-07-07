<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Http;

class DataAnalysisController extends Controller
{
    public function analyze(Request $request)
    {
        $request->validate([
            'excel_file' => 'required|file|mimes:xlsx,xls,csv',
        ]);

        // Step 1: Load and structure data
        $data = Excel::toArray([], $request->file('excel_file'));
        if (empty($data) || count($data[0]) < 2) {
            return response()->json(['error' => 'Dataset is empty or improperly formatted.'], 422);
        }

        $headers = $data[0][0]; // First row = headers
        $rows = array_slice($data[0], 1); // Skip header row

        // Step 2: Convert to associative array
        $structured = [];
        foreach ($rows as $row) {
            if (count($row) === count($headers)) {
                $structured[] = array_combine($headers, $row);
            }
        }

        // Step 3: Basic Cleaning
        $cleaned = array_map(function ($row) {
            return array_map(function ($value) {
                return trim((string)$value); // Clean whitespace and ensure string
            }, $row);
        }, $structured);

        // Step 4: Basic stats
        $columnStats = [];
        foreach ($headers as $col) {
            $numericValues = array_filter(array_column($cleaned, $col), fn($v) => is_numeric($v));
            $count = count($numericValues);
            if ($count > 0) {
                $mean = array_sum($numericValues) / $count;
                $min = min($numericValues);
                $max = max($numericValues);
                $columnStats[$col] = compact('count', 'mean', 'min', 'max');
            }
        }

        // Step 5: Chart data
        $xField = $headers[0] ?? 'X';
        $yField = $headers[1] ?? 'Y';

        $chartLabels = [];
        $chartValues = [];
        foreach ($cleaned as $row) {
            $chartLabels[] = $row[$xField] ?? 'N/A';
            $chartValues[] = is_numeric($row[$yField] ?? null) ? (float)$row[$yField] : 0;
        }

        // Step 6: Multi-turn AI chat conversation
        $datasetJson = json_encode(array_slice($cleaned, 0, 50));

        $messages = [
            ['role' => 'system', 'content' => 'You are a professional data analyst.'],
            ['role' => 'user', 'content' => "Here is a dataset:\n\n$datasetJson"],
            ['role' => 'user', 'content' => "1. Summarize the dataset.\n2. Identify missing or inconsistent data.\n3. Highlight trends or patterns."],
            ['role' => 'assistant', 'content' => 'Okay, let me process that.'],
            ['role' => 'user', 'content' => "Now provide 3 key business insights from this data."],
            ['role' => 'user', 'content' => "Also suggest actionable recommendations based on the trends you identified."],
            ['role' => 'user', 'content' => "Finally, suggest what additional data would improve future analysis."]
        ];

        $response = Http::withToken(env('OPENAI_API_KEY'))->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => $messages,
        ]);

        $aiInsight = $response->json()['choices'][0]['message']['content'] ?? 'AI did not return a response.';

        // Final response
        return response()->json([
            'columns' => $headers,
            'preview' => array_slice($cleaned, 0, 5),
            'stats' => $columnStats,
            'chart_data' => [
                'x_field' => $xField,
                'y_field' => $yField,
                'labels' => $chartLabels,
                'values' => $chartValues,
            ],
            'insight' => $aiInsight,
        ]);
    }
}
