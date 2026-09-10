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

技术决策（已定，勿反复）
CSS 策略：按页精修 + 原版 CSS 数值对照，放弃全盘切原版 CSS。原因：① 原版 CSS 带 [data-v-xxxx] scoped 选择器，React 无法原样使用，删掉后同名类（.main/.content/.header/.item）会跨组件冲突；② 原版 CSS 近一半是当前用不到的（Monaco Editor 约 9.5 万字符、plugin/diff/dns/provider/tray/tun 等约 12 个块）；③ 全盘替换会推翻已精修验证的页面。提取成果保留在 .cfw-extract/blocks/（49 个 scoped 块 + _global.css）。
依赖结论：Tailwind 不值得引入（原版视觉靠 47 个 scoped CSS 块 + 全局变量表还原，Tailwind 任意值工具类仅约 130 处且集中在 App 外壳）。必引入：yaml + qrcode（Profiles 页功能推进时再加）。视情况引入：marked / bignumber.js / mousetrap。

已确认的原版事实（勿再改动/勿误判）
Feedback 页结构（原版 #main-about-view）：
Developer → Relevance(Github/Document/Disclaimer Statement) → Credits(15 项) → Advertisement → 底部彩蛋
Credits 15 项：Clash、ClashX、Quantumult(X)、GeoLite2、twemoji、EnableLoopback、sysproxy、go-tun2socks、outline-client、terminal、Wintun、winsw、clash-premium-installer、monaco-editor、Material Icons
20 个外部链接 URL 从原版 select() 数组逐条提取
免责声明：9 条英文原文，弹窗显示在 <pre> 中
底部彩蛋「独立思考，明辨是非。」是原版作者藏的（absolute mt-[1000px] 藏到视口外不可见，URL 编码后 decode），正常使用不可见，仅读源码/DevTools 可见
Profiles 页：顶部「Download from a URL」输入 + Download / Update All / Import 三按钮；卡片右侧仅一个图标按钮（远程=refresh Update，本地=code Edit）；右键菜单 14 项（含 Open web page/Edit externally/Diff/QRCode/Parsers/Run script 等）
主题：4 个 —— light/dark/red/2077，下拉显示 Light / Dark / 国庆中秋 / Cyberpunk，另有 Follow System Theme 开关
字体机制（已还原）：原版 body CSS 是 'Noto Sans CJK', sans-serif（初始值），运行时由 action setFont 覆盖为 getter fontFamily 计算的字体栈 —— 用户 fontFamily 前缀 + ', "Microsoft Yahei", "PingFang SC", "system-ui", 微软雅黑' + (useSystemEmoji ? '' : ', "TwemojiMozilla"')。Windows 默认生效字体族 = 微软雅黑族 + TwemojiMozilla（原版未打包 Noto Sans CJK，故 CSS 初始值实际回退 sans-serif）。全站 body font-weight:500（原版硬编码）。Settings→Appearance 有 Font Family(SimpleInput，placeholder 平台相关 Mac→PingFang SC / Win→Microsoft Yahei / 其他→system-ui) + Use System Emoji(SwitchView)。Web 版已完整还原（App.jsx useEffect 应用），字体族与字重均与原版运行时一致。
Proxies 卡片对齐机制：.proxy-item 与 20 个占位 <i> 都走 inline style 统一宽度 = settings.proxyItemWidth（>=150 生效，默认 290px，非响应式）。CSS 是 flex-wrap + space-around + flex-grow:1，卡片等宽上下左右对齐，末行靠占位 <i> 左对齐；850×603 最小窗口一行 2 个卡片。React 端 CSS 不写死宽度，用 JSX inline style（当前 PROXY_ITEM_WIDTH=290 常量，Settings 的 Proxy Item Width 设置项未实现）
背景图：red→national_day.png、2077→2077.png，class 为 .cloud .opacicy（position:fixed; bottom:110px; left:calc(50% + 80px); width:40%; opacity:0.2）
已完成工作
资源复制：从原版 dist 复制到 public/：favicon.ico、logo.png、logo_reverse.png、logo_reverse_32.png、logo_64_eyes.png、imgs/2077.png、imgs/moon_cake.png、imgs/national_day.png、fonts/codicon.ttf
节日彩蛋：4 主题配色从原版 .theme-red/.theme-2077 完整提取写入 src/styles/base.css；App.jsx 按主题渲染背景图；index.html 防白闪底色
Rules 页：完整还原原版隐藏规则页（scoped data-v-459dde1e，原版路由 /home/router 存在但菜单 menuItems 未接入，故隐藏）。标题 "Top 100 matching rules(N)." + Add/Save/Cancel 按钮 + 过滤框(placeholder "fiter by keywords"，原版拼写错误保留) + 列表项(url 18px 黑 + rule 13px 变量灰 + proxy 彩色标签 randomBGC) + north/south/delete 图标（stopPropagation）；新增规则弹窗 RuleAlterView(scoped data-v-eea841c4)。Web 版适配：Save 无内核配置写接口(service.saveRules，demo 模拟成功)，Cancel=放弃未保存修改重新加载，RULE-SET 更新 provider 分支保留未启用
Profiles 编辑：重写，含右键菜单、远程刷新、本地编辑
Sidebar：菜单含 Rules、Feedback（无 About）
i18n：zh/en 双语，scripts/check-i18n.mjs 核对脚本
smoke.mjs：覆盖各页面 + 4 主题截图，开头 localStorage.clear()
滚动条问题最终结论：Chrome 复现、Edge 不复现，最终查明是 Chrome 缓存旧 CSS（无痕正常、非无痕强刷仍复现、服务端已验证是最新代码）。两轮修复中的过度部分已在 bc6910b 回退；净保留真修复 .app 对齐原版 .wrapper（height:100vh / width:100vw / 移除自加的 min-width:850px）。Proxies 相关选择器现已与原版 scoped CSS 逐字符一致。
关键文件
src/App.jsx —— PAGES 映射 + THEME_BG 背景图 + 主题跟随系统逻辑
src/styles/base.css —— 4 主题 CSS 变量 + 全部组件样式
src/store/settings.js —— Zustand persist（theme/systemTheme/fontFamily/useSystemEmoji/lang/demoMode/backend 等字段）
src/store/clash.js —— clash 后端状态
src/service/index.js —— bootstrap/startLive/fetchRules 等 API
src/service/mock.js —— demo 数据
src/i18n.js —— zh/en 双语
src/pages/*.jsx —— General/Proxies/Profiles/Logs/Connections/Rules/Settings/Feedback
scripts/smoke.mjs、scripts/check-i18n.mjs、scripts/extract-cfw-css.mjs
开发与验证命令（Windows）
# 启动 dev（默认端口 5173，PORT 可覆盖）
npm run dev

# 构建生产版本
npm run build

# 预览构建产物
npm run preview

# 冒烟测试（驱动系统 Chrome 逐页截图，需 dev 已启动）
node scripts/smoke.mjs

# i18n 键核对
node scripts/check-i18n.mjs

主题变量结构：:root（light）、html[data-theme='dark'/'red'/'2077']
构建产物在 dist/assets/
原版 CFW 默认窗口逻辑尺寸 850×603（main.js width:850 height:603）
下一步可选方向（尚未指定）
逐页视觉精修（General header、Logs 行结构、Connections 表格细节）
补充 CFW 功能（DNS 设置、Mixin 编辑、规则编辑、订阅用量详情）
需你定夺项：Backend/Demo Mode 设置是 web 版连接后端的基础设施（原版桌面应用没有），当前保留；是否移除待定

Git 历史（关键提交）
932c92c first commit
ab7a630 feat(ui): 七页面按原版 CSS 精修 + 外壳滚动容器对齐原版
8c703dc chore: 忽略调试与反编译参考产物，补充项目笔记
b90088d fix(ui): 修复全局滚动条问题, 外壳严格对齐原版（部分被回退）
b5ab29c fix(proxies): 消除 scroll-view 横向滚动条, 严格对齐原版（部分被回退）
bc6910b revert: 回退缓存误导下的过度修复, 严格对齐原版 CSS
