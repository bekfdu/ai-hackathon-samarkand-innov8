import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Crown, 
  Bell, 
  Shield, 
  LogOut, 
  Mail,
  GraduationCap,
  UserCheck,
  Settings,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  name: string;
  email: string;
  userType: "teacher" | "student";
  plan: "free" | "pro";
  notifications: boolean;
}

export const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    name: "Foydalanuvchi",
    email: "user@example.com",
    userType: "student",
    plan: "free",
    notifications: true
  });

  useEffect(() => {
    // Load user data from localStorage
    const userName = localStorage.getItem("userName") || "Foydalanuvchi";
    const userType = localStorage.getItem("userType") as "teacher" | "student" || "student";
    const userEmail = localStorage.getItem("userEmail") || "user@example.com";
    
    setProfile({
      name: userName,
      email: userEmail,
      userType,
      plan: "free", // Default to free plan
      notifications: true
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    
    toast({
      title: "Tizimdan chiqish",
      description: "Muvaffaqiyatli chiqildi",
    });
    
    navigate("/");
  };

  const toggleNotifications = () => {
    setProfile(prev => ({
      ...prev,
      notifications: !prev.notifications
    }));
    
    toast({
      title: "Bildirishnomalar",
      description: profile.notifications ? "O'chirildi" : "Yoqildi",
    });
  };

  const menuItems = [
    {
      icon: Bell,
      title: "Bildirishnomalar",
      subtitle: "Push bildirishnomalarni boshqarish",
      action: toggleNotifications,
      rightElement: (
        <Switch 
          checked={profile.notifications} 
          onCheckedChange={toggleNotifications}
        />
      )
    },
    {
      icon: Settings,
      title: "Sozlamalar",
      subtitle: "Ilova sozlamalarini o'zgartirish",
      action: () => toast({ title: "Sozlamalar", description: "Tez orada..." })
    },
    {
      icon: HelpCircle,
      title: "Yordam",
      subtitle: "FAQ va qo'llab-quvvatlash",
      action: () => toast({ title: "Yordam", description: "Tez orada..." })
    },
    {
      icon: Shield,
      title: "Maxfiylik",
      subtitle: "Ma'lumotlar himoyasi va xavfsizlik",
      action: () => toast({ title: "Maxfiylik", description: "Tez orada..." })
    }
  ];

  return (
    <Layout title="Profil" showBottomNav>
      <div className="p-6 space-y-6 max-w-md mx-auto">
        {/* Profile Header */}
        <Card className="p-6 bg-white shadow-medium">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                {profile.userType === "teacher" ? (
                  <UserCheck className="h-4 w-4 text-primary" />
                ) : (
                  <GraduationCap className="h-4 w-4 text-primary" />
                )}
                <span className="text-sm text-muted-foreground">
                  {profile.userType === "teacher" ? "O'qituvchi" : "O'quvchi"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{profile.email}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Subscription Plan */}
        <Card className="p-6 bg-gradient-secondary border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
                <Crown className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {profile.plan === "pro" ? "Pro rejasi" : "Bepul rejasi"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {profile.plan === "pro" 
                    ? "Barcha imkoniyatlar ochiq" 
                    : "Kuniga 3 ta tahlil"
                  }
                </p>
              </div>
            </div>
            
            {profile.plan === "free" && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => toast({ title: "Pro rejasi", description: "Tez orada..." })}
              >
                Yangilash
              </Button>
            )}
          </div>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Card key={index} className="p-4 bg-white shadow-soft">
              <button
                onClick={item.action}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                  </div>
                </div>
                
                {item.rightElement}
              </button>
            </Card>
          ))}
        </div>

        {/* Logout Button */}
        <Card className="p-4 bg-white shadow-soft">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 text-destructive"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Tizimdan chiqish</span>
          </button>
        </Card>

        {/* App Version */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          EduCheck v1.0.0
        </div>
      </div>
    </Layout>
  );
};