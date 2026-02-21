# 项目: demowall

## 📋 基本信息
- **项目类型**: Website
- **技术栈**: HTML5, CSS3, Vanilla JavaScript
- **开始日期**: 2026-02-14
- **目标完成**: 2026-02-14
- **当前状态**: ✅ 已完成

## 🎯 项目目标

设计作品集展示网站，支持搜索、筛选和详情页功能，采用赛博朋克科技风格设计。

## 🏗️ 项目架构

```
demowall/
├── index.html              # 主页（作品网格展示）
├── detail.html             # 详情页
├── css/
│   ├── main.css            # 全局样式
│   ├── detail.css          # 详情页样式
│   └── background-effects.css  # 动态背景效果
├── js/
│   ├── app.js              # 主逻辑
│   ├── detail.js           # 详情页逻辑
│   └── background-effects.js   # 背景动画控制器
├── data/
│   └── projects.json       # 作品数据
├── images/                 # 图片资源
│   ├── thumbnails/
│   └── full/
└── .claude/
    ├── PROJECT.md          # 项目概览
    ├── PROGRESS.md         # 进度追踪
    ├── BUGS.md             # Bug 记录（重要！）
    ├── DECISIONS.md        # 技术决策
    └── SESSIONS.md         # 工作会话
```

## 📁 关键文件

- **入口文件**: `index.html`
- **样式文件**: `css/main.css`, `css/detail.css`, `css/background-effects.css`
- **脚本文件**: `js/app.js`, `js/detail.js`, `js/background-effects.js`
- **数据文件**: `data/projects.json`
- **Bug 文档**: `.claude/BUGS.md` ⚠️ **修改前必读**

## 🔧 技术决策

### 前端
- 纯原生 HTML/CSS/JS，无框架依赖
- CSS Grid + Flexbox 布局
- 响应式设计（移动端友好）
- 数据存储在 JSON 文件中

### 设计风格
- **主题**: 赛博朋克 × 科技暗色
- **字体**: System fonts (性能优先)
- **配色**: 深色背景 + 蓝色/紫色/青色光效
- **动画**: CSS 动画 + Canvas 粒子系统
- **风格**: 科技未来感 + 动态背景

### z-index 层级规范 ⚠️ 重要
```
z-index: 9999  → .noise-overlay (顶层装饰)
z-index: 100   → .site-header, .filter-dropdown (导航层)
z-index: auto  → .hero, .controls, .projects-section (内容层)
z-index: -1    → 所有背景效果 (背景层)
```

**规则**：
- 背景效果必须使用 `z-index: -1`
- 内容区域优先使用 `z-index: auto`
- 下拉框/弹窗使用 `z-index: 100+`
- 修改前必读 `.claude/BUGS.md`

## 📊 当前状态

**进度**: 100% 完成

**已完成功能**:
- 响应式作品网格展示
- 实时搜索（标题、标签、描述）
- 分类筛选（类别、工具、年份）
- 作品详情页
- 导航（上一个/下一个作品）
- 加载状态和空状态处理
- 赛博朋克动态背景效果
- Bug 追踪系统

**下一步计划**:
- 可选：添加图片懒加载优化
- 可选：接入后端 CMS
- 可选：部署到 GitHub Pages

## ⚠️ 已知问题

参考 `.claude/BUGS.md` 获取完整问题列表和解决方案。

**高频问题**：
- z-index 层级冲突导致下拉框被遮挡（已解决，见 BUGS.md）

## 📝 开发规范

### 修改代码前必做
1. ✅ 阅读 `.claude/BUGS.md` 了解已知问题
2. ✅ 检查 z-index 层级是否冲突
3. ✅ 测试下拉框是否正常显示
4. ✅ 验证背景效果是否正常

### 添加新功能时
1. 参考 BUGS.md 中的"开发规范"章节
2. 遵循 z-index 使用规范
3. 完成后更新 BUGS.md（如有新问题）
4. 更新 PROGRESS.md 记录进度

## 📚 相关文档

- **Bug 记录**: `.claude/BUGS.md` ⚠️ **最重要**
- **进度追踪**: `.claude/PROGRESS.md`
- **技术决策**: `.claude/DECISIONS.md`
- **工作日志**: `.claude/SESSIONS.md`

## 💡 备注

- 使用 placeholder 占据图片位置，实际使用时替换为真实图片
- 数据结构支持扩展更多字段
- 设计风格参考赛博朋克美学
- **重要**: 修改前务必阅读 BUGS.md，避免重复问题

