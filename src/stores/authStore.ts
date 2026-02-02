// 数据库操作函数 - 与 Supabase 交互
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  phone: string;
  is_admin: boolean;
  created_at: string;
}

export interface QuizResult {
  id: string;
  user_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
  // 关联的 profile 数据（用于管理员查看）
  profiles?: {
    phone: string;
  };
}

// 验证中国大陆手机号号段
export const isValidChinaPhone = (phone: string): boolean => {
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

// 获取所有用户（管理员用）
export const getUsers = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  return data || [];
};

// 保存问卷结果
export const saveQuizResult = async (
  userId: string,
  score: number, 
  totalQuestions: number
): Promise<QuizResult | null> => {
  const { data, error } = await supabase
    .from('quiz_results')
    .insert({
      user_id: userId,
      score,
      total_questions: totalQuestions
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error saving quiz result:', error);
    return null;
  }
  
  return data;
};

// 获取所有问卷结果（管理员用）
export const getQuizResults = async (): Promise<QuizResult[]> => {
  const { data, error } = await supabase
    .from('quiz_results')
    .select(`
      *,
      profiles (
        phone
      )
    `)
    .order('completed_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching quiz results:', error);
    return [];
  }
  
  return data || [];
};

// 获取用户自己的问卷结果
export const getUserQuizResults = async (userId: string): Promise<QuizResult[]> => {
  const { data, error } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user quiz results:', error);
    return [];
  }
  
  return data || [];
};
