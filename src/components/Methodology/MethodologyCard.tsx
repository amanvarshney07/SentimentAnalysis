import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { BookOpen, Code, Brain, TrendingUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useState } from "react";

export const MethodologyCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="p-8 glass-effect border-primary/30 hover:border-primary/50 transition-all duration-300 group hover-lift">
          <CollapsibleTrigger className="w-full group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-primary shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold text-gradient">Methodology & Technical Details</h3>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-muted-foreground text-2xl group-hover:text-primary transition-colors duration-300"
              >
                ▼
              </motion.div>
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 space-y-6"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Algorithm</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Weighted lexicon-based approach with contextual analysis. Uses 60+ sentiment words 
                    categorized by intensity (strong, medium, mild) with corresponding weight multipliers.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Features</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    • Phrase pattern matching<br/>
                    • Negation handling<br/>
                    • Text length normalization<br/>
                    • Confidence scoring (0-100%)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">Scoring</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Normalized scores with dynamic thresholds (±0.15). 
                    Confidence calculated from sentiment intensity relative to neutral baseline.
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-foreground mb-2">Technical Implementation</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• <strong>Frontend:</strong> React with TypeScript for type safety and maintainability</p>
                  <p>• <strong>Animations:</strong> Framer Motion for smooth, performant animations and gestures</p>
                  <p>• <strong>UI Components:</strong> shadcn/ui with Radix primitives for accessibility</p>
                  <p>• <strong>Styling:</strong> Tailwind CSS with custom design tokens and semantic color system</p>
                  <p>• <strong>State Management:</strong> React hooks with optimized re-renders</p>
                  <p>• <strong>Data Export:</strong> Client-side JSON/CSV generation with proper encoding</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-foreground mb-2">Potential Enhancements</h4>
                <div className="text-sm text-muted-foreground">
                  <p>• Integration with ML models (BERT, GPT) for deeper semantic understanding</p>
                  <p>• Multi-language support with language-specific sentiment lexicons</p>
                  <p>• Aspect-based sentiment analysis for complex text</p>
                  <p>• Real-time sentiment tracking with temporal analysis</p>
                </div>
              </div>
            </motion.div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </motion.div>
  );
};
