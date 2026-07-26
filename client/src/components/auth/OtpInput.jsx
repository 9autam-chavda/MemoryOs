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
    <div className="flex justify-center gap-2">
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
          aria-label={`Verification digit ${index + 1}`}
          className="ui-input h-12 w-12 rounded-xl p-0 text-center text-lg font-semibold"
        />
      ))}
    </div>
  );
}

export default OtpInput;
