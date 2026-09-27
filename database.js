const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// 初始化数据库表
db.serialize(() => {
  // 用户表
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT DEFAULT '',
    coins INTEGER DEFAULT 0,
    last_claim_date TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);

  // 迁移：为旧版本用户表添加字段
  db.all("PRAGMA table_info(users)", (err, cols) => {
    if (err) return;
    const names = cols.map(c => c.name);
    if (!names.includes('coins')) db.run("ALTER TABLE users ADD COLUMN coins INTEGER DEFAULT 0");
    if (!names.includes('last_claim_date')) db.run("ALTER TABLE users ADD COLUMN last_claim_date TEXT DEFAULT ''");
    if (!names.includes('is_banned')) db.run("ALTER TABLE users ADD COLUMN is_banned INTEGER DEFAULT 0");
    if (!names.includes('last_active')) db.run("ALTER TABLE users ADD COLUMN last_active TEXT DEFAULT ''");
    if (!names.includes('is_vip')) db.run("ALTER TABLE users ADD COLUMN is_vip INTEGER DEFAULT 0");
    if (!names.includes('vip_expires_at')) db.run("ALTER TABLE users ADD COLUMN vip_expires_at TEXT DEFAULT ''");
    if (!names.includes('display_name')) db.run("ALTER TABLE users ADD COLUMN display_name TEXT DEFAULT ''");
  });

  // 帖子表（用户交流社区）
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    images TEXT DEFAULT '',
    likes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // 下载资源表（仅管理员可发布）
  db.run(`CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    version TEXT DEFAULT '',
    size TEXT DEFAULT '',
    download_url TEXT DEFAULT '',
    icon_type TEXT DEFAULT 'download',
    image TEXT DEFAULT '',
    downloads_count INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);

  // 下载点赞记录
  db.run(`CREATE TABLE IF NOT EXISTS download_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    download_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    UNIQUE(user_id, download_id)
  )`);

  // 评论表
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    images TEXT DEFAULT '',
    parent_id INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // 迁移评论表添加parent_id
  db.all("PRAGMA table_info(comments)", (err, cols) => {
    if (err) return;
    const names = cols.map(c => c.name);
    if (!names.includes('parent_id')) db.run("ALTER TABLE comments ADD COLUMN parent_id INTEGER DEFAULT 0");
  });

  // 迁移下载表 icon -> icon_type
  db.all("PRAGMA table_info(downloads)", (err, cols) => {
    if (err) return;
    const names = cols.map(c => c.name);
    if (names.includes('icon') && !names.includes('icon_type')) {
      db.run("ALTER TABLE downloads RENAME COLUMN icon TO icon_type");
    }
    if (!names.includes('likes')) db.run("ALTER TABLE downloads ADD COLUMN likes INTEGER DEFAULT 0");
    if (!names.includes('image')) db.run("ALTER TABLE downloads ADD COLUMN image TEXT DEFAULT ''");
  });

  // 迁移帖子表添加置顶字段
  db.all("PRAGMA table_info(posts)", (err, cols) => {
    if (err) return;
    const names = cols.map(c => c.name);
    if (!names.includes('is_pinned')) db.run("ALTER TABLE posts ADD COLUMN is_pinned INTEGER DEFAULT 0");
  });

  // 点赞记录
  db.run(`CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    created_at TEXT DEFAULT (datetime('now','localtime')),
    UNIQUE(user_id, post_id)
  )`);

  // 商城兑换商品表（管理员设置）
  db.run(`CREATE TABLE IF NOT EXISTS shop_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    icon_type TEXT DEFAULT 'gift',
    cost INTEGER NOT NULL DEFAULT 0,
    stock INTEGER DEFAULT -1,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);

  // 兑换记录表
  db.run(`CREATE TABLE IF NOT EXISTS exchange_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    item_title TEXT NOT NULL,
    cost INTEGER NOT NULL,
    keys TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);

  // 商城卡密表（每个卡密=1个库存）
  db.run(`CREATE TABLE IF NOT EXISTS shop_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER NOT NULL,
    key_value TEXT NOT NULL,
    used INTEGER DEFAULT 0,
    used_by INTEGER DEFAULT NULL,
    used_at TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);

  // 迁移兑换记录表加keys字段
  db.all("PRAGMA table_info(exchange_records)", (err, cols) => {
    if (err) return;
    const names = cols.map(c => c.name);
    if (!names.includes('keys')) db.run("ALTER TABLE exchange_records ADD COLUMN keys TEXT DEFAULT ''");
  });

  // VIP兑换码表
  db.run(`CREATE TABLE IF NOT EXISTS vip_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    days INTEGER NOT NULL DEFAULT 30,
    used INTEGER DEFAULT 0,
    used_by INTEGER DEFAULT NULL,
    used_at TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);

  // 反馈表
  db.run(`CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    username TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now','localtime'))
  )`);

  // 管理员账号
  const DEFAULT_AVATAR = '/uploads/logo-xiaohan.jpg';
  const ADMIN_USER = 'xhzzz';
  const ADMIN_PASS = '112233hcy';
  // 将旧的 admin 账号重命名为新账号
  db.run("UPDATE users SET username = ? WHERE username = 'admin'", [ADMIN_USER], () => {
    db.get("SELECT * FROM users WHERE username = ?", [ADMIN_USER], (err, row) => {
      if (err) {
        console.error('检查管理员账号失败:', err.message);
        return;
      }
      if (!row) {
        const hashedPassword = bcrypt.hashSync(ADMIN_PASS, 10);
        db.run("INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)",
          [ADMIN_USER, hashedPassword, DEFAULT_AVATAR], (err) => {
            if (err) console.error('创建管理员账号失败:', err.message);
            else console.log(`管理员账号已创建: ${ADMIN_USER} / ${ADMIN_PASS}`);
          });
      } else {
        // 确保密码和头像正确
        const hashedPassword = bcrypt.hashSync(ADMIN_PASS, 10);
        db.run("UPDATE users SET password = ?, avatar = ? WHERE username = ?",
          [hashedPassword, DEFAULT_AVATAR, ADMIN_USER], (err) => {
            if (err) console.error('更新管理员账号失败:', err.message);
            else console.log(`管理员账号已就绪: ${ADMIN_USER} / ${ADMIN_PASS}`);
          });
      }
    });
  });

  // 仅管理员使用logo头像，其他用户不强制设置默认头像（前端显示首字母）
  // 将之前被误设为logo头像的非管理员用户清空
  db.run("UPDATE users SET avatar = '' WHERE username != ? AND avatar = ?", [ADMIN_USER, DEFAULT_AVATAR]);
  // 为无显示名的用户设置默认显示名为用户名
  db.run("UPDATE users SET display_name = username WHERE display_name IS NULL OR display_name = ''", function(err) {
    if (err) {
      // display_name列还不存在（迁移未完成），稍后重试
      setTimeout(() => {
        db.run("UPDATE users SET display_name = username WHERE display_name IS NULL OR display_name = ''");
      }, 500);
    }
  });
});

// 通用查询辅助函数
async function query(sql, params = []) {
  const result = await db.execute({ sql, args: params });
  return result.rows;
}

async function run(sql, params = []) {
  const result = await db.execute({ sql, args: params });
  return { lastID: Number(result.lastInsertRowid), changes: result.rowsAffected };
}
module.exports = { db, query, run };
