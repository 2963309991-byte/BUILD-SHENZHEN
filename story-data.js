"use strict";

const storySources = {
  planningVisits: ["Shen & Xu · Land Use Planning and Zoning, pp. 98–99", "https://documents.worldbank.org/curated/en/622661468339570756/pdf/690730PUB0Publ067902B09780821389706.pdf#page=128", "Describes the mid-1990s professional visits to Hong Kong and Singapore, and how Shenzhen developed its own planning framework."],
  planningStandards: ["China Academy of Urban Planning and Design · Shenzhen Planning Standards and Guidelines (1997)", "https://www.szcaupd.com/project-ghyj-i_12663.htm", "Documents the standard-setting project completed in March 1997 and Hong Kong’s role as a reference."],
  hkTenure: ["Land Tenure System and Land Policy · Hong Kong Lands Department", "https://www.landsd.gov.hk/en/resources/land-info-stat/land-tenure-system-land-policy.html", "See the historical terms, premiums and government rent under Hong Kong’s leasehold system."],
  hkOrdinance: ["Hong Kong Town Planning Ordinance (1939) · HKU Historical Laws", "https://oelawhk.lib.hku.hk/items/show/1892", "The colonial-era enactment provides historical context for statutory plans and the Town Planning Board."],
  hkPlans: ["Statutory Plans · Hong Kong Town Planning Board", "https://www.tpb.gov.hk/en/list_of_plans/intro_old.html", "See how Outline Zoning Plans define uses and identify where planning permission is needed."],
  finance: ["Urbanization beyond Municipal Boundaries · World Bank", "https://documents1.worldbank.org/curated/en/373731468268485378/pdf/757340PUB0EPI0001300pubdate02021013.pdf", "Box 4.1 connects Shenzhen’s land-market reforms to property development, infrastructure finance and Hong Kong investment."],
  constitution: ["1988 Constitutional Amendment · National People’s Congress", "https://english.court.gov.cn/2015-08/17/c_761462.htm", "Article 2 changes the constitutional provision on land to allow transfers of use rights according to law."],
  planningTransfer: ["Fencing Off · Wilson & Hou, Urban Affairs Review", "https://journals.sagepub.com/doi/10.1177/10780874261494800", "The article traces the influence of Hong Kong’s planning institutions and documents the uses and limits of Shenzhen’s 1998 reforms."],
  planningCurrent: ["Shenzhen Urban Planning Ordinance, amended text · Shenzhen Planning and Natural Resources Bureau", "https://pnr.sz.gov.cn/xxgk/ztzl/jycs/wjyjd/ghjs/content/post_11275093.html", "The published consolidation records amendments through 2021 and retains the chapters on the Planning Commission and statutory plans."],
  shekouHistory: ["Shekou Industrial Zone · Shenzhen Municipal Government", "https://www.sz.gov.cn/szstory/202301/content/post_10379289.html", "The city’s history records the establishment of the Shekou industrial zone by Hong Kong–based China Merchants in 1979."]
};

const storySourcesZh = {
  planningVisits: ["Shen 与 Xu · 土地利用规划与分区管制，第 98–99 页", "记录 1990 年代中期赴香港和新加坡的专业考察，以及深圳如何建立本地规划框架。"],
  planningStandards: ["中国城市规划设计研究院深圳分院 ·《深圳市城市规划标准与准则》（1997）", "记录 1997 年 3 月完成的标准编制项目及对香港经验的借鉴。"],
  hkTenure: ["《香港的土地制度及地政政策》· 香港地政总署", "梳理香港政府批租的历史、租期、地价和地租。"],
  hkOrdinance: ["香港《城市规划条例》（1939）· 香港大学历史法律库", "殖民时期原文为理解法定规划与城市规划委员会的制度渊源提供历史背景。"],
  hkPlans: ["《法定图则简介》· 香港城市规划委员会", "介绍分区计划大纲图如何规定用途和规划许可要求。"],
  finance: ["《跨越市政边界的城市化》· 世界银行", "专栏 4.1 说明深圳土地市场改革如何影响房地产开发和基础设施筹资，以及港资在早期建设中的作用。"],
  constitution: ["《1988 年宪法修正案》· 全国人民代表大会", "修正案第二条规定，土地的使用权可以依照法律的规定转让。"],
  planningTransfer: ["《Fencing Off》· Wilson 与 Hou，《Urban Affairs Review》", "追踪香港规划制度的影响，并分析深圳 1998 年改革的实际运用与局限。"],
  planningCurrent: ["《深圳市城市规划条例》修订文本 · 深圳市规划和自然资源局", "汇集截至 2021 年的修订情况，保留市规划委员会和法定图则专章。"],
  shekouHistory: ["《蛇口工业区：改革开放“第一炮”》· 深圳市政府", "记录驻港招商局于 1979 年在蛇口设立工业区的经过。"]
};

