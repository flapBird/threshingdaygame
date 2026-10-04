# Threshing Day Game · 首版

按用户选定的第 3 张设计实现：深青黑与哑金、月夜石桥插画、桌面双栏、右侧直接答题。站点正文为英文，目标域名为 `threshingdaygame.xyz`。

## 已实现

- 八个原创剧情场景、六种原创龙伙伴；点击选项直接进入下一题，无二次确认；每题无默认选择，支持返回改选、重新开始和本机续存。
- 确定性的六倾向计分。相同回答在同一规则版本下得到相同结果；六种结果均可达到。
- 原创龙卡、1080×1350 PNG 导出与预览、结果链接复制、本机收藏。
- 六色龙图鉴，颜色与收藏筛选。
- 四篇攻略：官方入口、验证码、重试间隔、黑/蓝龙与答案路线。官方来源、社区观察和本站建议分开标识；游戏剧透默认折叠。
- 小时/分钟重试提醒，存储绝对结束时刻，刷新后继续计时；不连接官方账号。
- 关于、来源、隐私、反馈说明和 404 页面；反馈入口目前帮助用户复制纠错文字，不提交到后台。
- 手机菜单、键盘按钮答题、焦点提示、跳过导航、减少动态效果支持。
- 14 条路由预渲染为完整 HTML；独立 title/description/canonical/OG、sitemap、robots 和 favicon。结果页不索引。

## 本地使用

```sh
npm install
npm run dev -- --port 4173 --strictPort
npm run build
npm run preview -- --host 127.0.0.1 --port 4174 --strictPort
npm test
npm run test:sites
```

当前交付时已启动生产预览：<http://127.0.0.1:4174/>。

技术实现为 React + TypeScript + Vite。构建后使用 React 服务端渲染生成静态页面，攻略正文和首页内容无需依赖客户端执行才出现。字体自托管，仅包含所需拉丁字集；插画使用 WebP，手机首屏使用较小版本。没有账户、广告或分析 SDK。两种字体的 OFL 版权与许可原文保留在 `public/licenses/`，随静态资源一同分发。

## 目录与规则

- `src/trial.ts`：剧情、原创龙资料、计分与存档验证。修改会影响结果的规则时增加 `RULE_VERSION`。
- `src/content.ts`：攻略、来源、路由和页面元信息。
- `src/App.tsx` / `src/styles.css`：页面与交互。
- `scripts/prerender.tsx`：静态 HTML 和 sitemap。
- `public/images/`：首屏、六种龙、品牌徽记与分享封面。
- `qa/` 与 `design-qa.md`：实际浏览器截图、设计对照和验证记录。

原有 `design/` 是用户已有的未跟踪设计资料，本轮提交没有将其顺带提交。原始生成大图在忽略的 `assets-source/` 中，运行所需的压缩资源已全部包含于 `public/`。

## 数据与边界

localStorage 保存已确认的回答、题号、收藏 ID 和提醒结束时刻。没有存储权限时，本次会话仍能完成答题并显示结果，屏幕阅读器会提示无法持久保存；答题区不显示常规存储说明。结果链接只携带原创伙伴 ID 与规则版本，不携带回答或官方账号信息。

PNG 导出在浏览器内生成，提供可展开的预览及再次下载链接。已核验实际生成图像为 1080×1350。当前内置浏览器的自动化下载事件未返回文件，所以没有宣称已通过操作系统下载落盘测试；普通浏览器和手机端保存仍建议在上线前做一次人工验收。

## 上线前剩余配置

本轮未发布网站、未修改 DNS、未绑定域名。上线时需要：

1. 使用下方 Cloudflare Workers Static Assets 配置部署 `dist/client/`。深层路由直接读取对应预渲染 HTML，未知地址使用 `404.html` 并返回 HTTP 404。
2. 绑定 `threshingdaygame.xyz`、配置 HTTPS；所有 canonical 和 sitemap 已使用该域名。
3. 提供真实纠错联系方式后替换当前复制反馈说明；现在没有收件邮箱或反馈 API。
4. 根据正式托管服务的日志处理方式更新隐私说明。

保留了原模板的 `worker/index.js`、Sites 构建脚本和打包测试。若后续交给 Sites，当前包具备所需 `dist/client/index.html`、`dist/server/index.js` 和 `dist/.openai/hosting.json`；域名、缓存与 404 配置仍应在实际托管环境核验。

插画为 AI 辅助制作的原创粉丝作品，名字、人格含义、剧情和算法均是本站创作。官方游戏入口保持独立，不嵌入、不冒充、不预测官方结果。

## Cloudflare 部署适配

最终托管目标为 Cloudflare。本站为预渲染静态站，采用 Workers Static Assets，无需运行 Node 服务、D1 或 R2。`wrangler.jsonc` 指向 `dist/client/`，按 Cloudflare 官方 SSG 路由模式使用 `auto-trailing-slash` 和 `404-page`，不使用首页 SPA fallback。攻略深层直达保留完整 HTML 和独立 SEO；分享结果的查询参数由客户端读取。

```sh
npm run build
npm run preview:cf     # 本地 CF 运行时，127.0.0.1:4175
npm run check:cf       # 只检查并打包，不发布
# 用户要求正式发布且已配置 Cloudflare 账户后：
npm run deploy:cf
```

CF Dashboard / Git 构建：构建命令 `npm run build`，部署命令 `npx wrangler deploy`。部署命令不能指向旧的 Sites `worker/index.js`，该文件保留兼容原模板；Cloudflare 使用独立的无 Worker 脚本静态资源配置。`public/_headers` 给带内容哈希的 `/assets/` 设置长缓存，HTML 和文件名固定的图片保持 Cloudflare 默认重新验证策略。开发工具及版本由 package-lock 固定。

当前配置没有 `account_id`、生产域名 route 或账户凭据，也不会自动修改 DNS。正式发布时再将 `threshingdaygame.xyz` 绑定到此 Worker 并核对 HTTPS；现有 canonical/sitemap 已使用这个域名。

参考：[Cloudflare SSG / 404 路由文档](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)、[静态资源响应头文档](https://developers.cloudflare.com/workers/static-assets/headers/)。
