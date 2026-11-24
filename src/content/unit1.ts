import type { Challenge, KnowledgePoint, Mission, TextbookUnit } from '../engine/types';

export const textbook = {
  id: 'pep-2024-g3-upper',
  displayName: '人教 PEP · 2024 新版',
  grade: '三年级上册',
  officialCatalog: 'https://www.pep.com.cn/zslth/yyptypzj/xypep/3s/',
  note: '本游戏为原创教学补充内容，不隶属于人民教育出版社，也不复刻课本插画、录音或课文。',
};

export const units: TextbookUnit[] = [
  { id: 'u1', number: 1, name: 'Making friends', chinese: '交朋友', world: '友谊森林', available: true },
  { id: 'u2', number: 2, name: 'Different families', chinese: '不同的家庭', world: '家庭小镇', available: false },
  { id: 'u3', number: 3, name: 'Amazing animals', chinese: '神奇的动物', world: '动物岛', available: false },
  { id: 'u4', number: 4, name: 'Plants around us', chinese: '身边的植物', world: '魔法花园', available: false },
  { id: 'u5', number: 5, name: 'The colourful world', chinese: '多彩的世界', world: '彩虹城', available: false },
  { id: 'u6', number: 6, name: 'Useful numbers', chinese: '有用的数字', world: '数字王国', available: false },
  { id: 'revision', number: 7, name: 'Being a good guest', chinese: '综合复习', world: '好客城堡', available: false },
];

export const knowledgePoints: KnowledgePoint[] = [
  { id: 'u1-greeting-hello', english: 'Hello / Hi', chinese: '打招呼', section: 'A', category: 'greeting', alignment: 'core', sourceSection: "A Let's talk" },
  { id: 'u1-greeting-name', english: "I'm… / My name is…", chinese: '介绍自己的名字', section: 'A', category: 'greeting', alignment: 'core', sourceSection: "A Let's talk" },
  { id: 'u1-greeting-meet', english: 'Nice to meet you', chinese: '初次见面', section: 'A', category: 'greeting', alignment: 'core', sourceSection: "A Let's talk" },
  { id: 'u1-body-ear', english: 'ear', chinese: '耳朵', section: 'A', category: 'body', alignment: 'core', sourceSection: "A Let's learn" },
  { id: 'u1-body-eye', english: 'eye', chinese: '眼睛', section: 'A', category: 'body', alignment: 'core', sourceSection: "A Let's learn" },
  { id: 'u1-body-mouth', english: 'mouth', chinese: '嘴巴', section: 'A', category: 'body', alignment: 'core', sourceSection: "A Let's learn" },
  { id: 'u1-body-hand', english: 'hand', chinese: '手', section: 'A', category: 'body', alignment: 'core', sourceSection: "A Let's learn" },
  { id: 'u1-body-arm', english: 'arm', chinese: '手臂', section: 'A', category: 'body', alignment: 'core', sourceSection: "A Let's learn" },
  { id: 'u1-letter-a', english: 'Aa', chinese: '字母 A', section: 'A', category: 'letters', alignment: 'core', sourceSection: 'A Letters and sounds' },
  { id: 'u1-letter-b', english: 'Bb', chinese: '字母 B', section: 'A', category: 'letters', alignment: 'core', sourceSection: 'A Letters and sounds' },
  { id: 'u1-letter-c', english: 'Cc', chinese: '字母 C', section: 'A', category: 'letters', alignment: 'core', sourceSection: 'A Letters and sounds' },
  { id: 'u1-letter-d', english: 'Dd', chinese: '字母 D', section: 'A', category: 'letters', alignment: 'core', sourceSection: 'A Letters and sounds' },
  { id: 'u1-kind-share', english: 'share', chinese: '分享', section: 'B', category: 'friendship', alignment: 'core', sourceSection: "B Let's learn" },
  { id: 'u1-kind-help', english: 'help', chinese: '帮助', section: 'B', category: 'friendship', alignment: 'core', sourceSection: "B Let's learn" },
  { id: 'u1-kind-listen', english: 'listen', chinese: '倾听', section: 'B', category: 'friendship', alignment: 'core', sourceSection: "B Let's learn" },
  { id: 'u1-kind-smile', english: 'smile', chinese: '微笑', section: 'B', category: 'friendship', alignment: 'core', sourceSection: "B Let's learn" },
  { id: 'u1-kind-thanks', english: 'Thank you / Thanks', chinese: '表达感谢', section: 'B', category: 'friendship', alignment: 'core', sourceSection: "B Let's talk" },
  { id: 'u1-reading-friend', english: 'I am a good friend', chinese: '理解朋友主题短文', section: 'B', category: 'reading', alignment: 'core', sourceSection: 'B Start to read' },
  { id: 'u1-ext-whats-name', english: "What's your name?", chinese: '询问名字（原创拓展）', section: 'A', category: 'greeting', alignment: 'extension', sourceSection: '原创交流拓展' },
];

