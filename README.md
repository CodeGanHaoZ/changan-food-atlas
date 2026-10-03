# 长安食游图鉴

以 3D 西安美食图鉴为入口，连接地点、消费方式、路线和来源状态的前端黑客松原型。

## 快速开始

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
npm run preview
```

## 技术选型

- React 18 + Vite：页面脚手架和交互状态。
- Three.js / React Three Fiber / Drei：程序化 3D 菜品场景、灯光和旋转控制。
- Iconify MingCute：所有功能图标统一使用 MingCute 线性图标，并通过 `@iconify-json/mingcute` 本地注册，避免图标依赖外网。
- 原生 CSS Tokens：墨底、朱砂、鎏金、宣纸四色体系，以及响应式布局。
- 本地 seed + source registry：断网可演示，字段为后续真实数据接入预留来源和时间戳。

## 目录

```text
src/main.jsx              页面组装、导航和交互状态
src/styles.css            主题 token、组件样式、响应式和动效
src/data/atlasSeed.js     八道菜、演示地点和来源登记
src/services/atlasApi.js  菜品/地点/来源查询适配器
src/services/agentApi.js  自然语言解析适配器与规则回退
src/services/routeApi.js  确定性路线、预算和风险计算
public/motifs/            长安墨朱砂西安纹样
public/brand/             长安食游图鉴 Logo 资产
```

## 主流程

1. 在图鉴首页浏览八道菜的 3D 场景。
2. 点击卡片查看历史、食材、步骤和消费方式。
3. 在“去哪吃，怎么吃”输入地点、时长、预算和吃法。
4. `parseExploreQuery` 解析条件，`buildRoute` 生成多地点路线。
5. 路线面板展示节点、预算、时长、风险和来源入口。

## 数据真实性边界

当前 `src/data/atlasSeed.js` 中的地点、价格、评分、营业状态和路线都是演示 seed，不能作为已核验的线上事实。正式参赛版本应逐条替换为官方菜单、商家确认、公开地图 POI、文博/文旅资料或实地访谈，并填写 `capturedAt`、`verification` 和原始链接。

3D 模型是原创程序化示意，不代表实际分量、摆盘和配料。项目不声称实时营业、实时排队，也不替代地图导航、支付、外卖或团购。

## API 适配边界

页面依赖的函数位于 `src/services/`，后续可替换为服务端接口而不改动主要 UI：

- `getAtlas(filters)`：查询菜品图鉴。
- `getPlaces(filters)`：按菜品、区域和消费方式查询地点。
- `parseExploreQuery(input)`：返回地点、时长、预算、菜品和消费方式。
- `buildRoute(query)`：返回节点、预算范围、风险、备选和来源 ID。

大模型接入时只负责理解和编排，价格、距离、营业、预算和来源状态仍由程序校验。

## 视觉规范

页面遵循 `changan-ink-ui`：墨色背景、朱砂强调、鎏金细线、宣纸正文、MingCute 图标、低透明度西安纹样、可见键盘焦点态和 `prefers-reduced-motion` 降级。

Logo 使用“钟楼屋脊 + 食器碗形 + 印章方框”的组合，源文件位于 `public/brand/changan-food-atlas-logo.svg`；页面头部和页脚使用同一套内联路径，保证缩放时清晰。

## 已知限制

- 当前 3D 是统一程序化模板，不是八个逐菜扫描资产。
- 路线图是示意图，不提供真实步行导航。
- Agent 使用本地规则回退，尚未接入真实模型和工具调用。
- seed 地点仅用来演示信息架构，比赛提交前必须完成来源核验。
