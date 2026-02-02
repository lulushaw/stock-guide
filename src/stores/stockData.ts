// 模拟股票数据 - 纯前端版本

// 分时数据结构
export interface TimeShareData {
  time: string;
  price: number;
  avgPrice: number;
  volume: number;
}

// K线数据结构
export interface KlineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockPrice {
  time: string;
  price: number;
  volume: number;
}

// 资金流向数据
export interface MoneyFlow {
  institutionBuy: number;    // 机构买入（万元）
  institutionSell: number;   // 机构卖出（万元）
  hotMoneyBuy: number;       // 游资买入（万元）
  hotMoneySell: number;      // 游资卖出（万元）
  retailBuy: number;         // 散户买入（万元）
  retailSell: number;        // 散户卖出（万元）
  netInflow: number;         // 净流入（万元）
}

export interface StockInfo {
  code: string;
  name: string;
  pinyin: string;           // 拼音首字母
  market: 'A' | 'HK' | 'US';
  currentPrice: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  yesterdayClose: number;   // 昨收价
  volume: string;
  marketCap: string;
  pe: number;
  priceHistory: StockPrice[];
  klineData: KlineData[];
  timeShareData: TimeShareData[];
  moneyFlow: MoneyFlow;
}

export interface IndexInfo {
  code: string;
  name: string;
  pinyin: string;
  market: 'A' | 'HK' | 'US' | 'JP';
  currentValue: number;
  change: number;
  changePercent: number;
  yesterdayClose: number;
  priceHistory: StockPrice[];
  klineData: KlineData[];
  timeShareData: TimeShareData[];
}

export interface FundInfo {
  code: string;
  name: string;
  pinyin: string;
  type: string;
  company: string;
  nav: number;
  change: number;
  changePercent: number;
  yesterdayClose: number;
  priceHistory: StockPrice[];
  klineData: KlineData[];
  timeShareData: TimeShareData[];
  moneyFlow: MoneyFlow;
}

// 生成模拟分时数据（当日）
const generateTimeShareData = (basePrice: number, yesterdayClose: number): TimeShareData[] => {
  const data: TimeShareData[] = [];
  let price = yesterdayClose;
  let totalVolume = 0;
  let totalAmount = 0;
  
  // 生成9:30-11:30, 13:00-15:00的分时数据（每分钟一条）
  const timeSlots = [
    { start: 9 * 60 + 30, end: 11 * 60 + 30 },  // 上午
    { start: 13 * 60, end: 15 * 60 }             // 下午
  ];
  
  for (const slot of timeSlots) {
    for (let minute = slot.start; minute <= slot.end; minute++) {
      const hour = Math.floor(minute / 60);
      const min = minute % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      
      // 价格波动
      const volatility = basePrice * 0.003;
      const change = (Math.random() - 0.48) * volatility;
      price = price + change;
      price = Math.max(price, yesterdayClose * 0.9);  // 跌停限制
      price = Math.min(price, yesterdayClose * 1.1);  // 涨停限制
      
      const volume = Math.floor(Math.random() * 500000) + 50000;
      totalVolume += volume;
      totalAmount += price * volume;
      
      data.push({
        time: timeStr,
        price: Number(price.toFixed(2)),
        avgPrice: Number((totalAmount / totalVolume).toFixed(2)),
        volume
      });
    }
  }
  
  return data;
};

// 生成模拟K线数据
const generateKlineData = (basePrice: number, days: number = 60): KlineData[] => {
  const data: KlineData[] = [];
  let price = basePrice * 0.85;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const volatility = basePrice * 0.02;
    const open = price + (Math.random() - 0.5) * volatility;
    const close = open + (Math.random() - 0.48) * volatility * 1.5;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    
    price = close;
    price = Math.max(price, basePrice * 0.6);
    price = Math.min(price, basePrice * 1.4);
    
    data.push({
      time: date.toISOString().split('T')[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000
    });
  }
  
  return data;
};

// 生成模拟价格历史数据（从K线数据转换）
const generatePriceHistory = (klineData: KlineData[]): StockPrice[] => {
  return klineData.map(k => ({
    time: k.time,
    price: k.close,
    volume: k.volume
  }));
};

