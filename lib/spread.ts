// lib/spread.ts
import { getOrientationLabel } from "@/lib/tarot";
import type {
  PeriodValue,
  ReadingOrientation,
  SpreadCard,
  SpreadPosition,
  SpreadReading,
  SupportedLocale,
  TarotCard,
} from "@/lib/tarot";
import type { UiCopy } from "@/lib/ui-copy";

export type StoredSpreadCard = {
  id: string;
  orientation: ReadingOrientation;
  position: SpreadPosition;
};

export type StoredSpreadReading = {
  cards: StoredSpreadCard[];
  drawnAt: string;
  isTrueReading: boolean;
};

export function serializeReading(reading: SpreadReading): StoredSpreadReading {
  return {
    drawnAt: reading.drawnAt,
    isTrueReading: reading.isTrueReading,
    cards: reading.cards.map((card) => ({
      id: card.id,
      orientation: card.orientation,
      position: card.position,
    })),
  };
}

export function hydrateReading(
  stored: StoredSpreadReading,
  deck: TarotCard[]
): SpreadReading | null {
  const cards: SpreadCard[] = [];

  for (const storedCard of stored.cards) {
    const baseCard = deck.find((card) => card.id === storedCard.id);

    if (!baseCard) {
      return null;
    }

    cards.push({
      ...baseCard,
      orientation: storedCard.orientation,
      position: storedCard.position,
      interpretation:
        storedCard.orientation === "Upright"
          ? baseCard.upright
          : baseCard.reversed,
    });
  }

  return {
    cards,
    drawnAt: stored.drawnAt,
    isTrueReading: stored.isTrueReading,
  };
}

export function isStoredSpreadReading(
  value: unknown
): value is StoredSpreadReading {
  if (!value || typeof value !== "object") return false;

  const candidate = value as StoredSpreadReading;

  return (
    Array.isArray(candidate.cards) &&
    typeof candidate.drawnAt === "string" &&
    typeof candidate.isTrueReading === "boolean"
  );
}

export function getExpiryText(period: PeriodValue, ui: UiCopy) {
  if (period === "hour") return ui.untilHour;
  if (period === "day") return ui.untilTomorrow;
  if (period === "week") return ui.untilNextWeek;
  return ui.untilNextMonth;
}

export function buildSpreadReadingText(
  cards: SpreadCard[],
  isTrueReading: boolean,
  selectedPeriod: PeriodValue,
  currentLocale: SupportedLocale,
  ui: UiCopy
) {
  const truthIntro = isTrueReading
    ? ui.truthIntroTrue(selectedPeriod)
    : ui.truthIntroReflective(selectedPeriod);

  const cardLines = cards
    .map(
      (card) =>
        `${ui.positionLabels[card.position]}: ${card.name} (${getOrientationLabel(
          card.orientation,
          currentLocale
        )}) - ${card.interpretation}`
    )
    .join(" ");

  return `${truthIntro} ${ui.spreadIntro} ${cardLines}`;
}