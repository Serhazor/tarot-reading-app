"use client";

import { useEffect, useMemo, useState } from "react";

type PeriodValue = "hour" | "day" | "week" | "month";
type ReadingOrientation = "Upright" | "Reversed";
type ArcanaType = "Major Arcana" | "Minor Arcana";

type TarotCard = {
  name: string;
  type: ArcanaType;
  suit?: string;
  upright: string;
  reversed: string;
};

type Reading = TarotCard & {
  orientation: ReadingOrientation;
  interpretation: string;
  drawnAt: string;
  isTrueReading: boolean;
  readingText: string;
};

type AiReading = {
  title: string;
  interpretation: string;
  advice: string;
  caution: string;
  truthNote: string;
};

type MinorRankKey =
  | "ace"
  | "two"
  | "three"
  | "four"
  | "five"
  | "six"
  | "seven"
  | "eight"
  | "nine"
  | "ten"
  | "page"
  | "knight"
  | "queen"
  | "king";

type SuitTheme = {
  area: string;
} & Record<MinorRankKey, string>;

const MAJOR_ARCANA: TarotCard[] = [
  {
    name: "The Fool",
    type: "Major Arcana",
    upright: "A fresh start, trust, freedom, and stepping into the unknown.",
    reversed:
      "Carelessness, delay, or refusing a leap that life is clearly asking for.",
  },
  {
    name: "The Magician",
    type: "Major Arcana",
    upright: "Focus, skill, personal power, and turning intent into action.",
    reversed:
      "Scattered energy, self-doubt, or using influence in the wrong way.",
  },
  {
    name: "The High Priestess",
    type: "Major Arcana",
    upright: "Intuition, hidden knowledge, quiet power, and inner truth.",
    reversed:
      "Ignoring your intuition, confusion, or refusing to listen inward.",
  },
  {
    name: "The Empress",
    type: "Major Arcana",
    upright: "Abundance, creativity, nurture, softness, and growth.",
    reversed:
      "Smothering energy, creative block, or neglecting your own needs.",
  },
  {
    name: "The Emperor",
    type: "Major Arcana",
    upright: "Structure, leadership, authority, and strong boundaries.",
    reversed: "Rigidity, control problems, or weak leadership.",
  },
  {
    name: "The Hierophant",
    type: "Major Arcana",
    upright: "Tradition, learning, guidance, ritual, and shared wisdom.",
    reversed: "Dogma, empty rules, or rebellion without purpose.",
  },
  {
    name: "The Lovers",
    type: "Major Arcana",
    upright: "Connection, alignment, love, and meaningful choice.",
    reversed: "Misalignment, tension, or a choice made against your values.",
  },
  {
    name: "The Chariot",
    type: "Major Arcana",
    upright: "Drive, control, momentum, and determined movement.",
    reversed: "Lack of direction, inner conflict, or stalled progress.",
  },
  {
    name: "Strength",
    type: "Major Arcana",
    upright: "Courage, patience, steady confidence, and inner strength.",
    reversed: "Self-doubt, fear, or trying to force what should be guided.",
  },
  {
    name: "The Hermit",
    type: "Major Arcana",
    upright: "Reflection, solitude, insight, and searching for truth.",
    reversed: "Isolation, withdrawal, or avoiding the deeper lesson.",
  },
  {
    name: "Wheel of Fortune",
    type: "Major Arcana",
    upright: "Cycles, timing, fate, and change already in motion.",
    reversed: "Resistance to change, repetition, or bad timing.",
  },
  {
    name: "Justice",
    type: "Major Arcana",
    upright: "Truth, balance, accountability, and clear cause and effect.",
    reversed: "Bias, denial, dishonesty, or avoiding consequences.",
  },
  {
    name: "The Hanged Man",
    type: "Major Arcana",
    upright: "Pause, surrender, and seeing things from a new angle.",
    reversed: "Stagnation, needless delay, or resisting perspective change.",
  },
  {
    name: "Death",
    type: "Major Arcana",
    upright: "An ending, transformation, release, and real change.",
    reversed: "Clinging to the past or delaying a necessary ending.",
  },
  {
    name: "Temperance",
    type: "Major Arcana",
    upright: "Balance, integration, patience, and calm adjustment.",
    reversed: "Excess, impatience, or lack of harmony.",
  },
  {
    name: "The Devil",
    type: "Major Arcana",
    upright: "Attachment, obsession, temptation, and unhealthy patterns.",
    reversed: "Breaking free, seeing the trap, or loosening a harmful bond.",
  },
  {
    name: "The Tower",
    type: "Major Arcana",
    upright: "Sudden truth, disruption, collapse of illusion, and shock.",
    reversed:
      "Delayed upheaval, internal chaos, or trying to dodge the inevitable.",
  },
  {
    name: "The Star",
    type: "Major Arcana",
    upright: "Hope, healing, renewal, and faith after difficulty.",
    reversed: "Discouragement, doubt, or struggling to trust the future.",
  },
  {
    name: "The Moon",
    type: "Major Arcana",
    upright: "Mystery, uncertainty, dreams, and emotional fog.",
    reversed:
      "Confusion lifting, a hidden truth appearing, or fear distorting reality.",
  },
  {
    name: "The Sun",
    type: "Major Arcana",
    upright: "Clarity, success, joy, vitality, and open truth.",
    reversed: "Temporary clouds, reduced confidence, or blocked optimism.",
  },
  {
    name: "Judgement",
    type: "Major Arcana",
    upright: "Awakening, reckoning, honesty, and answering a calling.",
    reversed: "Self-judgment, denial, or ignoring what needs to change.",
  },
  {
    name: "The World",
    type: "Major Arcana",
    upright:
      "Completion, wholeness, fulfillment, and arriving at a milestone.",
    reversed: "Loose ends, incompletion, or difficulty closing a chapter.",
  },
];

