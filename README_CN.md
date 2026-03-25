# AI Toolkit by Ostris - 中文完整版

> 本汉化版基于 [ostris/ai-toolkit](https://github.com/ostris/ai-toolkit) 完整翻译
> 
> **汉化版本**: localization-zh | **原项目版本**: main (同步至 commit 7f3309b)

AI Toolkit 是一个多功能扩散模型训练套件，支持在消费级硬件上训练最新的图像和视频模型。支持 GUI 和 CLI 两种操作方式，设计简洁易用，同时具备完整的训练功能。

---

## 赞助我的工作

如果你喜欢我的项目，或将其用于商业用途，请考虑赞助我。每一分支持都很重要！💖

[在 GitHub 上赞助](https://github.com/orgs/ostris) | [在 Patreon 上支持](https://www.patreon.com/ostris) | [通过 PayPal 捐赠](https://www.paypal.com/donate/?hosted_button_id=9GEFUKC8T9R9W)

### 当前赞助商

以下这些个人/组织无私地支持着这个项目，在此表示感谢！！

*最后更新：2026-03-03 15:01 UTC*

（赞助商头像列表 - 与原项目保持一致）

---

## 安装

**环境要求**:
- Python > 3.10
- NVIDIA GPU（显存容量根据训练需求而定）
- Python 虚拟环境 (venv)
- Git

### Linux 安装

```bash
git clone https://github.com/ostris/ai-toolkit.git
cd ai-toolkit
python3 -m venv venv
source venv/bin/activate
# 首先安装 torch
pip3 install --no-cache-dir torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 --index-url https://download.pytorch.org/whl/cu126
pip3 install -r requirements.txt
```

**DGX OS 设备**（包括 DGX Spark）请参考 [DGX 安装说明](dgx_instructions.md)。

### Windows 安装

如果在 Windows 上遇到问题，推荐使用 [AI-Toolkit-Easy-Install](https://github.com/Tavris1/AI-Toolkit-Easy-Install) 一键安装脚本。

```bash
git clone https://github.com/ostris/ai-toolkit.git
cd ai-toolkit
python -m venv venv
.\venv\Scripts\activate
pip install --no-cache-dir torch==2.7.0 torchvision==0.22.0 torchaudio==2.7.0 --index-url https://download.pytorch.org/whl/cu126
pip install -r requirements.txt
```

---

# AI Toolkit UI（Web 界面）

AI Toolkit UI 是一个 Web 界面，让你可以轻松启动、停止和监控训练任务，只需几次点击即可训练模型。支持设置访问令牌以防止未授权访问，可以安全地在公开服务器上运行。

<img src="https://ostris.com/wp-content/uploads/2025/02/toolkit-ui.jpg" alt="AI Toolkit UI" width="100%">

## 运行 UI

**环境要求**:
- Node.js > 18

UI 不需要持续运行，训练任务即可独立运行。UI 仅用于启动/停止/监控任务。

```bash
cd ui
npm run build_and_start
```

访问 `http://localhost:8675` 或 `http://<你的 IP>:8675`（服务器模式）。

## 保护 UI

如果你在云服务器或不安全的网络上运行 UI，强烈建议使用认证令牌保护。

```bash
# Linux
AI_TOOLKIT_AUTH=super_secure_password npm run build_and_start

# Windows
set AI_TOOLKIT_AUTH=super_secure_password && npm run build_and_start

# Windows Powershell
$env:AI_TOOLKIT_AUTH="super_secure_password"; npm run build_and_start
```

---

## FLUX.1 训练

### 入门教程

快速入门：参考 [@araminta_k](https://x.com/araminta_k) 的教程 [在 24GB 显存的 3090 上微调 Flux Dev](https://www.youtube.com/watch?v=HzGW_Kyermg)。

### 硬件要求

训练 FLUX.1 至少需要 **24GB 显存** 的 GPU。如果 GPU 同时用于驱动显示器，建议在配置文件的 `model:` 下设置 `low_vram: true`，这将量化 CPU 上的模型，允许连接显示器时训练。

用户已在 WSL 的 Windows 上成功运行，但有报告称在原生 Windows 上存在 bug。目前仅在 Linux 上经过测试，仍处于高度实验阶段，需要大量量化和技巧才能适配 24GB 显存。

### FLUX.1-dev

FLUX.1-dev 采用非商业许可协议，意味着基于它训练的任何模型都将继承非商业许可。这是受限模型，需要先在 Hugging Face 接受许可协议才能使用。

**设置步骤**:
1. 登录 Hugging Face 并接受模型访问协议 [black-forest-labs/FLUX.1-dev](https://huggingface.co/black-forest-labs/FLUX.1-dev)
2. 在项目根目录创建 `.env` 文件
3. [获取 Hugging Face 的 READ 令牌](https://huggingface.co/settings/tokens/new?) 并添加到 `.env` 文件：`HF_TOKEN=your_key_here`

### FLUX.1-schnell

FLUX.1-schnell 采用 Apache 2.0 许可，基于它训练的模型可以使用任意许可，不需要 HF_TOKEN 即可训练。但需要一个特殊的 adapter：[ostris/FLUX.1-schnell-training-adapter](https://huggingface.co/ostris/FLUX.1-schnell-training-adapter)，仍处于高度实验阶段。为获得最佳质量，建议使用 FLUX.1-dev。

**配置示例**:
```yaml
model:
  name_or_path: "black-forest-labs/FLUX.1-schnell"
  assistant_lora_path: "ostris/FLUX.1-schnell-training-adapter"
  is_flux: true
  quantize: true

sample:
  guidance_scale: 1  # schnell 不需要 guidance
  sample_steps: 4  # 1-4 效果较好
```

### 训练步骤

1. 复制示例配置文件 `config/examples/train_lora_flux_24gb.yaml`（schnell 用 `train_lora_flux_schnell_24gb.yaml`）到 `config` 文件夹，重命名为 `任意名称.yml`
2. 按照文件中的注释编辑配置
3. 运行：`python run.py config/任意名称.yml`

启动时会创建以配置中 `name` 和 `training_folder` 命名的文件夹，包含所有检查点和预览图。随时可用 Ctrl+C 停止训练，恢复时会从最后一个检查点继续。

**重要提示**: 在保存检查点时按 Ctrl+C 可能导致文件损坏，请等待保存完成。

### 需要帮助？

请不要因为代码 bug 以外的问题提交 issue。欢迎 [加入我的 Discord](https://discord.gg/VXmU2f5WEU) 寻求帮助。但请勿私信我一般性问题或支持请求，在 Discord 提问我会尽快回复。

---

## Gradio UI

安装完成后快速开始：

```bash
cd ai-toolkit
huggingface-cli login  # 提供 write 令牌以发布 LoRA
python flux_train_ui.py
```

这将启动一个自定义 UI，用于上传图片、标注、训练和发布 LoRA。

![Gradio UI](assets/lora_ease_ui.png)

---

## 在 RunPod 上训练

如果你尚未注册 RunPod，请考虑使用 [我的 RunPod 推荐链接](https://runpod.io?ref=h0y9jyr2) 支持本项目。

我维护着官方的 RunPod Pod 模板：[点击访问](https://console.runpod.io/deploy?template=0fqzfjy6f3&ref=h0y9jyr2)。

我还创建了 [入门视频教程](https://youtu.be/HBNeS-F6Zz8)。

---

## 在 Modal 上训练

### 1. 环境设置

**ai-toolkit**:
```bash
git clone https://github.com/ostris/ai-toolkit.git
cd ai-toolkit
git submodule update --init --recursive
python -m venv venv
source venv/bin/activate
pip install torch
pip install -r requirements.txt
pip install --upgrade accelerate transformers diffusers huggingface_hub  # 遇到问题可选运行
```

**Modal**:
- 运行 `pip install modal` 安装 Python 包
- 运行 `modal setup` 进行身份验证

**Hugging Face**:
- 从 [这里](https://huggingface.co/settings/tokens) 获取 READ 令牌
- 从 [这里](https://huggingface.co/black-forest-labs/FLUX.1-dev) 申请 Flux.1-dev 访问权限
- 运行 `huggingface-cli login` 并粘贴令牌

### 2. 上传数据集

将包含 .jpg、.jpeg 或 .png 图片和 .txt 标注文件的文件夹拖放到 `ai-toolkit` 目录。

### 3. 配置文件

复制 `config/examples/modal` 中的示例配置到 `config` 文件夹，重命名为 `任意名称.yml`。

**注意**: 严格按照示例中的 `/root/ai-toolkit` 路径格式。

### 4. 编辑 run_modal.py

设置本地 `ai-toolkit` 路径：
```python
code_mount = modal.Mount.from_local_dir("/Users/用户名/ai-toolkit", remote_path="/root/ai-toolkit")
```

在 `@app.function` 中选择 GPU 和超时时间（默认 A100 40GB，2 小时超时）。

### 5. 开始训练

```bash
modal run run_modal.py --config-file-list-str=/root/ai-toolkit/config/任意名称.yml
```

可在本地终端或 [modal.com](https://modal.com/) 监控训练。

模型、预览图和优化器状态将存储在 `Storage > flux-lora-models`。

### 6. 保存模型

查看存储内容：
```bash
modal volume ls flux-lora-models
```

下载模型：
```bash
modal volume get flux-lora-models 你的模型名称
```

示例：`modal volume get flux-lora-models my_first_flux_lora_v1`

---

## 数据集准备

数据集通常是一个包含图片和对应文本文件的文件夹。目前仅支持 jpg、jpeg 和 png 格式（WebP 存在问题）。

文本文件应与图片同名，扩展名为 `.txt`。例如：`image2.jpg` 和 `image2.txt`。文本文件仅包含标注（caption）。

可在标注中使用 `[trigger]` 占位符，如果配置中设置了 `trigger_word`，将自动替换。

**图片不会被放大，但会被缩小并分桶批处理。你不需要手动裁剪/调整图片尺寸**，加载器会自动处理不同宽高比。

---

## 训练特定层

使用 LoRA 训练特定层时，可使用 `only_if_contains` 网络参数。例如，如果只想训练 The Last Ben 提到的两层：

```yaml
network:
  type: "lora"
  linear: 128
  linear_alpha: 128
  network_kwargs:
    only_if_contains:
      - "transformer.single_transformer_blocks.7.proj_out"
      - "transformer.single_transformer_blocks.20.proj_out"
```

层命名采用 diffusers 格式，检查模型的 state dict 可找到目标层的名称后缀。也可用于训练特定权重组，例如只训练 FLUX.1 的 `single_transformer`：

```yaml
network:
  type: "lora"
  linear: 128
  linear_alpha: 128
  network_kwargs:
    only_if_contains:
      - "transformer.single_transformer_blocks."
```

也可用 `ignore_if_contains` 排除特定层：

```yaml
network:
  type: "lora"
  linear: 128
  linear_alpha: 128
  network_kwargs:
    ignore_if_contains:
      - "transformer.single_transformer_blocks."
```

`ignore_if_contains` 优先级高于 `only_if_contains`，如果同时匹配则忽略。

---

## LoKr 训练

了解更多：[KohakuBlueleaf/LyCORIS](https://github.com/KohakuBlueleaf/LyCORIS/blob/main/docs/Guidelines.md)。

配置示例：
```yaml
network:
  type: "lokr"
  lokr_full_rank: true
  lokr_factor: 8
```

其他功能与 LoRA 相同，包括层定位。

---

## 更新日志

仅记录重大更新，日常小更新省略。

### 2025 年 7 月 17 日
- 简化在 UI 中为预览添加控制图的流程

### 2025 年 7 月 11 日
- 为视频模型添加更好的视频配置设置
- 在 UI 中添加 Wan I2V 训练支持

### 2025 年 6 月 29 日
- 修复 Kontext 强制尺寸问题

### 2025 年 6 月 26 日
- 添加 FLUX.1 Kontext 训练支持
- 添加指令数据集训练支持

### 2025 年 6 月 25 日
- 添加 OmniGen2 训练支持

### 2025 年 6 月 17 日
- 批处理准备性能优化
- 为简易 UI 添加设置说明弹窗（进行中）

### 2025 年 6 月 16 日
- 在 UI 中查看数据集时隐藏控制图
- 平均流损失（mean flow loss）进行中

### 2025 年 6 月 12 日
- 修复数据加载器中标题为空的问题

### 2025 年 6 月 10 日
- 开始在 README 中记录更新
- 在 UI 中添加 SDXL 支持
- 在 UI 中添加 SD 1.5 支持
- 修复 UI 中 Wan 2.1 14b 名称 bug
- 为支持卷积的模型添加卷积训练支持

---

# 汉化项目说明

## 关于本汉化版

本汉化版由社区维护，将 AI Toolkit 的 Web 界面完整翻译为中文，方便中文用户使用。

**汉化范围**:
- ✅ 所有前端页面（任务队列、新建任务、数据集、设置、仪表盘）
- ✅ 所有 UI 组件（表格、弹窗、监控、图表）
- ✅ 所有帮助文档和技术说明
- ✅ 所有错误提示和状态消息

**汉化文件清单**:

| 文件 | 说明 |
|------|------|
| `ui/src/app/jobs/new/page.tsx` | 新建任务页面 |
| `ui/src/app/jobs/new/SimpleJob.tsx` | 任务配置表单（完整汉化） |
| `ui/src/app/jobs/new/options.ts` | 任务类型选项 |
| `ui/src/app/jobs/page.tsx` | 任务队列列表 |
| `ui/src/app/datasets/page.tsx` | 数据集列表页 |
| `ui/src/app/datasets/[datasetName]/page.tsx` | 数据集详情页 |
| `ui/src/app/dashboard/page.tsx` | 仪表盘 |
| `ui/src/app/settings/page.tsx` | 系统设置 |
| `ui/src/components/JobsTable.tsx` | 任务表格组件 |
| `ui/src/components/JobActionBar.tsx` | 任务操作栏 |
| `ui/src/components/GPUMonitor.tsx` | GPU 监控组件 |
| `ui/src/components/SampleImages.tsx` | 预览图组件 |
| `ui/src/components/JobLossGraph.tsx` | 损失曲线图 |
| `ui/src/components/UniversalTable.tsx` | 通用表格组件 |
| `ui/src/components/ConfirmModal.tsx` | 确认弹窗组件 |
| `ui/src/docs.tsx` | 帮助文档（完整翻译） |

## 版本信息

- **汉化分支**: `localization-zh`
- **基于版本**: main (commit `7f3309b`)
- **最后同步**: 2026-03-25
- **汉化提交**: `54255be`

## 更新与维护

### 检查上游更新

```bash
cd ui
git fetch origin main
git log HEAD..origin/main --oneline
```

有输出表示有新版本。

### 合并上游更新

```bash
# 切换到主分支并拉取
git checkout main
git pull origin main

# 合并到汉化分支
git checkout localization-zh
git merge main

# 解决冲突后重启容器
docker compose restart
```

## 常见问题

### Q: 汉化后界面显示异常？
A: 清除浏览器缓存后刷新，或重启 Docker 容器。

### Q: 如何切换回英文？
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

---

## 技术栈

- **前端**: Next.js 15 + React + TypeScript
- **UI 组件**: Headless UI + Tailwind CSS
- **图表**: Recharts
- **后端**: Python + FastAPI
- **数据库**: SQLite + Prisma
- **容器**: Docker + NVIDIA Container Toolkit

---

## 许可证

本项目遵循原项目的开源许可证。汉化版本不改变原项目的许可条款。

## 致谢

- **原项目作者**: [ostris](https://github.com/ostris)
- **原项目地址**: https://github.com/ostris/ai-toolkit
- **汉化维护**: 社区贡献

---

**最后更新**: 2026-03-25