Object.assign(interfaceText.en, {
  storyPeriod:"Period V / Contemporary World · 1980–1998",
  storyTitle:"From Hong Kong\nto Shenzhen",
  storyPair:"Urban Planning × Economic Dimension",
  storyThesis:"Shenzhen reshaped how it allocated land, raised public revenue and coordinated development by selectively adapting Hong Kong’s land leasing and statutory planning practices to mainland institutions.",
  storyNav:"Story Map sections", storyAtlas:"Historical atlas", storyTransfer:"Knowledge transfer", storyCompare:"Hong Kong vs. Shenzhen", storyBudget:"Budget simulator",
  storyLayers:"Map layers", layerTransfer:"Ideas", layerEconomy:"Investment", storyCases:"Historical cases",
  storyReplay:"Play timeline", storyPause:"Pause timeline", storyArchive:"Open evidence", storyEvidence:"What to look for in the sources",
  transferTitle:"What travelled, and what changed?", transferLead:"Reform-era Shenzhen studied nearby Hong Kong, where British administration had shaped leasehold and statutory planning. The 1986 land study and the mid-1990s planning exchanges were separate episodes within the same case. Follow the two routes to see what Shenzhen made its own.",
  compareTitle:"Hong Kong vs. Shenzhen",
  budgetTitle:"Plan within a public budget", budgetLead:"Not every project can be funded. What should the city prioritize, and what must wait? Try allocating 100 model credits between economic infrastructure and public services.",
  sourcesAbout:"Primary records, research and photograph credits for the Story Map."
});
Object.assign(interfaceText.zh, {
  storyPeriod:"时期 V / 当代世界 · 1980–1998",
  storyTitle:"从香港到深圳",
  storyPair:"城市规划 × 经济维度",
  storyThesis:"深圳选择性地借鉴香港的土地批租与法定规划做法，并按内地制度加以改造，由此改变了土地配置、公共筹资与城市开发协调的方式。",
  storyNav:"故事地图栏目", storyAtlas:"历史地图", storyTransfer:"知识传播", storyCompare:"深港对比", storyBudget:"预算模拟",
  storyLayers:"地图图层", layerTransfer:"知识传播", layerEconomy:"城市投资", storyCases:"历史案例",
  storyReplay:"播放时间线", storyPause:"暂停时间线", storyArchive:"查看证据", storyEvidence:"史料导读",
  transferTitle:"哪些知识跨过了边界？", transferLead:"改革开放让深圳有机会向邻近的香港学习。香港的土地批租和法定规划深受英国管治时期的制度影响。1986 年的地政考察和 1990 年代中期的规划交流是同一案例中的两段不同经历。沿两条路径，看看深圳如何把这些做法转化为自己的制度。",
  compareTitle:"香港 vs. 深圳",
  budgetTitle:"在预算内规划城市", budgetLead:"有限的资金无法覆盖所有项目。城市应优先建设什么，哪些设施必须等一等？试着把 100 点模拟预算分给经济基础设施和公共服务。",
  sourcesAbout:"故事地图使用的原始档案、研究与图片出处。"
});

