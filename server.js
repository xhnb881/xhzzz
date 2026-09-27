const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const { query, run } = require('./database');

const ADMIN_USERNAME = 'xhzzz';

const app = express();
const PORT = process.env.PORT || 3000;
const DAILY_COINS = 10;
const ONLINE_THRESHOLD = 5 * 60 * 1000; // 5分钟内活跃视为在线
const DEFAULT_AVATAR = '/uploads/logo-xiaohan.jpg';

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(session({
  secret: 'xiaohan-community-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname)));
app.use('/css', express.static(path.join(__dirname)));
app.use('/js', express.static(path.join(__dirname)));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({
  storage, limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const t = /jpeg|jpg|png|gif|webp/;
    if (t.test(path.extname(file.originalname).toLowerCase()) && t.test(file.mimetype)) cb(null, true);
    else cb(new Error('只支持图片文件'));
  }
});

// ==================== 中间件 ====================
function now() { return new Date().toISOString().slice(0, 19).replace('T', ' '); }

async function updateActive(req, res, next) {
  if (req.session && req.session.userId) {
    run("UPDATE users SET last_active = ? WHERE id = ?", [now(), req.session.userId]).catch(() => {});
  }
  next();
}
app.use(updateActive);

function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) return res.status(401).json({ error: '请先登录' });
  // 检查封禁
  query("SELECT is_banned FROM users WHERE id = ?", [req.session.userId]).then(rows => {
    if (rows[0] && rows[0].is_banned) {
      req.session.destroy();
      return res.status(403).json({ error: '账号已被封禁' });
    }
    next();
  }).catch(() => next());
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.username === 'xhzzz') return next();
  res.status(403).json({ error: '需要管理员权限' });
}

// ==================== 认证 ====================
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' });
    if (username.length < 3 || username.length > 20) return res.status(400).json({ error: '用户名长度需在3-20之间' });
    if (password.length < 6) return res.status(400).json({ error: '密码至少6位' });
    const existing = await query("SELECT id FROM users WHERE username = ?", [username]);
    if (existing.length > 0) return res.status(400).json({ error: '用户名已被注册' });
    const hashed = bcrypt.hashSync(password, 10);
    const r = await run("INSERT INTO users (username, password, avatar, display_name, coins, last_active) VALUES (?, ?, '', ?, 0, ?)", [username, hashed, username, now()]);
    req.session.userId = r.lastID;
    req.session.username = username;
    res.json({ success: true, user: { id: r.lastID, username, display_name: username, coins: 0, avatar: '', is_vip: 0, vip_expires_at: '', isAdmin: false } });
  } catch (err) { res.status(500).json({ error: '注册失败: ' + err.message }); }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: '用户名和密码不能为空' });
    const users = await query("SELECT * FROM users WHERE username = ?", [username]);
    if (users.length === 0) return res.status(400).json({ error: '用户名或密码错误' });
    const u = users[0];
    if (u.is_banned) return res.status(403).json({ error: '该账号已被封禁，请联系管理员' });
    if (!bcrypt.compareSync(password, u.password)) return res.status(400).json({ error: '用户名或密码错误' });
    req.session.userId = u.id;
    req.session.username = u.username;
    run("UPDATE users SET last_active = ? WHERE id = ?", [now(), u.id]).catch(() => {});
    res.json({ success: true, user: {
      id: u.id, username: u.username, display_name: u.display_name || u.username,
      coins: u.coins || 0, avatar: u.avatar || '',
      is_vip: u.is_vip || 0, vip_expires_at: u.vip_expires_at || '',
      isAdmin: u.username === 'xhzzz'
    } });
  } catch (err) { res.status(500).json({ error: '登录失败: ' + err.message }); }
});

app.post('/api/logout', (req, res) => { req.session.destroy(); res.json({ success: true }); });

