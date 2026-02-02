import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Search, 
  GraduationCap, 
  BookOpenCheck,
  TrendingUp,
  BarChart3,
  Wallet,
  ArrowRight,
  Zap
} from 'lucide-react';
import { aIndexes, globalIndexes } from '@/stores/stockData';
import { MiniChart } from '@/components/StockChart';

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-gold/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              专业的<span className="text-primary">股票分析</span>学习平台
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              学习股票知识，查询实时数据，助您在投资路上稳步前行
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2">
                  立即注册
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/quiz">
                <Button size="lg" variant="outline" className="gap-2">
                  开始测验
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview - A股指数 */}
      <section className="py-6 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            A股指数
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {aIndexes.map(index => (
              <div key={index.code} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium truncate">{index.name}</span>
                  <MiniChart data={index.priceHistory} isPositive={index.change >= 0} width={50} height={24} />
                </div>
                <div className={`text-lg font-bold ${index.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                  {index.currentValue.toFixed(2)}
                </div>
                <div className={`text-xs ${index.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                  {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Overview - 全球指数 */}
      <section className="py-6 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            全球指数
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {globalIndexes.map(index => (
              <div key={index.code} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium truncate">{index.name}</span>
                  <MiniChart data={index.priceHistory} isPositive={index.change >= 0} width={50} height={24} />
                </div>
                <div className={`text-lg font-bold ${index.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                  {index.currentValue.toFixed(2)}
                </div>
                <div className={`text-xs ${index.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                  {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* 股票知识学习 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">股票知识学习</CardTitle>
                </div>
                <CardDescription className="text-base">
                  通过问卷测验和小百科，系统学习股票投资知识
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/quiz" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="p-2 rounded-md bg-gold/10 text-gold">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">知识测验</h3>
                      <p className="text-sm text-muted-foreground">随机10题，检测您的股票知识水平</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
                <Link to="/encyclopedia" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <BookOpenCheck className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">股票小百科</h3>
                      <p className="text-sm text-muted-foreground">从入门到进阶的系统知识库</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* 数据查询 */}
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg bg-gold/10 text-gold">
                    <Search className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">数据查询</CardTitle>
                </div>
                <CardDescription className="text-base">
                  查询指数、股票、基金的实时行情与资讯
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/data-query?tab=realtime&symbol=AAPL" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="p-2 rounded-md bg-stock-rise/10 text-stock-rise">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">实时行情</h3>
                      <p className="text-sm text-muted-foreground">查询美股实时价格（如：AAPL苹果）</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
                <Link to="/data-query?tab=index" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="p-2 rounded-md bg-stock-rise/10 text-stock-rise">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">指数查询</h3>
                      <p className="text-sm text-muted-foreground">A股指数、美股指数实时行情</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
                <Link to="/data-query?tab=stock" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="p-2 rounded-md bg-primary/10 text-primary">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">股票查询</h3>
                      <p className="text-sm text-muted-foreground">A股、港股、美股股票行情</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
                <Link to="/data-query?tab=fund" className="block">
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                    <div className="p-2 rounded-md bg-gold/10 text-gold">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">基金查询</h3>
                      <p className="text-sm text-muted-foreground">基金产品、基金公司信息</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">为什么选择股票智投</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">专业知识体系</h3>
              <p className="text-sm text-muted-foreground">从基础到进阶的完整股票知识库</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">实时行情数据</h3>
              <p className="text-sm text-muted-foreground">全球市场指数、股票、基金数据</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-stock-rise/10 text-stock-rise flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">互动式学习</h3>
              <p className="text-sm text-muted-foreground">通过测验检验学习成果</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