// 生成资金流向数据
const generateMoneyFlow = (baseAmount: number): MoneyFlow => {
  const institutionBuy = Math.floor(Math.random() * baseAmount * 0.3);
  const institutionSell = Math.floor(Math.random() * baseAmount * 0.25);
  const hotMoneyBuy = Math.floor(Math.random() * baseAmount * 0.2);
  const hotMoneySell = Math.floor(Math.random() * baseAmount * 0.18);
  const retailBuy = Math.floor(Math.random() * baseAmount * 0.5);
  const retailSell = Math.floor(Math.random() * baseAmount * 0.45);
  
  return {
    institutionBuy,
    institutionSell,
    hotMoneyBuy,
    hotMoneySell,
    retailBuy,
    retailSell,
    netInflow: (institutionBuy - institutionSell) + (hotMoneyBuy - hotMoneySell) + (retailBuy - retailSell)
  };
};

// A股指数（包含创业板、科创板）
export const aIndexes: IndexInfo[] = [
  {
    code: '000001',
    name: '上证指数',
    pinyin: 'SZZS',
    market: 'A',
    currentValue: 3089.26,
    change: 23.15,
    changePercent: 0.75,
    klineData: generateKlineData(3089.26),
    priceHistory: []
  },
  {
    code: '399001',
    name: '深证成指',
    pinyin: 'SZCZ',
    market: 'A',
    currentValue: 9298.78,
    change: -42.31,
    changePercent: -0.45,
    klineData: generateKlineData(9298.78),
    priceHistory: []
  },
  {
    code: '000300',
    name: '沪深300',
    pinyin: 'HS300',
    market: 'A',
    currentValue: 3612.45,
    change: 18.67,
    changePercent: 0.52,
    klineData: generateKlineData(3612.45),
    priceHistory: []
  },
  {
    code: '000016',
    name: '上证50',
    pinyin: 'SZ50',
    market: 'A',
    currentValue: 2456.78,
    change: 12.34,
    changePercent: 0.50,
    klineData: generateKlineData(2456.78),
    priceHistory: []
  },
  {
    code: '399006',
    name: '创业板指',
    pinyin: 'CYBZ',
    market: 'A',
    currentValue: 1823.45,
    change: -28.67,
    changePercent: -1.55,
    klineData: generateKlineData(1823.45),
    priceHistory: []
  },
  {
    code: '000688',
    name: '科创50',
    pinyin: 'KC50',
    market: 'A',
    currentValue: 956.32,
    change: 15.28,
    changePercent: 1.62,
    klineData: generateKlineData(956.32),
    priceHistory: []
  }
].map(idx => {
  const yesterdayClose = idx.currentValue - idx.change;
  return { 
    ...idx, 
    yesterdayClose,
    priceHistory: generatePriceHistory(idx.klineData),
    timeShareData: generateTimeShareData(idx.currentValue, yesterdayClose)
  };
});

// 全球指数（港股、美股、日股）
export const globalIndexes: IndexInfo[] = [
  {
    code: 'HSI',
    name: '恒生指数',
    pinyin: 'HSZS',
    market: 'HK',
    currentValue: 16589.44,
    change: 234.56,
    changePercent: 1.43,
    klineData: generateKlineData(16589.44),
    priceHistory: []
  },
  {
    code: 'HSCEI',
    name: '恒生国企指数',
    pinyin: 'HSGQZS',
    market: 'HK',
    currentValue: 5678.90,
    change: 89.12,
    changePercent: 1.59,
    klineData: generateKlineData(5678.90),
    priceHistory: []
  },
  {
    code: 'IXIC',
    name: '纳斯达克',
    pinyin: 'NSDK',
    market: 'US',
    currentValue: 15990.66,
    change: 267.31,
    changePercent: 1.70,
    klineData: generateKlineData(15990.66),
    priceHistory: []
  },
  {
    code: 'SPX',
    name: '标普500',
    pinyin: 'BP500',
    market: 'US',
    currentValue: 5026.61,
    change: 52.42,
    changePercent: 1.05,
    klineData: generateKlineData(5026.61),
    priceHistory: []
  },
  {
    code: 'DJI',
    name: '道琼斯',
    pinyin: 'DQS',
    market: 'US',
    currentValue: 38671.69,
    change: 134.21,
    changePercent: 0.35,
    klineData: generateKlineData(38671.69),
    priceHistory: []
  },
  {
    code: 'N225',
    name: '日经225',
    pinyin: 'RJ225',
    market: 'JP',
    currentValue: 38487.24,
    change: -156.89,
    changePercent: -0.41,
    klineData: generateKlineData(38487.24),
    priceHistory: []
  }
].map(idx => {
  const yesterdayClose = idx.currentValue - idx.change;
  return { 
    ...idx, 
    yesterdayClose,
    priceHistory: generatePriceHistory(idx.klineData),
    timeShareData: generateTimeShareData(idx.currentValue, yesterdayClose)
  };
});

