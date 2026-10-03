export const dishes = [
  { id: 'roujiamo', name: '肉夹馍', pinyin: 'RÒU JIĀ MÓ', category: '小吃 · 主食', note: '白吉馍夹腊汁肉，酥香与软糯相逢。', tone: '#b56e4a', accent: '#d7a855', locations: 12, price: '¥12–22', tags: ['单品', '外带', '街边'], ingredients: ['白吉馍', '腊汁肉', '香料'], history: '西安街头最具辨识度的日常味道之一，讲究馍酥、肉烂、汁香。', steps: ['炕制白吉馍', '慢火煨肉', '切肉夹馍', '趁热入口'], sourceIds: ['seed-roujiamo'] },
  { id: 'yangroupaomo', name: '羊肉泡馍', pinyin: 'YÁNG RÒU PÀO MÓ', category: '汤食 · 主食', note: '掰馍入汤，慢慢吃出一碗关中日常。', tone: '#9c704b', accent: '#d7a855', locations: 8, price: '¥28–58', tags: ['堂食', '老字号'], ingredients: ['馍块', '羊肉', '清汤', '粉丝'], history: '羊肉泡馍把“怎么吃”也变成了文化体验，掰馍的大小会影响汤汁的吸附。', steps: ['手掰馍块', '清汤煮羊肉', '入馍煨透', '撒香菜粉丝'], sourceIds: ['seed-yangroupaomo'] },
  { id: 'liangpi', name: '凉皮', pinyin: 'LIÁNG PÍ', category: '小吃 · 凉菜', note: '面皮、辣油、醋汁和面筋的爽利组合。', tone: '#c3a35c', accent: '#d64545', locations: 18, price: '¥8–18', tags: ['边走边吃', '外带'], ingredients: ['面皮', '面筋', '豆芽', '辣椒油'], history: '凉皮的好吃在于“现拌”的瞬间：酸、辣、香、脆在碗里同时醒来。', steps: ['蒸制面皮', '切条拌匀', '加入面筋', '淋红油醋汁'], sourceIds: ['seed-liangpi'] },
  { id: 'youpomian', name: '油泼面', pinyin: 'YÓU PŌ MIÀN', category: '面食 · 热食', note: '热油浇过辣椒面与蒜末，香气先抵达。', tone: '#bd7045', accent: '#d64545', locations: 14, price: '¥12–26', tags: ['面馆', '巷子'], ingredients: ['宽面', '辣椒面', '蒜末', '热油'], history: '宽面讲究筋道，油泼的瞬间是这碗面最具戏剧性的“起笔”。', steps: ['和面醒面', '抻成长面', '铺辣椒蒜末', '热油激香'], sourceIds: ['seed-youpomian'] },
  { id: 'saozimian', name: '臊子面', pinyin: 'SĀO ZI MIÀN', category: '面食 · 汤食', note: '酸辣汤头配五色臊子，清亮又热闹。', tone: '#8d7153', accent: '#d7a855', locations: 7, price: '¥12–24', tags: ['社区店', '堂食'], ingredients: ['面条', '肉丁', '蛋皮', '豆腐', '木耳'], history: '臊子面的“五色”让一碗面拥有了关中餐桌的秩序与喜气。', steps: ['熬酸汤', '炒臊子', '配五色菜', '薄面入碗'], sourceIds: ['seed-saozimian'] },
  { id: 'guantangbao', name: '灌汤包', pinyin: 'GUÀN TĀNG BĀO', category: '点心 · 小吃', note: '薄皮包裹汤汁，先开窗，再小口。', tone: '#b99a67', accent: '#61d0be', locations: 6, price: '¥18–38', tags: ['老字号', '堂食'], ingredients: ['薄皮', '肉馅', '汤汁', '姜丝'], history: '灌汤包的体验从“怎么吃”开始，轻提、开窗、吸汤，再品馅香。', steps: ['制皮擀皮', '包入肉馅汤冻', '蒸笼蒸熟', '蘸醋入口'], sourceIds: ['seed-guantangbao'] },
  { id: 'zenggao', name: '甑糕', pinyin: 'ZÈNG GĀO', category: '甜食 · 小吃', note: '糯米、红枣、芸豆一层层蒸出甜香。', tone: '#8c4f43', accent: '#d7a855', locations: 10, price: '¥8–20', tags: ['甜食', '街边'], ingredients: ['糯米', '红枣', '芸豆', '糖桂花'], history: '甑糕的层次感来自时间和蒸汽，热气揭开时，红枣香会先一步散出来。', steps: ['泡发糯米', '铺叠食材', '甑中蒸制', '热切分装'], sourceIds: ['seed-zenggao'] },
  { id: 'hulutou', name: '葫芦头泡馍', pinyin: 'HÚ LU TÓU PÀO MÓ', category: '汤食 · 老字号', note: '肥肠与馍同煮，汤鲜味浓，是地道的西安老字号吃法。', tone: '#80614e', accent: '#61d0be', locations: 5, price: '¥25–48', tags: ['老字号', '堂食'], ingredients: ['馍块', '肠段', '骨汤', '香料'], history: '葫芦头泡馍将猪肠的浓香纳入一碗热汤，属于西安本地人熟悉的重口味记忆。', steps: ['处理肠段', '熬骨汤', '馍块入锅', '撒香料上桌'], sourceIds: ['seed-hulutou'] },
]

