#!/bin/bash

# AI Toolkit 汉化版 - 上游更新合并脚本
# 用法：./sync-upstream.sh

set -e  # 遇到错误立即退出

echo "======================================"
echo "  AI Toolkit 汉化版 - 上游更新检查与合并"
echo "======================================"
echo ""

# 配置
UPSTREAM_REMOTE="origin"  # 如果你添加了原项目 remote，改为 "upstream"
UPSTREAM_BRANCH="main"
LOCALIZATION_BRANCH="localization-zh"
SKIP_BUILD=false  # 设置为 true 跳过构建测试
VERIFY_IN_DOCKER=false  # 设置为 true 在 Docker 中验证

# 解析命令行参数
while getopts "u:b:sdvh" opt; do
  case $opt in
    u) UPSTREAM_REMOTE="$OPTARG" ;;
    b) LOCALIZATION_BRANCH="$OPTARG" ;;
    s) SKIP_BUILD=true ;;
    d) VERIFY_IN_DOCKER=true ;;
    v) echo "版本：1.1.0"; exit 0 ;;
    h)
      echo "用法：$0 [-u upstream_remote] [-b localization_branch] [-s] [-d]"
      echo "  -u: 上游 remote 名称 (默认：origin)"
      echo "  -b: 汉化分支名称 (默认：localization-zh)"
      echo "  -s: 跳过构建测试"
      echo "  -d: 在 Docker 容器中验证构建"
      echo "  -v: 显示版本"
      exit 0
      ;;
    \?) echo "无效选项：-$OPTARG"; exit 1 ;;
  esac
done

cd "$(dirname "$0")"

echo "配置信息:"
echo "  上游 remote: $UPSTREAM_REMOTE"
echo "  上游分支：$UPSTREAM_BRANCH"
echo "  汉化分支：$LOCALIZATION_BRANCH"
echo "  跳过构建：$SKIP_BUILD"
echo "  Docker 验证：$VERIFY_IN_DOCKER"
echo ""

# 1. 检查当前分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "$LOCALIZATION_BRANCH" ]; then
  echo "❌ 错误：当前不在 $LOCALIZATION_BRANCH 分支"
  echo "   当前分支：$CURRENT_BRANCH"
  echo ""
  echo "请切换到汉化分支后重试："
  echo "   git checkout $LOCALIZATION_BRANCH"
  exit 1
fi

# 2. 确保工作区干净
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  警告：工作区有未提交的修改"
  echo ""
  git status --short
  echo ""
  read -p "是否继续？(未提交的修改可能会丢失) [y/N]: " confirm
  if [ "$confirm" != "y" ]; then
    echo "已取消"
    exit 0
  fi
  # 暂存修改
  git stash push -m "Auto-stashed before sync"
  STASHED=true
fi

# 3. 获取上游最新代码
echo "📥 正在获取上游最新代码..."
git fetch $UPSTREAM_REMOTE $UPSTREAM_BRANCH

# 4. 检查是否有新更新
LOCAL_COMMIT=$(git rev-parse HEAD)
UPSTREAM_COMMIT=$(git rev-parse $UPSTREAM_REMOTE/$UPSTREAM_BRANCH)

if [ "$LOCAL_COMMIT" == "$UPSTREAM_COMMIT" ]; then
  echo "✅ 已经是最新版本，无需更新"
  echo ""
  # 恢复暂存的修改
  if [ "$STASHED" = true ]; then
    git stash pop
  fi
  exit 0
fi

echo "🆕 发现新更新！"
echo ""
echo "上游新增提交:"
git log --oneline $LOCAL_COMMIT..$UPSTREAM_COMMIT | head -20
echo ""

# 5. 创建备份分支
BACKUP_BRANCH="backup-$(date +%Y%m%d-%H%M%S)"
echo "💾 创建备份分支：$BACKUP_BRANCH"
git branch $BACKUP_BRANCH

# 6. 合并上游更新
echo "🔄 正在合并上游更新..."
git merge $UPSTREAM_REMOTE/$UPSTREAM_BRANCH -m "Merge upstream $UPSTREAM_BRANCH into $LOCALIZATION_BRANCH"

