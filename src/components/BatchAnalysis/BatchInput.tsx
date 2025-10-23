import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Layers, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  onBatchAnalyze: (texts: string[]) => void;
}

export const BatchInput = ({ onBatchAnalyze }: Props) => {
  const [batchText, setBatchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleBatchSubmit = () => {
    const texts = batchText
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    if (texts.length === 0) {
      toast.error("Please enter at least one text line");
      return;
    }

    if (texts.length > 50) {
      toast.error("Maximum 50 texts allowed per batch");
      return;
    }

    onBatchAnalyze(texts);
    setBatchText("");
    setIsOpen(false);
    toast.success(`Analyzing ${texts.length} texts...`);
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center"
      >
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10"
        >
          <Layers className="w-4 h-4" />
          Batch Analysis
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="p-6 shadow-card backdrop-blur-sm bg-card/50 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Batch Analysis</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <Textarea
            value={batchText}
            onChange={(e) => setBatchText(e.target.value)}
            placeholder="Enter multiple texts, one per line (max 50)..."
            className="min-h-[200px] bg-input/50 border-primary/30 focus:border-primary"
          />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {batchText.split('\n').filter(t => t.trim().length > 0).length} texts
            </span>
            <Button
              onClick={handleBatchSubmit}
              className="bg-gradient-primary hover:opacity-90 shadow-glow"
            >
              Analyze Batch
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
