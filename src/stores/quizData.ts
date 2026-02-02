// 股票知识问卷题库

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswers: number[]; // 支持单选和多选
  type: 'single' | 'multiple';
}

export const questionBank: Question[] = [
  {
    id: 1,
    question: 'A股市场的交易时间是？',
    options: ['9:00-15:00', '9:30-11:30 和 13:00-15:00', '9:00-12:00 和 13:00-16:00', '全天24小时'],
    correctAnswers: [1],
    type: 'single'
  },
  {
    id: 2,
    question: '在中国A股市场，股票价格上涨用什么颜色表示？',
    options: ['绿色', '红色', '蓝色', '黄色'],
    correctAnswers: [1],
    type: 'single'
  },
  {
    id: 3,
    question: '什么是市盈率(PE)？',
    options: ['股价/每股收益', '每股收益/股价', '市值/净资产', '净利润/营业收入'],
    correctAnswers: [0],
    type: 'single'
  },
  {
    id: 4,
    question: 'A股市场的涨跌幅限制是多少？',
    options: ['5%', '10%', '20%', '无限制'],
    correctAnswers: [1],
    type: 'single'
  },
  {
    id: 5,
    question: '以下哪些属于技术分析指标？',
    options: ['MACD', 'KDJ', 'ROE', 'RSI'],
    correctAnswers: [0, 1, 3],
    type: 'multiple'
  },
  {
    id: 6,
    question: '上证指数的代码是？',
    options: ['000001', '399001', '000300', '399006'],
    correctAnswers: [0],
    type: 'single'
  },
  {
    id: 7,
    question: '什么是分红派息？',
    options: ['公司向股东分配利润', '股票价格上涨', '公司发行新股', '股票回购'],
    correctAnswers: [0],
    type: 'single'
  },
  {
    id: 8,
    question: '以下哪些是股票的基本面分析内容？',
    options: ['财务报表分析', 'K线图分析', '行业分析', '公司管理层分析'],
    correctAnswers: [0, 2, 3],
    type: 'multiple'
  },
  {
    id: 9,
    question: 'T+1交易制度意味着？',
    options: ['当天买入的股票当天可卖', '当天买入的股票次日才能卖', '需要等待两天才能卖', '随时可以买卖'],
    correctAnswers: [1],
    type: 'single'
  },
  {
    id: 10,
    question: '创业板股票代码以什么开头？',
    options: ['600', '000', '300', '688'],
    correctAnswers: [2],
    type: 'single'
  },
  {
    id: 11,
    question: '科创板股票代码以什么开头？',
    options: ['600', '000', '300', '688'],
    correctAnswers: [3],
    type: 'single'
  },
  {
    id: 12,
    question: '什么是蓝筹股？',
    options: ['新上市的小公司股票', '业绩稳定、市值大的优质股票', '股价很低的股票', '亏损的公司股票'],
    correctAnswers: [1],
    type: 'single'
  },
  {
    id: 13,
    question: '以下哪些是影响股价的因素？',
    options: ['公司业绩', '宏观经济政策', '市场情绪', '行业发展趋势'],
    correctAnswers: [0, 1, 2, 3],
    type: 'multiple'
  },
  {
    id: 14,
    question: '什么是换手率？',
    options: ['股票成交量占流通股本的比例', '股价涨跌幅度', '持股时间', '分红比例'],
    correctAnswers: [0],
    type: 'single'
  },
  {
    id: 15,
    question: '牛市是指？',
    options: ['股市整体下跌', '股市整体上涨', '股市横盘震荡', '股市关闭'],
    correctAnswers: [1],
    type: 'single'
  },
  {
    id: 16,
    question: '以下哪些属于A股主要指数？',
    options: ['上证指数', '深证成指', '纳斯达克指数', '沪深300'],
    correctAnswers: [0, 1, 3],
    type: 'multiple'
  },
  {
    id: 17,
    question: '股票停牌是什么意思？',
    options: ['股票可以正常交易', '股票暂时不能交易', '股票退市', '股票涨停'],
    correctAnswers: [1],
    type: 'single'
  },
  {
    id: 18,
    question: '什么是净资产收益率(ROE)？',
    options: ['净利润/总资产', '净利润/净资产', '营业收入/总资产', '股价/每股收益'],
    correctAnswers: [1],
    type: 'single'
  },
  {
    id: 19,
    question: '以下哪些是分散投资风险的方法？',
    options: ['投资多只不同行业股票', '只投资一只股票', '配置不同类型资产', '分批建仓'],
    correctAnswers: [0, 2, 3],
    type: 'multiple'
  },
  {
    id: 20,
    question: '什么是市净率(PB)？',
    options: ['股价/每股收益', '股价/每股净资产', '市值/净利润', '净资产/总资产'],
    correctAnswers: [1],
    type: 'single'
  }
];

// 随机抽取10道题
export const getRandomQuestions = (count: number = 10): Question[] => {
  const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// 计算得分
export const calculateScore = (
  questions: Question[],
  answers: Record<number, number[]>
): number => {
  let score = 0;
  questions.forEach(q => {
    const userAnswers = answers[q.id] || [];
    const isCorrect =
      userAnswers.length === q.correctAnswers.length &&
      userAnswers.every(a => q.correctAnswers.includes(a));
    if (isCorrect) score += 1;
  });
  return score;
};

// 根据得分给出评价
export const getScoreEvaluation = (score: number, total: number = 10): string => {
  const percentage = (score / total) * 100;
  
  if (percentage === 100) {
    return '太棒了！满分！你对股票知识掌握得非常全面，是一位优秀的投资者！';
  } else if (percentage >= 80) {
    return '非常优秀！你的股票知识储备很丰富，继续保持学习的热情！';
  } else if (percentage >= 60) {
    return '恭喜及格！你已经具备了基本的股票知识，建议继续学习提升自己。';
  } else if (percentage >= 40) {
    return '还需努力！建议多阅读股票小百科，加强基础知识的学习。';
  } else {
    return '加油！股票投资需要扎实的知识基础，建议从基础开始系统学习。';
  }
};
