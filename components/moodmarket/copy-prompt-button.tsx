"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trend } from "@/lib/types";
import { generateTrendPrompt } from "@/lib/prompt-generator";

export function CopyPromptButton({ trend }: { trend: Trend }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const prompt = generateTrendPrompt(trend);
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
      {copied ? "Kopiert!" : "Kopier prompt"}
    </Button>
  );
}
