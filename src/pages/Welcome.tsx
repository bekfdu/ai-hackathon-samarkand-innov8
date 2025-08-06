import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { BookOpen, Zap, CheckCircle, Upload } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: Upload,
      title: "Oson yuklash",
      description: "Inshoni rasm yoki PDF shaklida yuklang",
      delay: "100ms"
    },
    {
      icon: Zap,
      title: "Tez tahlil",
      description: "Bir necha soniyada natija oling",
      delay: "200ms"
    },
    {
      icon: CheckCircle,
      title: "Aniq baho",
      description: "Professional grammatik tahlil",
      delay: "300ms"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8 bg-gradient-to-br from-background via-blue-50/30 to-primary/5">
        {/* Hero Section */}
        <div className="text-center space-y-6 max-w-md animate-fade-in">
          {/* Animated Logo */}
          <div className="mx-auto w-24 h-24 bg-gradient-hero rounded-3xl flex items-center justify-center shadow-strong animate-float">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
          
          {/* Title with stagger animation */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-foreground animate-fade-in" style={{ animationDelay: '200ms' }}>
              EduCheck
            </h1>
            <p className="text-2xl text-primary font-bold animate-fade-in" style={{ animationDelay: '400ms' }}>
              {t('app.title').replace('EduCheck – ', '')}
            </p>
          </div>
          
          {/* Description */}
          <p className="text-muted-foreground text-center leading-relaxed animate-fade-in" style={{ animationDelay: '600ms' }}>
            {t('welcome.description')}
          </p>
        </div>

        {/* Features with staggered animations */}
        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-4 bg-white/80 backdrop-blur-sm border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: feature.delay }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="w-full max-w-md space-y-4 animate-fade-in" style={{ animationDelay: '800ms' }}>
          <Button
            variant="hero"
            size="lg"
            onClick={() => navigate("/auth")}
            className="w-full gap-3 text-lg"
          >
            <Zap className="h-5 w-5" />
            {t('welcome.start')}
          </Button>
          
          {/* Quick stats */}
          <div className="flex justify-center gap-6 pt-2">
            {[
              { number: "99%", label: "Aniqlik" },
              { number: "3s", label: "Tezlik" },
              { number: "1000+", label: "Foydalanuvchi" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-lg font-bold text-primary">{stat.number}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-center text-muted-foreground opacity-70 animate-fade-in" style={{ animationDelay: '1000ms' }}>
            Davom etish orqali siz Foydalanish shartlari va Maxfiylik siyosatiga rozilik bildirasiz
          </p>
        </div>

        {/* Floating background elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-40 right-16 w-16 h-16 bg-blue-400/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-20 w-12 h-12 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-300/5 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>
    </Layout>
  );
};