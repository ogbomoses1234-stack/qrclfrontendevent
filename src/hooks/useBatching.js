import { useState, useMemo } from 'react';

const getWaitSeconds = (value, unit) => {
  const val = Number(value) || 1;
  switch (unit) {
    case 'seconds': return val;
    case 'minutes': return val * 60;
    case 'hours': return val * 3600;
    case 'days': return val * 86400;
    default: return val * 60;
  }
};

export const useBatching = (total = 0, batchSize = 10, waitValue = 5, waitUnit = 'minutes') => {
  const waitSeconds = getWaitSeconds(waitValue, waitUnit);

  const batches = useMemo(() => {
    const count = Math.ceil(total / batchSize);
    return Array.from({ length: count }, (_, i) => {
      const start = i * batchSize + 1;
      const end = Math.min((i + 1) * batchSize, total);
      const timeOffset = i * waitSeconds;
      return { batch: i + 1, start, end, timeOffset };
    });
  }, [total, batchSize, waitSeconds]);

  const totalEstTime = batches.length > 0 ? (batches.length - 1) * waitSeconds : 0;

  return {
    batches,
    batchCount: batches.length,
    totalEstTime,
    waitSeconds,
    formatDuration: (sec) => {
      if (sec < 60) return `${sec}s`;
      if (sec < 3600) return `${Math.ceil(sec / 60)}m`;
      if (sec < 86400) {
        const h = Math.floor(sec / 3600);
        const m = Math.round((sec % 3600) / 60);
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
      }
      const d = Math.floor(sec / 86400);
      const h = Math.round((sec % 86400) / 3600);
      return h > 0 ? `${d}d ${h}h` : `${d}d`;
    },
  };
};