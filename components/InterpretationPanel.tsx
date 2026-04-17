"use client";

import { forwardRef } from "react";

type AiReading = {
  title: string;
  interpretation: string;
  advice: string;
  caution: string;
  truthNote: string;
};

type Props = {
  isLoading: boolean;
  error: string;
  reading: AiReading | null;
  loadingTitle: string;
  loadingText: string;
  loadingSpinnerText: string;
  stayButtonText: string;
  adviceLabel: string;
  cautionLabel: string;
  onStay: () => void;
};

const InterpretationPanel = forwardRef<HTMLDivElement, Props>(
  (
    {
      isLoading,
      error,
      reading,
      loadingTitle,
      loadingText,
      loadingSpinnerText,
      stayButtonText,
      adviceLabel,
      cautionLabel,
      onStay,
    },
    ref
  ) => {
    return (
      <div ref={ref} className="mb-5 space-y-4">
        {isLoading && (
          <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-5">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-100">
              {loadingTitle}
            </div>
            <p className="mt-2 text-sm leading-6 text-white/80">
              {loadingText}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span className="text-sm text-white/70">
                {loadingSpinnerText}
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {reading && (
          <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-xl font-semibold text-white">
                {reading.title}
              </div>
              <button
                type="button"
                onClick={onStay}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {stayButtonText}
              </button>
            </div>

            <p className="mt-3 text-sm leading-7 text-white/80">
              {reading.interpretation}
            </p>

            <p className="mt-3 text-sm leading-7 text-white/70">
              <span className="font-semibold text-white">{adviceLabel}:</span>{" "}
              {reading.advice}
            </p>

            <p className="mt-3 text-sm leading-7 text-white/70">
              <span className="font-semibold text-white">{cautionLabel}:</span>{" "}
              {reading.caution}
            </p>

            <p className="mt-4 text-sm leading-7 text-amber-200">
              {reading.truthNote}
            </p>
          </div>
        )}
      </div>
    );
  }
);

InterpretationPanel.displayName = "InterpretationPanel";

export default InterpretationPanel;