// components/ui/HorizontalRule.tsx

interface HorizontalRuleProps {
  label?: string;
  className?: string;
  glow?: boolean; // optional subtle glow accent
}

export default function HorizontalRule({ label, className = "", glow = false }: HorizontalRuleProps) {
  return (
    <div
      className={`relative flex items-center justify-center w-full my-6 ${className}`}
    >
      {/* Gradient line */}
      <div
        className={`absolute left-0 right-0 h-[1px] ${
          glow
            ? "bg-gradient-to-r from-transparent via-rose-500/70 to-transparent blur-[0.5px]"
            : "bg-gradient-to-r from-transparent via-gray-400/50 to-transparent"
        }`}
      />

      {label && (
        <span
          className={`relative z-10 px-4 text-sm font-semibold tracking-wide ${
            glow
              ? "bg-white/90 dark:bg-gray-900/90 text-rose-600 dark:text-rose-400 shadow-sm rounded-full"
              : "bg-white/90 dark:bg-gray-900/90 text-gray-600 dark:text-gray-300"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}
