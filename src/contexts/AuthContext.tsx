import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  phone: string;
  is_admin: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (phone: string, password: string) => Promise<{ success: boolean; message: string }>;
  signIn: (phone: string, password: string) => Promise<{ success: boolean; message: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 验证中国大陆手机号号段
const isValidChinaPhone = (phone: string): boolean => {
  const validPrefixes = [
    '130', '131', '132', '133', '134', '135', '136', '137', '138', '139',
    '145', '146', '147', '148', '149',
    '150', '151', '152', '153', '155', '156', '157', '158', '159',
    '165', '166',
    '172', '173', '174', '175', '176', '177', '178',
    '180', '181', '182', '183', '184', '185', '186', '187', '188', '189',
    '190', '191', '192', '193', '195', '196', '197', '198', '199'
  ];
  
  if (!/^1\d{10}$/.test(phone)) return false;
  const prefix = phone.substring(0, 3);
  return validPrefixes.includes(prefix);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取用户资料
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile | null;
  };

  // 刷新用户资料
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // 监听认证状态变化
  useEffect(() => {
    // 设置认证状态监听器
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // 使用 setTimeout 避免在回调中直接调用 Supabase
          setTimeout(async () => {
            const profileData = await fetchProfile(currentSession.user.id);
            setProfile(profileData);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // 检查现有会话
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).then(setProfile);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 注册
  const signUp = async (phone: string, password: string): Promise<{ success: boolean; message: string }> => {
    // 验证手机号
    if (!isValidChinaPhone(phone)) {
      return { success: false, message: '请输入有效的中国大陆手机号' };
    }
    
    // 验证密码
    if (password.length < 6) {
      return { success: false, message: '密码长度不能小于6位' };
    }
    if (/^\d+$/.test(password)) {
      return { success: false, message: '密码不能是纯数字' };
    }

    // 使用手机号作为邮箱格式进行注册
    const email = `${phone}@phone.local`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone: phone
        }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, message: '该手机号已被注册' };
      }
      return { success: false, message: error.message };
    }

    if (data.user) {
      return { success: true, message: '注册成功' };
    }

    return { success: false, message: '注册失败，请重试' };
  };

  // 登录
  const signIn = async (phone: string, password: string): Promise<{ success: boolean; message: string }> => {
    const email = `${phone}@phone.local`;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, message: '手机号或密码错误' };
    }

    if (data.user) {
      return { success: true, message: '登录成功' };
    }

    return { success: false, message: '登录失败，请重试' };
  };

  // 登出
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
