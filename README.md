# Threshing Day Game

英文原创粉丝游戏，目标域名 `threshingdaygame.xyz`。页面使用完整品牌 **Threshing Day Game**，不显示域名后缀。

2026-10-05 按用户提供的对手首页与排名截图重组：居中双栏，左侧完整介绍和工具入口，右侧插画游戏卡片，下接前三名、What / How、攻略和 FAQ。保留本站深绿金色、原创石桥插画与六张龙图。

## 已实现

- 八个原创剧情场景、六个原创伙伴；开始后点击选项直接前进，支持键盘、双击保护、返回改选、重新开始和本机续存。
- 确定性的六倾向匹配。所有 6561 条路径均可完成，六个结果都可达到；相同回答得到相同伙伴。
- 原创龙卡、1080×1350 PNG 导出与预览、结果链接复制、本机收藏。
- 真实社区数据：结果页自愿发布昵称与龙契，龙墙显示最新 24 条并支持六色筛选；排行榜显示每日／总榜和前三名。
- 服务端根据完整八个回答重算伙伴与强度。每种龙只计最高强度，六种合计最多 600 分；重复同一结果不累计排行榜积分。每日按 UTC 划分；同分按发现数量、集齐当前伙伴的最早时间排序。榜单最多显示 50 位。
- 匿名第一方 HttpOnly cookie 识别发布者，无需邮箱、账户。故事 ID 保证重试不重复入库。数据库只保留昵称、伙伴、强度、故事 ID、时间及匿名标识，不保留回答。隐私页可移除自己的公共记录。
- 每个匿名浏览器每天最多发布 20 条、两次发布至少间隔 10 秒。游玩不受此限制。这些是基础提交限制，不构成强身份认证或全面反作弊系统。
- 六色龙图鉴、本机收藏筛选、四篇官方 Dragonkind 实用攻略、本机重试提醒、关于／来源／隐私／反馈／404。
- 16 条路由预渲染；独立 title/description/canonical/OG、sitemap、robots 与 favicon。结果页不索引，未知页面返回真正 HTTP 404。

## 本地预览

```sh
npm install
npm run build
npm run db:local
npm run preview:cf
```

完整的 Cloudflare Worker + D1 预览：[http://127.0.0.1:4175/](http://127.0.0.1:4175/)。使用本地持久化数据库 `.wrangler/state/`，不会访问线上 D1。

开发界面可运行 `npm run dev -- --port 4173 --strictPort`；4173 与 Vite 生产预览 4174 的 `/api/` 代理指向本地 CF 4175，需要保持 `preview:cf` 运行。同源校验只对已经匹配本地预览 origin 的请求做映射；外来 origin 仍被 Worker 拒绝。

```sh
npm test              # 路径、强度、名字与存储验证
npm run test:community # 独立临时 workerd/D1，验证发布、幂等、排名、跨日和移除
npm run test:sites     # 原模板兼容检查
npm run check:cf       # 只打包检查，不上传、不发布
```

`test:community` 使用 Wrangler 已安装的 Miniflare 及其 v4 选项兼容转换器，数据库是一次性的，测试数据不会进入预览或生产数据库。

## Cloudflare 上线配置

采用 **Cloudflare Workers + Static Assets + D1**。`cloudflare/worker.ts` 只接管 `/api/*`；静态页面读取 `dist/client/` 的预渲染 HTML，保留 `auto-trailing-slash`、`404-page` 和哈希资源长缓存。不需要 Node 服务器或 R2。

本轮仅在本地验证，**未部署、未修改 DNS、未创建线上数据库**。配置中的 D1 ID 是本地占位 ID。用户要求上线后需完成：

1. 在已授权的 Cloudflare 账户创建 `threshingday-community` D1，将返回的真实 `database_id` 写入 `wrangler.jsonc`。
2. 对生产 D1 执行迁移：`npx wrangler d1 migrations apply threshingday-community --remote`。
3. `npm run deploy:cf` 构建并部署 Worker 与静态资源，再绑定 `threshingdaygame.xyz` 并核对 HTTPS。
4. 在实际域名验证发布 cookie、每日／总榜、龙墙、页面直达、未知路由 404，并按真实托管日志策略维护隐私说明。

部署不能使用原模板 `worker/index.js`。该文件及 `.openai/hosting.json`、`scripts/prepare-sites-build.mjs`、`tests/sites-worker.test.mjs` 原样保留，满足既有 Sites 打包约定；Sites 静态预览本身不提供 D1 社区 API。

参考：[Cloudflare D1 入门](https://developers.cloudflare.com/d1/get-started/)、[静态资源完整应用路由](https://developers.cloudflare.com/workers/static-assets/routing/full-stack-application/)、[SSG 与 404](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)。

## 维护

- `src/trial.ts`：剧情、原创伙伴、匹配与存档验证；结果规则变动需增加 `RULE_VERSION`。
- `src/community.ts`：强度公式、昵称校验、公共 API 类型。
- `src/CommunityUI.tsx`：前三名、榜单、龙墙、可选发布与公共记录移除。
- `src/App.tsx` / `src/styles.css`：页面、游戏与排版。
- `src/content.ts`：攻略、来源、路由、SEO；`scripts/prerender.tsx`：完整 HTML 与 sitemap。
- `cloudflare/worker.ts` / `cloudflare/migrations/`：CF API 与数据库结构。
- `design-qa.md` / `qa/community/`：截图对照与验证证据。截图中的 QA Rider 是本机流程测试记录，不是用户流量。

字体与插画自托管；两套字体的 OFL 许可在 `public/licenses/`。作品为 AI 辅助制作的原创粉丝插画，名字、剧情与规则均为本站创作。官方 Dragonkind 入口独立，本站不会读取或改变官方账号。

PNG 由浏览器内生成，已有 1080×1350 预览验证；内置浏览器下载工具未返回操作系统落盘文件，因此不宣称通过实际下载落盘验收。反馈页仍只帮助复制纠错文字，未设置收件邮箱或提交后台。

`design/` 为此前已有的未跟踪设计资料，不纳入本轮提交；原始大图在忽略的 `assets-source/` 中，所有运行资源包含在 `public/`。
