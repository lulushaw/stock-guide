// Google Analytics 4 事件追踪工具

declare global {
  interface Window {
    gtag: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}

// 通用事件追踪函数
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

// 预定义的关键事件
export const analytics = {
  // 用户注册成功
  trackRegister: (phone: string) => {
    trackEvent('sign_up', {
      method: 'phone',
      user_phone: phone.slice(0, 3) + '****' + phone.slice(-4), // 脱敏处理
    });
  },

  // 用户登录成功
  trackLogin: (phone: string) => {
    trackEvent('login', {
      method: 'phone',
      user_phone: phone.slice(0, 3) + '****' + phone.slice(-4),
    });
  },

  // 数据查询
  trackDataQuery: (queryType: string, keyword: string) => {
    trackEvent('search', {
      search_term: keyword,
      query_type: queryType, // 'stock' | 'fund' | 'index'
    });
  },

  // 查看股票详情
  trackViewStock: (stockCode: string, stockName: string) => {
    trackEvent('view_item', {
      item_id: stockCode,
      item_name: stockName,
      item_category: 'stock',
    });
  },

  // 完成问卷测验
  trackQuizComplete: (score: number, total: number) => {
    trackEvent('quiz_complete', {
      score,
      total,
      passed: score >= 6,
    });
  },
};
