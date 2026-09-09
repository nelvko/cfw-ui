项目背景
项目：C:\Users\issuse\WebstormProjects\cfw-ui（Clash for Web）

技术栈：React 19 + Vite + Zustand + 原生 CSS
目标：用 Web 技术 100% 复刻 Clash for Windows（CFW）的 UI 与设计
原版 CFW 解包目录（对照参考）：C:\Users\issuse\Desktop\app\dist\electron\

renderer.js（3.4MB，含全部 CSS 变量/组件模板/文案）
可复用静态资源：favicon.ico、logo 系列、codicon.ttf、节日彩蛋图片等
核心约束（最高优先级，必须严格遵守）
除以下 3 个特例外，其余 UI 与设计一律 100% 还原原版，严禁私加任何功能或内容。

特例一 —— Rules 菜单（新增）：这是唯一的菜单结构新增项，用于展示规则。Sidebar 菜单顺序： General / Proxies / Profiles / Logs / Connections / Rules / Settings / Feedback

特例二 —— General 页标题：标题固定显示 Clash for Web（原版是 "Clash for Windows"），仅此一处文字个例。

特例三 —— Feedback 页 Developer：展示 nelvko，点击跳转 https://github.com/nelvko（原版该位置是手误字符串 "404 Frror"）。

原版没有独立 About 页：About 相关内容（Developer/Relevance/Credits/免责声明）全部放在 Feedback 菜单项中，对应路径 /home/about，渲染 #main-about-view。

已确认的原版事实（勿再改动/勿误判）
Feedback 页结构（原版 #main-about-view）：
Developer → Relevance(Github/Document/Disclaimer Statement) → Credits(15 项) → Advertisement → 底部彩蛋
Credits 15 项：Clash、ClashX、Quantumult(X)、GeoLite2、twemoji、EnableLoopback、sysproxy、go-tun2socks、outline-client、terminal、Wintun、winsw、clash-premium-installer、monaco-editor、Material Icons
20 个外部链接 URL 从原版 select() 数组逐条提取
免责声明：9 条英文原文，弹窗显示在 <pre> 中
底部彩蛋「独立思考，明辨是非。」是原版作者藏的（absolute mt-[1000px] 藏到视口外不可见，URL 编码后 decode），正常使用不可见，仅读源码/DevTools 可见
Profiles 页：顶部「Download from a URL」输入 + Download / Update All / Import 三按钮；卡片右侧仅一个图标按钮（远程=refresh Update，本地=code Edit）；右键菜单 14 项（含 Open web page/Edit externally/Diff/QRCode/Parsers/Run script 等）
主题：4 个 —— light/dark/red/2077，下拉显示 Light / Dark / 国庆中秋 / Cyberpunk，另有 Follow System Theme 开关
背景图：red→national_day.png、2077→2077.png，class 为 .cloud .opacicy（position:fixed; bottom:110px; left:calc(50% + 80px); width:40%; opacity:0.2）
已完成工作
资源复制：从原版 dist 复制到 public/：favicon.ico、logo.png、logo_reverse.png、logo_reverse_32.png、logo_64_eyes.png、imgs/2077.png、imgs/moon_cake.png、imgs/national_day.png、fonts/codicon.ttf
节日彩蛋：4 主题配色从原版 .theme-red/.theme-2077 完整提取写入 src/styles/base.css；App.jsx 按主题渲染背景图；index.html 防白闪底色
Rules 页：调用 fetchRules()，表格展示 type/payload/proxy，带搜索
Profiles 编辑：重写，含右键菜单、远程刷新、本地编辑
Sidebar：菜单含 Rules、Feedback（无 About）
i18n：zh/en 双语，scripts/check-i18n.mjs 核对脚本
smoke.mjs：覆盖各页面 + 4 主题截图，开头 localStorage.clear()
关键文件
src/App.jsx —— PAGES 映射 + THEME_BG 背景图 + 主题跟随系统逻辑
src/styles/base.css —— 4 主题 CSS 变量 + 全部组件样式
src/store/settings.js —— Zustand persist（theme/systemTheme/lang/demoMode/backend 等字段）
src/store/clash.js —— clash 后端状态
src/service/index.js —— bootstrap/startLive/fetchRules 等 API
src/service/mock.js —— demo 数据
src/i18n.js —— zh/en 双语
src/pages/*.jsx —— General/Proxies/Profiles/Logs/Connections/Rules/Settings/Feedback
scripts/smoke.mjs、scripts/check-i18n.mjs
开发与验证命令（Windows）
bash
11 行
展开
复制

# 启动 dev（端口 5174，5173 常被占用）
主题变量结构：:root（light）、html[data-theme='dark'/'red'/'2077']
构建产物在 dist/assets/
下一步可选方向（尚未指定）
逐页视觉精修（General header、Logs 行结构、Connections 表格细节）
补充 CFW 功能（DNS 设置、Mixin 编辑、规则编辑、订阅用量详情）
需你定夺项：Backend/Demo Mode 设置是 web 版连接后端的基础设施（原版桌面应用没有），当前保留；是否移除待定