const SUIT_THEMES: Record<string, SuitTheme> = {
  Wands: {
    area: "energy, ambition, movement, and creative drive",
    ace: "A spark of momentum or inspiration appears.",
    two: "A choice about direction or future action is forming.",
    three: "Progress begins to show and momentum builds.",
    four: "Stability, celebration, and grounded progress appear.",
    five: "Friction, competition, or ego clashes create pressure.",
    six: "Recognition, confidence, and forward motion increase.",
    seven: "You are being tested to hold your ground.",
    eight: "Things move fast and require focus.",
    nine: "Resilience matters more than comfort right now.",
    ten: "Burden, overwork, or too much responsibility needs attention.",
    page: "New passion, curiosity, or creative energy is waking up.",
    knight: "Bold motion is present, but direction matters.",
    queen: "Confidence, magnetism, and creative authority rise.",
    king: "Leadership, vision, and decisive action dominate.",
  },
  Cups: {
    area: "emotion, relationships, intuition, and connection",
    ace: "The heart opens to new feeling, healing, or connection.",
    two: "Mutual attraction, harmony, or partnership is highlighted.",
    three: "Support, friendship, or shared joy is close by.",
    four: "Emotional withdrawal or dissatisfaction asks for honesty.",
    five: "Loss is visible, but not everything is gone.",
    six: "Memory, tenderness, or the past influences the present.",
    seven: "Fantasy, options, or emotional fog complicate choice.",
    eight: "Walking away becomes necessary for growth.",
    nine: "Contentment or a longed-for emotional outcome is near.",
    ten: "Deep harmony, belonging, or emotional fulfillment is emphasized.",
    page: "Sensitivity, emotional openness, or a tender message appears.",
    knight: "Romance, charm, or heartfelt pursuit moves forward.",
    queen: "Deep intuition and emotional maturity guide the moment.",
    king: "Compassion with steadiness creates real wisdom.",
  },
  Swords: {
    area: "thought, truth, conflict, and communication",
    ace: "Clarity cuts through uncertainty.",
    two: "A difficult choice or stalemate remains unresolved.",
    three: "Pain, separation, or hard truth demands attention.",
    four: "Rest, retreat, or recovery is needed.",
    five: "Conflict, ego, or hollow victory leaves a cost.",
    six: "A transition away from mental strain is underway.",
    seven: "Strategy, secrecy, or self-protection is in play.",
    eight: "Restriction may be more mental than absolute.",
    nine: "Anxiety, guilt, or spiraling thoughts cloud judgment.",
    ten: "A harsh ending clears the ground for something else.",
    page: "Vigilance, curiosity, and sharp observation grow.",
    knight: "Speed, force, and decisive words arrive quickly.",
    queen: "Clear boundaries and honest discernment matter most.",
    king: "Logic, authority, and measured truth lead the way.",
  },
  Pentacles: {
    area: "work, money, health, home, and material stability",
    ace: "A practical opportunity or tangible beginning appears.",
    two: "Balance, adaptation, and resource management are needed.",
    three: "Skill, teamwork, and craft create progress.",
    four: "Security helps, but clinging too tightly can limit growth.",
    five: "Scarcity, strain, or feeling unsupported is present.",
    six: "Exchange, generosity, or fairness comes into focus.",
    seven: "Patience and long-term effort are being tested.",
    eight: "Discipline, repetition, and focused work build mastery.",
    nine: "Independence, comfort, and earned results are visible.",
    ten: "Legacy, long-term security, and family foundations matter.",
    page: "Steady growth, study, or practical curiosity begins.",
    knight: "Consistency, reliability, and patient work win out.",
    queen: "Grounded care and practical abundance support you.",
    king: "Stability, stewardship, and material command take the lead.",
  },
};

