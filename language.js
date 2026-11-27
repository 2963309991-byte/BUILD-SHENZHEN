"use strict";

const interfaceText = {
  en: {
    homeSetting:"Shenzhen Bay · Reform era", homeSubtitle:"How land and ideas built a city",
    homeStart:"Start Exploring", homeRun:"Coin Run", homeArtwork:"Shenzhen Bay · Pixel illustration",
    homeLoading:"Building the city", homeCoin:"Turn the coin into a shooting star", homeSkip:"Skip opening", homePause:"Pause scenery", homeResume:"Resume scenery",
    homeLabel:"Build Shenzhen home", navLabel:"Main navigation", language:"Language", play:"Explore Origin", map:"Story Map", sources:"Sources",
    location:"Shenzhen, China", economic:"LAND RIGHTS. PUBLIC REVENUE. CITY BUILDING.",
    lede:"How did Shenzhen turn land-use rights into funds for building a city? Meet the characters, check the historical evidence, then try a simulation.",
    start:"Start the conversation", explore:"Explore Story Map", heroCaption:"Shenzhen River · Pixel illustration",
    stageLabel:"Game stages", borrow:"Borrow", adapt:"Adapt", transform:"Transform", borrowAbout:"Learn how land can raise revenue", adaptAbout:"Auction the right to use a site", transformAbout:"Put public revenue to work",
    archiveDates:"1980–1998 · Six historical stops", archive:"Pixel Archive",
    archiveAbout:"Follow Shenzhen’s land reforms. Select a pin or a year to see what happened and why it mattered.",
    mapViewport:"Interactive map of Shenzhen and Hong Kong", shenzhen:"Shenzhen", hongKong:"Hong Kong", bay:"Shenzhen Bay", mapStops:"Map stops",
    mapControls:"Map controls", zoomOut:"Zoom out", zoomIn:"Zoom in", zoomLevel:"Zoom level", reset:"Reset", resetMap:"Reset map view",
    mapHelp:"Use + / − to zoom. Drag to move when zoomed in. Pins show approximate locations.", timeline:"Historical timeline", selectedRecord:"Selected archive record",
    argumentTitle:"How land rights helped finance urban growth",
    argumentBody:"A developer could pay for time-limited use of a site while the state kept ownership. That payment created public revenue that could help fund infrastructure and prepare more sites for investment. Planning still mattered. The highest bid could set a price, but it could not tell the city where schools, parks or roads were needed.",
    viewSources:"View sources", why:"Economic significance",
    gazette:"Document heading and chapter title from the 1998 Shenzhen Government Gazette", resized:"(resized)", regulation:"Read the regulation (PDF)",
    sourcesAbout:"Historical records, research and image credits for the Pixel Archive.", photos:"Photographs and illustrations", photosAbout:"Photo credits appear on the individual archive panels. Game scenes and fictional characters are original pixel illustrations. The Story Map is schematic.",
    process:"How the work was made", processBody:"AI supported topic selection, the first prototype and later revisions, including the fictional characters, bilingual interface, interactive map and coin run. Historical events are linked to their sources.",
    backToMap:"Back to Story Map", briefing:"Historical Origins", briefingDate:"SHENZHEN · 1980", progress:"Game progress", answerPrompt:"How do you reply?",
    reply:"Your choice", evidence:"What actually happened", finish:"Finish mission", next:"Continue", begin:"Talk to the first character",
    complete:"Mission complete", open:"Trace the decisions in the archive", decisions:"Your decisions", summary:"The 1987 auction shows how a land-use right became public revenue. Open the archive to see what was auctioned, how much it raised and what that made possible.",
    openMap:"Open Story Map", replay:"Play again", scene:"Pixel illustration",
    run:"City Building – Coin Run", runTitle:"City Building – Coin Run", runIntro:"Collect game coins to build roads and facilities for a growing pixel city. Historical land revenue and planning evidence are in the Story Map.",
    auctionRevenue:"Winning bid", auctionValue:"¥5.25 million", auctionTerm:"Original use term", auctionYears:"50 years",
    coins:"Coins collected", speed:"Pace", runHelp:"Space / ↑ or Jump twice for a double jump. ↓ / S or Slide to duck under overhead barriers.", pause:"Pause", jump:"Jump", runHelpEndless:"Jump twice with Space / ↑. Slide with ↓ / S. A hit ends the run unless a pickup protects you.",
    runStart:"Start run", runResume:"Resume", runRestart:"Play again", runReady:"Build as you run", runReadyText:"Collect 42 coins in each of the three districts. Jump over ground hazards and slide under suspended beams.",
    runPaused:"Run paused", runPausedText:"Your coins are safe.", runWin:"City funding secured", runWinText:"You raised 126 across three districts, enough to fund roads, utilities and public facilities.",
    runModel:"Coins and upgrades are a game model of public revenue and investment. The archive shows the historical evidence.",
    guide:"Choose where to start", guideJump:"View Guide", guideAbout:"Follow the story in order or jump to any section.",
    guideHistory:"Talk to three characters and make Shenzhen’s land reform decisions.",
    guideMap:"Explore six historical stops and check the photographs and documents.",
    guideRun:"Collect coins in three modes and see what the city can fund.",
    bridgeTitle:"From auction revenue to city building", bridgeBody:"The auction brought in revenue. The next question was where to invest it. Try a pixel simulation of turning public funds into roads, serviced sites and public facilities.", bridgeAction:"Play the City Building Coin Run",
    selectMode:"Choose a running mode", modeLevel:"Level", modeLevelAbout:"Raise 42 in each of 3 districts", modeTimed:"Timed Coin Run", modeTimedAbout:"Collect as much as you can in 60 seconds", modeEndless:"Endless", modeEndlessAbout:"Survive as long as you can",
    readyTimed:"Collect as many coins as you can in 60 seconds. As you speed up, watch for more obstacles and supplies.", readyEndless:"Stay on the same route and survive as long as you can. A hit ends the run unless you are protected.",
    beforeRun:"Before you run", briefLevel:"Raise 42 in each district. Each coin adds 1 to the budget, and each diamond adds 3.",
    briefTimed:"You have 60 seconds on a single route. Collect coins and pick up supplies along the way.",
    briefEndless:"Stay on one route and collect as many coins as you can. A collision ends the run unless you have protection.",
    briefMoves:"Jump over ground obstacles. Tap Jump twice for a double jump. Slide under suspended beams and birds.",
    briefKeys:"Jump · Space / ↑   |   Slide · ↓ / S", briefDifficulty:"As your time or coin count increases, expect faster running and more obstacles.",
    exploreModes:"Explore other modes", backStoryMap:"Back to Story Map", backHome:"Back to home",
    briefLevelMoves:"Jump over ground obstacles. Tap Jump twice for a double jump. Slide under suspended beams.",
    bossReveal:"Easter egg unlocked", bossRevealText:"321 coins · An emergency signal from the worksite", skipReveal:"Skip cutscene",
    bossReady:"Secret encounter unlocked", bossIntro:"321 coins unlocked the Rogue Construction Bot. The run is paused until you enter the fight.",
    bossName:"Rogue Construction Bot", bossPlayer:"Your HP", bossEnergy:"Worksite energy", bossStart:"Enter boss fight",
    bossGuide:"Read the bot’s warning and dodge. Your attacks reduce its HP. At 20% HP it enrages and attacks faster.",
    bossDodge:"Ground impact: jump. Crane sweep: slide. Freight volley: jump, then slide.",
    bossCharge:"Basic attacks charge energy. Specials spend energy. City Blueprint needs a full bar.",
    bossPhase:"Phase 1", bossRage:"Phase 2 · Enraged", bossEnraging:"Enraged! Faster attacks incoming.",
    bossGround:"Ground impact · Jump", bossCrane:"Crane sweep · Slide", bossFreight:"Freight volley · Jump, then slide",
    bossPaused:"Boss fight paused", bossResume:"Resume fight", bossWin:"Construction bot secured",
    bossWinText:"The bot is back under control. Return to the route with your coins.", bossContinue:"Continue endless run",
    bossLoss:"The construction bot stopped your run.",
    bossWrench:"Rivet Wrench", bossSurvey:"Survey Pulse", bossRam:"Hydraulic Ram", bossDrones:"Survey Drone Volley", bossBlueprint:"City Blueprint",
    bossMelee:"Basic melee", bossRanged:"Basic ranged", bossMeleeSpecial:"Melee special", bossRangedSpecial:"Ranged special", bossUltimate:"Finisher",
    timeLeft:"Time left", elapsed:"Time run", endRound:"Finish run", timeUp:"Time’s up", runEnded:"Run finished", resultCoins:"Coins collected", tierChange:"The route changed",
    audioTitle:"Sound", audioMusic:"Music", audioEffects:"Sound effects", audioUnlock:"Click or tap to start audio.", audioAdjust:"Settings are saved on this device.", audioUnsupported:"Audio is unavailable in this browser.",
    avatar:"Customize runner", avatarPreview:"Live character preview", hair:"Hair", face:"Face", clothes:"Outfit",
    hitTitle:"Run over", hitCopy:"You hit a barrier.",
    tourPlay:"Click “Explore Origin” to meet the characters and make three decisions about Shenzhen’s land reform.",
    tourMap:"Click Story Map to open real photographs, records and laws at six stops.",
    tourRun:"Click City Building – Coin Run to create a runner and try turning public revenue into city upgrades.",
    tourSources:"Open Sources to see where the historical claims, photographs and laws came from.",
    slide:"Slide", inventory:"Active supplies", powerGuide:"Moves and supplies", noSupplies:"No active supplies",
    stageClear:"District funded", nextStage:"Enter next district", stageCoins:"District budget",
    shield:"Safety shield", revive:"Rescue token", magnet:"Coin magnet", boots:"Sprint boots", materials:"Materials grant",
    shieldAbout:"Blocks one collision.", reviveAbout:"Saves you after a collision and grants brief protection.",
    magnetAbout:"Pulls in nearby coins for 6 seconds.", bootsAbout:"A 2.2-second protected sprint.",
    materialsAbout:"A construction materials grant worth 4 coins.", shieldUsed:"Safety shield absorbed the hit", reviveUsed:"Rescue token used · keep running",
    moves:"Double jump and slide", movesAbout:"Tap Jump twice to gain height. Slide under suspended beams. Jump over crates, cones and low barriers.",
    ledger:"City investment milestones", phase:"Stage", gain:"Coin collected", slow:"Barrier hit · pace slowed", invested:"Upgrade funded", upcoming:"To fund", funded:"Funded"
  },
  zh: {
    homeSetting:"深圳湾 · 改革开放时期", homeSubtitle:"土地与观念如何塑造一座城市",
    homeStart:"开始探索", homeRun:"筑城跑酷", homeArtwork:"深圳湾 · 像素绘景",
    homeLoading:"正在搭建城市", homeCoin:"点亮金币，化作流星", homeSkip:"跳过开场", homePause:"暂停画面", homeResume:"播放画面",
    homeLabel:"返回建设深圳首页", navLabel:"主导航", language:"语言", play:"探索起源", map:"故事地图", sources:"史料来源",
    location:"中国深圳", economic:"土地使用权 · 公共收入 · 城市建设",
    lede:"深圳怎样靠土地使用权筹措城市建设资金？从角色对话出发，在地图里查证，再到金币跑酷里试一试。",
    start:"开始对话", explore:"探索故事地图", heroCaption:"深圳河 · 像素插画",
    stageLabel:"游戏关卡", borrow:"借鉴", adapt:"调整", transform:"转化", borrowAbout:"看看怎样从用地取得收入", adaptAbout:"拍卖土地使用权", transformAbout:"把公共收入投入建设",
    archiveDates:"1980–1998 · 六个历史节点", archive:"像素档案馆",
    archiveAbout:"沿着地图或时间线回顾深圳土地改革。点选一个地点或年份，看看发生了什么，以及为什么重要。",
    mapViewport:"深圳与香港互动地图", shenzhen:"深圳", hongKong:"香港", bay:"深圳湾", mapStops:"地图节点",
    mapControls:"地图操作", zoomOut:"缩小地图", zoomIn:"放大地图", zoomLevel:"缩放比例", reset:"复位", resetMap:"恢复地图初始视图",
    mapHelp:"用＋／－缩放，放大后可拖动。标记为历史地点的大致位置。", timeline:"历史时间线", selectedRecord:"当前档案",
    argumentTitle:"土地使用权如何为城市建设筹资",
    argumentBody:"开发商付费取得一定年限的土地使用权，土地仍归国家所有。这笔公共收入可以用于道路和配套设施，也能为更多地块吸引投资。出价能反映开发商愿意付多少钱，学校、公园和道路建在哪里，还需要城市规划。",
    viewSources:"查看史料来源", why:"经济意义",
    gazette:"1998 年《深圳市政府公报》刊载的文件标题与章节名称", resized:"（已调整尺寸）", regulation:"阅读法规（PDF）",
    sourcesAbout:"像素档案馆使用的历史档案、研究资料与图片来源。", photos:"照片和插画", photosAbout:"照片来源见各个档案卡片。游戏场景和虚构人物均为原创像素插画。故事地图为示意图。",
    process:"作品制作过程", processBody:"AI 协助了选题、原型和后续迭代，包括角色对话、中英切换、互动地图和金币跑酷。历史事件附有对应史料。",
    backToMap:"返回故事地图", briefing:"历史溯源", briefingDate:"深圳 · 1980", progress:"游戏进度", answerPrompt:"你会怎么回答？",
    reply:"你的选择", evidence:"历史上发生了什么", finish:"完成任务", next:"继续", begin:"和第一位角色对话",
    complete:"任务完成", open:"去档案里核对这些决定", decisions:"你的三个决定", summary:"1987 年的土地拍卖把使用权变成了公共收入。去档案里看看，当时拍卖了什么、筹到多少钱、带来了哪些建设机会。",
    openMap:"打开故事地图", replay:"再玩一次", scene:"像素插画",
    run:"城市建设 · 金币跑酷", runTitle:"城市建设 · 金币跑酷", runIntro:"收集游戏金币，为像素城市建设道路与设施。真实的土地收入与规划史料，请到故事地图查阅。",
    auctionRevenue:"拍卖成交价", auctionValue:"525 万元", auctionTerm:"原定使用期限", auctionYears:"50 年",
    coins:"累计金币", speed:"速度", runHelp:"空格／↑ 或「跳跃」，再按一次可二段跳。↓／S 或「滑铲」可从空中障碍下穿过。", pause:"暂停", jump:"跳跃", runHelpEndless:"空格／↑ 可二段跳，↓／S 可滑铲。没有护盾或复活币时，撞到障碍就结束。",
    runStart:"开始跑酷", runResume:"继续跑", runRestart:"再玩一次", runReady:"边跑边建设", runReadyText:"三个场景各收集 42 枚金币。跳过地面障碍，遇到吊装钢梁就滑铲。",
    runPaused:"已暂停", runPausedText:"金币已保留。", runWin:"奖励：城市建设资金已筹足", runWinText:"三个场景共筹到 126 资金，足够建设道路、管网和公共设施。",
    runModel:"金币和升级是对公共收入与投资的游戏模拟。真实史料可在故事地图查看。",
    guide:"从哪里开始？", guideJump:"查看游玩指引", guideAbout:"可以按顺序体验，也可以点开感兴趣的板块。",
    guideHistory:"和角色对话，做出三次深圳土地改革决策。",
    guideMap:"探索六个历史节点，查看照片和法规档案。",
    guideRun:"任选三种跑酷模式，用金币模拟城市建设。",
    bridgeTitle:"从拍卖收入到城市建设", bridgeBody:"拍卖筹到了钱，下一步是决定怎么投。去做个像素实验，看看公共收入怎样变成道路、可开发用地和公共设施。", bridgeAction:"进入金币跑酷",
    selectMode:"选择跑酷模式", modeLevel:"关卡模式", modeLevelAbout:"三个场景各筹 42 资金", modeTimed:"计时金币模式", modeTimedAbout:"60 秒内尽量多收集金币", modeEndless:"无限模式", modeEndlessAbout:"无时间上限，挑战金币纪录",
    readyTimed:"在 60 秒内尽量多收集金币。速度会提高，障碍会变密，沿途可捡道具。", readyEndless:"在同一条赛道上挑战生存。没有保护道具时，撞到障碍就会结束。",
    beforeRun:"开跑前看这里", briefLevel:"每个场景筹 42 资金。金币值 1，钻石值 3。",
    briefTimed:"在同一条路线跑 60 秒，尽量多收集金币，沿途可捡道具。",
    briefEndless:"在同一条路线挑战金币纪录。没有保护时，撞到障碍就会结束。",
    briefMoves:"地面障碍用跳跃，连按两次可以二段跳。遇到吊装钢梁或飞鸟时滑铲。",
    briefKeys:"跳跃 · 空格／↑　｜　滑铲 · ↓／S", briefDifficulty:"金币越多或跑得越久，速度越快，障碍也越密。",
    exploreModes:"探索其他模式", backStoryMap:"返回故事地图", backHome:"返回首页",
    briefLevelMoves:"地面障碍用跳跃，连按两次可以二段跳。遇到吊装钢梁时滑铲。",
    bossReveal:"触发隐藏彩蛋", bossRevealText:"累计 321 枚金币 · 工地传来紧急信号", skipReveal:"跳过动画",
    bossReady:"发现隐藏挑战", bossIntro:"321 枚金币解锁了失控的施工机器人。跑酷已暂停，准备好再开打。",
    bossName:"失控的施工机器人", bossPlayer:"你的生命值", bossEnergy:"工程能量", bossStart:"进入 Boss 战",
    bossGuide:"看预警躲避。攻击会削减机器人的血量，血量降到 20% 时它会狂暴，攻击加快。",
    bossDodge:"地面震波用跳跃，吊臂横扫用滑铲，双重运料波先跳再滑。",
    bossCharge:"普攻积攒工程能量，大招消耗能量，必杀技需要满格。",
    bossPhase:"第一阶段", bossRage:"第二阶段 · 狂暴", bossEnraging:"机器已狂暴，注意加快的攻势！",
    bossGround:"地面震波 · 跳跃", bossCrane:"吊臂横扫 · 滑铲", bossFreight:"双重运料波 · 先跳再滑",
    bossPaused:"Boss 战已暂停", bossResume:"继续战斗", bossWin:"施工机器人已停机",
    bossWinText:"机器人已恢复控制。你可以带着已收集的金币继续跑酷。", bossContinue:"继续无限跑酷",
    bossLoss:"你被失控的施工机器人拦下了。",
    bossWrench:"铆钉扳手", bossSurvey:"测绘脉冲", bossRam:"液压夯击", bossDrones:"工程无人机齐射", bossBlueprint:"城市总图",
    bossMelee:"近战普攻", bossRanged:"远程普攻", bossMeleeSpecial:"近战大招", bossRangedSpecial:"远程大招", bossUltimate:"必杀技",
    timeLeft:"剩余时间", elapsed:"跑动时间", endRound:"结束本轮", timeUp:"时间到", runEnded:"本轮结束", resultCoins:"累计金币", tierChange:"赛道已变化",
    audioTitle:"声音", audioMusic:"背景音乐", audioEffects:"音效", audioUnlock:"点击或轻触页面即可启用声音。", audioAdjust:"设置会保存在此设备上。", audioUnsupported:"当前浏览器无法播放声音。",
    avatar:"自选跑酷角色", avatarPreview:"角色实时预览", hair:"发型", face:"面部", clothes:"服装",
    hitTitle:"挑战结束", hitCopy:"你撞到了障碍。",
    tourPlay:"点击亮框里的「探索起源」，和角色对话，做三次深圳土地改革决策。",
    tourMap:"点击亮框里的「故事地图」，在六个节点查看历史照片、拍卖档案和法规。",
    tourRun:"点击亮框里的「城市建设 · 金币跑酷」，自选角色，跑酷收集金币，体验公共收入怎样投入建设。",
    tourSources:"打开「史料来源」，查看历史说法、照片和法规各自来自哪里。",
    slide:"滑铲", inventory:"当前道具", powerGuide:"动作与道具说明", noSupplies:"暂无生效道具",
    stageClear:"本区筹资完成", nextStage:"前往下一个场景", stageCoins:"本区资金",
    shield:"施工护盾", revive:"应急复活币", magnet:"金币磁铁", boots:"加速靴", materials:"建材补给",
    shieldAbout:"免疫一次碰撞。", reviveAbout:"碰撞后继续奔跑，并短暂免疫。",
    magnetAbout:"6 秒内自动吸附附近金币。", bootsAbout:"冲刺 2.2 秒，冲刺中免疫碰撞。",
    materialsAbout:"建材补助，折合 4 枚金币。", shieldUsed:"施工护盾挡住了碰撞", reviveUsed:"已使用应急复活币 · 继续奔跑",
    moves:"二段跳与滑铲", movesAbout:"连续按两次跳跃可以跳得更高，地面箱子、路锥和路栏用跳跃跨过，吊装钢梁用滑铲穿过。",
    ledger:"城市投资进度", phase:"阶段", gain:"收集金币", slow:"撞到路障 · 暂时减速", invested:"已筹足资金", upcoming:"待筹资", funded:"已筹资"
  }
};

