import type {
  PeriodValue,
  SpreadPosition,
  SupportedLocale,
} from "@/lib/tarot";

export type UiCopy = {
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

export const COPY: Record<SupportedLocale, UiCopy> = {
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