# 7. 检查合并结果
if [ $? -ne 0 ]; then
  echo ""
  echo "❌ 合并冲突！需要手动解决。"
  echo ""
  echo "解决步骤:"
  echo "1. 编辑冲突文件，解决所有冲突标记"
  echo "2. 运行：git add <解决的文件>"
  echo "3. 运行：git commit -m '解决合并冲突'"
  echo "4. 重新运行此脚本"
  echo ""
  echo "如果需要放弃合并，运行:"
  echo "   git merge --abort"
  echo "   git checkout $BACKUP_BRANCH  # 恢复到备份"
  exit 1
fi

echo "✅ 合并成功！"
echo ""

# 8. 运行构建测试（可选）
if [ "$SKIP_BUILD" = false ]; then
  echo "🔨 运行构建测试..."
  cd ui
  
  if [ "$VERIFY_IN_DOCKER" = true ]; then
    # 在 Docker 容器中验证
    echo "🐳 在 Docker 容器中验证构建..."
    echo ""
    echo "注意：由于 NAS 环境限制，构建将在 Docker 容器中进行。"
    echo "请确保已启动 ai-toolkit 容器。"
    echo ""
    
    # 将当前代码复制到 Docker 容器中
    CONTAINER_NAME="ai-toolkit"
    CONTAINER_PATH="/workspace/ai-toolkit/ui"
    
    echo "📦 复制代码到容器..."
    docker cp .. ${CONTAINER_NAME}:/tmp/ai-toolkit-sync
    
    echo "🔨 在容器中运行构建..."
    if docker exec ${CONTAINER_NAME} bash -c "
      cd /tmp/ai-toolkit-sync/ui &&
      npm install --legacy-peer-deps &&
      npm run build
    " 2>&1 | tee ../build.log; then
      echo ""
      echo "✅ Docker 构建成功！"
      
      # 清理临时文件
      docker exec ${CONTAINER_NAME} rm -rf /tmp/ai-toolkit-sync
    else
      echo ""
      echo "❌ Docker 构建失败！请检查错误日志。"
      echo ""
      echo "日志已保存到：build.log"
      echo ""
      echo "可能的原因:"
      echo "1. 上游更新引入了代码变更，导致汉化内容冲突"
      echo "2. 新增的文件未汉化"
      echo "3. Node.js 依赖问题"
      echo ""
      echo "修复后重新运行此脚本，或跳过构建测试：./sync-upstream.sh -s"
      cd ..
      exit 1
    fi
  elif command -v npm &> /dev/null; then
    # 本地构建
    if npm run build 2>&1 | tee ../build.log; then
      echo "✅ 构建成功！"
    else
      echo ""
      echo "❌ 构建失败！请检查错误日志。"
      echo ""
      echo "日志已保存到：build.log"
      echo ""
      echo "可能的原因:"
      echo "1. 上游更新引入了代码变更，导致汉化内容冲突"
      echo "2. 新增的文件未汉化"
      echo ""
      echo "修复后重新运行此脚本，或跳过构建测试：./sync-upstream.sh -s"
      cd ..
      exit 1
    fi
  else
    echo "⚠️  未找到 npm，跳过构建测试"
  fi
  
  cd ..
fi

# 9. 恢复暂存的修改
if [ "$STASHED" = true ]; then
  echo "💾 恢复暂存的修改..."
  git stash pop
fi

# 10. 显示总结
echo ""
echo "======================================"
echo "  ✅ 同步完成！"
echo "======================================"
echo ""
echo "新增提交:"
git log --oneline $LOCAL_COMMIT..HEAD | head -10
echo ""
echo "下一步操作:"
echo "1. 检查变更：git diff $LOCAL_COMMIT"
echo "2. 测试界面：cd ui && npm run dev"
echo "3. 推送到 GitHub: git push origin $LOCALIZATION_BRANCH"
echo ""
echo "如果需要回滚:"
echo "   git reset --hard $BACKUP_BRANCH"
echo "   git branch -D $BACKUP_BRANCH  # 确认无误后删除备份"
echo ""
