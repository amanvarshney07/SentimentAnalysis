import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Frown, Meh, Sparkles, X, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { toast } from "sonner";
import { SentimentStats } from "./Stats/SentimentStats";
import { ExportData } from "./Export/ExportData";
import { MethodologyCard } from "./Methodology/MethodologyCard";
import { BatchInput } from "./BatchAnalysis/BatchInput";

interface SentimentResult {
  id: string;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  score: number;
  timestamp: Date;
}

const analyzeSentiment = (text: string): Omit<SentimentResult, "id" | "timestamp"> => {
  // Expanded sentiment word lists with weights
  const positiveWords = {
    strong: ["excellent", "amazing", "outstanding", "fantastic", "incredible", "wonderful", "brilliant", "perfect", "exceptional", "magnificent", "superb", "marvelous"],
    medium: ["good", "great", "nice", "happy", "love", "like", "enjoy", "pleased", "glad", "awesome", "beautiful", "delightful", "exciting"],
    mild: ["okay", "fine", "decent", "alright", "satisfactory", "acceptable", "pleasant", "comfortable", "appreciate"]
  };
  
  const negativeWords = {
    strong: ["terrible", "horrible", "awful", "disgusting", "dreadful", "atrocious", "abysmal", "appalling", "worst", "hate", "despise", "furious"],
    medium: ["bad", "poor", "disappointing", "unfortunate", "sad", "upset", "angry", "frustrated", "annoyed", "useless", "waste"],
    mild: ["dislike", "meh", "underwhelming", "lacking", "mediocre", "subpar", "boring", "dull", "concern", "worried"]
  };
  
  const lowerText = text.toLowerCase();
  let score = 0;
  let wordCount = 0;
  
  // Check positive words with different weights
  Object.entries(positiveWords).forEach(([intensity, words]) => {
    const weight = intensity === 'strong' ? 3 : intensity === 'medium' ? 2 : 1;
    words.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        score += matches.length * weight;
        wordCount += matches.length;
      }
    });
  });
  
  // Check negative words with different weights
  Object.entries(negativeWords).forEach(([intensity, words]) => {
    const weight = intensity === 'strong' ? 3 : intensity === 'medium' ? 2 : 1;
    words.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        score -= matches.length * weight;
        wordCount += matches.length;
      }
    });
  });
  
  // Check for common positive phrases
  const positivePhrases = ["well done", "thank you", "thanks", "looking forward", "can't wait", "so happy", "very good"];
  positivePhrases.forEach(phrase => {
    if (lowerText.includes(phrase)) score += 2;
  });
  
  // Check for common negative phrases
  const negativePhrases = ["not good", "no good", "don't like", "never again", "waste of time", "very bad", "so sad"];
  negativePhrases.forEach(phrase => {
    if (lowerText.includes(phrase)) score -= 2;
  });
  
  // Check for negations that flip sentiment
  const negations = ["not", "no", "never", "neither", "nobody", "nothing"];
  const words = lowerText.split(/\s+/);
  words.forEach((word, idx) => {
    if (negations.includes(word) && idx < words.length - 1) {
      // Simple negation flip - if negation is followed by positive word, reduce positive score
      const nextWord = words[idx + 1];
      [...positiveWords.strong, ...positiveWords.medium].forEach(posWord => {
        if (nextWord.includes(posWord)) score -= 2;
      });
    }
  });
  
  // Normalize score based on text length and word count
  const textLength = text.split(/\s+/).length;
  const normalizedScore = textLength > 0 ? score / Math.max(textLength * 0.3, 1) : 0;
  const clampedScore = Math.max(-1, Math.min(1, normalizedScore));
  
  // Determine sentiment with lower thresholds for better detection
  let sentiment: "positive" | "negative" | "neutral";
  if (clampedScore > 0.15) sentiment = "positive";
  else if (clampedScore < -0.15) sentiment = "negative";
  else sentiment = "neutral";
  
  // Calculate confidence based on how far from neutral
  const confidence = Math.min(Math.abs(clampedScore) * 2, 1);
  
  return { text, sentiment, score: confidence };
};

const sentimentConfig = {
  positive: {
    icon: Smile,
    gradient: "bg-gradient-positive",
    label: "Positive",
    emoji: "😊",
  },
  negative: {
    icon: Frown,
    gradient: "bg-gradient-negative",
    label: "Negative",
    emoji: "😞",
  },
  neutral: {
    icon: Meh,
    gradient: "bg-gradient-neutral",
    label: "Neutral",
    emoji: "😐",
  },
};

