import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { User, LogOut, Menu, X, TrendingUp } from 'lucide-react';

export function Header() {
  const { profile, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <TrendingUp className="h-6 w-6" />
          <span className="hidden sm:inline">股票智投</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            首页
          </Link>
          <Link to="/quiz" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            知识测验
          </Link>
          <Link to="/encyclopedia" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            股票小百科
          </Link>
          <Link to="/data-query" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            数据查询
          </Link>
          {profile?.is_admin && (
            <Link to="/admin" className="text-sm font-medium text-gold hover:text-gold/80 transition-colors">
              管理后台
            </Link>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <span className="text-sm text-muted-foreground">加载中...</span>
          ) : profile ? (
            <>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="h-4 w-4" />
                {profile.phone}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                退出
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm">登录</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">注册</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="flex flex-col p-4 gap-3">
            <Link 
              to="/" 
              className="text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              首页
            </Link>
            <Link 
              to="/quiz" 
              className="text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              知识测验
            </Link>
            <Link 
              to="/encyclopedia" 
              className="text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              股票小百科
            </Link>
            <Link 
              to="/data-query" 
              className="text-sm font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              数据查询
            </Link>
            {profile?.is_admin && (
              <Link 
                to="/admin" 
                className="text-sm font-medium py-2 text-gold"
                onClick={() => setMobileMenuOpen(false)}
              >
                管理后台
              </Link>
            )}
            <div className="border-t border-border pt-3 mt-2">
              {loading ? (
                <span className="text-sm text-muted-foreground">加载中...</span>
              ) : profile ? (
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">{profile.phone}</span>
                  <Button variant="outline" size="sm" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                    退出登录
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">登录</Button>
                  </Link>
                  <Link to="/register" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">注册</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
