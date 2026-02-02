import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { isValidChinaPhone } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';
import { Phone, Lock, TrendingUp, Check, X } from 'lucide-react';

export default function Register() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();

  // 手机号验证（中国大陆号段）
  const isPhoneValid = isValidChinaPhone(phone);
  const isLengthValid = password.length >= 6;
  const isNotPureNumber = password.length > 0 && !/^\d+$/.test(password);
  const isPasswordMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordMatch) {
      toast({
        title: '注册失败',
        description: '两次输入的密码不一致',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const result = await signUp(phone, password);
    
    if (result.success) {
      // GA4 事件追踪：用户注册成功
      analytics.trackRegister(phone);
      
      toast({
        title: '注册成功',
        description: '欢迎加入股票智投！',
      });
      navigate('/');
    } else {
      toast({
        title: '注册失败',
        description: result.message,
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">注册股票智投</h1>
            <p className="text-muted-foreground mt-2">创建账号，开始您的投资学习之旅</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>创建新账号</CardTitle>
              <CardDescription>使用手机号快速注册</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">手机号</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="请输入11位手机号"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="pl-10"
                      maxLength={11}
                      required
                    />
                  </div>
                  {phone.length > 0 && (
                    <div className={`text-xs flex items-center gap-1 ${isPhoneValid ? 'text-stock-fall' : 'text-destructive'}`}>
                      {isPhoneValid ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {isPhoneValid ? '手机号格式正确' : '请输入有效的中国大陆手机号'}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="请设置密码"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {password.length > 0 && (
                    <div className="space-y-1">
                      <div className={`text-xs flex items-center gap-1 ${isLengthValid ? 'text-stock-fall' : 'text-destructive'}`}>
                        {isLengthValid ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        密码长度不少于6位
                      </div>
                      <div className={`text-xs flex items-center gap-1 ${isNotPureNumber ? 'text-stock-fall' : 'text-destructive'}`}>
                        {isNotPureNumber ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        密码不能是纯数字
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="请再次输入密码"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {confirmPassword.length > 0 && (
                    <div className={`text-xs flex items-center gap-1 ${isPasswordMatch ? 'text-stock-fall' : 'text-destructive'}`}>
                      {isPasswordMatch ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      {isPasswordMatch ? '密码一致' : '两次输入的密码不一致'}
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !isPhoneValid || !isLengthValid || !isNotPureNumber || !isPasswordMatch}
                >
                  {loading ? '注册中...' : '注册'}
                </Button>
              </form>
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">已有账号？</span>
                <Link to="/login" className="text-primary hover:underline ml-1">
                  立即登录
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