const storyCases = [
  {
    name:["A · Land-use rights and land development","A · 土地使用权与土地开发"],
    origin:["Hong Kong’s leasehold system","香港的土地批租制度"],
    idea:["A government can grant a time-limited development right for a premium and use competitive bidding to allocate it.","政府可以收取地价，限期批出土地开发权，并通过竞价分配。"],
    originRefs:["hkTenure"],
    stages:[
      {name:["Active Selection","主动选择"], record:"exchange", refs:["exchange"], text:["In 1986 Shenzhen invited Hong Kong property experts and sent officials to observe land auctions. The delegation recommended a competitive pilot to recover investment in serviced land.","1986 年，深圳邀请香港地产专家分享经验，并派团队赴港观摩拍卖。考察报告建议通过竞争性出让试点，回收土地开发配套的投入。"]},
      {name:["Adaptation","本地改造"], record:"auction", refs:["auction","exchange"], text:["Shenzhen auctioned a residential use right for an initial 50-year term under a mainland pilot. The state kept title, the lot had a specified use, and a Shenzhen–Hong Kong joint venture submitted the winning bid.","深圳在内地试点框架下拍卖了一宗住宅用地最初 50 年的使用权。国家保留所有权，地块用途预先确定，最终由一家深港合资企业竞得。"]},
      {name:["Lasting Integration","长期融入"], record:"law", refs:["constitution","lease"], text:["The 1988 constitutional amendment permitted lawful transfers, and the 1990 regulations set out how grants and transfers work. The pilot mechanism became part of the national legal framework.","1988 年宪法修正案允许使用权依法转让，1990 年国务院条例进一步规定出让和转让办法。试点机制由此进入全国性法规体系。"]}
    ],
    verdict:["Meets all three criteria on Shenzhen’s side. The strongest evidence is for Hong Kong → Shenzhen, followed by diffusion across mainland China. Hong Kong participation is documented; a corresponding change to Hong Kong’s own leasehold rules is unestablished here.","就深圳一方而言，符合三项标准。证据最清楚的方向是香港到深圳，再由深圳试点扩展至内地。史料记录了香港参与，但这个案例中没有证据表明香港的批租制度也因此改变。"]
  },
  {
    name:["B · Statutory planning and development control","B · 法定规划与开发管制"],
    origin:["Hong Kong’s zoning plans","香港的分区规划"],
    idea:["Statutory Outline Zoning Plans show designated uses, and their Notes identify developments that require permission from the Town Planning Board.","法定分区计划大纲图划定土地用途，附带的《注释》说明哪些开发需要向城市规划委员会申请许可。"],
    originRefs:["hkOrdinance","hkPlans"],
    stages:[
      {name:["Active Selection","主动选择"], record:"futian", refs:["planningVisits","planningStandards","planningTransfer"], text:["In the mid-1990s, Shenzhen sent planning professionals to Hong Kong and Singapore to study how planning and markets worked together. Hong Kong’s hierarchy of plans and board-based approvals offered ways to stabilize development rules for emerging districts such as Futian. The city’s 1997 planning standards also drew on Hong Kong and other references.","1990 年代中期，深圳派规划专业人员赴香港和新加坡，研究如何协调规划与市场。香港的规划层级和委员会审批模式为福田等新区建立较稳定的开发规则提供了参照。深圳 1997 年的规划标准也参考了香港等地的经验。"]},
      {name:["Adaptation","本地改造"], record:"planning", refs:["planning","planningTransfer"], text:["The 1998 ordinance assigned statutory-plan approval to a local commission chaired by the mayor and required 30 days of public exhibition for drafts. The local rules connected parcel use, development intensity and public facilities to development permissions.","1998 年条例将法定图则审批交给由市长任主任委员的本地委员会，并要求草案公开展示 30 日。本地规则把地块用途、开发强度和公共设施要求与开发许可衔接起来。"]},
      {name:["Lasting Integration","长期融入"], record:"integration", refs:["planningCurrent","planningTransfer"], text:["The commission was appointed in 1999. The ordinance, as amended through 2021, retains chapters on the commission and statutory plans. Research finds that binding controls mattered where statutory plans had been adopted.","新一届规划委员会于 1999 年任命。条例历次修订至 2021 年仍保留委员会和法定图则专章。研究指出，约束主要在已通过法定图则的地区发挥作用。"]}
    ],
    verdict:["Meets all three criteria as institutional learning in Shenzhen. Statutory rules helped safeguard land for public uses and made development conditions clearer where plans applied. Implementation varied across the city.","就深圳的制度学习而言，符合三项标准。在适用图则的地区，制度有助于保障公共设施用地，并明确开发条件。不同地区的实施情况仍有差异。"]
  }
];

