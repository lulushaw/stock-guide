import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface TimeShareData {
  time: string;
  price: number;
  avgPrice?: number;
  volume: number;
}

interface TimeShareChartProps {
  data: TimeShareData[];
  height?: number;
  yesterdayClose?: number;
}

// 自定义Tooltip
const CustomTooltip = ({ 
  active, 
  payload,
  yesterdayClose 
}: { 
  active?: boolean; 
  payload?: Array<{ payload: TimeShareData }>; 
  yesterdayClose?: number;
}) => {
  if (!active || !payload || !payload[0]) return null;
  
  const data = payload[0].payload;
  const change = yesterdayClose ? ((data.price - yesterdayClose) / yesterdayClose * 100) : 0;
  const isRise = change >= 0;
  
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
      <div className="font-medium mb-2">{data.time}</div>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">当前价:</span>
          <span className={`font-medium ${isRise ? 'text-stock-rise' : 'text-stock-fall'}`}>
            {data.price.toFixed(2)}
          </span>
        </div>
        {data.avgPrice && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">均价:</span>
            <span className="text-gold">{data.avgPrice.toFixed(2)}</span>
          </div>
        )}
        {yesterdayClose && (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">涨跌幅:</span>
            <span className={isRise ? 'text-stock-rise' : 'text-stock-fall'}>
              {isRise ? '+' : ''}{change.toFixed(2)}%
            </span>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">成交量:</span>
          <span>{(data.volume / 10000).toFixed(0)}万</span>
        </div>
      </div>
    </div>
  );
};

export function TimeShareChart({ data, height = 300, yesterdayClose }: TimeShareChartProps) {
  const { minPrice, maxPrice, refPrice } = useMemo(() => {
    if (data.length === 0) return { minPrice: 0, maxPrice: 0, refPrice: 0 };
    const prices = data.map(d => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const ref = yesterdayClose || (min + max) / 2;
    
    // 确保图表对称
    const maxDiff = Math.max(Math.abs(max - ref), Math.abs(min - ref));
    const padding = maxDiff * 0.1;
    
    return { 
      minPrice: ref - maxDiff - padding, 
      maxPrice: ref + maxDiff + padding,
      refPrice: ref
    };
  }, [data, yesterdayClose]);

  // 判断整体涨跌
  const isOverallRise = data.length > 0 && data[data.length - 1].price >= refPrice;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <defs>
          <linearGradient id="priceGradientRise" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="priceGradientFall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={false}
          tickFormatter={(value) => value.includes(':') ? value : value.slice(5)}
          interval="preserveStartEnd"
        />
        
        <YAxis
          domain={[minPrice, maxPrice]}
          tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          tickLine={false}
          width={60}
          tickFormatter={(value) => value.toFixed(2)}
        />
        
        {/* 昨收参考线 */}
        {yesterdayClose && (
          <ReferenceLine 
            y={yesterdayClose} 
            stroke="hsl(var(--muted-foreground))" 
            strokeDasharray="5 5"
            label={{ 
              value: '昨收', 
              position: 'right',
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 10
            }}
          />
        )}
        
        <Tooltip content={<CustomTooltip yesterdayClose={yesterdayClose} />} />
        
        {/* 分时价格线 */}
        <Area
          type="monotone"
          dataKey="price"
          stroke={isOverallRise ? 'hsl(0, 72%, 51%)' : 'hsl(142, 71%, 45%)'}
          strokeWidth={1.5}
          fill={isOverallRise ? 'url(#priceGradientRise)' : 'url(#priceGradientFall)'}
          dot={false}
          activeDot={{ r: 4, fill: isOverallRise ? 'hsl(0, 72%, 51%)' : 'hsl(142, 71%, 45%)' }}
        />
        
        {/* 均价线 */}
        {data[0]?.avgPrice && (
          <Area
            type="monotone"
            dataKey="avgPrice"
            stroke="hsl(45, 93%, 47%)"
            strokeWidth={1}
            strokeDasharray="3 3"
            fill="none"
            dot={false}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