export const missions: Mission[] = [
  {
    id: 'meet-fox', index: 1, title: '森林里的新朋友', englishTitle: 'Meet your new friend',
    subtitle: '学会问候和自我介绍', zone: '晨光树屋', icon: '🦊', character: 'fox',
    introduction: '清晨，你来到友谊森林。一只小狐狸正在树屋门口等你，它想认识新朋友！',
    introductionEnglish: 'Hi there! Welcome to Friendship Forest!',
    celebration: '你和小狐狸成为朋友啦！新的冒险正在等你。',
    challenges: [
      { id:'m1-hello',pointId:'u1-greeting-hello',skill:'listening',mode:'choice',title:'先打个招呼',instruction:'听小狐狸说什么，选出合适的回应。',prompt:'🔊 Foxy is saying hello!',spoken:'Hello!',options:[{id:'hi',label:'Hi! 👋'},{id:'bye',label:'Goodbye! 👋'},{id:'thanks',label:'Thank you! 💛'}],correctAnswer:'hi',explanation:'Hello 和 Hi 都可以用来打招呼。' },
      { id:'m1-name',pointId:'u1-greeting-name',skill:'recognition',mode:'choice',title:'认识新朋友',instruction:'小狐狸说 “I’m Foxy.”，怎么介绍自己？',prompt:"Hi! I'm Foxy. Who are you?",spoken:"Hi! I'm Foxy.",options:[{id:'name',label:"I'm Mia! 🌟"},{id:'fine',label:"I'm hungry. 🍎"},{id:'thanks',label:'Thank you! 💛'}],correctAnswer:'name',explanation:"I'm Mia 就是“我是米娅”。Mia 是游戏角色的名字，你也可以换成自己的英文名。" },
      { id:'m1-meet',pointId:'u1-greeting-meet',skill:'listening',mode:'choice',title:'友好的回应',instruction:'仔细听！第一次见面，应该怎么回答？',prompt:'Nice to meet you!',spoken:'Nice to meet you!',options:[{id:'me-too',label:'Nice to meet you, too! 🤝'},{id:'no',label:'No, thanks. ❌'},{id:'bye',label:'Good night! 🌙'}],correctAnswer:'me-too',explanation:'Nice to meet you, too! 表示“我也很高兴认识你”。' },
      { id:'m1-hear',pointId:'u1-greeting-hello',skill:'recognition',mode:'choice',title:'听懂还是看懂？',instruction:'看看哪一句是打招呼的英语。',prompt:'有人向你挥手，你会说哪一句？',options:[{id:'hi',label:'Hello!'},{id:'bye',label:'Good night.'},{id:'sorry',label:'Sorry.'}],correctAnswer:'hi',explanation:'在这个情境里 Hello! 是最自然的问候。' },
      { id:'m1-say',pointId:'u1-greeting-name',skill:'speaking',mode:'self-recall',title:'轮到你介绍自己',instruction:'先自己大声说出英语，再查看参考答案。',prompt:'请用英语说：“你好，我是米娅。”',spoken:'Hello! I am Mia.',correctAnswer:"Hello! I'm Mia.",explanation:'说出 Hello! I’m Mia. 就可以。这里是自我评价，不是语音识别或发音评分。' },
    ],
  },
  {
    id: 'help-robot', index: 2, title: '机器人需要帮助', englishTitle: 'Help little Robo',
    subtitle: '认识身体部位，听懂简单指令', zone: '机械蘑菇屋', icon: '🤖', character: 'robot',
    introduction: '森林深处，小机器人 Robo 正在练习认识自己的身体。它需要你听英语，帮它找到对应的部位。',
    introductionEnglish: 'Beep boop! Can you help me?',
    celebration: 'Robo 终于认清自己的身体部位了！你是个乐于助人的好朋友。',
    challenges: [
      { id:'m2-ear',pointId:'u1-body-ear',skill:'listening',mode:'robot-tap',title:'找到耳朵',instruction:'先听英语，再点击机器人的正确部位。',prompt:'Touch your ear.',spoken:'Touch your ear.',correctAnswer:'ear',explanation:'ear 是耳朵。' },
      { id:'m2-eye',pointId:'u1-body-eye',skill:'listening',mode:'robot-tap',title:'明亮的眼睛',instruction:'认真听，然后点击对应的部位。',prompt:'Touch your eye.',spoken:'Touch your eye.',correctAnswer:'eye',explanation:'eye 是眼睛。' },
      { id:'m2-mouth',pointId:'u1-body-mouth',skill:'listening',mode:'robot-tap',title:'会笑的嘴巴',instruction:'听到哪个部位？找一找。',prompt:'Touch your mouth.',spoken:'Touch your mouth.',correctAnswer:'mouth',explanation:'mouth 是嘴巴。' },
      { id:'m2-hand',pointId:'u1-body-hand',skill:'listening',mode:'robot-tap',title:'挥挥手',instruction:'选中正确的身体部位。',prompt:'Wave your hand.',spoken:'Wave your hand.',correctAnswer:'hand',explanation:'hand 是手；wave your hand 是挥挥手。' },
      { id:'m2-arm',pointId:'u1-body-arm',skill:'listening',mode:'robot-tap',title:'伸伸手臂',instruction:'仔细听指令。',prompt:'Touch your arm.',spoken:'Touch your arm.',correctAnswer:'arm',explanation:'arm 是手臂，hand 是手，别弄混。' },
      { id:'m2-recall',pointId:'u1-body-hand',skill:'speaking',mode:'self-recall',title:'不看提示说出来',instruction:'不看英文提示，说出对应的单词。',prompt:'你要告诉 Robo “手” 的英语，应该说什么？',spoken:'hand',correctAnswer:'hand',explanation:'hand = 手。这里由孩子自行确认是否说对，不能当作自动发音评分。' },
    ],
  },
];

