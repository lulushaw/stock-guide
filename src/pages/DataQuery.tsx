import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimeShareChart } from '@/components/TimeShareChart';
import {
  aIndexes, globalIndexes, aStocks, hkStocks, usStocks, funds, fundCompanies,
  searchStocks, searchFunds,
  type StockInfo, type IndexInfo, type FundInfo, type MoneyFlow
} from '@/stores/stockData';
import { analytics } from '@/lib/analytics';
import { searchCompanyByInput, searchCompanies, type CompanyMapping } from '@/lib/companyMapping';
import { Search, TrendingUp, TrendingDown, BarChart3, Wallet, Building, ArrowUpRight, ArrowDownRight, Zap, Loader2, AlertCircle } from 'lucide-react';

export default function DataQuery() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'index';
  const initialSymbol = searchParams.get('symbol') || '';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Index state
  const [indexMarket, setIndexMarket] = useState<'A' | 'global'>('A');
  const [selectedIndex, setSelectedIndex] = useState<IndexInfo | null>(null);
  
  // Stock state
  const [stockMarket, setStockMarket] = useState<'A' | 'HK' | 'US'>('A');
  const [stockSearch, setStockSearch] = useState('');
  const [selectedStock, setSelectedStock] = useState<StockInfo | null>(null);
  
  // Fund state
  const [fundTab, setFundTab] = useState<'products' | 'companies'>('products');
  const [fundSearch, setFundSearch] = useState('');
  const [selectedFund, setSelectedFund] = useState<FundInfo | null>(null);

  // Real-time stock query state
  const [realtimeSymbol, setRealtimeSymbol] = useState(initialSymbol);
  const [realtimeLoading, setRealtimeLoading] = useState(false);
  const [realtimeResult, setRealtimeResult] = useState<any>(null);
  const [realtimeError, setRealtimeError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<CompanyMapping[]>([]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Auto-query symbol if provided in URL
  useEffect(() => {
    if (initialSymbol && activeTab === 'realtime') {
      fetchRealtimeStock(initialSymbol);
    }
  }, [initialSymbol, activeTab]);

  const fetchRealtimeStock = async (symbol: string) => {
    const trimmedSymbol = symbol.trim();
    if (!trimmedSymbol) {
      setRealtimeError('请输入股票代码或公司名称');
      return;
    }

    setRealtimeLoading(true);
    setRealtimeError(null);
    setRealtimeResult(null);
    setShowSuggestions(false);

    try {
      const stockCode = searchCompanyByInput(trimmedSymbol);
      analytics.trackDataQuery('realtime_stock', stockCode);

      const response = await fetch(
        `https://lahnoanbjydllvrvbncj.supabase.co/functions/v1/fetch-stock-data?symbol=${stockCode}`
      );
      const data = await response.json();

      if (response.ok) {
        setRealtimeResult(data);
      } else {
        setRealtimeError(data.error || '查询失败，请稍后重试');
      }
    } catch (err) {
      setRealtimeError('网络错误: ' + (err instanceof Error ? err.message : '未知错误'));
    } finally {
      setRealtimeLoading(false);
    }
  };

  const handleRealtimeQuery = () => {
    fetchRealtimeStock(realtimeSymbol);
  };

  const handleRealtimeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRealtimeQuery();
    }
  };

  const handleRealInputChange = (value: string) => {
    setRealtimeSymbol(value);
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
    setRealtimeSymbol(code);
    setShowSuggestions(false);
    fetchRealtimeStock(code);
  };

  const currentIndexes = indexMarket === 'A' ? aIndexes : globalIndexes;
  
  const getStocksByMarket = () => {
    if (stockMarket === 'A') return aStocks;
    if (stockMarket === 'HK') return hkStocks;
    return usStocks;
  };

  const filteredStocks = stockSearch
    ? searchStocks(stockSearch, stockMarket)
    : getStocksByMarket();

  const filteredFunds = fundSearch
    ? searchFunds(fundSearch)
    : funds;

  // GA4 事件追踪：股票搜索
  useEffect(() => {
    if (stockSearch && stockSearch.length >= 2) {
      const timer = setTimeout(() => {
        analytics.trackDataQuery('stock', stockSearch);
      }, 500); // 防抖处理
      return () => clearTimeout(timer);
    }
  }, [stockSearch]);

  // GA4 事件追踪：基金搜索
  useEffect(() => {
    if (fundSearch && fundSearch.length >= 2) {
      const timer = setTimeout(() => {
        analytics.trackDataQuery('fund', fundSearch);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [fundSearch]);

  // GA4 事件追踪：查看股票详情
  useEffect(() => {
    if (selectedStock) {
      analytics.trackViewStock(selectedStock.code, selectedStock.name);
    }
  }, [selectedStock]);

  const renderPriceChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center gap-1 ${isPositive ? 'text-stock-rise' : 'text-stock-fall'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePercent.toFixed(2)}%)
      </span>
    );
  };

  // 资金流向组件
  const MoneyFlowCard = ({ flow, title }: { flow: MoneyFlow; title: string }) => {
    const formatAmount = (amount: number) => {
      if (amount >= 10000) {
        return (amount / 10000).toFixed(2) + '亿';
      }
      return amount.toFixed(0) + '万';
    };

    return (
      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}资金流向</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* 机构 */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">机构资金</div>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-stock-rise" />
                <span className="text-sm">买入</span>
                <span className="text-stock-rise font-medium">{formatAmount(flow.institutionBuy)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4 text-stock-fall" />
                <span className="text-sm">卖出</span>
                <span className="text-stock-fall font-medium">{formatAmount(flow.institutionSell)}</span>
              </div>
              <div className="text-xs text-muted-foreground pt-1 border-t">
                净流入: <span className={flow.institutionBuy - flow.institutionSell >= 0 ? 'text-stock-rise' : 'text-stock-fall'}>
                  {formatAmount(flow.institutionBuy - flow.institutionSell)}
                </span>
              </div>
            </div>

            {/* 游资 */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">游资资金</div>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-stock-rise" />
                <span className="text-sm">买入</span>
                <span className="text-stock-rise font-medium">{formatAmount(flow.hotMoneyBuy)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4 text-stock-fall" />
                <span className="text-sm">卖出</span>
                <span className="text-stock-fall font-medium">{formatAmount(flow.hotMoneySell)}</span>
              </div>
              <div className="text-xs text-muted-foreground pt-1 border-t">
                净流入: <span className={flow.hotMoneyBuy - flow.hotMoneySell >= 0 ? 'text-stock-rise' : 'text-stock-fall'}>
                  {formatAmount(flow.hotMoneyBuy - flow.hotMoneySell)}
                </span>
              </div>
            </div>

            {/* 散户 */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">散户资金</div>
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-stock-rise" />
                <span className="text-sm">买入</span>
                <span className="text-stock-rise font-medium">{formatAmount(flow.retailBuy)}</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4 text-stock-fall" />
                <span className="text-sm">卖出</span>
                <span className="text-stock-fall font-medium">{formatAmount(flow.retailSell)}</span>
              </div>
              <div className="text-xs text-muted-foreground pt-1 border-t">
                净流入: <span className={flow.retailBuy - flow.retailSell >= 0 ? 'text-stock-rise' : 'text-stock-fall'}>
                  {formatAmount(flow.retailBuy - flow.retailSell)}
                </span>
              </div>
            </div>
          </div>

          {/* 总净流入 */}
          <div className="mt-4 pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">当日总净流入</span>
              <span className={`text-lg font-bold ${flow.netInflow >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                {flow.netInflow >= 0 ? '+' : ''}{formatAmount(flow.netInflow)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/10 text-gold mb-3">
            <Search className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">数据查询</h1>
          <p className="text-muted-foreground mt-1">查询全球市场实时行情数据</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="realtime" className="gap-2">
              <Zap className="h-4 w-4" />
              实时行情
            </TabsTrigger>
            <TabsTrigger value="index" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              指数查询
            </TabsTrigger>
            <TabsTrigger value="stock" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              股票查询
            </TabsTrigger>
            <TabsTrigger value="fund" className="gap-2">
              <Wallet className="h-4 w-4" />
              基金查询
            </TabsTrigger>
          </TabsList>

          {/* 实时行情查询 */}
          <TabsContent value="realtime">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-gold" />
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
                          value={realtimeSymbol}
                          onChange={(e) => handleRealInputChange(e.target.value)}
                          onKeyDown={handleRealtimeKeyDown}
                          onFocus={() => {
                            if (realtimeSymbol.trim().length > 0) {
                              const matches = searchCompanies(realtimeSymbol);
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
                      <Button onClick={handleRealtimeQuery} disabled={realtimeLoading}>
                        {realtimeLoading ? (
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

                  {realtimeError && (
                    <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {realtimeError}
                    </div>
                  )}

                  {realtimeResult && (
                    <div className="mt-4 space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-primary">{realtimeResult.symbol}</h3>
                            <div className="text-xs text-muted-foreground mt-1">
                              更新时间: {new Date(realtimeResult.fetched_at).toLocaleString('zh-CN')}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${realtimeResult.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                              ${realtimeResult.price.toFixed(2)}
                            </div>
                            <div className={`text-sm ${realtimeResult.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                              {realtimeResult.change >= 0 ? '+' : ''}{realtimeResult.change.toFixed(2)} ({realtimeResult.change >= 0 ? '+' : ''}{realtimeResult.changePercent.toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-3">
                          <div className="p-2 rounded bg-background">
                            <div className="text-xs text-muted-foreground">今开</div>
                            <div className="font-medium">{realtimeResult.open.toFixed(2)}</div>
                          </div>
                          <div className="p-2 rounded bg-background">
                            <div className="text-xs text-muted-foreground">最高</div>
                            <div className="font-medium text-stock-rise">{realtimeResult.high.toFixed(2)}</div>
                          </div>
                          <div className="p-2 rounded bg-background">
                            <div className="text-xs text-muted-foreground">最低</div>
                            <div className="font-medium text-stock-fall">{realtimeResult.low.toFixed(2)}</div>
                          </div>
                          <div className="p-2 rounded bg-background">
                            <div className="text-xs text-muted-foreground">成交量</div>
                            <div className="font-medium">{(realtimeResult.volume / 1000000).toFixed(2)}M</div>
                          </div>
                        </div>
                      </div>

                      {realtimeResult.timeShareData && realtimeResult.timeShareData.length > 0 && (
                        <div className="p-4 rounded-lg bg-muted/50">
                          <h4 className="text-sm font-medium mb-3">当日分时图</h4>
                          <TimeShareChart 
                            data={realtimeResult.timeShareData} 
                            height={300}
                            yesterdayClose={realtimeResult.previousClose}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              <p className="text-center text-sm text-muted-foreground mt-4">
                支持输入股票代码、公司中文名称、英文名称或拼音查询
              </p>
            </div>
          </TabsContent>

          {/* 指数查询 */}
          <TabsContent value="index">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex gap-2">
                      <Button
                        variant={indexMarket === 'A' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => { setIndexMarket('A'); setSelectedIndex(null); }}
                      >
                        A股指数
                      </Button>
                      <Button
                        variant={indexMarket === 'global' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => { setIndexMarket('global'); setSelectedIndex(null); }}
                      >
                        全球指数
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                    {currentIndexes.map(index => (
                      <div
                        key={index.code}
                        onClick={() => setSelectedIndex(index)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors
                          ${selectedIndex?.code === index.code 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-accent/50'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{index.name}</div>
                            <div className="text-xs text-muted-foreground">{index.code}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${index.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                              {index.currentValue.toFixed(2)}
                            </div>
                            <div className={`text-xs ${index.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                              {index.change >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                {selectedIndex ? (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{selectedIndex.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{selectedIndex.code}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${selectedIndex.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                            {selectedIndex.currentValue.toFixed(2)}
                          </div>
                          {renderPriceChange(selectedIndex.change, selectedIndex.changePercent)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <TimeShareChart 
                        data={selectedIndex.timeShareData} 
                        height={350} 
                        yesterdayClose={selectedIndex.yesterdayClose}
                      />
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">请选择一个指数查看详情</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* 股票查询 */}
          <TabsContent value="stock">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex gap-2 mb-3">
                      <Button
                        variant={stockMarket === 'A' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => { setStockMarket('A'); setSelectedStock(null); }}
                      >
                        A股
                      </Button>
                      <Button
                        variant={stockMarket === 'HK' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => { setStockMarket('HK'); setSelectedStock(null); }}
                      >
                        港股
                      </Button>
                      <Button
                        variant={stockMarket === 'US' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => { setStockMarket('US'); setSelectedStock(null); }}
                      >
                        美股
                      </Button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="代码/名称/拼音首字母 如:GZMT"
                        value={stockSearch}
                        onChange={(e) => setStockSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      支持股票代码、名称、拼音首字母搜索
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                    {filteredStocks.map(stock => (
                      <div
                        key={stock.code}
                        onClick={() => setSelectedStock(stock)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors
                          ${selectedStock?.code === stock.code 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:bg-accent/50'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{stock.name}</div>
                            <div className="text-xs text-muted-foreground">{stock.code} | {stock.pinyin}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${stock.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                              {stock.currentPrice.toFixed(2)}
                            </div>
                            <div className={`text-xs ${stock.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredStocks.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        未找到匹配的股票
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                {selectedStock ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{selectedStock.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{selectedStock.code} | {selectedStock.pinyin}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${selectedStock.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                              {selectedStock.currentPrice.toFixed(2)}
                            </div>
                            {renderPriceChange(selectedStock.change, selectedStock.changePercent)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <TimeShareChart 
                          data={selectedStock.timeShareData} 
                          height={300}
                          yesterdayClose={selectedStock.yesterdayClose}
                        />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground">今开</div>
                            <div className="font-medium">{selectedStock.open.toFixed(2)}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground">最高</div>
                            <div className="font-medium text-stock-rise">{selectedStock.high.toFixed(2)}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground">最低</div>
                            <div className="font-medium text-stock-fall">{selectedStock.low.toFixed(2)}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground">成交量</div>
                            <div className="font-medium">{selectedStock.volume}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground">市值</div>
                            <div className="font-medium">{selectedStock.marketCap}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground">市盈率</div>
                            <div className="font-medium">{selectedStock.pe.toFixed(2)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* 资金流向 */}
                    <MoneyFlowCard flow={selectedStock.moneyFlow} title="股票" />
                  </div>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">请选择一只股票查看详情</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* 基金查询 */}
          <TabsContent value="fund">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex gap-2 mb-3">
                      <Button
                        variant={fundTab === 'products' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFundTab('products')}
                      >
                        基金产品
                      </Button>
                      <Button
                        variant={fundTab === 'companies' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFundTab('companies')}
                      >
                        基金公司
                      </Button>
                    </div>
                    {fundTab === 'products' && (
                      <>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="代码/名称/拼音首字母"
                            value={fundSearch}
                            onChange={(e) => setFundSearch(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          支持基金代码、名称、拼音首字母搜索
                        </p>
                      </>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
                    {fundTab === 'products' ? (
                      <>
                        {filteredFunds.map(fund => (
                          <div
                            key={fund.code}
                            onClick={() => setSelectedFund(fund)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors
                              ${selectedFund?.code === fund.code 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:bg-accent/50'}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium text-sm">{fund.name}</div>
                                <div className="text-xs text-muted-foreground">{fund.code} | {fund.pinyin}</div>
                              </div>
                              <div className="text-right">
                                <div className={`font-bold ${fund.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                                  {fund.nav.toFixed(4)}
                                </div>
                                <div className={`text-xs ${fund.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                                  {fund.change >= 0 ? '+' : ''}{fund.changePercent.toFixed(2)}%
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {filteredFunds.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            未找到匹配的基金
                          </div>
                        )}
                      </>
                    ) : (
                      fundCompanies.map(company => (
                        <div
                          key={company.name}
                          className="p-3 rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{company.name}</span>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>规模: {company.scale}</span>
                            <span>基金数: {company.fundCount}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="lg:col-span-2">
                {selectedFund && fundTab === 'products' ? (
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{selectedFund.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{selectedFund.code} | {selectedFund.pinyin} | {selectedFund.type}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold ${selectedFund.change >= 0 ? 'text-stock-rise' : 'text-stock-fall'}`}>
                              {selectedFund.nav.toFixed(4)}
                            </div>
                            {renderPriceChange(selectedFund.change, selectedFund.changePercent)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <TimeShareChart 
                          data={selectedFund.timeShareData} 
                          height={300}
                          yesterdayClose={selectedFund.yesterdayClose}
                        />
                        
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground">基金公司</div>
                            <div className="font-medium">{selectedFund.company}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-muted/50">
                            <div className="text-xs text-muted-foreground">基金类型</div>
                            <div className="font-medium">{selectedFund.type}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* 资金流向 */}
                    <MoneyFlowCard flow={selectedFund.moneyFlow} title="基金" />
                  </div>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {fundTab === 'products' ? '请选择一只基金查看详情' : '选择基金产品标签查看基金详情'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