export const places = [
  { id: 1, name: '洒金桥巷口', type: '巷子小店', area: '莲湖区 · 洒金桥', dish: '凉皮 / 肉夹馍', price: '人均 ¥25', mode: '边走边吃', status: '演示营业中', distance: '1.2 km', score: '4.7', risk: '演示风险：晚间排队约 15 分钟', sourceIds: ['seed-place-sajinqiao'] },
  { id: 2, name: '钟楼西侧食集', type: '美食街', area: '钟楼商圈', dish: '甑糕 / 灌汤包 / 凉皮', price: '人均 ¥45', mode: '街区串联', status: '演示营业中', distance: '0.8 km', score: '4.5', risk: '演示风险：周末客流较高', sourceIds: ['seed-place-bell'] },
  { id: 3, name: '城墙根面馆', type: '社区餐馆', area: '碑林区 · 城墙南门', dish: '油泼面 / 臊子面', price: '人均 ¥28', mode: '坐下慢吃', status: '演示营业中', distance: '2.1 km', score: '4.8', risk: '演示风险：14:00–17:00 午间休息', sourceIds: ['seed-place-wall'] },
]

export const sources = [
  { id: 'demo-seed', title: '原型演示 seed 数据', kind: 'demo_seed', capturedAt: '2026-10-04', verification: 'demo', note: '仅用于验证产品结构，提交前需逐条替换为真实证据。' },
  { id: 'seed-roujiamo', title: '肉夹馍内容占位来源', kind: 'demo_seed', capturedAt: '2026-10-04', verification: 'demo', note: '菜品内容待绑定官方/文旅/商家来源。' },
  { id: 'seed-yangroupaomo', title: '羊肉泡馍内容占位来源', kind: 'demo_seed', capturedAt: '2026-10-04', verification: 'demo', note: '菜品内容待绑定官方/文旅/商家来源。' },
  { id: 'seed-liangpi', title: '凉皮内容占位来源', kind: 'demo_seed', capturedAt: '2026-10-04', verification: 'demo', note: '菜品内容待绑定官方/文旅/商家来源。' },
  { id: 'seed-youpomian', title: '油泼面内容占位来源', kind: 'demo_seed', capturedAt: '2026-10-04', verification: 'demo', note: '菜品内容待绑定官方/文旅/商家来源。' },
  { id: 'seed-saozimian', title: '臊子面内容占位来源', kind: 'demo_seed', capturedAt: '2026-10-04', verification: 'demo', note: '菜品内容待绑定官方/文旅/商家来源。' },
  { id: 'seed-guantangbao', title: '灌汤包内容占位来源', kind: 'demo_seed', capturedAt: '2026-10-04', verification: 'demo', note: '菜品内容待绑定官方/文旅/商家来源。' },
  { id: 'seed-zenggao', title: '甑糕内容占位来源', kind: 'demo_seed', capturedAt: '2026-10-04', verification: 'demo', note: '菜品内容待绑定官方/文旅/商家来源。' },
  { id: 'seed-hulutou', title: '葫芦头泡馍内容占位来源', kind: 'demo_seed', capturedAt: '2026-10-04', verification: 'demo', note: '菜品内容待绑定官方/文旅/商家来源。' },
  { id: 'seed-place-sajinqiao', title: '洒金桥巷口地点占位来源', kind: 'demo_seed', capturedAt: '2026-10-04', verification: 'demo', note: '地点、价格、评分和营业状态均为演示。' },
  { id: 'seed-place-bell', title: '钟楼西侧食集地点占位来源', kind: 'demo_seed', capturedAt: '2026-10-04', verification: 'demo', note: '地点、价格、评分和营业状态均为演示。' },
  { id: 'seed-place-wall', title: '城墙根面馆地点占位来源', kind: 'demo_seed', capturedAt: '2026-10-04', verification: 'demo', note: '地点、价格、评分和营业状态均为演示。' },
]
