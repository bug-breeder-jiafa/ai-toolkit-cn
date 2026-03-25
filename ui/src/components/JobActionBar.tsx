import Link from 'next/link';
import { Eye, Trash2, Pen, Play, Pause, Cog, X } from 'lucide-react';
import { Button } from '@headlessui/react';
import { openConfirm } from '@/components/ConfirmModal';
import { Job } from '@prisma/client';
import { startJob, stopJob, deleteJob, getAvaliableJobActions, markJobAsStopped } from '@/utils/jobs';
import { startQueue } from '@/utils/queue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { redirect } from 'next/navigation';

interface JobActionBarProps {
  job: Job;
  onRefresh?: () => void;
  afterDelete?: () => void;
  hideView?: boolean;
  className?: string;
  autoStartQueue?: boolean;
}

export default function JobActionBar({
  job,
  onRefresh,
  afterDelete,
  className,
  hideView,
  autoStartQueue = false,
}: JobActionBarProps) {
  const { canStart, canStop, canDelete, canEdit, canRemoveFromQueue } = getAvaliableJobActions(job);

  if (!afterDelete) afterDelete = onRefresh;

  return (
    <div className={`${className}`}>
      {canStart && (
        <Button
          onClick={async () => {
            if (!canStart) return;
            await startJob(job.id);
            // start the queue as well
            if (autoStartQueue) {
              await startQueue(job.gpu_ids);
            }
            if (onRefresh) onRefresh();
          }}
          className={`ml-2 opacity-100`}
          title="启动任务"
        >
          <Play />
        </Button>
      )}
      {canRemoveFromQueue && (
        <Button
          onClick={async () => {
            if (!canRemoveFromQueue) return;
            await markJobAsStopped(job.id);
            if (onRefresh) onRefresh();
          }}
          className={`ml-2 opacity-100`}
          title="从队列移除"
        >
          <X />
        </Button>
      )}
      {canStop && (
        <Button
          onClick={() => {
            if (!canStop) return;
            openConfirm({
              title: '停止任务',
              message: `确定要停止任务 "${job.name}" 吗？你可以稍后恢复运行。`,
              type: 'info',
              confirmText: '停止',
              onConfirm: async () => {
                await stopJob(job.id);
                if (onRefresh) onRefresh();
              },
            });
          }}
          className={`ml-2 opacity-100`}
        >
          <Pause />
        </Button>
      )}
      {!hideView && (
        <Link href={`/jobs/${job.id}`} className="ml-2 text-gray-200 hover:text-gray-100 inline-block">
          <Eye />
        </Link>
      )}
      {canEdit && (
        <Link href={`/jobs/new?id=${job.id}`} className="ml-2 hover:text-gray-100 inline-block">
          <Pen />
        </Link>
      )}
      <Button
        onClick={() => {
          let message = `确定要删除任务 "${job.name}" 吗？这将从磁盘中永久删除该任务及其所有输出。`;
          if (job.status === 'running') {
            message += ' 警告：任务正在运行中，建议先停止任务再删除。';
          }
          openConfirm({
            title: '删除任务',
            message: message,
            type: 'warning',
            confirmText: '删除',
            onConfirm: async () => {
              if (job.status === 'running') {
                try {
                  await stopJob(job.id);
                } catch (e) {
                  console.error('Error stopping job before deleting:', e);
                }
              }
              await deleteJob(job.id);
              if (afterDelete) afterDelete();
            },
          });
        }}
        className={`ml-2 opacity-100`}
      >
        <Trash2 />
      </Button>
      <div className="border-r border-1 border-gray-700 ml-2 inline"></div>
      <Menu>
        <MenuButton className={'ml-2'}>
          <Cog />
        </MenuButton>
        <MenuItems anchor="bottom" className="bg-gray-900 border border-gray-700 rounded shadow-lg w-48 px-2 py-2 mt-4">
          <MenuItem>
            <Link href={`/jobs/new?cloneId=${job.id}`} className="cursor-pointer px-4 py-1 hover:bg-gray-800 rounded block">
              克隆任务
            </Link>
          </MenuItem>
          <MenuItem>
            <div
              className="cursor-pointer px-4 py-1 hover:bg-gray-800 rounded"
              onClick={() => {
                let message = `确定要将此任务标记为已停止吗？这会将任务状态强制设为'stopped'，仅适用于任务状态卡死的情况。请确保任务确实已停止，此操作不会实际停止任务。`;
                openConfirm({
                  title: '强制标记为已停止',
                  message: message,
                  type: 'warning',
                  confirmText: '标记为已停止',
                  onConfirm: async () => {
                    await markJobAsStopped(job.id);
                    onRefresh && onRefresh();
                  },
                });
              }}
            >
              强制标记为已停止
            </div>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}
