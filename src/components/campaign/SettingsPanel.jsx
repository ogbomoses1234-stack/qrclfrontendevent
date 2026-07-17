import { useState } from 'react';
import ProgressBar from '../common/ProgressBar';

export default function SettingsPanel({
  batchSize, setBatchSize,
  waitValue, setWaitValue,
  waitUnit, setWaitUnit,
  scheduleTime, setScheduleTime,
  onLaunch, onTestSend,
  isRunning, progress, status,
  variantCount,
}) {
  const [testNumber, setTestNumber] = useState('');

  return (
    <div className="dashboard-panel p-4">
      <div className="panel-header"><div className="panel-badge">4</div> SETTINGS & LAUNCH</div>
      <div className="space-y-3 flex-1">
        {/* Batch Size */}
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase">Messages Per Batch</label>
          <div className="flex items-center gap-2 mt-0.5">
            <input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              min="1" max="500"
              className="w-full bg-white border border-gray-200 text-gray-700 text-xs rounded-lg p-2"
            />
            <span className="text-[10px] text-gray-400">contacts</span>
          </div>
        </div>

        {/* Wait Between Batches */}
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase">Wait Between Batches</label>
          <div className="flex items-center gap-2 mt-0.5">
            <input
              type="number"
              value={waitValue}
              onChange={(e) => setWaitValue(Number(e.target.value))}
              min="1" max="999"
              className="w-20 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg p-2"
            />
            <select
              value={waitUnit}
              onChange={(e) => setWaitUnit(e.target.value)}
              className="flex-1 bg-white border border-gray-200 text-gray-700 text-xs rounded-lg p-2"
            >
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase">Start Sending At (optional)</label>
          <input
            type="datetime-local"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-700 text-xs rounded-lg p-2 mt-0.5"
          />
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-2.5 text-[10px] space-y-1.5">
          <div className="flex justify-between">
            <span>Variants Active:</span>
            <strong>{variantCount}</strong>
          </div>
        </div>

        {/* Test Send */}
        <button
          onClick={() => onTestSend(testNumber)}
          className="w-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition flex items-center justify-center gap-2"
        >
          <i className="fas fa-flask"></i> Send Test to My Number
        </button>
        <div>
          <input
            type="tel"
            value={testNumber}
            onChange={(e) => setTestNumber(e.target.value)}
            placeholder="+234 801 234 5678"
            className="w-full border border-gray-200 rounded-lg p-2 text-xs mt-1"
          />
        </div>

        {/* Progress (visible while sending) */}
        {isRunning && (
          <div className="mt-3">
            <ProgressBar value={progress} max={100} label="Progress" />
            <p className="text-[10px] text-gray-400 mt-1 text-center">{status}</p>
          </div>
        )}

        {/* ═══════════════════════════════════
           LAUNCH CAMPAIGN BUTTON – THE MISSING PIECE
           ═══════════════════════════════════ */}
        <button
          onClick={onLaunch}
          disabled={isRunning}
          className="w-full bg-emerald-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-emerald-600 transition shadow-md shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-rocket"></i>
          <span>LAUNCH CAMPAIGN</span>
        </button>
      </div>
    </div>
  );
}