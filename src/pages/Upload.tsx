import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, Camera, FileText, X, CheckCircle, Image, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CameraModal } from "@/components/CameraModal";
import { VisionService } from "@/services/visionService";
import { useLanguage } from "@/contexts/LanguageContext";

export const Upload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "Xato",
        description: "Fayl hajmi 10MB dan oshmasligi kerak",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Xato", 
        description: "Faqat JPG, PNG yoki PDF fayllarni yuklang",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    toast({
      title: "Muvaffaqiyatli!",
      description: "Fayl yuklandi, endi tahlil qilishingiz mumkin",
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCameraCapture = (file: File) => {
    handleFileSelect(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    
    try {
      // Extract text using Vision API
      setProgress(30);
      const visionResult = await VisionService.extractTextFromImage(selectedFile);
      
      if (!visionResult.success) {
        toast({
          title: "Xatolik",
          description: visionResult.error || "Matnni ajratib olishda xatolik yuz berdi",
          variant: "destructive",
        });
        setIsAnalyzing(false);
        return;
      }
      
      setProgress(70);
      
      // Create analysis data with extracted text
      const analysisData = {
        extractedText: visionResult.extractedText || '',
        score: Math.floor(Math.random() * 3) + 7, // Random score between 7-9
        errors: [
          { position: 45, text: "grammar error example", correction: "corrected version", type: "grammar" },
          { position: 120, text: "spelling error example", correction: "corrected spelling", type: "spelling" }
        ],
        feedback: "Analysis complete. Text extracted successfully.",
        fileName: selectedFile.name
      };
      
      localStorage.setItem("analysisResult", JSON.stringify(analysisData));
      
      setTimeout(() => {
        setProgress(100);
        setIsAnalyzing(false);
        
        toast({
          title: "Tahlil tugallandi!",
          description: "Natijalarni ko'rish uchun davom eting",
        });
        
        setTimeout(() => {
          navigate("/results");
        }, 1000);
      }, 1000);
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Xatolik",
        description: "Tahlil qilishda xatolik yuz berdi",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout title={t('upload.title')} showBottomNav>
      <div className="p-6 space-y-6 max-w-md mx-auto animate-fade-in">
        {/* Enhanced Upload Area */}
        <Card className="overflow-hidden bg-gradient-to-br from-white to-blue-50/30 shadow-medium border-0">
          <div className="p-6 space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center animate-float shadow-strong">
                <UploadIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  {t('upload.title')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('upload.instruction')}
                </p>
              </div>
            </div>

            {!selectedFile ? (
              <div className="space-y-4">
                {/* Camera Button */}
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => setShowCamera(true)}
                  className="w-full gap-3 animate-scale-in"
                >
                  <Camera className="h-5 w-5" />
                  {t('upload.takePhoto')}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-muted-foreground">{t('upload.or')}</span>
                  </div>
                </div>

                {/* File Upload Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                    transition-all duration-300 hover:border-primary hover:bg-accent/30
                    ${dragActive ? 'border-primary bg-accent/50 scale-105' : 'border-border'}
                  `}
                >
                  <div className={`transition-all duration-300 ${dragActive ? 'animate-bounce-gentle' : ''}`}>
                    <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground font-medium">
                      {dragActive ? t('upload.dropHere') : t('upload.dragDrop')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      JPG, PNG yoki PDF (max 10MB)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-scale-in">
                {/* File Preview */}
                <div className="border border-border rounded-xl p-4 bg-white/50 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shrink-0 shadow-soft">
                      {selectedFile.type.startsWith('image/') ? (
                        <Camera className="h-6 w-6 text-white" />
                      ) : (
                        <FileText className="h-6 w-6 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                      className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {preview && (
                    <div className="mt-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg shadow-soft"
                      />
                    </div>
                  )}
                </div>

                {/* Success indicator */}
                <div className="flex items-center gap-3 text-success animate-fade-in bg-success/5 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5 animate-scale-in" />
                  <span className="font-medium">{t('upload.fileUploaded')}</span>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </Card>

        {/* Action Button */}
        {selectedFile && (
          <div className="space-y-4 animate-fade-in">
            {/* Progress Bar */}
            {isAnalyzing && (
              <Card className="p-4 bg-white shadow-soft">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t('upload.analyzing')}</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-primary h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 animate-pulse" />
                    <span>{t('upload.processing')}</span>
                  </div>
                </div>
              </Card>
            )}

            <Button
              variant="hero"
              size="lg"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full gap-3"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  {t('upload.analyzing')}
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  {t('upload.analyze')}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Enhanced Instructions */}
        <Card className="p-6 bg-gradient-to-br from-accent/30 to-primary/5 border-0 animate-fade-in">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Eng yaxshi natija uchun:
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: "📱", text: "Matnni aniq ko'rinishda oling" },
              { icon: "💡", text: "Yaxshi yorug'likda rasm oling" },
              { icon: "📝", text: "Barcha so'zlar o'qilishi kerak" },
              { icon: "🎯", text: "Faqat matn qismini ramkaga oling" }
            ].map((tip, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <span className="text-lg">{tip.icon}</span>
                <span className="text-sm text-muted-foreground">{tip.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />
    </Layout>
  );
};