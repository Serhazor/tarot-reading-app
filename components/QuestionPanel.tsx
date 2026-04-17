"use client";

type Props = {
  title: string;
  question: string;
  placeholder: string;
  helpText: string;
  buttonText: string;
  jumpButtonText: string;
  onQuestionChange: (value: string) => void;
  onInterpret: () => void;
  onJump: () => void;
  canInterpret: boolean;
  showJumpButton: boolean;
};

export default function QuestionPanel({
  title,
  question,
  placeholder,
  helpText,
  buttonText,
  jumpButtonText,
  onQuestionChange,
  onInterpret,
  onJump,
  canInterpret,
  showJumpButton,
}: Props) {
  return (
    <div className="mb-5 rounded-[24px] border border-white/10 bg-black/20 p-5">
      <div className="text-xs uppercase tracking-[0.2em] text-white/45">
        {title}
      </div>

      <textarea
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
        placeholder={placeholder}
        className="mt-3 min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35"
      />

      <div className="mt-3 text-sm text-white/55">{helpText}</div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!canInterpret}
          onClick={onInterpret}
          className="rounded-2xl bg-fuchsia-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {buttonText}
        </button>

        {showJumpButton && (
          <button
            type="button"
            onClick={onJump}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {jumpButtonText}
          </button>
        )}
      </div>
    </div>
  );
}