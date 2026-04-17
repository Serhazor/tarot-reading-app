export type SupportedLocale = "en" | "ru";
export type PeriodValue = "hour" | "day" | "week" | "month";
export type ReadingOrientation = "Upright" | "Reversed";
export type ArcanaType = "Major Arcana" | "Minor Arcana";
export type SpreadPosition = "Situation" | "Challenge" | "Advice";
export type SuitKey = "Wands" | "Cups" | "Swords" | "Pentacles";

export type MinorRankKey =
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

export type TarotCard = {
  id: string;
  name: string;
  type: ArcanaType;
  suit?: SuitKey;
  upright: string;
  reversed: string;
};

export type SpreadCard = TarotCard & {
  orientation: ReadingOrientation;
  interpretation: string;
  position: SpreadPosition;
};

export type SpreadReading = {
  cards: SpreadCard[];
  drawnAt: string;
  isTrueReading: boolean;
};

export type SuitTheme = {
  displayName: string;
  area: string;
} & Record<MinorRankKey, string>;

export const SPREAD_POSITIONS: SpreadPosition[] = [
  "Situation",
  "Challenge",
  "Advice",
];

export const MINOR_RANKS: { label: string; key: MinorRankKey }[] = [
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

export function buildMinorArcana(
  suitThemes: Record<SuitKey, SuitTheme>,
  rankLabels: { label: string; key: MinorRankKey }[] = MINOR_RANKS
): TarotCard[] {
  return (Object.entries(suitThemes) as Array<[SuitKey, SuitTheme]>).flatMap(
    ([suitKey, theme]) =>
      rankLabels.map((rank) => ({
        id: `minor-${suitKey.toLowerCase()}-${rank.key}`,
        name: `${rank.label} of ${theme.displayName}`,
        type: "Minor Arcana" as const,
        suit: suitKey,
        upright: `${theme[rank.key]} This card usually speaks about ${theme.area}.`,
        reversed: `The energy here is blocked, delayed, distorted, or overdone. The issue likely sits in ${theme.area}.`,
      }))
  );
}

export function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function drawUniqueCards(deck: TarotCard[], count: number): TarotCard[] {
  const pool = [...deck];
  const drawn: TarotCard[] = [];

  for (let i = 0; i < count; i += 1) {
    const index = randomInt(pool.length);
    drawn.push(pool[index]);
    pool.splice(index, 1);
  }

  return drawn;
}

export function createSpreadReading(
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

export function getPeriodBucket(period: PeriodValue, now = new Date()) {
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

export function getStorageKey(period: PeriodValue) {
  return `tarot-spread-mvp:${period}:${getPeriodBucket(period)}`;
}

export function getArcanaTypeLabel(
  type: ArcanaType,
  locale: SupportedLocale
) {
  if (locale === "ru") {
    return type === "Major Arcana" ? "Старший аркан" : "Младший аркан";
  }

  return type;
}

export function getOrientationLabel(
  orientation: ReadingOrientation,
  locale: SupportedLocale
) {
  if (locale === "ru") {
    return orientation === "Upright" ? "Прямое" : "Перевёрнутое";
  }

  return orientation;
}