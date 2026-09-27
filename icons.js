// 纯 SVG 图标库 - 所有图标均由代码绘制，无 emoji
const Icons = {
  // 品牌 logo - 小涵（一个简洁的抽象符号：三层叠层）
  logo: `<svg viewBox="0 0 24 24" class="icon icon-lg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,

  // 用户
  user: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,

  // 用户群
  users: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,

  // 锁
  lock: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,

  // 下载
  download: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,

  // 消息/对话
  message: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,

  // 图片
  image: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,

  // 心/点赞
  heart: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,

  // 删除
  trash: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,

  // 退出
  logout: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,

  // 设置/齿轮
  settings: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,

  // 统计/柱状图
  chart: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,

  // 金币
  coin: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M15 9.5c-.5-1-1.5-1.5-3-1.5-1.7 0-3 1-3 2.2 0 3 6 1.5 6 4.5 0 1.2-1.3 2.3-3 2.3-1.5 0-2.5-.5-3-1.5"/></svg>`,

  // 购物袋
  bag: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,

  // 礼物
  gift: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`,

  // 加号
  plus: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,

  // 对勾
  check: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,

  // 标签/版本
  tag: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,

  // 硬盘/大小
  hardDrive: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>`,

  // 箭头发送
  send: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,

  // 置顶
  pin: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>`,

  // 封禁/禁止
  ban: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>`,

  // 解封/对勾圆
  unlock: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,

  // 日历
  calendar: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,

  // 编辑
  edit: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,

  // 搜索
  search: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,

  // 向上箭头
  arrowUp: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,

  // 向下箭头
  arrowDown: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`,

  // 星星/VIP
  star: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,

  // 邮件/反馈
  mail: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,

  // 保存
  save: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,

  // 列表
  list: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,

  // 王冠/VIP标识
  crown: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h20v2H2zM3 8l4 5 5-7 5 7 4-5v10H3z"/></svg>`,

  // 反馈/聊天
  chat: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,

  // 眼睛（密码可见）
  eye: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,

  // 眼睛关闭（密码隐藏）
  eyeOff: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,

  // 关闭 X
  x: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,

  // 右箭头
  chevronRight: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,

  // 左箭头
  chevronLeft: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,

  // 下箭头
  chevronDown: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,

  // 时钟
  clock: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,

  // 复制
  copy: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,

  // 钥匙（卡密）
  key: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-3.41 7.41a4 4 0 1 0-5.66-5.66 4 4 0 0 0 5.66 5.66zM9 11l-6 6 3 3 2-2v-3h3l2-2"/></svg>`,

  // 通知铃铛
  bell: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,

  // 信息圆
  info: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,

  // 刷新
  refresh: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,

  // 趋势上升
  trendUp: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,

  // 盾牌
  shield: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,

  // 火箭（启动）
  rocket: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12h4a4 4 0 0 0-2 2 4 4 0 0 0 0 4"/><path d="M12 15a4 4 0 0 0-2 2 4 4 0 0 0-4 0"/></svg>`,

  // 闪光（新功能/特殊）
  sparkles: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>`,

  // 文件
  file: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>`,

  // 录像/视频
  video: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,

  // 链接
  link: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,

  // 闪电（快速）
  zap: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,

  // 火焰（热门）
  fire: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,

  // 群组/网络
  globe: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,

  // 回复箭头
  reply: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>`,

  // 用户卡密/票据
  ticket: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v2a3 3 0 0 1 0 6v2c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><line x1="13" y1="5" x2="13" y2="7" stroke-dasharray="0 1"/><line x1="13" y1="11" x2="13" y2="13" stroke-dasharray="0 1"/><line x1="13" y1="17" x2="13" y2="19" stroke-dasharray="0 1"/></svg>`,

  // 主页
  home: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,

  // 钱包
  wallet: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>`,

  // Telegram 官方频道（纸飞机）
  telegram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.78 18.35l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.5 13.3 3.42 12c-.88-.25-.89-.86-.2-1.12l16.27-6.28c.73-.27 1.43.18 1.15 1.3l-2.77 13.06c-.19.91-.74 1.13-1.5.71l-4.14-3.05-1.99 1.93c-.23.23-.42.42-.84.42z"/></svg>`,

  // 文档/协议
  doc: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>`,

  // 盾牌/安全
  shield: `<svg viewBox="0 0 24 24" class="icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,

  // 外链
  external: `<svg viewBox="0 0 24 24" class="icon icon-sm" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
};

// 渲染图标到页面上所有 data-icon 的元素
function renderIcons() {
  document.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.dataset.icon;
    if (Icons[name]) el.innerHTML = Icons[name];
  });
}

// Toast 提示（支持 success/error/info 三种类型，自带图标）
function ensureToastWrap() {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  return wrap;
}
function toast(msg, type = '') {
  const wrap = ensureToastWrap();
  const t = document.createElement('div');
  t.className = `toast ${type ? 'toast-' + type : ''}`;
  const iconMap = { success: Icons.check, error: Icons.x, info: Icons.info };
  const icon = iconMap[type];
  t.innerHTML = (icon ? `<span class="toast-icon">${icon}</span>` : '') + `<span class="toast-text"></span>`;
  t.querySelector('.toast-text').textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => {
    t.classList.add('fade-out');
    setTimeout(() => t.remove(), 300);
  }, 2400);
}

/* ===================================================================
   主题自动切换：6:01-18:00 白色日间，18:01-次日6:00 深色夜间
   =================================================================== */
function initTheme() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  // 白色区间：6:01 - 18:00（含）
  const isDay = minutes >= 361 && minutes <= 1080;
  const root = document.documentElement;
  if (isDay) root.setAttribute('data-theme', 'light');
  else root.removeAttribute('data-theme');
}

/* ===================================================================
   官方频道浮动按钮注入
   =================================================================== */
function injectFab() {
  if (document.querySelector('.fab-channel')) return;
  const a = document.createElement('a');
  a.className = 'fab-channel';
  a.href = 'https://t.me/XHNB881';
  a.target = '_blank';
  a.rel = 'noopener';
  a.title = '加入官方频道';
  a.innerHTML = `<span class="fab-tip">加入官方频道</span>${Icons.telegram}`;
  document.body.appendChild(a);
}

/* ===================================================================
   用户协议弹窗（首次进入显示，同意后 localStorage 记忆）
   =================================================================== */
function initAgreement() {
  // 登录/注册页不弹协议，避免每次进入登录界面都被打断
  const path = location.pathname;
  if (path === '/' || path === '/login' || path === '/register') return;
  if (localStorage.getItem('xh_agree_v1')) return;
  const mask = document.createElement('div');
  mask.className = 'agree-mask';
  mask.innerHTML = `
    <div class="agree-dialog">
      <div class="agree-head">
        <div class="logo-box" data-icon="logo"></div>
        <h2>用户协议与服务条款</h2>
        <p>请仔细阅读并同意后继续使用</p>
      </div>
      <div class="agree-body" id="agreeBody">
        <h3>一、服务说明</h3>
        <p>欢迎使用小涵下载交流平台（以下简称"本平台"）。本平台提供官方工具下载、用户交流社区、金币商城等服务。使用本平台即视为您已阅读、理解并同意本协议全部条款。</p>

        <h3>二、账号注册与使用</h3>
        <ul>
          <li>用户须使用真实信息注册账号，不得冒用他人身份；</li>
          <li>账号密码由用户自行保管，因账号泄露造成的损失由用户自行承担；</li>
          <li>禁止注册、转让、买卖账号，禁止将账号提供给他人用于违规用途；</li>
          <li>每个用户对以其账号进行的所有活动负全部责任。</li>
        </ul>

        <h3>三、用户行为规范</h3>
        <p>用户在使用本平台时，应遵守法律法规及公序良俗，不得发布、传播以下内容：</p>
        <ul>
          <li>违反国家法律法规、危害国家安全、破坏社会稳定的内容；</li>
          <li>侵犯他人知识产权、隐私权、名誉权等合法权益的内容；</li>
          <li>淫秽、色情、暴力、恐怖、赌博或教唆犯罪的内容；</li>
          <li>垃圾广告、虚假信息、欺诈内容或恶意程序；</li>
          <li>恶意攻击、辱骂、骚扰其他用户，破坏社区氛围的行为。</li>
        </ul>
        <p>违反上述规定的，本平台有权删除内容、限制或封禁账号，情节严重的将移交有关部门处理。</p>

        <h3>四、金币与商城</h3>
        <ul>
          <li>金币通过签到等平台活动获取，不可转移、提现或交易；</li>
          <li>兑换的商品/卡密一经发出，除平台原因外概不退换；</li>
          <li>VIP 权益为虚拟服务，开通后不支持退款；</li>
          <li>禁止利用漏洞刷取金币或商品，违者将回收并封禁账号。</li>
        </ul>

        <h3>五、下载资源</h3>
        <p>本平台提供的下载资源仅限个人学习交流使用，用户不得将资源用于商业用途或二次分发。资源版权归原作者或提供者所有，因使用资源产生的任何法律责任由用户自行承担。</p>

        <h3>六、免责声明</h3>
        <ul>
          <li>本平台不对资源的完整性、安全性、适用性作任何担保；</li>
          <li>因网络故障、服务器维护、不可抗力导致服务中断，本平台不承担责任；</li>
          <li>用户因使用本平台产生的任何直接或间接损失，本平台不承担赔偿责任。</li>
        </ul>

        <h3>七、协议变更</h3>
        <p>本平台有权根据运营需要修改本协议，修改后的协议自公布之日起生效。继续使用本平台即视为同意修改后的协议。</p>

        <h3>八、官方渠道</h3>
        <p>如需帮助或反馈，请通过官方 Telegram 频道联系：<a href="https://t.me/XHNB881" target="_blank" rel="noopener" style="color:var(--primary);font-weight:600;">@XHNB881</a></p>
      </div>
      <div class="agree-foot">
        <button class="btn btn-ghost" id="agreeNo">不同意</button>
        <button class="btn" id="agreeYes"><span data-icon="check"></span>我已阅读并同意</button>
      </div>
    </div>`;
  document.body.appendChild(mask);
  // 渲染弹窗内图标
  mask.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.dataset.icon;
    if (Icons[name]) el.innerHTML = Icons[name];
  });
  document.getElementById('agreeYes').addEventListener('click', () => {
    localStorage.setItem('xh_agree_v1', '1');
    mask.remove();
  });
  document.getElementById('agreeNo').addEventListener('click', () => {
    alert('您需同意协议才能继续使用本平台');
    try { window.location.href = 'about:blank'; } catch (e) {}
  });
}

/* 自动初始化（DOM 就绪后） */
function autoInit() {
  initTheme();
  injectFab();
  initAgreement();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
}
// 每分钟检查一次时间，跨点自动切换主题
setInterval(initTheme, 60000);

if (typeof module !== 'undefined') module.exports = Icons;
