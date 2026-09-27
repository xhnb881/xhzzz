#!/bin/bash
# Serveo 固定子域名隧道守护脚本（通过 HTTP 代理）
# 功能：保持固定子域名隧道长期运行，断开自动重连 + 本地服务器监控

LOGFILE="/workspace/serveo-tunnel.log"
PROXY="127.0.0.1:18080"
LOCAL_PORT=3000
SERVER_JS="/workspace/server.js"
SUBDOMAIN="xhdl2026"  # 固定子域名（已注册SSH公钥保留）
SSH_KEY="/root/.ssh/serveo_key"
CHECK_INTERVAL=60

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOGFILE"; }

# 启动 Node.js 服务器
start_server() {
    if ! pgrep -f "node.*server.js" > /dev/null 2>&1; then
        log "本地服务器未运行，正在启动..."
        cd /workspace && nohup node "$SERVER_JS" >> /workspace/server-stdout.log 2>&1 &
        sleep 4
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:$LOCAL_PORT/ 2>/dev/null | grep -q "200\|302\|301"; then
            log "本地服务器启动成功 (端口 $LOCAL_PORT)"
        else
            log "警告：本地服务器启动后响应异常"
        fi
    fi
}

# 启动 SSH 隧道（前台运行，进程退出后循环重连）
start_tunnel() {
    ssh -T \
        -i "$SSH_KEY" \
        -o ProxyCommand="socat - 'PROXY:127.0.0.1:%h:%p,proxyport=18080'" \
        -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        -o ServerAliveInterval=20 \
        -o ServerAliveCountMax=3 \
        -o ExitOnForwardFailure=yes \
        -R $SUBDOMAIN:80:localhost:$LOCAL_PORT \
        serveo.net >> "$LOGFILE" 2>&1
}

# 检查公网链接是否可访问
check_public_url() {
    curl -s -o /dev/null -w "%{http_code}" \
        "https://$SUBDOMAIN.serveousercontent.com/" \
        -x "http://$PROXY" \
        --max-time 10 2>/dev/null
}

# ============= 主循环 =============
log "=== 固定子域名守护脚本启动 ==="
log "固定域名: $SUBDOMAIN.serveousercontent.com"
log "SSH密钥: $SSH_KEY"

while true; do
    # 1. 确保本地服务器运行
    start_server

    # 2. 启动隧道（前台运行，退出后自动循环）
    log "启动 SSH 隧道（固定子域名: $SUBDOMAIN）..."
    start_tunnel
    log "SSH 隧道退出 (exit=$?)，8秒后重连..."
    sleep 8
done
