import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getUsers, getQuizResults, type Profile, type QuizResult } from '@/stores/authStore';
import { Shield, Users, ClipboardCheck, TrendingUp, Award, Loader2 } from 'lucide-react';

export default function Admin() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    
    if (!profile?.is_admin) {
      navigate('/');
      return;
    }
    
    loadData();
  }, [profile, authLoading, navigate]);

  const loadData = async () => {
    setLoading(true);
    const [usersData, resultsData] = await Promise.all([
      getUsers(),
      getQuizResults()
    ]);
    setUsers(usersData);
    setQuizResults(resultsData);
    setLoading(false);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!profile?.is_admin) {
    return null;
  }

  // 统计数据
  const totalUsers = users.filter(u => !u.is_admin).length;
  const totalQuizzes = quizResults.length;
  const avgScore = quizResults.length > 0
    ? (quizResults.reduce((sum, r) => sum + r.score, 0) / quizResults.length).toFixed(1)
    : 0;
  const passRate = quizResults.length > 0
    ? ((quizResults.filter(r => r.score >= 6).length / quizResults.length) * 100).toFixed(1)
    : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-lg bg-gold/10 text-gold">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">管理后台</h1>
            <p className="text-muted-foreground">查看用户注册信息和问卷统计</p>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">注册用户</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gold/10 text-gold">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">测验次数</p>
                  <p className="text-2xl font-bold">{totalQuizzes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-stock-rise/10 text-stock-rise">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">平均得分</p>
                  <p className="text-2xl font-bold">{avgScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-stock-fall/10 text-stock-fall">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">及格率</p>
                  <p className="text-2xl font-bold">{passRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              用户列表
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              问卷统计
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>注册用户列表</CardTitle>
                <CardDescription>查看所有注册用户信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>序号</TableHead>
                        <TableHead>手机号</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead>注册时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow key={user.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-mono">{user.phone}</TableCell>
                          <TableCell>
                            {user.is_admin ? (
                              <Badge variant="default" className="bg-gold text-gold-foreground">管理员</Badge>
                            ) : (
                              <Badge variant="secondary">普通用户</Badge>
                            )}
                          </TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                        </TableRow>
                      ))}
                      {users.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            暂无注册用户
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle>问卷调查统计</CardTitle>
                <CardDescription>查看所有用户的问卷完成情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>序号</TableHead>
                        <TableHead>用户手机号</TableHead>
                        <TableHead>得分</TableHead>
                        <TableHead>是否及格</TableHead>
                        <TableHead>完成时间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quizResults.map((result, index) => (
                        <TableRow key={result.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-mono">
                            {result.profiles?.phone || '未知用户'}
                          </TableCell>
                          <TableCell>
                            <span className={result.score >= 6 ? 'text-stock-fall font-medium' : 'text-stock-rise font-medium'}>
                              {result.score}/{result.total_questions}
                            </span>
                          </TableCell>
                          <TableCell>
                            {result.score >= 6 ? (
                              <Badge className="bg-stock-fall/10 text-stock-fall border-0">及格</Badge>
                            ) : (
                              <Badge variant="destructive">未及格</Badge>
                            )}
                          </TableCell>
                          <TableCell>{formatDate(result.completed_at)}</TableCell>
                        </TableRow>
                      ))}
                      {quizResults.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            暂无问卷记录
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
