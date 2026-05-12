"use client";

import { useRef, useCallback, type InputHTMLAttributes } from "react";

function formatPhone(raw: string): string {
  // strip non-digits
  let digits = raw.replace(/\D/g, "");

  // normalize: 8xxx → 7xxx
  if (digits.startsWith("8")) digits = "7" + digits.slice(1);
  // if starts with 9, prepend 7
  if (digits.length > 0 && digits[0] === "9") digits = "7" + digits;

  // cap at 11 digits (7 + 10)
  digits = digits.slice(0, 11);

  if (digits.length === 0) return "";
  if (digits.length <= 1) return "+7";
  if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
  if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
  if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
}

function rawDigits(formatted: string): string {
  return formatted.replace(/\D/g, "");
}

interface PhoneInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  value: string;
  onChange: (formatted: string) => void;
}

export function PhoneInput({ value, onChange, ...props }: PhoneInputProps) {
  const ref = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const raw = input.value;
      const formatted = formatPhone(raw);
      onChange(formatted);

      // restore cursor position intelligently
      requestAnimationFrame(() => {
        if (!ref.current) return;
        const digits = rawDigits(raw.slice(0, input.selectionStart ?? raw.length));
        // find cursor position in formatted string that matches digit count
        let digitsSeen = 0;
        let pos = 0;
        for (let i = 0; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) digitsSeen++;
          if (digitsSeen >= digits.length) {
            pos = i + 1;
            break;
          }
        }
        if (digits.length === 0) pos = formatted.length;
        ref.current.setSelectionRange(pos, pos);
      });
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // if backspace at position where prev char is formatting, skip back further
      if (e.key === "Backspace") {
        const input = e.currentTarget;
        const pos = input.selectionStart ?? 0;
        const sel = input.selectionEnd ?? 0;
        // prevent deleting the +7 prefix
        if (pos <= 2 && sel <= 2 && pos === sel) {
          e.preventDefault();
          return;
        }
      }
    },
    [],
  );

  const handleFocus = useCallback(() => {
    // auto-fill +7 on focus if empty
    if (!value) onChange("+7");
  }, [value, onChange]);

  return (
    <input
      ref={ref}
      type="tel"
      inputMode="tel"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      {...props}
    />
  );
}
