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
  truthWindowLockedHint: string;
  drawAndInterpret: string;
  resetWindow: string;
  storedTrueSpread: string;
  noTrueSpread: string;
  askQuestion: string;
  questionPlaceholder: string;
  flowNoSpread: string;
  flowHasSpread: string;
  generating: string;
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
  readerName: string;
  readerTitle: string;
  statusShufflingTitle: string;
  statusShufflingMessage: string;
  statusUsingSavedTitle: string;
  statusUsingSavedMessage: string;
  statusCardsDrawnTitle: string;
  statusCardsDrawnMessage: string;
  statusStudyingTitle: string;
  statusStudyingMessage: string;
  statusRetryingTitle: string;
  statusRetryingMessage: (attempt: number, max: number) => string;
  positionLabels: Record<SpreadPosition, string>;
  spreadIntro: string;
  truthIntroTrue: (period: PeriodValue) => string;
  truthIntroReflective: (period: PeriodValue) => string;
  untilHour: string;
  untilTomorrow: string;
  untilNextWeek: string;
  untilNextMonth: string;
  untilNextYear: string;
  untilNextDecade: string;
  periods: Record<PeriodValue, { label: string; helper: string }>;
};

export const COPY: Record<SupportedLocale, UiCopy> = {
  en: {
    title: "Situation. Challenge. Advice.",
    intro:
      "Type your question first, choose the time window second, then let the cards and Madame Vespera do the rest.",
    readingRuleTitle: "Reading rule",
    readingRuleText:
      "Only the first spread in the chosen window counts as true. Every later spread in that same window is visible, but clearly marked as reflection only.",
    currentSetting: "Current setting",
    staysLocked: "It stays locked",
    truthWindow: "Truth window",
    truthWindowText:
      "Choose how long the first spread remains the only true one.",
    truthWindowLockedHint:
      "Type your question first to unlock the time window.",
    drawAndInterpret: "Draw cards and get my answer",
    resetWindow: "Reset current window",
    storedTrueSpread: "Stored true spread",
    noTrueSpread: "No true spread saved for this window yet.",
    askQuestion: "Ask your question",
    questionPlaceholder: "Type your question here...",
    flowNoSpread:
      "Step 1: type your question. Step 2: choose the time window. Step 3: draw the cards and get your answer.",
    flowHasSpread:
      "A spread already exists for this window. The true spread will be used if one is already saved.",
    generating: "Working on your reading...",
    jumpToInterpretation: "Jump to interpretation",
    loadingPaperwork: "Loading the cosmic paperwork...",
    noSpreadDrawn: "No spread drawn yet",
    noSpreadText:
      "Your question is ready. Once you start, the cards will be drawn and interpreted in one flow.",
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
      "Madame Vespera is studying your spread. This may take a few seconds.",
    interpretationGenerating: "Preparing your answer...",
    stayOnInterpretation: "Stay on interpretation",
    adviceLabel: "Advice",
    cautionLabel: "Caution",
    readerName: "Madame Vespera",
    readerTitle: "Keeper of the Veil",
    statusShufflingTitle: "Shuffling the deck",
    statusShufflingMessage: "The cards are being drawn now.",
    statusUsingSavedTitle: "True spread found",
    statusUsingSavedMessage:
      "A true spread already exists for this time window. It will be read against your question.",
    statusCardsDrawnTitle: "Cards on the table",
    statusCardsDrawnMessage:
      "The spread has been drawn. The symbols are settling into place.",
    statusStudyingTitle: "Madame Vespera is reading",
    statusStudyingMessage:
      "Madame Vespera, Keeper of the Veil, is studying the cards and preparing your answer.",
    statusRetryingTitle: "The veil flickered",
    statusRetryingMessage: (attempt: number, max: number) =>
      `Connection faltered. Madame Vespera is trying again (${attempt}/${max}).`,
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
    untilNextYear: "until next year",
    untilNextDecade: "until the next decade",
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
      year: {
        label: "1 year",
        helper: "Only the first spread this year counts as true.",
      },
      decade: {
        label: "10 years",
        helper: "Only the first spread this decade counts as true.",
      },
    },
  },
  ru: {
    title: "Ситуация. Препятствие. Совет.",
    intro:
      "Сначала введите свой вопрос, затем выберите временное окно, а дальше карты и мадам Веспера сделают остальное.",
    readingRuleTitle: "Правило расклада",
    readingRuleText:
      "Только первый расклад в выбранном временном окне считается истинным. Все последующие расклады в этом же окне показываются только для размышления.",
    currentSetting: "Текущая настройка",
    staysLocked: "Остаётся зафиксированным",
    truthWindow: "Окно истинности",
    truthWindowText:
      "Выберите, как долго первый расклад остаётся единственным истинным.",
    truthWindowLockedHint:
      "Сначала введите вопрос, чтобы открыть выбор временного окна.",
    drawAndInterpret: "Вытянуть карты и получить ответ",
    resetWindow: "Сбросить текущее окно",
    storedTrueSpread: "Сохранённый истинный расклад",
    noTrueSpread: "Для этого окна ещё нет сохранённого истинного расклада.",
    askQuestion: "Ваш вопрос",
    questionPlaceholder: "Введите свой вопрос...",
    flowNoSpread:
      "Шаг 1: введите вопрос. Шаг 2: выберите временное окно. Шаг 3: вытяните карты и получите ответ.",
    flowHasSpread:
      "Для этого окна уже существует расклад. Если он сохранён как истинный, будет использован именно он.",
    generating: "Идёт работа над раскладом...",
    jumpToInterpretation: "Перейти к интерпретации",
    loadingPaperwork: "Загружается космическая документация...",
    noSpreadDrawn: "Расклад ещё не вытянут",
    noSpreadText:
      "Ваш вопрос готов. Когда вы начнёте, карты будут вытянуты и интерпретированы за один проход.",
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
      "Мадам Веспера изучает ваш расклад. Это может занять несколько секунд.",
    interpretationGenerating: "Подготавливается ваш ответ...",
    stayOnInterpretation: "Остаться на интерпретации",
    adviceLabel: "Совет",
    cautionLabel: "Предостережение",
    readerName: "Мадам Веспера",
    readerTitle: "Хранительница Завесы",
    statusShufflingTitle: "Колода тасуется",
    statusShufflingMessage: "Карты вытягиваются прямо сейчас.",
    statusUsingSavedTitle: "Истинный расклад найден",
    statusUsingSavedMessage:
      "Для этого временного окна уже существует истинный расклад. Он будет прочитан применительно к вашему вопросу.",
    statusCardsDrawnTitle: "Карты на столе",
    statusCardsDrawnMessage:
      "Расклад уже вытянут. Символы занимают свои места.",
    statusStudyingTitle: "Мадам Веспера читает расклад",
    statusStudyingMessage:
      "Мадам Веспера, Хранительница Завесы, изучает карты и готовит ваш ответ.",
    statusRetryingTitle: "Завеса дрогнула",
    statusRetryingMessage: (attempt: number, max: number) =>
      `Связь подвела. Мадам Веспера пытается снова (${attempt}/${max}).`,
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
    untilNextYear: "до следующего года",
    untilNextDecade: "до следующего десятилетия",
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
      year: {
        label: "1 год",
        helper: "Только первый расклад за этот год считается истинным.",
      },
      decade: {
        label: "10 лет",
        helper: "Только первый расклад за это десятилетие считается истинным.",
      },
    },
  },
};