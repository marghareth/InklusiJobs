"use client";

/**
 * components/verification/DocumentUpload.jsx
 * Step 1 — Upload PWD ID (front + back) + supporting document
 */

import { useState, useRef } from "react";

function DropZone({ label, sublabel, value, onChange, icon }) {
  const ref = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (file) onChange({ file, name: file.name, size: (file.size / 1024).toFixed(0) + " KB" });
  };

  return (
    <div
      onClick={() => ref.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
      className={`border-2 border-dashed rounded-xl p-4 cursor-pointer text-center transition-all
        ${dragging   ? "border-[#1a6b5c] bg-[#1a6b5c]/5"
        : value      ? "border-[#1a6b5c] bg-[#1a6b5c]/5"
        : "border-gray-200 hover:border-[#1a6b5c]/50 bg-white"}`}
    >
      <input
        ref={ref}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="space-y-1">
          <div className="text-2xl">✅</div>
          <div className="text-xs font-bold text-[#1a6b5c] truncate">{value.name}</div>
          <div className="text-xs text-gray-400">{value.size}</div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="text-2xl">{icon}</div>
          <div className="text-xs font-semibold text-gray-700">{label}</div>
          {sublabel && <div className="text-xs text-gray-400">{sublabel}</div>}
          <div className="text-xs text-gray-300">Click or drag & drop</div>
        </div>
      )}
    </div>
  );
}

export default function DocumentUpload({ onNext }) {
  const [pwdFront,   setPwdFront]   = useState(null);
  const [pwdBack,    setPwdBack]    = useState(null);
  const [supporting, setSupporting] = useState(null);

  const ready = pwdFront && supporting;

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Submit your PWD ID and one supporting document. All files are encrypted and used only for verification.
      </p>

      {/* PWD ID */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-full bg-[#1a6b5c] text-white text-xs flex items-center justify-center font-bold">1</span>
          <span className="text-sm font-bold text-gray-800">PWD ID Card</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <DropZone label="Front Side"  value={pwdFront}  onChange={setPwdFront}  icon="🪪" />
          <DropZone label="Back Side"   sublabel="Optional" value={pwdBack} onChange={setPwdBack} icon="🔄" />
        </div>
      </div>

      {/* Supporting doc */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-5 rounded-full bg-[#1a6b5c] text-white text-xs flex items-center justify-center font-bold">2</span>
          <span className="text-sm font-bold text-gray-800">Supporting Document</span>
        </div>
        <DropZone
          label="Medical Certificate / Barangay Cert / PhilHealth MDR"
          value={supporting}
          onChange={setSupporting}
          icon="📄"
        />
      </div>

      {/* Privacy notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 leading-relaxed">
        🔒 Documents are encrypted end-to-end. Images are deleted after analysis per RA 10173 (Data Privacy Act).
      </div>

      <button
        disabled={!ready}
        onClick={() => onNext({ pwdFront: pwdFront.file, pwdBack: pwdBack?.file, supporting: supporting.file })}
        className="w-full py-3.5 rounded-xl font-bold text-sm transition-all
          disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
          bg-[#1a6b5c] text-white hover:bg-[#155a4d]"
      >
        Submit Documents →
      </button>
    </div>
  );
}