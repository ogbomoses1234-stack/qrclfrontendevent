export default function FailedRecipients({ failedList, onRetryAll, onRetrySingle }) {
  if (!failedList || failedList.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-2.5">
      <h4 className="text-[10px] font-semibold text-red-600 mb-1 flex justify-between">
        ❌ Failed Recipients <span className="font-normal text-red-400">{failedList.length} remaining</span>
      </h4>
      <div className="max-h-24 overflow-y-auto text-[9px] space-y-0.5">
        {failedList.map((r, idx) => (
          <div key={idx} className="flex justify-between py-0.5 border-b border-red-100">
            <span>{r.phone}</span>
            <span className="text-red-500">{r.reason}</span>
            <button onClick={() => onRetrySingle(idx)} className="text-red-600 hover:underline text-xs ml-2">
              Retry
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onRetryAll}
        className="mt-2 w-full bg-red-600 text-white px-2 py-1 rounded text-[10px] font-medium hover:bg-red-700"
      >
        Retry All Failed
      </button>
    </div>
  );
}