const MINOR_RANKS: { label: string; key: MinorRankKey }[] = [
  { label: "Ace", key: "ace" },
  { label: "Two", key: "two" },
  { label: "Three", key: "three" },
  { label: "Four", key: "four" },
  { label: "Five", key: "five" },
  { label: "Six", key: "six" },
  { label: "Seven", key: "seven" },
  { label: "Eight", key: "eight" },
  { label: "Nine", key: "nine" },
  { label: "Ten", key: "ten" },
  { label: "Page", key: "page" },
  { label: "Knight", key: "knight" },
  { label: "Queen", key: "queen" },
  { label: "King", key: "king" },
];

const PERIODS: { value: PeriodValue; label: string; helper: string }[] = [
  {
    value: "hour",
    label: "1 hour",
    helper: "Only the first reading this hour counts as true.",
  },
  {
    value: "day",
    label: "1 day",
    helper: "Only the first reading today counts as true.",
  },
  {
    value: "week",
    label: "1 week",
    helper: "Only the first reading this week counts as true.",
  },
  {
    value: "month",
    label: "1 month",
    helper: "Only the first reading this month counts as true.",
  },
];

function buildMinorArcana(): TarotCard[] {
  return Object.entries(SUIT_THEMES).flatMap(([suit, theme]) =>
    MINOR_RANKS.map((rank) => ({
      name: `${rank.label} of ${suit}`,
      type: "Minor Arcana" as const,
      suit,
      upright: `${theme[rank.key]} This card usually speaks about ${theme.area}.`,
      reversed: `The energy here is blocked, delayed, distorted, or overdone. The issue likely sits in ${theme.area}.`,
    }))
  );
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function getISOWeek(date: Date) {
  const temp = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const day = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((temp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );

  return { year: temp.getUTCFullYear(), week: weekNo };
}

function getPeriodBucket(period: PeriodValue, now = new Date()) {
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hour = pad(now.getHours());

  if (period === "hour") return `${year}-${month}-${day}-${hour}`;
  if (period === "day") return `${year}-${month}-${day}`;
  if (period === "month") return `${year}-${month}`;

  const { year: isoYear, week } = getISOWeek(now);
  return `${isoYear}-W${pad(week)}`;
}

function getStorageKey(period: PeriodValue) {
  return `tarot-mvp:${period}:${getPeriodBucket(period)}`;
}

function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function drawRandomCard(deck: TarotCard[]) {
  return deck[randomInt(deck.length)];
}

function buildReadingText(
  card: TarotCard,
  isTrueReading: boolean,
  orientation: ReadingOrientation,
  period: PeriodValue
) {
  const truthIntro = isTrueReading
    ? `This is your first reading for the selected ${period}, so the app treats it as your true reading.`
    : `This is not your first reading for the selected ${period}, so treat it as reflection only, not the true reading.`;

  const typeText =
    card.type === "Major Arcana"
      ? "Major Arcana usually points to a stronger life lesson, larger pattern, or a bigger turning point."
      : `${card.suit} usually relates to ${SUIT_THEMES[card.suit ?? ""].area}.`;

  const interpretation =
    orientation === "Upright" ? card.upright : card.reversed;

  return `${truthIntro} ${typeText} ${interpretation}`;
}

function createReading(
  deck: TarotCard[],
  isTrueReading: boolean,
  period: PeriodValue
): Reading {
  const card = drawRandomCard(deck);
  const orientation: ReadingOrientation =
    Math.random() < 0.35 ? "Reversed" : "Upright";
  const interpretation =
    orientation === "Upright" ? card.upright : card.reversed;

  return {
    ...card,
    orientation,
    interpretation,
    drawnAt: new Date().toISOString(),
    isTrueReading,
    readingText: buildReadingText(card, isTrueReading, orientation, period),
  };
}

function getExpiryText(period: PeriodValue) {
  if (period === "hour") return "until the hour changes";
  if (period === "day") return "until tomorrow";
  if (period === "week") return "until next week";
  return "until next month";
}

function cardAccent(type: TarotCard["type"]) {
  return type === "Major Arcana"
    ? "from-fuchsia-500/30 via-violet-500/20 to-indigo-500/30"
    : "from-cyan-500/25 via-sky-500/10 to-emerald-500/20";
}

export default function Page() {
  const deck = useMemo(() => [...MAJOR_ARCANA, ...buildMinorArcana()], []);
  const [period, setPeriod] = useState<PeriodValue>("day");
  const [truthReading, setTruthReading] = useState<Reading | null>(null);
  const [latestReading, setLatestReading] = useState<Reading | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const [question, setQuestion] = useState("");
  const [aiReading, setAiReading] = useState<AiReading | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(getStorageKey(period));
    const parsed = saved ? (JSON.parse(saved) as Reading) : null;

    setTruthReading(parsed);
    setLatestReading(parsed);
    setAiReading(null);
    setAiError("");
    setIsHydrated(true);
  }, [period]);

  function clearAiState() {
    setAiReading(null);
    setAiError("");
  }

  function drawTrueOrPersistedReading() {
    const key = getStorageKey(period);
    const saved = window.localStorage.getItem(key);

    clearAiState();

    if (saved) {
      const parsed = JSON.parse(saved) as Reading;
      setTruthReading(parsed);
      setLatestReading(parsed);
      return;
    }

    const firstReading = createReading(deck, true, period);
    window.localStorage.setItem(key, JSON.stringify(firstReading));
    setTruthReading(firstReading);
    setLatestReading(firstReading);
  }

  function drawReflectiveReading() {
    clearAiState();
    const reflective = createReading(deck, false, period);
    setLatestReading(reflective);
  }

  function resetCurrentWindow() {
    window.localStorage.removeItem(getStorageKey(period));
    setTruthReading(null);
    setLatestReading(null);
    setQuestion("");
    clearAiState();
  }

  async function generateAiInterpretation() {
    if (!latestReading || !question.trim()) return;

    setIsLoadingAi(true);
    setAiError("");
    setAiReading(null);

    try {
      const response = await fetch("/api/tarot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          card: {
            name: latestReading.name,
            type: latestReading.type,
            suit: latestReading.suit,
            orientation: latestReading.orientation,
            interpretation: latestReading.interpretation,
          },
          isTrueReading: latestReading.isTrueReading,
          period,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to interpret reading.");
      }

      setAiReading(data as AiReading);
    } catch (error) {
      setAiError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsLoadingAi(false);
    }
  }

  const currentPeriodMeta = PERIODS.find((item) => item.value === period)!;
  const showReflectiveNotice = !!latestReading && !latestReading.isTrueReading;

  return (
    <main className="min-h-screen overflow-hidden bg-[#070612] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.25),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(34,211,238,0.14),_transparent_24%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.12),_transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:44px_44px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-10 lg:px-10">
        <section className="mb-8 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-fuchsia-200">
                Text-only tarot MVP
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Tarot readings with one rule people will absolutely try to ignore
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                The first reading inside the selected time window is treated as
                the meaningful one. Any extra reading during that same window is
                shown as reflective only.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5 shadow-xl">
              <div className="mb-3 text-sm font-medium text-white/80">
                Reading rule
              </div>
              <p className="text-sm leading-6 text-white/65">
                Only the first reading in the chosen window counts as true.
                Every later draw in that same window is still visible, but
                clearly labeled as reflection only.
              </p>
              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                Current setting:{" "}
                <span className="font-semibold">
                  {currentPeriodMeta.label}
                </span>
                . It stays locked {getExpiryText(period)}.
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-5">
              <p className="text-sm font-medium text-white/85">Truth window</p>
              <p className="mt-1 text-sm leading-6 text-white/55">
                Let the user decide how long the first reading remains the only
                true one.
              </p>
            </div>

            <div className="grid gap-3">
              {PERIODS.map((item) => {
                const active = period === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setPeriod(item.value)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      active
                        ? "border-fuchsia-400/30 bg-fuchsia-500/15 shadow-lg shadow-fuchsia-950/40"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="text-sm font-semibold text-white">
                      {item.label}
                    </div>
                    <div className="mt-1 text-xs leading-5 text-white/55">
                      {item.helper}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={drawTrueOrPersistedReading}
                className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[0.99]"
              >
                {truthReading ? "Show my true reading" : "Draw my reading"}
              </button>

              <button
                type="button"
                onClick={drawReflectiveReading}
                className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Draw again anyway
              </button>

              <button
                type="button"
                onClick={resetCurrentWindow}
                className="rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/5"
              >
                Reset current window
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                Stored true reading
              </div>
              {truthReading ? (
                <>
                  <div className="mt-3 text-lg font-semibold text-white">
                    {truthReading.name}
                  </div>
                  <div className="mt-1 text-sm text-white/55">
                    {truthReading.orientation} • {truthReading.type}
                  </div>
                  <div className="mt-3 text-sm leading-6 text-white/65">
                    Saved {formatDateTime(truthReading.drawnAt)}
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm leading-6 text-white/55">
                  No true reading saved for this window yet.
                </p>
              )}
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl lg:p-6">
            {!isHydrated ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-[28px] border border-white/10 bg-black/20 text-white/60">
                Loading the cosmic paperwork...
              </div>
            ) : !latestReading ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-black/20 px-8 text-center">
                <div className="mb-4 h-20 w-14 rounded-2xl border border-fuchsia-400/20 bg-gradient-to-b from-fuchsia-500/15 to-sky-500/10 shadow-[0_0_40px_rgba(168,85,247,0.12)]" />
                <h2 className="text-2xl font-semibold text-white">
                  No card drawn yet
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/60">
                  Pick a time window and draw a card. The first one becomes the
                  true reading for that window. Any later draw is shown as
                  reflective only.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
                <div
                  className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${cardAccent(
                    latestReading.type
                  )} p-[1px] shadow-2xl`}
                >
                  <div className="flex h-full min-h-[380px] flex-col justify-between rounded-[27px] bg-[#0b0b16]/95 p-6">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-white/45">
                        {latestReading.type}
                      </div>
                      <div className="mt-4 text-3xl font-semibold leading-tight text-white">
                        {latestReading.name}
                      </div>
                      <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                        {latestReading.orientation}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                          Meaning
                        </div>
                        <p className="mt-2 text-sm leading-6 text-white/75">
                          {latestReading.interpretation}
                        </p>
                      </div>

                      <div className="text-xs text-white/45">
                        Drawn {formatDateTime(latestReading.drawnAt)}
                      </div>
                    </div>
                  </div>
                </div>

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
                        ? "True reading"
                        : "Reflective only"}
                    </div>
                    <p className="mt-2 text-sm leading-6 opacity-90">
                      {latestReading.isTrueReading
                        ? `This is the first reading in your selected ${period}, so the app treats it as the meaningful one.`
                        : `This is not the first reading in your selected ${period}. It is shown for reflection only and should not replace the original reading.`}
                    </p>
                  </div>

                  {showReflectiveNotice && truthReading && (
                    <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 px-5 py-4 text-fuchsia-50">
                      <div className="text-sm font-semibold uppercase tracking-[0.18em]">
                        Original true reading still stands
                      </div>
                      <p className="mt-2 text-sm leading-6 opacity-90">
                        Your true reading for this window remains{" "}
                        <span className="font-semibold">
                          {truthReading.name}
                        </span>{" "}
                        ({truthReading.orientation}). The current card is extra
                        reflection, not a replacement.
                      </p>
                    </div>
                  )}

                  <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                      Full reading
                    </div>
                    <p className="mt-3 text-base leading-8 text-white/80">
                      {latestReading.readingText}
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                      Ask your question
                    </div>

                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Type your question here..."
                      className="mt-3 min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35"
                    />

                    <button
                      type="button"
                      disabled={
                        !latestReading || !question.trim() || isLoadingAi
                      }
                      onClick={generateAiInterpretation}
                      className="mt-4 rounded-2xl bg-fuchsia-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoadingAi ? "Interpreting..." : "Interpret my reading"}
                    </button>
                  </div>

                  {aiError && (
                    <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {aiError}
                    </div>
                  )}

                  {aiReading && (
                    <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-5">
                      <div className="text-xl font-semibold text-white">
                        {aiReading.title}
                      </div>

                      <p className="mt-3 text-sm leading-7 text-white/80">
                        {aiReading.interpretation}
                      </p>

                      <p className="mt-3 text-sm leading-7 text-white/70">
                        <span className="font-semibold text-white">Advice:</span>{" "}
                        {aiReading.advice}
                      </p>

                      <p className="mt-3 text-sm leading-7 text-white/70">
                        <span className="font-semibold text-white">Caution:</span>{" "}
                        {aiReading.caution}
                      </p>

                      <p className="mt-4 text-sm leading-7 text-amber-200">
                        {aiReading.truthNote}
                      </p>
                    </div>
                  )}

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                        MVP features
                      </div>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-white/65">
                        <li>• Text-only tarot MVP using a generated 78-card deck.</li>
                        <li>• Local storage keeps the first reading per selected time window.</li>
                        <li>• Re-draws stay available, but are clearly marked as not true.</li>
                        <li>• AI can interpret the selected card against a typed question.</li>
                      </ul>
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
                      <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                        Next upgrades
                      </div>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-white/65">
                        <li>• Add card artwork and a flip animation.</li>
                        <li>• Add 3-card spreads for past, present, future.</li>
                        <li>• Save reading history in a lightweight backend.</li>
                        <li>• Add themes and social sharing.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}