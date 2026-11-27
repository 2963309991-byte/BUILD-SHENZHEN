"use strict";

const originsCast = [
  {name:["Auntie Zhou","周主任"],role:["Planning office lead","规划办公室负责人"]},
  {name:["Lin","小林"],role:["Research officer","调研员"]},
  {name:["Chen","陈工"],role:["Land officer","土地管理人员"]},
  {name:["Mei","小梅"],role:["City planner","城市规划师"]}
];

const originsChapters = [
  {
    date:"1980", title:["A City at a Crossroads","站在路口的城市"], place:["Shenzhen · Planning office","深圳 · 规划办公室"],
    cast:[0,3], beats:[
      [0,"You’re our new planning assistant. Take this map. The factories, homes and roads are all asking for space.","你是新来的规划助理。这张图你拿着。工厂、住房、道路，现在都在争地。","serious"],
      [3,"A factory wants to open by winter. The site looks empty on paper, but there’s no road or water line to it.","一家工厂想赶在冬天前开工。图上那块地是空的，可路没通，水也没接上。","thoughtful"],
      [0,"The investor wants a site quickly. The works department needs a way to pay for the road. Both are waiting for us.","投资方急着要地，建设部门得先想办法筹钱修路。两边都在等我们。","serious"],
      [3,"And if homes go up beside the factory, where will the trucks go? Where will the children go to school?","要是住房就盖在工厂旁边，货车走哪条路？孩子又去哪儿上学？","concerned"],
      [0,"First, how do we allocate land? Then, how do we attract investment, pay for infrastructure and make all those uses fit?","我们得想清楚怎么供地、怎么吸引投资和筹钱做配套，还得让不同用途在一张图上协调起来。","thoughtful"]
    ],
    reveal:["In August 1980 Shenzhen became one of China’s first special economic zones. Investors’ demand for serviced sites put pressure on early land allocation and infrastructure financing.","1980 年 8 月，深圳成为中国首批经济特区之一。投资者对配套用地的需求，给早期供地和基础设施筹资带来了压力。"],
    refs:["exchange","reform"], recordIds:["sez"], hook:[0,"Let’s see how nearby Hong Kong manages development. What would be useful here, and what would have to change?","我们去看看邻近的香港怎么管理开发。哪些做法值得学，哪些带回来得改？","encouraging"]
  },
  {
    date:"1986", title:["The Encounter","一河之隔的考察"], place:["Hong Kong · Harbour and land offices","香港 · 港口与地政考察"],
    stage:["Active Selection","主动选择"], cast:[1,0], beats:[
      [1,"Look across the harbour. I knew I’d see tall buildings, but I didn’t expect the paperwork to be so interesting.","看海港对面。我知道会看到很多高楼，没想到最有意思的倒是那些文件。","curious"],
      [0,"We’re here because Hong Kong is close and its businesses already invest in Shenzhen. Tell me what the paperwork does.","香港就在隔壁，那里的企业也已经来深圳投资了。说说你在文件里看到了什么。","inquisitive"],
      [1,"A lease gives a developer use of a site for a fixed term. Competitive bids can help decide who gets it and what they pay.","批租让开发商在约定期限内使用地块。公开竞价可以决定谁拿到地、为此付多少钱。","enthusiastic"],
      [0,"And what can the winner build? Paying for a site doesn’t tell you whether a factory belongs next to housing.","那中标的人能建什么？付了地价，也不能回答工厂能不能建在住宅旁边。","skeptical"],
      [1,"That’s where plans and development rules come in. They affect where firms locate and what a project will cost.","这就要看规划和开发规则了。它们会影响企业选址，也会影响项目成本。","thoughtful"],
      [0,"Hong Kong’s practices grew under British administration and a different legal history. Which part should go in our report?","这些做法形成于香港当时的英国管治和不同的法律沿革之中。我们的考察报告该把什么放在首位？","inquisitive"]
    ],
    decisionSpeaker:0, question:["What should Shenzhen study first?","深圳应优先研究什么？"],
    choices:[
      ["Focus on how Hong Kong’s modern buildings look.","重点研究香港现代建筑的外观。"],
      ["Study how land allocation, planning rules and public land revenue work together.","研究供地、规划规则与土地公共收入如何配合。"],
      ["Keep existing approaches and pass on the planning study.","沿用现有办法，放弃这次规划考察。"]
    ],
    reactions:[
      [1,"Design ideas could help our buildings. We’d still leave without knowing how to provide serviced sites or coordinate development.","设计灵感对建筑有帮助，可我们还是不知道怎样供给有配套的用地，也没学到怎么协调开发。","thoughtful"],
      [0,"Good. Follow one site from planning to allocation, and trace the payment. Then tell us which parts could work under our rules.","好。找一块地，从规划跟到出让，弄清费用怎么收，再告诉我们哪些环节能放进自己的制度。","encouraging"],
      [0,"We avoid importing rules that don’t fit. We also lose a chance to test alternatives to the system we’re struggling with.","这样能避开不合适的外来规则，但也错过了寻找替代办法的机会。","serious"]
    ],
    reveal:["In October 1986 Shenzhen formed a reform task force and consulted Hong Kong real-estate specialists. A group led by a deputy mayor visited Hong Kong in November, met land and development agencies and observed public land auctions.","1986 年 10 月，深圳成立改革工作小组，向香港地产专家请教。11 月，由深圳副市长率领的小组赴港，走访土地管理和城市开发部门，并观摩公开土地拍卖。"],
    refs:["exchange","hkTenure","hkPlans"], recordIds:["exchange"],
    hook:[1,"I’ll bring what we found to Chen. He’ll want to know which parts of this can actually work in Shenzhen.","我把考察笔记带去给陈工。他肯定要问，这些做法到底哪些能在深圳落地。","enthusiastic"]
  },
  {
    date:"1987–1988", title:["The Dilemma","带回来的规则，怎么用？"], place:["Shenzhen · Land office","深圳 · 土地管理办公室"],
    stage:["Adaptation","本土适应"], cast:[2,1,0],
    callbacks:[
      [2,"I saw your notes on building design. Before we draw a single tower, let’s settle what rights the builder would get.","我看了你记下的建筑样式。高楼可以晚点画，先说建楼的人能拿到什么权利。","skeptical"],
      [2,"Your notes link planning, allocation and revenue. Let’s start with allocation. What exactly would the winning bidder get?","你的笔记把规划、供地和财政串起来了。先从供地说起，中标的人究竟能拿到什么？","thoughtful"],
      [2,"I know you wanted to keep the old approach. Let’s put it beside a competitive pilot and see what each would change.","我知道你想先保留老办法。我们把它和竞价试点并排看看，各自会改变什么。","serious"]
    ],
    beats:[
      [1,"Take the housing site near the reservoir. Bids could tell us what builders are willing to pay for the right to develop it.","就拿水库附近那块住宅地来说。用竞价，至少能知道开发商愿意为开发权出多少钱。","enthusiastic"],
      [2,"Agreed. But urban land here is state-owned. We can’t bring in Hong Kong’s legal framework wholesale.","我同意试试竞价。但这里的城市土地归国家所有，香港那套法律框架不能整体搬过来。","serious"],
      [1,"What if the bidder gets the right to use the site for a fixed term? The state would still own the land.","如果中标者拿到的是一定年限的使用权呢？地还是国家的。","hopeful"],
      [2,"Then we must write down the term, permitted use and conditions for transfer. A bid tells us a price, not the terms of the right.","那就得写清楚年限、允许的用途和转让条件。出价能告诉我们价格，规定权利边界还得靠规则。","thoughtful"],
      [0,"We need a workable pilot. Think about what the state retains, what investors can buy, and what the city can put toward roads and utilities.","我们得拿出能落地的试点。想清楚国家保留什么、投资方获得什么，以及城市能拿什么去修路和做配套。","serious"]
    ],
    decisionSpeaker:0, question:["How should Shenzhen adapt what it learned?","深圳该怎样改造借鉴来的做法？"],
    choices:[
      ["Adopt the external land institutions as they are.","把外来的土地制度原样移植。"],
      ["Retain state ownership and grant transferable, time-limited use rights.","保留国有土地所有权，出让有期限、可依法转让的土地使用权。"],
      ["Keep administrative allocation and leave the system unchanged.","保留行政划拨，暂不改革。"]
    ],
    reactions:[
      [2,"A ready-made procedure would save design time. Its rules might have no legal basis here, leaving developers unsure what they hold.","现成程序能省些设计时间，但有些规则在这里可能没有法律依据，开发商反而不清楚自己拿到了什么。","skeptical"],
      [2,"Now we can compare bids for a defined right while keeping state ownership. Payments can support infrastructure, provided we plan how to spend them.","现在可以拿明确的一项权利来竞价，同时保留国家所有权。收入能用来支持基础设施，前提是我们有投入安排。","encouraging"],
      [1,"Administrative allocation can direct land to priority uses. It gives us less information about demand, and the city still needs to recover servicing costs.","行政划拨能把地优先给重要项目，但它提供的需求信息少，城市也还得想办法收回做配套的成本。","concerned"]
    ],
    reveal:["On 1 December 1987 Shenzhen held its first public auction of a state-owned land-use right. The residential site’s original term was 50 years. The 1988 constitutional amendment permitted transfer of land-use rights according to law. Ownership remained with the state.","1987 年 12 月 1 日，深圳首次公开拍卖国有土地使用权，住宅地块原定使用年限为 50 年。1988 年宪法修正案允许土地使用权依法转让。土地所有权仍归国家。"],
    refs:["auction","constitution","finance"], recordIds:["auction","law"],
    hook:[2,"We’ve found a new way to allocate land. Mei, how do we keep each new project from creating a problem for the next one?","我们找到了一种新的供地方式。小梅，怎么才能让一个项目建起来以后，不给旁边的项目添堵？","inquisitive"]
  },
  {
    date:"1990–1998", title:["Building a Planning System","把开发放进一张图"], place:["Shenzhen · Futian planning desk","深圳 · 福田规划工作台"],
    stage:["Lasting Integration","持续融入"], cast:[3,2,1],
    callbacks:[
      [3,"Even with a ready-made land procedure, we still need a local map. Nobody outside this city can decide where these roads should go.","就算有现成的出让程序，还是得画一张本地的图。这里的道路怎么走，得看深圳自己的条件。","serious"],
      [3,"Chen’s pilot gave developers a clearer way to get sites. It didn’t tell us how all those new projects would fit together.","陈工的试点让取得用地的办法更清楚了，但新项目怎么放在一起，还是得我们来想。","thoughtful"],
      [3,"Even if we keep administrative allocation, every department still needs to use the same map. Look at where these roads stop.","即便继续行政划拨，各部门也得用同一张图。你看，这几条路到哪儿就断了？","inquisitive"]
    ],
    beats:[
      [2,"This riverside parcel may fetch the highest price. The developer wants to put housing right beside the factory gate.","这块临水地可能出价最高。开发商想把住宅紧挨着厂门建。","thoughtful"],
      [3,"Then trucks and children would share the same route. And if we lease out this strip, there’s nowhere left for a school.","那货车和孩子就得走同一条路。要是这条地也出让了，学校就没有地方了。","concerned"],
      [1,"Could a zoning plan tell investors where housing, industry and shops belong before they bid?","能不能先用分区图告诉投资者，哪里适合住宅、工厂和商铺，再让他们出价？","curious"],
      [3,"Yes. Development controls can also limit how much can be built. A road and a utility line cost less to coordinate before the plots are built out.","可以，开发管制还能规定地块能建多少。道路和管线也该趁地块还没建满时统筹，否则以后协调成本更高。","encouraging"],
      [2,"That means reserving land we could sell today. The gain is that connected sites become easier to develop tomorrow.","这就要先留下部分现在可以出让的地。换来的好处是，配套接通后，其他地块将来更容易开发。","thoughtful"]
    ],
    decisionSpeaker:3, question:["How should Shenzhen coordinate the growing city?","深圳该怎样协调不断扩张的城市？"],
    choices:[
      ["Prioritize high-value sites, with limited coordination between them.","优先开发高价值地块，各地块之间只做有限协调。"],
      ["Combine statutory land-use plans, development controls and infrastructure investment.","结合法定土地利用规划、开发管制与基础设施投入。"],
      ["Approve projects separately, without a citywide framework.","逐个审批项目，不设全市协调框架。"]
    ],
    reactions:[
      [3,"The riverfront may draw strong bids. Our map also shows factory traffic cutting past homes and no reserved school site.","滨水地块也许能拍出高价。可图上货车会经过住宅区，学校也没有预留位置。","concerned"],
      [3,"See how the roads link the districts while keeping freight away from the school? Reserved sites and clearer rules help both residents and investors plan ahead.","看，道路连起了各区，货运也绕开了学校。预留用地和明确的开发规则，让居民和投资方都能提前作安排。","delighted"],
      [2,"A single approval may be quick. Across the district, roads can stop at plot boundaries and a school site can disappear before anyone reserves it.","单个项目可能批得快。但放到整个片区，道路容易在地块边界断开，学校用地也可能在预留前就被占掉。","skeptical"]
    ],
    reveal:["The State Council’s 1990 regulations set out how urban state-owned land-use rights could be granted and transferred. In the mid-1990s Shenzhen teams studied planning and markets in Hong Kong and Singapore. Shenzhen’s 1998 ordinance gave statutory plans a formal role in regulating permitted uses, development intensity and public facilities.","1990 年，国务院条例明确了城镇国有土地使用权的出让和转让办法。1990 年代中期，深圳组织专业人员赴香港和新加坡考察规划与市场如何配合。1998 年《深圳市城市规划条例》赋予法定图则正式地位，用于明确土地用途、开发强度和公共设施等。"],
    refs:["lease","planning","planningVisits","planningTransfer","planningStandards"], recordIds:["law","futian","planning"],
    hook:[3,"The study trips got us started. The question is what stayed with Shenzhen after the pilot projects ended.","考察帮我们起了个头。更重要的是，试点过去后，哪些做法留在了深圳自己的制度里？","thoughtful"]
  },
  {
    date:"1980–1998", title:["Beyond Imitation","学来的经验，留下的制度"], place:["Shenzhen · Planning office","深圳 · 规划办公室"],
    cast:[0,1,2,3],
    beats:[
      [0,"Put the 1980 map beside the plan on your desk. What did we learn along the way?","把 1980 年那张图和桌上的法定图则放在一起。我们这一路学到了什么？","inquisitive"],
      [1,"We went looking for specific practices. Seeing how Hong Kong allocated and regulated land helped us ask better questions at home.","我们是带着问题去考察的。了解香港怎样供地和管开发，让我们回来后能把自己的问题问得更具体。","delighted"],
      [2,"We kept state ownership and defined a right that could be granted for a term and transferred according to law. That changed how land could reach investors.","我们保留国家所有权，明确了一项可限期出让、依法转让的使用权。这改变了投资者取得用地的方式。","smiling"],
      [3,"A lasting change takes rules that work beyond one deal. Statutory plans linked each site to a wider pattern of roads, homes, jobs and services.","长期的改变要靠一套能用于不同项目的规则。法定图则把单块地放进了道路、住房、就业和服务组成的整体里。","delighted"],
      [0,"That’s the useful part of exchange. We took ideas seriously enough to change them, and the changes helped shape how the city invested and developed.","交流的价值就在这儿。我们认真研究外来的做法，再把它们改造成适合本地的制度。城市投资和开发的方式也随之改变。","encouraging"]
    ]
  }
];

const originsBrief = {
  title:["1980 · A new posting","1980 · 初到规划办公室"],
  body:["You’re a junior planning assistant in Shenzhen, one of China’s first special economic zones. Zhou hands you a map and asks you to keep notes as the city makes room for new factories, homes, roads and services. Your assignment will take you from a Hong Kong study visit to a Shenzhen planning desk in 1998.","你是一名刚到深圳的规划助理。这座城市刚成为中国首批经济特区之一。周主任递给你一张地图，让你记录城市怎样安排新工厂、住房、道路和公共服务。你的任务会从香港考察一路延伸到 1998 年深圳的规划工作台。"],
  note:["Zhou, Lin, Chen and Mei are fictional guides. Player choices and mapped outcomes are teaching scenarios. Archive panels distinguish documented events from interpretation.","周主任、小林、陈工和小梅是虚构的教学角色。玩家选择和地图结果是教学情境。档案会标明史实依据，并区分史实与分析。"]
};
