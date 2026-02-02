import { useState, useMemo, useCallback } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Brush
} from 'recharts';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface KlineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface KlineChartProps {
  data: KlineData[];
  height?: number;
}

// 自定义K线蜡烛图
const CandlestickBar = (props: {
  x: number;
  y: number;
  width: number;
  height: number;
  payload: KlineData;
}) => {
  const { x, width, payload } = props;
  if (!payload) return null;
  
  const { open, high, low, close } = payload;
  const isRise = close >= open;
  const color = isRise ? 'hsl(0, 72%, 51%)' : 'hsl(142, 71%, 45%)';
  
  // 计算Y轴位置的比例
  const yScale = (value: number, min: number, max: number, chartHeight: number, marginTop: number) => {
    return marginTop + chartHeight - ((value - min) / (max - min)) * chartHeight;
  };
  
  // 使用固定的图表区域
  const chartHeight = 200;
  const marginTop = 20;
  const allPrices = [open, high, low, close];
  const minPrice = Math.min(...allPrices) * 0.998;
  const maxPrice = Math.max(...allPrices) * 1.002;
  
  const candleTop = yScale(Math.max(open, close), minPrice, maxPrice, chartHeight, marginTop);
  const candleBottom = yScale(Math.min(open, close), minPrice, maxPrice, chartHeight, marginTop);
  const wickTop = yScale(high, minPrice, maxPrice, chartHeight, marginTop);
  const wickBottom = yScale(low, minPrice, maxPrice, chartHeight, marginTop);
  
  const candleHeight = Math.max(candleBottom - candleTop, 1);
  const candleWidth = Math.max(width * 0.8, 2);
  const candleX = x + (width - candleWidth) / 2;
  const wickX = x + width / 2;
  
  return (
    <g>
      {/* 上下影线 */}
      <line
        x1={wickX}
        y1={wickTop}
        x2={wickX}
        y2={wickBottom}
        stroke={color}
        strokeWidth={1}
      />
      {/* 蜡烛实体 */}
      <rect
        x={candleX}
        y={candleTop}
        width={candleWidth}
        height={candleHeight}
        fill={isRise ? color : color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

// 自定义Tooltip
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: KlineData }> }) => {
  if (!active || !payload || !payload[0]) return null;
  
  const data = payload[0].payload;
  const isRise = data.close >= data.open;
  
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
      <div className="font-medium mb-2">{data.time}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="text-muted-foreground">开盘:</span>
        <span className="text-right">{data.open.toFixed(2)}</span>
        <span className="text-muted-foreground">最高:</span>
        <span className="text-right text-stock-rise">{data.high.toFixed(2)}</span>
        <span className="text-muted-foreground">最低:</span>
        <span className="text-right text-stock-fall">{data.low.toFixed(2)}</span>
        <span className="text-muted-foreground">收盘:</span>
        <span className={`text-right font-medium ${isRise ? 'text-stock-rise' : 'text-stock-fall'}`}>
          {data.close.toFixed(2)}
        </span>
        <span className="text-muted-foreground">成交量:</span>
        <span className="text-right">{(data.volume / 10000).toFixed(0)}万</span>
      </div>
    </div>
  );
};

export function KlineChart({ data, height = 350 }: KlineChartProps) {
  const [brushRange, setBrushRange] = useState<{ startIndex: number; endIndex: number }>({
    startIndex: Math.max(0, data.length - 30),
    endIndex: data.length - 1
  });

  const visibleData = useMemo(() => {
    return data.slice(brushRange.startIndex, brushRange.endIndex + 1);
  }, [data, brushRange]);

  const { minPrice, maxPrice } = useMemo(() => {
    if (visibleData.length === 0) return { minPrice: 0, maxPrice: 0 };
    const lows = visibleData.map(d => d.low);
    const highs = visibleData.map(d => d.high);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const padding = (max - min) * 0.1;
    return { minPrice: min - padding, maxPrice: max + padding };
  }, [visibleData]);

  const handleBrushChange = useCallback((range: { startIndex?: number; endIndex?: number }) => {
    if (range.startIndex !== undefined && range.endIndex !== undefined) {
      setBrushRange({ startIndex: range.startIndex, endIndex: range.endIndex });
    }
  }, []);

  const zoomIn = () => {
    const currentRange = brushRange.endIndex - brushRange.startIndex;
    const newRange = Math.max(10, Math.floor(currentRange * 0.7));
    const center = Math.floor((brushRange.startIndex + brushRange.endIndex) / 2);
    const newStart = Math.max(0, center - Math.floor(newRange / 2));
    const newEnd = Math.min(data.length - 1, newStart + newRange);
    setBrushRange({ startIndex: newStart, endIndex: newEnd });
  };

  const zoomOut = () => {
    const currentRange = brushRange.endIndex - brushRange.startIndex;
    const newRange = Math.min(data.length - 1, Math.floor(currentRange * 1.5));
    const center = Math.floor((brushRange.startIndex + brushRange.endIndex) / 2);
    const newStart = Math.max(0, center - Math.floor(newRange / 2));
    const newEnd = Math.min(data.length - 1, newStart + newRange);
    setBrushRange({ startIndex: newStart, endIndex: newEnd });
  };

  const resetZoom = () => {
    setBrushRange({
      startIndex: Math.max(0, data.length - 30),
      endIndex: data.length - 1
    });
  };

  return (
    <div>
      {/* 控制按钮 */}
      <div className="flex gap-2 mb-3 justify-end">
        <Button variant="outline" size="sm" onClick={zoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={zoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={resetZoom}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
            tickFormatter={(value) => value.slice(5)}
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
            width={60}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* K线图 - 使用Bar组件自定义形状 */}
          <Bar
            dataKey="high"
            shape={(props: {
              x?: number;
              y?: number;
              width?: number;
              height?: number;
              payload?: KlineData;
            }) => (
              <CandlestickBar
                x={props.x ?? 0}
                y={props.y ?? 0}
                width={props.width ?? 0}
                height={props.height ?? 0}
                payload={props.payload ?? { time: '', open: 0, high: 0, low: 0, close: 0, volume: 0 }}
              />
            )}
          />
          
          {/* 可拖动的时间范围选择器 */}
          <Brush
            dataKey="time"
            height={30}
            stroke="hsl(var(--primary))"
            fill="hsl(var(--muted))"
            startIndex={brushRange.startIndex}
            endIndex={brushRange.endIndex}
            onChange={handleBrushChange}
            tickFormatter={(value) => value.slice(5)}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
