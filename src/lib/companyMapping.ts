export interface CompanyMapping {
  code: string;
  name: string;
  nameEn: string;
  pinyin: string;
}

export const companyMappings: CompanyMapping[] = [
  // 美股科技股
  { code: 'AAPL', name: '苹果', nameEn: 'Apple', pinyin: 'pingguo' },
  { code: 'MSFT', name: '微软', nameEn: 'Microsoft', pinyin: 'weiruan' },
  { code: 'GOOGL', name: '谷歌', nameEn: 'Google', pinyin: 'guge' },
  { code: 'GOOG', name: '谷歌A', nameEn: 'Google A', pinyin: 'gugea' },
  { code: 'AMZN', name: '亚马逊', nameEn: 'Amazon', pinyin: 'yamaxun' },
  { code: 'META', name: 'Meta', nameEn: 'Meta', pinyin: 'meta' },
  { code: 'TSLA', name: '特斯拉', nameEn: 'Tesla', pinyin: 'tesila' },
  { code: 'NVDA', name: '英伟达', nameEn: 'NVIDIA', pinyin: 'yingweida' },
  { code: 'AMD', name: 'AMD', nameEn: 'AMD', pinyin: 'amd' },
  { code: 'INTC', name: '英特尔', nameEn: 'Intel', pinyin: 'yingteer' },
  { code: 'NFLX', name: '奈飞', nameEn: 'Netflix', pinyin: 'naifei' },
  { code: 'DIS', name: '迪士尼', nameEn: 'Disney', pinyin: 'dishini' },
  { code: 'PYPL', name: 'PayPal', nameEn: 'PayPal', pinyin: 'paypal' },
  { code: 'ADBE', name: 'Adobe', nameEn: 'Adobe', pinyin: 'adobe' },
  { code: 'CRM', name: 'Salesforce', nameEn: 'Salesforce', pinyin: 'salesforce' },
  { code: 'ORCL', name: '甲骨文', nameEn: 'Oracle', pinyin: 'jiaguwen' },
  { code: 'IBM', name: 'IBM', nameEn: 'IBM', pinyin: 'ibm' },
  { code: 'CSCO', name: '思科', nameEn: 'Cisco', pinyin: 'sike' },
  
  // 美股金融股
  { code: 'JPM', name: '摩根大通', nameEn: 'JPMorgan', pinyin: 'mogendatong' },
  { code: 'BAC', name: '美国银行', nameEn: 'Bank of America', pinyin: 'meiguoyinhang' },
  { code: 'WFC', name: '富国银行', nameEn: 'Wells Fargo', pinyin: 'fuguoyinhang' },
  { code: 'GS', name: '高盛', nameEn: 'Goldman Sachs', pinyin: 'gaosheng' },
  { code: 'MS', name: '摩根士丹利', nameEn: 'Morgan Stanley', pinyin: 'mogenshidanli' },
  { code: 'C', name: '花旗', nameEn: 'Citigroup', pinyin: 'huachi' },
  { code: 'BLK', name: '贝莱德', nameEn: 'BlackRock', pinyin: 'beilaide' },
  { code: 'V', name: 'Visa', nameEn: 'Visa', pinyin: 'visa' },
  { code: 'MA', name: '万事达', nameEn: 'Mastercard', pinyin: 'wanshida' },
  
  // 美股消费股
  { code: 'KO', name: '可口可乐', nameEn: 'Coca-Cola', pinyin: 'kekoukele' },
  { code: 'PEP', name: '百事可乐', nameEn: 'PepsiCo', pinyin: 'baishikele' },
  { code: 'MCD', name: '麦当劳', nameEn: 'McDonalds', pinyin: 'maidanglao' },
  { code: 'SBUX', name: '星巴克', nameEn: 'Starbucks', pinyin: 'xingbake' },
  { code: 'NKE', name: '耐克', nameEn: 'Nike', pinyin: 'naike' },
  { code: 'LVMUY', name: 'LV', nameEn: 'LVMH', pinyin: 'lv' },
  
  // 美股能源股
  { code: 'XOM', name: '埃克森美孚', nameEn: 'Exxon Mobil', pinyin: 'aikesenmeifu' },
  { code: 'CVX', name: '雪佛龙', nameEn: 'Chevron', pinyin: 'xuefulong' },
  { code: 'COP', name: '康菲石油', nameEn: 'ConocoPhillips', pinyin: 'kangfeishiyou' },
  
  // 美股医疗股
  { code: 'JNJ', name: '强生', nameEn: 'Johnson & Johnson', pinyin: 'qiangsheng' },
  { code: 'PFE', name: '辉瑞', nameEn: 'Pfizer', pinyin: 'huirui' },
  { code: 'UNH', name: '联合健康', nameEn: 'UnitedHealth', pinyin: 'lianhejiankang' },
  { code: 'ABBV', name: '艾伯维', nameEn: 'AbbVie', pinyin: 'aibowei' },
  { code: 'MRK', name: '默克', nameEn: 'Merck', pinyin: 'moke' },
  { code: 'TMO', name: '赛默飞', nameEn: 'Thermo Fisher', pinyin: 'saifeifei' },
  
  // 美股工业股
  { code: 'CAT', name: '卡特彼勒', nameEn: 'Caterpillar', pinyin: 'katebila' },
  { code: 'BA', name: '波音', nameEn: 'Boeing', pinyin: 'boying' },
  { code: 'GE', name: '通用电气', nameEn: 'General Electric', pinyin: 'tongyongdianqi' },
  { code: 'HON', name: '霍尼韦尔', nameEn: 'Honeywell', pinyin: 'huoniweier' },
  { code: 'MMM', name: '3M', nameEn: '3M', pinyin: '3m' },
  
  // 中概股
  { code: 'BABA', name: '阿里巴巴', nameEn: 'Alibaba', pinyin: 'alibaba' },
  { code: 'JD', name: '京东', nameEn: 'JD.com', pinyin: 'jingdong' },
  { code: 'PDD', name: '拼多多', nameEn: 'PDD Holdings', pinyin: 'pinduoduo' },
  { code: 'BIDU', name: '百度', nameEn: 'Baidu', pinyin: 'baidu' },
  { code: 'NTES', name: '网易', nameEn: 'NetEase', pinyin: 'wangyi' },
  { code: 'TME', name: '腾讯音乐', nameEn: 'Tencent Music', pinyin: 'tengxunyinyue' },
  { code: 'NIO', name: '蔚来', nameEn: 'NIO', pinyin: 'weilai' },
  { code: 'XPEV', name: '小鹏', nameEn: 'XPeng', pinyin: 'xiaopeng' },
  { code: 'LI', name: '理想', nameEn: 'Li Auto', pinyin: 'lixiang' },
  { code: 'DIDI', name: '滴滴', nameEn: 'DiDi', pinyin: 'didi' },
  { code: 'BILI', name: '哔哩哔哩', nameEn: 'Bilibili', pinyin: 'bilibili' },
  { code: 'IQ', name: '爱奇艺', nameEn: 'iQIYI', pinyin: 'aiqiyi' },
  { code: 'VIPS', name: '唯品会', nameEn: 'Vipshop', pinyin: 'weipinhui' },
  { code: 'ZTO', name: '中通快递', nameEn: 'ZTO Express', pinyin: 'zhongtongkuaidi' },
  
  // 港股
  { code: '0700.HK', name: '腾讯', nameEn: 'Tencent', pinyin: 'tengxun' },
  { code: '9988.HK', name: '阿里巴巴', nameEn: 'Alibaba', pinyin: 'alibaba' },
  { code: '0941.HK', name: '中国移动', nameEn: 'China Mobile', pinyin: 'zhongguoyidong' },
  { code: '0960.HK', name: '龙源电力', nameEn: 'Longyuan', pinyin: 'longyuandianli' },
  { code: '2318.HK', name: '中国平安', nameEn: 'Ping An', pinyin: 'zhongguopingan' },
  { code: '1299.HK', name: '友邦保险', nameEn: 'AIA', pinyin: 'youbangbaoxian' },
  { code: '1398.HK', name: '工商银行', nameEn: 'ICBC', pinyin: 'gongshangyinhang' },
  { code: '3988.HK', name: '中国银行', nameEn: 'Bank of China', pinyin: 'zhongguoyinhang' },
  { code: '1288.HK', name: '农业银行', nameEn: 'Agricultural Bank', pinyin: 'nongyeyinhang' },
  { code: '0939.HK', name: '建设银行', nameEn: 'CCB', pinyin: 'jiansheyinhang' },
  { code: '2018.HK', name: 'AAC', nameEn: 'AAC', pinyin: 'aac' },
  { code: '2020.HK', name: '安踏体育', nameEn: 'ANTA', pinyin: 'anta' },
  { code: '0241.HK', name: '阿里健康', nameEn: 'Ali Health', pinyin: 'alijiankang' },
  { code: '02269.HK', name: '药明生物', nameEn: 'WuXi Biologics', pinyin: 'yaomingshengwu' },
  { code: '02313.HK', name: '申洲国际', nameEn: 'Shenzhou', pinyin: 'shenzhouguoji' },
  { code: '06699.HK', name: '时代天使', nameEn: 'Angelalign', pinyin: 'shidaitianshi' },
  { code: '01024.HK', name: '快手', nameEn: 'Kuaishou', pinyin: 'kuaishou' },
  { code: '09618.HK', name: '京东集团', nameEn: 'JD Group', pinyin: 'jingdongjituan' },
  { code: '09988.HK', name: '阿里巴巴', nameEn: 'Alibaba', pinyin: 'alibaba' },
  { code: '01024.HK', name: '快手', nameEn: 'Kuaishou', pinyin: 'kuaishou' },
  { code: '09633.HK', name: '农夫山泉', nameEn: 'Nongfu Spring', pinyin: 'nongfushanquan' },
  { code: '06618.HK', name: '京东健康', nameEn: 'JD Health', pinyin: 'jingdongjiankang' },
  { code: '06030.HK', name: '中信证券', nameEn: 'CITIC', pinyin: 'zhongxinzhengquan' },
  { code: '06886.HK', name: '华泰证券', nameEn: 'Huatai', pinyin: 'huataizhengquan' },
  { code: '01767.HK', name: '中金公司', nameEn: 'CICC', pinyin: 'zhongjingongsi' },
  { code: '02382.HK', name: '舜宇光学', nameEn: 'Sunny Optical', pinyin: 'shunyuguangxue' },
  { code: '02382.HK', name: '舜宇光学', nameEn: 'Sunny Optical', pinyin: 'shunyuguangxue' },
  { code: '02020.HK', name: '安踏体育', nameEn: 'ANTA', pinyin: 'anta' },
  { code: '01138.HK', name: '中远海控', nameEn: 'COSCO', pinyin: 'zhongyuanhaikong' },
  { code: '02628.HK', name: '中国人寿', nameEn: 'China Life', pinyin: 'zhongguorenshou' },
  { code: '02601.HK', name: '中国太保', nameEn: 'CPIC', pinyin: 'zhongguotaibao' },
  { code: '02318.HK', name: '中国平安', nameEn: 'Ping An', pinyin: 'zhongguopingan' },
  { code: '01299.HK', name: '友邦保险', nameEn: 'AIA', pinyin: 'youbangbaoxian' },
  { code: '01766.HK', name: '中国中车', nameEn: 'CRRC', pinyin: 'zhongguozhongche' },
  { code: '01093.HK', name: '石药集团', nameEn: 'CSPC', pinyin: 'shiyaojituan' },
  { code: '01088.HK', name: '中国神华', nameEn: 'China Shenhua', pinyin: 'zhongguoshenhua' },
  { code: '01065.HK', name: '天津创业环保', nameEn: 'Tianjin Capital', pinyin: 'tianjinchuangye' },
  { code: '01157.HK', name: '中联重科', nameEn: 'Zoomlion', pinyin: 'zhonglianzhongke' },
  { code: '00941.HK', name: '中国移动', nameEn: 'China Mobile', pinyin: 'zhongguoyidong' },
  { code: '00762.HK', name: '中国联通', nameEn: 'China Unicom', pinyin: 'zhongguoliantong' },
  { code: '00728.HK', name: '中国电信', nameEn: 'China Telecom', pinyin: 'zhongguodianxin' },
  { code: '00386.HK', name: '中国石化', nameEn: 'Sinopec', pinyin: 'zhongguoshihua' },
  { code: '00388.HK', name: '港交所', nameEn: 'HKEX', pinyin: 'gangjiaosuo' },
  { code: '00005.HK', name: '汇丰控股', nameEn: 'HSBC', pinyin: 'huifengkonggu' },
  { code: '00011.HK', name: '恒生银行', nameEn: 'Hang Seng Bank', pinyin: 'hengshengyinhang' },
  { code: '00083.HK', name: '信和置业', nameEn: 'Sino Land', pinyin: 'xinhezhiye' },
  { code: '00101.HK', name: '恒隆地产', nameEn: 'Hang Lung', pinyin: 'henglongdichan' },
  { code: '00175.HK', name: '吉利汽车', nameEn: 'Geely', pinyin: 'jiliqiche' },
  { code: '02333.HK', name: '长城汽车', nameEn: 'Great Wall', pinyin: 'changchengqiche' },
  { code: '02202.HK', name: '万科企业', nameEn: 'Vanke', pinyin: 'wankeqiye' },
  { code: '00823.HK', name: '领展房产基金', nameEn: 'Link REIT', pinyin: 'lingzhanfangchan' },
  { code: '00388.HK', name: '港交所', nameEn: 'HKEX', pinyin: 'gangjiaosuo' },
  { code: '01997.HK', name: '山东黄金', nameEn: 'Shandong Gold', pinyin: 'shandonghuangjin' },
  { code: '02899.HK', name: '紫金矿业', nameEn: 'Zijin Mining', pinyin: 'zijinkuangye' },
  { code: '02007.HK', name: '碧桂园', nameEn: 'Country Garden', pinyin: 'biguiyuan' },
  { code: '00381.HK', name: '中远海能', nameEn: 'COSC', pinyin: 'zhongyuanhaineng' },
  { code: '00669.HK', name: '技术发展', nameEn: 'Techtronic', pinyin: 'jishufazhan' },
  { code: '00688.HK', name: '中国海外发展', nameEn: 'China Overseas', pinyin: 'zhongguohaiwai' },
  { code: '01109.HK', name: '华润置地', nameEn: 'CR Land', pinyin: 'huaranzhidi' },
  { code: '01101.HK', name: '华润啤酒', nameEn: 'China Resources Beer', pinyin: 'huaranpijiu' },
  { code: '00291.HK', name: '华润啤酒', nameEn: 'China Resources Beer', pinyin: 'huaranpijiu' },
  { code: '00322.HK', name: '康师傅', nameEn: 'Master Kong', pinyin: 'kangshifu' },
  { code: '00522.HK', name: 'ASM Pacific', nameEn: 'ASMPT', pinyin: 'asmpacific' },
  { code: '01810.HK', name: '小米集团', nameEn: 'Xiaomi', pinyin: 'xiaomi' },
  { code: '00700.HK', name: '腾讯控股', nameEn: 'Tencent', pinyin: 'tengxunkonggu' },
  { code: '03690.HK', name: '美团', nameEn: 'Meituan', pinyin: 'meituan' },
  { code: '09961.HK', name: '携程', nameEn: 'Trip.com', pinyin: 'xiecheng' },
  { code: '09888.HK', name: '阿里巴巴', nameEn: 'Alibaba', pinyin: 'alibaba' },
  { code: '09618.HK', name: '京东集团', nameEn: 'JD.com', pinyin: 'jingdongjituan' },
  { code: '01024.HK', name: '快手', nameEn: 'Kuaishou', pinyin: 'kuaishou' },
  { code: '09633.HK', name: '农夫山泉', nameEn: 'Nongfu Spring', pinyin: 'nongfushanquan' },
  { code: '06618.HK', name: '京东健康', nameEn: 'JD Health', pinyin: 'jingdongjiankang' },
  { code: '02020.HK', name: '安踏体育', nameEn: 'ANTA', pinyin: 'anta' },
  { code: '01767.HK', name: '中国中车', nameEn: 'CRRC', pinyin: 'zhongguozhongche' },
  { code: '02313.HK', name: '申洲国际', nameEn: 'Shenzhou', pinyin: 'shenzhouguoji' },
  { code: '02382.HK', name: '舜宇光学', nameEn: 'Sunny Optical', pinyin: 'shunyuguangxue' },
  { code: '02269.HK', name: '药明生物', nameEn: 'WuXi Biologics', pinyin: 'yaomingshengwu' },
  { code: '06030.HK', name: '中信证券', nameEn: 'CITIC', pinyin: 'zhongxinzhengquan' },
  { code: '06886.HK', name: '华泰证券', nameEn: 'Huatai', pinyin: 'huataizhengquan' },
  { code: '01766.HK', name: '中国中车', nameEn: 'CRRC', pinyin: 'zhongguozhongche' },
  { code: '01093.HK', name: '石药集团', nameEn: 'CSPC', pinyin: 'shiyaojituan' },
  { code: '01088.HK', name: '中国神华', nameEn: 'China Shenhua', pinyin: 'zhongguoshenhua' },
  { code: '01157.HK', name: '中联重科', nameEn: 'Zoomlion', pinyin: 'zhonglianzhongke' },
  { code: '00941.HK', name: '中国移动', nameEn: 'China Mobile', pinyin: 'zhongguoyidong' },
  { code: '00762.HK', name: '中国联通', nameEn: 'China Unicom', pinyin: 'zhongguoliantong' },
  { code: '00728.HK', name: '中国电信', nameEn: 'China Telecom', pinyin: 'zhongguodianxin' },
  { code: '00386.HK', name: '中国石化', nameEn: 'Sinopec', pinyin: 'zhongguoshihua' },
  { code: '00388.HK', name: '港交所', nameEn: 'HKEX', pinyin: 'gangjiaosuo' },
  { code: '00005.HK', name: '汇丰控股', nameEn: 'HSBC', pinyin: 'huifengkonggu' },
  { code: '00011.HK', name: '恒生银行', nameEn: 'Hang Seng Bank', pinyin: 'hengshengyinhang' },
  { code: '00175.HK', name: '吉利汽车', nameEn: 'Geely', pinyin: 'jiliqiche' },
  { code: '02333.HK', name: '长城汽车', nameEn: 'Great Wall', pinyin: 'changchengqiche' },
  { code: '02202.HK', name: '万科企业', nameEn: 'Vanke', pinyin: 'wankeqiye' },
  { code: '00823.HK', name: '领展房产基金', nameEn: 'Link REIT', pinyin: 'lingzhanfangchan' },
  { code: '01997.HK', name: '山东黄金', nameEn: 'Shandong Gold', pinyin: 'shandonghuangjin' },
  { code: '02899.HK', name: '紫金矿业', nameEn: 'Zijin Mining', pinyin: 'zijinkuangye' },
  { code: '02007.HK', name: '碧桂园', nameEn: 'Country Garden', pinyin: 'biguiyuan' },
  { code: '00381.HK', name: '中远海能', nameEn: 'COSC', pinyin: 'zhongyuanhaineng' },
  { code: '00688.HK', name: '中国海外发展', nameEn: 'China Overseas', pinyin: 'zhongguohaiwai' },
  { code: '01109.HK', name: '华润置地', nameEn: 'CR Land', pinyin: 'huaranzhidi' },
  { code: '01101.HK', name: '华润啤酒', nameEn: 'China Resources Beer', pinyin: 'huaranpijiu' },
  { code: '00322.HK', name: '康师傅', nameEn: 'Master Kong', pinyin: 'kangshifu' },
  { code: '00522.HK', name: 'ASM Pacific', nameEn: 'ASMPT', pinyin: 'asmpacific' },
  { code: '01810.HK', name: '小米集团', nameEn: 'Xiaomi', pinyin: 'xiaomi' },
  { code: '03690.HK', name: '美团', nameEn: 'Meituan', pinyin: 'meituan' },
  { code: '09961.HK', name: '携程', nameEn: 'Trip.com', pinyin: 'xiecheng' },
];

