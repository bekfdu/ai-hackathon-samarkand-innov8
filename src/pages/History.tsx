import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { 
  TrendingUp, 
  Calendar, 
  FileText, 
  Star,
  BarChart3,
  AlertTriangle
} from "lucide-react";

interface HistoryItem {
  id: number;
  date: string;
  score: number;
  errorCount: number;
  extractedText: string;
}

interface Stats {
  averageScore: number;
  totalEssays: number;
  totalErrors: number;
  mostCommonError: string;
}

export const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<Stats>({
    averageScore: 0,
    totalEssays: 0,
    totalErrors: 0,
    mostCommonError: "Grammatik xatolar"
  });

  useEffect(() => {
    const savedHistory = localStorage.getItem("essayHistory");
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory);
      
      // Calculate stats
      if (parsedHistory.length > 0) {
        const avgScore = parsedHistory.reduce((sum: number, item: HistoryItem) => sum + item.score, 0) / parsedHistory.length;
        const totalErrors = parsedHistory.reduce((sum: number, item: HistoryItem) => sum + item.errorCount, 0);
        
        setStats({
          averageScore: Math.round(avgScore * 10) / 10,
          totalEssays: parsedHistory.length,
          totalErrors,
          mostCommonError: "Grammatik xatolar"
        });
      }
    }
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50";
    if (score >= 6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressTrend = () => {
    if (history.length < 2) return null;
    
    const lastScore = history[0]?.score || 0;
    const previousScore = history[1]?.score || 0;
    const trend = lastScore - previousScore;
    
    if (trend > 0) return { direction: "up", text: "Yaxshilanmoqda", color: "text-green-600" };
    if (trend < 0) return { direction: "down", text: "Pasaymoqda", color: "text-red-600" };
    return { direction: "stable", text: "Barqaror", color: "text-gray-600" };
  };

  const trend = getProgressTrend();

  return (
    <Layout title="Statistika" showBottomNav>
      <div className="p-6 space-y-6 max-w-md mx-auto">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-white shadow-soft">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg mx-auto flex items-center justify-center">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{stats.averageScore}</p>
              <p className="text-xs text-muted-foreground">O'rtacha baho</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-white shadow-soft">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-accent rounded-lg mx-auto flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{stats.totalEssays}</p>
              <p className="text-xs text-muted-foreground">Jami insholar</p>
            </div>
          </Card>
        </div>

        {/* Progress Trend */}
        {trend && (
          <Card className="p-4 bg-white shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Rivojlanish</p>
                  <p className={`text-sm ${trend.color}`}>{trend.text}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                So'nggi 2 ta
              </Badge>
            </div>
          </Card>
        )}

        {/* Most Common Error */}
        <Card className="p-4 bg-warning/5 border-warning/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-foreground">Eng ko'p xato</p>
              <p className="text-sm text-muted-foreground">{stats.mostCommonError}</p>
            </div>
            <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
              {Math.round((stats.totalErrors / Math.max(stats.totalEssays, 1)) * 10) / 10} ta
            </Badge>
          </div>
        </Card>

        {/* History List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Oxirgi insholar</h2>
          </div>
          
          {history.length === 0 ? (
            <Card className="p-8 text-center bg-muted/30">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">Hali hech qanday insho tahlil qilinmagan</p>
              <p className="text-sm text-muted-foreground">Birinchi inshoni yuklang va tahlil qiling</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {history.map((item, index) => (
                <Card key={item.id} className="p-4 bg-white shadow-soft">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`text-xs px-2 py-1 ${getScoreColor(item.score)}`}>
                          {item.score}/10
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.date)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {item.extractedText}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{item.errorCount} ta xato</span>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                            Eng oxirgi
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};