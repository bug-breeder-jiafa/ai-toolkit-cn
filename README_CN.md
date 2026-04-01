# Ostris AI Toolkit - 中文版

AI Toolkit 是一个多功能扩散模型训练套件，支持在消费级硬件上训练最新的图像和视频模型。可作为 GUI 或 CLI 运行，设计简洁易用，同时具备完整的训练功能。免费开源。

**原项目**: [ostris/ai-toolkit](https://github.com/ostris/ai-toolkit) | **汉化基于**: main

---

## 支持的模型

### 图像
- [black-forest-labs/FLUX.1-dev](https://huggingface.co/black-forest-labs/FLUX.1-dev) (FLUX.1)
- [black-forest-labs/FLUX.2-dev](https://huggingface.co/black-forest-labs/FLUX.2-dev) (FLUX.2)
- [black-forest-labs/FLUX.2-klein-base-4B](https://huggingface.co/black-forest-labs/FLUX.2-klein-base-4B) (FLUX.2-klein-base-4B)
- [black-forest-labs/FLUX.2-klein-base-9B](https://huggingface.co/black-forest-labs/FLUX.2-klein-base-9B) (FLUX.2-klein-base-9B)
- [ostris/Flex.1-alpha](https://huggingface.co/ostris/Flex.1-alpha) (Flex.1)
- [ostris/Flex.2-preview](https://huggingface.co/ostris/Flex.2-preview) (Flex.2)
- [lodestones/Chroma1-Base](https://huggingface.co/lodestones/Chroma1-Base) (Chroma)
- [Alpha-VLLM/Lumina-Image-2.0](https://huggingface.co/Alpha-VLLM/Lumina-Image-2.0) (Lumina2)
- [Qwen/Qwen-Image](https://huggingface.co/Qwen/Qwen-Image) (Qwen-Image)
- [Qwen/Qwen-Image-2512](https://huggingface.co/Qwen/Qwen-Image-2512) (Qwen-Image-2512)
- [HiDream-ai/HiDream-I1-Full](https://huggingface.co/HiDream-ai/HiDream-I1-Full) (HiDream)
- [OmniGen2/OmniGen2](https://huggingface.co/OmniGen2/OmniGen2) (OmniGen2)
- [Tongyi-MAI/Z-Image-Turbo](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo) (Z-Image Turbo)
- [Tongyi-MAI/Z-Image](https://huggingface.co/Tongyi-MAI/Z-Image) (Z-Image)
- [ostris/Z-Image-De-Turbo](https://huggingface.co/ostris/Z-Image-De-Turbo) (Z-Image De-Turbo)
- [stabilityai/stable-diffusion-xl-base-1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) (SDXL)
- [stable-diffusion-v1-5/stable-diffusion-v1-5](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5) (SD 1.5)

### 指令/编辑
- [black-forest-labs/FLUX.1-Kontext-dev](https://huggingface.co/black-forest-labs/FLUX.1-Kontext-dev) (FLUX.1-Kontext-dev)
- [Qwen/Qwen-Image-Edit](https://huggingface.co/Qwen/Qwen-Image-Edit) (Qwen-Image-Edit)
- [Qwen/Qwen-Image-Edit-2509](https://huggingface.co/Qwen/Qwen-Image-Edit-2509) (Qwen-Image-Edit-2509)
- [Qwen/Qwen-Image-Edit-2511](https://huggingface.co/Qwen/Qwen-Image-Edit-2511) (Qwen-Image-Edit-2511)
- [HiDream-ai/HiDream-E1-1](https://huggingface.co/HiDream-ai/HiDream-E1-1) (HiDream E1)

### 视频
- [Wan-AI/Wan2.1-T2V-1.3B-Diffusers](https://huggingface.co/Wan-AI/Wan2.1-T2V-1.3B-Diffusers) (Wan 2.1 1.3B)
- [Wan-AI/Wan2.1-I2V-14B-480P-Diffusers](https://huggingface.co/Wan-AI/Wan2.1-I2V-14B-480P-Diffusers) (Wan 2.1 I2V 14B-480P)
- [Wan-AI/Wan2.1-I2V-14B-720P-Diffusers](https://huggingface.co/Wan-AI/Wan2.1-I2V-14B-720P-Diffusers) (Wan 2.1 I2V 14B-720P)
- [Wan-AI/Wan2.1-T2V-14B-Diffusers](https://huggingface.co/Wan-AI/Wan2.1-T2V-14B-Diffusers) (Wan 2.1 14B)
- [Wan-AI/Wan2.2-T2V-A14B-Diffusers](https://huggingface.co/Wan-AI/Wan2.2-T2V-A14B-Diffusers) (Wan 2.2 14B)
- [Wan-AI/Wan2.2-I2V-A14B-Diffusers](https://huggingface.co/Wan-AI/Wan2.2-I2V-A14B-Diffusers) (Wan 2.2 I2V 14B)
- [Wan-AI/Wan2.2-TI2V-5B-Diffusers](https://huggingface.co/Wan-AI/Wan2.2-TI2V-5B-Diffusers) (Wan 2.2 TI2V 5B)
- [Lightricks/LTX-2](https://huggingface.co/Lightricks/LTX-2) (LTX-2)
- [Lightricks/LTX-2.3](https://huggingface.co/Lightricks/LTX-2.3) (LTX-2.3)

### 实验性
- [lodestones/Zeta-Chroma](https://huggingface.co/lodestones/Zeta-Chroma) (Zeta Chroma)

---

## 安装

**环境要求**:
- Python >= 3.10（推荐 3.12）
- 具有足够显存的 NVIDIA GPU
- Python 虚拟环境 (venv)
- Git

### Linux

```bash
git clone https://github.com/ostris/ai-toolkit.git
cd ai-toolkit
python3 -m venv venv
source venv/bin/activate
# 首先安装 torch
pip3 install --no-cache-dir torch==2.9.1 torchvision==0.24.1 torchaudio==2.9.1 --index-url https://download.pytorch.org/whl/cu128
pip3 install -r requirements.txt
```

运行 **DGX OS** 的设备（包括 DGX Spark）请参考 [DGX 安装说明](dgx_instructions.md)。

### Windows

如果在 Windows 上遇到问题，推荐使用 [AI-Toolkit-Easy-Install](https://github.com/Tavris1/AI-Toolkit-Easy-Install) 一键安装脚本。

```bash
git clone https://github.com/ostris/ai-toolkit.git
cd ai-toolkit
python -m venv venv
.\venv\Scripts\activate
pip install --no-cache-dir torch==2.9.1 torchvision==0.24.1 torchaudio==2.9.1 --index-url https://download.pytorch.org/whl/cu128
pip install -r requirements.txt
```

### MacOS

Silicon Mac 实验性支持已可用。我没有足够 RAM 的 Mac 来完全测试，如果有问题请反馈。有一个便捷脚本位于 `./run_mac.zsh`，会安装依赖并启动 UI。

```bash
git clone https://github.com/ostris/ai-toolkit.git
cd ai-toolkit
chmod +x run_mac.zsh
./run_mac.zsh
```

---

# AI Toolkit UI

<img src="https://ostris.com/wp-content/uploads/2025/02/toolkit-ui.jpg" alt="AI Toolkit UI" width="100%">

AI Toolkit UI 是一个 Web 界面，让你可以轻松启动、停止和监控训练任务。支持设置访问令牌以防止未授权访问，可以安全地在公开服务器上运行。

## 运行 UI

**环境要求**:
- Node.js > 20

UI 不需要持续运行，训练任务即可独立运行。以下命令会安装/更新 UI 依赖并启动 UI。

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

## 训练

1. 复制示例配置文件 `config/examples/train_lora_flux_24gb.yaml`（schnell 用 `train_lora_flux_schnell_24gb.yaml`）到 `config` 文件夹，重命名为 `任意名称.yml`
2. 按照文件中的注释编辑配置
3. 运行：`python run.py config/任意名称.yml`

启动时会创建以配置中 `name` 和 `training_folder` 命名的文件夹，包含所有检查点和预览图。随时可用 Ctrl+C 停止训练，恢复时会从最后一个检查点继续。

**重要提示**: 在保存检查点时按 Ctrl+C 可能导致文件损坏，请等待保存完成。

## 需要帮助？

请不要因为代码 bug 以外的问题提交 issue。欢迎 [加入我的 Discord](https://discord.gg/VXmU2f5WEU) 寻求帮助。但请勿私信我一般性问题或支持请求，在 Discord 提问我会尽快回复。

## Gradio UI

快速开始本地训练：

```bash
cd ai-toolkit
huggingface-cli login  # 提供 write 令牌以发布 LoRA
python flux_train_ui.py
```

你将启动一个 UI，可以上传图片、标注、训练和发布 LoRA。

![Gradio UI](assets/lora_ease_ui.png)

## 在 RunPod 上训练

如果你尚未注册 RunPod，请考虑使用 [我的 RunPod 推荐链接](https://runpod.io?ref=h0y9jyr2) 支持本项目。

我维护着官方的 RunPod Pod 模板：[点击访问](https://console.runpod.io/deploy?template=0fqzfjy6f3&ref=h0y9jyr2)。

我还创建了 [入门视频教程](https://youtu.be/HBNeS-F6Zz8)。

## 在 Modal 上训练

### 1. 环境设置

**ai-toolkit**:
```
git clone https://github.com/ostris/ai-toolkit.git
cd ai-toolkit
git submodule update --init --recursive
python -m venv venv
source venv/bin/activate
pip install torch
pip install -r requirements.txt
pip install --upgrade accelerate transformers diffusers huggingface_hub # 可选，遇到问题时运行
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
```
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

查看存储内容：`modal volume ls flux-lora-models`
下载模型：`modal volume get flux-lora-models 你的模型名称`
示例：`modal volume get flux-lora-models my_first_flux_lora_v1`

---

## 数据集准备

数据集通常是一个包含图片和对应文本文件的文件夹。目前仅支持 jpg、jpeg 和 png 格式（WebP 存在问题）。

文本文件应与图片同名，扩展名为 `.txt`。例如：`image2.jpg` 和 `image2.txt`。文本文件仅包含标注（caption）。

可在标注中使用 `[trigger]` 占位符，如果配置中设置了 `trigger_word`，将自动替换。

**图片不会被放大，但会被缩小并分桶批处理。你不需要手动裁剪/调整图片尺寸**，加载器会自动处理不同宽高比。

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

## 赞助我的工作

如果你喜欢我的项目，或将其用于商业用途，请考虑赞助我。每一分支持都很重要！💖

<a href="https://ostris.com/sponsors" target="_blank"><img src="https://ostris.com/wp-content/uploads/2025/05/support-banner2.png" alt="Support my work" style="max-width:100%;height:auto;"></a>

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
| `ui/src/app/jobs/page.tsx` | 任务队列列表 |
| `ui/src/app/datasets/page.tsx` | 数据集列表页 |
| `ui/src/app/datasets/[datasetName]/page.tsx` | 数据集详情页 |
| `ui/src/app/dashboard/page.tsx` | 仪表盘 |
| `ui/src/app/settings/page.tsx` | 系统设置 |
| `ui/src/components/JobsTable.tsx` | 任务表格组件 |
| `ui/src/components/JobActionBar.tsx` | 任务操作栏 |
| `ui/src/components/CPUWidget.tsx` | CPU 监控组件 |
| `ui/src/components/GPUWidget.tsx` | GPU 监控组件 |
| `ui/src/components/FilesWidget.tsx` | 文件组件 |
| `ui/src/components/Sidebar.tsx` | 侧边栏 |
| `ui/src/components/ThemeToggle.tsx` | 主题切换 |
| `ui/src/components/formInputs.tsx` | 表单输入组件 |
| `ui/src/docs.tsx` | 帮助文档（完整翻译） |

## 版本信息

- **汉化分支**: main
- **基于版本**: main (最新)

## 更新与维护

### 检查上游更新

```bash
cd ui
git fetch origin main
git log HEAD..origin/main --oneline
```

### 合并上游更新

```bash
git checkout main
git fetch upstream main
git merge upstream/main
# 解决冲突后提交
```

## 常见问题

### Q: 汉化后界面显示异常？
A: 清除浏览器缓存后刷新，或重启 Docker 容器。

### Q: 如何切换回英文？
A: 这是一个汉化版，英文为上游原版。

### Q: 训练任务失败？
A: 检查：
1. GPU 显存是否充足
2. Hugging Face Token 是否有效
3. 模型路径是否正确
4. 查看日志

---

**最后更新**: 2026-04-01
