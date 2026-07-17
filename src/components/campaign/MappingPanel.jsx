// src/components/campaign/MappingPanel.jsx
import { useState } from 'react';

export default function MappingPanel({
  columns,
  mapping,
  setMapping,
  template,
  setTemplate,
  templates,
  templateDefinitions,
  activeVariants,
  toggleVariant,
  customMessage,
  setCustomMessage,
}) {
  const tplDef = templateDefinitions[template];

  return (
    <div className="dashboard-panel p-4">
      <div className="panel-header"><div className="panel-badge">2</div> COLUMN MAPPING</div>
      <div className="space-y-3 flex-1">
        {/* Phone */}
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase">Phone Number</label>
          <select
            value={mapping.phone}
            onChange={(e) => setMapping({ ...mapping, phone: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg p-2 mt-0.5"
          >
            <option value="">-- Select Column --</option>
            {columns.map(col => <option key={col} value={col}>[{col}]</option>)}
          </select>
        </div>
        {/* Name */}
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase">Name → {"{{1}}"}</label>
          <select
            value={mapping.name}
            onChange={(e) => setMapping({ ...mapping, name: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg p-2 mt-0.5"
          >
            <option value="">-- Select Column --</option>
            {columns.map(col => <option key={col} value={col}>[{col}]</option>)}
          </select>
        </div>
        {/* Event */}
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase">Event → {"{{2}}"}</label>
          <select
            value={mapping.event}
            onChange={(e) => setMapping({ ...mapping, event: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg p-2 mt-0.5"
          >
            <option value="">-- Select Column --</option>
            {columns.map(col => <option key={col} value={col}>[{col}]</option>)}
          </select>
        </div>
        {/* QR */}
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase">QR Image URL → Header</label>
          <select
            value={mapping.qr}
            onChange={(e) => setMapping({ ...mapping, qr: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg p-2 mt-0.5"
          >
            <option value="">-- Select Column --</option>
            {columns.map(col => <option key={col} value={col}>[{col}]</option>)}
          </select>
        </div>
        {/* Date */}
        <div>
          <label className="text-[10px] font-semibold text-gray-400 uppercase">Date → {"{{3}}"}</label>
          <select
            value={mapping.date}
            onChange={(e) => setMapping({ ...mapping, date: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-lg p-2 mt-0.5"
          >
            <option value="">-- Select Column --</option>
            {columns.map(col => <option key={col} value={col}>[{col}]</option>)}
          </select>
        </div>

        {/* Template Selector */}
        <div className="pt-2 border-t">
          <label className="text-[10px] font-semibold text-gray-400 uppercase">Template Category</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-700 text-xs rounded-lg p-2 mt-0.5 font-medium"
          >
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Variant Pills (only for tpl1-tpl3) */}
        {template !== 'tpl4' && (
          <div className="pt-1">
            <label className="text-[10px] font-semibold text-gray-400 uppercase">
              Active Variants <span className="text-gray-300">(random per recipient)</span>
            </label>
            <div className="flex flex-wrap gap-1 mt-1">
              {tplDef?.variants?.map((v, idx) => {
                const isActive = activeVariants[template]?.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleVariant(template, idx)}
                    className={`variant-pill px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      isActive ? 'active' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {v.label} {isActive ? '✓' : ''}
                  </button>
                );
              })}
            </div>
            <p className="text-[9px] text-gray-400 mt-0.5">
              Each recipient randomly gets one of the <strong className="text-blue-600">blue</strong> variants.
            </p>
          </div>
        )}

        {/* Custom Message (only for tpl4) */}
        {template === 'tpl4' && (
          <div className="pt-1">
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2 text-xs resize-none h-16"
              placeholder="Type custom message... Use {{1}} {{2}} {{3}} for variables."
            />
            <div className="text-[10px] text-gray-400 text-right">{customMessage.length}/1024</div>
          </div>
        )}
      </div>
    </div>
  );
}