#!/bin/bash

echo "🧹 LIMPEZA RADICAL - Matando TODOS os processos Node..."
killall -9 node 2>/dev/null
killall -9 next-server 2>/dev/null
pkill -9 node 2>/dev/null
pkill -9 next 2>/dev/null
ps aux | grep -E "node|next" | grep -v grep | awk '{print $2}' | xargs -r kill -9 2>/dev/null
lsof -ti:3000 | xargs -r kill -9 2>/dev/null

echo "⏳ Aguardando processos terminarem..."
sleep 3

echo "🗑️  Limpando TODO o cache agressivamente..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .next/cache
rm -rf node_modules/.vite

echo "🔥 Limpando cache do sistema..."
sync

echo "✅ Sistema limpo! Iniciando servidor otimizado..."
echo ""
NODE_OPTIONS="--max-old-space-size=4096" npm run dev
