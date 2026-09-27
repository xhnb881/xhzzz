#!/usr/bin/env python3
"""本地端口转发器：把本地 17835 经 HTTP 代理 CONNECT 转发到 bore.pub:7835。
   让 bore 客户端连本地 17835 即可经代理连到 bore 服务器。"""
import socket, threading, sys, time

LISTEN_PORT = 17835
PROXY_HOST = '127.0.0.1'
PROXY_PORT = 18080
REMOTE_HOST = 'bore.pub'
REMOTE_PORT = 7835

def forward(src, dst):
    try:
        while True:
            data = src.recv(65536)
            if not data:
                break
            dst.sendall(data)
    except Exception:
        pass
    finally:
        try: src.close()
        except: pass
        try: dst.close()
        except: pass

def handle(client):
    try:
        # 连到本地代理
        proxy = socket.create_connection((PROXY_HOST, PROXY_PORT), timeout=15)
        # 发 CONNECT 请求
        req = f'CONNECT {REMOTE_HOST}:{REMOTE_PORT} HTTP/1.1\r\nHost: {REMOTE_HOST}:{REMOTE_PORT}\r\n\r\n'
        proxy.sendall(req.encode())
        # 读代理响应头
        buf = b''
        while b'\r\n\r\n' not in buf:
            chunk = proxy.recv(1024)
            if not chunk:
                client.close()
                proxy.close()
                return
            buf += chunk
        if b'200' not in buf.split(b'\r\n')[0]:
            client.close()
            proxy.close()
            return
        # 双向转发
        t1 = threading.Thread(target=forward, args=(client, proxy), daemon=True)
        t2 = threading.Thread(target=forward, args=(proxy, client), daemon=True)
        t1.start(); t2.start()
        t1.join(); t2.join()
    except Exception as e:
        try: client.close()
        except: pass

def main():
    srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    srv.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    srv.bind(('127.0.0.1', LISTEN_PORT))
    srv.listen(128)
    print(f'[proxy-bore] 监听 127.0.0.1:{LISTEN_PORT} -> 经代理 -> {REMOTE_HOST}:{REMOTE_PORT}', flush=True)
    while True:
        try:
            client, addr = srv.accept()
            threading.Thread(target=handle, args=(client,), daemon=True).start()
        except Exception:
            time.sleep(0.1)

if __name__ == '__main__':
    main()
