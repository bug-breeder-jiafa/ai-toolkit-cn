# AI Toolkit - 中文汉化版

> 基于 [ostris/ai-toolkit](https://github.com/ostris/ai-toolkit) 的完整中文汉化版本

## 项目简介

AI Toolkit 是一个用于训练 LoRA 模型的前端管理界面，支持多种扩散模型（Stable Diffusion、Flux、LTX 等）的训练任务管理、数据集管理和 GPU 监控。

本汉化版将原项目的英文界面完整翻译为中文，方便中文用户操作使用。

## 快速开始

### 环境要求

- NVIDIA GPU（支持 CUDA）
- Docker & Docker Compose
- 至少 16GB 显存（推荐 24GB+）

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/ostris/ai-toolkit.git
cd ai-toolkit
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，设置你的 Hugging Face Token 等配置
```

3. **启动容器**
```bash
docker compose up -d
```

4. **访问界面**
打开浏览器访问：`http://localhost:8675`

### 汉化版特有说明

本汉化版已将所有界面元素翻译为中文，包括：

- ✅ 任务队列页面
- ✅ 新建训练任务页面（完整表单汉化）
- ✅ 数据集管理页面
- ✅ 系统设置页面
- ✅ 仪表盘页面
- ✅ GPU 监控组件
- ✅ 所有弹窗、提示、错误信息
- ✅ 技术文档/说明文本

## 主要功能

### 1. 训练任务管理

- 创建、编辑、删除训练任务
- 支持多种模型架构（SDXL、Flux、LTX Video 等）
- 可视化训练进度和损失曲线
- 任务队列管理（支持多 GPU 并行）

### 2. 数据集管理

- 上传和管理训练图片
- 支持批量操作
- 自动生成预览图
- 支持视频数据集

### 3. GPU 监控

- 实时显存占用监控
- 温度和功耗显示
- 多 GPU 支持

### 4. 高级训练选项

- LoRA / LoKr 网络配置
- 量化设置（FP8、NF4 等）
- 差异化输出保持 (DOP)
- 空白提示词保持 (BPP)
- 层卸载（Layer Offloading）实验性功能

## 目录结构

```
ai-toolkit/
├── ui/                     # 前端界面（React/Next.js）
│   └── src/
│       ├── app/           # 页面组件
│       ├── components/    # 通用组件
│       └── docs.tsx       # 帮助文档（已汉化）
├── docker-compose.yml     # Docker 配置
├── Dockerfile            # 容器镜像定义
└── start.sh              # 容器启动脚本
```

## 汉化文件清单

以下文件已被完整汉化：

| 文件路径 | 说明 |
|---------|------|
| `ui/src/app/jobs/new/page.tsx` | 新建任务页面 |
| `ui/src/app/jobs/new/SimpleJob.tsx` | 任务配置表单 |
| `ui/src/app/jobs/new/options.ts` | 任务类型选项 |
| `ui/src/app/jobs/page.tsx` | 任务队列列表 |
| `ui/src/app/datasets/page.tsx` | 数据集列表 |
| `ui/src/app/datasets/[datasetName]/page.tsx` | 数据集详情 |
| `ui/src/app/dashboard/page.tsx` | 仪表盘 |
| `ui/src/app/settings/page.tsx` | 系统设置 |
| `ui/src/components/JobsTable.tsx` | 任务表格 |
| `ui/src/components/JobActionBar.tsx` | 任务操作栏 |
| `ui/src/components/GPUMonitor.tsx` | GPU 监控 |
| `ui/src/components/SampleImages.tsx` | 预览图组件 |
| `ui/src/components/JobLossGraph.tsx` | 损失曲线图 |
| `ui/src/components/UniversalTable.tsx` | 通用表格 |
| `ui/src/components/ConfirmModal.tsx` | 确认弹窗 |
| `ui/src/docs.tsx` | 帮助文档 |

## 更新与维护

### 检查上游更新

```bash
cd ui
git fetch origin main
git log HEAD..origin/main --oneline
```

如果有输出，说明上游有新版本。

### 合并上游更新

```bash
# 切换到主分支并拉取更新
git checkout main
git pull origin main

# 合并到汉化分支
git checkout localization-zh
git merge main

# 解决可能的冲突（主要是文本内容）
# 然后重新启动容器
docker compose restart
```

## 常见问题

### Q: 汉化后界面显示异常？
A: 清除浏览器缓存后刷新页面，或重启 Docker 容器。

### Q: 如何切换回英文界面？
A: 切换到 `main` 分支并重新构建：
```bash
git checkout main
docker compose build
docker compose up -d
```

### Q: 训练任务失败？
A: 检查：
1. GPU 显存是否充足
2. Hugging Face Token 是否有效
3. 模型路径是否正确
4. 查看容器日志：`docker compose logs -f`

## 技术栈

- **前端**: Next.js 15 + React + TypeScript
- **UI 组件**: Headless UI + Tailwind CSS
- **图表**: Recharts
- **后端**: Python + FastAPI
- **数据库**: SQLite + Prisma
- **容器**: Docker + NVIDIA Container Toolkit

## 许可证

本项目遵循原项目的开源许可证。汉化版本不改变原项目的许可条款。

## 致谢

- 原项目作者：[ostris](https://github.com/ostris)
- 原项目地址：https://github.com/ostris/ai-toolkit

---

**汉化版本维护**: 本汉化版由社区维护，如有问题或建议欢迎反馈。
