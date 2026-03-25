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

# 运行同步脚本（只负责 Git 合并）
./sync-upstream.sh
```

脚本会自动：
1. ✅ 检查上游是否有新更新
2. ✅ 获取最新代码
3. ✅ 创建备份分支
4. ✅ 合并上游更新
5. ✅ 输出人工验证步骤

**验证和推送需要手动执行**（见下文）。

### 方法二：手动流程

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

# 7. 人工验证（见下文）

# 8. 推送到 GitHub
git push origin localization-zh
```

---

## 三、人工验证流程（跨环境）

由于 NAS 环境限制，验证需要在带 GPU 的机器上进行。

### 步骤 1: 检查变更内容

```bash
cd /home/node/.openclaw/workspace/ai-toolkit-env/ai-toolkit

# 查看变更了哪些文件
git diff HEAD~1 --stat

# 查看具体变更
git diff HEAD~1
```

### 步骤 2: 复制代码到验证环境

**方式 A: rsync**
```bash
rsync -av --exclude='node_modules' \
        --exclude='.git' \
        ./ user@gpu-server:/path/to/ai-toolkit/
```

**方式 B: scp**
```bash
scp -r . user@gpu-server:/path/to/ai-toolkit/
```

**方式 C: Git 推送**
```bash
# 推送到 GitHub 后，在 GPU 机器上拉取
git push origin localization-zh

# 然后在 GPU 机器上：
git pull origin localization-zh
```

### 步骤 3: 在验证环境中构建

登录到 GPU 机器后：

```bash
cd /path/to/ai-toolkit/ui

# 安装依赖
npm install --legacy-peer-deps

# 运行构建
npm run build
```

**验证要点**：
- ✅ 构建成功，无错误
- ✅ 访问界面检查汉化是否正常
- ✅ 关键页面功能正常（任务队列、数据集、设置等）

### 步骤 4: 验证通过后推送

```bash
# 回到 NAS 环境
cd /home/node/.openclaw/workspace/ai-toolkit-env/ai-toolkit

# 推送到 GitHub
git push origin localization-zh
```

---

## 四、完整更新流程图

```
┌─────────────────────────────────────────────────────────┐
│  1. NAS: 运行同步脚本                                    │
│     ./sync-upstream.sh                                  │
│     - 合并上游更新                                       │
│     - 创建备份分支                                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  2. NAS: 检查变更                                        │
│     git diff HEAD~1 --stat                              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  3. 复制代码到 GPU 环境                                   │
│     rsync / scp / git push                              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│  4. GPU 环境：构建验证                                    │
│     cd ui && npm install && npm run build               │
└─────────────────────────────────────────────────────────┘
                          ↓
                    ┌─────┴─────┐
                    │ 验证通过？ │
                    └─────┬─────┘
                     Yes  │  No
                          ↓
              ┌───────────┴───────────┐
              ↓                       ↓
    ┌─────────────────┐     ┌─────────────────┐
    │ 5. 推送到 GitHub │     │ 5a. 修复问题     │
    │ git push origin │     │ NAS 回滚到备份     │
    │ localization-zh │     │ git reset --hard │
    └─────────────────┘     └─────────────────┘
```

---

## 五、常见问题

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

### Q2: 验证失败如何回滚？

**在 NAS 上**：
```bash
# 找到备份分支
git branch | grep backup

# 回滚到备份
git reset --hard backup-YYYYMMDD

# 如果已经推送到 GitHub，强制覆盖
git push -f origin localization-zh
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

### Q5: 如何确认备份分支可以安全删除？

```bash
# 1. 确认验证通过并已推送
git log origin/localization-zh --oneline | head -5

# 2. 确认当前分支与推送的一致
git diff HEAD origin/localization-zh

# 3. 无差异则安全删除备份
git branch -D backup-YYYYMMDD
```

---

## 六、最佳实践

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

### 3. 验证清单

每次更新后检查：

- [ ] 构建成功，无 TypeScript 错误
- [ ] 首页/仪表盘正常显示
- [ ] 任务队列页面正常
- [ ] 新建任务页面正常
- [ ] 数据集页面正常
- [ ] 设置页面正常
- [ ] 预览图功能正常

### 4. 发布 Release

重要更新时创建 GitHub Release：

```bash
# 打标签
git tag -a v1.0.0 -m "首次完整汉化版本"

# 推送标签
git push origin v1.0.0
```

---

## 七、快速命令参考

### NAS 环境（Git 管理）

```bash
# 检查更新
git fetch upstream main
git log HEAD..upstream/main --oneline

# 合并更新
./sync-upstream.sh

# 查看变更
git diff HEAD~1 --stat

# 回滚
git reset --hard backup-YYYYMMDD

# 查看状态
git status
git remote -v
git branch -a
```

### GPU 环境（验证构建）

```bash
# 拉取最新代码
git pull origin localization-zh

# 安装依赖
cd ui && npm install --legacy-peer-deps

# 运行构建
npm run build

# 开发模式测试
npm run dev
```

### 推送更新

```bash
# NAS 上推送
git push origin localization-zh

# 强制推送（回滚后）
git push -f origin localization-zh
```

---

## 八、环境架构说明

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   NAS 环境       │         │  GPU 验证环境    │         │   GitHub        │
│                 │         │                 │         │                 │
│ - Git 仓库       │ ──────→ │ - 构建测试       │ ──────→ │ - 代码托管       │
│ - 代码合并       │  复制   │ - 功能验证       │  推送   │ - 版本管理       │
│ - 无 GPU         │  代码   │ - 有 GPU         │        │ - 发布 Release   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

**安全说明**：
- NAS 不直接操作其他机器的 Docker
- 验证由人工在 GPU 环境执行
- 验证通过后才推送到 GitHub

---

**最后更新**: 2026-03-25
