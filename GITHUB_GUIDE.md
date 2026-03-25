# AI Toolkit 汉化版 - GitHub 部署与更新指南

本指南说明如何将汉化版发布到 GitHub，并定期合并原项目更新。

---

## 一、GitHub 仓库设置

### 1. 创建你的 GitHub 仓库

```bash
# 在 GitHub 上创建新仓库，例如：yourname/ai-toolkit-cn
# 不要初始化 README，保持空仓库
```

### 2. 添加远程仓库

```bash
cd /home/node/.openclaw/workspace/ai-toolkit-env/ai-toolkit

# 添加你的 GitHub 仓库为 origin
git remote set-url origin https://github.com/YOUR_USERNAME/ai-toolkit-cn.git

# 添加原项目为 upstream（用于拉取更新）
git remote add upstream https://github.com/ostris/ai-toolkit.git

# 验证 remote 配置
git remote -v
```

预期输出：
```
origin  https://github.com/YOUR_USERNAME/ai-toolkit-cn.git (fetch)
origin  https://github.com/YOUR_USERNAME/ai-toolkit-cn.git (push)
upstream        https://github.com/ostris/ai-toolkit.git (fetch)
upstream        https://github.com/ostris/ai-toolkit.git (push)
```

### 3. 推送汉化分支到 GitHub

```bash
# 推送汉化分支
git push -u origin localization-zh

# 同时推送 main 分支（可选，保持与上游同步）
git checkout main
git push -u origin main
```

---

## 二、检查更新的完整流程

### 方法一：使用自动化脚本（推荐）

```bash
cd /home/node/.openclaw/workspace/ai-toolkit-env/ai-toolkit

# 切换到汉化分支
git checkout localization-zh

# 运行同步脚本（在 Docker 容器中验证构建）
./sync-upstream.sh -d

# 或者跳过验证（快速模式）
./sync-upstream.sh -s
```

脚本会自动：
1. ✅ 检查上游是否有新更新
2. ✅ 获取最新代码
3. ✅ 创建备份分支
4. ✅ 合并上游更新
5. ✅ **在 Docker 容器中运行构建测试**（`-d` 选项）
6. ✅ 提示推送

### 方法二：手动流程（NAS 环境）

```bash
# 1. 切换到汉化分支
git checkout localization-zh

# 2. 获取上游更新
git fetch upstream main

# 3. 检查是否有新提交
git log HEAD..upstream/main --oneline

# 4. 创建备份分支
git branch backup-$(date +%Y%m%d)

# 5. 合并上游更新
git merge upstream/main

# 6. 解决可能的冲突（如果有）
# 编辑冲突文件 → git add <文件> → git commit

# 7. 在 Docker 容器中测试构建
./verify-in-docker.sh

# 8. 推送到 GitHub
git push origin localization-zh
```

### 方法三：独立验证脚本

如果只想验证当前代码，不合并更新：

```bash
# 运行独立验证脚本
./verify-in-docker.sh

# 或指定容器名称
./verify-in-docker.sh ai-toolkit-container
```

---

## 三、GitHub Actions 自动化（可选）

如果你希望自动检查更新并通知，可以配置 GitHub Actions。

### 创建 `.github/workflows/sync-check.yml`

```yaml
name: Check Upstream Updates

on:
  schedule:
    # 每周一 00:00 UTC 检查
    - cron: '0 0 * * 1'
  workflow_dispatch:  # 允许手动触发

jobs:
  check-updates:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          ref: localization-zh

      - name: Add upstream remote
        run: git remote add upstream https://github.com/ostris/ai-toolkit.git

      - name: Fetch upstream
        run: git fetch upstream main

      - name: Check for updates
        id: check
        run: |
          LOCAL=$(git rev-parse HEAD)
          UPSTREAM=$(git rev-parse upstream/main)
          if [ "$LOCAL" != "$UPSTREAM" ]; then
            echo "has_updates=true" >> $GITHUB_OUTPUT
            COMMITS=$(git log --oneline $LOCAL..$UPSTREAM | head -10)
            echo "commits<<EOF" >> $GITHUB_OUTPUT
            echo "$COMMITS" >> $GITHUB_OUTPUT
            echo "EOF" >> $GITHUB_OUTPUT
          else
            echo "has_updates=false" >> $GITHUB_OUTPUT
          fi

      - name: Create Issue (if updates available)
        if: steps.check.outputs.has_updates == 'true'
        uses: peter-evans/create-issue-from-file@v4
        with:
          title: 🆕 上游有新更新
          content-filepath: .github/ISSUE_TEMPLATE/update-available.md
          labels: update-available
```

---

## 四、完整更新流程图（NAS 环境）

```
┌─────────────────────────────────────────────────────────┐
│  1. 检查更新（在 NAS 中）                                │
│     cd /home/node/.openclaw/workspace/ai-toolkit-env   │
│     git checkout localization-zh                        │
│     ./sync-upstream.sh                                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  2. 自动创建备份分支                                     │
│     backup-YYYYMMDD-HHMMSS                              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  3. 合并上游更新                                         │
│     git merge upstream/main                             │
└─────────────────────────────────────────────────────────┘
                          ↓
                    ┌─────┴─────┐
                    │ 有冲突？   │
                    └─────┬─────┘
                     Yes  │  No
                          ↓
              ┌───────────┴───────────┐
              ↓                       ↓
    ┌─────────────────┐     ┌─────────────────────────┐
    │ 4a. 解决冲突     │     │ 4b. 在 Docker 中验证     │
    │ 手动编辑冲突文件 │     │ ./verify-in-docker.sh   │
    │ git add <文件>   │     │ (复制到容器构建)         │
    │ git commit       │     └──────────┬──────────────┘
    └────────┬────────┘                 ↓
             │              ┌───────────┴───────────┐
             │              │ 构建通过？             │
             │              └───────────┬───────────┘
             │                Yes       │   No
             │                          ↓
             │                ┌─────────┴─────────┐
             │                ↓                   ↓
             │      ┌─────────────────┐  ┌─────────────────┐
             │      │ 5. 推送到 GitHub │  │ 5a. 修复问题     │
             │      │ git push origin │  │ 回滚到备份       │
             │      │ localization-zh │  │ 分析错误日志     │
             │      └─────────────────┘  └─────────────────┘
             └──────────→ 继续到步骤 5
```

