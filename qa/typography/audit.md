# 排版审查与答题流程精简

final result: passed

2026-10-04。本轮先审查当前页面和两个真实对手，再按用户补充截图调整。截图均为本轮捕获；原始截图保留。源图对照用于设计 QA，不作为当前站点的审查证据。

## 逐步结论

1. **首页与答题区：初始需调整 → 已改善。** `01-before-home.png` 的 412px 手机首屏中，300px 插画、40px 引导标题和38px 题目连续占据空间，说明文字只有12px，首屏只展示一个选项。`02-before-desktop.png` 的桌面第二题也呈现两个大衬线标题、20px正文和较散的间距。问题是文字主次及布局密度共同失衡。初始风格、插画和配色值得保留。
2. **对手参照：层级清楚。** `03-competitor-com.png` 来自 https://threshingdaygame.com/ 的已有第二题；主标题突出，答题区使用紧凑段落和有边界的选项。`04-competitor-org.png` 来自 https://www.threshingdaygame.org/ 的首页；单一主标题、限制行宽的正文和较小导航构成清楚节奏。两者是不同页面状态，不能据此宣称流程优劣或功能都已测试。
3. **新答题流程：通过。** `13-final-desktop.png` 是 CF 本地运行时最终首页；`15-final-mobile-auto-advance.png` 是手机换题后自动定位的答题区。删掉 trial 装饰小标题/章节名、Continue 和常规进度/粉丝说明。题号、进度和 Back 保留。点击答案短暂显示选中态，220ms 后前进；同步锁、disabled 和 click.detail 防止连点跳题，键盘重复按键也被拦截。手机把新题定位到答题区，第二题三个按钮完整显示。边框、字母和选中勾选共同表达状态。
4. **阅读与结果：通过本轮相关视觉复查。** `10-after-guide.png`、`11-after-result.png` 检查了48px攻略标题、60px结果名称及其正文比例；`14-final-cf-result.png` 是新交互走完八题后的 Pyrren 结果。品牌均为 Threshing Day，页面和导出画布已去掉.xyz，URL/SEO仍用正式域名。页脚保留站点身份说明。

## 实际尺寸与验证

- 最终桌面 CSS viewport 1280×720，clientWidth=scrollWidth=1265（15px为滚动条），无横向溢出。主区高度576px；题目字号35.84px，来自 `clamp(32px, 2.8vw, 40px)`，主标题也使用流式字号；正文/选项16px。
- 手机 CSS viewport 412×681，clientWidth=scrollWidth=397。主标题34px、题目30px、正文/选项15px。第二题自动定位后标题top=85，三个按钮底部320.5/392.5/475.5px，均在屏幕内；长选项自然增加到75px高，短选项64px。
- 桌面八题真实点击完成；第一题快速双击仅进入第二题；Back可返回并改选，Enter可答题，刷新保持第二题；最后一题直接产生结果。测试产生的进度已清理，原生Chrome中用户的localhost进度未重置。
- 标题焦点在换题后移动到新H2。选项为原生button，附带仅供屏幕阅读器的直接前进说明，第一题无预选。进度ARIA数值与视觉进度一致。
- `16-final-home-full.png` 用于复查首页下方分区，未发现重叠或裁字；完整截图可能触发不同视口高度，几何结论以普通首屏截图和DOM读数为准。
- 临时viewport覆盖未实际改变已有内置浏览器标签尺寸，因此没有将请求的1435px尺寸冒充实测。桌面/手机结论仅覆盖实际1280px/412px；本轮未宣称360px或平板的新验收。

## 与原图的设计 QA

`17-reference-comparison.jpg` 将选定的第三张源图与当前实现在同一画布展示，等比缩小，没有拉伸。两者视口不同，比较的是设计语言和主次，不是1:1像素复刻。深青黑、哑金、石桥插画、左引导/右答题的结构保留；字号、密度、选项边框、辅助文案和一次点击答题按用户反馈覆盖旧图设定。

## 工程与 Cloudflare

- `npm run build`：TypeScript、Vite、14条路由预渲染及原有Sites包装通过。
- `npm test`：8项通过；`npm run test:sites`：4项通过。后者验证保留模板，不代表CF路由行为。
- Prettier检查通过；git diff --check通过。
- Wrangler 4.147.0，workerd 1.20261001.1。本地 `wrangler dev --local` 运行在127.0.0.1:4175；`wrangler deploy --dry-run`成功，不发布。
- `cloudflare-http-checks.json`记录实际HTTP结果：首页、攻略深层、带查询参数结果页200；不存在页面及资源404；无尾斜杠攻略307到规范地址；哈希CSS长缓存生效。预渲染攻略正文及结果noindex标签核验通过。
- CF配置使用无Worker脚本的Static Assets、auto-trailing-slash和404-page；与原有Sites首页fallback分开。正式账户、域名绑定及公网发布尚未执行。配置依据见README中的Cloudflare官方文档链接。

本轮未重新验证操作系统PNG落盘、官方账号、外部链接可用性及所有浏览器的辅助技术支持；这些不作为通过结论的一部分。
