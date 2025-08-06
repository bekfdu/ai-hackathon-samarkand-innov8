import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, BarChart3, Upload } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  showBottomNav?: boolean;
}

export const Layout = ({ 
  children, 
  title, 
  showBackButton = false, 
  showBottomNav = false 
}: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const bottomNavItems = [
    { icon: Upload, label: t('nav.upload'), path: "/upload" },
    { icon: BarChart3, label: t('nav.history'), path: "/history" },
    { icon: User, label: t('nav.profile'), path: "/profile" }
  ];

  return (
    <div className="min-h-screen bg-gradient-secondary flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-border p-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          {title && (
            <h1 className="text-lg font-semibold text-foreground flex-1 text-center">
              {title}
            </h1>
          )}
          
          {!title && !showBackButton && (
            <div className="flex items-center gap-2 flex-1 justify-center">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold text-primary">EduCheck</span>
            </div>
          )}
          
          {!showBackButton && (
            <div className="shrink-0">
              <LanguageSelector />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="bg-white border-t border-border px-4 py-2 safe-area-inset-bottom">
          <div className="flex justify-around max-w-md mx-auto">
            {bottomNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 p-3 h-auto ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                  <span className="text-xs">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};