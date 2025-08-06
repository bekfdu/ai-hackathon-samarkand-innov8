import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { 
  Download, 
  Share2, 
  AlertCircle, 
  CheckCircle, 
  Star,
  Eye,
  EyeOff,
  BookOpen,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  extractedText: string;
  score: number;
  errors: Array<{
    position: number;
    text: string;
    correction: string;
    type: 'grammar' | 'spelling' | 'style';
  }>;
  feedback: string;
}

export const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showOriginalText, setShowOriginalText] = useState(true);
  const [highlightedText, setHighlightedText] = useState("");

  useEffect(() => {
    const savedResult = localStorage.getItem("analysisResult");
    if (savedResult) {
      const parsedResult = JSON.parse(savedResult);
      setResult(parsedResult);
      
      // Create highlighted text
      let highlighted = parsedResult.extractedText;
      parsedResult.errors.forEach((error: any, index: number) => {
        const errorClass = error.type === 'grammar' ? 'bg-red-100 text-red-800' : 
                          error.type === 'spelling' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800';
        highlighted = highlighted.replace(
          error.text,
          `<span class="px-1 rounded ${errorClass} cursor-pointer" data-error="${index}">${error.text}</span>`
        );
      });
      setHighlightedText(highlighted);
    } else {
      navigate("/upload");
    }
  }, [navigate]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 bg-green-50";
    if (score >= 6) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getScoreText = (score: number) => {
    if (score >= 8) return "A'lo";
    if (score >= 6) return "Yaxshi";
    return "Qoniqarli";
  };

  const handleShare = () => {
    toast({
      title: "Ulashish",
      description: "Natija muvaffaqiyatli nusxalandi",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Yuklab olish",
      description: "Hisobot PDF formatida tayyorlanmoqda",
    });
  };

  const saveToHistory = () => {
    const historyItem = {
      id: Date.now(),
      date: new Date().toISOString(),
      score: result?.score,
      errorCount: result?.errors.length,
      extractedText: result?.extractedText.substring(0, 100) + "..."
    };
    
    const history = JSON.parse(localStorage.getItem("essayHistory") || "[]");
    history.unshift(historyItem);
    localStorage.setItem("essayHistory", JSON.stringify(history.slice(0, 10))); // Keep last 10
  };

  useEffect(() => {
    if (result) {
      saveToHistory();
    }
  }, [result]);

  if (!result) {
    return (
      <Layout title="Natijalar yuklanmoqda..." showBackButton>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Tahlil natijalari" showBackButton showBottomNav>
      <div className="p-6 space-y-6 max-w-md mx-auto pb-20 animate-fade-in">
        {/* Enhanced Score Card */}
        <Card className="p-6 bg-gradient-to-br from-white to-primary/5 shadow-strong border-0 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-primary/5 rounded-full -translate-x-10 translate-y-10"></div>
          
          <div className="text-center space-y-4 relative z-10">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center shadow-strong animate-scale-in">
              <Star className="h-12 w-12 text-white" />
            </div>
            
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className={`inline-flex items-center px-6 py-3 rounded-full text-3xl font-bold shadow-soft ${getScoreColor(result.score)}`}>
                {result.score}/10
              </div>
              <p className="text-xl font-bold text-foreground mt-3">
                {getScoreText(result.score)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-border/50 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="text-center">
                <div className="w-12 h-12 bg-destructive/10 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <p className="text-2xl font-bold text-primary">{result.errors.length}</p>
                <p className="text-sm text-muted-foreground">Xatolar</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <p className="text-2xl font-bold text-primary">{result.extractedText.split(' ').length}</p>
                <p className="text-sm text-muted-foreground">So'zlar</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Text Analysis */}
        <Card className="p-6 bg-white shadow-medium border-0 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Matn tahlili
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOriginalText(!showOriginalText)}
                className="hover:scale-105 transition-transform"
              >
                {showOriginalText ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showOriginalText ? "Xatolarni ko'rsatish" : "Asl matnni ko'rsatish"}
              </Button>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-muted/20 to-primary/5 rounded-xl text-sm leading-relaxed border border-border/50">
              {showOriginalText ? (
                <p className="animate-fade-in">{result.extractedText}</p>
              ) : (
                <div className="animate-fade-in" dangerouslySetInnerHTML={{ __html: highlightedText }} />
              )}
            </div>
            
            {!showOriginalText && (
              <div className="flex flex-wrap gap-2 animate-fade-in">
                <Badge variant="destructive" className="text-xs hover:scale-105 transition-transform">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Grammatik xato
                </Badge>
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800 border-yellow-200 hover:scale-105 transition-transform">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Imlo xatosi
                </Badge>
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-800 border-blue-200 hover:scale-105 transition-transform">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Uslub xatosi
                </Badge>
              </div>
            )}
          </div>
        </Card>

        {/* Enhanced Errors List */}
        {result.errors.length > 0 && (
          <Card className="p-6 bg-white shadow-medium border-0 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Topilgan xatolar ({result.errors.length})
            </h3>
            <div className="space-y-3">
              {result.errors.map((error, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gradient-to-r from-destructive/5 to-transparent rounded-xl border border-destructive/20 hover:shadow-soft transition-all duration-300 hover:scale-105 animate-scale-in"
                  style={{ animationDelay: `${500 + index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold text-destructive bg-destructive/10 px-2 py-1 rounded">"{error.text}"</span>
                        {" → "}
                        <span className="font-semibold text-success bg-success/10 px-2 py-1 rounded">"{error.correction}"</span>
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {error.type === 'grammar' ? 'Grammatika' : 
                         error.type === 'spelling' ? 'Imlo' : 'Uslub'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Enhanced Feedback */}
        <Card className="p-6 bg-gradient-to-br from-success/5 to-primary/5 border-success/20 border animate-fade-in" style={{ animationDelay: '600ms' }}>
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success animate-bounce-gentle" />
            Tavsiya
          </h3>
          <p className="text-muted-foreground leading-relaxed">{result.feedback}</p>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '700ms' }}>
          <Button 
            variant="outline" 
            onClick={handleShare} 
            className="flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Share2 className="h-4 w-4" />
            Ulashish
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDownload} 
            className="flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Download className="h-4 w-4" />
            Yuklab olish
          </Button>
        </div>

        {/* Enhanced New Analysis Button */}
        <Button
          variant="hero"
          size="lg"
          onClick={() => navigate("/upload")}
          className="w-full gap-3 animate-fade-in hover:scale-105 transition-transform"
          style={{ animationDelay: '800ms' }}
        >
          <Zap className="h-5 w-5" />
          Yangi tahlil
        </Button>
      </div>
    </Layout>
  );
};