const chineseRecords = [
  {title:"经济特区成立", place:"深圳 · 蛇口", alt:"一位骑车人经过蛇口的「时间就是金钱，效率就是生命」标语牌", caption:"改革初期的蛇口",
    history:"1980 年 8 月，深圳成为中国首批经济特区之一。随着投资者进入，工业用地、住房和基础设施的需求随之增长。在原有行政划拨制度下，地方政府很难收回土地开发前期的投入。",
    meaning:"特区为基础设施和投资政策试验提供了空间，也促使深圳研究邻近的香港如何供应开发用地、为建设筹资。"},
  {title:"土地开始有偿使用", place:"深圳经济特区 · 罗湖", alt:"罗湖 1984 年与 2020 年的两张全景对比照片", caption:"1984 年与 2020 年的罗湖。照片展示的是相关地区后来的发展。",
    history:"1981 年，深圳经济特区的土地管理规定确立了土地使用收费制度。次年，深圳开始向外商和合资企业收取相关费用。这让政府可以收回一部分土地开发和配套投入。",
    meaning:"有偿使用让土地使用权逐渐成为一项有独立价值的经济权利。后来，深圳在进一步试验的基础上引入了公开拍卖。"},
  {title:"向香港学习", place:"香港 · 考察地点", alt:"1980 年从太平山顶俯瞰香港和维多利亚港", caption:"从太平山顶俯瞰香港，1980 年 8 月",
    history:"1986 年，深圳成立土地改革工作小组。小组调研本地市场，邀请香港地产专家分享经验，还派出团队赴港考察。",
    meaning:"深圳看到，政府可以限期出让土地开发使用权，也可以用竞争的方式决定谁取得这项权利。怎样把这套做法放进内地制度，要由深圳自己决定。"},
  {title:"首次公开拍卖土地使用权", place:"罗湖 · 地块位于深圳水库附近", alt:"1987 年深圳首次土地使用权公开拍卖的现场照片", caption:"深圳会堂的公开拍卖现场，1987 年 12 月 1 日",
    history:"1987 年 12 月 1 日，深圳公开拍卖了水库附近一块 8,588 平方米住宅用地的使用权。原定使用期限为 50 年，成交价为 525 万元人民币。",
    meaning:"竞价为有期限的土地使用权确定了价格，土地仍归国家所有。政府可以用土地收入支持城市建设，开发商也有了取得用地的新渠道。"},
  {title:"从地方试验到全国规则", place:"深圳经济特区 · 改革随后纳入全国规则", alt:"国务院 1990 年关于城镇国有土地使用权暂行条例的第一页", caption:"1990 年国务院暂行条例，第一页",
    history:"1988 年宪法修正案允许土地使用权依法转让。1990 年，国务院进一步明确城镇国有土地使用权的出让和转让规则。",
    meaning:"深圳试行的做法逐渐纳入全国法规。土地所有权和使用权的区分，使这套制度可以应用于其他城市。"},
  {title:"规划新的城市中心", place:"福田 · 中心商务区",
    history:"1996 年，深圳设立福田中心商务区开发建设办公室。同年，一份条例草案提议引入有约束力的法定图则，并赋予规划委员会正式的审批权。同期，深圳还组织专业人员赴香港和新加坡考察规划与市场的协调方式。",
    meaning:"深圳研究了香港的规划层级和委员会审批模式，同时探索如何维持福田等重点地区的长期开发规则。"},
  {title:"以法规落实城市规划", place:"深圳 · 全市规划",
    history:"1998 年《深圳市城市规划条例》正式确立了法定图则在开发管理中的地位。条例涵盖土地用途、开发强度、配套设施和法定图则草案的公众参与程序。",
    meaning:"土地市场改变了供地与筹资方式。面对快速增长的开发需求，法定图则让城市可以引导建设，并为公共需求预留空间。"},
  {title:"延续至今的规划制度", place:"深圳 · 市规划委员会",
    history:"深圳于 1999 年任命新一届市规划委员会。此后条例经多次修订，截至 2021 年的修订文本依然保留了市规划委员会和法定图则专章。",
    meaning:"制度延续在深圳管理开发许可的方式中。法定图则已经通过的地区，受其规则约束最明显。"}
];

