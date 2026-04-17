"use client";

import {
  getArcanaTypeLabel,
  getOrientationLabel,
  type SpreadCard as SpreadCardType,
  type SupportedLocale,
} from "@/lib/tarot";

type Props = {
  card: SpreadCardType;
  locale: SupportedLocale;
  positionLabel: string;
  meaningLabel: string;
};

function cardAccent(type: SpreadCardType["type"]) {
  return type === "Major Arcana"
    ? "from-fuchsia-500/30 via-violet-500/20 to-indigo-500/30"
    : "from-cyan-500/25 via-sky-500/10 to-emerald-500/20";
}

export default function SpreadCard({
  card,
  locale,
  positionLabel,
  meaningLabel,
}: Props) {
  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${cardAccent(
        card.type
      )} p-[1px] shadow-2xl`}
    >
      <div className="flex h-full min-h-[340px] flex-col justify-between rounded-[27px] bg-[#0b0b16]/95 p-6">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/90">
            {positionLabel}
          </div>
          <div className="mt-3 text-xs uppercase tracking-[0.24em] text-white/45">
            {getArcanaTypeLabel(card.type, locale)}
          </div>
          <div className="mt-4 text-2xl font-semibold leading-tight text-white">
            {card.name}
          </div>
          <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            {getOrientationLabel(card.orientation, locale)}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/45">
              {meaningLabel}
            </div>
            <p className="mt-2 text-sm leading-6 text-white/75">
              {card.interpretation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}