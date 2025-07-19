<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Analysis\{
    HealthAnalyzer, FitnessAnalyzer, SportsAnalyzer, BusinessAnalyzer
};
use App\Helpers\ExcelHelper;
use Illuminate\Support\Facades\Http;

class AnalysisController extends Controller
{
    public function analyze(Request $request)
    {
        $request->validate([
            'excel_file' => 'required|file|mimes:xlsx,xls,csv',
            'type' => 'required|in:health,fitness,sports,business'
        ]);

        $rawData = ExcelHelper::parseExcelFile($request->file('excel_file'));
        [$headers, $cleaned, $stats, $chartData] = ExcelHelper::analyzeExcelData($rawData);

        $analyzer = match ($request->input('type')) {
            'health'   => new HealthAnalyzer(),
            'fitness'  => new FitnessAnalyzer(),
            'sports'   => new SportsAnalyzer(),
            'business' => new BusinessAnalyzer(),
        };

        $prompt = $analyzer->generatePrompt($cleaned);

        $response = Http::withToken(env('OPENAI_API_KEY'))->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a professional data analyst. Return valid JSON only.'],
                ['role' => 'user', 'content' => $prompt]
            ],
            'temperature' => 0.3,
        ]);

        $rawAi = $response->json()['choices'][0]['message']['content'] ?? null;
        $jsonText = substr($rawAi, strpos($rawAi, '{'));
        $aiInsights = json_decode($jsonText, true);

        return response()->json([
            'columns'     => $headers,
            'preview'     => array_slice($cleaned, 0, 5),
            'stats'       => $stats,
            'chart_data'  => $chartData,
            'ai_analysis' => $aiInsights
        ]);
    }
}
