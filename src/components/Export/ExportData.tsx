import { Button } from "../ui/button";
import { Download, FileJson, FileText } from "lucide-react";
import { toast } from "sonner";

interface SentimentResult {
  id: string;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  timestamp: Date;
}

interface Props {
  results: SentimentResult[];
}

export const ExportData = ({ results }: Props) => {
  const exportToJSON = () => {
    const data = results.map(r => ({
      text: r.text,
      sentiment: r.sentiment,
      confidence: r.score,
      timestamp: r.timestamp.toISOString(),
    }));
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentiment-analysis-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported as JSON");
  };

  const exportToCSV = () => {
    const headers = ['Text', 'Sentiment', 'Confidence', 'Timestamp'];
    const rows = results.map(r => [
      `"${r.text.replace(/"/g, '""')}"`,
      r.sentiment,
      r.score.toFixed(2),
      r.timestamp.toISOString(),
    ]);
    
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentiment-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported as CSV");
  };

  if (results.length === 0) return null;

  return (
    <div className="flex gap-3 items-center justify-center flex-wrap">
      <Button
        onClick={exportToJSON}
        variant="outline"
        className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10"
      >
        <FileJson className="w-4 h-4" />
        Export JSON
      </Button>
      <Button
        onClick={exportToCSV}
        variant="outline"
        className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10"
      >
        <FileText className="w-4 h-4" />
        Export CSV
      </Button>
    </div>
  );
};