app.get('/api/me', async (req, res) => {
  if (!req.session || !req.session.userId) return res.status(401).json({ error: '未登录' });
  const users = await query("SELECT coins, is_banned, avatar, is_vip, vip_expires_at, display_name FROM users WHERE id = ?", [req.session.userId]);
  if (!users[0]) return res.status(401).json({ error: '未登录' });
  if (users[0].is_banned) { req.session.destroy(); return res.status(403).json({ error: '账号已被封禁' }); }
  const u = users[0];
  // VIP过期检测
  let isVip = u.is_vip || 0;
  let vipExpires = u.vip_expires_at || '';
  if (isVip && vipExpires) {
    const expireDate = new Date(vipExpires.replace(' ', 'T'));
    if (expireDate < new Date()) { isVip = 0; vipExpires = ''; }
  }
  res.json({
    id: req.session.userId, username: req.session.username,
    display_name: u.display_name || req.session.username,
    coins: u.coins || 0, avatar: u.avatar || '',
    is_vip: isVip, vip_expires_at: vipExpires,
    isAdmin: req.session.username === 'xhzzz'
  });
});

// 用户更新自己的资料（显示名、头像）
app.post('/api/profile', requireLogin, async (req, res) => {
  try {
    const { display_name, avatar } = req.body;
    const fields = [];
    const values = [];
    if (display_name !== undefined) {
      const name = display_name.trim();
      if (name.length < 1 || name.length > 20) return res.status(400).json({ error: '昵称长度需在1-20之间' });
      fields.push("display_name = ?"); values.push(name);
    }
    if (avatar !== undefined) { fields.push("avatar = ?"); values.push(avatar); }
    if (fields.length === 0) return res.status(400).json({ error: '没有可更新的字段' });
    values.push(req.session.userId);
    await run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: '更新失败: ' + err.message }); }
});

// 上传头像文件
app.post('/api/profile/avatar', requireLogin, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: '请选择图片文件' });
    const avatarUrl = '/uploads/' + req.file.filename;
    res.json({ success: true, avatar: avatarUrl });
  } catch (err) { res.status(500).json({ error: '上传失败: ' + err.message }); }
});