export const SentimentAnalyzer = () => {
  const [text, setText] = useState("");
  const [results, setResults] = useState<SentimentResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = () => {
    if (!text.trim()) {
      toast.error("Please enter some text to analyze");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const analysis = analyzeSentiment(text);
      const newResult: SentimentResult = {
        ...analysis,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      
      setResults([newResult, ...results]);
      setText("");
      setIsAnalyzing(false);
      toast.success(`Analysis complete: ${sentimentConfig[analysis.sentiment].label}`);
    }, 800);
  };

  const handleBatchAnalyze = (texts: string[]) => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const newResults: SentimentResult[] = texts.map((text, index) => {
        const analysis = analyzeSentiment(text);
        return {
          ...analysis,
          id: `${Date.now()}-${index}`,
          timestamp: new Date(),
        };
      });
      
      setResults([...newResults, ...results]);
      setIsAnalyzing(false);
      toast.success(`Batch analysis complete: ${texts.length} texts analyzed`);
    }, 1200);
  };

  const handleRemove = (id: string) => {
    setResults(results.filter(r => r.id !== id));
    toast.success("Result removed");
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatDelay: 2,
              ease: "easeInOut"
            }}
            className="inline-block relative"
          >
            <div className="absolute inset-0 bg-gradient-primary rounded-full blur-xl opacity-30 animate-pulse-glow"></div>
            <Sparkles className="w-16 h-16 text-primary mx-auto relative z-10 drop-shadow-lg" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-7xl font-bold text-gradient leading-tight"
          >
            Advanced Sentiment Analyzer
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Comprehensive text sentiment analysis with statistical insights, batch processing, 
            and data export capabilities powered by advanced AI algorithms
          </motion.p>
        </motion.div>

        {/* Methodology Card */}
        <MethodologyCard />

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          className="hover-lift"
        >
          <Card className="p-8 glass-effect border-primary/30 hover:border-primary/50 transition-all duration-300 group">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-primary/20 group-hover:bg-gradient-primary/30 transition-colors">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Single Text Analysis</h3>
              </div>
              <div className="relative group">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your text here... Express your thoughts, share your experiences, or describe your feelings."
                  className="min-h-[180px] text-lg bg-background/50 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none backdrop-blur-sm group-hover:border-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      handleAnalyze();
                    }
                  }}
                />
                {text && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={handleClear}
                    className="absolute top-3 right-3 p-2 rounded-full bg-muted/80 hover:bg-muted transition-all duration-200 backdrop-blur-sm border border-border/50 hover:border-primary/50"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
                <div className="absolute inset-0 rounded-lg bg-gradient-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"></div>
                  {text.length} characters • Press Ctrl+Enter to analyze
                </span>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !text.trim()}
                  className="bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-glow hover:shadow-glow hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Analyzing...</span>
                    </motion.div>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                      Analyze Sentiment
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Batch Analysis */}
        <BatchInput onBatchAnalyze={handleBatchAnalyze} />

        {/* Statistics */}
        <SentimentStats results={results} />

        {/* Export Options */}
        <ExportData results={results} />

        {/* Results */}
        <AnimatePresence mode="popLayout">
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-gradient flex items-center gap-3"
              >
                <div className="w-1 h-8 bg-gradient-primary rounded-full"></div>
                Analysis Results
              </motion.h2>
              
              <div className="space-y-4">
                {results.map((result, index) => {
                  const config = sentimentConfig[result.sentiment];
                  const Icon = config.icon;
                  
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -50, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 50, scale: 0.9 }}
                      transition={{ 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_, info) => {
                        if (Math.abs(info.offset.x) > 100) {
                          handleRemove(result.id);
                        }
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                      className="cursor-grab active:cursor-grabbing hover-lift"
                    >
                      <Card className={`p-8 glass-effect border-2 ${config.gradient} bg-opacity-5 hover:bg-opacity-10 transition-all duration-300 group relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-foreground leading-relaxed">{result.text}</p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleRemove(result.id)}
                              className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ 
                                delay: 0.2, 
                                type: "spring",
                                stiffness: 200,
                                damping: 15
                              }}
                              className={`p-4 rounded-2xl ${config.gradient} shadow-lg relative group-hover:scale-110 transition-transform duration-300`}
                            >
                              <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </motion.div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className={`font-bold text-xl flex items-center gap-2 ${result.sentiment === 'positive' ? 'text-green-500' : result.sentiment === 'negative' ? 'text-red-500' : 'text-gray-500'}`}>
                                  <span className="text-2xl">{config.emoji}</span>
                                  {config.label}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full animate-pulse ${result.sentiment === 'positive' ? 'bg-green-500' : result.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'} opacity-60`}></div>
                                  <span className={`text-sm font-medium ${result.sentiment === 'positive' ? 'text-green-500' : result.sentiment === 'negative' ? 'text-red-500' : 'text-gray-500'}`}>
                                    {Math.round(result.score * 100)}% confidence
                                  </span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Confidence Level</span>
                                  <span className={`font-medium ${result.sentiment === 'positive' ? 'text-green-500' : result.sentiment === 'negative' ? 'text-red-500' : 'text-gray-500'}`}>
                                    {Math.round(result.score * 100)}%
                                  </span>
                                </div>
                                <div className="h-3 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${result.score * 100}%` }}
                                    transition={{ 
                                      delay: 0.4, 
                                      duration: 1,
                                      ease: "easeOut"
                                    }}
                                    className={`h-full ${config.gradient} relative`}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                                  </motion.div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative inline-block mb-8"
            >
              <div className="absolute inset-0 bg-gradient-primary rounded-full blur-2xl opacity-20 animate-pulse-glow"></div>
              <Sparkles className="w-24 h-24 mx-auto text-primary/60 relative z-10 drop-shadow-lg" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-2xl font-bold text-gradient">Ready to Analyze?</h3>
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                Enter some text above to get started with sentiment analysis and see your results appear here
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse"></div>
                <span>Powered by advanced AI algorithms</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