const chineseSources = {
  reform:["《改革投资环境》· 世界银行","报告中的专栏 2 介绍了早期土地使用收费，以及经济特区在土地改革中的作用。"],
  exchange:["《作为政策改革试验场的深圳经济特区》· Shen 与 Xu，世界银行","该章节记录了 1986 年深圳工作小组、赴港考察和公开拍卖的准备过程。"],
  auction:["《新中国土地拍卖“第一槌”》· 深圳市政府","回顾改革试点、拍卖日期、地块面积与原始使用期限。"],
  lease:["《中华人民共和国城镇国有土地使用权出让和转让暂行条例》· 国务院","1990 年条例规定了城镇国有土地使用权的出让和转让方式。"],
  legal:["《绿色城市治理：深圳案例》· Journal of Urban Affairs","文章分析土地改革如何改变城市开发和规划，以及由此产生的环境治理问题。"],
  planning:["《深圳市城市规划条例》· 深圳市政府公报","1998 年原始条例规定了法定图则、开发管理与公众参与程序。"]
};

const chineseCredits = {shekou:"人民政协网", luohu:"深圳市档案馆，经《当代中国》转载", hk:"Ion Tichy，维基共享资源", auction:"《当代中国》"};

let language = "en";
try {
  if (localStorage.getItem("build-shenzhen-language") === "zh") language = "zh";
} catch {}
const t = key => interfaceText[language][key];

