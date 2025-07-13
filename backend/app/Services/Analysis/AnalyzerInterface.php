<?php
namespace App\Services\Analysis;

interface AnalyzerInterface
{
    public function generatePrompt(array $data): string;
}
