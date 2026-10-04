# 页面精修验收 · 2026-10-05

1. **首页 How to play — 已修复。** 用户图片中的米白区块和首页深绿风格不一致。保留步骤结构，使用深绿背景、金色编号和现有字体；桌面四列、平板两列、窄屏一列。对照 `comparison-how.png` 和 `comparison-home.png`，窄屏 `how-320.png`。
2. **FAQ — 已完成。** 标题精确为 Threshing Day game FAQ，按 Dragons & choices / Retries & countdowns / Playing & sharing 分成 16 问。黑龙、蓝龙、正确答案、两条绿龙、红龙、死亡、随机性、重试、signet、颜色尾型血统、编制、入场与公开分享均覆盖。现有攻略、图鉴、计时器与隐私入口直接可用。`faq-desktop.png`、`faq-mobile.png`、`faq-320.png` 为已验收的实际展开状态。
3. **首页 Today’s top riders — 已隐藏。** 当前截图及 DOM 中无该模块；保留组件、排行榜路由与后端。恢复开关为 `SHOW_HOME_PODIUM`，不设置擅自决定的用户数量阈值。
4. **Dragon wall — 已修复呈现。** 当前真实数据库没有公开记录，因此计数为 0。六位原创伙伴在空墙上仍有独立筛选卡，区分 6 位可探索伙伴与真实公开记录；加载时不冒充 0，失败时显示数量不可用。实际颜色筛选、0 计数、全量颜色统计说明及公开 CTA 已检查。`wall-desktop.png`、`wall-tablet.png`、`wall-mobile.png`、`wall-320.png` 和 `comparison-wall.png` 为最终证据；`wall-initial-sizing.png` 仅记录已修复的图片高度问题。

所有截图由本轮浏览器实际捕获。`comparison-*` 仅将真实截图等比缩放排在同一输入中；`how-*` 仅从实际截图裁出对应模块，没有修改网页内容。最终墙截图来自顶部为 0 的新页面，避免内置浏览器在滚动后的整页截图中混入离屏固定元素。

检视字体、排版、颜色、原画与文案五项均通过。FAQ 原生 details/summary 的鼠标、Enter 开合与焦点可见性已检查，未宣称完成全部无障碍审计。检查的实际宽度为 1280、768、390、320，无横向溢出。控制台未发现应用错误或警告。

信息来源核实于 2026-10-05：

- [作者 Dragonkind FAQ](https://rebecca-yarros.squarespace.com/faqs)：重试、验证码、可得颜色与尾型。
- [Dragonkind 玩家讨论 Part 3](https://www.reddit.com/r/fourthwing/comments/1wvwfp9/dragonkind_dragon_bonding_megathread_part_3/)：玩家对随机性、四小时等待和作者 signet 公告的总结，明确标为社区资料。
- [玩家场景讨论 Part 2，含剧透](https://www.reddit.com/r/fourthwing/comments/1wuyvem/dragonkind_masterpost_pt_2_will_contain_spoilers/)：绿龙场景及红龙结果、编制和卡片属性的玩家报告。没有将个别成功经历写成必胜答案。
- [官方 Dragonkind 入口](https://dragonkind.com/)：官方邮箱登录入口独立。

自动验证：构建及 16 条静态路由预渲染、10 项单元检查、4 项 Sites 兼容检查、1 项临时 Cloudflare/D1 集成检查均通过；最终图片 CSS 修正后再次构建通过。未上线、未创建远程 D1、未改 DNS，未向预览数据库写入测试记录。

final result: passed
