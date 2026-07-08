const roles = [
  {
    id: "gm",
    name: "厂长 / 总经理",
    focus: "停线授权、经营连续性、跨部门拍板",
    concerns: ["是否升级为厂级事件", "谁来统一指挥", "哪些损失可以接受"],
    bonusTags: ["shutdown", "escalation"],
    bonusCheck: "recovery",
    risk: "为了保交付拖延关键处置",
  },
  {
    id: "production",
    name: "生产负责人",
    focus: "产线稳定、班组执行、交付节奏",
    concerns: ["哪条线必须保", "临时管控能否落实", "交接班风险是否失控"],
    bonusTags: ["shutdown", "manual", "quality"],
    bonusCheck: "recovery",
    risk: "把安全事件当普通设备波动处理",
  },
  {
    id: "itot",
    name: "IT/OT 负责人",
    focus: "识别攻击、控制扩散、恢复系统",
    concerns: ["是否已从 IT 进入 OT", "哪些账号和入口应收紧", "恢复边界如何确定"],
    bonusTags: ["account", "network", "remote", "backup", "escalation"],
    bonusCheck: "control",
    risk: "技术动作正确，但授权动作滞后",
  },
  {
    id: "automation",
    name: "自动化 / 设备工程负责人",
    focus: "工程站、PLC、HMI、设备参数安全",
    concerns: ["工程站是否可信", "参数变更是否可疑", "能否切到受控手动模式"],
    bonusTags: ["engineering", "manual", "remote"],
    bonusCheck: "awareness",
    risk: "为了尽快恢复跳过变更确认",
  },
  {
    id: "quality",
    name: "质量负责人",
    focus: "产品质量、放行判断、追溯能力",
    concerns: ["异常期间产品是否可信", "是否要隔离批次", "数据异常是否影响追溯"],
    bonusTags: ["quality", "manual"],
    bonusCheck: "control",
    risk: "只看设备是否运行，不看记录是否可靠",
  },
  {
    id: "compliance",
    name: "法务 / 合规负责人",
    focus: "留痕、通报、责任、审计一致性",
    concerns: ["哪些是事实哪些是推测", "是否触发上报责任", "证据是否被破坏"],
    bonusTags: ["communication", "evidence", "escalation"],
    bonusCheck: "awareness",
    risk: "为了降低表述风险延误行动",
  },
  {
    id: "supply",
    name: "采购 / 供应商管理负责人",
    focus: "第三方接入、外包管理、关键供应商协同",
    concerns: ["供应商是否要远程接入", "外包是否在受控范围内操作", "是否依赖单一供应商"],
    bonusTags: ["remote", "vendor", "physical"],
    bonusCheck: "control",
    risk: "以进度为理由默认接受例外",
  },
  {
    id: "security",
    name: "行政 / 安保负责人",
    focus: "门禁、访客、现场秩序、通知执行",
    concerns: ["谁能进入控制区和机房", "访客与夜班是否已核验", "临时管控能否真正执行"],
    bonusTags: ["physical", "communication", "evidence"],
    bonusCheck: "control",
    risk: "只发通知，不核实落地",
  },
];

