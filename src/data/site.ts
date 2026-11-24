export const SITE = {
  name: 'Aqua',
  title: 'Aqua // 满怀希望就会所向披靡',
  motto: '满怀希望就会所向披靡',
  kicker: 'AQUA // HOPE · CONSTRUCT',
  bio: '做点小玩意，学点小技术，看点大世界，传递大爱心。',
  now: [
    { tag: 'LEARNING', text: '正在深入学习 AI Agent 与 AI Native 应用架构' },
    { tag: 'BUILDING', text: '持续迭代 DSH Memory，并打磨个人蓝色梦核博客' },
  ],
  socials: [
    { label: 'GITHUB', handle: 'Xavier14-aqua', href: 'https://github.com/Xavier14-aqua' },
    { label: 'X / TWITTER', handle: '@Aq1Xavier', href: 'https://x.com/Aq1Xavier' },
    { label: 'XIAOHONGSHU', handle: '@Aq. (26457593465)', href: 'https://www.xiaohongshu.com/' },
    { label: 'EMAIL', handle: 'xinyu_li.xa@foxmail.com', href: 'mailto:xinyu_li.xa@foxmail.com' },
  ],
  portals: [
    {
      index: '01',
      tag: 'PROJECTS',
      title: '技术与项目',
      subtitle: '项目展示墙 · 技术复盘与笔记',
      href: '/projects',
      variant: 'pool' as const,
    },
    {
      index: '02',
      tag: 'CURATIONS',
      title: '防空洞',
      subtitle: '我的收藏夹 · 书 / 影 / 音 / 艺',
      href: '/curations',
      variant: 'overcast' as const,
    },
    {
      index: '03',
      tag: 'JOURNAL',
      title: '生活日记',
      subtitle: '长日记归档 · 碎片时间轴',
      href: '/journal',
      variant: 'sky' as const,
    },
    {
      index: '04',
      tag: 'ABOUT & NOW',
      title: '关于与此刻',
      subtitle: '个人档案 · AI Agent 学习中',
      href: '/about',
      variant: 'water' as const,
    },
  ],
};

export type CurationCategory = 'book' | 'movie' | 'music' | 'art';

export interface CurationItem {
  title: string;
  creator?: string;
  category: CurationCategory;
  note?: string;
  articleSlug?: string; // 以后写了深度长评，填入对应 curations Markdown 的 id 即可点击跳转
}

// 「防空洞」快速图鉴清单（先导入你的首批清单，随时补充短评与创作者）
export const CURATION_ITEMS: CurationItem[] = [
  // 书籍
  { title: '撒野', creator: '巫哲', category: 'book', note: '满怀希望就会所向披靡。' },
  { title: '夜晚的潜水艇', creator: '陈春成', category: 'book', note: '在现实缝隙里潜入深蓝色的想象力世界。' },
  { title: '蓦然回首', creator: '藤本树', category: 'book', note: '关于绘画、热爱与继续走下去的勇气。' },

  // 电影
  { title: '请以你的名字呼唤我', creator: '卢卡·瓜达尼诺', category: 'movie' },
  { title: '花样年华', creator: '王家卫', category: 'movie' },
  { title: '爱乐之城', creator: '达米恩·查泽雷', category: 'movie' },
  { title: '白日梦想家', creator: '本·斯蒂勒', category: 'movie' },
  { title: '我爱你！', creator: '韩延', category: 'movie' },
  { title: '心灵捕手', creator: '格斯·范·桑特', category: 'movie' },
  { title: '宇宙探索编辑部', creator: '孔大山', category: 'movie' },

  // 音乐
  { title: '坂本龙一', category: 'music', note: '克制、清澈，像落在水面上的月光。' },
  { title: 'RADWIMPS', category: 'music' },
  { title: '洛天依', category: 'music' },
  { title: '初音未来', category: 'music' },
  { title: 'Taylor Swift', category: 'music' },
  { title: 'Sabrina Carpenter', category: 'music' },
  { title: 'KAFU（可不）', category: 'music' },
  { title: 'ヰ世界情緒（异世界情绪）', category: 'music' },
];