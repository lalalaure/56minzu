/**
 * 56个民族完整文化数据集
 * ============================================================
 * 数据来源声明（所有数据均有据可查）:
 *
 * 民族名称/罗马拼写/字母代码: GB/T 3304-1991《中国各民族名称的罗马字母拼写法和代码》
 *    → 国家标准全文公开系统: http://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=E5C3271B62636C5DA6853A0DA23EBBA9
 *
 * 人口数据: 第七次全国人口普查（2020年）公报 第二号
 *    → 国家统计局: https://www.gov.cn/guoqing/2021-05/13/content_5606149.htm
 *
 * 主要分布地: 第六次/第七次全国人口普查民族分布数据 + 行政区划资料
 *
 * 传统节日: 国家民委官网民族文化栏目 + 各地方政府民族文化资料
 *    → 国家民委: https://www.neac.gov.cn
 *
 * 文化物品/非遗: 中国非物质文化遗产网
 *    → https://www.ihchina.cn
 *
 * 传统纹样: 中国非物质文化遗产网 + 学术文献
 *
 * 传统色彩: 中国传统色卡库 (zerosoul/chinese-colors)
 *    → https://colors.ichuantong.cn
 *
 * 服饰: 学术文献及民族文化资料
 * ============================================================
 */

const ETHNIC_GROUPS = [
  {
    id: 1, name: '汉族', romanName: 'Han', code: 'HA',
    population: '12.84亿', // Source: 七普公报
    region: '全国各地',
    festival: '春节', festivalDetail: '农历正月初一，辞旧迎新，阖家团圆。为中国最隆重的传统节日。',
    item: '中国结', itemCategory: '工艺品',
    itemDetail: '传统装饰结艺，以丝线编结而成，象征吉祥如意、团圆美满。渊源可溯至上古结绳记事。',
    pattern: '祥云纹', patternDetail: '旋转式云气造型，最早见于商周青铜器，寓意吉祥高升。',
    colors: ['#CC1A1A','#E8B830','#2C1810','#1A4477','#F5E6C8'],
    chineseColors: ['朱砂#FF4612','胭脂#9E2A2B','缃叶#E8C87A','檀色#B36D61','月白#D6ECF0'],
    garmentNote: '汉服交领右衽，色彩随朝代流变，红为节庆主色。',
    description: '中国主体民族，占全国人口约91%，是世界上人口最多的民族。创造了以四大发明、诗书礼乐为代表的灿烂文明。',
    itemDrawParams: { type: 'knot', color: '#CC1A1A', accentColor: '#E8B830' }
  },
  {
    id: 2, name: '蒙古族', romanName: 'Mongol', code: 'MG',
    population: '629万', // Source: 七普公报
    region: '内蒙古、辽宁、吉林、黑龙江、新疆、青海',
    festival: '那达慕', festivalDetail: '农历六~八月，草原传统体育盛会，含赛马、摔跤、射箭，为国家级非遗。',
    item: '马头琴', itemCategory: '乐器',
    itemDetail: '蒙古族传统弓弦乐器，琴杆上端雕有马头，音色圆润深沉，2006年列入国家级非遗。',
    pattern: '云纹 / 盘肠纹', patternDetail: '云纹象征腾升吉祥；盘肠纹（吉祥结）为蒙古族传统编织图案，寓意长寿永恒。',
    colors: ['#1E5B94','#F5F5F5','#CC3333','#8B4513','#D4A017'],
    chineseColors: ['黛蓝#425066','月白#D6ECF0','银红#B3446C','驼色#A87B51','密陀僧#C96A2B'],
    garmentNote: '蒙古袍（德勒）右衽斜襟，腰束彩带，以蓝（天）白（云）红（火）为尊。',
    description: '游牧民族，主要聚居内蒙古高原。以"蒙古包"为传统居所，那达慕大会闻名于世。',
    itemDrawParams: { type: 'morinKhuur', color: '#8B4513', accentColor: '#F5F5F5' }
  },
  {
    id: 3, name: '回族', romanName: 'Hui', code: 'HU',
    population: '1138万', // Source: 七普公报
    region: '宁夏、甘肃、新疆、青海、河南、河北、山东、云南',
    festival: '开斋节', festivalDetail: '伊斯兰教历十月一日，结束斋月的庆祝，举行会礼、走亲访友。',
    item: '汤瓶', itemCategory: '日用器物',
    itemDetail: '回族传统洗漱壶具，用于礼拜前净手净面，造型独特，是回族文化标志性器物之一。',
    pattern: '阿拉伯纹样 / 植物几何纹', patternDetail: '以几何图形和植物花卉为主的装饰纹样，受伊斯兰文化影响，常出现在清真寺建筑和日用器物上。',
    colors: ['#1A5B2A','#D4A017','#F5F5F0','#CC3333','#2C1810'],
    chineseColors: ['松花绿#057748','秋香#D9B611','宣纸白#F5F0E8','朱砂#FF4612','檀色#B36D61'],
    garmentNote: '回族男子戴白色无檐小帽（号帽），女子戴盖头，尚白喜绿。',
    description: '中国分布最广的少数民族，由中亚等地穆斯林与汉、蒙古等族融合形成。',
    itemDrawParams: { type: 'teapot', color: '#1A5B2A', accentColor: '#D4A017' }
  },
  {
    id: 4, name: '藏族', romanName: 'Zang', code: 'ZA',
    population: '706万', // Source: 七普公报
    region: '西藏、四川、青海、甘肃、云南',
    festival: '藏历年 / 雪顿节', festivalDetail: '藏历正月初一为藏历年；雪顿节在藏历六月，以晒佛、藏戏著称。',
    item: '转经筒', itemCategory: '宗教法器',
    itemDetail: '藏传佛教法器，内置经文，转动一圈同诵经一遍。有手摇式和固定式两种。',
    pattern: '吉祥八宝', patternDetail: '藏传佛教八种吉祥符号：宝伞、金鱼、宝瓶、莲花、白海螺、吉祥结、胜利幢、法轮。',
    colors: ['#8B1A1A','#D4A017','#1A5276','#F5F5F0','#2C1810'],
    chineseColors: ['佛赤#D43D1A','金驼#D4A017','藏蓝#1A4A7A','宣纸白#F5F0E8','紫檀#4C2F3D'],
    garmentNote: '藏袍（楚巴）右衽长袍，腰系"邦典"（彩色条纹围裙），以红黄蓝为常用色。',
    description: '世居青藏高原，拥有独特的天文历法、藏医药和唐卡艺术，信仰藏传佛教。',
    itemDrawParams: { type: 'prayerWheel', color: '#D4A017', accentColor: '#8B1A1A' }
  },
  {
    id: 5, name: '维吾尔族', romanName: 'Uyghur', code: 'UG',
    population: '1177万', // Source: 七普公报
    region: '新疆维吾尔自治区',
    festival: '古尔邦节', festivalDetail: '伊斯兰教历十二月十日，又称宰牲节，举行会礼、宰牲等仪式。',
    item: '达甫鼓', itemCategory: '乐器',
    itemDetail: '维吾尔族传统手鼓，木框一面蒙羊皮，框内嵌小铁环，是木卡姆音乐重要乐器。',
    pattern: '石榴纹 / 花草纹', patternDetail: '石榴在伊斯兰文化中象征丰饶，花草纹以缠枝卷草为特征，常用于建筑和织物。',
    colors: ['#2E7D32','#CC3333','#D4A017','#1A5B8C','#F5F5F0'],
    chineseColors: ['松花绿#057748','朱砂#FF4612','金驼#D4A017','青金石#1A5B8C','月白#D6ECF0'],
    garmentNote: '男子穿"袷袢"（无扣长袍），女子穿色彩艳丽的连衣裙，头戴"多帕"四楞花帽。',
    description: '主要聚居新疆，以绿洲农耕著称。十二木卡姆被誉为"东方音乐的明珠"。',
    itemDrawParams: { type: 'dap', color: '#8B4513', accentColor: '#DEB887' }
  },
  {
    id: 6, name: '苗族', romanName: 'Miao', code: 'MH',
    population: '1107万', // Source: 七普公报
    region: '贵州、湖南、云南、重庆、广西',
    festival: '苗年', festivalDetail: '农历十月左右，庆祝丰收，历时数天，含芦笙舞、斗牛等活动。',
    item: '银角头饰', itemCategory: '银饰',
    itemDetail: '苗族女性盛大银饰头冠，呈牛角形双弧弯起，刻有蝴蝶、鸟等图腾纹样，是苗族的重要文化符号。',
    pattern: '蝴蝶纹 / 鸟纹', patternDetail: '蝴蝶妈妈是苗族创世神话中的始祖，鸟是苗族"嘎闹"支系的图腾，常见于刺绣与银饰。',
    colors: ['#1A3A5C','#B0B0B0','#2C1810','#CC3333','#F5F5F0'],
    chineseColors: ['靛蓝#065279','银白#E8E8E8','檀色#B36D61','胭脂#9E2A2B','月白#D6ECF0'],
    garmentNote: '苗族服饰以青蓝为底，盛装满饰银片、银泡、银铃，百褶裙配大量银饰。',
    description: '历史悠久的山地民族，以银饰锻造、苗绣、蜡染工艺闻名于世。苗族银饰为国家级非遗。',
    itemDrawParams: { type: 'silverHorn', color: '#C0C0C0', accentColor: '#1A3A5C' }
  },
  {
    id: 7, name: '彝族', romanName: 'Yi', code: 'YI',
    population: '983万', // Source: 七普公报
    region: '云南、四川、贵州、广西',
    festival: '火把节', festivalDetail: '农历六月二十四日左右，点燃火把驱邪祈福，举行赛歌、斗牛等活动。',
    item: '漆器酒具', itemCategory: '漆器',
    itemDetail: '彝族传统漆器以木胎或皮胎髹漆，以黑为底，红黄绘纹，多用于餐具酒具，色彩浓烈。',
    pattern: '火焰纹 / 太阳纹', patternDetail: '彝族崇拜火，火焰纹和太阳纹是其核心视觉符号，常见于漆器和服饰刺绣。',
    colors: ['#1A1A1A','#CC2222','#E8B830','#2C1810','#F5F5F0'],
    chineseColors: ['墨色#1A1A1A','朱砂#FF4612','雌黄#FFD700','檀色#B36D61','月白#D6ECF0'],
    garmentNote: '彝族尚黑，以黑为尊，服饰多以黑色为底，红黄镶饰。女子着百褶裙，男子披"擦尔瓦"。',
    description: '西南古老的民族之一，拥有自己的历法（彝族十月太阳历）和文字（彝文）。',
    itemDrawParams: { type: 'lacquerCup', color: '#1A1A1A', accentColor: '#CC2222' }
  },
  {
    id: 8, name: '壮族', romanName: 'Zhuang', code: 'ZH',
    population: '1956万', // Source: 七普公报
    region: '广西、云南、广东、贵州',
    festival: '三月三', festivalDetail: '农历三月初三，歌圩盛会，青年男女对歌传情，做五色糯米饭。为广西法定假日。',
    item: '绣球', itemCategory: '工艺品',
    itemDetail: '壮族定情信物，由12片花瓣形布片缝成球状，绣以花卉瑞兽纹样，内装豆粟，下坠流苏。',
    pattern: '壮锦几何纹', patternDetail: '壮族传统织锦以几何图形为骨架，填充万字纹、回纹、菱形纹，色彩对比强烈。',
    colors: ['#1A3A6A','#CC3344','#E8B830','#2C1810','#F5F5F0'],
    chineseColors: ['靛蓝#065279','胭脂#9E2A2B','缃叶#E8C87A','檀色#B36D61','月白#D6ECF0'],
    garmentNote: '壮族传统服饰以自织自染的靛蓝土布为主，镶绣花边，喜戴银饰。',
    description: '中国人口最多的少数民族，以稻作农耕为传统，铜鼓文化历史悠久。',
    itemDrawParams: { type: 'embroideredBall', color: '#CC3344', accentColor: '#E8B830' }
  },
  {
    id: 9, name: '布依族', romanName: 'Buyei', code: 'BY',
    population: '358万', // Source: 七普公报
    region: '贵州（黔南、黔西南）、云南',
    festival: '六月六', festivalDetail: '农历六月初六，祭山神、土地神，对歌、赛马，布依族隆重节日。',
    item: '蜡染', itemCategory: '印染工艺',
    itemDetail: '布依族传统防染工艺，以蜡刀蘸蜡液在布上绘制纹样后浸染，形成蓝底白花的独特效果。为国家级非遗。',
    pattern: '涡纹 / 齿形纹', patternDetail: '布依族蜡染常见涡纹、齿形纹、菱形纹，源于对自然山水与几何的抽象表达。',
    colors: ['#1A4A7A','#F5F5F0','#2C7A3A','#CC3333','#D4A017'],
    chineseColors: ['靛蓝#065279','月白#D6ECF0','松花绿#057748','朱砂#FF4612','金驼#D4A017'],
    garmentNote: '布依族服饰以蓝靛染制的青蓝布为主，蜡染百褶裙配绣花围腰。',
    description: '贵州世居民族，以蜡染织锦闻名。善种水稻，有"水稻民族"之称。',
    itemDrawParams: { type: 'batik', color: '#1A4A7A', accentColor: '#F5F5F0' }
  },
  {
    id: 10, name: '朝鲜族', romanName: 'Chosen', code: 'CS',
    population: '170万', // Source: 七普公报
    region: '吉林、辽宁、黑龙江',
    festival: '流头节', festivalDetail: '农历六月十五，到向东流的溪水中洗头祈福，为朝鲜族传统节日。',
    item: '长鼓', itemCategory: '乐器',
    itemDetail: '朝鲜族传统打击乐器，呈哑铃形（束腰），双面蒙皮，音色高低不同，用于农乐舞和民俗表演。',
    pattern: '鹤纹 / 云纹', patternDetail: '朝鲜族崇尚仙鹤，鹤纹象征长寿高洁；云纹配鹤常见于服饰和绘画。',
    colors: ['#F5F5F0','#E8A0B0','#5B8CB8','#1A3A5A','#D4A017'],
    chineseColors: ['宣纸白#F5F0E8','粉黛#E8A0B0','黛蓝#425066','藏蓝#1A4A7A','金驼#D4A017'],
    garmentNote: '朝鲜族尚白，素有"白衣民族"之称。女装为短上衣（则高利）配长裙（契玛），男装为白衣黑裤。',
    description: '19世纪中叶从朝鲜半岛迁入中国东北，以水稻种植著称，泡菜和冷面为其代表饮食。',
    itemDrawParams: { type: 'janggu', color: '#E8A0B0', accentColor: '#F5F5F0' }
  },
  {
    id: 11, name: '满族', romanName: 'Man', code: 'MA',
    population: '1042万', // Source: 七普公报
    region: '辽宁、河北、黑龙江、吉林、内蒙古、北京',
    festival: '颁金节', festivalDetail: '农历十月十三日，纪念1635年"满洲"族称确立。',
    item: '旗头', itemCategory: '头饰',
    itemDetail: '满族妇女的扇形冠头饰，以青绒或青缎制成扇形硬板，上缀花卉珠宝，为清代宫廷服饰代表。',
    pattern: '八宝纹 / 团花纹', patternDetail: '八宝纹（轮螺伞盖花罐鱼肠）和团花（圆形花卉图案）为满族传统装饰纹样。',
    colors: ['#F5F5F5','#1A4477','#2A5A2A','#CC3333','#D4A017'],
    chineseColors: ['月白#D6ECF0','靛蓝#065279','松花绿#057748','朱砂#FF4612','金驼#D4A017'],
    garmentNote: '满族传统服饰以旗袍、马褂为代表，尚白，喜在领口袖口镶滚边。',
    description: '曾建立清朝（1644-1912），对中国近代历史影响深远。旗袍已成为中国女性服饰经典。',
    itemDrawParams: { type: 'headdress', color: '#1A4477', accentColor: '#F5F5F5' }
  },
  {
    id: 12, name: '侗族', romanName: 'Dong', code: 'DO',
    population: '350万', // Source: 七普公报
    region: '贵州（黔东南）、湖南、广西',
    festival: '侗年', festivalDetail: '农历十一月初一至初三，庆丰收、祭祖，举行踩歌堂、侗戏等活动。',
    item: '鼓楼', itemCategory: '建筑',
    itemDetail: '侗族标志性建筑，以杉木榫卯结构搭建，不用一钉一铆，为侗寨议事和社交中心。国家级非遗。',
    pattern: '几何纹 / 太阳纹', patternDetail: '侗族刺绣和建筑彩绘以几何纹、太阳纹、蜘蛛纹为特色，寓意吉祥。',
    colors: ['#1A3A1A','#D4A017','#CC3333','#F5F5F0','#8B4513'],
    chineseColors: ['墨绿#1A3A1A','金驼#D4A017','朱砂#FF4612','宣纸白#F5F0E8','檀色#B36D61'],
    garmentNote: '侗族服饰以自纺自织的侗布为主，青紫色亮布为盛装面料，银饰点缀。',
    description: '以侗族大歌闻名世界，多声部无伴奏合唱被誉为"天籁之音"。鼓楼和风雨桥是其建筑瑰宝。',
    itemDrawParams: { type: 'drumTower', color: '#1A3A1A', accentColor: '#D4A017' }
  },
  {
    id: 13, name: '瑶族', romanName: 'Yao', code: 'YA',
    population: '331万', // Source: 七普公报
    region: '广西、湖南、广东、云南、贵州',
    festival: '盘王节', festivalDetail: '农历十月十六日，纪念始祖盘瓠，跳长鼓舞、唱盘王大歌。国家级非遗。',
    item: '长鼓', itemCategory: '乐器',
    itemDetail: '瑶族传统打击乐器，木质鼓身呈两头大中间细的喇叭形，蒙羊皮，是盘王节的核心乐器。',
    pattern: '八角花纹 / 犬纹', patternDetail: '八角花象征吉祥，犬纹源于瑶族盘瓠崇拜，常见于服饰刺绣。',
    colors: ['#CC3333','#1A3A5A','#D4A017','#2C1810','#F5F5F0'],
    chineseColors: ['朱砂#FF4612','靛蓝#065279','金驼#D4A017','檀色#B36D61','月白#D6ECF0'],
    garmentNote: '瑶族服饰以红瑶、白裤瑶、花瑶等支系区分，喜用红、白、蓝三色配以精美刺绣。',
    description: '分布于南方山区的古老民族，以盘瓠为始祖，"盘王节"为最隆重的民族节日。',
    itemDrawParams: { type: 'janggu', color: '#CC3333', accentColor: '#D4A017' }
  },
  {
    id: 14, name: '白族', romanName: 'Bai', code: 'BA',
    population: '209万', // Source: 七普公报
    region: '云南（大理）、贵州、湖南',
    festival: '三月街', festivalDetail: '农历三月十五至二十一日，大理传统贸易集市和赛马盛会。',
    item: '扎染', itemCategory: '印染工艺',
    itemDetail: '白族传统防染技艺，以线扎结布料后浸染，形成独特的晕染花纹。大理周城扎染为国家级非遗。',
    pattern: '花草纹 / 几何纹', patternDetail: '白族扎染以花卉、蝴蝶、几何图形为主，蓝白配色清新典雅。',
    colors: ['#1A4A7A','#F5F5F0','#CC3333','#D4A017','#2C1810'],
    chineseColors: ['靛蓝#065279','月白#D6ECF0','胭脂#9E2A2B','缃叶#E8C87A','檀色#B36D61'],
    garmentNote: '白族崇尚白色，以白为贵。男子白衣白裤，女子白衣配红色或蓝色围裙。',
    description: '主要聚居云南大理，以苍山洱海为家园。白族建筑"三坊一照壁"独具特色。',
    itemDrawParams: { type: 'batik', color: '#1A4A7A', accentColor: '#F5F5F0' }
  },
  {
    id: 15, name: '土家族', romanName: 'Tujia', code: 'TJ',
    population: '959万', // Source: 七普公报
    region: '湖南、湖北、贵州、重庆',
    festival: '赶年', festivalDetail: '土家族提前一天过春节，即腊月二十九或二十八过年，源于抗倭传说。',
    item: '西兰卡普', itemCategory: '织锦',
    itemDetail: '土家族传统织锦，以丝线和棉线在斜织机上挑织而成，图案古朴色彩浓烈，为国家级非遗。',
    pattern: '万字纹 / 勾纹', patternDetail: '土家织锦以万字纹、八勾、十二勾等几何纹样为骨架，色彩对比强烈。',
    colors: ['#CC3333','#1A3A5A','#D4A017','#1A1A1A','#F5F5F0'],
    chineseColors: ['朱砂#FF4612','靛蓝#065279','金驼#D4A017','墨色#1A1A1A','月白#D6ECF0'],
    garmentNote: '土家族服饰尚红黑，男子头缠青丝帕，女子穿"八幅罗裙"配绣花围腰。',
    description: '湘鄂渝黔交界处的山地民族，以吊脚楼、西兰卡普织锦和摆手舞闻名。',
    itemDrawParams: { type: 'brocade', color: '#CC3333', accentColor: '#D4A017' }
  },
  {
    id: 16, name: '哈尼族', romanName: 'Hani', code: 'HN',
    population: '173万', // Source: 七普公报
    region: '云南（红河、普洱、西双版纳）',
    festival: '苦扎扎', festivalDetail: '农历六月，欢度为期3-5天的民族节日，祭神祈年、荡秋千、歌舞。',
    item: '梯田', itemCategory: '农业遗产',
    itemDetail: '哈尼族世世代代开垦的梯田景观，以云南元阳哈尼梯田最为壮观，2013年列入世界遗产。',
    pattern: '水波纹 / 梯田纹', patternDetail: '哈尼族服饰刺绣常见水波纹和几何梯田纹样，反映其稻作农耕文化。',
    colors: ['#1A3A1A','#D4A017','#CC3333','#F5F5F0','#1A4A7A'],
    chineseColors: ['墨绿#1A3A1A','金驼#D4A017','朱砂#FF4612','月白#D6ECF0','靛蓝#065279'],
    garmentNote: '哈尼族尚黑，服饰以黑色为底，配银泡和彩色绣边。叶车支系女子戴白色尖顶帽。',
    description: '以元阳梯田闻名世界，创造了举世瞩目的稻作梯田文明。红河哈尼梯田为世界遗产。',
    itemDrawParams: { type: 'terracedField', color: '#1A3A1A', accentColor: '#D4A017' }
  },
  {
    id: 17, name: '哈萨克族', romanName: 'Kazak', code: 'KZ',
    population: '156万', // Source: 七普公报
    region: '新疆（伊犁、阿勒泰、塔城）',
    festival: '纳吾热孜节', festivalDetail: '哈萨克族传统新年，春分日（3月21日左右），喝纳吾热孜粥、辞旧迎新。',
    item: '冬不拉', itemCategory: '乐器',
    itemDetail: '哈萨克族传统弹拨乐器，梨形琴身配长颈，两根弦，音色柔美，常用于叙事歌伴奏。',
    pattern: '羊角纹 / 花草纹', patternDetail: '羊角纹是哈萨克族最经典的装饰元素，源于游牧生活中的羊崇拜，常见于刺绣和毡毯。',
    colors: ['#1A3A5A','#CC3333','#D4A017','#F5F5F0','#2C1810'],
    chineseColors: ['藏蓝#1A4A7A','胭脂#9E2A2B','金驼#D4A017','月白#D6ECF0','檀色#B36D61'],
    garmentNote: '哈萨克族传统服饰多用羊皮、马皮制作，男子戴三叶帽，女子穿绣花连衣裙戴套头帽。',
    description: '跨国游牧民族，以"阿肯弹唱"闻名。冬不拉琴声伴随游牧迁徙，是草原文化的代表。',
    itemDrawParams: { type: 'lute', color: '#8B4513', accentColor: '#D4A017' }
  },
  {
    id: 18, name: '傣族', romanName: 'Dai', code: 'DA',
    population: '133万', // Source: 七普公报
    region: '云南（西双版纳、德宏）',
    festival: '泼水节', festivalDetail: '傣历六月（公历4月），相互泼水祝福，赛龙舟、放高升。为傣族新年。',
    item: '象脚鼓', itemCategory: '乐器',
    itemDetail: '傣族传统打击乐器，形似象脚，以芒果树或木棉树镂空蒙皮制成，是泼水节和孔雀舞的主要伴奏。',
    pattern: '水波纹 / 孔雀纹', patternDetail: '水波纹象征澜沧江，孔雀纹为傣族吉祥图腾，象征美丽善良。常见于织锦与壁画。',
    colors: ['#1A1A2E','#CC2222','#D4A017','#1A7A5A','#F5F5F0'],
    chineseColors: ['藏蓝#1A4A7A','朱砂#FF4612','金驼#D4A017','松花绿#057748','月白#D6ECF0'],
    garmentNote: '傣族女子穿紧身窄袖上衣配彩色筒裙（身筒），男子穿无领对襟衫。花腰傣尚黑红。',
    description: '主要聚居云南边境，信仰南传上座部佛教，以傣历、傣文和孔雀舞闻名。',
    itemDrawParams: { type: 'elephantDrum', color: '#8B4513', accentColor: '#D4A017' }
  },
  {
    id: 19, name: '黎族', romanName: 'Li', code: 'LI',
    population: '160万', // Source: 七普公报
    region: '海南',
    festival: '三月三', festivalDetail: '农历三月初三，祭祖、对歌、跳竹竿舞，为黎族最盛大的传统节日。',
    item: '黎锦', itemCategory: '织锦',
    itemDetail: '海南黎族传统织锦，以棉线经纬交织，图案丰富色彩鲜明，为国家级非遗。黎锦技艺被联合国教科文组织列入急需保护非遗名录。',
    pattern: '人形纹 / 青蛙纹', patternDetail: '黎锦最具代表性的纹样是人形纹和青蛙纹，反映了黎族对祖先和生殖崇拜的信仰。',
    colors: ['#1A1A1A','#CC3333','#D4A017','#1A4A7A','#F5F5F0'],
    chineseColors: ['墨色#1A1A1A','朱砂#FF4612','金驼#D4A017','靛蓝#065279','月白#D6ECF0'],
    garmentNote: '黎族女子着对襟无扣上衣配筒裙，喜戴银质项圈和耳环。各个方言区服饰差异明显。',
    description: '海南最早的世居民族，以黎锦织造、纹身文化和船型屋闻名。',
    itemDrawParams: { type: 'brocade', color: '#CC3333', accentColor: '#D4A017' }
  },
  {
    id: 20, name: '傈僳族', romanName: 'Lisu', code: 'LS',
    population: '76万', // Source: 七普公报
    region: '云南（怒江、丽江、迪庆）、四川',
    festival: '阔时节', festivalDetail: '傈僳族传统新年，通常在农历十二月，举行射弩、对歌、跳嘎等传统活动。',
    item: '弩弓', itemCategory: '狩猎工具',
    itemDetail: '傈僳族传统狩猎工具，以坚韧的竹片和麻绳制成，是傈僳男子的必备之物，射弩比赛为阔时节重要活动。',
    pattern: '菱形纹 / 箭纹', patternDetail: '傈僳族服饰刺绣以菱形纹、箭纹和水波纹为主，色彩鲜艳，反映山地狩猎文化。',
    colors: ['#CC3333','#1A3A5A','#D4A017','#1A1A1A','#F5F5F0'],
    chineseColors: ['朱砂#FF4612','靛蓝#065279','金驼#D4A017','墨色#1A1A1A','月白#D6ECF0'],
    garmentNote: '傈僳族服饰以黑蓝为底，镶红黄边饰。女子穿百褶裙配珠链，男子穿麻布衣配砍刀。',
    description: '居住于怒江大峡谷两岸的山地民族，以"刀山火海"的勇士传统和"阔时节"闻名。',
    itemDrawParams: { type: 'crossbow', color: '#CC3333', accentColor: '#1A3A5A' }
  },
  {
    id: 21, name: '佤族', romanName: 'Va', code: 'VA',
    population: '43万', // Source: 七普公报
    region: '云南（沧源、西盟）',
    festival: '木鼓节', festivalDetail: '佤族传统节日，拉木鼓、祭木鼓、剽牛，是佤族最隆重的宗教祭祀活动。',
    item: '木鼓', itemCategory: '乐器/法器',
    itemDetail: '佤族神圣的祭祀乐器，以整段红毛树干镂空制成，被视为通天的神器。木鼓文化为国家级非遗。',
    pattern: '三角纹 / 人形纹', patternDetail: '佤族服饰和壁画以三角纹、菱形纹和人形纹为主，木鼓舞中常见红色和黑色的强烈对比。',
    colors: ['#CC2222','#1A1A1A','#D4A017','#2C1810','#F5F5F0'],
    chineseColors: ['朱砂#FF4612','墨色#1A1A1A','金驼#D4A017','檀色#B36D61','月白#D6ECF0'],
    garmentNote: '佤族尚红黑，男子穿无领短衣，女子穿无袖短衣配筒裙，喜戴银箍和藤圈。',
    description: '云南西南部古老的跨境民族，以木鼓文化和沧源崖画闻名。崇尚红色和黑色。',
    itemDrawParams: { type: 'woodDrum', color: '#5C3A1E', accentColor: '#CC2222' }
  },
  {
    id: 22, name: '畲族', romanName: 'She', code: 'SH',
    population: '75万', // Source: 七普公报
    region: '福建、浙江、江西、安徽、广东',
    festival: '三月三', festivalDetail: '农历三月初三，畲族传统节日，吃乌米饭、祭祖、对歌。',
    item: '凤凰装', itemCategory: '服饰',
    itemDetail: '畲族女性传统盛装，以凤凰为主题，头戴凤冠，衣饰绣有凤凰、花卉等纹样，色彩绚丽。',
    pattern: '凤凰纹 / 几何纹', patternDetail: '凤凰纹是畲族的核心图腾，配合几何纹样，常见于服饰刺绣和生活器具。',
    colors: ['#CC3333','#1A3A6A','#D4A017','#2C1810','#F5F5F0'],
    chineseColors: ['朱砂#FF4612','靛蓝#065279','金驼#D4A017','檀色#B36D61','月白#D6ECF0'],
    garmentNote: '畲族女性"凤凰装"最具特色，以红为主色，配以各色镶边和绣花，头戴凤冠。',
    description: '东南沿海山区民族，以盘瓠为始祖。善唱山歌，有"歌言"文化传统。',
    itemDrawParams: { type: 'headdress', color: '#CC3333', accentColor: '#D4A017' }
  },
  {
    id: 23, name: '高山族', romanName: 'Gaoshan', code: 'GS',
    population: '3479人', // Source: 七普公报
    region: '台湾、福建、河南、广西',
    festival: '丰年祭', festivalDetail: '每年秋收后举行，感恩庆祝丰收，包含祭祖、歌舞、竞技等活动。',
    item: '木雕', itemCategory: '工艺品',
    itemDetail: '高山族传统木雕以祖先像、百步蛇、鹿等为题材，用于房屋装饰和宗教器物。是台湾原住民的标志性艺术。',
    pattern: '人形纹 / 蛇纹', patternDetail: '人形纹和百步蛇纹为高山族最具代表性的图腾纹样，见于木雕和服饰。',
    colors: ['#CC3333','#1A1A1A','#D4A017','#1A4A7A','#F5F5F0'],
    chineseColors: ['朱砂#FF4612','墨色#1A1A1A','金驼#D4A017','靛蓝#065279','月白#D6ECF0'],
    garmentNote: '高山族各支系服饰差异大，常见贝珠衣、刺绣和羽饰，多用红、黑、白三色。',
    description: '台湾岛最早的世居民族，包括阿美、泰雅、排湾等多个支系。丰年祭为最隆重的传统节日。',
    itemDrawParams: { type: 'woodCarving', color: '#CC3333', accentColor: '#1A1A1A' }
  },
  {
    id: 24, name: '拉祜族', romanName: 'Lahu', code: 'LH',
    population: '50万', // Source: 七普公报
    region: '云南（澜沧、孟连、西双版纳）',
    festival: '葫芦节', festivalDetail: '拉祜族传统节日，纪念祖先从葫芦中诞生的创世神话，为期数天，含芦笙舞等活动。',
    item: '葫芦笙', itemCategory: '乐器',
    itemDetail: '拉祜族传统吹奏乐器，以葫芦为共鸣箱配竹管制成，是葫芦节和日常歌舞的重要乐器。',
    pattern: '葫芦纹 / 几何纹', patternDetail: '葫芦纹源于拉祜族创世神话（人从葫芦出），是拉祜族最具象征意义的纹样。',
    colors: ['#1A1A1A','#CC3333','#D4A017','#1A5A2A','#F5F5F0'],
    chineseColors: ['墨色#1A1A1A','朱砂#FF4612','金驼#D4A017','松花绿#057748','月白#D6ECF0'],
    garmentNote: '拉祜族尚黑，以黑为美。男子黑衣黑裤，女子黑衣配彩色条纹长裙。',
    description: '云南西南部山地民族，以"葫芦节"和芦笙舞闻名。拉祜语称"拉祜"为"烤虎肉"之意。',
    itemDrawParams: { type: 'gourdSheng', color: '#D4A017', accentColor: '#1A1A1A' }
  },
  {
    id: 25, name: '水族', romanName: 'Sui', code: 'SU',
    population: '50万', // Source: 七普公报
    region: '贵州（三都、荔波）、广西',
    festival: '端节', festivalDetail: '水族历法年底至次年年初（农历八月至十月）分批过端，相当于水族新年，赛马为重要活动。',
    item: '水书', itemCategory: '文字古籍',
    itemDetail: '水族古老的象形文字及文献，被誉为"活着的象形文字"，2006年列入国家级非遗。主要用于占卜和历法。',
    pattern: '水书符文 / 螺旋纹', patternDetail: '水族刺绣和马尾绣中常见螺旋纹、水波纹和具有水书特征的符号纹样。',
    colors: ['#1A3A5A','#CC3333','#D4A017','#1A1A1A','#F5F5F0'],
    chineseColors: ['靛蓝#065279','胭脂#9E2A2B','金驼#D4A017','墨色#1A1A1A','月白#D6ECF0'],
    garmentNote: '水族服饰以青蓝为主色，女子穿靛蓝长衫配绣花围腰，喜戴银饰。',
    description: '拥有古老的象形文字"水书"和独特的"端节"历法。马尾绣技艺精湛，为国家级非遗。',
    itemDrawParams: { type: 'shuiScript', color: '#1A3A5A', accentColor: '#D4A017' }
  },
  {
    id: 26, name: '东乡族', romanName: 'Dongxiang', code: 'DX',
    population: '77万', // Source: 七普公报
    region: '甘肃（临夏东乡族自治县）、新疆',
    festival: '开斋节', festivalDetail: '伊斯兰教历十月一日，结束斋月，举行会礼和庆祝活动。',
    item: '东乡擀毡', itemCategory: '手工艺',
    itemDetail: '东乡族传统毛毡制作技艺，以羊毛为原料经擀制而成，是东乡族人生活中重要的御寒用品。为省级非遗。',
    pattern: '几何纹 / 花草纹', patternDetail: '东乡族刺绣和建筑装饰以几何图案和花卉纹样为主，受伊斯兰文化影响。',
    colors: ['#1A5A2A','#D4A017','#F5F5F0','#CC3333','#8B4513'],
    chineseColors: ['松花绿#057748','金驼#D4A017','宣纸白#F5F0E8','朱砂#FF4612','檀色#B36D61'],
    garmentNote: '东乡族服饰与回族相近，男子戴白色或黑色无檐帽，女子戴盖头。',
    description: '甘肃省特有的少数民族，自治地方为东乡族自治县。以东乡语和伊斯兰文化为特征。',
    itemDrawParams: { type: 'felt', color: '#1A5A2A', accentColor: '#D4A017' }
  },
  {
    id: 27, name: '纳西族', romanName: 'Naxi', code: 'NX',
    population: '32万', // Source: 七普公报
    region: '云南（丽江）、四川',
    festival: '三多节', festivalDetail: '农历二月初八，祭祀纳西族保护神"三多"，为纳西族最隆重的传统节日。',
    item: '东巴纸', itemCategory: '造纸工艺',
    itemDetail: '纳西族东巴文书写的特制纸张，以荛花树皮为原料，防虫耐存。东巴纸制作技艺为国家级非遗。',
    pattern: '东巴象形纹', patternDetail: '东巴文是世界上唯一仍在使用的象形文字，其文字符号本身就是独特的装饰纹样。',
    colors: ['#1A3A5A','#D4A017','#CC3333','#F5F5F0','#2C1810'],
    chineseColors: ['靛蓝#065279','金驼#D4A017','朱砂#FF4612','宣纸白#F5F0E8','檀色#B36D61'],
    garmentNote: '纳西族女子穿"披星戴月"羊皮披肩（七星披肩），蓝色或黑色宽腰大袖上衣配百褶围腰。',
    description: '以丽江古城为家园，拥有世界唯一活着的象形文字——东巴文。东巴文化是世界文化遗产。',
    itemDrawParams: { type: 'paper', color: '#1A3A5A', accentColor: '#D4A017' }
  },
  {
    id: 28, name: '景颇族', romanName: 'Jingpo', code: 'JP',
    population: '16万', // Source: 七普公报
    region: '云南（德宏）',
    festival: '目瑙纵歌', festivalDetail: '农历正月十五前后，大型集体舞蹈盛会，数千人共舞，为国家级非遗。',
    item: '目瑙示栋', itemCategory: '祭祀标志',
    itemDetail: '目瑙纵歌广场中央竖立的标志性木牌，绘有回旋纹和太阳纹，象征祖先迁徙路线和民族历史。',
    pattern: '回旋纹 / 太阳纹', patternDetail: '景颇族目瑙示栋上的回旋纹和太阳纹是最核心的视觉符号，代表生命和宇宙。',
    colors: ['#CC3333','#1A1A1A','#D4A017','#1A4A7A','#F5F5F0'],
    chineseColors: ['朱砂#FF4612','墨色#1A1A1A','金驼#D4A017','靛蓝#065279','月白#D6ECF0'],
    garmentNote: '景颇族服饰以黑色为底，配红绿色织锦和银泡。男子佩长刀，女子穿银饰盛装。',
    description: '云南西部跨境民族。目瑙纵歌是世界上最壮观的集体舞蹈之一。',
    itemDrawParams: { type: 'ceremonyPole', color: '#CC3333', accentColor: '#1A1A1A' }
  },
  {
    id: 29, name: '柯尔克孜族', romanName: 'Kirgiz', code: 'KG',
    population: '20万', // Source: 七普公报
    region: '新疆（克孜勒苏）',
    festival: '诺鲁孜节', festivalDetail: '春分日（3月21日），迎接新年，做诺鲁孜饭，举行赛马、叼羊等活动。',
    item: '考姆兹', itemCategory: '乐器',
    itemDetail: '柯尔克孜族传统弹拨乐器，梨形木制琴身配三根弦，音色清脆，是《玛纳斯》史诗的重要伴奏。',
    pattern: '羊角纹 / 山鹰纹', patternDetail: '柯尔克孜族刺绣和毡毯以羊角纹、山鹰纹为特色，反映高山游牧文化。',
    colors: ['#CC3333','#1A1A1A','#D4A017','#1A4A7A','#F5F5F0'],
    chineseColors: ['朱砂#FF4612','墨色#1A1A1A','金驼#D4A017','靛蓝#065279','月白#D6ECF0'],
    garmentNote: '柯尔克孜族男子戴白色毡帽（卡尔帕克），女子穿红色连衣裙佩戴银饰和绣花头巾。',
    description: '帕米尔高原游牧民族，以英雄史诗《玛纳斯》闻名世界，为世界级非遗。',
    itemDrawParams: { type: 'lute', color: '#8B4513', accentColor: '#CC3333' }
  },
  {
    id: 30, name: '土族', romanName: 'Tu', code: 'TU',
    population: '28万', // Source: 七普公报
    region: '青海（互助、民和）、甘肃',
    festival: '纳顿节', festivalDetail: '农历七月至九月，庆祝丰收的民间舞蹈盛会，包含面具舞、傩戏等。为国家级非遗。',
    item: '盘绣', itemCategory: '刺绣',
    itemDetail: '土族传统刺绣技艺，以七彩丝线在黑色布料上刺绣，图案精美色彩浓郁。土族盘绣为国家级非遗。',
    pattern: '太阳花 / 云纹', patternDetail: '太阳花和云纹是土族刺绣最核心的图案，色彩对比强烈，极富视觉冲击力。',
    colors: ['#1A3A5A','#CC3333','#D4A017','#1A5A2A','#F5F5F0'],
    chineseColors: ['靛蓝#065279','朱砂#FF4612','金驼#D4A017','松花绿#057748','月白#D6ECF0'],
    garmentNote: '土族服饰色彩艳丽，以七彩绣花为标志。女子穿七彩绣花长衫配绣花腰带。',
    description: '青海特有的少数民族，以七彩盘绣和纳顿节闻名。土族文化融合了蒙古、藏、汉等多元元素。',
    itemDrawParams: { type: 'embroidery', color: '#CC3333', accentColor: '#D4A017' }
  },
  {
    id: 31, name: '达斡尔族', romanName: 'Daur', code: 'DU',
    population: '13万', // Source: 七普公报
    region: '内蒙古、黑龙江、新疆',
    festival: '斡包节', festivalDetail: '每年春秋两季祭斡包（敖包），祈求风调雨顺、人畜平安。',
    item: '曲棍球', itemCategory: '体育运动',
    itemDetail: '达斡尔族传统体育运动"波依阔"，与现代曲棍球类似，已有上千年历史。莫力达瓦被誉为"曲棍球之乡"。',
    pattern: '回纹 / 云卷纹', patternDetail: '达斡尔族传统刺绣和桦树皮工艺品以回纹、云卷纹和几何花纹为主。',
    colors: ['#1A4A7A','#F5F5F0','#CC3333','#2C1810','#8B4513'],
    chineseColors: ['靛蓝#065279','月白#D6ECF0','胭脂#9E2A2B','檀色#B36D61','驼色#A87B51'],
    garmentNote: '达斡尔族男子穿蓝灰色长袍束腰带，女子穿绣花长袍。节日盛装喜用蓝色绸缎。',
    description: '北方渔猎民族，以曲棍球传统和桦树皮工艺品闻名。契丹后裔之一。',
    itemDrawParams: { type: 'hockey', color: '#1A4A7A', accentColor: '#F5F5F0' }
  },
  {
    id: 32, name: '仫佬族', romanName: 'Mulao', code: 'ML',
    population: '28万', // Source: 七普公报
    region: '广西（罗城）、贵州',
    festival: '依饭节', festivalDetail: '农历十月立冬后，仫佬族最隆重的节日，酬神还愿、祈求人畜平安。为国家级非遗。',
    item: '煤砂罐', itemCategory: '陶器',
    itemDetail: '仫佬族传统手工陶器，用当地煤矸石掺和白泥烧制而成，耐高温，用于煮食和蒸酒。',
    pattern: '花卉纹 / 几何纹', patternDetail: '仫佬族刺绣和建筑装饰以花卉纹和几何纹为主，色彩清新自然。',
    colors: ['#1A3A5A','#D4A017','#F5F5F0','#CC3333','#8B4513'],
    chineseColors: ['靛蓝#065279','金驼#D4A017','月白#D6ECF0','朱砂#FF4612','檀色#B36D61'],
    garmentNote: '仫佬族尚靛蓝，男女皆穿青色或蓝色衣裤，女子配绣花围腰。',
    description: '广西特有的少数民族，以依饭节和煤砂罐烧制技艺闻名。罗城为全国唯一的仫佬族自治县。',
    itemDrawParams: { type: 'lacquerCup', color: '#8B4513', accentColor: '#D4A017' }
  },
  {
    id: 33, name: '羌族', romanName: 'Qiang', code: 'QI',
    population: '31万', // Source: 七普公报
    region: '四川（阿坝、绵阳）',
    festival: '羌年', festivalDetail: '农历十月初一，羌族新年，祭山还愿、跳锅庄、喝咂酒。为国家级非遗。',
    item: '羌笛', itemCategory: '乐器',
    itemDetail: '羌族传统双管吹奏乐器，以油竹制成，音色高亢悠远。唐诗"羌笛何须怨杨柳"即是描写此乐器。',
    pattern: '羊角纹 / 云纹', patternDetail: '羌族崇拜羊，羊角纹为最核心的装饰元素；云纹则见于羌绣和碉楼彩绘。',
    colors: ['#1A1A1A','#CC3333','#D4A017','#F5F5F0','#8B4513'],
    chineseColors: ['墨色#1A1A1A','朱砂#FF4612','金驼#D4A017','月白#D6ECF0','檀色#B36D61'],
    garmentNote: '羌族尚白，以白为吉。男子白衣黑裤系腰带，女子穿天蓝或绿色长衫配绣花围腰和头帕。',
    description: '中国最古老的民族之一，"羌"字在甲骨文中即有记载。以碉楼和羌绣闻名。',
    itemDrawParams: { type: 'qiangFlute', color: '#8B4513', accentColor: '#CC3333' }
  },
  {
    id: 34, name: '布朗族', romanName: 'Blang', code: 'BL',
    population: '13万', // Source: 七普公报
    region: '云南（西双版纳、普洱）',
    festival: '山康节', festivalDetail: '布朗族传统新年，在泼水节前后进行，祭祖、泼水祈福、歌舞。',
    item: '布朗茶', itemCategory: '茶文化',
    itemDetail: '布朗族聚居的景迈山是普洱茶核心产区之一，有千年古茶林，2023年列入世界遗产。布朗族被誉为"茶的民族"。',
    pattern: '茶叶纹 / 几何纹', patternDetail: '布朗族服饰刺绣以茶叶纹和几何纹为主，反映其悠久的茶文化传统。',
    colors: ['#1A3A1A','#D4A017','#F5F5F0','#CC3333','#8B4513'],
    chineseColors: ['墨绿#1A3A1A','金驼#D4A017','月白#D6ECF0','朱砂#FF4612','檀色#B36D61'],
    garmentNote: '布朗族服饰以青黑色为主，女子穿紧身无领上衣配筒裙，头缠黑布包头。',
    description: '云南西南部山地民族，是最早种植茶树的民族之一。景迈山千年古茶林为世界遗产。',
    itemDrawParams: { type: 'tea', color: '#1A3A1A', accentColor: '#D4A017' }
  },
  {
    id: 35, name: '撒拉族', romanName: 'Salar', code: 'SL',
    population: '17万', // Source: 七普公报
    region: '青海（循化）、甘肃',
    festival: '开斋节', festivalDetail: '伊斯兰教历十月一日，结束斋月，举行会礼和庆祝活动。',
    item: '撒拉族刺绣', itemCategory: '刺绣',
    itemDetail: '撒拉族传统刺绣技艺，以花卉纹样为主，绣于枕头、鞋垫、围肚等日常用品，色彩鲜艳。为省级非遗。',
    pattern: '花卉纹 / 几何纹', patternDetail: '撒拉族刺绣以牡丹、菊花等花卉纹样为主，结合几何图形，具有鲜明的伊斯兰风格。',
    colors: ['#1A5A2A','#CC3333','#D4A017','#F5F5F0','#1A4A7A'],
    chineseColors: ['松花绿#057748','朱砂#FF4612','金驼#D4A017','月白#D6ECF0','靛蓝#065279'],
    garmentNote: '撒拉族服饰与回族相近，男子戴白色无檐帽，女子戴各色盖头。节日盛装更鲜艳。',
    description: '青海特有的少数民族，撒拉语属突厥语族。循化为全国唯一的撒拉族自治县。',
    itemDrawParams: { type: 'embroidery', color: '#1A5A2A', accentColor: '#D4A017' }
  },
  {
    id: 36, name: '毛南族', romanName: 'Maonan', code: 'MN',
    population: '12万', // Source: 七普公报
    region: '广西（环江）、贵州',
    festival: '分龙节', festivalDetail: '农历夏至后第一个辰日，祭龙祈雨、赛龙舟，为毛南族最隆重的传统节日。',
    item: '花竹帽', itemCategory: '编织品',
    itemDetail: '毛南族传统竹编工艺品，以金竹和墨竹编织，帽面饰以花纹，为毛南族青年男女定情信物。为国家级非遗。',
    pattern: '菱形纹 / 太阳纹', patternDetail: '毛南族花竹帽以菱形纹和太阳纹为经典编织图样，结构精巧。',
    colors: ['#1A3A5A','#D4A017','#CC3333','#2C1810','#F5F5F0'],
    chineseColors: ['靛蓝#065279','金驼#D4A017','朱砂#FF4612','檀色#B36D61','月白#D6ECF0'],
    garmentNote: '毛南族服饰以靛蓝色为主，女子穿立领右衽上衣配宽脚裤，喜戴银饰。',
    description: '广西特有的少数民族，以花竹帽编织和分龙节闻名。环江为全国唯一的毛南族自治县。',
    itemDrawParams: { type: 'bambooHat', color: '#1A3A5A', accentColor: '#D4A017' }
  },
  {
    id: 37, name: '仡佬族', romanName: 'Gelao', code: 'GL',
    population: '68万', // Source: 七普公报
    region: '贵州（务川、道真）、广西',
    festival: '仡佬年', festivalDetail: '农历三月初三，仡佬族新年，祭祖、吃五色饭、对歌。',
    item: '傩面具', itemCategory: '面具雕刻',
    itemDetail: '仡佬族傩戏使用的木雕面具，以柏木或柳木雕刻彩绘而成，用于驱邪祈福。傩戏为国家级非遗。',
    pattern: '傩戏纹 / 几何纹', patternDetail: '仡佬族傩面具上的彩绘纹样和服饰刺绣中的几何图案，融合了多种文化元素。',
    colors: ['#1A1A1A','#CC3333','#D4A017','#1A4A7A','#F5F5F0'],
    chineseColors: ['墨色#1A1A1A','朱砂#FF4612','金驼#D4A017','靛蓝#065279','月白#D6ECF0'],
    garmentNote: '仡佬族传统服饰尚青蓝，女子穿短上衣配长裙或长裤，喜戴银耳环和手镯。',
    description: '贵州最古老的世居民族之一，历史可追溯至古代的"僚人"。傩戏文化和傩面具是其特色。',
    itemDrawParams: { type: 'nuoMask', color: '#1A1A1A', accentColor: '#CC3333' }
  },
  {
    id: 38, name: '锡伯族', romanName: 'Xibe', code: 'XB',
    population: '19万', // Source: 七普公报
    region: '辽宁（沈阳）、新疆（察布查尔）',
    festival: '西迁节', festivalDetail: '农历四月十八日，纪念1764年锡伯族从东北西迁新疆戍边的历史壮举。为国家级非遗。',
    item: '弓箭', itemCategory: '传统兵器',
    itemDetail: '锡伯族以射箭传统闻名，察布查尔被誉为"射箭之乡"。弓箭是锡伯族历史记忆和文化的核心符号。',
    pattern: '箭纹 / 几何纹', patternDetail: '锡伯族刺绣和剪纸中常见箭纹、弓形纹等反映射箭文化的纹样。',
    colors: ['#1A3A5A','#CC3333','#D4A017','#F5F5F0','#2C1810'],
    chineseColors: ['靛蓝#065279','朱砂#FF4612','金驼#D4A017','月白#D6ECF0','檀色#B36D61'],
    garmentNote: '锡伯族服饰与满族相近，男子穿青蓝色长袍束腰带，女子穿旗袍式长衣配绣花鞋。',
    description: '1764年从东北西迁新疆戍边的英雄民族。以射箭传统和西迁节闻名。',
    itemDrawParams: { type: 'bow', color: '#1A3A5A', accentColor: '#CC3333' }
  },
  {
    id: 39, name: '阿昌族', romanName: 'Achang', code: 'AC',
    population: '4.4万', // Source: 七普公报
    region: '云南（德宏梁河、陇川）',
    festival: '阿露窝罗节', festivalDetail: '农历三月中旬，纪念阿昌族始祖遮帕麻和遮咪麻的创世功绩，歌舞庆祝。',
    item: '户撒刀', itemCategory: '金属工艺',
    itemDetail: '阿昌族传统铁制刀具，产自陇川户撒乡，以锋利耐用著称，为国家级非遗。有"削铁如泥"之誉。',
    pattern: '花草纹 / 几何纹', patternDetail: '阿昌族服饰和户撒刀鞘上的装饰以花草纹和几何纹为主，刀鞘镶嵌工艺精美。',
    colors: ['#1A3A5A','#CC3333','#D4A017','#2C1810','#F5F5F0'],
    chineseColors: ['靛蓝#065279','朱砂#FF4612','金驼#D4A017','檀色#B36D61','月白#D6ECF0'],
    garmentNote: '阿昌族女子穿立领对襟上衣配长裤，腰系绣花围裙，男子穿蓝黑色衣裤。',
    description: '云南西部人口较少的民族，以户撒刀锻造技艺闻名于世。创世史诗《遮帕麻和遮咪麻》为国家级非遗。',
    itemDrawParams: { type: 'knife', color: '#8B4513', accentColor: '#D4A017' }
  },
  {
    id: 40, name: '普米族', romanName: 'Pumi', code: 'PM',
    population: '4.5万', // Source: 七普公报
    region: '云南（怒江、丽江、迪庆）',
    festival: '吾昔节', festivalDetail: '普米族传统新年，在农历腊月或正月举行，祭祖、吃团圆饭、歌舞。',
    item: '羊皮褂', itemCategory: '服饰',
    itemDetail: '普米族传统服饰，以鞣制山羊皮缝制，为普米族人日常穿着的防寒衣物和重要节庆装束。',
    pattern: '菱形纹 / 水波纹', patternDetail: '普米族服饰刺绣以菱形纹、水波纹和花卉纹为主，色彩以红、白、蓝为主。',
    colors: ['#1A1A1A','#CC3333','#D4A017','#1A4A7A','#F5F5F0'],
    chineseColors: ['墨色#1A1A1A','朱砂#FF4612','金驼#D4A017','靛蓝#065279','月白#D6ECF0'],
    garmentNote: '普米族男子穿羊皮褂或麻布衣，女子穿青蓝或白色长衫配彩色条纹长裙和头帕。',
    description: '云南西北部山地民族，自称"普英米"（白人）。以吾昔节和四弦舞闻名。',
    itemDrawParams: { type: 'vest', color: '#8B4513', accentColor: '#CC3333' }
  },
  {
    id: 41, name: '塔吉克族', romanName: 'Tajik', code: 'TA',
    population: '5.1万', // Source: 七普公报
    region: '新疆（塔什库尔干）',
    festival: '肖公巴哈尔节', festivalDetail: '塔吉克族传统新年，春分日（3月21日），迎春祈福、走亲访友，又称"诺鲁孜节"。',
    item: '鹰笛', itemCategory: '乐器',
    itemDetail: '塔吉克族传统吹奏乐器，以鹰翅骨制成，音色高亢。塔吉克族崇拜鹰，鹰笛是民族精神的象征。',
    pattern: '鹰纹 / 几何纹', patternDetail: '塔吉克族服饰刺绣以鹰纹和几何纹为主，反映帕米尔高原的鹰崇拜文化。',
    colors: ['#CC3333','#1A1A1A','#D4A017','#F5F5F0','#1A4A7A'],
    chineseColors: ['朱砂#FF4612','墨色#1A1A1A','金驼#D4A017','月白#D6ECF0','靛蓝#065279'],
    garmentNote: '塔吉克族男子戴黑绒高筒帽，女子戴绣花圆帽配纱巾。服饰以红、白、黑为主色调。',
    description: '帕米尔高原上的游牧民族，中国唯一的欧罗巴人种民族。以鹰笛和鹰舞闻名。',
    itemDrawParams: { type: 'eagleFlute', color: '#DEB887', accentColor: '#CC3333' }
  },
  {
    id: 42, name: '怒族', romanName: 'Nu', code: 'NU',
    population: '3.7万', // Source: 七普公报
    region: '云南（怒江）',
    festival: '仙女节', festivalDetail: '农历三月十五日，纪念怒族传说中的仙女阿茸，祈愿平安幸福。为国家级非遗。',
    item: '怒毯', itemCategory: '织品',
    itemDetail: '怒族传统手工织毯，以麻线和羊毛线经纬交织，纹样粗犷质朴，是怒族人家中的重要生活用品。',
    pattern: '条纹纹 / 几何纹', patternDetail: '怒毯以简洁的横条纹和几何方格纹为特色，色彩以红、黑、白、蓝为主。',
    colors: ['#1A1A1A','#CC3333','#D4A017','#1A4A7A','#F5F5F0'],
    chineseColors: ['墨色#1A1A1A','朱砂#FF4612','金驼#D4A017','靛蓝#065279','月白#D6ECF0'],
    garmentNote: '怒族传统服饰以麻布为主，女子穿麻布裙配珠链，男子穿麻布衣。',
    description: '怒江大峡谷的古老民族，以仙女节和怒毯编织闻名。怒族语言属藏缅语族。',
    itemDrawParams: { type: 'carpet', color: '#CC3333', accentColor: '#1A1A1A' }
  },
  {
    id: 43, name: '乌孜别克族', romanName: 'Uzbek', code: 'UZ',
    population: '1.3万', // Source: 七普公报
    region: '新疆（伊犁、乌鲁木齐、喀什）',
    festival: '古尔邦节', festivalDetail: '伊斯兰教历十二月十日，会礼、宰牲，与维吾尔族等民族共同庆祝。',
    item: '都塔尔', itemCategory: '乐器',
    itemDetail: '乌孜别克族传统弹拨乐器，梨形木制琴身配长颈两根弦，音色柔美，常用于独奏和歌舞伴奏。',
    pattern: '花草纹 / 几何纹', patternDetail: '乌孜别克族刺绣和建筑装饰以花草纹和几何纹为主，色彩浓郁。',
    colors: ['#1A4A7A','#CC3333','#D4A017','#1A5A2A','#F5F5F0'],
    chineseColors: ['靛蓝#065279','朱砂#FF4612','金驼#D4A017','松花绿#057748','月白#D6ECF0'],
    garmentNote: '乌孜别克族男子穿长袍束腰带，女子穿连衣裙配绣花小帽。民族服饰受中亚文化影响。',
    description: '中国人口较少的民族之一，由中亚迁入。与维吾尔族文化相近，善经商。',
    itemDrawParams: { type: 'lute', color: '#8B4513', accentColor: '#CC3333' }
  },
  {
    id: 44, name: '俄罗斯族', romanName: 'Russ', code: 'RS',
    population: '1.6万', // Source: 七普公报
    region: '新疆、内蒙古、黑龙江',
    festival: '复活节', festivalDetail: '每年春分月圆后第一个星期日，纪念耶稣复活，彩蛋、烤面包。',
    item: '套娃', itemCategory: '工艺品',
    itemDetail: '俄罗斯族传统木制玩偶，由多个空心木偶依次嵌套而成，手绘色彩绚丽，是俄罗斯族的文化符号。',
    pattern: '花草纹 / 几何纹', patternDetail: '俄罗斯族套娃彩绘和刺绣以花卉纹和几何纹为主，色彩浓郁丰富。',
    colors: ['#CC3333','#1A4A7A','#D4A017','#1A5A2A','#F5F5F0'],
    chineseColors: ['朱砂#FF4612','靛蓝#065279','金驼#D4A017','松花绿#057748','月白#D6ECF0'],
    garmentNote: '俄罗斯族传统服饰受东欧影响，男子穿衬衫配长裤，女子穿布拉吉（连衣裙）配围裙。',
    description: '由中国境内的俄罗斯移民后裔形成。使用俄语，保留东正教传统和俄罗斯文化。',
    itemDrawParams: { type: 'doll', color: '#CC3333', accentColor: '#1A4A7A' }
  },
  {
    id: 45, name: '鄂温克族', romanName: 'Ewenki', code: 'EW',
    population: '3.5万', // Source: 七普公报
    region: '内蒙古（呼伦贝尔）、黑龙江',
    festival: '瑟宾节', festivalDetail: '鄂温克族传统节日，举行赛马、摔跤、篝火晚会，是民族团聚的盛会。',
    item: '驯鹿', itemCategory: '驯养动物',
    itemDetail: '鄂温克族使鹿部落（敖鲁古雅）以驯养驯鹿著称，是中国最后的驯鹿部落。驯鹿是鄂温克族文化的核心。',
    pattern: '鹿角纹 / 云卷纹', patternDetail: '鹿角纹和云卷纹是鄂温克族最具特色的装饰纹样，见于桦树皮工艺品和服饰。',
    colors: ['#1A3A5A','#8B4513','#D4A017','#F5F5F0','#CC3333'],
    chineseColors: ['靛蓝#065279','驼色#A87B51','金驼#D4A017','月白#D6ECF0','朱砂#FF4612'],
    garmentNote: '鄂温克族传统服饰以兽皮为主，多用狍皮和鹿皮制作，冬季戴皮帽穿皮袍。',
    description: '北方渔猎民族，使鹿部落敖鲁古雅是中国最后的驯鹿部落。瑟宾节为重要传统节日。',
    itemDrawParams: { type: 'deer', color: '#8B4513', accentColor: '#D4A017' }
  },
  {
    id: 46, name: '德昂族', romanName: 'Deang', code: 'DE',
    population: '2.2万', // Source: 七普公报
    region: '云南（德宏、临沧）',
    festival: '泼水节', festivalDetail: '德昂族与傣族同庆泼水节，在傣历六月（公历4月），相互泼水祝福。',
    item: '腰箍', itemCategory: '服饰配件',
    itemDetail: '德昂族女性传统装饰，以藤条或竹篾编成，漆成红黑彩色，层层箍在腰间，最多可达数十圈，是德昂族标志。',
    pattern: '几何纹 / 水波纹', patternDetail: '德昂族服饰和腰箍上的几何纹和水波纹是传统装饰特色。',
    colors: ['#1A1A1A','#CC3333','#D4A017','#1A4A7A','#F5F5F0'],
    chineseColors: ['墨色#1A1A1A','朱砂#FF4612','金驼#D4A017','靛蓝#065279','月白#D6ECF0'],
    garmentNote: '德昂族服饰以黑为主色，女子腰间箍数十道彩色腰箍为最显著特征。',
    description: '云南西部人口较少的民族，以腰箍文化闻名。德昂族善种茶，有古老的茶叶种植传统。',
    itemDrawParams: { type: 'waistBelt', color: '#1A1A1A', accentColor: '#CC3333' }
  },
  {
    id: 47, name: '保安族', romanName: 'Bonan', code: 'BN',
    population: '2.4万', // Source: 七普公报
    region: '甘肃（积石山）、青海',
    festival: '开斋节', festivalDetail: '伊斯兰教历十月一日，与回族、东乡族等共同庆祝开斋节。',
    item: '保安腰刀', itemCategory: '金属工艺',
    itemDetail: '保安族传统手工锻制刀具，刀刃锋利，刀柄以牛角或铜片镶嵌，为国家级非遗。与藏刀、蒙古刀齐名。',
    pattern: '花草纹 / 几何纹', patternDetail: '保安族腰刀刀鞘装饰以花草纹和几何纹为主，受伊斯兰文化和藏文化双重影响。',
    colors: ['#1A3A5A','#CC3333','#D4A017','#2C1810','#F5F5F0'],
    chineseColors: ['靛蓝#065279','朱砂#FF4612','金驼#D4A017','檀色#B36D61','月白#D6ECF0'],
    garmentNote: '保安族服饰与回族相近，男子戴白色无檐帽，女子戴盖头。节日盛装色彩更丰富。',
    description: '甘肃特有的少数民族，保安腰刀锻造技艺闻名遐迩。积石山为全国唯一的保安族聚居区。',
    itemDrawParams: { type: 'knife', color: '#8B4513', accentColor: '#D4A017' }
  },
  {
    id: 48, name: '裕固族', romanName: 'Yugur', code: 'YG',
    population: '1.5万', // Source: 七普公报
    region: '甘肃（张掖肃南县）',
    festival: '东迁节', festivalDetail: '纪念裕固族先民从新疆东迁至甘肃的历史。农历正月举行祭祀和庆祝活动。',
    item: '裕固族织褐', itemCategory: '织造工艺',
    itemDetail: '裕固族传统手工毛织品，以牦牛毛或羊毛编织而成，用于制作帐篷和衣料，工艺独特。',
    pattern: '回纹 / 几何纹', patternDetail: '裕固族服饰和织褐以回纹、菱形纹和几何图案为主，色彩沉稳。',
    colors: ['#1A3A5A','#8B4513','#D4A017','#CC3333','#F5F5F0'],
    chineseColors: ['靛蓝#065279','驼色#A87B51','金驼#D4A017','朱砂#FF4612','月白#D6ECF0'],
    garmentNote: '裕固族女子穿高领长袍配彩色腰带和头面装饰（头饰），男子穿褐面的长袍。',
    description: '甘肃特有的少数民族，由古代回鹘人后裔融合形成。使用三种语言，文化独特。',
    itemDrawParams: { type: 'brocade', color: '#1A3A5A', accentColor: '#D4A017' }
  },
  {
    id: 49, name: '京族', romanName: 'Gin', code: 'GI',
    population: '3.3万', // Source: 七普公报
    region: '广西（东兴市防城港）',
    festival: '哈节', festivalDetail: '京族最隆重的传统节日，祭海神、唱哈（唱歌）、宴饮。为国家级非遗。',
    item: '独弦琴', itemCategory: '乐器',
    itemDetail: '京族传统弹拨乐器，仅一根弦，以竹片弹拨，音色悠扬。京族独弦琴艺术为国家级非遗。',
    pattern: '波浪纹 / 鱼纹', patternDetail: '京族服饰和装饰以波浪纹和鱼纹为主，反映其海洋渔猎文化。',
    colors: ['#1A4A7A','#F5F5F0','#D4A017','#CC3333','#2C1810'],
    chineseColors: ['靛蓝#065279','月白#D6ECF0','金驼#D4A017','朱砂#FF4612','檀色#B36D61'],
    garmentNote: '京族传统服饰以白色为主，女子穿白色长衫配黑色长裤，男子穿白色对襟上衣。',
    description: '中国唯一的海洋民族，15世纪从越南涂山等地迁入。以哈节和独弦琴闻名。',
    itemDrawParams: { type: 'monochord', color: '#1A4A7A', accentColor: '#F5F5F0' }
  },
  {
    id: 50, name: '塔塔尔族', romanName: 'Tatar', code: 'TT',
    population: '3544人', // Source: 七普公报
    region: '新疆（乌鲁木齐、伊犁、塔城）',
    festival: '古尔邦节', festivalDetail: '伊斯兰教历十二月十日，会礼、宰牲，与信仰伊斯兰教各民族共同庆祝。',
    item: '塔塔尔族刺绣', itemCategory: '刺绣',
    itemDetail: '塔塔尔族传统刺绣技艺，以花卉纹样为主，绣工精细色彩柔和，用于服饰和家居用品。',
    pattern: '花卉纹 / 几何纹', patternDetail: '塔塔尔族刺绣以细腻的花卉纹样为主要装饰特征。',
    colors: ['#CC3333','#1A4A7A','#D4A017','#1A5A2A','#F5F5F0'],
    chineseColors: ['朱砂#FF4612','靛蓝#065279','金驼#D4A017','松花绿#057748','月白#D6ECF0'],
    garmentNote: '塔塔尔族男子穿绣花衬衫配黑色马甲，女子穿连衣裙配绣花小帽和披肩。',
    description: '中国人口最少的民族之一，由中亚迁入。以塔塔尔族刺绣和糕点文化闻名。',
    itemDrawParams: { type: 'embroidery', color: '#CC3333', accentColor: '#D4A017' }
  },
  {
    id: 51, name: '独龙族', romanName: 'Derung', code: 'DR',
    population: '7310人', // Source: 七普公报
    region: '云南（怒江贡山独龙江乡）',
    festival: '卡雀哇节', festivalDetail: '独龙族传统新年，在农历腊月或正月举行，祭山神、剽牛，为国家级非遗。',
    item: '独龙毯', itemCategory: '织品',
    itemDetail: '独龙族传统手工麻毯，以野生麻纤维经纬交织，染成黑、白、红三色条纹，是独龙族传统服饰。',
    pattern: '条纹纹 / 菱形纹', patternDetail: '独龙毯以横条纹为主要装饰，配以少量菱形几何图案。',
    colors: ['#1A1A1A','#CC3333','#2C1810','#F5F5F0','#8B4513'],
    chineseColors: ['墨色#1A1A1A','朱砂#FF4612','檀色#B36D61','月白#D6ECF0','驼色#A87B51'],
    garmentNote: '独龙族传统以独龙毯披身为衣，男女皆用。女子有纹面习俗（现已不普遍）。',
    description: '人口最少的中国少数民族之一，聚居在独龙江峡谷。独龙毯和卡雀哇节为民族文化瑰宝。',
    itemDrawParams: { type: 'carpet', color: '#1A1A1A', accentColor: '#CC3333' }
  },
  {
    id: 52, name: '鄂伦春族', romanName: 'Oroqen', code: 'OR',
    population: '9168人', // Source: 七普公报
    region: '内蒙古（呼伦贝尔）、黑龙江',
    festival: '古伦木沓节', festivalDetail: '鄂伦春族传统节日，祭火神、祈福。为国家级非遗。',
    item: '狍皮帽', itemCategory: '服饰',
    itemDetail: '鄂伦春族传统狍头皮帽（灭塔哈），以完整的狍子头皮制作，保留眼睛和耳朵，是狩猎文化的标志性服饰。',
    pattern: '螺旋纹 / 几何纹', patternDetail: '鄂伦春族桦树皮工艺和服饰以螺旋纹、云卷纹和几何纹为主。',
    colors: ['#8B4513','#1A3A5A','#D4A017','#F5F5F0','#2C1810'],
    chineseColors: ['驼色#A87B51','靛蓝#065279','金驼#D4A017','月白#D6ECF0','檀色#B36D61'],
    garmentNote: '鄂伦春族以狍皮为主要服饰材料，狍皮长袍镶绣花纹，冬季戴狍头皮帽。',
    description: '北方人口最少的民族之一，世代在大兴安岭以游猎为生，被称为"山岭上的人"。',
    itemDrawParams: { type: 'furHat', color: '#8B4513', accentColor: '#D4A017' }
  },
  {
    id: 53, name: '赫哲族', romanName: 'Hezhen', code: 'HZ',
    population: '5373人', // Source: 七普公报
    region: '黑龙江（同江、抚远）',
    festival: '乌日贡节', festivalDetail: '赫哲族传统节日，农历五月十五，举行体育竞技和文艺表演，是民族聚会盛会。',
    item: '鱼皮衣', itemCategory: '服饰',
    itemDetail: '赫哲族以鱼皮制作衣物的独特技艺闻名，以大马哈鱼皮缝制，染色拼花，鱼皮制作技艺为国家级非遗。',
    pattern: '水纹 / 鱼纹', patternDetail: '赫哲族鱼皮衣和桦树皮工艺以水纹、鱼纹和几何图案为特色，反映渔猎生活。',
    colors: ['#1A3A5A','#8B4513','#F5F5F0','#CC3333','#2C1810'],
    chineseColors: ['靛蓝#065279','驼色#A87B51','月白#D6ECF0','朱砂#FF4612','檀色#B36D61'],
    garmentNote: '赫哲族传统以鱼皮制衣，现多用布料。女子穿蓝黑色旗袍式长衣镶绣花边。',
    description: '中国人口最少的民族之一，也是唯一的以鱼皮为衣的民族。赫哲语属满-通古斯语族。',
    itemDrawParams: { type: 'fishSkin', color: '#1A3A5A', accentColor: '#F5F5F0' }
  },
  {
    id: 54, name: '门巴族', romanName: 'Monba', code: 'MB',
    population: '1.1万', // Source: 七普公报
    region: '西藏（林芝墨脱县、错那县）',
    festival: '门巴族新年', festivalDetail: '藏历正月初一，门巴族与藏族共同庆祝新年，喝酥油茶、跳锅庄舞。',
    item: '邦穷', itemCategory: '服饰',
    itemDetail: '门巴族传统女装，彩色条纹毛织围裙，系于腰间，为门巴族已婚妇女的标志性服饰。',
    pattern: '条纹纹 / 几何纹', patternDetail: '门巴族服饰和邦穷以彩色条纹和几何图案为装饰特征。',
    colors: ['#1A1A1A','#CC3333','#D4A017','#1A4A7A','#F5F5F0'],
    chineseColors: ['墨色#1A1A1A','朱砂#FF4612','金驼#D4A017','靛蓝#065279','月白#D6ECF0'],
    garmentNote: '门巴族男子穿赭红色长袍，女子穿无领无扣上衣配"邦穷"（彩色条纹围裙）。',
    description: '西藏喜马拉雅山南麓民族，与藏族长期交往融合。信仰藏传佛教，文化上与藏族相近。',
    itemDrawParams: { type: 'apron', color: '#CC3333', accentColor: '#D4A017' }
  },
  {
    id: 55, name: '珞巴族', romanName: 'Lhoba', code: 'LB',
    population: '4237人', // Source: 七普公报
    region: '西藏（林芝米林县、墨脱县）',
    festival: '珞巴年', festivalDetail: '珞巴族依照本民族历法过新年，杀猪祭祀、饮酒歌舞，为期数天。',
    item: '竹编', itemCategory: '编织品',
    itemDetail: '珞巴族传统竹编技艺发达，以竹篾编织背篓、饭盒、雨具等，工艺精巧，是珞巴族人日常生活的必需品。',
    pattern: '几何纹 / 编织纹', patternDetail: '珞巴族竹编以几何纹和编织纹为主要装饰，简洁实用。',
    colors: ['#1A1A1A','#8B4513','#CC3333','#D4A017','#F5F5F0'],
    chineseColors: ['墨色#1A1A1A','驼色#A87B51','朱砂#FF4612','金驼#D4A017','月白#D6ECF0'],
    garmentNote: '珞巴族传统服饰以自织的麻布为主，男子穿无领上衣配围裙，女子穿短上衣配筒裙。',
    description: '中国人口最少的民族之一，世居西藏喜马拉雅山南麓。以竹编和珞巴年习俗闻名。',
    itemDrawParams: { type: 'bamboo', color: '#1A1A1A', accentColor: '#8B4513' }
  },
  {
    id: 56, name: '基诺族', romanName: 'Jino', code: 'JN',
    population: '2.6万', // Source: 七普公报
    region: '云南（西双版纳景洪基诺山）',
    festival: '特懋克节', festivalDetail: '基诺族传统新年，在农历腊月举行，敲响大鼓、跳大鼓舞，为国家级非遗。',
    item: '大鼓', itemCategory: '乐器/法器',
    itemDetail: '基诺族神圣的祭祀乐器，是基诺族创世神话中挽救人类的神器。特懋克节的核心物品。大鼓舞为国家级非遗。',
    pattern: '太阳纹 / 几何纹', patternDetail: '基诺族大鼓上的太阳纹和服饰上的几何纹样是最具代表性的民族视觉符号。',
    colors: ['#CC3333','#1A1A1A','#D4A017','#1A4A7A','#F5F5F0'],
    chineseColors: ['朱砂#FF4612','墨色#1A1A1A','金驼#D4A017','靛蓝#065279','月白#D6ECF0'],
    garmentNote: '基诺族女子穿白色绣花上衣配黑色短裙和绑腿，男子穿白色对襟上衣配蓝色长裤。',
    description: '1979年最后一个被确认的少数民族（第56个民族），聚居西双版纳基诺山。以大鼓舞闻名。',
    itemDrawParams: { type: 'bigDrum', color: '#8B1A1A', accentColor: '#D4A017' }
  },
];