const storyComparisons = [
  {
    name:["Land rights","土地权利"],
    hk:["Government leases","政府批租", "Hong Kong grants leases for specified terms. Lease premiums and rent are ways the government captures part of the value of land.", "香港政府以一定期限批出土地租契，通过地价和地租取得部分土地价值。", "hkTenure"],
    sz:["State ownership, transferable use","国有土地，可转让的使用权", "Shenzhen tested payments and competitive grants for time-limited use rights. The 1990 regulations formalized the separation of ownership from use.", "深圳试行有偿使用土地，再以公开竞价出让有期限的使用权。1990 年条例明确区分所有权与使用权。", "lease"],
    point:["A time-limited right travelled across the border and was redefined in mainland land law.","跨境传播的是有期限的土地使用权，随后由内地法律重新界定。"]
  },
  {
    name:["Revenue","公共收入"],
    hk:["Premiums and rents","地价和地租","The lease system provided an established example of how granting development rights could produce government income.","香港的批租制度展示了如何通过批出土地开发权获得公共收入。","hkTenure"],
    sz:["Funding urban development","筹措城市建设资金","Competitive grants created a new source of funds for infrastructure, alongside other sources such as joint ventures with developers.","竞争性出让为基础设施提供了新的财源，开发商参与的合资项目也是早期建设资金来源之一。","finance"],
    point:["Revenue makes construction possible. A separate planning choice determines which sites and facilities get priority.","收入为建设提供资金，哪些地段和设施优先，则取决于规划决策。"]
  },
  {
    name:["Zoning and approvals","分区与审批"],
    hk:["Outline Zoning Plans","分区计划大纲图","The Town Planning Board’s plans and attached Notes distinguish permitted uses from uses that require planning permission.","城市规划委员会的图则和附带《注释》区分准许的用途与需要申请规划许可的用途。","hkPlans"],
    sz:["Statutory plans and local commission","法定图则与市规划委员会","Shenzhen’s 1998 ordinance placed statutory plans under a locally appointed commission. Drafts were displayed publicly, and binding plans could reserve land for public facilities.","深圳 1998 年条例将法定图则交由本地任命的规划委员会审批；草案公开展示，生效图则可预留公共设施用地。","planning"],
    point:["Both use mapped rules to shape investment. The Shenzhen model placed approval in a commission chaired by the mayor.","两地都用图则引导开发投资。深圳由市长担任主任委员的规划委员会负责审批法定图则。"]
  }
];

