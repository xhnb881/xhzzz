// 通过 HTTP 代理建立 SSH 隧道到 pinggy.io，暴露本地 3000 端口
const net = require('net');
const { Client } = require('ssh2');

const PROXY_HOST = '127.0.0.1';
const PROXY_PORT = 18080;
const SSH_HOST = 'a.pinggy.io';
const SSH_PORT = 443;
const LOCAL_PORT = 3000;

function connectThroughProxy(targetHost, targetPort, proxyHost, proxyPort) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(proxyPort, proxyHost, () => {
      socket.write(`CONNECT ${targetHost}:${targetPort} HTTP/1.1\r\nHost: ${targetHost}:${targetPort}\r\n\r\n`);
    });
    let buffer = '';
    socket.on('data', (data) => {
      buffer += data.toString();
      if (buffer.includes('\r\n\r\n')) {
        const statusLine = buffer.split('\r\n')[0];
        if (statusLine.includes('200')) {
          socket.removeAllListeners('data');
          resolve(socket);
        } else {
          reject(new Error(`Proxy CONNECT failed: ${statusLine}`));
        }
      }
    });
    socket.on('error', reject);
    socket.setTimeout(30000, () => reject(new Error('Proxy connection timeout')));
  });
}

(async () => {
  try {
    console.log('正在通过代理连接 pinggy.io:443 ...');
    const proxySocket = await connectThroughProxy(SSH_HOST, SSH_PORT, PROXY_HOST, PROXY_PORT);
    console.log('代理隧道已建立，正在 SSH 握手...');

    const conn = new Client();
    let urlFound = false;

    conn.on('ready', () => {
      console.log('SSH 连接成功，设置端口转发...');
      
      // 设置远程端口转发（0 = 自动分配端口）
      conn.forwardIn('0.0.0.0', 0, (err, port) => {
        if (err) {
          console.error('端口转发失败:', err.message);
          return;
        }
        console.log(`远程端口已分配: ${port}`);
      });

      // 打开 shell 会话以保持连接并获取 pinggy 输出的 URL
      conn.shell((err, stream) => {
        if (err) {
          console.error('Shell 打开失败:', err.message);
          return;
        }
        
        let output = '';
        stream.on('data', (data) => {
          const text = data.toString();
          output += text;
          process.stdout.write(text);
          
          // 提取 URL
          const urls = text.match(/https?:\/\/[^\s\r\n]+/g);
          if (urls && !urlFound) {
            urlFound = true;
            console.log('\n==========================');
            console.log('SUCCESS_URL:', urls[0]);
            console.log('==========================\n');
          }
        });
        
        stream.on('close', () => {
          console.log('Shell 会话已关闭');
        });

        // 保持连接：定期发送心跳
        setInterval(() => {
          try { stream.write('\n'); } catch(e) {}
        }, 30000);
      });
    });

    conn.on('tcp connection', (info, accept, reject) => {
      const localStream = accept();
      const localConn = net.connect(LOCAL_PORT, '127.0.0.1', () => {
        localStream.pipe(localConn);
        localConn.pipe(localStream);
      });
      localConn.on('error', () => { try { localStream.end(); } catch(e){} });
      localStream.on('error', () => { try { localConn.end(); } catch(e){} });
    });

    conn.on('error', (err) => {
      console.error('SSH 错误:', err.message);
    });

    conn.on('close', () => {
      console.log('SSH 连接已关闭，退出');
      process.exit(0);
    });

    conn.connect({
      sock: proxySocket,
      host: SSH_HOST,
      port: SSH_PORT,
      username: 'a.pinggy.io',
      password: '',
      tryKeyboard: true,
      readyTimeout: 30000,
      algorithms: {
        serverHostKey: ['rsa-sha2-512', 'rsa-sha2-256', 'ssh-rsa', 'ssh-ed25519', 'ecdsa-sha2-nistp256'],
        kex: ['curve25519-sha256', 'ecdh-sha2-nistp256', 'diffie-hellman-group14-sha256'],
        cipher: ['aes128-ctr', 'aes256-ctr', 'aes128-gcm', 'aes256-gcm'],
        hmac: ['hmac-sha2-256', 'hmac-sha2-512']
      }
    });

  } catch (err) {
    console.error('连接失败:', err.message);
    process.exit(1);
  }
})();
