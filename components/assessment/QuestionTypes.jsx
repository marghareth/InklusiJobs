// components/assessment/QuestionTypes.jsx
"use client";

// ── Single Select (radio) ────────────────────────────────────────────────────
export function SingleSelect({ question, value, onChange }) {
  return (
    <div className="ij-options" role="radiogroup" aria-labelledby={`q${question.id}-label`}>
      {question.options.map((opt) => {
        const selected = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`ij-option ${selected ? "selected" : ""}`}
            htmlFor={`q${question.id}-${opt.value}`}
          >
            <input
              type="radio"
              id={`q${question.id}-${opt.value}`}
              name={`q${question.id}`}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              className="ij-radio-input"
              aria-checked={selected}
            />
            <div className="ij-radio-custom" aria-hidden="true">
              {selected && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="ij-option-text">
              <span className="ij-option-label">{opt.label}</span>
              {opt.description && (
                <span className="ij-option-desc">{opt.description}</span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}

// ── Multi Select (checkbox) ─────────────────────────────────────────────────
export function MultiSelect({ question, value, onChange }) {
  value = Array.isArray(value) ? value : [];
  const maxSelect = question.maxSelect || Infinity;

  const toggle = (optValue) => {
    const isNoneOption = optValue === "none";
    let next;

    if (isNoneOption) {
      // If "none" is selected, clear everything else
      next = value.includes("none") ? [] : ["none"];
    } else {
      // Deselect "none" when any real option is picked
      const without = value.filter((v) => v !== "none");
      if (without.includes(optValue)) {
        next = without.filter((v) => v !== optValue);
      } else if (without.length >= maxSelect) {
        // Replace the last selected item when at max
        next = [...without.slice(0, maxSelect - 1), optValue];
      } else {
        next = [...without, optValue];
      }
    }
    onChange(next);
  };

  return (
    <div className="ij-options" role="group" aria-labelledby={`q${question.id}-label`}>
      {question.maxSelect && (
        <p className="ij-max-notice" aria-live="polite">
          {value.length}/{question.maxSelect} selected
        </p>
      )}
      {question.options.map((opt) => {
        const selected = value.includes(opt.value);
        const atMax = !selected && value.filter(v => v !== "none").length >= maxSelect && opt.value !== "none";
        return (
          <label
            key={opt.value}
            className={`ij-option ${selected ? "selected" : ""} ${atMax ? "dimmed" : ""}`}
            htmlFor={`q${question.id}-${opt.value}`}
          >
            <input
              type="checkbox"
              id={`q${question.id}-${opt.value}`}
              name={`q${question.id}`}
              value={opt.value}
              checked={selected}
              onChange={() => toggle(opt.value)}
              disabled={atMax}
              className="ij-radio-input"
              aria-checked={selected}
            />
            <div className="ij-check-custom" aria-hidden="true">
              {selected && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="ij-option-text">
              <span className="ij-option-label">{opt.label}</span>
              {opt.description && (
                <span className="ij-option-desc">{opt.description}</span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}

// ── Open Text ───────────────────────────────────────────────────────────────
export function OpenText({ question, value = "", onChange }) {
  const remaining = (question.maxLength || 300) - value.length;
  return (
    <div className="ij-text-wrapper">
      <textarea
        id={`q${question.id}-text`}
        aria-labelledby={`q${question.id}-label`}
        className="ij-textarea"
        placeholder={question.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={question.maxLength || 300}
        rows={4}
        aria-describedby={`q${question.id}-counter`}
      />
      <div
        id={`q${question.id}-counter`}
        className={`ij-char-count ${remaining < 30 ? "warning" : ""}`}
        aria-live="polite"
      >
        {remaining} characters remaining
      </div>
    </div>
  );
}

// ── Shared Styles ───────────────────────────────────────────────────────────
export function QuestionStyles() {
  return (
    <style jsx global>{`
      .ij-options {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        width: 100%;
      }

      .ij-max-notice {
        font-size: 0.78rem;
        color: #648FBF;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }

      .ij-radio-input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
        pointer-events: none;
      }

      .ij-option {
        display: flex;
        align-items: center;
        gap: 0.9rem;
        padding: 0.85rem 1.1rem;
        border: 2px solid #e4ecea;
        border-radius: 14px;
        cursor: pointer;
        background: white;
        transition: all 0.18s ease;
        user-select: none;
        -webkit-user-select: none;
        position: relative;
      }

      .ij-option:hover {
        border-color: #479880;
        background: #f5fbf9;
        transform: translateX(2px);
      }

      .ij-option.selected {
        border-color: #479880;
        background: linear-gradient(135deg, #f0faf7, #ebf7f8);
        box-shadow: 0 2px 12px rgba(71, 152, 128, 0.12);
      }

      .ij-option.dimmed {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .ij-option:focus-within {
        outline: 3px solid #479880;
        outline-offset: 2px;
      }

      .ij-radio-custom,
      .ij-check-custom {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 2px solid #c5d9d6;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.18s ease;
      }

      .ij-check-custom {
        border-radius: 6px;
      }

      .ij-option.selected .ij-radio-custom,
      .ij-option.selected .ij-check-custom {
        background: #479880;
        border-color: #479880;
      }

      .ij-option-text {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
        flex: 1;
      }

      .ij-option-label {
        font-size: 0.95rem;
        font-weight: 500;
        color: #1a2e2b;
        line-height: 1.3;
      }

      .ij-option-desc {
        font-size: 0.78rem;
        color: #6b8a87;
        font-weight: 400;
      }

      /* Textarea */
      .ij-text-wrapper {
        width: 100%;
      }

      .ij-textarea {
        width: 100%;
        padding: 1rem 1.1rem;
        border: 2px solid #e4ecea;
        border-radius: 14px;
        font-family: inherit;
        font-size: 0.95rem;
        color: #1a2e2b;
        resize: vertical;
        min-height: 120px;
        background: white;
        transition: border-color 0.2s ease;
        line-height: 1.6;
        box-sizing: border-box;
      }

      .ij-textarea:focus {
        outline: none;
        border-color: #479880;
        box-shadow: 0 0 0 3px rgba(71, 152, 128, 0.12);
      }

      .ij-textarea::placeholder {
        color: #a8bfbc;
      }

      .ij-char-count {
        text-align: right;
        font-size: 0.75rem;
        color: #7a9b97;
        margin-top: 0.4rem;
        font-weight: 500;
        transition: color 0.2s;
      }

      .ij-char-count.warning {
        color: #e07b54;
      }
    `}</style>
  );
}