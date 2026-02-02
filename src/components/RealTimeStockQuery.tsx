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

      const response = await fetch(
        `https://lahnoanbjydllvrvbncj.supabase.co/functions/v1/fetch-stock-data?symbol=${stockCode}`
      );
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || '查询失败，请稍后重试');
      }
    } catch (err) {
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
