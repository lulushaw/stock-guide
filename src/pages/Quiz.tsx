import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  getRandomQuestions, 
  calculateScore, 
  getScoreEvaluation,
  type Question 
} from '@/stores/quizData';
import { useAuth } from '@/contexts/AuthContext';
import { saveQuizResult } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, ChevronLeft, ChevronRight, Trophy, RefreshCw, Home } from 'lucide-react';

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();

  useEffect(() => {
    startNewQuiz();
  }, []);

  const startNewQuiz = () => {
    setQuestions(getRandomQuestions(10));
    setCurrentIndex(0);
    setAnswers({});
    setShowResult(false);
    setScore(0);
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleSingleSelect = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: [parseInt(value)]
    }));
  };

  const handleMultipleSelect = (optionIndex: number, checked: boolean) => {
    const currentAnswers = answers[currentQuestion.id] || [];
    let newAnswers: number[];
    
    if (checked) {
      newAnswers = [...currentAnswers, optionIndex];
    } else {
      newAnswers = currentAnswers.filter(a => a !== optionIndex);
    }
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: newAnswers
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const finalScore = calculateScore(questions, answers);
    setScore(finalScore);
    setShowResult(true);

    if (user) {
      setSaving(true);
      const result = await saveQuizResult(user.id, finalScore, questions.length);
      setSaving(false);
      
      if (result) {
        toast({
          title: '测验完成',
          description: '您的成绩已保存到云端',
        });
      }
    }
  };

  const isCurrentAnswered = (answers[currentQuestion?.id] || []).length > 0;
  const allAnswered = questions.every(q => (answers[q.id] || []).length > 0);

  if (questions.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p>正在加载题目...</p>
        </div>
      </Layout>
    );
  }

  if (showResult) {
    const passed = score >= 6;
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto mb-4 ${passed ? 'bg-stock-fall/10 text-stock-fall' : 'bg-gold/10 text-gold'}`}>
                  <Trophy className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl">测验完成！</CardTitle>
                <CardDescription className="text-lg">
                  {user ? (saving ? '正在保存成绩...' : '您的成绩已保存') : '登录后可保存成绩'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="py-6">
                  <div className={`text-6xl font-bold ${passed ? 'text-stock-fall' : 'text-stock-rise'}`}>
                    {score}
                  </div>
                  <div className="text-lg text-muted-foreground mt-2">
                    满分 10 分 {passed ? '（及格）' : '（未及格）'}
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${passed ? 'bg-stock-fall/10' : 'bg-gold/10'}`}>
                  <p className="text-base">{getScoreEvaluation(score)}</p>
                </div>

                {/* 答题详情 */}
                <div className="text-left space-y-4 mt-6">
                  <h3 className="font-semibold text-lg">答题详情</h3>
                  {questions.map((q, idx) => {
                    const userAnswer = answers[q.id] || [];
                    const isCorrect = 
                      userAnswer.length === q.correctAnswers.length &&
                      userAnswer.every(a => q.correctAnswers.includes(a));
                    
                    return (
                      <div key={q.id} className={`p-3 rounded-lg border ${isCorrect ? 'border-stock-fall/30 bg-stock-fall/5' : 'border-stock-rise/30 bg-stock-rise/5'}`}>
                        <div className="flex items-start gap-2">
                          <span className={`text-sm font-medium ${isCorrect ? 'text-stock-fall' : 'text-stock-rise'}`}>
                            {idx + 1}. {isCorrect ? '正确' : '错误'}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{q.question}</p>
                        <div className="text-xs text-muted-foreground mt-2">
                          正确答案: {q.correctAnswers.map(i => q.options[i]).join('、')}
                        </div>
                        {!isCorrect && (
                          <div className="text-xs text-stock-rise mt-1">
                            您的答案: {userAnswer.length > 0 ? userAnswer.map(i => q.options[i]).join('、') : '未作答'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4 justify-center pt-4">
                  <Button variant="outline" onClick={startNewQuiz}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    重新测验
                  </Button>
                  <Button onClick={() => navigate('/')}>
                    <Home className="h-4 w-4 mr-2" />
                    返回首页
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">股票知识测验</h1>
            <p className="text-muted-foreground mt-1">共10题，6分及格</p>
            {!user && (
              <p className="text-sm text-gold mt-2">提示：登录后可保存测验成绩</p>
            )}
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>第 {currentIndex + 1} / {questions.length} 题</span>
              <span>{currentQuestion.type === 'single' ? '单选题' : '多选题'}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg leading-relaxed">
                {currentIndex + 1}. {currentQuestion.question}
              </CardTitle>
              {currentQuestion.type === 'multiple' && (
                <CardDescription className="text-gold">
                  （多选题，请选择所有正确答案）
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {currentQuestion.type === 'single' ? (
                <RadioGroup
                  value={answers[currentQuestion.id]?.[0]?.toString() || ''}
                  onValueChange={handleSingleSelect}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                      <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isChecked = (answers[currentQuestion.id] || []).includes(idx);
                    return (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => handleMultipleSelect(idx, !isChecked)}
                      >
                        <Checkbox
                          id={`option-${idx}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => handleMultipleSelect(idx, checked as boolean)}
                        />
                        <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  上一题
                </Button>
                
                {currentIndex === questions.length - 1 ? (
                  <Button onClick={handleSubmit} disabled={!allAnswered}>
                    提交答卷
                  </Button>
                ) : (
                  <Button onClick={handleNext} disabled={!isCurrentAnswered}>
                    下一题
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Question Navigator */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {questions.map((q, idx) => {
              const isAnswered = (answers[q.id] || []).length > 0;
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors
                    ${isCurrent ? 'bg-primary text-primary-foreground' : 
                      isAnswered ? 'bg-stock-fall/20 text-stock-fall' : 
                      'bg-muted text-muted-foreground'}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