**NAS 环境特殊说明**：
- ❌ NAS 无 GPU，无法本地运行 ai-toolkit
- ✅ 代码同步在 NAS 的 Git 仓库中进行
- ✅ 构建验证通过 Docker 容器执行
- ✅ 验证通过后再推送到 GitHub

---

## 五、推送更新到 GitHub

### 推送汉化分支

```bash
# 确保在汉化分支
git checkout localization-zh

# 推送到你的 GitHub 仓库
git push origin localization-zh
```

### 同时更新 main 分支（可选）

```bash
# 切换到 main
git checkout main

# 确保与上游同步
git pull upstream main

# 推送到你的 GitHub
git push origin main
```

---

## 六、常见问题

### Q1: 合并后出现大量冲突怎么办？

```bash
# 1. 放弃合并
git merge --abort

# 2. 回到备份分支
git checkout backup-YYYYMMDD

# 3. 分析冲突原因
git diff HEAD..upstream/main --name-only

# 4. 逐个文件手动解决
```

### Q2: 构建失败如何回滚？

```bash
# 1. 找到备份分支
git branch | grep backup

# 2. 回滚到备份
git reset --hard backup-YYYYMMDD

# 3. 删除失败的合并分支
git branch -D localization-zh

# 4. 重新创建分支
git checkout -b localization-zh
```

### Q3: 如何只更新特定文件？

```bash
# 1. 从上游检出特定文件
git checkout upstream/main -- path/to/file.tsx

# 2. 重新汉化该文件

# 3. 提交
git add path/to/file.tsx
git commit -m "更新：path/to/file.tsx"
```

### Q4: 如何查看两个分支的差异？

```bash
# 查看汉化分支与上游的差异
git diff upstream/main..localization-zh --stat

# 查看具体文件差异
git diff upstream/main..localization-zh -- path/to/file.tsx
```

---

## 七、最佳实践

### 1. 定期同步

建议每周检查一次上游更新：

```bash
# 添加到 crontab 或设置提醒
0 9 * * 1 cd /path/to/ai-toolkit && ./sync-upstream.sh
```

### 2. 小步提交

每次合并后，将汉化改动分成小提交：

```bash
# 不要一个大提交
git add -A
git commit -m "完整汉化"

# 而是按模块提交
git add src/app/jobs/
git commit -m "汉化：任务页面"

git add src/app/datasets/
git commit -m "汉化：数据集页面"
```

### 3. 测试后再推送

```bash
# 本地测试
cd ui && npm run dev

# 访问 http://localhost:8675 检查界面

# 确认无误后再推送
git push origin localization-zh
```

### 4. 发布 Release

重要更新时创建 GitHub Release：

```bash
# 打标签
git tag -a v1.0.0 -m "首次完整汉化版本"

# 推送标签
git push origin v1.0.0
```

---

## 八、快速命令参考（NAS 环境）

```bash
# 检查更新
git fetch upstream main
git log HEAD..upstream/main --oneline

# 合并更新（自动在 Docker 中验证）
./sync-upstream.sh -d

# 或手动合并
git merge upstream/main

# 在 Docker 容器中测试构建
./verify-in-docker.sh

# 或者进入容器测试
docker exec -it ai-toolkit bash
cd /tmp/verify-build/ui
npm run build

# 推送更新
git push origin localization-zh

# 回滚
git reset --hard backup-YYYYMMDD

# 查看状态
git status
git remote -v
git branch -a

# 查看容器日志
docker compose logs -f
```

---

## 九、NAS 环境特殊配置

### 硬件限制

- **无 NVIDIA GPU**：无法本地运行训练任务
- **配置较低**：Node.js 构建可能较慢
- **解决方案**：使用 Docker 容器进行验证

### 推荐工作流

```
NAS (Git 管理)          Docker 容器 (构建验证)        GitHub (代码托管)
     │                        │                           │
     ├─ git merge ──────────→ │                           │
     │                        │                           │
     │                        ├─ npm run build ─────────→ │
     │                        │                           │
     │←─ 验证成功 ────────────┤                           │
     │                        │                           │
     ├─ git push ───────────────────────────────────────→ │
     │                                                    │
```

### 容器配置检查

```bash
# 确认容器运行中
docker compose ps

# 查看容器资源占用
docker stats ai-toolkit

# 进入容器调试
docker exec -it ai-toolkit bash

# 查看容器日志
docker compose logs -f
```

### 故障排查

**问题 1**: 容器未运行
```bash
docker compose up -d
```

**问题 2**: 容器内 npm 安装失败
```bash
docker exec ai-toolkit npm cache clean --force
docker exec ai-toolkit rm -rf node_modules package-lock.json
```

**问题 3**: 构建超时
```bash
# 增加 Docker 资源限制
# 编辑 docker-compose.yml，增加内存和 CPU 限制
```

---

**最后更新**: 2026-03-25
