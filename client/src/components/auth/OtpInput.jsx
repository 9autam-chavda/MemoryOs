import { useRef } from "react";

function OtpInput({ value, onChange }) {
  const refs = useRef([]);

  const updateOtp = (index, digit) => {
    const otp = value.split("");

    otp[index] = digit;

    onChange(otp.join(""));
  };

  const handleChange = (index, e) => {
    const digit = e.target.value.replace(/\D/g, "");

    if (!digit) {
      updateOtp(index, "");
      return;
    }

    updateOtp(index, digit);

    if (index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !value[index] &&
      index > 0
    ) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    onChange(pasted);
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (refs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onPaste={handlePaste}
          onKeyDown={(e) =>
            handleKeyDown(index, e)
          }
          onChange={(e) =>
            handleChange(index, e)
          }
          className="h-14 w-14 rounded-2xl border border-zinc-700 bg-zinc-900 text-center text-xl font-semibold outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        />
      ))}
    </div>
  );
}

export default OtpInput;