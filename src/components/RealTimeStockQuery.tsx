import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TimeShareChart } from '@/components/TimeShareChart';
import { Search, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { searchCompanyByInput, searchCompanies, type CompanyMapping } from '@/lib/companyMapping';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  fetched_at: string;
  timeShareData?: Array<{
    time: string;
    price: number;
    avgPrice: number;
    volume: number;
  }>;
}

export function RealTimeStockQuery() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<CompanyMapping[]>([]);

  const fetchStockPrice = async () => {
    const trimmedSymbol = symbol.trim();
    if (!trimmedSymbol) {
      setError('请输入股票代码或公司名称');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setShowSuggestions(false);

    try {
      const stockCode = searchCompanyByInput(trimmedSymbol);

      console.log('查询股票代码:', stockCode);
      console.log('原始输入:', trimmedSymbol);

      const response = await fetch(
        `https://lahnoanbjydllvrvbncj.supabase.co/functions/v1/fetch-stock-data?symbol=${stockCode}`
      );
      const data = await response.json();

      console.log('API 响应状态:', response.status);
      console.log('API 返回数据:', data);

      if (response.ok) {
        if (data && typeof data === 'object') {
          const hasRequiredFields = data.symbol && data.price !== undefined && data.change !== undefined;
          
          if (hasRequiredFields) {
            console.log('使用真实 API 数据');
            setResult({
              ...data,
              dataSource: 'Supabase API'
            });
          } else {
            console.warn('API 返回数据不完整，使用模拟数据');
            setResult({
              symbol: stockCode.toUpperCase(),
              price: 170 + Math.random() * 10,
              change: (Math.random() - 0.5) * 5,
              changePercent: (Math.random() - 0.5) * 3,
              volume: Math.floor(Math.random() * 10000000) + 5000000,
              open: (170 + Math.random() * 10) * 0.98,
              high: (170 + Math.random() * 10) * 1.02,
              low: (170 + Math.random() * 10) * 0.97,
              previousClose: 170 + Math.random() * 10,
              fetched_at: new Date().toISOString(),
              timeShareData: generateMockTimeShareData(),
              dataSource: '模拟数据（API 数据不完整）'
            });
          }
        } else {
          console.error('API 返回数据格式不正确，使用模拟数据');
          setResult({
            symbol: stockCode.toUpperCase(),
            price: 170 + Math.random() * 10,
            change: (Math.random() - 0.5) * 5,
            changePercent: (Math.random() - 0.5) * 3,
            volume: Math.floor(Math.random() * 10000000) + 5000000,
            open: (170 + Math.random() * 10) * 0.98,
            high: (170 + Math.random() * 10) * 1.02,
            low: (170 + Math.random() * 10) * 0.97,
            previousClose: 170 + Math.random() * 10,
            fetched_at: new Date().toISOString(),
            timeShareData: generateMockTimeShareData(),
            dataSource: '模拟数据（API 不可用）'
          });
        }
      } else {
        console.error('API 调用失败，使用模拟数据');
        setResult({
          symbol: stockCode.toUpperCase(),
          price: 170 + Math.random() * 10,
          change: (Math.random() - 0.5) * 5,
          changePercent: (Math.random() - 0.5) * 3,
          volume: Math.floor(Math.random() * 10000000) + 5000000,
          open: (170 + Math.random() * 10) * 0.98,
          high: (170 + Math.random() * 10) * 1.02,
          low: (170 + Math.random() * 10) * 0.97,
          previousClose: 170 + Math.random() * 10,
          fetched_at: new Date().toISOString(),
          timeShareData: generateMockTimeShareData(),
          dataSource: '模拟数据（API 不可用）'
        });
      }
    } catch (err) {
      console.error('网络错误:', err);
      setError('网络错误: ' + (err instanceof Error ? err.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchStockPrice();
    }
  };

  const generateMockTimeShareData = () => {
    const data = [];
    const basePrice = 170 + Math.random() * 10;
    const startTime = new Date();
    startTime.setHours(9, 30, 0, 0);
    
    for (let i = 0; i < 20; i++) {
      const time = new Date(startTime.getTime() + i * 30 * 60 * 1000);
      const price = basePrice + (Math.random() - 0.5) * 5;
      const avgPrice = basePrice + (Math.random() - 0.3) * 3;
      
      data.push({
        time: `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`,
        price: Math.round(price * 100) / 100,
        avgPrice: Math.round(avgPrice * 100) / 100,
        volume: Math.floor(Math.random() * 1000000) + 1000000
      });
    }
    
    return data;
  };

  const handleInputChange = (value: string) => {
    setSymbol(value);
    if (value.trim().length > 0) {
      const matches = searchCompanies(value);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (code: string) => {
    setSymbol(code);
    setShowSuggestions(false);
    fetchStockPrice();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gold" />
          实时股票查询
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="输入股票代码或公司名称 (如: 苹果, AAPL, pingguo)"
                value={symbol}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (symbol.trim().length > 0) {
                    const matches = searchCompanies(symbol);
                    setSuggestions(matches);
                    setShowSuggestions(matches.length > 0);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                className="pl-9"
              />
            </div>
            <Button onClick={fetchStockPrice} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  查询中
                </>
              ) : (
                '查询'
              )}
            </Button>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((company) => (
                <button
                  key={company.code}
                  onClick={() => handleSelectSuggestion(company.code)}
                  className="w-full px-4 py-3 text-left hover:bg-accent transition-colors border-b border-border last:border-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{company.name}</div>
                      <div className="text-xs text-muted-foreground">{company.nameEn}</div>
                    </div>
                    <div className="text-sm font-mono text-primary">{company.code}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary">{result.symbol}</h3>
                  <div className="text-xs text-muted-foreground mt-1">
                    更新时间: {new Date(result.fetched_at).toLocaleString('zh-CN')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    数据来源: {result.dataSource || 'Supabase API'}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${result.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                    ${result.price.toFixed(2)}
                  </div>
                  <div className={`text-sm ${result.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                    {result.change >= 0 ? '+' : ''}{result.change.toFixed(2)} ({result.change >= 0 ? '+' : ''}{result.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                <div className="p-2 rounded bg-background">
                  <div className="text-xs text-muted-foreground">今开</div>
                  <div className="font-medium">{result.open.toFixed(2)}</div>
                </div>
                <div className="p-2 rounded bg-background">
                  <div className="text-xs text-muted-foreground">最高</div>
                  <div className="font-medium text-stock-rise">{result.high.toFixed(2)}</div>
                </div>
                <div className="p-2 rounded bg-background">
                  <div className="text-xs text-muted-foreground">最低</div>
                  <div className="font-medium text-stock-fall">{result.low.toFixed(2)}</div>
                </div>
                <div className="p-2 rounded bg-background">
                  <div className="text-xs text-muted-foreground">成交量</div>
                  <div className="font-medium">{(result.volume / 1000000).toFixed(2)}M</div>
                </div>
              </div>
            </div>

            {result.timeShareData && result.timeShareData.length > 0 && (
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="text-sm font-medium mb-3">当日分时图</h4>
                <TimeShareChart 
                  data={result.timeShareData} 
                  height={250}
                  yesterdayClose={result.previousClose}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