// A股股票
export const aStocks: StockInfo[] = [
  {
    code: '600519',
    name: '贵州茅台',
    pinyin: 'GZMT',
    market: 'A',
    currentPrice: 1688.00,
    change: 23.50,
    changePercent: 1.41,
    open: 1665.00,
    high: 1695.00,
    low: 1660.00,
    volume: '3.2万手',
    marketCap: '2.12万亿',
    pe: 28.5,
    klineData: generateKlineData(1688.00),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(50000)
  },
  {
    code: '000858',
    name: '五粮液',
    pinyin: 'WLY',
    market: 'A',
    currentPrice: 142.35,
    change: -2.15,
    changePercent: -1.49,
    open: 144.50,
    high: 145.20,
    low: 141.80,
    volume: '5.8万手',
    marketCap: '5523亿',
    pe: 21.3,
    klineData: generateKlineData(142.35),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(30000)
  },
  {
    code: '601318',
    name: '中国平安',
    pinyin: 'ZGPA',
    market: 'A',
    currentPrice: 45.67,
    change: 0.89,
    changePercent: 1.99,
    open: 44.80,
    high: 46.20,
    low: 44.50,
    volume: '12.5万手',
    marketCap: '8326亿',
    pe: 8.9,
    klineData: generateKlineData(45.67),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(25000)
  },
  {
    code: '000001',
    name: '平安银行',
    pinyin: 'PAYH',
    market: 'A',
    currentPrice: 11.23,
    change: 0.15,
    changePercent: 1.35,
    open: 11.08,
    high: 11.35,
    low: 11.00,
    volume: '45.2万手',
    marketCap: '2178亿',
    pe: 5.2,
    klineData: generateKlineData(11.23),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(15000)
  },
  {
    code: '600036',
    name: '招商银行',
    pinyin: 'ZSYH',
    market: 'A',
    currentPrice: 32.45,
    change: -0.56,
    changePercent: -1.70,
    open: 33.00,
    high: 33.20,
    low: 32.30,
    volume: '18.7万手',
    marketCap: '8178亿',
    pe: 6.1,
    klineData: generateKlineData(32.45),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(20000)
  },
  {
    code: '300750',
    name: '宁德时代',
    pinyin: 'NDSD',
    market: 'A',
    currentPrice: 198.56,
    change: 5.67,
    changePercent: 2.94,
    open: 193.50,
    high: 201.00,
    low: 192.80,
    volume: '8.5万手',
    marketCap: '8726亿',
    pe: 22.8,
    klineData: generateKlineData(198.56),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(35000)
  },
  {
    code: '688981',
    name: '中芯国际',
    pinyin: 'ZXGJ',
    market: 'A',
    currentPrice: 52.34,
    change: 1.23,
    changePercent: 2.41,
    open: 51.20,
    high: 53.00,
    low: 50.80,
    volume: '6.2万手',
    marketCap: '4125亿',
    pe: 45.6,
    klineData: generateKlineData(52.34),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(28000)
  },
  {
    code: '600900',
    name: '长江电力',
    pinyin: 'CJDL',
    market: 'A',
    currentPrice: 28.45,
    change: 0.32,
    changePercent: 1.14,
    open: 28.15,
    high: 28.60,
    low: 28.00,
    volume: '10.3万手',
    marketCap: '6932亿',
    pe: 18.5,
    klineData: generateKlineData(28.45),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(22000)
  }
].map(s => {
  const yesterdayClose = s.currentPrice - s.change;
  return { 
    ...s, 
    yesterdayClose,
    priceHistory: generatePriceHistory(s.klineData),
    timeShareData: generateTimeShareData(s.currentPrice, yesterdayClose)
  };
});