export const searchCompanyByInput = (input: string): string | null => {
  const trimmedInput = input.trim().toUpperCase();
  
  // 先检查是否是股票代码
  const exactCodeMatch = companyMappings.find(m => m.code.toUpperCase() === trimmedInput);
  if (exactCodeMatch) {
    return exactCodeMatch.code;
  }
  
  // 检查中文名称
  const nameMatch = companyMappings.find(m => m.name === input);
  if (nameMatch) {
    return nameMatch.code;
  }
  
  // 检查英文名称
  const nameEnMatch = companyMappings.find(m => m.nameEn.toLowerCase() === input.toLowerCase());
  if (nameEnMatch) {
    return nameEnMatch.code;
  }
  
  // 检查拼音
  const pinyinMatch = companyMappings.find(m => m.pinyin === input.toLowerCase());
  if (pinyinMatch) {
    return pinyinMatch.code;
  }
  
  // 模糊搜索（中文名称包含）
  const fuzzyNameMatch = companyMappings.find(m => m.name.includes(input));
  if (fuzzyNameMatch) {
    return fuzzyNameMatch.code;
  }
  
  // 模糊搜索（英文名称包含）
  const fuzzyNameEnMatch = companyMappings.find(m => m.nameEn.toLowerCase().includes(input.toLowerCase()));
  if (fuzzyNameEnMatch) {
    return fuzzyNameEnMatch.code;
  }
  
  // 模糊搜索（拼音包含）
  const fuzzyPinyinMatch = companyMappings.find(m => m.pinyin.includes(input.toLowerCase()));
  if (fuzzyPinyinMatch) {
    return fuzzyPinyinMatch.code;
  }
  
  // 如果没有匹配，返回原输入（可能是用户直接输入的股票代码）
  return trimmedInput;
};

export const getCompanyInfo = (code: string): CompanyMapping | undefined => {
  return companyMappings.find(m => m.code.toUpperCase() === code.toUpperCase());
};

export const searchCompanies = (input: string): CompanyMapping[] => {
  const trimmedInput = input.trim().toLowerCase();
  if (!trimmedInput) return [];
  
  return companyMappings.filter(m => 
    m.code.toLowerCase().includes(trimmedInput) ||
    m.name.includes(input) ||
    m.nameEn.toLowerCase().includes(trimmedInput) ||
    m.pinyin.includes(trimmedInput)
  ).slice(0, 10);
};