const evidenceNotes = {
  sez:["See the Shekou account for the Hong Kong–based company’s role. Shekou provides regional context for the SEZ experiment.", "蛇口档案记录了驻港招商局的角色，为理解经济特区试验提供区域背景。"],
  fees:["See Box 2 for the sequence from early land-use charges to later competitive grants.", "世界银行报告的专栏 2 梳理了从土地有偿使用到竞争性出让的过程。"],
  exchange:["Read Shen and Xu, pp. 91–92, for the delegation’s ten-day visit and the recommendation it brought back. The 1980 photograph shows the city before the visit.", "参见 Shen 与 Xu，第 91–92 页，了解为期十天的赴港考察及其政策建议。1980 年的照片展示考察前的香港城市面貌。"],
  auction:["Read the city account for parcel H409-4 and the World Bank chapter for the winning bid. The bid is evidence of revenue raised, while the broader financing study explains how land reform supported infrastructure.", "深圳市政府档案记录了 H409-4 地块，世界银行章节记录了成交价。拍卖证实了收入规模，基础设施的筹资作用则由更广泛的土地改革研究说明。"],
  law:["Read Article 2 of the 1988 amendment alongside Articles 2 and 8 of the 1990 rules to see how lawful transfers and paid grants were formalized.", "对读 1988 年修正案第二条和 1990 年条例第二条、第八条，了解依法转让与有偿出让如何制度化。"],
  futian:["See the article’s section on Shenzhen’s planning reform for the 1996 draft, the Futian context and the role of Hong Kong as a reference.", "参见论文对深圳规划改革的分析，了解 1996 年草案、福田新区建设及香港制度的影响。"],
  integration:["The amended text dates each revision and retains the two institutional chapters. The research article records the appointment of the new commission in 1999.", "修订文本列出各次修订的日期，并保留相关两章。研究论文记录了 1999 年新一届规划委员会的任命。"],
  planning:["Compare Chapters II and IV of the original gazette with the later amended text. Wilson and Hou identify Hong Kong’s influence and where the Shenzhen rules took effect.", "对读政府公报原文第二章、第四章与修订文本。Wilson 与 Hou 的研究追踪了香港的影响，并说明深圳规则实际发挥作用的范围。"]
};

Object.assign(interfaceText.en,{
  atlasReturn:"↖ Full map",atlasYears:"1980–1998 + later evidence",atlasNational:"National framework",
  atlasLegend:"Select a numbered marker or a timeline entry. Geography and routes are schematic."
});
Object.assign(interfaceText.zh,{
  atlasReturn:"↖ 返回全图",atlasYears:"1980–1998 ＋ 后续证据",atlasNational:"全国制度框架",
  atlasLegend:"选择编号图钉或时间线节点。地图位置与路线为示意。"
});

const atlasPinNames={
  sez:["Shekou / SEZ","蛇口／特区"],fees:["Luohu fees","罗湖地租"],exchange:["Hong Kong study tour","赴港考察"],
  auction:["Luohu auction","罗湖拍卖"],law:["National rules","全国法规"],futian:["Futian CBD","福田中心区"],
  planning:["Planning ordinance","规划条例"],integration:["Planning Commission","规划委员会"]
};