// 港股
export const hkStocks: StockInfo[] = [
  {
    code: '00700',
    name: '腾讯控股',
    pinyin: 'TXKG',
    market: 'HK',
    currentPrice: 312.40,
    change: 8.60,
    changePercent: 2.83,
    open: 304.00,
    high: 315.00,
    low: 302.80,
    volume: '1.2亿股',
    marketCap: '2.93万亿',
    pe: 18.5,
    klineData: generateKlineData(312.40),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(80000)
  },
  {
    code: '09988',
    name: '阿里巴巴-SW',
    pinyin: 'ALBB',
    market: 'HK',
    currentPrice: 73.25,
    change: -1.35,
    changePercent: -1.81,
    open: 74.50,
    high: 75.00,
    low: 72.80,
    volume: '8500万股',
    marketCap: '1.46万亿',
    pe: 12.3,
    klineData: generateKlineData(73.25),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(60000)
  },
  {
    code: '03690',
    name: '美团-W',
    pinyin: 'MT',
    market: 'HK',
    currentPrice: 128.50,
    change: 4.20,
    changePercent: 3.38,
    open: 124.50,
    high: 130.00,
    low: 124.00,
    volume: '4200万股',
    marketCap: '8012亿',
    pe: 45.2,
    klineData: generateKlineData(128.50),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(45000)
  },
  {
    code: '01810',
    name: '小米集团-W',
    pinyin: 'XMJT',
    market: 'HK',
    currentPrice: 18.56,
    change: 0.78,
    changePercent: 4.39,
    open: 17.80,
    high: 18.80,
    low: 17.60,
    volume: '2.1亿股',
    marketCap: '4632亿',
    pe: 28.9,
    klineData: generateKlineData(18.56),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(35000)
  }
].map(s => {
  const yesterdayClose = s.currentPrice - s.change;
  return { 
    ...s, 
    yesterdayClose,
    priceHistory: generatePriceHistory(s.klineData),
    timeShareData: generateTimeShareData(s.currentPrice, yesterdayClose)
  };
});

// 美股
export const usStocks: StockInfo[] = [
  {
    code: 'AAPL',
    name: '苹果公司',
    pinyin: 'PGGS',
    market: 'US',
    currentPrice: 182.63,
    change: 3.21,
    changePercent: 1.79,
    open: 179.50,
    high: 183.50,
    low: 179.00,
    volume: '5800万股',
    marketCap: '2.82万亿美元',
    pe: 28.9,
    klineData: generateKlineData(182.63),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(100000)
  },
  {
    code: 'MSFT',
    name: '微软公司',
    pinyin: 'WRGS',
    market: 'US',
    currentPrice: 415.32,
    change: 7.85,
    changePercent: 1.93,
    open: 408.00,
    high: 417.00,
    low: 407.50,
    volume: '2100万股',
    marketCap: '3.08万亿美元',
    pe: 35.6,
    klineData: generateKlineData(415.32),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(90000)
  },
  {
    code: 'NVDA',
    name: '英伟达',
    pinyin: 'YWD',
    market: 'US',
    currentPrice: 878.35,
    change: 42.15,
    changePercent: 5.04,
    open: 840.00,
    high: 885.00,
    low: 838.00,
    volume: '4500万股',
    marketCap: '2.17万亿美元',
    pe: 65.2,
    klineData: generateKlineData(878.35),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(120000)
  },
  {
    code: 'TSLA',
    name: '特斯拉',
    pinyin: 'TSL',
    market: 'US',
    currentPrice: 185.42,
    change: -8.65,
    changePercent: -4.46,
    open: 194.00,
    high: 195.50,
    low: 184.00,
    volume: '1.2亿股',
    marketCap: '5891亿美元',
    pe: 42.8,
    klineData: generateKlineData(185.42),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(85000)
  },
  {
    code: 'GOOGL',
    name: '谷歌',
    pinyin: 'GG',
    market: 'US',
    currentPrice: 175.98,
    change: 2.34,
    changePercent: 1.35,
    open: 173.50,
    high: 176.50,
    low: 172.80,
    volume: '2800万股',
    marketCap: '2.18万亿美元',
    pe: 25.6,
    klineData: generateKlineData(175.98),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(75000)
  }
].map(s => {
  const yesterdayClose = s.currentPrice - s.change;
  return { 
    ...s, 
    yesterdayClose,
    priceHistory: generatePriceHistory(s.klineData),
    timeShareData: generateTimeShareData(s.currentPrice, yesterdayClose)
  };
});