// Original practice variants intentionally use different prompts from the mission.
export const reviewChallenges: Challenge[] = [
  { id:'r1-hello',pointId:'u1-greeting-hello',skill:'listening',mode:'choice',reviewVariant:true,title:'再次见面',instruction:'新朋友从远处朝你打招呼。',prompt:'Hi, friend!',spoken:'Hi, friend!',options:[{id:'hi',label:'Hello! 👋'},{id:'bye',label:'Good night. 🌙'},{id:'sorry',label:'Sorry!'}],correctAnswer:'hi',explanation:'Hi 和 Hello 是常见的问候语。' },
  { id:'r1-hello-read',pointId:'u1-greeting-hello',skill:'recognition',mode:'choice',reviewVariant:true,title:'纸条上的问候',instruction:'选出可以用来问候朋友的一句。',prompt:'朋友见面时，你会说什么？',options:[{id:'hi',label:'Hi!'},{id:'sleep',label:'Sleep.'},{id:'eat',label:'Eat.'}],correctAnswer:'hi',explanation:'Hi 可以用来打招呼。' },
  { id:'r1-name',pointId:'u1-greeting-name',skill:'recognition',mode:'choice',reviewVariant:true,title:'交换名字',instruction:'看看哪句话是在介绍自己的名字。',prompt:'Which one means “我是米娅”？',options:[{id:'name',label:"I'm Mia."},{id:'bye',label:'Goodbye, Mia.'},{id:'no',label:'No.'}],correctAnswer:'name',explanation:"I'm Mia. 是自我介绍。" },
  { id:'r1-name-say',pointId:'u1-greeting-name',skill:'speaking',mode:'self-recall',reviewVariant:true,title:'新伙伴来啦',instruction:'先自己介绍，再查看参考说法。',prompt:'向小熊说：“你好，我是米娅。”',correctAnswer:"Hi! I'm Mia.",explanation:'自我评价，只记录孩子是否认为自己独立说对。' },
  { id:'r1-meet',pointId:'u1-greeting-meet',skill:'listening',mode:'choice',reviewVariant:true,title:'新的伙伴',instruction:'听完后选择礼貌的回应。',prompt:'Nice to meet you, Mia.',spoken:'Nice to meet you, Mia.',options:[{id:'too',label:'Nice to meet you, too.'},{id:'sleep',label:'Good night.'},{id:'apple',label:'An apple.'}],correctAnswer:'too',explanation:'Nice to meet you, too. 是自然的回复。' },
  ...(['ear','eye','mouth','hand','arm'] as const).map((word) => ({
    id:'r2-'+word,pointId:'u1-body-'+word,skill:'listening' as const,mode:'robot-tap' as const,reviewVariant:true,title:'Robo 的随机复习',instruction:'听 Robo 的新指令，点选对应位置。',prompt:'Show me your '+word+'.',spoken:'Show me your '+word+'.',correctAnswer:word,explanation:word+' 是今天要巩固的身体部位。',
  })),
  { id:'r2-hand-say',pointId:'u1-body-hand',skill:'speaking',mode:'self-recall',reviewVariant:true,title:'主动回忆',instruction:'先说英语，再看答案。',prompt:'挥手时用到的“手”，英语是什么？',correctAnswer:'hand',explanation:'hand = 手。' },
];

export const pointMap = Object.fromEntries(knowledgePoints.map((point) => [point.id, point])) as Record<string, KnowledgePoint>;

export function findReviewChallenge(pointId: string, skill: string): Challenge | undefined {
  return reviewChallenges.find((challenge) => challenge.pointId === pointId && challenge.skill === skill);
}
