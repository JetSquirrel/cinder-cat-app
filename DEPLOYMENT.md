# 🚀 Cinder 部署指南

## 部署到 Vercel

### 前提条件
1. GitHub 账号
2. Vercel 账号（可以用 GitHub 登录）

### 步骤一：上传到 GitHub 私有仓库

1. **初始化 Git 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Cinder cat dating app"
   ```

2. **在 GitHub 创建私有仓库**
   - 访问 https://github.com/new
   - 仓库名称：`cinder-cat-app`
   - 选择 **Private** （私有）
   - 不要初始化 README、.gitignore 或 license（因为我们已经有了）

3. **连接到远程仓库**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/cinder-cat-app.git
   git branch -M main
   git push -u origin main
   ```

### 步骤二：部署到 Vercel

1. **连接 Vercel 到 GitHub**
   - 访问 https://vercel.com
   - 用 GitHub 账号登录
   - 点击 "New Project"

2. **导入项目**
   - 选择你的 `cinder-cat-app` 仓库
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: Vite 会自动检测
   - **Root Directory**: `./` (默认)
   - **Build Command**: `npm run build` (自动检测)
   - **Output Directory**: `dist` (自动检测)
   - **Install Command**: `npm install` (自动检测)

4. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常 1-3 分钟）

### 步骤三：配置自定义域名（可选）

1. 在 Vercel 项目页面点击 "Settings"
2. 选择 "Domains"
3. 添加你的自定义域名

## 🔧 项目配置文件

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

### 环境变量（如果需要）
在 Vercel 项目设置中的 "Environment Variables" 部分添加：
- `NODE_ENV=production`

## 📁 项目结构
```
cinder/
├── public/
│   └── images/          # 猫咪照片
│       ├── guokui/
│       └── mimi/
├── src/
│   ├── components/
│   ├── data/
│   └── ...
├── .gitignore
├── vercel.json
├── package.json
└── README.md
```

## 🎯 部署后的功能

✅ **完全静态部署**: 所有图片和代码都会部署到 CDN
✅ **自动 HTTPS**: Vercel 自动提供 SSL 证书  
✅ **全球 CDN**: 快速的全球访问速度
✅ **自动部署**: 每次 push 到 main 分支都会自动重新部署

## 🔄 更新应用

1. 修改代码
2. 提交到 GitHub:
   ```bash
   git add .
   git commit -m "Update: your changes"
   git push
   ```
3. Vercel 会自动重新部署

## 🌐 访问链接

部署成功后，你会获得：
- **Vercel 默认域名**: `https://cinder-cat-app.vercel.app`
- **自定义域名**: 你配置的域名（如果有）

---

🎉 **部署完成后，全世界都可以访问你的 Cinder 猫咪应用了！**