// 基金产品
export const funds: FundInfo[] = [
  {
    code: '110011',
    name: '易方达中小盘混合',
    pinyin: 'YFDXZP',
    type: '混合型',
    company: '易方达基金',
    nav: 3.2456,
    change: 0.0234,
    changePercent: 0.73,
    klineData: generateKlineData(3.2456),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(8000)
  },
  {
    code: '161725',
    name: '招商中证白酒指数',
    pinyin: 'ZSBJZS',
    type: '指数型',
    company: '招商基金',
    nav: 1.5678,
    change: -0.0189,
    changePercent: -1.19,
    klineData: generateKlineData(1.5678),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(12000)
  },
  {
    code: '001938',
    name: '中欧时代先锋',
    pinyin: 'ZOSDXF',
    type: '股票型',
    company: '中欧基金',
    nav: 2.8934,
    change: 0.0456,
    changePercent: 1.60,
    klineData: generateKlineData(2.8934),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(6000)
  },
  {
    code: '005827',
    name: '易方达蓝筹精选',
    pinyin: 'YFDLCJX',
    type: '混合型',
    company: '易方达基金',
    nav: 2.1234,
    change: 0.0123,
    changePercent: 0.58,
    klineData: generateKlineData(2.1234),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(15000)
  },
  {
    code: '163406',
    name: '兴全合润混合',
    pinyin: 'XQHRHH',
    type: '混合型',
    company: '兴证全球基金',
    nav: 1.8765,
    change: -0.0098,
    changePercent: -0.52,
    klineData: generateKlineData(1.8765),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(10000)
  },
  {
    code: '007119',
    name: '景顺长城新能源',
    pinyin: 'JSCXNY',
    type: '股票型',
    company: '景顺长城基金',
    nav: 1.4532,
    change: 0.0567,
    changePercent: 4.06,
    klineData: generateKlineData(1.4532),
    priceHistory: [],
    moneyFlow: generateMoneyFlow(9000)
  }
].map(f => {
  const yesterdayClose = f.nav - f.change;
  return { 
    ...f, 
    yesterdayClose,
    priceHistory: generatePriceHistory(f.klineData),
    timeShareData: generateTimeShareData(f.nav, yesterdayClose)
  };
});

// 基金公司
export const fundCompanies = [
  { name: '易方达基金', scale: '1.5万亿', fundCount: 256 },
  { name: '华夏基金', scale: '1.2万亿', fundCount: 218 },
  { name: '广发基金', scale: '1.1万亿', fundCount: 198 },
  { name: '招商基金', scale: '8500亿', fundCount: 176 },
  { name: '南方基金', scale: '8200亿', fundCount: 165 },
  { name: '中欧基金', scale: '5800亿', fundCount: 89 },
  { name: '兴证全球基金', scale: '4500亿', fundCount: 78 },
  { name: '景顺长城基金', scale: '4200亿', fundCount: 86 }
];

// 搜索函数（支持名称、代码、拼音首字母搜索）
export const searchStocks = (keyword: string, market?: 'A' | 'HK' | 'US'): StockInfo[] => {
  let stocks: StockInfo[] = [];
  
  if (!market || market === 'A') stocks = stocks.concat(aStocks);
  if (!market || market === 'HK') stocks = stocks.concat(hkStocks);
  if (!market || market === 'US') stocks = stocks.concat(usStocks);
  
  if (!keyword) return stocks;
  
  const upperKeyword = keyword.toUpperCase();
  
  return stocks.filter(s => 
    s.code.toUpperCase().includes(upperKeyword) || 
    s.name.includes(keyword) ||
    s.pinyin.toUpperCase().includes(upperKeyword)
  );
};

export const searchFunds = (keyword: string): FundInfo[] => {
  if (!keyword) return funds;
  
  const upperKeyword = keyword.toUpperCase();
  
  return funds.filter(f => 
    f.code.includes(keyword) || 
    f.name.includes(keyword) ||
    f.pinyin.toUpperCase().includes(upperKeyword)
  );
};

export const searchIndexes = (keyword: string, type: 'A' | 'global'): IndexInfo[] => {
  const indexes = type === 'A' ? aIndexes : globalIndexes;
  
  if (!keyword) return indexes;
  
  const upperKeyword = keyword.toUpperCase();
  
  return indexes.filter(i => 
    i.code.toUpperCase().includes(upperKeyword) || 
    i.name.includes(keyword) ||
    i.pinyin.toUpperCase().includes(upperKeyword)
  );
};

// 兼容旧的 usIndexes 导出
export const usIndexes = globalIndexes.filter(i => i.market === 'US');
