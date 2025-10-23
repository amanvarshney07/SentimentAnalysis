import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";

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

export const SentimentStats = ({ results }: Props) => {
  if (results.length === 0) return null;

  const stats = {
    total: results.length,
    positive: results.filter(r => r.sentiment === "positive").length,
    negative: results.filter(r => r.sentiment === "negative").length,
    neutral: results.filter(r => r.sentiment === "neutral").length,
  };

  const percentages = {
    positive: ((stats.positive / stats.total) * 100).toFixed(1),
    negative: ((stats.negative / stats.total) * 100).toFixed(1),
    neutral: ((stats.neutral / stats.total) * 100).toFixed(1),
  };

  const avgScore = (results.reduce((acc, r) => acc + r.score, 0) / results.length).toFixed(2);

  const statCards = [
    { label: "Positive", value: stats.positive, percent: percentages.positive, icon: TrendingUp, gradient: "bg-gradient-positive", textColor: "text-green-500" },
    { label: "Negative", value: stats.negative, percent: percentages.negative, icon: TrendingDown, gradient: "bg-gradient-negative", textColor: "text-red-500" },
    { label: "Neutral", value: stats.neutral, percent: percentages.neutral, icon: Minus, gradient: "bg-gradient-neutral", textColor: "text-gray-500" },
    { label: "Avg Confidence", value: avgScore, percent: `${(parseFloat(avgScore) * 100).toFixed(0)}%`, icon: BarChart3, gradient: "bg-gradient-primary", textColor: "text-primary" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6"
    >
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-gradient flex items-center gap-3"
      >
        <div className="p-2 rounded-lg bg-gradient-primary/20">
          <BarChart3 className="w-7 h-7 text-primary" />
        </div>
        Analysis Statistics
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="hover-lift"
            >
              <Card className="p-6 glass-effect border-primary/30 hover:border-primary/50 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                    <div className={`p-3 rounded-xl ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-5 h-5 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className={`text-4xl font-bold ${stat.textColor} group-hover:opacity-80 transition-opacity duration-300`}>{stat.value}</div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stat.textColor} animate-pulse opacity-60`}></div>
                      <div className={`text-sm font-medium ${stat.textColor}`}>{stat.percent}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

