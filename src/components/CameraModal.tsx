import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Camera, RotateCcw, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

export const CameraModal = ({ isOpen, onClose, onCapture }: CameraModalProps) => {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageDataUrl);
    setIsCapturing(true);
  };

  const confirmCapture = () => {
    if (!capturedImage || !canvasRef.current) return;

    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `captured-image-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        onCapture(file);
        handleClose();
      }
    }, 'image/jpeg', 0.9);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setIsCapturing(false);
  };

  const handleClose = () => {
    setCapturedImage(null);
    setIsCapturing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </Button>
        <h2 className="text-white font-semibold">{t('camera.take')}</h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        {!isCapturing ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={capturedImage || ''}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Overlay Grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        {/* Guide Text */}
        <div className="absolute top-8 left-0 right-0 text-center">
          <div className="bg-black/50 backdrop-blur-sm mx-4 p-3 rounded-lg">
            <p className="text-white text-sm">
              {!isCapturing 
                ? t('camera.instruction') 
                : t('camera.confirm')}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 bg-black/50 backdrop-blur-sm">
        {!isCapturing ? (
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full bg-white hover:bg-gray-100 text-black p-0 shadow-lg"
            >
              <Camera className="h-8 w-8" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={retakePhoto}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              {t('camera.retake')}
            </Button>
            <Button
              variant="hero"
              size="lg"
              onClick={confirmCapture}
            >
              <Check className="h-5 w-5 mr-2" />
              {t('camera.use')}
            </Button>
          </div>
        )}
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};