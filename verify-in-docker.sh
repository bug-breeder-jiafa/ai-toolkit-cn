#!/bin/bash

# AI Toolkit 汉化版 - Docker 验证脚本
# 用于在 NAS 环境中将代码复制到 Docker 容器进行构建验证
# 用法：./verify-in-docker.sh [container_name]

set -e

CONTAINER_NAME="${1:-ai-toolkit}"
WORKSPACE="/workspace/ai-toolkit"

echo "======================================"
echo "  AI Toolkit 汉化版 - Docker 构建验证"
echo "======================================"
echo ""

# 检查 Docker 容器是否运行
if ! docker ps | grep -q $CONTAINER_NAME; then
  echo "❌ 错误：容器 '$CONTAINER_NAME' 未运行"
  echo ""
  echo "请先启动容器："
  echo "   docker compose up -d"
  exit 1
fi

echo "✅ 容器 '$CONTAINER_NAME' 运行中"
echo ""

# 获取当前分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📌 当前分支：$CURRENT_BRANCH"
echo ""

# 创建临时目录
TEMP_DIR="/tmp/ai-toolkit-verify-$$"
echo "📁 临时目录：$TEMP_DIR"

# 复制代码到临时目录（排除 node_modules 和大文件）
echo "📦 准备代码..."
rsync -av --exclude='node_modules' \
      --exclude='.git' \
      --exclude='output' \
      --exclude='models' \
      --exclude='datasets' \
      ./ $TEMP_DIR/

# 复制到 Docker 容器
echo "🔄 复制代码到容器..."
docker cp $TEMP_DIR ${CONTAINER_NAME}:/tmp/verify-build

# 在容器中运行构建
echo "🔨 运行构建测试..."
echo ""

if docker exec ${CONTAINER_NAME} bash -c "
  cd /tmp/verify-build/ui &&
  echo 'Node 版本:' && node -v &&
  echo 'NPM 版本:' && npm -v &&
  echo '' &&
  echo '安装依赖...' &&
  npm install --legacy-peer-deps --prefer-offline &&
  echo '' &&
  echo '开始构建...' &&
  npm run build
"; then
  echo ""
  echo "======================================"
  echo "  ✅ 构建验证成功！"
  echo "======================================"
  echo ""
  
  # 清理
  echo "🧹 清理临时文件..."
  docker exec ${CONTAINER_NAME} rm -rf /tmp/verify-build
  rm -rf $TEMP_DIR
  
  echo ""
  echo "可以安全推送到 GitHub："
  echo "   git push origin $CURRENT_BRANCH"
  echo ""
else
  echo ""
  echo "======================================"
  echo "  ❌ 构建验证失败！"
  echo "======================================"
  echo ""
  echo "请检查上述错误信息。"
  echo ""
  echo "临时文件保留在："
  echo "  本地：$TEMP_DIR"
  echo "  容器：/tmp/verify-build"
  echo ""
  echo "手动清理："
  echo "   rm -rf $TEMP_DIR"
  echo "   docker exec ${CONTAINER_NAME} rm -rf /tmp/verify-build"
  echo ""
  exit 1
fi
