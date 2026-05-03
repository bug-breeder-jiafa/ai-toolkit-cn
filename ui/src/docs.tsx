import React from 'react';
import { ConfigDoc } from '@/types';
import { IoFlaskSharp } from 'react-icons/io5';

const docs: { [key: string]: ConfigDoc } = {
  'config.name': {
    title: '训练名称 (Training Name)',
    description: (
      <>
        训练任务的唯一标识名称。该名称将用于系统内部识别任务，并作为最终模型文件的文件名。
        名称必须唯一，且只能包含字母、数字、下划线和连字符，不允许使用空格或特殊字符。
      </>
    ),
  },
  gpuids: {
    title: '显卡 ID (GPU ID)',
    description: (
      <>
        用于训练的显卡编号。当前 UI 版本下，每个任务仅支持使用单张显卡。
        如果需要多卡并行，可以开启多个不同的训练任务并分别指定不同的显卡 ID。
      </>
    ),
  },
  'config.process[0].trigger_word': {
    title: '触发词 (Trigger Word)',
    description: (
      <>
        可选：用于激活你训练的概念或角色的特定词汇或 Token。
        <br />
        <br />
        使用触发词时，如果你的图片提示词（Caption）中不包含该词，系统会自动将其添加到提示词的开头。
        如果图片没有提示词，则该触发词将成为唯一的提示词。
        如果你希望在提示词的不同位置插入触发词，可以在 Caption 中使用 <code>{'[trigger]'}</code> 占位符，系统会自动替换。
        <br />
        <br />
        注意：触发词不会自动添加到测试预览的提示词中，你需要手动添加或在预览提示词里同样使用 <code>{'[trigger]'}</code>。
      </>
    ),
  },
  'config.process[0].model.name_or_path': {
    title: '模型路径或名称 (Name or Path)',
    description: (
      <>
        Huggingface 上的 Diffusers 仓库名称，或者本地基础模型的路径。
        对于大多数模型，该文件夹需要符合 Diffusers 格式。
        对于 SDXL 或 SD 1.5 等模型，你也可以直接指定单个 .safetensors 权重文件的路径。
      </>
    ),
  },
  'datasets.control_path': {
    title: '控制图数据集 (Control Dataset)',
    description: (
      <>
        控制图数据集包含的文件名必须与训练数据集中的图片文件名一一对应。
        这些图片将在训练期间作为 ControlNet 式的输入/控制信息。
        系统会自动将控制图调整至与训练图一致的分辨率。
      </>
    ),
  },
  'datasets.multi_control_paths': {
    title: '多重控制图数据集',
    description: (
      <>
        包含与训练数据集文件名匹配的控制图文件。
        <br />
        <br />
        在多重控制模式下，控制图将按列表顺序依次应用。
        如果模型不强制要求图片长宽比一致（例如 Qwen/Qwen-Image-Edit-2509），则控制图不需要与目标图完全匹配，
        系统会自动将其缩放到模型和目标图所需的理想分辨率。
      </>
    ),
  },
  'datasets.num_frames': {
    title: '帧数 (Number of Frames)',
    description: (
      <>
        设置视频数据集中视频被抽取的帧数。如果是图片数据集，请设为 1。
        如果是视频数据集，系统会从视频中等间距抽取指定数量的帧。
        <br />
        <br />
        建议在训练前将视频修剪到合适的长度。以 Wan 模型为例，其频率为 16帧/秒。
        由于 81 帧大约对应 5 秒视频，你最好将素材都修剪在 5 秒左右。
        <br />
        <br />
        示例：若设为 81 帧，数据集中有两个视频（一个 2 秒，一个 90 秒），结果是两者都会被抽取出 81 帧，
        导致 2 秒的视频看起来像慢动作，而 90 秒的视频看起来极快。
      </>
    ),
  },
  'datasets.do_i2v': {
    title: '执行图生视频 (Do I2V)',
    description: (
      <>
        对于支持 I2V（图生视频）和 T2V（文生视频）的视频模型，开启此项会将数据集作为 I2V 任务处理。
        这意味着系统会从视频中提取第一帧作为起始参考图。如果不开启，则视为文生视频任务。
      </>
    ),
  },
  'datasets.do_audio': {
    title: '处理音频 (Do Audio)',
    description: (
      <>
        对于支持音频同步的视频模型，开启此项将加载视频音频并调整其采样以匹配视频序列。
        由于视频被重新缩放空间或时长，音频音调可能会随之改变。建议在训练前确数据集的时长符合预期。
      </>
    ),
  },
  'datasets.audio_normalize': {
    title: '音频音量标准化',
    description: (
      <>
        加载音频时，将音量归一化至峰值水平。如果素材音量差别很大，这很有用。
        警告：如果你想保留完全安静的部分，请勿开启，因为它会提升底噪音量。
      </>
    ),
  },
  'datasets.audio_preserve_pitch': {
    title: '保持音频音调',
    description: (
      <>
        当调整音频长度以匹配帧数时，开启此项将尝试在变速时保持原有音调。
        虽然能防止变调，但也可能引入声音失真。
      </>
    ),
  },
  'datasets.flip': {
    title: '水平与垂直翻转 (Flip X & Y)',
    description: (
      <>
        通过在训练时随机水平（X）或垂直（Y）翻转图片，可以实时扩充数据集。
        翻转一个轴相当于让数据集增大一倍。
        <br />
        <br />
        注意：这可能是破坏性的。例如不需要训练倒立的人物，且翻转人脸可能导致模型困惑（因为人脸并非绝对对称）。
        如果是训练带有文字的场景，翻转显然是个坏主意。控制图也会随之翻转以保持像素级对应。
      </>
    ),
  },
  'train.unload_text_encoder': {
    title: '卸载文本编码器 (Unload TE)',
    description: (
      <>
        开启后，系统会缓存触发词和预览提示词，然后从显存中卸载文本编码器。
        此时数据集中的图片提示词（Captions）将被忽略，以节省显存。
      </>
    ),
  },
  'train.cache_text_embeddings': {
    title: '缓存文本嵌入 (Cache Embeds)',
    description: (
      <>
        <small>(实验性)</small>
        <br />
        将文本编码器的所有嵌入预先计算并缓存到磁盘，然后从显存中完全卸载组件。
        该功能目前无法与动态改变提示词的功能（如触发词自动插入、提示词随机弃置）同时工作。
      </>
    ),
  },
  'model.multistage': {
    title: '训练阶段 (Stages to Train)',
    description: (
      <>
        某些模型包含多阶段网络，在去噪过程中分别使用。最常见的是两阶段：一阶段处理高噪声，一阶段处理低噪声。
        你可以选择同时训练，也可以分开训练。
        如果同时训练，训练器会在每隔若干步后在两个模型间切换，并输出两个不同的 LoRA。
      </>
    ),
  },
  'train.switch_boundary_every': {
    title: '切换频率 (Switch Boundary)',
    description: (
      <>
        在多阶段训练模式下，控制训练器在各阶段之间切换的频率。
        <br />
        <br />
        在低显存模式下，当前未在训练的模型会被移出 GPU 以腾出显存。这个过程需要时间，
        因此建议将切换频率设高一些（如 10 或 20），以减少频繁搬运导致的效率损失。
        切换发生在批次层面。
      </>
    ),
  },
  'train.force_first_sample': {
    title: '强制生成首次预览',
    description: (
      <>
        强制训练器在启动时立即生成预览样图。
        通常训练器只在零起点训练时生成首次预览，从检查点恢复时则不会。
        如果你修改了预览提示词并想立刻看到效果，可以开启此项。
      </>
    ),
  },
  'model.layer_offloading': {
    title: (
      <>
        层卸载 (Layer Offloading){' '}
        <span className="text-yellow-500">
          ( <IoFlaskSharp className="inline text-yellow-500" name="Experimental" /> 实验性功能)
        </span>
      </>
    ),
    description: (
      <>
        基于{' '}
        <a className="text-blue-500" href="https://github.com/lodestone-rock/RamTorch" target="_blank">
          RamTorch
        </a>{' '}
        的实验性功能。目前仍处于早期开发阶段，可能在不同版本间存在不稳定性。仅支持部分特定模型。
        <br />
        <br />
        层卸载利用 CPU 内存（RAM）而非 GPU 显存来存储大部分模型权重。
        这允许你在显存不足的显卡上训练超大型模型，前提是你有足够的 CPU 内存。
        这会显著降低训练速度，但 CPU 内存更便宜且易于升级。由于仍需显存放优化器状态和 LoRA 权重，显存也不能太小。
        <br />
        <br />
        你可以选择卸载层数的百分比。建议尽可能设低一些（接近 0%）以获得最佳性能。
      </>
    ),
  },
  'model.qie.match_target_res': {
    title: '匹配目标分辨率',
    description: (
      <>
        让控制图自动匹配目标图像的分辨率。
        在 Qwen-Image-Edit-2509 的官方示例中，无论生成何种尺寸，控制图都被固定在 100万像素（1MP）。
        这导致小尺寸训练非常困难。开启此项后，控制图将根据目标分辨率动态调整，从而在使用较小分辨率训练时节省显存。
      </>
    ),
  },
  'train.diff_output_preservation': {
    title: '差异化输出保持 (DOP)',
    description: (
      <>
        差异化输出保持 (DOP) 是一种在训练期间帮助保持训练对象所属类别特征的技术。
        为此，你必须设置一个触发词来区分你的概念与其所属类别。
        <br />
        <br />
        例如：你正在训练一个叫"Alice"的女性。"Alice"是触发词，"woman"（女人）是类别词。
        我们希望模型在学习 Alice 的特征时，不要忘记"女人"该长什么样。
        训练器会对比 LoRA 开启和关闭时的差异（将提示词中的 Alice 换回 woman 后的预测结果）。
        这能不仅提升训练效果，还能防止模型过拟合（例如在输入"Alice 站在一个女人旁边"时，不会让两个人都长得像 Alice）。
      </>
    ),
  },
  'train.blank_prompt_preservation': {
    title: '空白提示词保持 (BPP)',
    description: (
      <>
        空白提示词保持 (BPP) 旨在保护模型在没有任何引导（无提示词）时的基础知识。
        这不仅能提升模型的灵活性，还能改善使用 CFG（无分类引导）推理时的概念质量。
        每一训练步中，都会产生一个不使用任何 LoRA 且不加提示词的"先验预测"作为目标。
        这有助于模型不会过度拟合到特定的 Prompt 词汇上，保留其本身的通用化能力。
      </>
    ),
  },
  'train.do_differential_guidance': {
    title: '差异化引导 (D-Guidance)',
    description: (
      <>
        差异化引导会放大模型预测与目标之间的差异，从而生成一个新的训练目标。
        Scale（比例）就是这个差异的乘数。
        <br />
        <br />
        该功能仍处于实验阶段。原理是普通训练通常会无限接近目标但难以完全闭合。
        通过差异化引导，我们让模型尝试"超越"目标值，从而学习到更多的细节并加快收敛速度。
        <br />
        <br />
        <img src="/imgs/diff_guidance.png" alt="Differential Guidance Diagram" className="max-w-full mx-auto" />
      </>
    ),
  },
  'dataset.num_repeats': {
    title: '重复次数 (Repeats)',
    description: (
      <>
        设置数据集中每张图在一个 Epoch 中被读取的次数。
        这在结合使用多个数据集时非常有用，可以平衡各数据集的权重。
        例如：A 集有 10 张图，B 集有 100 张。你可以给 A 集设置 10 次重复，从而让它们在训练过程中出现的机会均等。
      </>
    ),
  },
  'train.audio_loss_multiplier': {
    title: '音频损失乘数',
    description: (
      <>
        在训练音视频模型时，视频的损失（Loss）往往远大于音频损失，导致音频学习效果被掩盖而产生杂音。
        增加此乘数（如 2.0 或 10.0）可以增加音频部分在总损失中的权重。
        警告：设得过高可能会导致过拟合并破坏模型。
      </>
    ),
  },
  'datasets.auto_frame_count': {
    title: '自动计算帧数',
    description: (
      <>
        自动确定数据集中每个视频应使用的帧数，而不是使用固定的 num_frames。
        这允许你在同一个数据集中混合不同长度的视频，且不会导致播放倍速异常。
        注意：加入长视频会显著增加显存占用。目前该功能不支持大于 1 的批次大小（Batch Size）。
      </>
    ),
  },
};

export const getDoc = (key: string | null | undefined): ConfigDoc | null => {
  if (key && key in docs) {
    return docs[key];
  }
  return null;
};

export default docs;