const atlasRecordAnalysis={
  sez:[
    ["Serviced industrial land and ways to attract and accommodate investment came into view through Hong Kong–linked development in Shekou.","蛇口与香港有关联的开发经验，让深圳看到工业用地配套与招商可以怎样结合。"],
    ["The SEZ gave Shenzhen a local setting in which to test how to prepare sites and recover development costs.","经济特区为深圳试验土地开发配套与成本回收提供了空间。"],
    ["Active Selection · Context","主动选择 · 背景"]
  ],
  fees:[
    ["Charging for land use offered a way to recover some expenses of site preparation and infrastructure.","土地有偿使用提供了回收一部分土地开发和基础设施成本的办法。"],
    ["Shenzhen charged qualifying investors for use under SEZ rules. These early fees preceded the 1986 study tour.","深圳依据特区规则向符合条件的投资者收费。这项地方试验早于 1986 年赴港考察。"],
    ["Adaptation · Local experiment","本地改造 · 早期试验"]
  ],
  exchange:[
    ["Officials studied Hong Kong’s use of time-limited leases and competitive allocation through expert exchanges and an official visit.","深圳通过专家交流与官方考察，研究香港有期限批租及竞争性供地的做法。"],
    ["The team recommended a pilot for Shenzhen. Transfer rules and state ownership still had to be addressed under mainland law.","考察团队建议在深圳试点。转让规则和国有土地所有权仍需在内地法律体系下处理。"],
    ["Active Selection","主动选择"]
  ],
  auction:[
    ["Competitive bidding was applied to a defined development right with a fixed term and a specified residential use.","竞争性报价被用于分配一项有期限、用途明确为住宅的开发权。"],
    ["The contract granted a use right while keeping ownership with the state. The bidding concerned one parcel under the approved pilot.","试点合同出让的是单宗地的使用权，土地所有权仍归国家。"],
    ["Adaptation","本地改造"]
  ],
  law:[
    ["The pilot’s distinction between ownership and transferable use became a basis for wider land-market rules.","试点对所有权与可转让使用权的区分，为更广泛的土地市场规则提供了基础。"],
    ["The constitutional amendment permitted lawful transfers. The State Council regulations specified terms for grants and transfers of urban state-owned land.","宪法修正案允许依法转让土地使用权，国务院条例规定了城镇国有土地使用权的出让和转让办法。"],
    ["Lasting Integration · National land law","长期融入 · 全国土地法规"]
  ],
  futian:[
    ["Shenzhen planners examined Hong Kong’s hierarchy of plans and committee-based approval. Singapore was also studied during the period.","深圳规划人员研究香港的规划层级及委员会审批制度，同期也考察了新加坡。"],
    ["Reformers proposed binding plans and a formal approval role for a Shenzhen commission, within the local development and governance framework.","改革者在深圳的开发与治理框架下提出编制具有约束力的图则，并赋予本地委员会正式审批职责。"],
    ["Active Selection · Statutory planning","主动选择 · 法定规划"]
  ],
  planning:[
    ["Hong Kong’s zoning and approval practices offered a reference for linking mapped land uses to development rules.","香港的分区和审批制度，为把图则上的用途与开发规则相衔接提供了参照。"],
    ["The ordinance put statutory plans under a locally appointed commission and provided for draft display. Plans could coordinate land uses, density and public facilities across parcels.","条例将法定图则交由本地任命的委员会审批，并规定草案公开展示。图则可以跨地块协调土地用途、开发强度和公共设施。"],
    ["Adaptation · Development control","本地改造 · 开发管制"]
  ],
  integration:[
    ["Binding statutory plans and committee review continued to shape how sites were approved for development.","具有约束力的法定图则和委员会审查持续影响地块开发审批。"],
    ["Shenzhen retained these institutions through multiple revisions. Their reach depended on where statutory plans were adopted.","深圳历次修订条例时保留相关制度。其约束范围取决于各地区是否已通过法定图则。"],
    ["Lasting Integration · Statutory plans","长期融入 · 法定图则"]
  ]
};

const atlasEconomicReadings={
  exchange:["A grant could bring in public funds before construction and give developers a route to serviced sites. The study tour identified a mechanism to test.","有偿出让可在建设前筹得公共资金，也让开发商有途径取得配套用地。考察为深圳找到了一种可以试验的机制。"],
  law:["Written rules gave local authorities and developers a common framework for transactions. Transferability made it possible for development rights to change hands without selling the land itself.","成文规则为地方政府与开发商提供共同的交易框架。使用权可以流转，土地本身仍归国家所有。"],
  futian:["Keeping the business district’s plan stable helped coordinate individual investments with the wider development of the district.","维持中心商务区规划的稳定性，有助于把单个地块的投资与整个片区的开发衔接起来。"],
  planning:["Use and density rules told developers what could be built on each site. Reserving room for roads and public facilities helped align private projects with shared infrastructure.","用途和开发强度规则明确地块可怎样建设。预留道路和公共设施用地，有助于让私人开发与片区基础设施相匹配。"],
  integration:["Where binding plans were adopted, the conditions on land development could persist across individual transactions and changes in government. The strength of that effect varied by area.","在已通过法定图则的地区，土地开发条件可以跨越单次交易和政府换届持续发挥作用。各地受到的约束程度有所不同。"]
};

Object.assign(interfaceText.en,{
  deskHint:"Choose an object to explore Shenzhen’s story.",
  deskReturn:"← Back to the desk",bookPrevious:"← Previous spread",bookNext:"Next spread →"
});
Object.assign(interfaceText.zh,{
  deskHint:"从桌上选一件物品，开始探索深圳的故事。",
  deskReturn:"← 返回书桌",bookPrevious:"← 上一跨页",bookNext:"下一跨页 →"
});

