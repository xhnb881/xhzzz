#!/bin/bash
# Serveo SSH 隧道守护进程（通过 HTTP 代理）

LOGFILE="/workspace/serveo-tunnel.log"
PROXY="127.0.0.1:18080"
LOCAL_PORT=3000
SSH_KEY="/root/.ssh/serveo_key"
RESTART_DELAY=8

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOGFILE"; }

log "=== Serveo 隧道守护进程启动 ==="

while true; do
    # 检查本地服务器
    if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:$LOCAL_PORT/ --max-time 3 2>/dev/null | grep -q "200\|302\|301"; then
        log "本地服务器未响应，等待..."
        sleep 5
        continue
    fi

    # 杀掉旧 SSH 进程
    pkill -f "ssh.*serveo" 2>/dev/null
    sleep 1

    log "启动 SSH 隧道..."
    # SSH 在前台运行，输出直接追加到日志，进程结束时本循环继续
    ssh -T \
        -i "$SSH_KEY" \
        -o ProxyCommand="socat - 'PROXY:127.0.0.1:%h:%p,proxyport=18080'" \
        -o StrictHostKeyChecking=no \
        -o UserKnownHostsFile=/dev/null \
        -o ServerAliveInterval=20 \
        -o ServerAliveCountMax=3 \
        -o ExitOnForwardFailure=yes \
        -R 80:localhost:$LOCAL_PORT \
        serveo.net >> "$LOGFILE" 2>&1

    log "SSH 进程退出（exit=$?），${RESTART_DELAY}秒后重连..."
    sleep "$RESTART_DELAY"
done
