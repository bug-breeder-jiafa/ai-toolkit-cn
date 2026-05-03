# AI Toolkit - AI 工具包

[![Discord](https://img.shields.io/discord/1086204257562976268?label=Discord&logo=discord&logoColor=white&color=blue&style=for-the-badge)](https://discord.gg/Fb4Uq2Qc4g)

Ostris 的 AI 工具包。用于构建 AI 应用的工具包。这是一个用于构建 AI 应用的工具包，目前专注于使用 FLUX、Wan、LTX Video、HunyuanVideo、Sana、PixArt、OmniGen 和 Qwen 模型训练 LoRA。

## 免责声明

本软件按"原样"提供，不提供任何形式的担保。使用本软件的风险由您自行承担。本软件不保证与任何特定用途的适用性。作者不对因使用本软件产生的任何直接、间接、附带、特殊或后果性损害承担责任。您有责任确保遵守所有适用的法律和法规。

## 文档

完整文档请访问 [https://ostris.github.io/ai-toolkit/](https://ostris.github.io/ai-toolkit/)

## 最近更新

### v0.8.0

- 添加了 Qwen-Image-Edit-2509 支持
- 添加了 OmniGen2 支持
- 添加了 Sana 支持
- 添加了 PixArt 支持
- 添加了 HunyuanVideo Custom LoRA 支持
- 添加了 GGUF 量化支持
- 添加了 LoKr 支持
- 添加了 DAdaptation 优化器
- 添加了 Lion 优化器
- 添加了 CAME 优化器
- 添加了 SGDNesterov 优化器
- 添加了 Booster 优化器
- 添加了多阶段训练支持
- 添加了层卸载（实验性）
- 添加了差异化输出保持 (DOP)
- 添加了空白提示词保持 (BPP)
- 添加了差异化引导
- 添加了音频训练支持
- 添加了音频损失乘数
- 添加了自动帧数计算
- 添加了图生视频 (I2V) 支持
- 添加了音频音量标准化
- 添加了音频音调保持
- 添加了多重控制图数据集
- 添加了概念滑块训练
- 添加了 UI 损失曲线图
- 添加了 UI 拖拽缩放功能
- 添加了 UI 全平滑趋势叠加
- 添加了 UI 批量操作
- 添加了 UI 数据集管理
- 添加了 UI 自动标注
- 添加了 UI 模型架构选择器
- 添加了 UI 量化选项
- 添加了 UI 多阶段训练选项
- 添加了 UI 高级配置编辑器
- 添加了 UI 配置导入/导出
- 添加了 UI 任务克隆
- 添加了 UI 任务队列
- 添加了 UI GPU 监控
- 添加了 UI CPU 监控
- 添加了 UI 检查点管理
- 添加了 UI 深色模式
- 添加了 UI 响应式布局
- 添加了 UI 错误边界
- 添加了 UI 认证保护
- 添加了 UI 设置页面
- 添加了 UI 数据库持久化
- 添加了 UI Docker 支持

## 安装

### 要求

- Python 3.10+
- NVIDIA GPU（建议 16GB+ 显存）
- CUDA 12.x
- Node.js 18+（用于 Web UI）

### 快速安装

```bash
# 克隆仓库
git clone https://github.com/ostris/ai-toolkit.git
cd ai-toolkit

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows

# 安装 PyTorch（根据你的 CUDA 版本选择）
pip3 install --no-cache-dir torch==2.9.1 torchvision==0.24.1 torchaudio==2.9.1 --index-url https://download.pytorch.org/whl/cu128

# 安装依赖
pip3 install -r requirements.txt
```

### Web UI 安装

```bash
cd ui
npm install
npm run build_and_start  # 安装依赖 + 构建 + 启动（端口 8675）
```

### Docker 安装

```bash
docker-compose up
```

## 使用方法

### 命令行训练

```bash
# 使用配置文件运行训练
python run.py config/your_config.yml
```

### Web UI

```bash
cd ui
npm run dev  # 开发模式（热重载）
# 或
npm run build_and_start  # 生产模式
```

然后在浏览器中访问 `http://localhost:8675`

### Gradio UI（本地训练界面）

```bash
python flux_train_ui.py
```

## 支持的模型

| 模型 | 类型 | 说明 |
|------|------|------|
| FLUX.1 / FLUX.2 | 图像 | 支持 Dev 和 Schnell 变体 |
| Wan 2.2 | 视频 | 支持 T2V 和 I2V |
| LTX Video | 视频 | 视频生成模型 |
| HunyuanVideo | 视频 | 支持自定义 LoRA |
| Sana | 图像 | 高分辨率图像生成 |
| PixArt | 图像 | 图像生成模型 |
| OmniGen2 | 图像 | 通用图像生成 |
| Qwen-Image-Edit-2509 | 图像 | 图像编辑模型 |

## 训练功能

- **LoRA 训练** — 低秩适应训练，节省显存
- **LoKr 训练** — 低秩 Kronecker 适应训练
- **多阶段训练** — 支持多阶段网络分别或同时训练
- **量化训练** — 支持 NF4、FP4、FP8、INT8 等量化格式
- **GGUF 量化** — 支持 GGUF 格式量化
- **概念滑块** — 训练概念控制滑块
- **差异化输出保持 (DOP)** — 保持训练对象类别特征
- **空白提示词保持 (BPP)** — 保护模型无引导时的基础知识
- **差异化引导** — 放大预测与目标差异以加速收敛
- **层卸载** — 利用 CPU 内存训练超大型模型（实验性）
- **音频训练** — 支持音视频同步训练
- **自动帧数** — 自动计算视频帧数
- **图生视频 (I2V)** — 支持从图片生成视频的训练
- **多重控制图** — 支持多个控制图数据集

## 优化器

- AdamW
- Prodigy
- Adafactor
- Lion
- DAdaptation
- CAME
- SGDNesterov
- Booster

## Web UI 功能

- 任务创建和管理
- 任务队列控制（启动/停止）
- GPU 和 CPU 监控
- 训练损失曲线可视化（支持缩放、平滑、对数轴）
- 数据集管理（上传、标注、浏览）
- 检查点管理
- 配置导入/导出
- 高级配置编辑器（YAML/JSON）
- 深色模式
- 认证保护
- 响应式布局

## 配置

训练配置使用 YAML 或 JSON 格式。基本示例：

```yaml
job: extension
config:
  name: my_training
  process:
    - type: sd_trainer
      training_folder: output
      device: cuda
      trigger_word: ohwx
      network:
        type: lora
        linear: 16
        linear_alpha: 16
      datasets:
        - folder_path: /path/to/dataset
          num_repeats: 10
      train:
        batch_size: 1
        steps: 1000
        lr: 0.0002
        optimizer: adamw
```

完整配置选项请参考 [文档](https://ostris.github.io/ai-toolkit/)。

## 扩展系统

AI Toolkit 支持扩展系统，可以在 `extensions/` 和 `extensions_built_in/` 目录中添加自定义训练流程。每个扩展通过 `__init__.py` 中的 `AI_TOOLKIT_EXTENSIONS` 列表注册。

## 贡献

欢迎贡献！请提交 Pull Request。

## 许可证

请参阅 [LICENSE](LICENSE) 文件。

## 链接

- [文档](https://ostris.github.io/ai-toolkit/)
- [Discord](https://discord.gg/Fb4Uq2Qc4g)
- [GitHub](https://github.com/ostris/ai-toolkit)