Object.assign(interfaceText.en,{
  goDesk:"Go to Desk",tourLabel:"Player’s Guide",tourSkip:"Skip guide",archiveGuide:"Archive Guide",
  guideNext:"Next",guidePrevious:"Back",guideDone:"Done",coreArgument:"Core argument",
  deskThesis:"Shenzhen’s transformation shows that external urban planning practices can reshape a city’s economy through selective adaptation rather than direct imitation.",
  researchChain:"Urban Planning → Mutual Learning → Economic Transformation",
  viewVerdict:"Research verdict",verdictNudge:"Read the research verdict",verdictCatLine:"Meow! You’ve explored all four stops. Ready to see what the evidence adds up to?",verdictTitle:"Beyond Imitation — Final Research Verdict",
  atlasNext:"You’ve seen what happened. What planning knowledge actually travelled?",openBook:"Open the knowledge book",
  transferNext:"How did the same planning tools work under different institutions?",
  compareNext:"Land can raise revenue. What should a city build when that revenue is limited?",
  budgetNext:"How do your simulated trade-offs connect to the historical argument?",
  budgetDebrief:"Read your budget",progressLabel:"Explored"
});
Object.assign(interfaceText.zh,{
  goDesk:"前往书桌",tourLabel:"游玩指引",tourSkip:"跳过指引",archiveGuide:"档案向导",
  guideNext:"下一页",guidePrevious:"上一页",guideDone:"完成",coreArgument:"核心论点",
  deskThesis:"深圳的发展表明，外部城市规划实践可以通过选择性改造重塑城市经济，而直接照搬无法解释这一过程。",
  researchChain:"城市规划 → 文明互鉴 → 经济转型",
  viewVerdict:"研究结论",verdictNudge:"查看研究结论",verdictCatLine:"喵！四个模块都探索过啦。点这里看看，这些线索得出了什么结论？",verdictTitle:"超越模仿 · 最终研究结论",
  atlasNext:"了解发生了什么之后，来看看具体有哪些规划知识发生了传播？",openBook:"打开知识之书",
  transferNext:"相似的规划工具，进入不同的制度后怎样运作？",
  compareNext:"土地可以带来公共收入。但资金有限时，城市该优先建设什么？",
  budgetNext:"你刚做的预算取舍，与历史论点有什么关联？",
  budgetDebrief:"解读你的预算",progressLabel:"已探索"
});

const transferEconomics = [
  ["Paid, time-limited grants gave developers a price and an additional route to serviced sites. Land revenue could help recover infrastructure costs alongside other financing. The first bid establishes what one parcel raised, without showing where the money was spent.","有偿、限期出让让开发者通过新的途径取得配套用地，也为使用权形成价格。土地收入可与其他财源一起分担配套成本。首拍成交价说明单宗地筹得多少钱，具体支出则需要其他证据。",["auction","finance"]],
  ["Where plans applied, developers could see what uses and intensity a site allowed. The city could also reserve sites for public facilities and require development to be coordinated with utilities. The ordinance shows the tools officials had; research on adopted plans shows where some of those tools constrained decisions.","在图则适用地区，开发者能够看到地块允许的用途和强度。城市也可以预留公共设施用地，并要求开发与市政配套协调。条例说明规划部门获得了哪些工具，已通过图则的研究则说明这些工具在哪里对决策产生了实际约束。",["planning","planningTransfer"]]
];

