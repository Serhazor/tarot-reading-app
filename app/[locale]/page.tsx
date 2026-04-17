"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";

type SupportedLocale = "en" | "ru";
type PeriodValue = "hour" | "day" | "week" | "month";
type ReadingOrientation = "Upright" | "Reversed";
type ArcanaType = "Major Arcana" | "Minor Arcana";
type SpreadPosition = "Situation" | "Challenge" | "Advice";

type TarotCard = {
  name: string;
  type: ArcanaType;
  suit?: string;
  upright: string;
  reversed: string;
};

type SpreadCard = TarotCard & {
  orientation: ReadingOrientation;
  interpretation: string;
  position: SpreadPosition;
};

type SpreadReading = {
  cards: SpreadCard[];
  drawnAt: string;
  isTrueReading: boolean;
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

type UiCopy = {
  title: string;
  intro: string;
  readingRuleTitle: string;
  readingRuleText: string;
  currentSetting: string;
  staysLocked: string;
  truthWindow: string;
  truthWindowText: string;
  drawSpread: string;
  showTrueSpread: string;
  drawAnother: string;
  resetWindow: string;
  storedTrueSpread: string;
  noTrueSpread: string;
  askQuestion: string;
  questionPlaceholder: string;
  flowNoSpread: string;
  flowHasSpread: string;
  generating: string;
  drawFirst: string;
  interpretSpread: string;
  jumpToInterpretation: string;
  loadingPaperwork: string;
  noSpreadDrawn: string;
  noSpreadText: string;
  trueSpread: string;
  reflectiveOnly: string;
  trueSpreadText: (period: PeriodValue) => string;
  reflectiveSpreadText: (period: PeriodValue) => string;
  originalStillStands: string;
  originalStillStandsText: string;
  meaning: string;
  fullSpreadReading: string;
  drawn: string;
  interpretationInProgress: string;
  interpretationLoading: string;
  interpretationGenerating: string;
  stayOnInterpretation: string;
  adviceLabel: string;
  cautionLabel: string;
  positionLabels: Record<SpreadPosition, string>;
  spreadIntro: string;
  truthIntroTrue: (period: PeriodValue) => string;
  truthIntroReflective: (period: PeriodValue) => string;
  untilHour: string;
  untilTomorrow: string;
  untilNextWeek: string;
  untilNextMonth: string;
  periods: Record<PeriodValue, { label: string; helper: string }>;
};

const SPREAD_POSITIONS: SpreadPosition[] = [
  "Situation",
  "Challenge",
  "Advice",
];

const COPY: Record<SupportedLocale, UiCopy> = {
  en: {
    title: "Situation. Challenge. Advice.",
    intro:
      "Type your question first, draw a 3-card spread second, then let AI interpret it without pretending it gets to rewrite your truth window.",
    readingRuleTitle: "Reading rule",
    readingRuleText:
      "Only the first spread in the chosen window counts as true. Every later spread in that same window is visible, but clearly marked as reflection only.",
    currentSetting: "Current setting",
    staysLocked: "It stays locked",
    truthWindow: "Truth window",
    truthWindowText:
      "Let the user decide how long the first spread remains the only true one.",
    drawSpread: "Draw my spread",
    showTrueSpread: "Show my true spread",
    drawAnother: "Draw another spread anyway",
    resetWindow: "Reset current window",
    storedTrueSpread: "Stored true spread",
    noTrueSpread: "No true spread saved for this window yet.",
    askQuestion: "Ask your question",
    questionPlaceholder: "Type your question here before drawing a spread...",
    flowNoSpread:
      "Step 1: type your question. Step 2: draw a 3-card spread. Step 3: interpret the reading.",
    flowHasSpread:
      "Your spread is ready. You can now ask Gemini to interpret it.",
    generating: "Generating interpretation...",
    drawFirst: "Draw a spread first",
    interpretSpread: "Interpret my spread",
    jumpToInterpretation: "Jump to interpretation",
    loadingPaperwork: "Loading the cosmic paperwork...",
    noSpreadDrawn: "No spread drawn yet",
    noSpreadText:
      "Your question is ready. Draw the spread so the app has Situation, Challenge, and Advice instead of vague dramatic fog.",
    trueSpread: "True spread",
    reflectiveOnly: "Reflective only",
    trueSpreadText: (period: PeriodValue) =>
      `This is the first spread in your selected ${period}, so the app treats it as the meaningful one.`,
    reflectiveSpreadText: (period: PeriodValue) =>
      `This is not the first spread in your selected ${period}. It is shown for reflection only and should not replace the original spread.`,
    originalStillStands: "Original true spread still stands",
    originalStillStandsText:
      "Your true spread for this window remains the original one. The current spread is extra reflection, not a replacement.",
    meaning: "Meaning",
    fullSpreadReading: "Full spread reading",
    drawn: "Drawn",
    interpretationInProgress: "Interpretation in progress",
    interpretationLoading:
      "Gemini is interpreting your spread. This may take a few seconds.",
    interpretationGenerating: "Generating your interpretation...",
    stayOnInterpretation: "Stay on interpretation",
    adviceLabel: "Advice",
    cautionLabel: "Caution",
    positionLabels: {
      Situation: "Situation",
      Challenge: "Challenge",
      Advice: "Advice",
    },
    spreadIntro:
      "This 3-card spread uses Situation, Challenge, and Advice to frame the question clearly.",
    truthIntroTrue: (period: PeriodValue) =>
      `This is your first spread for the selected ${period}, so the app treats it as your true reading.`,
    truthIntroReflective: (period: PeriodValue) =>
      `This is not your first spread for the selected ${period}, so treat it as reflection only, not the true reading.`,
    untilHour: "until the hour changes",
    untilTomorrow: "until tomorrow",
    untilNextWeek: "until next week",
    untilNextMonth: "until next month",
    periods: {
      hour: {
        label: "1 hour",
        helper: "Only the first spread this hour counts as true.",
      },
      day: {
        label: "1 day",
        helper: "Only the first spread today counts as true.",
      },
      week: {
        label: "1 week",
        helper: "Only the first spread this week counts as true.",
      },
      month: {
        label: "1 month",
        helper: "Only the first spread this month counts as true.",
      },
    },
  },
  ru: {
    title: "Ситуация. Препятствие. Совет.",
    intro:
      "Сначала введите свой вопрос, затем вытяните расклад из 3 карт, а после этого позвольте ИИ интерпретировать его, не переписывая правило истинного окна.",
    readingRuleTitle: "Правило расклада",
    readingRuleText:
      "Только первый расклад в выбранном временном окне считается истинным. Все последующие расклады в этом же окне показываются только для размышления.",
    currentSetting: "Текущая настройка",
    staysLocked: "Остаётся зафиксированным",
    truthWindow: "Окно истинности",
    truthWindowText:
      "Пользователь сам выбирает, как долго первый расклад остаётся единственным истинным.",
    drawSpread: "Вытянуть расклад",
    showTrueSpread: "Показать мой истинный расклад",
    drawAnother: "Вытянуть ещё один расклад",
    resetWindow: "Сбросить текущее окно",
    storedTrueSpread: "Сохранённый истинный расклад",
    noTrueSpread: "Для этого окна ещё нет сохранённого истинного расклада.",
    askQuestion: "Ваш вопрос",
    questionPlaceholder:
      "Введите свой вопрос перед тем, как вытянуть расклад...",
    flowNoSpread:
      "Шаг 1: введите вопрос. Шаг 2: вытяните расклад из 3 карт. Шаг 3: интерпретируйте расклад.",
    flowHasSpread:
      "Ваш расклад готов. Теперь можно попросить Gemini его интерпретировать.",
    generating: "Генерируется интерпретация...",
    drawFirst: "Сначала вытяните расклад",
    interpretSpread: "Интерпретировать расклад",
    jumpToInterpretation: "Перейти к интерпретации",
    loadingPaperwork: "Загружается космическая документация...",
    noSpreadDrawn: "Расклад ещё не вытянут",
    noSpreadText:
      "Ваш вопрос уже готов. Теперь вытяните расклад, чтобы у приложения были Ситуация, Препятствие и Совет, а не просто туманный драматизм.",
    trueSpread: "Истинный расклад",
    reflectiveOnly: "Только для размышления",
    trueSpreadText: (period: PeriodValue) =>
      `Это первый расклад в выбранном периоде (${period}), поэтому приложение считает его основным.`,
    reflectiveSpreadText: (period: PeriodValue) =>
      `Это не первый расклад в выбранном периоде (${period}). Он показывается только для размышления и не должен заменять исходный расклад.`,
    originalStillStands: "Исходный истинный расклад остаётся в силе",
    originalStillStandsText:
      "Ваш истинный расклад для этого окна остаётся исходным. Текущий расклад является дополнительным и не заменяет его.",
    meaning: "Значение",
    fullSpreadReading: "Полное прочтение расклада",
    drawn: "Вытянуто",
    interpretationInProgress: "Идёт интерпретация",
    interpretationLoading:
      "Gemini интерпретирует ваш расклад. Это может занять несколько секунд.",
    interpretationGenerating: "Генерируется ваша интерпретация...",
    stayOnInterpretation: "Остаться на интерпретации",
    adviceLabel: "Совет",
    cautionLabel: "Предостережение",
    positionLabels: {
      Situation: "Ситуация",
      Challenge: "Препятствие",
      Advice: "Совет",
    },
    spreadIntro:
      "Этот расклад из 3 карт использует позиции Ситуация, Препятствие и Совет, чтобы яснее рассмотреть вопрос.",
    truthIntroTrue: (period: PeriodValue) =>
      `Это ваш первый расклад для выбранного периода (${period}), поэтому приложение считает его истинным.`,
    truthIntroReflective: (period: PeriodValue) =>
      `Это не первый расклад для выбранного периода (${period}), поэтому его стоит воспринимать только как дополнительное размышление.`,
    untilHour: "до смены часа",
    untilTomorrow: "до завтра",
    untilNextWeek: "до следующей недели",
    untilNextMonth: "до следующего месяца",
    periods: {
      hour: {
        label: "1 час",
        helper: "Только первый расклад в этот час считается истинным.",
      },
      day: {
        label: "1 день",
        helper: "Только первый расклад за сегодня считается истинным.",
      },
      week: {
        label: "1 неделя",
        helper: "Только первый расклад за эту неделю считается истинным.",
      },
      month: {
        label: "1 месяц",
        helper: "Только первый расклад за этот месяц считается истинным.",
      },
    },
  },
};

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
  return `tarot-spread-mvp:${period}:${getPeriodBucket(period)}`;
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

function drawUniqueCards(deck: TarotCard[], count: number): TarotCard[] {
  const pool = [...deck];
  const drawn: TarotCard[] = [];

  for (let i = 0; i < count; i += 1) {
    const index = randomInt(pool.length);
    drawn.push(pool[index]);
    pool.splice(index, 1);
  }

  return drawn;
}

function createSpreadReading(
  deck: TarotCard[],
  isTrueReading: boolean
): SpreadReading {
  const drawn = drawUniqueCards(deck, 3);

  const cards: SpreadCard[] = drawn.map((card, index) => {
    const orientation: ReadingOrientation =
      Math.random() < 0.35 ? "Reversed" : "Upright";
    const interpretation =
      orientation === "Upright" ? card.upright : card.reversed;

    return {
      ...card,
      orientation,
      interpretation,
      position: SPREAD_POSITIONS[index],
    };
  });

  return {
    cards,
    drawnAt: new Date().toISOString(),
    isTrueReading,
  };
}

function getExpiryText(period: PeriodValue, ui: UiCopy) {
  if (period === "hour") return ui.untilHour;
  if (period === "day") return ui.untilTomorrow;
  if (period === "week") return ui.untilNextWeek;
  return ui.untilNextMonth;
}

function cardAccent(type: TarotCard["type"]) {
  return type === "Major Arcana"
    ? "from-fuchsia-500/30 via-violet-500/20 to-indigo-500/30"
    : "from-cyan-500/25 via-sky-500/10 to-emerald-500/20";
}

function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      <Link
        href={pathname}
        locale="en"
        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition ${
          locale === "en"
            ? "bg-white text-slate-950"
            : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
        }`}
      >
        EN
      </Link>
      <Link
        href={pathname}
        locale="ru"
        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition ${
          locale === "ru"
            ? "bg-white text-slate-950"
            : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
        }`}
      >
        RU
      </Link>
    </div>
  );
}