function updateInterfaceLanguage() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-text]").forEach(element => { element.textContent = t(element.dataset.text); });
  document.querySelectorAll("[data-label]").forEach(element => {
    const label = t(element.dataset.label);
    element.setAttribute("aria-label", label);
    if (element.hasAttribute("data-map-action")) element.title = label;
  });
  document.querySelectorAll("[data-lang]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === language));
  });
}

Object.assign(interfaceText.en,{
  runnerCourse:"Shenzhen · Rooftop run",runnerStartGame:"Start game",runnerTutorial:"How to play",
  runnerModesBack:"← Back to modes",runnerStep1:"STEP 1 / 2",runnerStep2:"STEP 2 / 2",
  runnerGuideNext:"Continue to tutorial",runnerDone:"Done",runnerSetupClose:"Close",
  runnerLearnJump:"Press Space or ↑, or tap Jump. Press again in the air for a double jump.",
  runnerLearnSlide:"Press ↓ or S, or tap Slide. Slide while on the ground to duck under overhead hazards.",
  runnerHazards:"Obstacles to watch for",runnerCrate:"Crate · Jump",runnerCone:"Traffic cone · Jump",
  runnerRoadblock:"Roadblock · Jump",runnerBeam:"Overhead beam · Slide",
  runnerBird:"Low-flying bird · Slide (Timed and Endless)",
  runnerEasterHint:"Endless has an Easter egg. See what happens if you keep collecting coins."
});
Object.assign(interfaceText.zh,{
  runnerCourse:"深圳 · 天台跑酷",runnerStartGame:"开始游戏",runnerTutorial:"新手教学",
  runnerModesBack:"← 返回模式选择",runnerStep1:"第 1 步 / 共 2 步",runnerStep2:"第 2 步 / 共 2 步",
  runnerGuideNext:"确认角色，进入教学",runnerDone:"完成",runnerSetupClose:"关闭",
  runnerLearnJump:"按空格或 ↑，也可点「跳跃」。腾空后再按一次即可二段跳。",
  runnerLearnSlide:"按 ↓ 或 S，也可点「滑铲」。在地面滑铲可以从低空障碍下穿过。",
  runnerHazards:"路上会遇到的障碍",runnerCrate:"木箱 · 跳跃",runnerCone:"路锥 · 跳跃",
  runnerRoadblock:"路障 · 跳跃",runnerBeam:"悬挂横梁 · 滑铲",
  runnerBird:"低飞的鸟 · 滑铲（计时、无限模式）",
  runnerEasterHint:"无限模式藏着一个彩蛋。多收集一些金币，看看会发生什么。"
});

Object.assign(interfaceText.en,{
  runnerCountdownLevel:"Collect 42 coins in each district to fund city projects.",
  runnerCountdownTimed:"Collect as many coins as you can in 60 seconds!",
  runnerCountdownEndless:"Dodge obstacles and keep collecting coins for as long as you can!",
  runnerScores:"Personal leaderboard",runnerNewRecord:"New record!",runnerScoreRank:"Rank",runnerScoreEmpty:"No runs recorded yet."
});
Object.assign(interfaceText.zh,{
  runnerCountdownLevel:"每个街区筹集 42 枚金币，为城市项目筹资。",
  runnerCountdownTimed:"在 60 秒内收集尽可能多的金币吧！",
  runnerCountdownEndless:"避开障碍，尽量跑得更久、收集更多金币吧！",
  runnerScores:"个人排行榜",runnerNewRecord:"新纪录！",runnerScoreRank:"名次",runnerScoreEmpty:"还没有成绩记录。"
});
