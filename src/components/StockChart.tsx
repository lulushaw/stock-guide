import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface PricePoint {
  time: string;
  price: number;
}

interface StockChartProps {
  data: PricePoint[];
  isPositive?: boolean;
  height?: number;
  showGrid?: boolean;
  showAxis?: boolean;
}

export function StockChart({ 
  data, 
  isPositive = true, 
  height = 200,
  showGrid = true,
  showAxis = true 
}: StockChartProps) {
  const chartColor = isPositive ? 'hsl(0, 72%, 51%)' : 'hsl(142, 71%, 45%)';
  
  const formattedData = useMemo(() => {
    return data.map(d => ({
      ...d,
      time: d.time.slice(5) // 只显示月-日
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={formattedData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id={`gradient-${isPositive}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
        {showAxis && (
          <>
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
              domain={['auto', 'auto']}
              width={60}
            />
          </>
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px'
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Area
          type="monotone"
          dataKey="price"
          stroke={chartColor}
          strokeWidth={2}
          fill={`url(#gradient-${isPositive})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// 简化版迷你图表
export function MiniChart({ 
  data, 
  isPositive = true,
  width = 100,
  height = 40 
}: { 
  data: PricePoint[]; 
  isPositive?: boolean;
  width?: number;
  height?: number;
}) {
  const chartColor = isPositive ? 'hsl(0, 72%, 51%)' : 'hsl(142, 71%, 45%)';
  
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data.slice(-7)}>
        <Line
          type="monotone"
          dataKey="price"
          stroke={chartColor}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