export default function Page() {
  const locale = useLocale();
  const currentLocale: SupportedLocale = locale === "ru" ? "ru" : "en";
  const ui = COPY[currentLocale];

  const deck = useMemo(() => [...MAJOR_ARCANA, ...buildMinorArcana()], []);
  const [period, setPeriod] = useState<PeriodValue>("day");
  const [truthReading, setTruthReading] = useState<SpreadReading | null>(null);
  const [latestReading, setLatestReading] = useState<SpreadReading | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const [question, setQuestion] = useState("");
  const [aiReading, setAiReading] = useState<AiReading | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  const interpretationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(getStorageKey(period));
    const parsed = saved ? (JSON.parse(saved) as SpreadReading) : null;

    setTruthReading(parsed);
    setLatestReading(parsed);
    setAiReading(null);
    setAiError("");
    setIsHydrated(true);
  }, [period]);

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

  function clearAiState() {
    setAiReading(null);
    setAiError("");
  }

  function scrollToInterpretation() {
    interpretationRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function drawTrueOrPersistedReading() {
    const key = getStorageKey(period);
    const saved = window.localStorage.getItem(key);

    clearAiState();

    if (saved) {
      const parsed = JSON.parse(saved) as SpreadReading;
      setTruthReading(parsed);
      setLatestReading(parsed);
      return;
    }

    const firstReading = createSpreadReading(deck, true);
    window.localStorage.setItem(key, JSON.stringify(firstReading));
    setTruthReading(firstReading);
    setLatestReading(firstReading);
  }

  function drawReflectiveReading() {
    clearAiState();
    const reflective = createSpreadReading(deck, false);
    setLatestReading(reflective);
  }

  function resetCurrentWindow() {
    window.localStorage.removeItem(getStorageKey(period));
    setTruthReading(null);
    setLatestReading(null);
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
          cards: latestReading.cards.map((card) => ({
            name: card.name,
            type: card.type,
            suit: card.suit,
            orientation: card.orientation,
            interpretation: card.interpretation,
            position: card.position,
          })),
          isTrueReading: latestReading.isTrueReading,
          period,
          locale: currentLocale,
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

  function buildSpreadReadingText(
    cards: SpreadCard[],
    isTrueReading: boolean,
    selectedPeriod: PeriodValue
  ) {
    const truthIntro = isTrueReading
      ? ui.truthIntroTrue(selectedPeriod)
      : ui.truthIntroReflective(selectedPeriod);

    const cardLines = cards
      .map(
        (card) =>
          `${ui.positionLabels[card.position]}: ${card.name} (${card.orientation}) - ${card.interpretation}`
      )
      .join(" ");

    return `${truthIntro} ${ui.spreadIntro} ${cardLines}`;
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

        <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
            <div className="mb-5">
              <p className="text-sm font-medium text-white/85">
                {ui.truthWindow}
              </p>
              <p className="mt-1 text-sm leading-6 text-white/55">
                {ui.truthWindowText}
              </p>
            </div>

            <div className="grid gap-3">
              {(Object.keys(ui.periods) as PeriodValue[]).map((item) => {
                const active = period === item;
                const meta = ui.periods[item];

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPeriod(item)}
                    className={`rounded-2xl border px-4 py-4 text-left transition ${
                      active
                        ? "border-fuchsia-400/30 bg-fuchsia-500/15 shadow-lg shadow-fuchsia-950/40"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
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

            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={drawTrueOrPersistedReading}
                className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[0.99]"
              >
                {truthReading ? ui.showTrueSpread : ui.drawSpread}
              </button>

              <button
                type="button"
                onClick={drawReflectiveReading}
                className="rounded-2xl border border-white/12 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {ui.drawAnother}
              </button>

              <button
                type="button"
                onClick={resetCurrentWindow}
                className="rounded-2xl border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/5"
              >
                {ui.resetWindow}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                {ui.storedTrueSpread}
              </div>
              {truthReading ? (
                <>
                  <div className="mt-3 space-y-2">
                    {truthReading.cards.map((card) => (
                      <div
                        key={`${card.position}-${card.name}`}
                        className="text-sm text-white/80"
                      >
                        <span className="font-semibold">
                          {ui.positionLabels[card.position]}:
                        </span>{" "}
                        {card.name} ({card.orientation})
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-sm leading-6 text-white/65">
                    {ui.drawn} {formatDateTime(truthReading.drawnAt)}
                  </div>
                </>
              ) : (
                <p className="mt-3 text-sm leading-6 text-white/55">
                  {ui.noTrueSpread}
                </p>
              )}
            </div>
          </aside>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl lg:p-6">
            <div className="mb-5 rounded-[24px] border border-white/10 bg-black/20 p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                {ui.askQuestion}
              </div>

              <textarea
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  clearAiState();
                }}
                placeholder={ui.questionPlaceholder}
                className="mt-3 min-h-[120px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35"
              />

              <div className="mt-3 text-sm text-white/55">
                {!latestReading ? ui.flowNoSpread : ui.flowHasSpread}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={!latestReading || !question.trim() || isLoadingAi}
                  onClick={generateAiInterpretation}
                  className="rounded-2xl bg-fuchsia-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoadingAi
                    ? ui.generating
                    : !latestReading
                    ? ui.drawFirst
                    : ui.interpretSpread}
                </button>

                {shouldShowJumpButton && (
                  <button
                    type="button"
                    onClick={scrollToInterpretation}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {ui.jumpToInterpretation}
                  </button>
                )}
              </div>
            </div>

            <div ref={interpretationRef} className="mb-5 space-y-4">
              {isLoadingAi && (
                <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-5">
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-fuchsia-100">
                    {ui.interpretationInProgress}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    {ui.interpretationLoading}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span className="text-sm text-white/70">
                      {ui.interpretationGenerating}
                    </span>
                  </div>
                </div>
              )}

              {aiError && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {aiError}
                </div>
              )}

              {aiReading && (
                <div className="rounded-[24px] border border-fuchsia-400/20 bg-fuchsia-500/10 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xl font-semibold text-white">
                      {aiReading.title}
                    </div>
                    <button
                      type="button"
                      onClick={scrollToInterpretation}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      {ui.stayOnInterpretation}
                    </button>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-white/80">
                    {aiReading.interpretation}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-white/70">
                    <span className="font-semibold text-white">
                      {ui.adviceLabel}:
                    </span>{" "}
                    {aiReading.advice}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-white/70">
                    <span className="font-semibold text-white">
                      {ui.cautionLabel}:
                    </span>{" "}
                    {aiReading.caution}
                  </p>

                  <p className="mt-4 text-sm leading-7 text-amber-200">
                    {aiReading.truthNote}
                  </p>
                </div>
              )}
            </div>

            {!isHydrated ? (
              <div className="flex min-h-[420px] items-center justify-center rounded-[28px] border border-white/10 bg-black/20 text-white/60">
                {ui.loadingPaperwork}
              </div>
            ) : !latestReading ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-black/20 px-8 text-center">
                <div className="mb-4 flex gap-3">
                  {SPREAD_POSITIONS.map((position) => (
                    <div
                      key={position}
                      className="h-20 w-14 rounded-2xl border border-fuchsia-400/20 bg-gradient-to-b from-fuchsia-500/15 to-sky-500/10 shadow-[0_0_40px_rgba(168,85,247,0.12)]"
                    />
                  ))}
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
                  {latestReading.cards.map((card) => (
                    <div
                      key={`${card.position}-${card.name}-${card.orientation}`}
                      className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${cardAccent(
                        card.type
                      )} p-[1px] shadow-2xl`}
                    >
                      <div className="flex h-full min-h-[340px] flex-col justify-between rounded-[27px] bg-[#0b0b16]/95 p-6">
                        <div>
                          <div className="text-xs uppercase tracking-[0.24em] text-fuchsia-200/90">
                            {ui.positionLabels[card.position]}
                          </div>
                          <div className="mt-3 text-xs uppercase tracking-[0.24em] text-white/45">
                            {card.type}
                          </div>
                          <div className="mt-4 text-2xl font-semibold leading-tight text-white">
                            {card.name}
                          </div>
                          <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                            {card.orientation}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-white/45">
                              {ui.meaning}
                            </div>
                            <p className="mt-2 text-sm leading-6 text-white/75">
                              {card.interpretation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
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
                      period
                    )}
                  </p>
                  <p className="mt-4 text-xs text-white/45">
                    {ui.drawn} {formatDateTime(latestReading.drawnAt)}
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