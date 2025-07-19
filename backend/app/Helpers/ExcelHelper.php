<?php

namespace App\Helpers;

use Maatwebsite\Excel\Facades\Excel;

class ExcelHelper
{
    public static function parseExcelFile($file)
    {
        $rawData = Excel::toArray([], $file);
        return $rawData[0] ?? [];
    }

    public static function analyzeExcelData(array $rawData)
    {
        $headers = $rawData[0];
        $rows = array_slice($rawData, 1);

        $structured = array_filter(array_map(function ($row) use ($headers) {
            return count($row) === count($headers) ? array_combine($headers, $row) : null;
        }, $rows));

        $cleaned = array_map(fn($row) => array_map(fn($v) => trim((string) $v), $row), $structured);

        // Stats
        $stats = [];
        foreach ($headers as $col) {
            $values = array_column($cleaned, $col);
            $nums = array_filter($values, fn($v) => is_numeric($v));
            if (count($nums)) {
                $stats[$col] = [
                    'count' => count($nums),
                    'mean' => round(array_sum($nums) / count($nums), 2),
                    'min'  => min($nums),
                    'max'  => max($nums)
                ];
            }
        }

        // Chart data
        $x = $headers[0];
        $y = $headers[1];

        $labels = array_column($cleaned, $x);
        $values = array_map(fn($r) => is_numeric($r[$y]) ? (float)$r[$y] : 0, $cleaned);

        return [$headers, $cleaned, $stats, [
            'x_field' => $x,
            'y_field' => $y,
            'labels' => $labels,
            'values' => $values
        ]];
    }
}