// ==================== 金币系统 ====================
app.post('/api/coins/claim', requireLogin, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const u = (await query("SELECT coins, last_claim_date, is_vip, vip_expires_at FROM users WHERE id = ?", [req.session.userId]))[0];
    if (u.last_claim_date === today) return res.status(400).json({ error: '今日已签到，明天再来吧' });
    // VIP用户每日30金币，普通用户10金币
    let isVip = u.is_vip || 0;
    if (isVip && u.vip_expires_at) {
      const expireDate = new Date(u.vip_expires_at.replace(' ', 'T'));
      if (expireDate < new Date()) isVip = 0;
    }
    const reward = isVip ? 30 : DAILY_COINS;
    const newCoins = (u.coins || 0) + reward;
    await run("UPDATE users SET coins = ?, last_claim_date = ? WHERE id = ?", [newCoins, today, req.session.userId]);
    res.json({ success: true, coins: newCoins, earned: reward, isVip });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/shop', async (req, res) => {
  try {
    const items = await query("SELECT * FROM shop_items ORDER BY cost ASC");
    // 库存 = 未使用的卡密数量
    for (const item of items) {
      const stockRow = (await query("SELECT COUNT(*) as c FROM shop_keys WHERE item_id = ? AND used = 0", [item.id]))[0];
      item.stock = stockRow.c;
    }
    res.json(items);
  }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/shop/:id/exchange', requireLogin, async (req, res) => {
  try {
    const item = (await query("SELECT * FROM shop_items WHERE id = ?", [req.params.id]))[0];
    if (!item) return res.status(404).json({ error: '商品不存在' });
    const quantity = Math.max(1, parseInt(req.body.quantity) || 1);
    const u = (await query("SELECT coins FROM users WHERE id = ?", [req.session.userId]))[0];
    const totalCost = item.cost * quantity;
    if ((u.coins || 0) < totalCost) return res.status(400).json({ error: '金币不足' });
    // 检查卡密库存
    const available = (await query("SELECT COUNT(*) as c FROM shop_keys WHERE item_id = ? AND used = 0", [item.id]))[0].c;
    if (available < quantity) return res.status(400).json({ error: `库存不足，仅剩 ${available} 个` });
    // 扣除金币
    const newCoins = u.coins - totalCost;
    await run("UPDATE users SET coins = ? WHERE id = ?", [newCoins, req.session.userId]);
    // 取出卡密
    const keys = await query("SELECT * FROM shop_keys WHERE item_id = ? AND used = 0 LIMIT ?", [item.id, quantity]);
    const keyValues = keys.map(k => k.key_value);
    const keyIds = keys.map(k => k.id);
    // 标记已使用
    const placeholders = keyIds.map(() => '?').join(',');
    await run(`UPDATE shop_keys SET used = 1, used_by = ?, used_at = ? WHERE id IN (${placeholders})`,
      [req.session.userId, now(), ...keyIds]);
    // 记录兑换
    await run("INSERT INTO exchange_records (user_id, username, item_id, item_title, cost, keys) VALUES (?, ?, ?, ?, ?, ?)",
      [req.session.userId, req.session.username, item.id, item.title, totalCost, keyValues.join('\n')]);
    res.json({ success: true, coins: newCoins, keys: keyValues, item_title: item.title });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==================== 下载社区 ====================
app.get('/api/downloads', async (req, res) => {
  try {
    const downloads = await query("SELECT * FROM downloads ORDER BY id DESC");
    const userId = req.session ? req.session.userId : null;
    if (userId) {
      const liked = await query("SELECT download_id FROM download_likes WHERE user_id = ?", [userId]);
      const ids = liked.map(l => l.download_id);
      downloads.forEach(d => { d.liked = ids.includes(d.id); });
    } else { downloads.forEach(d => { d.liked = false; }); }
    res.json(downloads);
  }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/downloads/:id/count', async (req, res) => {
  try { await run("UPDATE downloads SET downloads_count = downloads_count + 1 WHERE id = ?", [req.params.id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
// 下载资源点赞
app.post('/api/downloads/:id/like', requireLogin, async (req, res) => {
  try {
    const existing = await query("SELECT id FROM download_likes WHERE user_id = ? AND download_id = ?", [req.session.userId, req.params.id]);
    if (existing.length > 0) {
      await run("DELETE FROM download_likes WHERE user_id = ? AND download_id = ?", [req.session.userId, req.params.id]);
      await run("UPDATE downloads SET likes = likes - 1 WHERE id = ?", [req.params.id]);
      res.json({ success: true, liked: false });
    } else {
      await run("INSERT INTO download_likes (user_id, download_id) VALUES (?, ?)", [req.session.userId, req.params.id]);
      await run("UPDATE downloads SET likes = likes + 1 WHERE id = ?", [req.params.id]);
      res.json({ success: true, liked: true });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==================== 帖子社区 ====================
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await query(`
      SELECT p.*, u.display_name, u.is_vip, u.avatar,
        (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) as like_count,
        (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) as comment_count
      FROM posts p LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.is_pinned DESC, p.id DESC LIMIT 100
    `);
    const userId = req.session ? req.session.userId : null;
    if (userId) {
      const liked = await query("SELECT post_id FROM likes WHERE user_id = ?", [userId]);
      const ids = liked.map(l => l.post_id);
      posts.forEach(p => { p.liked = ids.includes(p.id); });
    } else { posts.forEach(p => { p.liked = false; }); }
    res.json(posts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 发布帖子（用户和管理员通用，管理员可置顶）
app.post('/api/posts', requireLogin, upload.array('images', 9), async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: '内容不能为空' });
    let images = '';
    if (req.files && req.files.length > 0) images = req.files.map(f => '/uploads/' + f.filename).join(',');
    const isAdmin = req.session.username === 'xhzzz';
    const isPinned = isAdmin && req.body.is_pinned === 'true' ? 1 : 0;
    const result = await run(
      "INSERT INTO posts (user_id, username, content, images, is_pinned) VALUES (?, ?, ?, ?, ?)",
      [req.session.userId, req.session.username, content.trim(), images, isPinned]
    );
    const post = (await query(`
      SELECT p.*, u.display_name, u.is_vip, u.avatar,
        0 as like_count
      FROM posts p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = ?
    `, [result.lastID]))[0];
    post.liked = false;
    broadcast({ type: 'new_post', post });
    res.json({ success: true, post });
  } catch (err) { res.status(500).json({ error: '发布失败: ' + err.message }); }
});

app.post('/api/posts/:id/like', requireLogin, async (req, res) => {
  try {
    const existing = await query("SELECT id FROM likes WHERE user_id = ? AND post_id = ?", [req.session.userId, req.params.id]);
    if (existing.length > 0) {
      await run("DELETE FROM likes WHERE user_id = ? AND post_id = ?", [req.session.userId, req.params.id]);
      broadcast({ type: 'unlike', postId: req.params.id });
      res.json({ success: true, liked: false });
    } else {
      await run("INSERT INTO likes (user_id, post_id) VALUES (?, ?)", [req.session.userId, req.params.id]);
      broadcast({ type: 'like', postId: req.params.id });
      res.json({ success: true, liked: true });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/posts/:id', requireLogin, async (req, res) => {
  try {
    const post = (await query("SELECT * FROM posts WHERE id = ?", [req.params.id]))[0];
    if (!post) return res.status(404).json({ error: '帖子不存在' });
    if (post.user_id !== req.session.userId && req.session.username !== 'xhzzz')
      return res.status(403).json({ error: '无权删除' });
    await run("DELETE FROM posts WHERE id = ?", [req.params.id]);
    await run("DELETE FROM likes WHERE post_id = ?", [req.params.id]);
    await run("DELETE FROM comments WHERE post_id = ?", [req.params.id]);
    broadcast({ type: 'delete_post', postId: req.params.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==================== 评论系统 ====================
// 获取帖子的评论列表
app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const comments = await query(`
      SELECT c.*, u.display_name, u.is_vip, u.avatar,
        (SELECT username FROM comments pc WHERE pc.id = c.parent_id) as parent_username
      FROM comments c LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ? ORDER BY c.id ASC
    `, [req.params.id]);
    res.json(comments);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 发表评论（支持图片表情包、回复指定评论）
app.post('/api/posts/:id/comments', requireLogin, upload.array('images', 9), async (req, res) => {
  try {
    const { content, parent_id } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: '评论内容不能为空' });
    const post = (await query("SELECT id FROM posts WHERE id = ?", [req.params.id]))[0];
    if (!post) return res.status(404).json({ error: '帖子不存在' });
    const pid = parseInt(parent_id) || 0;
    let images = '';
    if (req.files && req.files.length > 0) images = req.files.map(f => '/uploads/' + f.filename).join(',');
    const r = await run(
      "INSERT INTO comments (post_id, user_id, username, content, images, parent_id) VALUES (?, ?, ?, ?, ?, ?)",
      [req.params.id, req.session.userId, req.session.username, content.trim(), images, pid]
    );
    const comment = (await query(`
      SELECT c.*, u.display_name, u.is_vip, u.avatar,
        (SELECT username FROM comments pc WHERE pc.id = c.parent_id) as parent_username
      FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.id = ?
    `, [r.lastID]))[0];
    broadcast({ type: 'new_comment', postId: parseInt(req.params.id), comment });
    res.json({ success: true, comment });
  } catch (err) { res.status(500).json({ error: '评论失败: ' + err.message }); }
});

// 删除评论
app.delete('/api/comments/:id', requireLogin, async (req, res) => {
  try {
    const comment = (await query("SELECT * FROM comments WHERE id = ?", [req.params.id]))[0];
    if (!comment) return res.status(404).json({ error: '评论不存在' });
    if (comment.user_id !== req.session.userId && req.session.username !== 'xhzzz')
      return res.status(403).json({ error: '无权删除' });
    await run("DELETE FROM comments WHERE id = ?", [req.params.id]);
    broadcast({ type: 'delete_comment', postId: comment.post_id, commentId: comment.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==================== 管理员后台 ====================
// 统计
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10);
    const userCount = (await query("SELECT COUNT(*) as c FROM users"))[0].c;
    const postCount = (await query("SELECT COUNT(*) as c FROM posts"))[0].c;
    const downloadCount = (await query("SELECT COUNT(*) as c FROM downloads"))[0].c;
    const totalDownloads = (await query("SELECT COALESCE(SUM(downloads_count),0) as c FROM downloads"))[0].c;
    const shopCount = (await query("SELECT COUNT(*) as c FROM shop_items"))[0].c;
    const exchangeCount = (await query("SELECT COUNT(*) as c FROM exchange_records"))[0].c;
    const totalCoins = (await query("SELECT COALESCE(SUM(coins),0) as c FROM users"))[0].c;
    const newUsers = (await query("SELECT COUNT(*) as c FROM users WHERE date(created_at) = ?", [date]))[0].c;
    const newPosts = (await query("SELECT COUNT(*) as c FROM posts WHERE date(created_at) = ?", [date]))[0].c;
    const bannedCount = (await query("SELECT COUNT(*) as c FROM users WHERE is_banned = 1"))[0].c;
    const vipCount = (await query("SELECT COUNT(*) as c FROM users WHERE is_vip = 1"))[0].c;
    const feedbackCount = (await query("SELECT COUNT(*) as c FROM feedbacks"))[0].c;
    const unreadFeedback = (await query("SELECT COUNT(*) as c FROM feedbacks WHERE is_read = 0"))[0].c;
    // 在线用户（5分钟内活跃）
    const onlineCount = (await query("SELECT COUNT(*) as c FROM users WHERE last_active > datetime('now','-5 minutes')"))[0].c;
    res.json({ userCount, postCount, downloadCount, totalDownloads, shopCount, exchangeCount, totalCoins, newUsers, newPosts, bannedCount, onlineCount, vipCount, feedbackCount, unreadFeedback, date });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 用户管理
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try { res.json(await query("SELECT id, username, display_name, coins, is_banned, is_vip, vip_expires_at, last_active, created_at FROM users ORDER BY id DESC")); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/users/:id', requireAdmin, async (req, res) => {
  try {
    const u = (await query("SELECT * FROM users WHERE id = ?", [req.params.id]))[0];
    if (!u) return res.status(404).json({ error: '用户不存在' });
    if (u.username === 'xhzzz') return res.status(400).json({ error: '不能删除管理员' });
    await run("DELETE FROM posts WHERE user_id = ?", [u.id]);
    await run("DELETE FROM likes WHERE user_id = ?", [u.id]);
    await run("DELETE FROM users WHERE id = ?", [u.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 封禁/解封
app.post('/api/admin/users/:id/ban', requireAdmin, async (req, res) => {
  try {
    const u = (await query("SELECT * FROM users WHERE id = ?", [req.params.id]))[0];
    if (!u) return res.status(404).json({ error: '用户不存在' });
    if (u.username === 'xhzzz') return res.status(400).json({ error: '不能封禁管理员' });
    await run("UPDATE users SET is_banned = 1 WHERE id = ?", [u.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/users/:id/unban', requireAdmin, async (req, res) => {
  try {
    await run("UPDATE users SET is_banned = 0 WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 增减金币
app.post('/api/admin/users/:id/coins', requireAdmin, async (req, res) => {
  try {
    const { amount } = req.body;
    const delta = parseInt(amount);
    if (isNaN(delta)) return res.status(400).json({ error: '金币数量无效' });
    const u = (await query("SELECT coins FROM users WHERE id = ?", [req.params.id]))[0];
    if (!u) return res.status(404).json({ error: '用户不存在' });
    const newCoins = Math.max(0, (u.coins || 0) + delta);
    await run("UPDATE users SET coins = ? WHERE id = ?", [newCoins, req.params.id]);
    res.json({ success: true, coins: newCoins });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 帖子管理
app.delete('/api/admin/posts/:id', requireAdmin, async (req, res) => {
  try {
    await run("DELETE FROM posts WHERE id = ?", [req.params.id]);
    await run("DELETE FROM likes WHERE post_id = ?", [req.params.id]);
    broadcast({ type: 'delete_post', postId: req.params.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 置顶/取消置顶
app.post('/api/admin/posts/:id/pin', requireAdmin, async (req, res) => {
  try {
    const p = (await query("SELECT is_pinned FROM posts WHERE id = ?", [req.params.id]))[0];
    if (!p) return res.status(404).json({ error: '帖子不存在' });
    const newVal = p.is_pinned ? 0 : 1;
    await run("UPDATE posts SET is_pinned = ? WHERE id = ?", [newVal, req.params.id]);
    broadcast({ type: 'pin_update', postId: req.params.id, is_pinned: newVal });
    res.json({ success: true, is_pinned: newVal });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 下载管理
app.post('/api/admin/downloads', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, version, download_url } = req.body;
    if (!title) return res.status(400).json({ error: '标题不能为空' });
    let image = '';
    if (req.file) image = '/uploads/' + req.file.filename;
    const r = await run("INSERT INTO downloads (title, description, version, download_url, image) VALUES (?, ?, ?, ?, ?)",
      [title, description || '', version || '', download_url || '#', image]);
    res.json({ success: true, id: r.lastID });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/admin/downloads/:id', requireAdmin, async (req, res) => {
  try { await run("DELETE FROM downloads WHERE id = ?", [req.params.id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// 商城管理
app.get('/api/admin/shop', requireAdmin, async (req, res) => {
  try {
    const items = await query("SELECT * FROM shop_items ORDER BY id DESC");
    for (const item of items) {
      item.stock = (await query("SELECT COUNT(*) as c FROM shop_keys WHERE item_id = ? AND used = 0", [item.id]))[0].c;
    }
    res.json(items);
  }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.post('/api/admin/shop', requireAdmin, async (req, res) => {
  try {
    const { title, description, icon_type, cost, keys } = req.body;
    if (!title) return res.status(400).json({ error: '商品名称不能为空' });
    const r = await run("INSERT INTO shop_items (title, description, icon_type, cost, stock) VALUES (?, ?, ?, ?, 0)",
      [title, description || '', icon_type || 'gift', Number(cost) || 0]);
    const itemId = r.lastID;
    // 解析卡密（一行一个）
    const keyList = (keys || '').split('\n').map(k => k.trim()).filter(Boolean);
    for (const k of keyList) {
      await run("INSERT INTO shop_keys (item_id, key_value) VALUES (?, ?)", [itemId, k]);
    }
    res.json({ success: true, id: itemId, stock: keyList.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// 为已有商品追加卡密
app.post('/api/admin/shop/:id/keys', requireAdmin, async (req, res) => {
  try {
    const { keys } = req.body;
    const keyList = (keys || '').split('\n').map(k => k.trim()).filter(Boolean);
    for (const k of keyList) {
      await run("INSERT INTO shop_keys (item_id, key_value) VALUES (?, ?)", [req.params.id, k]);
    }
    res.json({ success: true, added: keyList.length });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
// 查看商品卡密列表
app.get('/api/admin/shop/:id/keys', requireAdmin, async (req, res) => {
  try { res.json(await query("SELECT * FROM shop_keys WHERE item_id = ? ORDER BY id DESC", [req.params.id])); }
  catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/admin/shop/:id', requireAdmin, async (req, res) => {
  try {
    await run("DELETE FROM shop_keys WHERE item_id = ?", [req.params.id]);
    await run("DELETE FROM shop_items WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// 兑换记录
app.get('/api/admin/exchanges', requireAdmin, async (req, res) => {
  try { res.json(await query("SELECT * FROM exchange_records ORDER BY id DESC LIMIT 100")); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ==================== VIP兑换码 ====================
// 生成VIP兑换码（管理员）
app.post('/api/admin/vip/generate', requireAdmin, async (req, res) => {
  try {
    const { days, count } = req.body;
    const d = Math.max(1, Math.min(3650, parseInt(days) || 30));
    const n = Math.max(1, Math.min(100, parseInt(count) || 1));
    const codes = [];
    for (let i = 0; i < n; i++) {
      const code = 'VIP' + Math.random().toString(36).substring(2, 8).toUpperCase() + Math.random().toString(36).substring(2, 4).toUpperCase();
      await run("INSERT INTO vip_codes (code, days) VALUES (?, ?)", [code, d]);
      codes.push({ code, days: d });
    }
    res.json({ success: true, codes });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 查看VIP兑换码列表（管理员）
app.get('/api/admin/vip/codes', requireAdmin, async (req, res) => {
  try { res.json(await query("SELECT * FROM vip_codes ORDER BY id DESC LIMIT 200")); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// 删除VIP兑换码（管理员）
app.delete('/api/admin/vip/codes/:id', requireAdmin, async (req, res) => {
  try { await run("DELETE FROM vip_codes WHERE id = ?", [req.params.id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// 用户兑换VIP
app.post('/api/vip/redeem', requireLogin, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: '请输入兑换码' });
    const vipCode = (await query("SELECT * FROM vip_codes WHERE code = ?", [code.trim().toUpperCase()]))[0];
    if (!vipCode) return res.status(400).json({ error: '兑换码无效' });
    if (vipCode.used) return res.status(400).json({ error: '该兑换码已被使用' });
    const u = (await query("SELECT is_vip, vip_expires_at FROM users WHERE id = ?", [req.session.userId]))[0];
    // 计算到期时间：如果当前VIP未过期则在现有基础上延长，否则从现在开始
    let startDate = new Date();
    if (u.is_vip && u.vip_expires_at) {
      const exp = new Date(u.vip_expires_at.replace(' ', 'T'));
      if (exp > startDate) startDate = exp;
    }
    const expireDate = new Date(startDate.getTime() + vipCode.days * 24 * 60 * 60 * 1000);
    const expireStr = expireDate.toISOString().slice(0, 19).replace('T', ' ');
    await run("UPDATE users SET is_vip = 1, vip_expires_at = ? WHERE id = ?", [expireStr, req.session.userId]);
    await run("UPDATE vip_codes SET used = 1, used_by = ?, used_at = ? WHERE id = ?", [req.session.userId, now(), vipCode.id]);
    res.json({ success: true, vip_expires_at: expireStr, days: vipCode.days });
  } catch (err) { res.status(500).json({ error: '兑换失败: ' + err.message }); }
});

// ==================== 用户兑换记录 ====================
app.get('/api/my/exchanges', requireLogin, async (req, res) => {
  try {
    const records = await query(
      "SELECT * FROM exchange_records WHERE user_id = ? ORDER BY id DESC",
      [req.session.userId]
    );
    res.json(records);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==================== 反馈系统 ====================
// 用户提交反馈
app.post('/api/feedback', requireLogin, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: '反馈内容不能为空' });
    await run("INSERT INTO feedbacks (user_id, username, content) VALUES (?, ?, ?)",
      [req.session.userId, req.session.username, content.trim()]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: '提交失败: ' + err.message }); }
});

// 管理员查看反馈列表
app.get('/api/admin/feedbacks', requireAdmin, async (req, res) => {
  try { res.json(await query("SELECT * FROM feedbacks ORDER BY id DESC")); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// 管理员标记已读
app.post('/api/admin/feedbacks/:id/read', requireAdmin, async (req, res) => {
  try { await run("UPDATE feedbacks SET is_read = 1 WHERE id = ?", [req.params.id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// 管理员删除反馈
app.delete('/api/admin/feedbacks/:id', requireAdmin, async (req, res) => {
  try { await run("DELETE FROM feedbacks WHERE id = ?", [req.params.id]); res.json({ success: true }); }
  catch (err) { res.status(500).json({ error: err.message }); }
});

// ==================== WebSocket ====================
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });
const clients = new Set();
wss.on('connection', (ws) => { clients.add(ws); ws.on('close', () => clients.delete(ws)); ws.on('error', () => clients.delete(ws)); });
function broadcast(data) {
  const msg = JSON.stringify(data);
  clients.forEach(c => { if (c.readyState === WebSocket.OPEN) c.send(msg); });
}

// ==================== 页面路由 ====================
app.get('/', (req, res) => {
  if (req.session && req.session.userId) res.sendFile(path.join(__dirname, 'community.html'));
  else res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'register.html')));
app.get('/community', (req, res) => {
  if (req.session && req.session.userId) res.sendFile(path.join(__dirname, 'community.html'));
  else res.redirect('/login');
});
app.get('/download', (req, res) => res.sendFile(path.join(__dirname, 'download.html')));
app.get('/shop', (req, res) => {
  if (req.session && req.session.userId) res.sendFile(path.join(__dirname, 'shop.html'));
  else res.redirect('/login');
});
app.get('/me', (req, res) => {
  if (req.session && req.session.userId) res.sendFile(path.join(__dirname, 'me.html'));
  else res.redirect('/login');
});
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: err.message || '服务器错误' }); });

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n小涵下载交流 服务器已启动`);
  console.log(`本地访问: http://localhost:${PORT}`);
  console.log(`管理员账号: xhzzz / 112233hcy`);
  console.log(`每日签到金币: ${DAILY_COINS}\n`);
});

