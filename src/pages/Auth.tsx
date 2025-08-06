import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/Layout";
import { useNavigate } from "react-router-dom";
import { Mail, User, GraduationCap, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<"teacher" | "student">("student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate authentication
    toast({
      title: "Muvaffaqiyatli!",
      description: isLogin ? "Tizimga kirdingiz" : "Ro'yxatdan o'tdingiz",
    });
    
    // Save user type to localStorage
    localStorage.setItem("userType", userType);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", formData.name || "Foydalanuvchi");
    
    navigate("/upload");
  };

  const userTypes = [
    {
      id: "student" as const,
      label: "O'quvchi",
      icon: GraduationCap,
      description: "Insholarni yuklash va tahlil qilish uchun"
    },
    {
      id: "teacher" as const,
      label: "O'qituvchi", 
      icon: UserCheck,
      description: "O'quvchilar ishlarini nazorat qilish uchun"
    }
  ];

  return (
    <Layout title={isLogin ? "Tizimga kirish" : "Ro'yxatdan o'tish"} showBackButton>
      <div className="min-h-full flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-6 bg-white shadow-medium">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Foydalanuvchi turi</Label>
              <div className="grid grid-cols-1 gap-3">
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setUserType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      userType === type.id
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        userType === type.id ? "bg-primary" : "bg-muted"
                      }`}>
                        <type.icon className={`h-5 w-5 ${
                          userType === type.id ? "text-white" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{type.label}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Name Field (only for signup) */}
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Ism-familiya</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ismingizni kiriting"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email manzil</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="Parolingizni kiriting"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
            >
              {isLogin ? "Kirish" : "Ro'yxatdan o'tish"}
            </Button>

            {/* Toggle Auth Mode */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin 
                  ? "Akkauntingiz yo'qmi? Ro'yxatdan o'ting" 
                  : "Akkauntingiz bormi? Tizimga kiring"
                }
              </button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};