const events = [
  {
    id: "event_01",
    title: "深夜告警",
    focus: "事件升级与跨部门授权",
    hint: "先做定级和授权，不要让夜班继续在灰区里等待。",
    scenario:
      "凌晨 2:15，SOC 值班人员报告：工厂办公网出现异常登录行为，来源涉及一名财务主管账号。10 分钟后，MES 登录日志中也出现该账号的访问记录。夜班产线暂时正常，但 IT 团队怀疑攻击者正在横向移动。",
    check: "awareness",
    difficulty: 5,
    tags: ["account", "network", "escalation"],
    review: "管理层首要任务不是亲自判断技术细节，而是及时确认事件级别、授权联动并明确责任链。",
    options: [
      {
        id: "A",
        text: "立即限制相关账号和远程入口，并授权 IT/OT 联合排查",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "处置及时，几条关键入口被封堵，攻击被挡在侦察阶段，没有横向扩散。",
        failureText: "方向对，但联动慢了半拍，夜班只能在受限模式下维持运转。",
      },
      { id: "B", text: "先让 IT 留意日志，避免夜班误停", effect: { security: -4, production: 0, reputation: 0 } },
      { id: "C", text: "仅通知生产值班经理，等更多迹象出现", effect: { security: -2, production: -2, reputation: 0 } },
      { id: "D", text: "等白天管理层到场后再定级", effect: { security: -4, production: 0, reputation: 0 } },
    ],
  },
  {
    id: "event_02",
    title: "供应商之门",
    focus: "第三方远程接入治理",
    hint: "供应商不是敌人，但未受控的入口一定是风险。",
    scenario:
      "一家关键设备供应商来电称，需立即远程登录产线控制系统修复参数异常，否则明早可能影响良率。IT 团队发现该供应商的远程访问通道长期启用，且本周尚未完成访问复核。",
    check: "control",
    difficulty: 5,
    tags: ["remote", "vendor"],
    review: "供应商风险不是能不能合作，而是能不能在可审计、可授权、可回收的条件下合作。",
    options: [
      { id: "A", text: "先让供应商连进来，修完再补流程", effect: { security: -4, production: 0, reputation: 0 } },
      { id: "B", text: "请现场工程师按供应商电话指示操作", effect: { security: -2, production: -2, reputation: 0 } },
      {
        id: "C",
        text: "按受控流程临时开放，限定时间、范围和审计",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "远程通道按时限、范围和审计受控开放，修完即回收，没有留下长期敞口。",
        failureText: "流程对，但审批和执行稍慢，修复窗口被压缩。",
      },
      { id: "D", text: "口头同意，由生产负责人盯着处理", effect: { security: -4, production: 0, reputation: 0 } },
    ],
  },
  {
    id: "event_03",
    title: "勒索阴影",
    focus: "勒索早期隔离与升级",
    hint: "越怕扩散恐慌，越容易真的扩散。",
    scenario:
      "早班开始前，计划部门反馈部分共享文件无法打开，文件名后缀异常。半小时后，仓储打印、排产报表和部分办公终端相继异常。有人建议先不要公开，避免引发恐慌。",
    check: "control",
    difficulty: 5,
    tags: ["network", "escalation", "communication"],
    review: "管理层常见误区是把避免恐慌放在避免扩散之前。勒索事件里，拖延升级通常比短暂停摆更贵。",
    options: [
      { id: "A", text: "暂时压住消息，避免各部门过度反应", effect: { security: -4, production: 0, reputation: 0 } },
      { id: "B", text: "先恢复最关键文件，确认性质后再升级", effect: { security: -4, production: 0, reputation: 0 } },
      { id: "C", text: "办公网先不动，优先保住产线运行", effect: { security: -2, production: 0, reputation: -2 } },
      {
        id: "D",
        text: "启动应急响应，隔离受影响网段并同步通报",
        best: true,
        success: { security: 1, production: -2, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "应急响应及时启动，受影响网段被隔离，用局部停摆换来了可控边界。",
        failureText: "隔离动作及时，但现场切换仍带来了短时效率损失。",
      },
    ],
  },
  {
    id: "event_04",
    title: "停线的代价",
    focus: "安全与交付的经营权衡",
    hint: "停线不是技术动作，而是经营决策。",
    scenario:
      "OT 团队判断，攻击者可能已接触到工程站，但尚无证据表明 PLC 被改写。是否临时停掉一条关键产线进行隔离检查，成为眼前最艰难的选择。客户订单当天必须发出。",
    check: "recovery",
    difficulty: 4,
    tags: ["shutdown", "engineering"],
    review: "管理层必须定义何时可以停、谁来拍板、客户如何沟通。把停线决定完全下沉给技术团队，是经营责任的缺位。",
    options: [
      { id: "A", text: "全厂立即停线，先把风险降到最低", effect: { security: 0, production: -6, reputation: 0 } },
      { id: "B", text: "把决定交给技术团队，管理层不直接介入", effect: { security: 0, production: 0, reputation: -2 } },
      {
        id: "C",
        text: "对关键产线短时受控停线，同时准备交付沟通预案",
        best: true,
        success: { security: 1, production: -2, reputation: 1 },
        failure: { security: 0, production: -4, reputation: 0 },
        successText: "关键产线短停到位，边界得到确认，交付沟通也提前备好了预案。",
        failureText: "决策对，但现场恢复节奏比预期慢，出货压力抬升。",
      },
      { id: "D", text: "继续生产，等出现明确异常再处置", effect: { security: -4, production: 0, reputation: 0 } },
    ],
  },
  {
    id: "event_05",
    title: "客户来信",
    focus: "对外沟通与口径管理",
    hint: "不是说不说，而是谁说、说到什么程度、多久更新。",
    scenario:
      "一个重点客户发来邮件，表示听说你们工厂系统异常，询问是否影响其订单数据与交付安排。法务建议谨慎回应，生产部门则主张等确认后再说。",
    check: "control",
    difficulty: 5,
    tags: ["communication", "evidence"],
    review: "客户沟通的关键不是一次性说清全部细节，而是在不超范围承诺的前提下维持可信更新。",
    options: [
      { id: "A", text: "由生产先口头安抚客户，后续再统一口径", effect: { security: 0, production: 0, reputation: -2 } },
      {
        id: "B",
        text: "简要说明事件正在处理中，并承诺按时间点更新",
        best: true,
        success: { security: 0, production: 0, reputation: 2 },
        failure: { security: 0, production: 0, reputation: 1 },
        successText: "对外口径稳住了客户预期，也守住了后续沟通的可信度。",
        failureText: "沟通方向对，但内部更新时间表还不够稳定。",
      },
      { id: "C", text: "暂不回复，等范围完全查清", effect: { security: 0, production: 0, reputation: -2 } },
      { id: "D", text: "先否认异常，避免客户扩大解读", effect: { security: 0, production: 0, reputation: -4 } },
    ],
  },
  {
    id: "event_06",
    title: "董事会追问",
    focus: "战情汇报纪律",
    hint: "把事实、推测和行动拆开说，比给结论更重要。",
    scenario:
      "集团高层要求你在 30 分钟内说明三件事：发生了什么、现在风险多大、你准备怎么恢复。现场信息仍不完整，各部门口径也不完全一致。",
    check: "awareness",
    difficulty: 5,
    tags: ["communication", "escalation", "evidence"],
    review: "危机汇报最忌讳过度乐观和多头发声。管理层需要建立统一战情口径。",
    options: [
      { id: "A", text: "先给出偏乐观判断，减少上层干预", effect: { security: 0, production: 0, reputation: -4 } },
      { id: "B", text: "等信息再完整一些，避免说错", effect: { security: 0, production: 0, reputation: -2 } },
      { id: "C", text: "让各部门分别汇报自己负责部分", effect: { security: 0, production: 0, reputation: -2 } },
      {
        id: "D",
        text: "先报事实、假设和行动，再给出更新时间点",
        best: true,
        success: { security: 0, production: 0, reputation: 2 },
        failure: { security: 0, production: 0, reputation: 1 },
        successText: "事实、假设和行动讲清楚了，上层能有效监督而不越位指挥。",
        failureText: "结构对，但部分关键数字仍有较大缺口。",
      },
    ],
  },
  {
    id: "event_07",
    title: "异常批次是否放行",
    focus: "追溯完整性与放行责任",
    hint: "设备能运行，不代表产品就该放行。",
    scenario:
      "凌晨发生网络异常后，一条包装线短时切换过手动模式。早班时，质量系统里有一段批次记录缺失，但现场人员表示设备运行看起来正常。仓库催促尽快放行，否则当天出货会延迟。",
    check: "control",
    difficulty: 5,
    tags: ["quality", "manual"],
    review: "管理层要守住的是可追溯、可证明、可追责，而不是只看产品是否勉强产出来。",
    options: [
      { id: "A", text: "先放行，后补记录", effect: { security: 0, production: 0, reputation: -4 } },
      { id: "B", text: "仅抽检外观，合格就出货", effect: { security: 0, production: 0, reputation: -2 } },
      {
        id: "C",
        text: "暂缓放行，隔离相关批次并核对追溯数据",
        best: true,
        success: { security: 0, production: -2, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "问题批次被及时隔离核对，不确定性被挡在厂内，没有流到客户端。",
        failureText: "处置对，但放行前核验耗时比预期更长。",
      },
      { id: "D", text: "由班组长签字确认后放行", effect: { security: 0, production: 0, reputation: -2 } },
    ],
  },
  {
    id: "event_08",
    title: "外包工程师深夜到场",
    focus: "访客管理与物理边界",
    hint: "熟人、急事、旧工牌，是门岗最常见的三重压力。",
    scenario:
      "夜里 11:40，一名熟悉的外包工程师到门岗，说要紧急处理白天没修完的设备故障。他出示了旧工牌照片，也能说出设备编号，但系统里查不到当晚预约记录。产线主管催促尽快放人。",
    check: "control",
    difficulty: 5,
    tags: ["physical", "vendor"],
    review: "控制区入口就是边界。物理放行和网络放行，本质上都是授权问题。",
    options: [
      {
        id: "A",
        text: "联系对应负责人复核身份和工单，完成登记后受控进入",
        best: true,
        success: { security: 1, production: 0, reputation: 0 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "身份和工单复核到位，人员在登记受控下进入，入口没有失守。",
        failureText: "复核耗了些时间，但没让未核实人员直接进入控制区。",
      },
      { id: "B", text: "先放进去，到了设备旁再补手续", effect: { security: -4, production: 0, reputation: 0 } },
      { id: "C", text: "让门岗拍照留底，其他先不管", effect: { security: -2, production: 0, reputation: 0 } },
      { id: "D", text: "让产线主管自行决定是否放行", effect: { security: 0, production: 0, reputation: -2 } },
    ],
  },
  {
    id: "event_09",
    title: "工程站参数改动疑云",
    focus: "工程站基线与参数完整性",
    hint: "未经确认就调回去，往往会把证据和责任一起抹掉。",
    scenario:
      "自动化团队发现某台工程站在夜间有登录记录，并且一组关键设备参数与上周基线不一致。现场暂未出现明显报警，但良率有轻微波动。生产希望先跑完这一班再说。",
    check: "control",
    difficulty: 5,
    tags: ["engineering", "network"],
    review: "参数异常不是设备细节，而是经营风险。真正要管理的是基线、授权和证据。",
    options: [
      { id: "A", text: "先记录下来，等停机保养时再比对", effect: { security: -2, production: 0, reputation: 0 } },
      { id: "B", text: "只要设备没报警，就继续观察", effect: { security: -4, production: 0, reputation: 0 } },
      {
        id: "C",
        text: "立即核验参数来源，限制工程站变更，并评估是否短停相关设备",
        best: true,
        success: { security: 1, production: -2, reputation: 0 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "先守住参数基线、再谈恢复速度，处置顺序稳妥。",
        failureText: "核验影响了产线节奏，但避免了参数不透明地继续漂移。",
      },
      { id: "D", text: "让现场把参数调回经验值再继续生产", effect: { security: -4, production: 0, reputation: -2 } },
    ],
  },
  {
    id: "event_10",
    title: "是否切换手动生产",
    focus: "降级运行边界",
    hint: "降级运行不是全开或全关，而是有没有预案和补偿控制。",
    scenario:
      "MES 与排产系统响应异常，但产线设备本身还能运行。生产团队提出临时切到手工记录和人工下发工单，先保住产出。IT/OT 团队担心这样会让后续追溯和恢复更复杂。",
    check: "recovery",
    difficulty: 4,
    tags: ["manual", "shutdown"],
    review: "降级运行可以是正确答案，但前提是边界清楚、记录补偿到位、授权明确。",
    options: [
      { id: "A", text: "全面切手工模式，先保证不停线", effect: { security: 0, production: 1, reputation: -2 } },
      { id: "B", text: "不允许任何降级，全部等待系统恢复", effect: { security: 0, production: -4, reputation: 0 } },
      {
        id: "C",
        text: "只在有预案和追溯措施的产线短时降级运行",
        best: true,
        success: { security: 0, production: 1, reputation: 0 },
        failure: { security: 0, production: 0, reputation: 0 },
        successText: "降级运行控制在有预案、有追溯的范围内，保住产出的同时守住了边界。",
        failureText: "手工模式启动了，但现场补偿记录执行得不够整齐。",
      },
      { id: "D", text: "各车间自行决定是否切换", effect: { security: 0, production: 0, reputation: -2 } },
    ],
  },
  {
    id: "event_11",
    title: "备份可用性争议",
    focus: "恢复证据与恢复承诺",
    hint: "有备份是一句话，可恢复是一套证据。",
    scenario:
      "IT 团队表示核心业务系统有备份，但恢复演练记录是 8 个月前的。与此同时，产线调度急需知道，如果现在扩大隔离，系统多久能恢复。管理层必须立即决定是否接受恢复时间风险。",
    check: "control",
    difficulty: 5,
    tags: ["backup", "escalation"],
    review: "真正该管理的不是有没有备份，而是有没有证据证明恢复真的可行。",
    options: [
      { id: "A", text: "默认备份可用，先按最乐观恢复时间规划", effect: { security: -2, production: 0, reputation: -2 } },
      {
        id: "B",
        text: "先确认最近一次成功恢复证据，再决定隔离范围和恢复承诺",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "先核实了最近一次成功恢复的证据，恢复承诺才有了依据。",
        failureText: "验证拖慢了节奏，但避免了把乐观假设写进时间表。",
      },
      { id: "C", text: "等技术团队完全验证后再做任何决定", effect: { security: 0, production: -2, reputation: 0 } },
      { id: "D", text: "先对外承诺 2 小时恢复，给团队压力", effect: { security: 0, production: 0, reputation: -4 } },
    ],
  },
  {
    id: "event_12",
    title: "厂内通告怎么发",
    focus: "内部口径与秩序稳定",
    hint: "通知的目标不是解释全部事实，而是统一口径和动作。",
    scenario:
      "事件处置进入第 2 小时，厂内已经出现各种猜测：有人说是黑客入侵，有人说只是普通系统故障，还有人开始在工作群转发未经证实的截图。行政部门询问是否立刻发全厂通知。",
    check: "control",
    difficulty: 5,
    tags: ["communication", "physical"],
    review: "内部沟通要先稳住秩序、明确动作，再逐步扩展信息，不要把信息真空留给流言。",
    options: [
      { id: "A", text: "先不要发，避免造成恐慌", effect: { security: 0, production: 0, reputation: -2 } },
      {
        id: "B",
        text: "简短发布统一说明、当前要求和上报渠道",
        best: true,
        success: { security: 0, production: 0, reputation: 1 },
        failure: { security: 0, production: 0, reputation: 0 },
        successText: "统一通告发布后，厂内口径收拢，谣言扩散明显减弱。",
        failureText: "通告方向对，但执行要求不够具体，现场仍有零散误读。",
      },
      { id: "C", text: "只通知中层，由他们自行向下转达", effect: { security: 0, production: 0, reputation: -2 } },
      { id: "D", text: "先在小范围口头提醒，确认影响后再发正式邮件", effect: { security: 0, production: 0, reputation: -2 } },
    ],
  },
  {
    id: "event_13",
    title: "临时高权限审批",
    focus: "紧急授权与最小权限",
    hint: "紧急不等于无边界，临时高权限也要写清时长、范围和回收责任。",
    scenario:
      "夜班维修团队提出，需要立即为一名自动化工程师开通域管理员和工程站本地管理员权限，否则无法检查一台频繁掉线的关键 HMI。当前没有书面审批单，只有电话确认。",
    check: "control",
    difficulty: 5,
    tags: ["account", "approval", "engineering"],
    review: "管理层应要求紧急权限具备明确范围、时限、审批人与回收动作。把临时授权当作口头默契，往往会变成长期风险。",
    options: [
      {
        id: "A",
        text: "批准最小范围的临时高权限，设置失效时间并指定复核人",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "临时高权限设了失效时间和复核人，既支持了排障，也没留下长期后门。",
        failureText: "审批链跑通了，但执行比预期稍慢，夜班排障窗口被压缩。",
      },
      { id: "B", text: "先给全量权限，问题解决后再说", effect: { security: -4, production: 0, reputation: 0 } },
      { id: "C", text: "坚持等白天正式流程，不做任何例外", effect: { security: 0, production: -4, reputation: 0 } },
      { id: "D", text: "由现场主管口头担保，账号共享给班组使用", effect: { security: -4, production: 0, reputation: -2 } },
    ],
  },
  {
    id: "event_14",
    title: "季度访问复核",
    focus: "账号复核与职责变化",
    hint: "访问复核不是签字动作，而是确认谁现在还真需要这些权限。",
    scenario:
      "季度访问复核开始后，IT/OT 团队发现两名已转岗员工仍保留 MES 管理权限，其中一人还在工厂内部其他岗位继续工作。HR 认为下周统一处理也可以，不必现在打断业务。",
    check: "awareness",
    difficulty: 5,
    tags: ["account", "review", "evidence"],
    review: "访问复核的价值，在于把组织变化真正反映到账户权限上。拖延看似温和，实则是在容忍已知风险继续存在。",
    options: [
      { id: "A", text: "先做记录，下周复核会上再统一收口", effect: { security: -4, production: 0, reputation: 0 } },
      {
        id: "B",
        text: "立即核对岗位需要，收回不必要权限并留痕",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: 0, reputation: 0 },
        successText: "转岗和离职权限被及时收回并留痕，内部已知敞口随之收窄。",
        failureText: "方向正确，但跨部门确认耗掉了一些时间，短时推进略显吃力。",
      },
      { id: "C", text: "只停用离职人员权限，转岗员工保留原权限", effect: { security: -2, production: 0, reputation: 0 } },
      { id: "D", text: "让各部门负责人邮件回复即可，不做系统核对", effect: { security: -2, production: 0, reputation: -2 } },
    ],
  },
  {
    id: "event_15",
    title: "紧急管理员账号借用",
    focus: "共享账号与应急纪律",
    hint: "能救火的账号，不应该因此失去可追溯性。",
    scenario:
      "一台历史老旧的 SCADA 服务器只有一个共用管理员账号，密码保存在值班记录本里。凌晨异常处理中，多名工程师都想直接借用它进入系统，以便尽快排查。",
    check: "control",
    difficulty: 5,
    tags: ["account", "review", "remote"],
    review: "应急账号如果继续被多人共用，就很难再讲清谁在何时做了什么。管理层需要要求单人领取、操作留痕和事后复核。",
    options: [
      { id: "A", text: "谁先需要谁先用，事后口头说明即可", effect: { security: -4, production: 0, reputation: -2 } },
      { id: "B", text: "把密码发到工作群，方便多人同步排障", effect: { security: -6, production: 0, reputation: -2 } },
      {
        id: "C",
        text: "指定单一责任人领取账号，旁站记录操作并事后改密",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "账号单人领取、操作留痕、事后改密，应急效率和可追溯性都保住了。",
        failureText: "流程稍显笨重，但没让高权限在多人之间无序流转。",
      },
      { id: "D", text: "暂时封存该账号，任何人都不能碰", effect: { security: 0, production: -4, reputation: 0 } },
    ],
  },
  {
    id: "event_16",
    title: "防火墙白名单例外",
    focus: "网络例外审批",
    hint: "白名单例外最怕从临时通行，变成永久习惯。",
    scenario:
      "一个新上线的设备数据采集项目遇到通信阻塞，项目经理要求立即放开一组跨网段端口，否则当周的试运行汇报会失败。当前变更单未完成安全评估，只标注了“先通再补”。",
    check: "control",
    difficulty: 5,
    tags: ["network", "approval", "change"],
    review: "管理层不是要卡住业务，而是要求例外建立在边界、期限和回退方案之上。没有评估的放行，很容易成为长期漏洞。",
    options: [
      { id: "A", text: "为了试运行进度，先全部放通端口", effect: { security: -4, production: 1, reputation: 0 } },
      {
        id: "B",
        text: "限定源目地址与时段，补齐评估后再决定是否保留",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "端口按源目地址和时段受限开放，例外被压缩成受控窗口。",
        failureText: "审批与实施花了点时间，但没把试运行建立在长期放通上。",
      },
      { id: "C", text: "完全拒绝任何例外，项目延期自行承担", effect: { security: 0, production: -2, reputation: -2 } },
      { id: "D", text: "让项目组自行和网络工程师私下处理", effect: { security: -4, production: 0, reputation: -2 } },
    ],
  },
  {
    id: "event_17",
    title: "远程访问双人审批",
    focus: "高风险远程接入管控",
    hint: "关键远程访问最好不是一个人点头就能进。",
    scenario:
      "供应商请求在周末维护窗口远程进入一台包装线工程站，进行控制逻辑检查。当前制度要求业务负责人和 IT/OT 双人审批，但生产经理认为这只是例行维护，建议省去一层确认。",
    check: "awareness",
    difficulty: 5,
    tags: ["remote", "approval", "vendor"],
    review: "双人审批的意义在于把业务必要性和技术风险同时纳入判断。为了省时间绕过其中一侧，往往会让责任链断开。",
    options: [
      {
        id: "A",
        text: "按双人审批执行，限定访问时间并保留会话审计",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "双人审批到位，远程维护限时并留存会话审计，风险和业务两头都兼顾了。",
        failureText: "周末窗口被压缩了一些，但访问控制和责任界面仍然清晰。",
      },
      { id: "B", text: "由生产经理单独批准，避免耽误维护", effect: { security: -4, production: 0, reputation: 0 } },
      { id: "C", text: "供应商先连上，审批邮件后补", effect: { security: -4, production: 0, reputation: -2 } },
      { id: "D", text: "维护全部取消，改到下个月再说", effect: { security: 0, production: -4, reputation: 0 } },
    ],
  },
  {
    id: "event_18",
    title: "USB 例外申请",
    focus: "介质例外与补偿控制",
    hint: "不能一概放，也不能一概堵，关键是补偿控制是否到位。",
    scenario:
      "设备厂家带来一个 U 盘，声称其中包含一份必须当天导入的驱动补丁，否则新的视觉检测设备无法完成调试。现场禁止移动介质接入控制区电脑，但项目进度已经落后。",
    check: "control",
    difficulty: 5,
    tags: ["physical", "approval", "engineering"],
    review: "对移动介质的管理重点不是简单说能不能插，而是是否经过扫描、隔离、专机转运和审批留痕。",
    options: [
      { id: "A", text: "让工程师直接插入，先把调试跑通", effect: { security: -6, production: 1, reputation: 0 } },
      { id: "B", text: "一律拒绝，今天项目停止", effect: { security: 0, production: -4, reputation: 0 } },
      {
        id: "C",
        text: "走例外审批，在隔离设备检查后由指定专机导入",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "U 盘经隔离设备检查后由专机导入，移动介质的风险被挡在控制区外。",
        failureText: "调试被稍稍拖慢，但没让未知介质直接碰到控制系统。",
      },
      { id: "D", text: "把文件先转到个人电脑，再发给现场工程师", effect: { security: -4, production: 0, reputation: -2 } },
    ],
  },
  {
    id: "event_19",
    title: "PLC 逻辑变更评审",
    focus: "控制逻辑变更与同侪复核",
    hint: "在异常期间改逻辑，更需要第二双眼睛。",
    scenario:
      "自动化负责人提出，为了绕开当前故障点，可以临时修改一段 PLC 逻辑，让关键设备跳过一个联锁校验。这样能保住今日产出，但目前还没有完成同侪评审和回退方案确认。",
    check: "control",
    difficulty: 4,
    tags: ["engineering", "review", "change"],
    review: "控制逻辑的临时改动如果缺少复核和回退，就可能把‘应急修复’变成新的长期隐患。管理层需要守住评审门槛。",
    options: [
      { id: "A", text: "先改再说，恢复产量最重要", effect: { security: -4, production: 1, reputation: -2 } },
      {
        id: "B",
        text: "要求完成同侪复核、回退点确认后再决定是否上线",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "PLC 变更走了同侪复核和回退确认，控制逻辑没有绕过评审直接上线。",
        failureText: "评审拖慢了上线节奏，但避免了把未知逻辑直接推入生产。",
      },
      { id: "C", text: "让原开发工程师自行签字，不再找第二人确认", effect: { security: -2, production: 0, reputation: -2 } },
      { id: "D", text: "完全禁止变更，今天设备停着等厂商", effect: { security: 0, production: -4, reputation: 0 } },
    ],
  },
  {
    id: "event_20",
    title: "变更窗口撞上交付高峰",
    focus: "维护审批与经营冲突",
    hint: "推迟变更不是中性动作，它只是把风险推到后面。",
    scenario:
      "OT 团队建议在今晚维护窗口对边界防护设备打补丁，以修复刚披露的高危漏洞。但今晚也是月末冲量时段，生产部门希望把窗口整体后移一周，以免影响出货。",
    check: "recovery",
    difficulty: 3,
    tags: ["change", "approval", "shutdown"],
    review: "管理层要做的是显性化风险权衡，而不是默认把安全维护让位给交付。若决定延期，也必须明确替代控制。",
    options: [
      { id: "A", text: "全部延期一周，先冲完月末指标", effect: { security: -4, production: 1, reputation: 0 } },
      {
        id: "B",
        text: "缩小维护范围，优先修补高风险点并安排业务缓冲",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "维护范围收窄、优先修补高危漏洞，补丁和交付没有被迫二选一。",
        failureText: "维护窗口执行得有些紧张，但关键暴露面得到了处理。",
      },
      { id: "C", text: "取消维护，由技术团队加强观察即可", effect: { security: -2, production: 0, reputation: 0 } },
      { id: "D", text: "全厂停机补丁，一次把所有问题处理完", effect: { security: 1, production: -6, reputation: 0 } },
    ],
  },
  {
    id: "event_21",
    title: "供应商临时账号到期",
    focus: "账号回收与例外延长",
    hint: "临时账号最容易因为‘再用一天’而变成长驻账号。",
    scenario:
      "一名驻厂供应商的远程维护账号将在今晚 24:00 到期，但其负责的设备仍有未完成问题。供应商请求直接顺延 30 天，理由是下周还可能反复调试，不想频繁走审批。",
    check: "awareness",
    difficulty: 4,
    tags: ["vendor", "account", "approval"],
    review: "账号延期不应因为沟通成本而变成长期默认。管理层要问的是：是否真有持续必要、期限多长、谁来复核和回收。",
    options: [
      {
        id: "A",
        text: "按剩余工作申请短期延期，明确结束条件并重新审批",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "账号按剩余工作短期延期并重新审批，没有变成默认长期续租。",
        failureText: "沟通多花了一些功夫，但账号没有在惯性中失控延长。",
      },
      { id: "B", text: "一次性顺延 30 天，省得反复审批", effect: { security: -4, production: 0, reputation: 0 } },
      { id: "C", text: "立即停用账号，任何例外都不接受", effect: { security: 0, production: -4, reputation: 0 } },
      { id: "D", text: "让供应商借用现场员工账号继续维护", effect: { security: -6, production: 0, reputation: -2 } },
    ],
  },
  {
    id: "event_22",
    title: "沉睡管理员账号",
    focus: "历史遗留权限清理",
    hint: "最危险的账号之一，就是大家都忘了它还在。",
    scenario:
      "内审抽查时发现，一个属于早年项目实施阶段的本地管理员账号 9 个月未使用，却仍存在于多台工程站上。没有人能立刻确认停用它是否会影响某些老脚本和定时任务。",
    check: "awareness",
    difficulty: 4,
    tags: ["account", "review", "engineering"],
    review: "历史遗留高权限账号是工厂环境里的典型灰区。管理层需要推动风险验证、影响确认和分阶段下线，而不是无限期保留。",
    options: [
      { id: "A", text: "既然没出过事，就先保持现状", effect: { security: -4, production: 0, reputation: 0 } },
      {
        id: "B",
        text: "制定验证计划，优先在受控范围停用并观察影响",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "遗留高权限进入了验证和分阶段下线的流程，没有继续被搬置。",
        failureText: "验证过程带来一点运维压力，但避免了沉睡高权继续长期存在。",
      },
      { id: "C", text: "立即一次性删除所有相关账号", effect: { security: 1, production: -4, reputation: 0 } },
      { id: "D", text: "只改密码，不处理账号本身", effect: { security: -2, production: 0, reputation: 0 } },
    ],
  },
  {
    id: "event_23",
    title: "恢复演练复盘签字",
    focus: "恢复能力 review 与责任闭环",
    hint: "演练做完不复盘，等于把问题留给真正事故时暴露。",
    scenario:
      "一次针对 MES 的恢复演练刚结束，结果显示数据库恢复时间超出目标 40 分钟，且存在一份关键配置未被纳入备份。业务部门希望先把演练报告签掉，避免影响本季度考核评价。",
    check: "control",
    difficulty: 5,
    tags: ["backup", "review", "evidence"],
    review: "管理层 review 的价值，不在于让报告看起来完整，而在于把发现的问题真正拉入改进闭环。草率签字只是在延迟下一次事故的代价。",
    options: [
      { id: "A", text: "先签字通过，问题以后再排期改", effect: { security: -4, production: 0, reputation: -2 } },
      { id: "B", text: "只要求技术团队内部整改，不上升管理层跟踪", effect: { security: -2, production: 0, reputation: 0 } },
      {
        id: "C",
        text: "带问题签收并明确整改时限、责任人和复测要求",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: 0, reputation: 0 },
        successText: "演练带着问题签收，整改时限、责任人和复测都定了，恢复能力才真正提升。",
        failureText: "整改闭环增加了管理动作，但问题没有被轻轻放过。",
      },
      { id: "D", text: "演练结果太差，直接取消后续复盘会", effect: { security: -2, production: 0, reputation: -2 } },
    ],
  },
  {
    id: "event_24",
    title: "职责分离冲突",
    focus: "审批人与执行人边界",
    hint: "一个人既提需求、又审批、又执行，通常意味着风险没人真正看见。",
    scenario:
      "一名资深自动化经理同时负责提出变更需求、审批该变更，并亲自上线实施。团队解释说人手紧张，只有他最熟悉这套设备，拆分职责只会降低效率。",
    check: "awareness",
    difficulty: 4,
    tags: ["review", "approval", "engineering"],
    review: "职责分离并不是为流程而流程，而是防止高风险动作在没有第二视角的情况下被直接推进。管理层需要在效率与独立复核之间守住底线。",
    options: [
      { id: "A", text: "认可现状，资深人员自己把关就行", effect: { security: -4, production: 0, reputation: 0 } },
      {
        id: "B",
        text: "保留其技术主导，但要求引入独立审批或旁站复核",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "保留了专家的技术主导，同时引入独立审批，关键动作有了第二层监督。",
        failureText: "组织安排上多了一步协调，但职责边界开始变得清晰。",
      },
      { id: "C", text: "今后所有类似工作全部暂停，等扩编后再做", effect: { security: 0, production: -4, reputation: 0 } },
      { id: "D", text: "只要求事后补写审批记录，不改变执行方式", effect: { security: -2, production: 0, reputation: -2 } },
    ],
  },
  {
    id: "event_25",
    title: "日报截图 review",
    focus: "证据质量与管理误判",
    hint: "review 不是看谁说得更像真的，而是看证据能不能支撑结论。",
    scenario:
      "管理例会上，某车间提交了一张 HMI 截图，表示昨晚的异常只是设备波动，不涉及网络或权限问题。但 IT/OT 团队指出，这张截图没有时间戳，也无法证明截图对应的就是异常发生时段。",
    check: "control",
    difficulty: 5,
    tags: ["review", "evidence", "communication"],
    review: "管理 review 不能停留在‘看起来没事’。如果证据不能说明时间、来源和上下文，就不应支撑经营判断。",
    options: [
      { id: "A", text: "接受截图结论，继续推进生产计划", effect: { security: -4, production: 0, reputation: 0 } },
      { id: "B", text: "先别争论，让各部门按各自理解继续处理", effect: { security: -2, production: 0, reputation: -2 } },
      {
        id: "C",
        text: "要求补齐日志、时间线和操作记录后再做结论",
        best: true,
        success: { security: 1, production: 0, reputation: 1 },
        failure: { security: 0, production: -2, reputation: 0 },
        successText: "补齐日志、时间线和操作记录后再下结论，管理判断有了完整证据支撑。",
        failureText: "补证据花了点时间，但避免了把模糊画面当成事实依据。",
      },
      { id: "D", text: "只要求车间负责人再次口头确认", effect: { security: -2, production: 0, reputation: -2 } },
    ],
  },
];

const baseChecks = {
  awareness: { label: "警觉", value: 2 },
  control: { label: "控制", value: 2 },
  recovery: { label: "恢复", value: 1 },
};

const scoreMeta = [
  { key: "security", label: "安全值", className: "bar-security" },
  { key: "production", label: "产能值", className: "bar-production" },
  { key: "reputation", label: "声誉值", className: "bar-reputation" },
];

const eventTagLabels = {
  account: "账号风险",
  network: "网络边界",
  escalation: "事件升级",
  remote: "远程接入",
  vendor: "供应商",
  communication: "沟通口径",
  evidence: "证据留存",
  shutdown: "停线授权",
  engineering: "工程站",
  quality: "质量追溯",
  manual: "降级运行",
  backup: "恢复证据",
  physical: "物理安全",
  approval: "权限审批",
  review: "复核评审",
  change: "变更控制",
};

const eventSceneMeta = {
  event_01: {
    title: "夜班账号与横向移动",
    description: "异常账号已触达 MES 边缘，办公网与生产系统之间出现可疑通道。",
    chips: [
      { tone: "warn", label: "异常登录" },
      { tone: "data", label: "MES 边缘" },
      { tone: "live", label: "夜班仍在运行" },
    ],
  },
  event_02: {
    title: "供应商远程入口",
    description: "外部维护通道请求进入控制系统，当前入口长期开放且缺少复核。",
    chips: [
      { tone: "warn", label: "远程接入" },
      { tone: "data", label: "审计缺口" },
      { tone: "live", label: "良率压力" },
    ],
  },
  event_03: {
    title: "勒索阴影蔓延",
    description: "文件系统被黑雾包围，办公网异常正在逼近生产协同链路。",
    chips: [
      { tone: "warn", label: "文件加密" },
      { tone: "data", label: "横向扩散" },
      { tone: "live", label: "产线暂稳" },
    ],
  },
  event_04: {
    title: "攻击者逼近工程站",
    description: "一名入侵者正对着产线旁的 HMI 操作，输送带仍在运行，停不停线成为最艰难的抉择。",
    chips: [
      { tone: "warn", label: "HMI 接触风险" },
      { tone: "live", label: "产线仍运作" },
      { tone: "data", label: "PLC 尚未确认" },
    ],
  },
  event_05: {
    title: "客户信任窗口",
    description: "外部客户已经察觉异常，等待一个既不失真也不失控的统一回应。",
    chips: [
      { tone: "warn", label: "客户问询" },
      { tone: "data", label: "影响待核实" },
      { tone: "live", label: "口径待统一" },
    ],
  },
  event_06: {
    title: "高层战情汇报",
    description: "多条信息流同时汇入战情台，管理层必须快速拼出可汇报的事实图景。",
    chips: [
      { tone: "warn", label: "30 分钟汇报" },
      { tone: "data", label: "信息不完整" },
      { tone: "live", label: "多部门并发" },
    ],
  },
  event_07: {
    title: "异常批次待定",
    description: "产品已经下线，但记录不完整，质量放行口前堆起了现实压力。",
    chips: [
      { tone: "warn", label: "记录缺失" },
      { tone: "data", label: "追溯断点" },
      { tone: "live", label: "仓库催单" },
    ],
  },
  event_08: {
    title: "深夜门岗放行",
    description: "外包工程师出现在控制区门口，门岗与产线同时承受放行压力。",
    chips: [
      { tone: "warn", label: "预约缺失" },
      { tone: "data", label: "旧工牌照片" },
      { tone: "live", label: "设备待修" },
    ],
  },
  event_09: {
    title: "参数偏移疑云",
    description: "工程站参数与基线不一致，HMI 没有报警，但良率正在轻微下滑。",
    chips: [
      { tone: "warn", label: "参数偏移" },
      { tone: "data", label: "基线不符" },
      { tone: "live", label: "良率波动" },
    ],
  },
  event_10: {
    title: "手动降级运行",
    description: "数字调度失灵，但设备还能跑，现场在手工模式与等待恢复之间犹豫。",
    chips: [
      { tone: "warn", label: "系统响应异常" },
      { tone: "data", label: "手工记录" },
      { tone: "live", label: "设备仍可运行" },
    ],
  },
  event_11: {
    title: "恢复承诺的真相",
    description: "备份磁带和恢复时钟同时摆在桌上，真正缺的是近期演练的证据。",
    chips: [
      { tone: "warn", label: "演练过期" },
      { tone: "data", label: "恢复待验证" },
      { tone: "live", label: "隔离待决" },
    ],
  },
  event_12: {
    title: "厂内口径争夺",
    description: "消息在工作群里扩散，正式通告还没发，现场秩序正被猜测拉扯。",
    chips: [
      { tone: "warn", label: "谣言扩散" },
      { tone: "data", label: "截图转发" },
      { tone: "live", label: "通知待发" },
    ],
  },
  event_13: {
    title: "临时高权限窗口",
    description: "深夜排障急需高权限，审批、范围和回收动作必须在几分钟内讲清楚。",
    chips: [
      { tone: "warn", label: "高权限申请" },
      { tone: "data", label: "失效时间待定" },
      { tone: "live", label: "HMI 故障处理中" },
    ],
  },
  event_14: {
    title: "访问复核清单",
    description: "转岗人员仍握有 MES 管理权限，组织变化还没有反映到账户边界里。",
    chips: [
      { tone: "warn", label: "转岗未收权" },
      { tone: "data", label: "季度 review" },
      { tone: "live", label: "HR 等待协调" },
    ],
  },
  event_15: {
    title: "共享管理员风险",
    description: "历史遗留共用管理员账号被多人盯上，应急速度与可追溯性正面冲突。",
    chips: [
      { tone: "warn", label: "共享高权" },
      { tone: "data", label: "密码在记录本" },
      { tone: "live", label: "多人待排障" },
    ],
  },
  event_16: {
    title: "白名单例外单",
    description: "试运行压力下，跨网段放通请求被推到管理层面前，边界要不要临时拆开。",
    chips: [
      { tone: "warn", label: "端口放通" },
      { tone: "data", label: "评估未完成" },
      { tone: "live", label: "试运行临近" },
    ],
  },
  event_17: {
    title: "远程接入双签",
    description: "供应商想在维护窗口直连工程站，制度要求的双人审批正面临简化压力。",
    chips: [
      { tone: "warn", label: "周末远程" },
      { tone: "data", label: "双签要求" },
      { tone: "live", label: "维护窗口有限" },
    ],
  },
  event_18: {
    title: "U 盘例外闸口",
    description: "移动介质带着补丁来到控制区门口，项目进度正逼着团队做选择。",
    chips: [
      { tone: "warn", label: "移动介质" },
      { tone: "data", label: "补丁待导入" },
      { tone: "live", label: "调试落后" },
    ],
  },
  event_19: {
    title: "PLC 变更复核",
    description: "跳过联锁的临时逻辑即将上线，第二双眼睛和回退计划是否存在成为关键。",
    chips: [
      { tone: "warn", label: "联锁绕过" },
      { tone: "data", label: "同侪复核缺失" },
      { tone: "live", label: "产量承压" },
    ],
  },
  event_20: {
    title: "维护窗口争夺",
    description: "高危补丁与月末交付撞在同一夜，管理层必须明确风险优先级。",
    chips: [
      { tone: "warn", label: "高危漏洞" },
      { tone: "data", label: "补丁待打" },
      { tone: "live", label: "月末冲量" },
    ],
  },
  event_21: {
    title: "临时账号续期",
    description: "供应商维护账号即将到期，‘再延 30 天’看似方便，却可能把临时变常态。",
    chips: [
      { tone: "warn", label: "账号续期" },
      { tone: "data", label: "结束条件不清" },
      { tone: "live", label: "设备仍待调试" },
    ],
  },
  event_22: {
    title: "沉睡高权限",
    description: "多年无人触碰的管理员账号仍躺在工程站上，没人敢马上拍板下线。",
    chips: [
      { tone: "warn", label: "遗留高权" },
      { tone: "data", label: "9 个月未用" },
      { tone: "live", label: "影响待验证" },
    ],
  },
  event_23: {
    title: "恢复演练签收",
    description: "演练暴露出恢复时间超标和备份缺口，签字动作不能掩盖问题本身。",
    chips: [
      { tone: "warn", label: "恢复超时" },
      { tone: "data", label: "配置漏备份" },
      { tone: "live", label: "季度考核压力" },
    ],
  },
  event_24: {
    title: "职责分离边界",
    description: "同一位专家同时提需求、批变更、做上线，效率很高，但第二视角正在消失。",
    chips: [
      { tone: "warn", label: "单人闭环" },
      { tone: "data", label: "独立审批缺失" },
      { tone: "live", label: "人手紧张" },
    ],
  },
  event_25: {
    title: "截图能否定案",
    description: "一张没有时间戳的 HMI 截图被拿来支撑结论，review 现场需要证据纪律。",
    chips: [
      { tone: "warn", label: "截图证据弱" },
      { tone: "data", label: "日志待补" },
      { tone: "live", label: "例会待结论" },
    ],
  },
};

const state = {
  screen: "intro",
  selectedRoles: [],
  currentRound: 0,
  deck: [],
  score: { security: 8, production: 8, reputation: 8 },
  result: null,
  log: [],
  timer: { total: 180, remaining: 180, active: false, intervalId: null, penalized: false },
};

// 超时惩罚：讨论超时未决策时，攻击者利用窗口期造成的指标损失
const TIMEOUT_PENALTY = { security: -6, production: -4, reputation: -4 };

const app = document.getElementById("app");
const phaseLabel = document.getElementById("phaseLabel");

function pixelIcon(name, size = "normal") {
  const className = size === "large" ? "pixel-icon large" : "pixel-icon";
  const common = 'viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true"';
  const palette = {
    gold: "#F0D18B",
    amber: "#D79F45",
    teal: "#72D4C1",
    tealDark: "#3F7E79",
    steel: "#7EAFC7",
    slate: "#31505C",
    red: "#E47B6A",
    deep: "#15262D",
  };

  const icons = {
    security: `
      <path fill="${palette.gold}" d="M5 1h6v2h2v5c0 3-2 5-5 7-3-2-5-4-5-7V3h2z"/>
      <path fill="${palette.deep}" d="M7 4h2v6H7zm0 6h2v2H7z"/>
    `,
    production: `
      <path fill="${palette.steel}" d="M2 7h3V5h2V3h2v2h2v2h3v2h-1v3h-2V9H5v3H3V9H2z"/>
      <path fill="${palette.deep}" d="M6 1h4v2H6zM1 7h2v2H1zm12 0h2v2h-2z"/>
    `,
    reputation: `
      <path fill="${palette.gold}" d="M8 1l2 4 5 .5-3.5 3 1 4.5L8 11l-4.5 2 1-4.5L1 5.5 6 5z"/>
      <path fill="${palette.amber}" d="M8 3l1 2 3 .5-2 1.5.5 2.5L8 8.5 5.5 10l.5-2.5-2-1.5 3-.5z"/>
    `,
    awareness: `
      <path fill="${palette.gold}" d="M8 2C4 2 1 7 1 8s3 6 7 6 7-5 7-6-3-6-7-6z"/>
      <path fill="${palette.deep}" d="M6 8a2 2 0 104 0 2 2 0 00-4 0z"/>
      <path fill="${palette.teal}" d="M7 8a1 1 0 102 0 1 1 0 00-2 0z"/>
    `,
    control: `
      <path fill="${palette.teal}" d="M2 4h12v3H2zm0 5h12v3H2z"/>
      <path fill="${palette.deep}" d="M4 5h3v1H4zm0 5h3v1H4zm5-5h3v1H9zm1 5h2v1h-2z"/>
    `,
    recovery: `
      <path fill="${palette.steel}" d="M8 2a6 6 0 016 6h-2l3 3 3-3h-2A8 8 0 108 16v-2a6 6 0 010-12z" transform="translate(-2 0)"/>
      <path fill="${palette.gold}" d="M7 5h2v3h2v2H7z"/>
    `,
    gm: `
      <path fill="${palette.gold}" d="M3 5h10v2H3zM4 3h2v2H4zm6 0h2v2h-2zM2 7h12v2H2zM5 9h6v4H5z"/>
    `,
    productionRole: `
      <path fill="${palette.steel}" d="M2 8h12v4H2zM4 4h8v4H4z"/>
      <path fill="${palette.deep}" d="M5 5h2v2H5zm4 0h2v2H9zM7 8h2v4H7z"/>
    `,
    itot: `
      <path fill="${palette.teal}" d="M3 3h10v8H3z"/>
      <path fill="${palette.deep}" d="M5 5h2v2H5zm4 0h2v2H9zM6 11h4v2H6z"/>
      <path fill="${palette.gold}" d="M6 13h4v1H6z"/>
    `,
    automation: `
      <path fill="${palette.steel}" d="M6 1h4v3H6zM3 5h10v6H3zM6 12h4v3H6z"/>
      <path fill="${palette.deep}" d="M1 7h2v2H1zm12 0h2v2h-2zM7 6h2v4H7z"/>
    `,
    quality: `
      <path fill="${palette.gold}" d="M8 1l5 3v4c0 3-2 5-5 7-3-2-5-4-5-7V4z"/>
      <path fill="${palette.deep}" d="M5 8h2v2H5zm2 2h2v2H7zm2-2h2v2H9z"/>
    `,
    compliance: `
      <path fill="${palette.gold}" d="M4 2h7l2 2v10H4z"/>
      <path fill="${palette.deep}" d="M6 6h5v1H6zm0 3h5v1H6zm0 3h4v1H6zM10 2v2h2z"/>
    `,
    supply: `
      <path fill="${palette.teal}" d="M2 6h8v6H2zM10 7h2l2 2v3h-4z"/>
      <path fill="${palette.deep}" d="M4 12a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2z"/>
      <path fill="${palette.gold}" d="M4 4h4v2H4z"/>
    `,
    securityRole: `
      <path fill="${palette.red}" d="M7 1h2v4H7zM3 5h10v8H3z"/>
      <path fill="${palette.deep}" d="M5 7h6v1H5zm0 2h6v1H5zm0 2h4v1H5z"/>
    `,
    remote: `
      <path fill="${palette.teal}" d="M2 4h12v6H2z"/>
      <path fill="${palette.deep}" d="M4 6h8v2H4z"/>
      <path fill="${palette.gold}" d="M6 11h4v2H6zM7 13h2v1H7z"/>
    `,
    communication: `
      <path fill="${palette.gold}" d="M2 3h12v8H8l-3 3v-3H2z"/>
      <path fill="${palette.deep}" d="M4 5h8v1H4zm0 2h6v1H4z"/>
    `,
    shutdown: `
      <path fill="${palette.red}" d="M7 1h2v6H7z"/>
      <path fill="${palette.red}" d="M8 4a5 5 0 105 5h-2a3 3 0 11-3-3z"/>
    `,
    manual: `
      <path fill="${palette.gold}" d="M6 2h4v7H6z"/>
      <path fill="${palette.steel}" d="M4 9h8v5H4z"/>
      <path fill="${palette.deep}" d="M7 4h2v3H7zM6 10h1v3H6zm3 0h1v3H9z"/>
    `,
    backup: `
      <path fill="${palette.steel}" d="M3 3h10v10H3z"/>
      <path fill="${palette.gold}" d="M5 5h6v2H5zm0 3h6v3H5z"/>
      <path fill="${palette.deep}" d="M6 9h1v1H6zm3 0h1v1H9z"/>
    `,
    qualityTag: `
      <path fill="${palette.gold}" d="M3 8l3-5h7v10H6z"/>
      <path fill="${palette.deep}" d="M7 6h4v1H7zm0 2h3v1H7z"/>
    `,
    physical: `
      <path fill="${palette.red}" d="M2 4h12v9H2z"/>
      <path fill="${palette.gold}" d="M4 6h5v5H4zM10 7h2v1h-2zm0 2h2v1h-2z"/>
    `,
    engineering: `
      <path fill="${palette.steel}" d="M6 1h4v3H6zm-3 4h10v6H3zm3 7h4v3H6z"/>
      <path fill="${palette.gold}" d="M1 7h2v2H1zm12 0h2v2h-2z"/>
    `,
    vendor: `
      <path fill="${palette.teal}" d="M2 5h12v7H2z"/>
      <path fill="${palette.gold}" d="M4 3h8v2H4z"/>
      <path fill="${palette.deep}" d="M4 7h8v1H4zm0 2h5v1H4z"/>
    `,
    default: `
      <path fill="${palette.gold}" d="M3 3h10v10H3z"/>
      <path fill="${palette.deep}" d="M5 5h6v1H5zm0 3h6v1H5zm0 3h4v1H5z"/>
    `,
  };

  return `<svg class="${className}" ${common}>${icons[name] || icons.default}</svg>`;
}

function roleIcon(roleId) {
  const map = {
    gm: "gm",
    production: "productionRole",
    itot: "itot",
    automation: "automation",
    quality: "quality",
    compliance: "compliance",
    supply: "supply",
    security: "securityRole",
  };
  return pixelIcon(map[roleId] || "default");
}

function tagIcon(tag) {
  const map = {
    account: "awareness",
    network: "control",
    escalation: "communication",
    remote: "remote",
    vendor: "vendor",
    communication: "communication",
    evidence: "compliance",
    shutdown: "shutdown",
    engineering: "engineering",
    quality: "qualityTag",
    manual: "manual",
    backup: "backup",
    physical: "physical",
    approval: "compliance",
    review: "qualityTag",
    change: "engineering",
  };
  return pixelIcon(map[tag] || "default", "large");
}

function inlineTagIcon(tag) {
  const map = {
    account: "awareness",
    network: "control",
    escalation: "communication",
    remote: "remote",
    vendor: "vendor",
    communication: "communication",
    evidence: "compliance",
    shutdown: "shutdown",
    engineering: "engineering",
    quality: "qualityTag",
    manual: "manual",
    backup: "backup",
    physical: "physical",
    approval: "compliance",
    review: "qualityTag",
    change: "engineering",
  };
  return pixelIcon(map[tag] || "default");
}

function renderEventSummary(event) {
  const meta = eventSceneMeta[event.id] || {
    title: "场景摘要",
    description: "这张事件卡要求管理层先判断边界、证据与经营压力，再决定动作。",
    chips: [
      { tone: "warn", label: "待判断" },
      { tone: "data", label: "场景信息" },
      { tone: "live", label: "业务持续" },
    ],
  };

  return `
    <div class="event-summary-card">
      <div class="event-summary-head">
        <div class="event-summary-icon">${pixelIcon(event.check, "large")}</div>
        <div>
          <p class="eyebrow">场景摘要</p>
          <strong>${meta.title}</strong>
        </div>
      </div>
      <p class="event-summary-copy">${meta.description}</p>
      <div class="summary-chips">
        ${meta.chips.map((chip) => `<span class="summary-chip ${chip.tone}"><i></i><span>${chip.label}</span></span>`).join("")}
      </div>
    </div>
  `;
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function render() {
  clearTimerIfHidden();
  if (state.screen !== "event") hideCyberAlert();
  phaseLabel.textContent = phaseText();
  app.innerHTML = "";

  const template = document.getElementById(`screen-${state.screen}`);
  app.appendChild(template.content.cloneNode(true));

  if (state.screen === "roles") renderRoles();
  if (state.screen === "event") renderEvent();
  if (state.screen === "result") renderResult();
  if (state.screen === "final") renderFinal();
}

function phaseText() {
  switch (state.screen) {
    case "briefing":
      return "背景导入";
    case "roles":
      return "角色配置";
    case "event":
      return `第 ${state.currentRound + 1} 回合`;
    case "result":
      return "事件结算";
    case "final":
      return "最终复盘";
    default:
      return "准备阶段";
  }
}

function renderRoles() {
  const grid = document.getElementById("roleGrid");
  roles.forEach((role) => {
    const selected = state.selectedRoles.includes(role.id);
    const card = document.createElement("article");
    card.className = `role-card ${selected ? "selected" : ""}`;
    card.dataset.role = role.id;
    card.innerHTML = `
      <div class="role-head">
        <div>
          <p class="eyebrow accent">管理视角</p>
          <h3>${role.name}</h3>
        </div>
        ${roleIcon(role.id)}
      </div>
      <p>${role.focus}</p>
      <div class="role-meta">
        <span class="role-tag">加成检定：${baseChecks[role.bonusCheck].label}</span>
        <span class="role-tag">盲点：${role.risk}</span>
      </div>
      <p>关注：${role.concerns.join(" / ")}</p>
      <button class="${selected ? "ghost" : "primary"}" data-action="toggle-role" data-role-id="${role.id}">
        ${selected ? "取消选择" : "选择此视角"}
      </button>
    `;
    grid.appendChild(card);
  });

  updateRoleSelection();
}

function updateRoleSelection() {
  const hint = document.getElementById("roleSelectionHint");
  const startButton = document.getElementById("startGameButton");
  hint.textContent = `已选择 ${state.selectedRoles.length} / 4`;
  startButton.disabled = state.selectedRoles.length !== 4;
}

function renderEvent() {
  const event = state.deck[state.currentRound];
  document.getElementById("roundTitle").textContent = `第 ${state.currentRound + 1} / ${state.deck.length} 回合`;
  document.getElementById("eventFocus").textContent = event.focus;
  document.getElementById("eventTitle").innerHTML = `<span class="event-title-wrap">${tagIcon(event.tags[0])}<span>${event.title}</span></span>`;
  document.getElementById("eventSummary").innerHTML = renderEventSummary(event);
  document.getElementById("eventTags").innerHTML = event.tags
    .map((tag) => `<span class="event-tag">${inlineTagIcon(tag)}<span>${eventTagLabels[tag] || tag}</span></span>`)
    .join("");
  document.getElementById("eventScenario").textContent = event.scenario;
  document.getElementById("eventHint").textContent = event.hint;
  document.getElementById("checkBadge").textContent = `${baseChecks[event.check].label}检定 · 门槛 ${event.difficulty}`;
  document.getElementById("scoreStack").innerHTML = buildScoreRows(state.score);
  document.getElementById("selectedRolesMini").innerHTML = state.selectedRoles
    .map((roleId) => {
      const role = roles.find((item) => item.id === roleId);
      return `<span class="role-tag">${role.name}</span>`;
    })
    .join("");

  const optionList = document.getElementById("optionList");
  event.options.forEach((option) => {
    const card = document.createElement("article");
    card.className = "option-card";
    card.innerHTML = `
      <h3>${option.id}. ${option.text}</h3>
      <div class="option-footer">
        <div class="option-meta">
          ${option.best ? "将触发组织检定" : "将直接结算后果"}
        </div>
        <button class="primary" data-action="choose-option" data-option-id="${option.id}">执行此决策</button>
      </div>
    `;
    optionList.appendChild(card);
  });

  syncTimerUI();
  ensureTimerRunning();
}

function renderResult() {
  const { event, option, outcome, total, threshold, bonus, bonusRoles } = state.result;
  const passed = outcome.type === "success";
  const banner = document.getElementById("battleBanner");
  const judgement = calculateRoundJudgement(option);
  document.getElementById("resultTitle").textContent = event.title;
  document.getElementById("resultPill").textContent = passed
    ? "检定成功"
    : outcome.type === "failure"
      ? "检定失败"
      : "直接结算";
  const triggered = outcome.type !== "direct";
  document.getElementById("diceFace").textContent = triggered ? (passed ? "达标" : "未达") : "直判";
  document.getElementById("resultFormula").textContent = triggered
    ? `${baseChecks[event.check].label} ${baseChecks[event.check].value} + 角色加成 ${bonus} = ${total}，门槛 ${threshold}（${total >= threshold ? "达标" : `差 ${threshold - total} 点`}）`
    : "该选项未触发检定，系统直接按后果结算。";
  document.getElementById("resultNarration").textContent = outcome.text;
  document.getElementById("checkMechanism").innerHTML = buildCheckMechanism(state.result);
  document.getElementById("reviewText").textContent = event.review;
  document.getElementById("deltaList").innerHTML = buildDeltaRows(outcome.delta, bonusRoles);
  document.getElementById("reviewJudgement").innerHTML = buildReviewJudgement(judgement);
  banner.className = `battle-banner ${outcome.type}`;
  banner.textContent =
    outcome.type === "success" ? "战报：稳住局面" : outcome.type === "failure" ? "战报：代价上升" : "战报：直接后果";
  document.getElementById("reportSteps").innerHTML = buildReportSteps(event, option, outcome, bonusRoles);
  document.getElementById("nextStepButton").textContent =
    state.currentRound >= state.deck.length - 1 || Object.values(state.score).some((value) => value <= 0)
      ? "进入最终复盘"
      : "进入下一事件";
}

// 明确检定机制：基础能力 + 角色加成 是否达到门槛（确定性，无随机）
function buildCheckMechanism({ event, total, threshold, bonus, outcome }) {
  if (outcome.type === "direct") {
    return `
      <div class="mechanism-rows">
        <div class="mechanism-line total"><span>结算方式</span><strong>直接结算（不触发检定）</strong></div>
      </div>
      <p class="mechanism-note">该选项不是推荐处置动作，系统不进行组织检定，直接按其管理后果扣减指标。这类选择通常代表回避、拖延或越权，复盘时应重点讨论为什么会被它吸引。</p>
    `;
  }

  const passed = outcome.type === "success";
  const gap = threshold - total;
  const rows = `
    <div class="mechanism-line"><span>基础能力（${baseChecks[event.check].label}）</span><strong>${baseChecks[event.check].value}</strong></div>
    <div class="mechanism-line"><span>角色加成（专业匹配）</span><strong>${bonus > 0 ? `+${bonus}` : "0"}</strong></div>
    <div class="mechanism-line total"><span>合计 vs 门槛 ${threshold}</span><strong class="${passed ? "delta-good" : "delta-bad"}">${total} ${passed ? "≥" : "<"} ${threshold}</strong></div>
  `;
  const note = passed
    ? "基础能力加上匹配角色的加成达到了门槛，组织顶住了这次事件，按成功后果结算。"
    : `合计比门槛低 <strong>${gap}</strong> 点，检定失败。原因是队伍中与本事件专业对口的管理视角不足。提升命中率的方式：组建管理小组时，选择 <strong>加成检定维度与本事件一致（+2）</strong> 或 <strong>标签命中（+1）</strong> 的角色，凑够加成即可达到门槛。`;
  return `<div class="mechanism-rows">${rows}</div><p class="mechanism-note ${passed ? "" : "bad"}">${note}</p>`;
}

function renderFinal() {
  const final = calculateFinalOutcome();
  document.getElementById("finalOutcome").textContent = final.title;
  document.getElementById("finalSummary").textContent = final.summary;
  document.getElementById("finalScoreStack").innerHTML = buildScoreRows(state.score);
  document.getElementById("finalTags").innerHTML = final.tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
  document.getElementById("finalLog").innerHTML = state.log
    .map(
      (entry, index) => `
        <div class="log-entry">
          <strong>回合 ${index + 1} · ${entry.title}</strong>
          <p>${entry.choice}</p>
          <p>${entry.outcome}</p>
        </div>
      `,
    )
    .join("");
}

function buildScoreRows(score) {
  return scoreMeta
    .map(({ key, label, className }) => {
      const value = Math.max(0, Math.min(12, score[key]));
      const percentage = (value / 12) * 100;
      const iconName = key === "security" ? "security" : key === "production" ? "production" : "reputation";
      return `
        <div class="score-row">
          ${pixelIcon(iconName)}
          <span>${label}</span>
          <div class="bar ${className}"><span style="width:${percentage}%"></span></div>
          <strong>${value}</strong>
        </div>
      `;
    })
    .join("");
}

function buildDeltaRows(delta, bonusRoles) {
  const rows = scoreMeta.map(({ key, label }) => {
    const value = delta[key];
    const className = value > 0 ? "delta-good" : value < 0 ? "delta-bad" : "delta-neutral";
    const display = value > 0 ? `+${value}` : `${value}`;
    const iconName = key === "security" ? "security" : key === "production" ? "production" : "reputation";
    return `<div class="delta-row"><span class="pixel-inline">${pixelIcon(iconName)}<span>${label}</span></span><strong class="${className}">${display}</strong></div>`;
  });

  if (bonusRoles.length > 0) {
    const label = bonusRoles.map((role) => `${role.name}${role.full ? "(+2)" : "(+1)"}`).join("、");
    rows.push(
      `<div class="delta-row"><span>角色加成来源</span><strong class="delta-good">${label}</strong></div>`,
    );
  }

  return rows.join("");
}

function buildReportSteps(event, option, outcome, bonusRoles) {
  const steps = [
    {
      icon: "communication",
      title: "管理动作",
      text: `你们选择了 ${option.id}：${option.text}`,
    },
    {
      icon: event.check,
      title: "组织判定",
      text:
        outcome.type === "direct"
          ? "这一步没有触发检定，系统按管理后果直接结算。"
          : `系统按 ${baseChecks[event.check].label} 能力完成一次组织检定。`,
    },
    {
      icon: outcome.type === "success" ? "security" : outcome.type === "failure" ? "shutdown" : "production",
      title: "局面变化",
      text: outcome.text,
    },
  ];

  if (bonusRoles.length > 0) {
    const label = bonusRoles.map((role) => `${role.name}${role.full ? "(+2)" : "(+1)"}`).join("、");
    steps.splice(2, 0, {
      icon: "awareness",
      title: "角色协同",
      text: `本回合提供加成的管理视角：${label}`,
    });
  }

  return steps
    .map(
      (step) => `
        <div class="report-step">
          ${pixelIcon(step.icon)}
          <div>
            <strong>${step.title}</strong>
            <span>${step.text}</span>
          </div>
        </div>
      `,
    )
    .join("");
}

function calculateRoundJudgement(option) {
  const values = Object.values(state.score);
  const atDeadline = values.some((value) => value <= 0);
  const nearDeadlineKeys = scoreMeta.filter(({ key }) => state.score[key] <= 2).map(({ label }) => label);

  return {
    preferred: option.best,
    deadline: atDeadline,
    nearDeadlineKeys,
  };
}

function buildReviewJudgement(judgement) {
  const choiceCard = judgement.preferred
    ? {
        tone: "good",
        title: "较优选择",
        text: "是。这一项属于推荐方向，说明管理决策本身站在了正确轨道上。",
      }
    : {
        tone: "bad",
        title: "较优选择",
        text: "否。这一项不是推荐动作，复盘时应重点讨论为什么会被它吸引。",
      };

  let deadlineCard;
  if (judgement.deadline) {
    deadlineCard = {
      tone: "bad",
      title: "死线状态",
      text: "已触碰死线。至少一项核心指标跌到 0，该维度已被击穿，最终复盘将据此定级。",
    };
  } else if (judgement.nearDeadlineKeys.length > 0) {
    deadlineCard = {
      tone: "warn",
      title: "死线状态",
      text: `未触碰死线，但 ${judgement.nearDeadlineKeys.join("、")} 已逼近死线（<= 2）。`,
    };
  } else {
    deadlineCard = {
      tone: "good",
      title: "死线状态",
      text: "未触碰死线，三项核心指标仍处于可控区间。",
    };
  }

  return [choiceCard, deadlineCard]
    .map(
      (card) => `
        <div class="judgement-card ${card.tone}">
          <span>${card.title}</span>
          <strong>${card.text}</strong>
        </div>
      `,
    )
    .join("");
}

function startBriefing() {
  state.screen = "briefing";
  render();
}

function openHelp() {
  state.screen = "help";
  render();
}

function backIntro() {
  state.screen = "intro";
  render();
}

function backBriefing() {
  state.screen = "briefing";
  render();
}

function toRoleSelect() {
  state.screen = "roles";
  render();
}

function toggleRole(roleId) {
  const exists = state.selectedRoles.includes(roleId);
  if (exists) {
    state.selectedRoles = state.selectedRoles.filter((id) => id !== roleId);
  } else if (state.selectedRoles.length < 4) {
    state.selectedRoles = [...state.selectedRoles, roleId];
  }
  render();
}

function autoPickRoles() {
  state.selectedRoles = shuffle(roles).slice(0, 4).map((role) => role.id);
  render();
}

function startGame() {
  state.score = { security: 8, production: 8, reputation: 8 };
  state.log = [];
  state.result = null;
  state.currentRound = 0;
  state.deck = shuffle(events).slice(0, 6);
  resetTimerState();
  state.screen = "event";
  render();
}

function chooseOption(optionId) {
  stopTimer();
  hideCyberAlert();
  const event = state.deck[state.currentRound];
  const option = event.options.find((item) => item.id === optionId);
  const bonusRoles = findMatchingBonusRoles(event);
  const bonus = bonusRoles.reduce((sum, role) => sum + role.weight, 0);
  let outcome;
  let total = null;

  if (option.best) {
    total = baseChecks[event.check].value + bonus;
    const passed = total >= event.difficulty;
    outcome = {
      type: passed ? "success" : "failure",
      delta: passed ? option.success : option.failure,
      text: passed ? option.successText : option.failureText,
    };
  } else {
    outcome = {
      type: "direct",
      delta: option.effect,
      text: buildDirectOutcomeText(option.effect),
    };
  }

  applyDelta(outcome.delta);
  state.log.push({
    title: event.title,
    choice: `${option.id}. ${option.text}`,
    outcome: outcome.text,
  });
  state.result = {
    event,
    option,
    outcome,
    total,
    threshold: event.difficulty,
    bonus,
    bonusRoles,
  };
  state.screen = "result";
  render();
}

function buildDirectOutcomeText(effect) {
  const lines = [];
  if (effect.security < 0) lines.push("风险在缺少控制动作的情况下继续扩散。");
  if (effect.production < 0) lines.push("现场协同变慢，生产节奏受到拖累。");
  if (effect.production > 0) lines.push("短期产出被保住，但后续仍需追溯和补偿。");
  if (effect.reputation < 0) lines.push("组织可信度下降，外部和内部沟通成本上升。");
  if (effect.reputation > 0) lines.push("管理层表现出清晰的指挥与透明度。");
  return lines.join(" ") || "这个决定没有立刻改善局面，但也没有带来额外连锁损失。";
}

function applyDelta(delta) {
  Object.entries(delta).forEach(([key, value]) => {
    state.score[key] = Math.max(0, Math.min(12, state.score[key] + value));
  });
}

function findMatchingBonusRoles(event) {
  return state.selectedRoles
    .map((roleId) => roles.find((role) => role.id === roleId))
    .map((role) => {
      const checkHit = role.bonusCheck === event.check;
      const tagHit = role.bonusTags.some((tag) => event.tags.includes(tag));
      if (checkHit && tagHit) return { name: role.name, weight: 2, full: true };
      if (checkHit || tagHit) return { name: role.name, weight: 1, full: false };
      return null;
    })
    .filter(Boolean);
}

function nextStep() {
  const failed = Object.values(state.score).some((value) => value <= 0);
  if (failed || state.currentRound >= state.deck.length - 1) {
    state.screen = "final";
  } else {
    state.currentRound += 1;
    resetTimerState();
    state.screen = "event";
  }
  render();
}

const scoreTierText = {
  security: {
    优: "边界与升级机制稳固，横向移动被有效遏制",
    良: "防线基本守住，个别环节承压",
    薄弱: "边界存在缺口，依赖侥幸",
    危急: "防线多处被突破",
    击穿: "安全防线被击穿",
  },
  production: {
    优: "降级/停线/恢复预案完备，交付未受实质冲击",
    良: "运营连续，个别回合靠临场调度",
    薄弱: "恢复准备不足，交付出现波动",
    危急: "产线频繁受阻，缺乏预案",
    击穿: "产能陷入停摆",
  },
  reputation: {
    优: "对内对外口径一致，信任维持良好",
    良: "沟通总体可控，偶有被动",
    薄弱: "口径管理松散，出现摇摆",
    危急: "沟通失序，信任受损",
    击穿: "声誉严重受损",
  },
};

function scoreTier(value) {
  if (value <= 0) return { rank: "击穿", grade: 0 };
  if (value <= 3) return { rank: "危急", grade: 1 };
  if (value <= 6) return { rank: "薄弱", grade: 2 };
  if (value <= 9) return { rank: "良", grade: 3 };
  return { rank: "优", grade: 4 };
}

function calculateFinalOutcome() {
  // 逐项评级：安全 / 产能 / 声誉 各自映射为档位（击穿0 ~ 优4）
  const tiers = scoreMeta.map(({ key, label }) => {
    const value = state.score[key];
    const tier = scoreTier(value);
    return { key, label, value, ...tier };
  });

  // 逐项诊断（本局管理画像）
  const tags = tiers.map(
    ({ key, label, value, rank }) => `${label} ${value} · ${rank}——${scoreTierText[key][rank]}`
  );

  // 三项共同决定综合等级：合计档位 T、最短板 Lmin、档位极差 R
  const grades = tiers.map((t) => t.grade);
  const T = grades.reduce((sum, g) => sum + g, 0);
  const Lmin = Math.min(...grades);
  const R = Math.max(...grades) - Lmin;

  let title;
  let judgment;

  if (Lmin === 0) {
    const broken = tiers.filter((t) => t.grade === 0).map((t) => t.label);
    title = "单点击穿";
    judgment = `${broken.join("、")} 已归零，成为整局的致命短板；其余维度虽有支撑，也难以掩盖这一断裂。下一轮务必优先补齐被击穿的环节。`;
  } else if (T >= 10 && Lmin >= 3) {
    title = "韧性运营";
    judgment = "三线均衡且整体高位，指挥链清晰，安全与交付兼顾，接近成熟的危机管理团队。";
  } else if (T >= 8 && Lmin >= 2 && R <= 2) {
    title = "稳健防守";
    judgment = "整体守住，三项差距不大，短板可控，协同稳定；再补齐细节即可迈向高位。";
  } else if (R >= 3 && Lmin >= 1) {
    const strong = tiers.reduce((a, b) => (b.grade > a.grade ? b : a));
    const weak = tiers.reduce((a, b) => (b.grade < a.grade ? b : a));
    title = "偏科运行";
    judgment = `${strong.label}表现突出，却以${weak.label}为代价换取；结构明显失衡，下一轮需重点补齐最短板。`;
  } else {
    title = "勉力支撑";
    judgment = "工厂运转未中断，但多个管理机制尚未成型，风险持续外溢；整体处于中低位，需系统性加固。";
  }

  return {
    title,
    summary: judgment,
    tags,
  };
}

function startTimer() {
  if (state.timer.active || state.timer.remaining <= 0) return;
  state.timer.active = true;
  state.timer.intervalId = window.setInterval(() => {
    state.timer.remaining = Math.max(0, state.timer.remaining - 1);
    syncTimerUI();
    if (state.timer.remaining === 0) handleTimeout();
  }, 1000);
  syncTimerUI();
}

// 进入回合后自动开启倒计时
function ensureTimerRunning() {
  if (state.screen === "event" && state.timer.remaining > 0 && !state.timer.active) {
    startTimer();
  }
}

function toggleTimer() {
  if (state.timer.active) {
    stopTimer();
  } else {
    startTimer();
  }
  syncTimerUI();
}

// 讨论超时：攻击者利用窗口期，对三项指标进行扣减并弹出警告
function handleTimeout() {
  stopTimer();
  if (state.timer.penalized) return;
  state.timer.penalized = true;
  applyDelta(TIMEOUT_PENALTY);
  render();
  showCyberAlert(TIMEOUT_PENALTY);
}

function showCyberAlert(penalty) {
  const overlay = document.getElementById("cyberAlert");
  if (!overlay) return;
  const deltas = document.getElementById("cyberAlertDeltas");
  if (deltas) {
    deltas.innerHTML = scoreMeta
      .map(({ key, label }) => {
        const value = penalty[key] || 0;
        const iconName = key === "security" ? "security" : key === "production" ? "production" : "reputation";
        return `<div class="delta-row"><span class="pixel-inline">${pixelIcon(iconName)}<span>${label}</span></span><strong class="delta-bad">${value}</strong></div>`;
      })
      .join("");
  }
  overlay.hidden = false;
}

function hideCyberAlert() {
  const overlay = document.getElementById("cyberAlert");
  if (overlay) overlay.hidden = true;
}

function stopTimer() {
  if (state.timer.intervalId) {
    window.clearInterval(state.timer.intervalId);
    state.timer.intervalId = null;
  }
  state.timer.active = false;
  syncTimerUI();
}

function resetTimerState() {
  stopTimer();
  state.timer.remaining = state.timer.total;
  state.timer.penalized = false;
}

function resetTimer() {
  resetTimerState();
  hideCyberAlert();
  startTimer();
  syncTimerUI();
}

function clearTimerIfHidden() {
  if (state.screen !== "event" && state.timer.active) {
    stopTimer();
  }
}

function syncTimerUI() {
  const timerValue = document.getElementById("timerValue");
  if (!timerValue) return;
  const mins = String(Math.floor(state.timer.remaining / 60)).padStart(2, "0");
  const secs = String(state.timer.remaining % 60).padStart(2, "0");
  const expired = state.timer.remaining === 0;
  timerValue.textContent = expired ? "00:00 已超时" : `${mins}:${secs}`;
  const toggleButton = document.querySelector('[data-action="toggle-timer"]');
  if (toggleButton) {
    toggleButton.textContent = expired ? "已超时" : state.timer.active ? "暂停计时" : "开始计时";
    toggleButton.disabled = expired;
  }
  const burn = document.getElementById("fuseBurn");
  if (burn) {
    const pct = Math.max(0, (state.timer.remaining / state.timer.total) * 100);
    burn.style.width = `${pct}%`;
  }
  const card = document.getElementById("timerCard");
  if (card) {
    const ratio = state.timer.remaining / state.timer.total;
    card.classList.toggle("warning", ratio <= 0.5 && ratio > 0.2);
    card.classList.toggle("danger", ratio <= 0.2 && state.timer.remaining > 0);
    card.classList.toggle("expired", expired);
  }
}

function restart() {
  stopTimer();
  hideCyberAlert();
  state.screen = "intro";
  state.selectedRoles = [];
  state.currentRound = 0;
  state.deck = [];
  state.score = { security: 8, production: 8, reputation: 8 };
  state.result = null;
  state.log = [];
  state.timer.penalized = false;
  state.timer.remaining = state.timer.total;
  render();
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action, roleId, optionId } = target.dataset;

  if (action === "start-briefing") startBriefing();
  if (action === "open-help") openHelp();
  if (action === "back-intro") backIntro();
  if (action === "back-briefing") backBriefing();
  if (action === "to-role-select") toRoleSelect();
  if (action === "toggle-role") toggleRole(roleId);
  if (action === "auto-pick-roles") autoPickRoles();
  if (action === "start-game") startGame();
  if (action === "choose-option") chooseOption(optionId);
  if (action === "next-step") nextStep();
  if (action === "restart") restart();
  if (action === "toggle-timer") toggleTimer();
  if (action === "reset-timer") resetTimer();
  if (action === "dismiss-alert") hideCyberAlert();
});

render();
