import React from "react";
import { User, Bot } from "lucide-react";

export default function Mantoauto({ mode: controlledMode, onChange, size = "md" }) {
  const [internal, setInternal] = React.useState(controlledMode || "automatic");
  const isControlled = controlledMode !== undefined;
  const mode = isControlled ? controlledMode : internal;

  React.useEffect(() => {
    if (isControlled) return;
    if (controlledMode) setInternal(controlledMode);
  }, [controlledMode, isControlled]);

  const toggle = () => {
    const next = mode === "automatic" ? "manual" : "automatic";
    if (!isControlled) setInternal(next);
    if (onChange) onChange(next);
  };

  const sizes = {
    sm: {
      track: "w-32 h-10",
      knob: "w-8 h-8",
      translate: "translate-x-[5.5rem]",
      text: "text-sm",
      textCenterOffset: "left-[1.5rem] right-auto",
      textCenterOffsetAuto: "right-[1.5rem] left-auto",
    },
    md: {
      track: "w-44 h-12",
      knob: "w-10 h-10",
      translate: "translate-x-[7.75rem]",
      text: "text-base",
      textCenterOffset: "left-[2rem] right-auto",
      textCenterOffsetAuto: "right-[2rem] left-auto",
    },
    lg: {
      track: "w-56 h-14",
      knob: "w-12 h-12",
      translate: "translate-x-[9.75rem]",
      text: "text-lg",
      textCenterOffset: "left-[2.5rem] right-auto",
      textCenterOffsetAuto: "right-[2.5rem] left-auto",
    },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 font-poppins">
      <div className="flex flex-col items-center gap-4">

        <button
          type="button"
          role="switch"
          aria-checked={mode === "automatic"}
          onClick={toggle}
          className={`
            relative flex items-center p-1 cursor-pointer rounded-full transition-all duration-300 ease-in-out
            ${s.track}
            bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-500 shadow-xl border-2 border-emerald-400
            focus:outline-none focus:ring-4 focus:ring-green-200 hover:scale-105
          `}
        >
          <span
            className={`
              absolute flex items-center justify-center h-full
              ${s.text} font-semibold font-poppins uppercase tracking-wide text-green-50 drop-shadow-md
              transition-opacity duration-300 ease-in-out
              ${mode === "automatic" ? s.textCenterOffset : "opacity-0 pointer-events-none"}
            `}
          >
            Manual
          </span>

          <span
            className={`
              absolute flex items-center justify-center h-full
              ${s.text} font-semibold font-poppins uppercase tracking-wide text-green-50 drop-shadow-md
              transition-opacity duration-300 ease-in-out
              ${mode === "manual" ? s.textCenterOffsetAuto : "opacity-0 pointer-events-none"}
            `}
          >
            Auto
          </span>

          <span
            className={`
              relative z-10 flex items-center justify-center bg-white rounded-full shadow-lg
              transform transition-transform duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)
              ${s.knob}
              ${mode === "automatic" ? s.translate : "translate-x-0"}
            `}
          >
            {mode === "automatic" ? (
              <Bot className="w-4/5 h-4/5 text-green-600" />
            ) : (
              <User className="w-4/5 h-4/5 text-slate-700" />
            )}
          </span>
        </button>

        <span className="text-lg font-semibold text-slate-600 font-poppins tracking-wide">
          System Mode: <span className="text-green-700 font-bold">{mode === "automatic" ? "AI Control" : "Manual Control"}</span>
        </span>
      </div>
    </div>
  );
}
