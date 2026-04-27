"use client";

import type { PeriodValue } from "@/lib/tarot";

type RitualStatus = {
  title: string;
  message: string;
};

type Props = {
  title: string;
  question: string;
  placeholder: string;
  helpText: string;
  onQuestionChange: (value: string) => void;
  periodTitle: string;
  periodDescription: string;
  periodLockedHint: string;
  periods: Record<PeriodValue, { label: string; helper: string }>;
  selectedPeriod: PeriodValue;
  onSelectPeriod: (period: PeriodValue) => void;
  periodEnabled: boolean;
  primaryButtonText: string;
  onPrimaryAction: () => void;
  canPrimaryAction: boolean;
  showJumpButton: boolean;
  jumpButtonText: string;
  onJump: () => void;
  status: RitualStatus | null;
};

export default function QuestionPanel({
  title,
  question,
  placeholder,
  helpText,
  onQuestionChange,
  periodTitle,
  periodDescription,
  periodLockedHint,
  periods,
  selectedPeriod,
  onSelectPeriod,
  periodEnabled,
  primaryButtonText,
  onPrimaryAction,
  canPrimaryAction,
  showJumpButton,
  jumpButtonText,
  onJump,
  status,
}: Props) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
      <div className="text-xs uppercase tracking-[0.2em] text-white/45">
        {title}
      </div>

      <textarea
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
        placeholder={placeholder}
        className="mt-3 min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35"
      />

      <div className="mt-5 border-t border-white/10 pt-5">
        <div className="text-xs uppercase tracking-[0.2em] text-white/45">
          {periodTitle}
        </div>
        <p className="mt-2 text-sm leading-6 text-white/55">
          {periodEnabled ? periodDescription : periodLockedHint}
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {(Object.keys(periods) as PeriodValue[]).map((item) => {
            const active = selectedPeriod === item;
            const meta = periods[item];

            return (
              <button
                key={item}
                type="button"
                disabled={!periodEnabled}
                onClick={() => onSelectPeriod(item)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  active
                    ? "border-fuchsia-400/30 bg-fuchsia-500/15 shadow-lg shadow-fuchsia-950/40"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                } disabled:cursor-not-allowed disabled:opacity-45`}
              >
                <div className="text-sm font-semibold text-white">
                  {meta.label}
                </div>
                <div className="mt-1 text-xs leading-5 text-white/55">
                  {meta.helper}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 text-sm text-white/55">{helpText}</div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!canPrimaryAction}
          onClick={onPrimaryAction}
          className="rounded-2xl bg-fuchsia-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {primaryButtonText}
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

      {status && (
        <div className="mt-5 rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-4">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-100">
            {status.title}
          </div>
          <p className="mt-2 text-sm leading-6 text-white/80">
            {status.message}
          </p>
        </div>
      )}
    </div>
  );
}