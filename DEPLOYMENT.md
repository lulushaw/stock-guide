# A股智投指南 - 部署指南

## 🚀 快速部署到 Vercel（推荐）

### 步骤 1: 准备代码

```bash
# 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit"

# 在 GitHub 创建新仓库后，连接远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

### 步骤 2: 部署到 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "Add New" → "Project"
4. 选择你的 GitHub 仓库
5. Vercel 会自动检测到这是 Vite + React 项目
6. 点击 "Deploy" 按钮
7. 等待 1-2 分钟部署完成

### 步骤 3: 获取网址

部署完成后，Vercel 会给你一个网址，格式为：
```
https://your-project-name.vercel.app
```

---

## 📦 部署到 GitHub Pages（完全免费）

### 步骤 1: 推送代码到 GitHub

```bash
# 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit"

# 在 GitHub 创建新仓库后
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

### 步骤 2: 启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 "Settings" 标签
3. 在左侧菜单找到 "Pages"
4. 在 "Build and deployment" 下：
   - Source 选择 "GitHub Actions"
5. 等待自动部署完成（约 2-3 分钟）

### 步骤 3: 获取网址

部署完成后，网址格式为：
```
https://你的用户名.github.io/仓库名
```

例如：`https://zhangsan.github.io/stock-guide`

---

## 🌐 部署到 Netlify

### 步骤 1: 推送代码到 GitHub

同上，先推送到 GitHub

### 步骤 2: 部署到 Netlify

1. 访问 [netlify.com](https://netlify.com)
2. 注册/登录账号
3. 点击 "Add new site" → "Import an existing project"
4. 连接你的 GitHub 账号
5. 选择要部署的仓库
6. 配置构建设置：
   - **Build command**: `npm run build:prod`
   - **Publish directory**: `dist`
7. 点击 "Deploy site"

### 步骤 3: 获取网址

部署完成后，网址格式为：
```
https://your-site-name.netlify.app
```

---

## 🔧 本地测试构建

在部署前，建议先在本地测试构建：

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build:prod

# 预览构建结果
npm run preview
```

构建成功后，会在 `dist` 目录生成静态文件。

---

## 📋 部署平台对比

| 平台 | 免费额度 | 速度 | 自定义域名 | 推荐度 |
|------|---------|------|-----------|--------|
| **Vercel** | 100GB/月 | ⚡⚡⚡ | ✅ | ⭐⭐⭐⭐⭐ |
| **Netlify** | 100GB/月 | ⚡⚡ | ✅ | ⭐⭐⭐⭐ |
| **GitHub Pages** | 100GB/月 | ⚡ | ✅ | ⭐⭐⭐⭐ |

---

## 🎯 推荐方案

**新手推荐**: Vercel
- 最简单，一键部署
- 全球 CDN 加速
- 自动 HTTPS
- 支持自定义域名

**完全免费**: GitHub Pages
- 完全免费
- 与 GitHub 集成
- 适合开源项目

---

## 🌍 自定义域名（可选）

### Vercel 配置自定义域名

1. 在 Vercel 项目中点击 "Settings" → "Domains"
2. 添加你的域名（如 `stock.yourdomain.com`）
3. 按照提示在域名服务商处添加 DNS 记录

### GitHub Pages 配置自定义域名

1. 在仓库 Settings → Pages 中添加自定义域名
2. 在域名服务商处添加 CNAME 记录指向 `你的用户名.github.io`

---

## 📱 部署后测试

部署完成后，访问你的网址，测试以下功能：

1. ✅ 首页加载正常
2. ✅ 用户注册/登录
3. ✅ 知识测验功能
4. ✅ 股票小百科
5. ✅ 实时股价查询（输入 "AAPL" 或 "苹果"）
6. ✅ 数据查询页面
7. ✅ 移动端适配

---

## 🔍 常见问题

### Q: 部署后 Supabase 连接失败？
A: 检查 Supabase 的 CORS 设置，确保你的域名已添加到允许列表。

### Q: 如何更新网站？
A: 只需推送新代码到 GitHub，Vercel/Netlify 会自动重新部署。

### Q: 免费额度够用吗？
A: 对于个人学习项目，100GB/月的流量完全够用。

### Q: 可以用国内服务器吗？
A: 可以，推荐阿里云、腾讯云的静态网站托管服务。

---

## 📞 需要帮助？

如果遇到问题，可以：
1. 查看 Vercel/Netlify 的部署日志
2. 检查 GitHub Actions 的运行状态
3. 确保所有依赖都已正确安装

---

## 🎉 部署成功后

恭喜！你的"A股智投指南"网站已经上线了！

记得分享给你的朋友，一起学习股票知识！
