# 钢铁城防网页原型

## 启动

在当前目录启动一个静态服务器：

macOS：

```bash
cd /Users/wenyuhua/Documents/Playground/factory_cyber_dungeon
python3 -m http.server 8010
```

Windows：

```powershell
cd "C:\Users\hua.w\OneDrive - Procter and Gamble\Desktop\factory_cyber_dungeon\factory_cyber_dungeon"
python -m http.server 8010
```

然后在浏览器打开：

```text
http://localhost:8010
```

## 当前原型包含

- 首页、玩法说明、背景导入
- 8 张管理层角色卡，选择其中 4 张开局
- 25 张工厂网络安全事件卡，开局随机抽取 6 张
- 自动检定、讨论计时、指标结算
- 单局复盘与最终结算

## 整体开发架构

这个原型是一个纯前端静态网页项目，没有后端、数据库或构建流程。整体设计目标是低门槛修改，适合继续快速迭代培训内容。

### 文件分工

- `index.html`
  - 负责页面骨架和各个界面的模板定义
  - 主要通过 `<template>` 划分首页、玩法说明、角色选择、事件页、结算页、最终复盘页
- `styles.css`
  - 负责整体视觉风格、响应式布局、卡片样式和像素风格图标的呈现
  - 当前已移除像素动画，只保留静态像素图标和信息卡布局
- `app.js`
  - 负责全部游戏逻辑
  - 包含角色数据、事件卡数据、状态管理、页面渲染、检定结算、计时器和复盘逻辑

### 页面流转

页面是单页应用式的切换，但没有使用框架。所有界面切换都由 `app.js` 内的状态驱动：

1. `intro`
2. `help`
3. `briefing`
4. `roles`
5. `event`
6. `result`
7. `final`

核心状态保存在 `state` 对象中，包括：

- 当前页面
- 已选择角色
- 当前回合
- 当前牌库
- 安全值 / 产能值 / 声誉值
- 本回合结算结果
- 全局日志
- 讨论计时器

### 数据层设计

当前数据直接写在 `app.js` 中，主要分为三部分：

- `roles`
  - 管理层角色卡数据
  - 包含角色名称、关注点、加成标签、加成检定和常见盲点
- `events`
  - 事件卡主体数据
  - 每张卡包含标题、场景描述、提示、检定类型、难度、标签、复盘文案和选项
- `eventSceneMeta`
  - 事件页中“场景摘要卡”的附加展示数据
  - 包含摘要标题、摘要描述和三枚关键信号标签

### 事件卡逻辑

每张事件卡有两层逻辑：

- 管理动作层
  - 玩家先在多个管理动作中选择一个
- 结算层
  - 如果该选项是推荐动作，则触发组织检定
  - 如果不是推荐动作，则直接结算后果

检定由以下要素组成：

- 基础检定值
  - `警觉 +2`
  - `控制 +2`
  - `恢复 +1`
- 角色加成
  - 当已选角色的 `bonusTags` 命中事件标签时提供加成
- `d20` 掷骰结果

### 事件卡清单

当前事件池共 25 张卡，覆盖事件升级、远程接入、权限审批、访问复核、变更评审、恢复验证、证据 review 等管理层场景。

1. `event_01` 深夜告警
   - 主题：事件升级与跨部门授权
   - 标签：`account` `network` `escalation`
2. `event_02` 供应商之门
   - 主题：第三方远程接入治理
   - 标签：`remote` `vendor`
3. `event_03` 勒索阴影
   - 主题：勒索早期隔离与升级
   - 标签：`network` `escalation` `communication`
4. `event_04` 停线的代价
   - 主题：安全与交付的经营权衡
   - 标签：`shutdown` `engineering`
5. `event_05` 客户来信
   - 主题：对外沟通与口径管理
   - 标签：`communication` `evidence`
6. `event_06` 董事会追问
   - 主题：战情汇报纪律
   - 标签：`communication` `escalation` `evidence`