const comparisonMechanisms = [
  [
    ["Study time-limited leases and competitive allocation of development rights.","研究限期批租和竞争性配置开发权的做法。"],
    ["Separate ownership from use under mainland law. This allowed grants and lawful transfers while retaining state ownership of the urban parcels involved.","依据内地法律把所有权和使用权分开，在涉案城市地块保持国有的前提下，实现出让和依法转让。"],
    ["A specified use and term gave developers a defined asset to bid for while the government retained title.","明确用途和期限后，开发者可以对一项界定清楚的使用权竞价，国家仍保有土地所有权。"]
  ],
  [
    ["Study how land grants generated public income in Hong Kong.","研究香港政府如何通过土地批租取得公共收入。"],
    ["Shenzhen fitted paid grants into its state-owned land system and used several grant methods. It already charged land-use fees before the 1986 visit.","深圳把有偿出让纳入国有土地制度，并采用多种出让方式。1986 年赴港前，深圳已试行收取土地使用费。"],
    ["Grant proceeds could help finance serviced land alongside other funding. Which infrastructure got funded still depended on budget and planning decisions.","出让收入可与其他资金一起支持用地配套。具体建设哪些设施，仍取决于预算和规划决策。"]
  ],
  [
    ["Study mapped zoning, rules for permitted uses and board-based approval.","研究地图分区、用途规则和委员会审批做法。"],
    ["Put Shenzhen statutory plans under a mayor-chaired local commission, within the mainland planning and permitting framework. The 1998 ordinance also set rules for public exhibition and supporting facilities.","在内地规划和许可框架内，由市长任主任委员的本地委员会审批法定图则。1998 年条例也规定了草案公开展示和配套设施要求。"],
    ["Where adopted plans applied, they made investment conditions clearer and helped protect land for schools, utilities and public space. Coverage and enforcement varied.","在图则获批并适用的地区，它能明确投资开发条件，并为学校、市政设施与公共空间保留用地。覆盖和执行情况因地而异。"]
  ]
];

const researchVerdict = [
  {title:["What moved?","什么知识发生了传播？"],body:["Shenzhen studied two practices with roots in a different institutional tradition: granting time-limited development rights for a premium, and using statutory zoning and approval rules to guide development. British-administered Hong Kong was a channel for that knowledge. The case connects planning traditions through Hong Kong and mainland China.","深圳研究了两类具有不同制度渊源的做法：有偿、限期配置开发权，以及用法定分区和审批规则引导开发。当时处于英国管治下的香港是知识传入的渠道。本案例讨论的是经香港与中国内地发生接触的规划传统。"],records:["exchange","futian"]},
  {title:["What changed?","深圳改造了什么？"],body:["Shenzhen made urban state-owned land-use rights transferable within the mainland ownership system. It also placed statutory plans and development controls within a local planning commission and the mainland permitting framework.","深圳在内地土地所有权制度下实行可依法转让的城镇国有土地使用权，也把法定图则与开发管制纳入本地规划委员会和内地许可制度。"],records:["auction","planning"]},
  {title:["Why did it matter economically?","为什么具有经济意义？"],body:["Paid land grants changed how developers obtained sites and opened a source of public revenue. Where statutory plans applied, use and intensity rules and facility requirements could coordinate private investment with public priorities. Special Economic Zone policies and outside investment also helped shape Shenzhen’s growth.","有偿出让改变了开发者取得地块的渠道，也为公共部门开辟了一个财源。在图则适用地区，用途、强度和配套要求有助于协调私人投资与公共需要。经济特区政策与外来投资同样参与塑造了深圳的经济发展。"],records:["auction","planning"],refs:["finance","planningTransfer"]}
];

const verdictConditions = [
  {title:["Active selection","主动选择"],body:["The 1986 delegation studied land administration and observed auctions. Planning professionals pursued separate studies in Hong Kong and Singapore in the mid-1990s.","1986 年考察团研究土地管理并观摩拍卖。1990 年代中期，规划人员另赴香港和新加坡开展专业考察。"],records:["exchange","futian"]},
  {title:["Adaptation","本土改造"],body:["The 1987 pilot granted a term-limited use right while keeping state title. The 1998 ordinance linked mapped land uses, facility planning and development permission to a Shenzhen commission and local procedures.","1987 年试点在保留国有产权的同时出让有期限的使用权。1998 年条例把图则用途、配套规划与开发许可接入深圳的规划委员会和本地审批程序。"],records:["auction","planning"]},
  {title:["Lasting integration","长期融入"],body:["The 1988 amendment and 1990 regulations embedded lawful transfer nationally. The commission and statutory plans survived later ordinance amendments. Their legal survival is evidence of integration; actual development controls depended on where plans were adopted and applied.","1988 年修宪与 1990 年条例把依法转让纳入全国制度。规划委员会与法定图则在后续修法中延续。法律延续说明制度被保留，实际管制作用还取决于图则在哪些地区获批和执行。"],records:["law","integration"]}
];
