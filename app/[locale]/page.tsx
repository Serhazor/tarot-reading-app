"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { EN_TAROT_DECK } from "@/data/tarot/en";
import { RU_TAROT_DECK } from "@/data/tarot/ru";
import InterpretationPanel from "@/components/InterpretationPanel";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import QuestionPanel from "@/components/QuestionPanel";
import SpreadCard from "@/components/SpreadCard";
import { formatDateTime } from "@/lib/format";
import { COPY } from "@/lib/ui-copy";
import {
  buildSpreadReadingText,
  getExpiryText,
  hydrateReading,
  isStoredSpreadReading,
  serializeReading,
} from "@/lib/spread";
import {
  createSpreadReading,
  getOrientationLabel,
  getStorageKey,
  type PeriodValue,
  type SpreadCard as SpreadCardType,
  type SupportedLocale,
} from "@/lib/tarot";

type AiReading = {
  title: string;
  interpretation: string;
  advice: string;
  caution: string;
  truthNote: string;
};

type RitualStatus = {
  title: string;
  message: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Page() {
  const locale = useLocale();
  const currentLocale: SupportedLocale = locale === "ru" ? "ru" : "en";
  const ui = COPY[currentLocale];

  const deck = useMemo(
    () => (currentLocale === "ru" ? RU_TAROT_DECK : EN_TAROT_DECK),
    [currentLocale]
  );

  const [period, setPeriod] = useState<PeriodValue>("day");
  const [truthReading, setTruthReading] = useState<any | null>(null);
  const [latestReading, setLatestReading] = useState<any | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const [question, setQuestion] = useState("");
  const [aiReading, setAiReading] = useState<AiReading | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState("");
  const [ritualStatus, setRitualStatus] = useState<RitualStatus | null>(null);

  const interpretationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(getStorageKey(period));

    if (!raw) {
      setTruthReading(null);
      setLatestReading(null);
      setAiReading(null);
      setAiError("");
      setRitualStatus(null);
      setIsHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as unknown;

      if (!isStoredSpreadReading(parsed)) {
        setTruthReading(null);
        setLatestReading(null);
      } else {
        const hydrated = hydrateReading(parsed, deck);
        setTruthReading(hydrated);
        setLatestReading(hydrated);
      }
    } catch {
      setTruthReading(null);
      setLatestReading(null);
    }

    setAiReading(null);
    setAiError("");
    setRitualStatus(null);
    setIsHydrated(true);
  }, [period, deck]);

  useEffect(() => {
    if (isLoadingAi || aiReading || aiError) {
      const timer = window.setTimeout(() => {
        interpretationRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);

      return () => window.clearTimeout(timer);
    }
  }, [isLoadingAi, aiReading, aiError]);

  function clearResultState() {
    setAiReading(null);
    setAiError("");
    setRitualStatus(null);
  }

  function resetCurrentWindow() {
    const key = getStorageKey(period);
    window.localStorage.removeItem(key);
    setTruthReading(null);
    setLatestReading(null);
    clearResultState();
  }

  function scrollToInterpretation() {
    interpretationRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function requestInterpretationWithRetry(reading: any) {
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      if (attempt > 1) {
        setRitualStatus({
          title: ui.statusRetryingTitle,
          message: ui.statusRetryingMessage(attempt, maxAttempts),
        });
        await sleep(900);
      }

      try {
        const response = await fetch("/api/tarot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            cards: reading.cards.map((card: SpreadCardType) => ({
              name: card.name,
              type:
                currentLocale === "ru"
                  ? card.type === "Major Arcana"
                    ? "Старший аркан"
                    : "Младший аркан"
                  : card.type,
              suit: card.suit,
              orientation: getOrientationLabel(card.orientation, currentLocale),
              interpretation: card.interpretation,
              position: ui.positionLabels[card.position],
            })),
            isTrueReading: reading.isTrueReading,
            period,
            locale: currentLocale,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to interpret reading.");
        }

        return data as AiReading;
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }
      }
    }

    throw new Error("Failed to interpret reading.");
  }

  async function handleDrawAndInterpret() {
    if (!question.trim()) return;

    clearResultState();
    setIsLoadingAi(true);

    try {
      setRitualStatus({
        title: ui.statusShufflingTitle,
        message: ui.statusShufflingMessage,
      });

      await sleep(450);

      const key = getStorageKey(period);
      const saved = window.localStorage.getItem(key);

      let activeReading = null;

      if (saved) {
        try {
          const parsed = JSON.parse(saved) as unknown;
          if (isStoredSpreadReading(parsed)) {
            activeReading = hydrateReading(parsed, deck);
          }
        } catch {
          activeReading = null;
        }
      }

      if (activeReading) {
        setTruthReading(activeReading);
        setLatestReading(activeReading);

        setRitualStatus({
          title: ui.statusUsingSavedTitle,
          message: ui.statusUsingSavedMessage,
        });

        await sleep(500);
      } else {
        activeReading = createSpreadReading(deck, true);
        window.localStorage.setItem(
          key,
          JSON.stringify(serializeReading(activeReading))
        );
        setTruthReading(activeReading);
        setLatestReading(activeReading);

        setRitualStatus({
          title: ui.statusCardsDrawnTitle,
          message: ui.statusCardsDrawnMessage,
        });

        await sleep(650);
      }

      setRitualStatus({
        title: ui.statusStudyingTitle,
        message: ui.statusStudyingMessage,
      });

      const data = await requestInterpretationWithRetry(activeReading);
      setAiReading(data);
      setRitualStatus(null);
    } catch (error) {
      setAiError(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setRitualStatus(null);
    } finally {
      setIsLoadingAi(false);
    }
  }

  const currentPeriodMeta = ui.periods[period];
  const showReflectiveNotice = !!latestReading && !latestReading.isTrueReading;
  const shouldShowJumpButton = isLoadingAi || !!aiReading || !!aiError;

  return (
    <main className="min-h-screen overflow-hidden bg-[#070612] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.25),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(34,211,238,0.14),_transparent_24%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 lg:px-10">
        <section className="mb-8 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <LanguageSwitcher />
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {ui.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                {ui.intro}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 shadow-xl">
              <div className="mb-3 text-sm font-medium text-white/80">
                {ui.readingRuleTitle}
              </div>
              <p className="text-sm leading-6 text-white/65">
                {ui.readingRuleText}
              </p>
              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                {ui.currentSetting}:{" "}
                <span className="font-semibold">{currentPeriodMeta.label}</span>.{" "}
                {ui.staysLocked} {getExpiryText(period, ui)}.
              </div>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <QuestionPanel
            title={ui.askQuestion}
            question={question}
            placeholder={ui.questionPlaceholder}
            helpText={!latestReading ? ui.flowNoSpread : ui.flowHasSpread}
            onQuestionChange={(value) => {
              setQuestion(value);
              clearResultState();
            }}
            periodTitle={ui.truthWindow}
            periodDescription={ui.truthWindowText}
            periodLockedHint={ui.truthWindowLockedHint}
            periods={ui.periods}
            selectedPeriod={period}
            onSelectPeriod={(nextPeriod) => {
              setPeriod(nextPeriod);
              clearResultState();
            }}
            periodEnabled={!!question.trim()}
            primaryButtonText={
              isLoadingAi ? ui.generating : ui.drawAndInterpret
            }
            onPrimaryAction={handleDrawAndInterpret}
            canPrimaryAction={!!question.trim() && !isLoadingAi}
            showJumpButton={shouldShowJumpButton}
            jumpButtonText={ui.jumpToInterpretation}
            onJump={scrollToInterpretation}
            status={ritualStatus}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                {ui.storedTrueSpread}
              </div>
              {truthReading ? (
                <>
                  <div className="mt-3 space-y-2">
                    {truthReading.cards.map((card: SpreadCardType) => (
                      <div
                        key={`${card.position}-${card.id}`}
                        className="text-sm text-white/80"
                      >
                        <span className="font-semibold">
                          {ui.positionLabels[card.position]}:
                        </span>{" "}
                        {card.name} ({getOrientationLabel(card.orientation, currentLocale)})
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-sm leading-6 text-white/65">
                    {ui.drawn} {formatDateTime(truthReading.drawnAt, currentLocale)}
                  </div>

                  <button
                    type="button"
                    onClick={resetCurrentWindow}
                    className="mt-4 rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/5"
                  >
                    {ui.resetWindow}
                  </button>
                </>
              ) : (
                <p className="mt-3 text-sm leading-6 text-white/55">
                  {ui.noTrueSpread}
                </p>
              )}
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl lg:p-6">
            <InterpretationPanel
              ref={interpretationRef}
              isLoading={isLoadingAi}
              error={aiError}
              reading={aiReading}
              loadingTitle={ritualStatus?.title ?? ui.interpretationInProgress}
              loadingText={ritualStatus?.message ?? ui.interpretationLoading}
              loadingSpinnerText={ui.interpretationGenerating}
              stayButtonText={ui.stayOnInterpretation}
              adviceLabel={ui.adviceLabel}
              cautionLabel={ui.cautionLabel}
              onStay={scrollToInterpretation}
            />

            {!isHydrated ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-[28px] border border-white/10 bg-black/20 text-white/60">
                {ui.loadingPaperwork}
              </div>
            ) : !latestReading ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-black/20 px-8 text-center">
                <div className="mb-4 flex gap-3">
                  {(["Situation", "Challenge", "Advice"] as const).map(
                    (position) => (
                      <div
                        key={position}
                        className="h-20 w-14 rounded-2xl border border-fuchsia-400/20 bg-gradient-to-b from-fuchsia-500/15 to-sky-500/10 shadow-[0_0_40px_rgba(168,85,247,0.12)]"
                      />
                    )
                  )}
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  {ui.noSpreadDrawn}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
                  {ui.noSpreadText}
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div
                  className={`rounded-[24px] border px-5 py-4 ${
                    latestReading.isTrueReading
                      ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-50"
                      : "border-amber-400/20 bg-amber-500/10 text-amber-50"
                  }`}
                >
                  <div className="text-sm font-semibold uppercase tracking-[0.18em]">
                    {latestReading.isTrueReading
                      ? ui.trueSpread
                      : ui.reflectiveOnly}
                  </div>
                  <p className="mt-2 text-sm leading-6 opacity-90">
                    {latestReading.isTrueReading
                      ? ui.trueSpreadText(period)
                      : ui.reflectiveSpreadText(period)}
                  </p>
                </div>

                {showReflectiveNotice && truthReading && (
                  <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 px-5 py-4 text-fuchsia-50">
                    <div className="text-sm font-semibold uppercase tracking-[0.18em]">
                      {ui.originalStillStands}
                    </div>
                    <p className="mt-2 text-sm leading-6 opacity-90">
                      {ui.originalStillStandsText}
                    </p>
                  </div>
                )}

                <div className="grid gap-5 lg:grid-cols-3">
                  {latestReading.cards.map((card: SpreadCardType) => (
                    <SpreadCard
                      key={`${card.position}-${card.id}-${card.orientation}`}
                      card={card}
                      locale={currentLocale}
                      positionLabel={ui.positionLabels[card.position]}
                      meaningLabel={ui.meaning}
                    />
                  ))}
                </div>

                <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                    {ui.fullSpreadReading}
                  </div>
                  <p className="mt-3 text-base leading-8 text-white/80">
                    {buildSpreadReadingText(
                      latestReading.cards,
                      latestReading.isTrueReading,
                      period,
                      currentLocale,
                      ui
                    )}
                  </p>
                  <p className="mt-4 text-xs text-white/45">
                    {ui.drawn} {formatDateTime(latestReading.drawnAt, currentLocale)}
                  </p>
                </div>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}