7. `event_07` 异常批次是否放行
   - 主题：追溯完整性与放行责任
   - 标签：`quality` `manual`
8. `event_08` 外包工程师深夜到场
   - 主题：访客管理与物理边界
   - 标签：`physical` `vendor`
9. `event_09` 工程站参数改动疑云
   - 主题：工程站基线与参数完整性
   - 标签：`engineering` `network`
10. `event_10` 是否切换手动生产
    - 主题：降级运行边界
    - 标签：`manual` `shutdown`
11. `event_11` 备份可用性争议
    - 主题：恢复证据与恢复承诺
    - 标签：`backup` `escalation`
12. `event_12` 厂内通告怎么发
    - 主题：内部口径与秩序稳定
    - 标签：`communication` `physical`
13. `event_13` 临时高权限审批
    - 主题：紧急授权与最小权限
    - 标签：`account` `approval` `engineering`
14. `event_14` 季度访问复核
    - 主题：账号复核与职责变化
    - 标签：`account` `review` `evidence`
15. `event_15` 紧急管理员账号借用
    - 主题：共享账号与应急纪律
    - 标签：`account` `review` `remote`
16. `event_16` 防火墙白名单例外
    - 主题：网络例外审批
    - 标签：`network` `approval` `change`
17. `event_17` 远程访问双人审批
    - 主题：高风险远程接入管控
    - 标签：`remote` `approval` `vendor`
18. `event_18` USB 例外申请
    - 主题：介质例外与补偿控制
    - 标签：`physical` `approval` `engineering`
19. `event_19` PLC 逻辑变更评审
    - 主题：控制逻辑变更与同侪复核
    - 标签：`engineering` `review` `change`
20. `event_20` 变更窗口撞上交付高峰
    - 主题：维护审批与经营冲突
    - 标签：`change` `approval` `shutdown`
21. `event_21` 供应商临时账号到期
    - 主题：账号回收与例外延长
    - 标签：`vendor` `account` `approval`
22. `event_22` 沉睡管理员账号
    - 主题：历史遗留权限清理
    - 标签：`account` `review` `engineering`
23. `event_23` 恢复演练复盘签字
    - 主题：恢复能力 review 与责任闭环
    - 标签：`backup` `review` `evidence`
24. `event_24` 职责分离冲突
    - 主题：审批人与执行人边界
    - 标签：`review` `approval` `engineering`
25. `event_25` 日报截图 review
    - 主题：证据质量与管理误判
    - 标签：`review` `evidence` `communication`

### 渲染方式

项目没有使用 React、Vue 等框架，而是使用原生 DOM 渲染：

- `render()` 负责根据当前 `state.screen` 渲染目标模板
- `renderRoles()` 负责角色选择界面
- `renderEvent()` 负责事件卡页面
- `renderResult()` 负责回合结算页
- `renderFinal()` 负责最终复盘页

这种方式的优点是结构直接、依赖少，适合原型阶段；缺点是当事件类型和页面复杂度继续上升后，`app.js` 会变得越来越大。

### 当前推荐的后续拆分方向

如果后续继续长期维护，建议按下面的顺序逐步拆分：

1. 把 `events` 和 `roles` 抽到独立数据文件
2. 把页面渲染函数拆成多个模块
3. 把计时器、结算器、复盘逻辑拆成独立函数区
4. 视复杂度决定是否升级到轻量前端框架

### 运行方式

因为这是静态原型，运行只依赖本地静态服务器：

- 本地启动 `python3 -m http.server`
- 浏览器访问本地端口
- 不依赖网络服务或外部接口

这意味着它很适合在内网、培训教室或投屏场景中直接使用。

## 适合下一步继续扩展的方向

- 将事件卡独立成 JSON 文件，方便继续加题
- 加入主持人模式和仅投屏模式
- 增加“次优答案”与多阶段连锁事件
