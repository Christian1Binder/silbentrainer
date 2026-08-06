/* Silbenhelden v4 – statische Lern-App ohne Server oder Benutzerkonto */

const RAW_DATA = {
  leicht: typeof DATA_LEICHT !== "undefined" ? DATA_LEICHT : [],
  mittel: typeof DATA_MITTEL !== "undefined" ? DATA_MITTEL : [],
  schwer: typeof DATA_SCHWER !== "undefined" ? DATA_SCHWER : []
};

const LEVELS = {
  leicht: {
    title: "Grundschule",
    short: "Leicht",
    icon: "🌱",
    xp: 10,
    description: "Kurze und vertraute Wörter sicher zusammensetzen.",
    paths: [
      { id: "leicht-1", title: "Silben entdecken", description: "Kurze Sätze und gut hörbare Silben", start: 0, end: 9 },
      { id: "leicht-2", title: "Wörter bauen", description: "Mehrsilbige Alltagswörter zusammensetzen", start: 10, end: 19 },
      { id: "leicht-3", title: "Sätze verstehen", description: "Einfache Satzfolgen sicher erfassen", start: 20, end: 29 },
      { id: "leicht-4", title: "Längere Wörter", description: "Schwierigere Wörter flüssig lesen", start: 30, end: 39 },
      { id: "leicht-5", title: "Flüssig lesen", description: "Längere Sätze und Satzzeichen beachten", start: 40, end: 49 }
    ]
  },
  mittel: {
    title: "Sekundarstufe",
    short: "Mittel",
    icon: "🚀",
    xp: 15,
    description: "Längere Sätze, Wortbausteine und Fachwörter trainieren.",
    paths: [
      { id: "mittel-1", title: "Mehrsilbige Wörter", description: "Lange Wörter in lesbare Einheiten zerlegen", start: 0, end: 9 },
      { id: "mittel-2", title: "Handlungen erkennen", description: "Verben und Satzabläufe sicher erfassen", start: 10, end: 19 },
      { id: "mittel-3", title: "Längere Sätze", description: "Satzteile ordnen und Zusammenhänge lesen", start: 20, end: 29 },
      { id: "mittel-4", title: "Fachwörter im Alltag", description: "Schule, Technik und Natur verstehen", start: 30, end: 39 },
      { id: "mittel-5", title: "Sicherer Lesefluss", description: "Anspruchsvolle Sätze zügig erfassen", start: 40, end: 49 }
    ]
  },
  schwer: {
    title: "Oberstufe",
    short: "Schwer",
    icon: "🎓",
    xp: 20,
    description: "Komplexe Sprache, Argumentation und Fachbegriffe bewältigen.",
    paths: [
      { id: "schwer-1", title: "Fachsprache", description: "Abstrakte Begriffe und Wissenschaftssprache", start: 0, end: 9 },
      { id: "schwer-2", title: "Quellen & Argumente", description: "Aussagen, Belege und Perspektiven verbinden", start: 10, end: 19 },
      { id: "schwer-3", title: "Sprache & Gesellschaft", description: "Komplexe gesellschaftliche Aussagen lesen", start: 20, end: 29 },
      { id: "schwer-4", title: "Analyse & Methoden", description: "Methodische und analytische Sätze ordnen", start: 30, end: 39 },
      { id: "schwer-5", title: "Schlussfolgerungen", description: "Sehr komplexe Zusammenhänge sicher erfassen", start: 40, end: 49 }
    ]
  }
};

const AVATARS = [
  { icon: "🦉", name: "Les-Eule", xp: 0 },
  { icon: "🦊", name: "Wort-Fuchs", xp: 150 },
  { icon: "🐧", name: "Silben-Pinguin", xp: 450 },
  { icon: "🐙", name: "Lese-Oktopus", xp: 900 }
];

const ACCESSORIES = [
  { icon: "", name: "Ohne", xp: 0 },
  { icon: "🎩", name: "Zauberhut", xp: 300 },
  { icon: "👓", name: "Lesebrille", xp: 600 },
  { icon: "👑", name: "Krone", xp: 1200 },
  { icon: "🎓", name: "Doktorhut", xp: 2000 },
  { icon: "🌟", name: "Stern", xp: 3500 }
];

const FIXED_ACHIEVEMENTS = [
  { id: "first-task", icon: "🌟", title: "Erster Schritt", description: "Die erste Aufgabe gelöst", kind: "trophy", check: () => totalCorrect() >= 1 },
  { id: "ten-tasks", icon: "🏆", title: "Zehner-Serie", description: "Zehn Aufgaben gelöst", kind: "trophy", check: () => totalCorrect() >= 10 },
  { id: "fifty-stars", icon: "⭐", title: "Sternensammler", description: "50 Sterne gesammelt", kind: "trophy", check: () => saved.economy.stars >= 50 },
  { id: "xp-500", icon: "⚡", title: "Leseenergie", description: "500 XP erreicht", kind: "trophy", check: () => saved.economy.xp >= 500 },
  { id: "three-days", icon: "🔥", title: "Drangeblieben", description: "An drei Tagen trainiert", kind: "medal", check: () => trainingDays() >= 3 },
  { id: "perfect-round", icon: "👑", title: "Perfekte Runde", description: "Eine Runde ohne Fehler", kind: "medal", check: () => saved.history.some((entry) => entry.firstTryRate === 100) },
  { id: "all-levels", icon: "🌈", title: "Lesereise", description: "In allen Schulstufen trainiert", kind: "medal", check: () => Object.values(saved.solved).every((items) => items.length > 0) }
];

const STORAGE_KEY = "silbenhelden-v4";
const LEGACY_KEY = "silbenhelden-v2";
const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60];
const byId = (id) => document.getElementById(id);

function defaultSaved() {
  return {
    version: 4,
    economy: { stars: 0, xp: 0, crystals: 0, trophies: 0, medals: 0 },
    bestStreak: 0,
    solved: { leicht: [], mittel: [], schwer: [] },
    taskStats: {},
    levelSkill: { leicht: 1.4, mittel: 2.1, schwer: 2.8 },
    errorSyllables: {},
    daily: {},
    missionClaims: {},
    profile: { avatar: "🦉", accessory: "" },
    customSets: [],
    achievements: {},
    pathRewards: [],
    levelRewards: [],
    history: []
  };
}

function loadProgress() {
  const fresh = defaultSaved();
  let parsed = null;

  try {
    parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch (error) {
    console.warn("Gespeicherter Lernstand konnte nicht gelesen werden.", error);
  }

  if (!parsed) {
    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_KEY) || "null");
      if (legacy) {
        parsed = {
          ...fresh,
          economy: {
            ...fresh.economy,
            stars: Number(legacy.stars) || 0,
            xp: Number(legacy.xp) || 0
          },
          bestStreak: Number(legacy.bestStreak) || 0,
          solved: {
            leicht: Array.isArray(legacy.solved?.leicht) ? legacy.solved.leicht : [],
            mittel: Array.isArray(legacy.solved?.mittel) ? legacy.solved.mittel : [],
            schwer: Array.isArray(legacy.solved?.schwer) ? legacy.solved.schwer : []
          }
        };
      }
    } catch (error) {
      console.warn("Alter Lernstand konnte nicht übernommen werden.", error);
    }
  }

  parsed = parsed || fresh;
  return {
    ...fresh,
    ...parsed,
    economy: { ...fresh.economy, ...(parsed.economy || {}) },
    solved: {
      leicht: [...new Set(parsed.solved?.leicht || [])],
      mittel: [...new Set(parsed.solved?.mittel || [])],
      schwer: [...new Set(parsed.solved?.schwer || [])]
    },
    levelSkill: { ...fresh.levelSkill, ...(parsed.levelSkill || {}) },
    profile: { ...fresh.profile, ...(parsed.profile || {}) },
    taskStats: parsed.taskStats || {},
    errorSyllables: parsed.errorSyllables || {},
    daily: parsed.daily || {},
    missionClaims: parsed.missionClaims || {},
    customSets: Array.isArray(parsed.customSets) ? parsed.customSets : [],
    achievements: parsed.achievements || {},
    pathRewards: Array.isArray(parsed.pathRewards) ? parsed.pathRewards : [],
    levelRewards: Array.isArray(parsed.levelRewards) ? parsed.levelRewards : [],
    history: Array.isArray(parsed.history) ? parsed.history.slice(-50) : []
  };
}

let saved = loadProgress();
let catalog = buildCatalog();
let currentScreen = "home";
let toastTimer = null;

let state = {
  active: false,
  mode: null,
  level: null,
  pathId: null,
  customSetId: null,
  queue: [],
  position: 0,
  attempts: 0,
  firstTryCorrect: 0,
  roundStars: 0,
  roundXP: 0,
  roundErrors: {},
  streak: 0,
  locked: false,
  sessionStart: null,
  timeRecorded: false,
  solvedThisRound: 0,
  seed: null
};

function buildCatalog() {
  const result = {};
  Object.entries(RAW_DATA).forEach(([level, tasks]) => {
    const counts = tasks.map((task) => task.syllables.length + task.sentence.split(/\s+/).length * 0.35);
    const min = Math.min(...counts, 1);
    const max = Math.max(...counts, min + 1);
    result[level] = tasks.map((task, index) => {
      const path = LEVELS[level].paths.find((item) => index >= item.start && index <= item.end);
      const rawDifficulty = counts[index];
      const difficulty = 1 + ((rawDifficulty - min) / (max - min)) * 4;
      return {
        ...task,
        id: index,
        key: `${level}:${index}`,
        level,
        pathId: path?.id || `${level}-1`,
        difficulty: clamp(difficulty, 1, 5)
      };
    });
  });
  return result;
}

function saveProgress({ evaluate = true } = {}) {
  if (evaluate) evaluateAchievements();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  renderHeaderStats();
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateKey, days) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return localDateKey(date);
}

function getMonday(date = new Date()) {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const day = copy.getDay() || 7;
  copy.setDate(copy.getDate() - day + 1);
  return copy;
}

function getWeekInfo(date = new Date()) {
  const monday = getMonday(date);
  const thursday = new Date(monday);
  thursday.setDate(thursday.getDate() + 3);
  const firstThursday = new Date(thursday.getFullYear(), 0, 4, 12);
  const firstMonday = getMonday(firstThursday);
  const week = 1 + Math.round((monday - firstMonday) / 604800000);
  return {
    key: `${thursday.getFullYear()}-W${String(week).padStart(2, "0")}`,
    label: `KW ${week}`,
    dates: Array.from({ length: 7 }, (_, index) => addDays(localDateKey(monday), index))
  };
}

function seededRandom(seedText) {
  let seed = 2166136261;
  for (const char of String(seedText)) {
    seed ^= char.charCodeAt(0);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function renderHeaderStats() {
  byId("totalStars").textContent = saved.economy.stars;
  byId("totalCrystals").textContent = saved.economy.crystals;
  byId("totalXP").textContent = saved.economy.xp;
}

function showScreen(id) {
  ["home", "game", "result", "dashboard", "collection", "teacher"].forEach((screen) => {
    byId(screen).classList.toggle("hidden", screen !== id);
  });
  currentScreen = id;
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.screen === id || (id === "result" && button.dataset.screen === "home"));
  });
  if (id === "home") renderHome();
  if (id === "dashboard") renderDashboard();
  if (id === "collection") renderCollection();
  if (id === "teacher") renderTeacher();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function leaveGame(destination = "home") {
  if (state.active && !state.timeRecorded) recordSessionTime(true);
  state.active = false;
  showScreen(destination);
}

function totalCorrect() {
  return Object.values(saved.taskStats).reduce((sum, stats) => sum + (stats.correct || 0), 0);
}

function totalErrors() {
  return Object.values(saved.taskStats).reduce((sum, stats) => sum + (stats.errors || 0), 0);
}

function trainingDays() {
  return Object.values(saved.daily).filter((day) => (day.solved || 0) > 0).length;
}

function totalMinutes() {
  return Math.round(Object.values(saved.daily).reduce((sum, day) => sum + (day.minutes || 0), 0));
}

function recordDailyTask(stars) {
  const key = localDateKey();
  saved.daily[key] = saved.daily[key] || { solved: 0, stars: 0, minutes: 0, sessions: 0 };
  saved.daily[key].solved += 1;
  saved.daily[key].stars += stars;
}

function recordSessionTime(partial = false) {
  if (!state.sessionStart || state.timeRecorded) return 0;
  const elapsed = Math.max(1, Math.min(45, Math.round((Date.now() - state.sessionStart) / 60000)));
  const key = localDateKey();
  saved.daily[key] = saved.daily[key] || { solved: 0, stars: 0, minutes: 0, sessions: 0 };
  saved.daily[key].minutes += elapsed;
  saved.daily[key].sessions += 1;
  state.timeRecorded = true;
  if (partial) saveProgress();
  return elapsed;
}

function getTaskStats(task) {
  saved.taskStats[task.key] = saved.taskStats[task.key] || {
    seen: 0,
    correct: 0,
    errors: 0,
    firstTry: 0,
    box: 0,
    nextDue: localDateKey(),
    lastSeen: null,
    attemptsTotal: 0
  };
  return saved.taskStats[task.key];
}

function dueTasks(level = null) {
  const today = localDateKey();
  const tasks = Object.values(catalog).flat().filter((task) => {
    if (level && task.level !== level) return false;
    const stats = saved.taskStats[task.key];
    return stats && stats.seen > 0 && (!stats.nextDue || stats.nextDue <= today);
  });
  return tasks.sort((a, b) => {
    const aStats = saved.taskStats[a.key];
    const bStats = saved.taskStats[b.key];
    return (aStats.nextDue || "").localeCompare(bStats.nextDue || "") || (bStats.errors || 0) - (aStats.errors || 0);
  });
}

function recommendationLevel() {
  const solved = saved.solved;
  if (solved.leicht.length < 30 || saved.levelSkill.leicht < 3.7) return "leicht";
  if (solved.mittel.length < 30 || saved.levelSkill.mittel < 3.8) return "mittel";
  return "schwer";
}

function buildAdaptiveQueue(level, count = 10) {
  const skill = saved.levelSkill[level];
  const tasks = catalog[level];
  const due = dueTasks(level);
  const unseen = tasks.filter((task) => !saved.taskStats[task.key]);
  const weak = tasks
    .filter((task) => (saved.taskStats[task.key]?.errors || 0) > 0 && !due.some((item) => item.key === task.key))
    .sort((a, b) => (saved.taskStats[b.key]?.errors || 0) - (saved.taskStats[a.key]?.errors || 0));
  const suitable = tasks
    .filter((task) => !due.some((item) => item.key === task.key) && !weak.some((item) => item.key === task.key))
    .sort((a, b) => Math.abs(a.difficulty - skill) - Math.abs(b.difficulty - skill));

  const queue = [];
  const addUnique = (items, limit) => {
    shuffle(items).slice(0, limit).forEach((task) => {
      if (!queue.some((item) => item.key === task.key)) queue.push(task);
    });
  };

  addUnique(due, Math.ceil(count * 0.4));
  addUnique(weak, Math.ceil(count * 0.2));
  addUnique(unseen.sort((a, b) => Math.abs(a.difficulty - skill) - Math.abs(b.difficulty - skill)), Math.ceil(count * 0.4));
  addUnique(suitable, count);
  addUnique(tasks, count);
  return queue.slice(0, count);
}

function getPath(pathId) {
  for (const [level, meta] of Object.entries(LEVELS)) {
    const path = meta.paths.find((item) => item.id === pathId);
    if (path) return { ...path, level };
  }
  return null;
}

function tasksForPath(pathId) {
  const path = getPath(pathId);
  return path ? catalog[path.level].filter((task) => task.pathId === pathId) : [];
}

function pathProgress(pathId) {
  const tasks = tasksForPath(pathId);
  const solved = tasks.filter((task) => saved.solved[task.level].includes(task.id)).length;
  return { solved, total: tasks.length, percent: tasks.length ? Math.round((solved / tasks.length) * 100) : 0 };
}

function startAdaptive() {
  const level = recommendationLevel();
  startTraining({
    mode: "adaptive",
    level,
    title: "Intelligentes Training",
    breadcrumb: `${LEVELS[level].title} · automatisch angepasst`,
    queue: buildAdaptiveQueue(level, 10)
  });
}

function startReview() {
  const tasks = dueTasks();
  if (!tasks.length) {
    toast("Aktuell ist keine Wiederholung fällig. Wir starten ein passendes Training.");
    startAdaptive();
    return;
  }
  startTraining({
    mode: "review",
    level: tasks[0].level,
    title: "Wiederholungstraining",
    breadcrumb: "Fällige Aufgaben aus deinen Lernpfaden",
    queue: tasks.slice(0, 10)
  });
}

function startPath(pathId, options = {}) {
  const path = getPath(pathId);
  if (!path) return;
  const skill = saved.levelSkill[path.level];
  const random = options.seed ? seededRandom(options.seed) : Math.random;
  const queue = tasksForPath(pathId)
    .sort((a, b) => Math.abs(a.difficulty - skill) - Math.abs(b.difficulty - skill));
  const count = clamp(Number(options.count) || 10, 1, queue.length);
  const selected = options.seed ? shuffle(queue, random).slice(0, count) : queue.slice(0, count);

  startTraining({
    mode: options.assignment ? "assignment" : "path",
    level: path.level,
    pathId,
    seed: options.seed || null,
    title: path.title,
    breadcrumb: `${LEVELS[path.level].title} · Lernpfad ${LEVELS[path.level].paths.findIndex((item) => item.id === pathId) + 1}`,
    queue: selected
  });
}

function startCustomSet(setId) {
  const set = saved.customSets.find((item) => item.id === setId);
  if (!set) return;
  const tasks = set.tasks.map((task, index) => ({
    ...task,
    id: index,
    key: `custom:${set.id}:${index}`,
    level: "leicht",
    pathId: null,
    difficulty: clamp(1 + task.syllables.length / 5, 1, 5),
    custom: true
  }));
  startTraining({
    mode: "custom",
    level: "leicht",
    customSetId: set.id,
    title: set.name,
    breadcrumb: "Eigenes Übungspaket",
    queue: shuffle(tasks).slice(0, 10)
  });
}

function startTraining({ mode, level, pathId = null, customSetId = null, title, breadcrumb, queue, seed = null }) {
  if (!queue.length) {
    toast("Für dieses Training sind noch keine Aufgaben vorhanden.");
    return;
  }
  state = {
    active: true,
    mode,
    level,
    pathId,
    customSetId,
    queue,
    position: 0,
    attempts: 0,
    firstTryCorrect: 0,
    roundStars: 0,
    roundXP: 0,
    roundErrors: {},
    streak: 0,
    locked: false,
    sessionStart: Date.now(),
    timeRecorded: false,
    solvedThisRound: 0,
    seed
  };
  byId("gameTitle").textContent = title;
  byId("gameBreadcrumb").textContent = breadcrumb;
  showScreen("game");
  renderTask();
}

function createTile(text, correctIndex) {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.textContent = text;
  tile.draggable = true;
  tile.tabIndex = 0;
  tile.dataset.correctIndex = String(correctIndex);
  tile.setAttribute("role", "button");
  tile.setAttribute("aria-label", `Silbe ${text}`);

  tile.addEventListener("dragstart", () => tile.classList.add("dragging"));
  tile.addEventListener("dragend", () => {
    tile.classList.remove("dragging");
    document.querySelectorAll(".over").forEach((element) => element.classList.remove("over"));
  });
  tile.addEventListener("click", () => moveTile(tile));
  tile.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      moveTile(tile);
    }
  });
  return tile;
}

function moveTile(tile) {
  if (state.locked) return;
  const destination = tile.parentElement === byId("bank") ? byId("target") : byId("bank");
  destination.appendChild(tile);
  updatePlaceholder();
  clearFeedback();
}

function renderTask() {
  const task = state.queue[state.position];
  state.attempts = 0;
  state.locked = false;
  byId("roundText").textContent = `Aufgabe ${state.position + 1} von ${state.queue.length}`;
  byId("roundProgress").style.width = `${(state.position / state.queue.length) * 100}%`;
  byId("skillChip").textContent = `Lernstufe ${saved.levelSkill[task.level].toFixed(1)} · Aufgabe ${task.difficulty.toFixed(1)}`;
  byId("instruction").textContent = state.mode === "review"
    ? "Diese Aufgabe ist zur Wiederholung fällig. Setze den Satz erneut zusammen."
    : "Setze den Satz aus den Silben zusammen.";
  byId("feedback").className = "feedback";
  byId("feedback").textContent = "";
  byId("hintCard").classList.add("hidden");
  byId("hintCard").textContent = "";
  byId("next").disabled = true;
  byId("check").disabled = false;
  byId("target").querySelectorAll(".tile").forEach((tile) => tile.remove());
  byId("bank").innerHTML = "";
  updatePossibleStars();

  shuffle(task.syllables.map((syllable, index) => ({ syllable, index }))).forEach(({ syllable, index }) => {
    byId("bank").appendChild(createTile(syllable, index));
  });
  updatePlaceholder();
}

function resetArrangement({ reshuffle = true } = {}) {
  if (state.locked) return;
  const task = state.queue[state.position];
  byId("target").querySelectorAll(".tile").forEach((tile) => tile.remove());
  byId("bank").innerHTML = "";
  const tiles = task.syllables.map((syllable, index) => ({ syllable, index }));
  (reshuffle ? shuffle(tiles) : tiles).forEach(({ syllable, index }) => {
    byId("bank").appendChild(createTile(syllable, index));
  });
  updatePlaceholder();
  clearFeedback();
}

function updatePlaceholder() {
  byId("placeholder").style.display = byId("target").querySelector(".tile") ? "none" : "block";
}

function normalize(value) {
  return String(value).replace(/\s+/g, "").toLocaleLowerCase("de-DE");
}

function clearFeedback() {
  byId("feedback").textContent = "";
  byId("feedback").className = "feedback";
  document.querySelectorAll(".tile.hint").forEach((tile) => tile.classList.remove("hint"));
}

function showFeedback(message, type) {
  byId("feedback").className = `feedback ${type}`;
  byId("feedback").textContent = message;
}

function updatePossibleStars() {
  const possible = state.attempts === 0 ? 3 : state.attempts === 1 ? 2 : 1;
  byId("roundStars").textContent = "★".repeat(possible) + "☆".repeat(3 - possible);
  byId("roundStars").setAttribute("aria-label", `${possible} Sterne noch möglich`);
}

function currentTileTexts() {
  return [...byId("target").querySelectorAll(".tile")].map((tile) => tile.textContent);
}

function mismatchInfo(task, builtSyllables) {
  const max = Math.max(task.syllables.length, builtSyllables.length);
  for (let index = 0; index < max; index += 1) {
    if (normalize(task.syllables[index] || "") !== normalize(builtSyllables[index] || "")) {
      return {
        index,
        expected: task.syllables[index] || "",
        actual: builtSyllables[index] || "",
        word: wordAtSyllable(task, index)
      };
    }
  }
  return null;
}

function wordAtSyllable(task, targetIndex) {
  const words = task.sentence.split(/\s+/);
  let syllableIndex = 0;
  for (const word of words) {
    const cleanWord = normalize(word.replace(/[.,!?;:„“”"()]/g, ""));
    let combined = "";
    const start = syllableIndex;
    while (syllableIndex < task.syllables.length && combined.length < cleanWord.length) {
      combined += normalize(task.syllables[syllableIndex].replace(/[.,!?;:„“”"()]/g, ""));
      syllableIndex += 1;
      if (combined === cleanWord) break;
    }
    if (targetIndex >= start && targetIndex < syllableIndex) return word;
  }
  return task.sentence;
}

function revealHint(task, mismatch) {
  const hint = byId("hintCard");
  hint.classList.remove("hidden");
  document.querySelectorAll(".tile.hint").forEach((tile) => tile.classList.remove("hint"));

  if (state.attempts === 1) {
    hint.textContent = `Tipp: Prüfe die ${mismatch.index + 1}. Stelle. Dort beginnt oder endet das Wort „${mismatch.word}“.`;
    return;
  }

  if (state.attempts === 2) {
    hint.textContent = `Tipp: An der ${mismatch.index + 1}. Stelle wird die Silbe „${mismatch.expected}“ gebraucht.`;
    const candidate = [...byId("target").querySelectorAll(".tile")]
      .find((tile, index) => index !== mismatch.index && normalize(tile.textContent) === normalize(mismatch.expected));
    candidate?.classList.add("hint");
    return;
  }

  hint.textContent = `Lesehilfe: Der vollständige Satz lautet „${task.sentence}“`;
}

function checkAnswer() {
  if (state.locked) return;
  if (byId("bank").querySelector(".tile")) {
    showFeedback("Lege zuerst alle Silben in den Satzbereich.", "info");
    return;
  }

  state.attempts += 1;
  const builtSyllables = currentTileTexts();
  const task = state.queue[state.position];
  const built = builtSyllables.join("");
  const stats = getTaskStats(task);
  stats.attemptsTotal += 1;

  if (normalize(built) !== normalize(task.sentence)) {
    state.streak = 0;
    stats.errors += 1;
    const mismatch = mismatchInfo(task, builtSyllables);
    if (mismatch?.expected) {
      saved.errorSyllables[mismatch.expected] = (saved.errorSyllables[mismatch.expected] || 0) + 1;
      state.roundErrors[mismatch.expected] = (state.roundErrors[mismatch.expected] || 0) + 1;
    }
    updatePossibleStars();
    showFeedback("Noch nicht ganz richtig. Prüfe die Reihenfolge der Silben.", "bad");
    if (mismatch) revealHint(task, mismatch);
    saveProgress({ evaluate: false });
    return;
  }

  completeTask(task, stats);
}

function completeTask(task, stats) {
  state.locked = true;
  const stars = state.attempts === 1 ? 3 : state.attempts === 2 ? 2 : 1;
  const xp = LEVELS[task.level].xp * stars;
  state.roundStars += stars;
  state.roundXP += xp;
  state.streak += 1;
  state.solvedThisRound += 1;
  if (state.attempts === 1) state.firstTryCorrect += 1;

  stats.seen += 1;
  stats.correct += 1;
  stats.lastSeen = localDateKey();
  if (state.attempts === 1) stats.firstTry += 1;
  stats.box = state.attempts === 1 ? clamp((stats.box || 0) + 1, 0, REVIEW_INTERVALS.length - 1) : state.attempts === 2 ? clamp(stats.box || 0, 0, REVIEW_INTERVALS.length - 1) : 0;
  stats.nextDue = addDays(localDateKey(), REVIEW_INTERVALS[stats.box]);

  if (!task.custom) {
    const oldSkill = saved.levelSkill[task.level];
    const challenge = task.difficulty - oldSkill;
    const change = state.attempts === 1 ? 0.08 + Math.max(0, challenge) * 0.045 : state.attempts === 2 ? 0.015 : -0.08;
    saved.levelSkill[task.level] = clamp(oldSkill + change, 1, 5);
  }

  saved.economy.stars += stars;
  saved.economy.xp += xp;
  saved.bestStreak = Math.max(saved.bestStreak, state.streak);
  if (!task.custom && !saved.solved[task.level].includes(task.id)) saved.solved[task.level].push(task.id);
  recordDailyTask(stars);
  checkPathAndLevelRewards(task);
  saveProgress();

  byId("roundStars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
  byId("feedback").className = "feedback ok";
  byId("feedback").textContent = `Richtig! +${stars} Sterne und +${xp} XP · Wiederholung in ${REVIEW_INTERVALS[stats.box]} Tag${REVIEW_INTERVALS[stats.box] === 1 ? "" : "en"}`;
  byId("hintCard").classList.add("hidden");
  byId("next").disabled = false;
  byId("check").disabled = true;
  byId("roundProgress").style.width = `${((state.position + 1) / state.queue.length) * 100}%`;
  byId("skillChip").textContent = task.custom ? "Eigenes Übungspaket" : `Lernstufe ${saved.levelSkill[task.level].toFixed(1)} · angepasst`;
  speakSentence();
}

function checkPathAndLevelRewards(task) {
  if (task.custom || !task.pathId) return;
  const progress = pathProgress(task.pathId);
  if (progress.solved === progress.total && !saved.pathRewards.includes(task.pathId)) {
    saved.pathRewards.push(task.pathId);
    saved.economy.trophies += 1;
    saved.economy.crystals += 10;
    toast("🏆 Lernpfad abgeschlossen: +10 Kristalle");
  }
  if (saved.solved[task.level].length >= catalog[task.level].length && !saved.levelRewards.includes(task.level)) {
    saved.levelRewards.push(task.level);
    saved.economy.medals += 1;
    saved.economy.crystals += 25;
    toast(`🏅 ${LEVELS[task.level].title} abgeschlossen: +25 Kristalle`);
  }
}

function nextTask() {
  if (state.position < state.queue.length - 1) {
    state.position += 1;
    renderTask();
  } else {
    finishRound();
  }
}

function finishRound() {
  const minutes = recordSessionTime();
  state.active = false;
  const firstTryRate = Math.round((state.firstTryCorrect / state.queue.length) * 100);
  saved.history.push({
    date: new Date().toISOString(),
    mode: state.mode,
    level: state.level,
    pathId: state.pathId,
    tasks: state.queue.length,
    stars: state.roundStars,
    xp: state.roundXP,
    firstTryRate,
    minutes
  });
  saved.history = saved.history.slice(-50);
  saveProgress();

  byId("earnedStars").textContent = state.roundStars;
  byId("earnedXP").textContent = state.roundXP;
  byId("accuracy").textContent = `${firstTryRate}%`;
  byId("sessionMinutes").textContent = minutes;
  byId("resultTitle").textContent = firstTryRate === 100 ? "Perfekte Runde!" : "Runde geschafft!";
  byId("resultIcon").textContent = firstTryRate === 100 ? "👑" : firstTryRate >= 70 ? "🏆" : "🌟";
  byId("resultMessage").textContent = `Du hast ${state.queue.length} Aufgaben bearbeitet und deine Lernstufe wurde automatisch angepasst.`;

  const errors = Object.entries(state.roundErrors).sort((a, b) => b[1] - a[1]);
  byId("resultAnalysis").innerHTML = errors.length
    ? `Heute solltest du besonders auf ${errors.slice(0, 3).map(([syllable]) => `<strong>„${escapeHTML(syllable)}“</strong>`).join(", ")} achten. Diese Silben werden künftig häufiger wiederholt.`
    : "Du hast in dieser Runde keine wiederkehrende Problemsilbe gezeigt. Die Aufgaben werden schrittweise anspruchsvoller.";

  const badges = [];
  if (firstTryRate === 100) badges.push("👑 Perfekte Runde");
  if (state.streak >= 5) badges.push("🔥 Leseserie");
  if (state.roundStars >= state.queue.length * 2.5) badges.push("⭐ Sternensammler");
  if (state.mode === "review") badges.push("🧠 Wiederholungsprofi");
  if (!badges.length) badges.push("💪 Weiter so!");
  byId("badges").innerHTML = badges.map((badge) => `<span class="badge">${badge}</span>`).join("");
  showScreen("result");
  launchConfetti(firstTryRate === 100 ? 36 : 20);
}

function repeatCurrentTraining() {
  if (state.mode === "path" || state.mode === "assignment") return startPath(state.pathId, { seed: state.seed, assignment: state.mode === "assignment" });
  if (state.mode === "custom") return startCustomSet(state.customSetId);
  if (state.mode === "review") return startReview();
  return startAdaptive();
}

function speakSentence() {
  if (!("speechSynthesis" in window) || !state.queue[state.position]) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(state.queue[state.position].sentence);
  utterance.lang = "de-DE";
  utterance.rate = state.level === "leicht" ? 0.72 : state.level === "mittel" ? 0.8 : 0.87;
  utterance.pitch = 1.02;
  speechSynthesis.speak(utterance);
}

function getDragAfterElement(container, x, y) {
  const elements = [...container.querySelectorAll(".tile:not(.dragging)")];
  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const rowDistance = Math.abs(y - (box.top + box.height / 2));
    const horizontalOffset = x - (box.left + box.width / 2);
    const score = rowDistance * 3 + Math.abs(horizontalOffset);
    return score < closest.score ? { score, element: child, horizontalOffset } : closest;
  }, { score: Number.POSITIVE_INFINITY, element: null, horizontalOffset: 0 });
}

function setupDropZone(zone) {
  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    if (state.locked) return;
    zone.classList.add("over");
    const dragging = document.querySelector(".dragging");
    if (!dragging) return;
    const target = getDragAfterElement(zone, event.clientX, event.clientY);
    if (!target.element) zone.appendChild(dragging);
    else if (target.horizontalOffset < 0) zone.insertBefore(dragging, target.element);
    else zone.insertBefore(dragging, target.element.nextSibling);
    updatePlaceholder();
  });
  zone.addEventListener("dragleave", (event) => {
    if (!zone.contains(event.relatedTarget)) zone.classList.remove("over");
  });
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("over");
    clearFeedback();
    updatePlaceholder();
  });
}

function renderHome() {
  renderHeaderStats();
  byId("homeAvatar").textContent = saved.profile.avatar;
  byId("homeAccessory").textContent = saved.profile.accessory;
  const due = dueTasks().length;
  byId("dueCount").textContent = due;
  byId("reviewStart").disabled = false;
  const week = getWeekInfo();
  byId("weekLabel").textContent = week.label;
  renderMissions();
  renderRecommendation();
  renderPaths();
}

function renderRecommendation() {
  const level = recommendationLevel();
  const due = dueTasks(level).length;
  const weak = weakestSyllables(1)[0];
  const path = LEVELS[level].paths
    .map((item) => ({ item, progress: pathProgress(item.id) }))
    .find(({ progress }) => progress.percent < 100)?.item || LEVELS[level].paths[4];
  byId("recommendation").innerHTML = `
    <div class="game-breadcrumb">${LEVELS[level].icon} ${LEVELS[level].title} · Lernstufe ${saved.levelSkill[level].toFixed(1)}</div>
    <h3>${escapeHTML(path.title)}</h3>
    <p>${due ? `${due} Aufgabe${due === 1 ? " ist" : "n sind"} zur Wiederholung fällig.` : "Aktuell sind keine Wiederholungen überfällig."}${weak ? ` Besonders häufig vertauscht wurde zuletzt die Silbe „${escapeHTML(weak[0])}“.` : ""}</p>
    <button class="btn primary" data-recommended-path="${path.id}">Empfohlenen Pfad öffnen</button>`;
  byId("recommendation").querySelector("[data-recommended-path]").addEventListener("click", (event) => startPath(event.currentTarget.dataset.recommendedPath));
}

function renderPaths() {
  byId("pathGroups").innerHTML = Object.entries(LEVELS).map(([level, meta]) => {
    const cards = meta.paths.map((path, index) => {
      const progress = pathProgress(path.id);
      const due = dueTasks(level).filter((task) => task.pathId === path.id).length;
      return `
        <button class="path-card ${progress.percent === 100 ? "completed" : ""}" data-path="${path.id}">
          <span class="path-number">${progress.percent === 100 ? "✓" : index + 1}</span>
          <h4>${escapeHTML(path.title)}</h4>
          <p>${escapeHTML(path.description)}</p>
          <div class="progress-track"><span style="width:${progress.percent}%"></span></div>
          <footer><span>${progress.solved}/${progress.total} geschafft</span><span>${due ? `🔁 ${due}` : ""}</span></footer>
        </button>`;
    }).join("");
    return `
      <article class="path-group">
        <div class="path-group-head">
          <div class="path-group-title"><span>${meta.icon}</span><div><h3>${meta.short} · ${meta.title}</h3><p>${meta.description}</p></div></div>
          <div class="path-skill">Stufe ${saved.levelSkill[level].toFixed(1)}</div>
        </div>
        <div class="path-list">${cards}</div>
      </article>`;
  }).join("");
  byId("pathGroups").querySelectorAll("[data-path]").forEach((button) => {
    button.addEventListener("click", () => startPath(button.dataset.path));
  });
}

function missionData() {
  const week = getWeekInfo();
  const weekDays = week.dates.map((date) => saved.daily[date] || { solved: 0, stars: 0 });
  const solved = weekDays.reduce((sum, day) => sum + (day.solved || 0), 0);
  const stars = weekDays.reduce((sum, day) => sum + (day.stars || 0), 0);
  const days = weekDays.filter((day) => (day.solved || 0) > 0).length;
  return {
    week,
    missions: [
      { id: "tasks", icon: "📚", title: "20 Aufgaben lösen", value: solved, target: 20, reward: 8 },
      { id: "stars", icon: "⭐", title: "40 Sterne sammeln", value: stars, target: 40, reward: 10 },
      { id: "days", icon: "🔥", title: "An 3 Tagen trainieren", value: days, target: 3, reward: 12 }
    ]
  };
}

function renderMissions() {
  const { week, missions } = missionData();
  saved.missionClaims[week.key] = saved.missionClaims[week.key] || [];
  byId("missionList").innerHTML = missions.map((mission) => {
    const complete = mission.value >= mission.target;
    const claimed = saved.missionClaims[week.key].includes(mission.id);
    const percent = clamp(Math.round((mission.value / mission.target) * 100), 0, 100);
    return `
      <div class="mission">
        <span class="mission-icon">${mission.icon}</span>
        <div><strong>${mission.title}</strong><small>${Math.min(mission.value, mission.target)}/${mission.target} · Belohnung ${mission.reward} 💎</small></div>
        <button class="claim-button" data-mission="${mission.id}" ${!complete || claimed ? "disabled" : ""}>${claimed ? "Erhalten" : complete ? "Abholen" : "Läuft"}</button>
        <div class="mission-progress"><span style="width:${percent}%"></span></div>
      </div>`;
  }).join("");
  byId("missionList").querySelectorAll("[data-mission]").forEach((button) => {
    button.addEventListener("click", () => claimMission(button.dataset.mission));
  });
}

function claimMission(id) {
  const { week, missions } = missionData();
  const mission = missions.find((item) => item.id === id);
  if (!mission || mission.value < mission.target) return;
  saved.missionClaims[week.key] = saved.missionClaims[week.key] || [];
  if (saved.missionClaims[week.key].includes(id)) return;
  saved.missionClaims[week.key].push(id);
  saved.economy.crystals += mission.reward;
  saveProgress();
  renderMissions();
  toast(`Mission geschafft: +${mission.reward} Kristalle`);
  launchConfetti(14);
}

function evaluateAchievements() {
  let changed = false;
  FIXED_ACHIEVEMENTS.forEach((achievement) => {
    if (!saved.achievements[achievement.id] && achievement.check()) {
      saved.achievements[achievement.id] = localDateKey();
      saved.economy[achievement.kind === "medal" ? "medals" : "trophies"] += 1;
      saved.economy.crystals += achievement.kind === "medal" ? 12 : 6;
      changed = true;
    }
  });
  return changed;
}

function renderDashboard() {
  renderHeaderStats();
  const correct = totalCorrect();
  const errors = totalErrors();
  const accuracy = correct + errors ? Math.round((correct / (correct + errors)) * 100) : 0;
  const metrics = [
    ["Gelöste Aufgaben", correct],
    ["Trefferquote", `${accuracy}%`],
    ["Trainingszeit", `${totalMinutes()} min`],
    ["Trainingstage", trainingDays()],
    ["Beste Serie", saved.bestStreak]
  ];
  byId("metricGrid").innerHTML = metrics.map(([label, value]) => `<div class="metric-card"><span>${label}</span><b>${value}</b></div>`).join("");
  renderActivityChart();
  renderSkillBars();
  renderWeakSyllables();
  renderReviewOverview();
  renderPathStats();
}

function lastNDates(count) {
  return Array.from({ length: count }, (_, index) => addDays(localDateKey(), index - count + 1));
}

function renderActivityChart() {
  const dates = lastNDates(7);
  const max = Math.max(1, ...dates.map((date) => saved.daily[date]?.solved || 0));
  const formatter = new Intl.DateTimeFormat("de-DE", { weekday: "short" });
  byId("activityChart").innerHTML = dates.map((date) => {
    const value = saved.daily[date]?.solved || 0;
    const height = Math.max(value ? 12 : 3, Math.round((value / max) * 100));
    return `<div class="activity-day"><div class="activity-bar-wrap"><div class="activity-bar" style="height:${height}%" title="${value} Aufgaben"></div></div><strong>${value}</strong><small>${formatter.format(new Date(`${date}T12:00:00`))}</small></div>`;
  }).join("");
}

function renderSkillBars() {
  byId("skillBars").innerHTML = Object.entries(LEVELS).map(([level, meta]) => {
    const skill = saved.levelSkill[level];
    return `<div class="skill-row"><div class="skill-row-head"><strong>${meta.icon} ${meta.title}</strong><span>${skill.toFixed(1)} / 5</span></div><div class="skill-track"><span style="width:${skill * 20}%"></span></div></div>`;
  }).join("");
}

function weakestSyllables(limit = 6) {
  return Object.entries(saved.errorSyllables)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function renderWeakSyllables() {
  const weak = weakestSyllables();
  byId("weakSyllables").innerHTML = weak.length
    ? weak.map(([syllable, count]) => `<div class="weak-row"><span>Silbe <strong>„${escapeHTML(syllable)}“</strong></span><b>${count}× vertauscht</b></div>`).join("")
    : `<div class="empty-state">Noch keine wiederkehrenden Problemsilben erkannt.</div>`;
}

function renderReviewOverview() {
  const due = dueTasks();
  const tomorrow = addDays(localDateKey(), 1);
  const upcoming = Object.entries(saved.taskStats).filter(([, stats]) => stats.nextDue === tomorrow).length;
  byId("reviewOverview").innerHTML = `
    <div class="review-row"><span>Heute fällig</span><strong>${due.length}</strong></div>
    <div class="review-row"><span>Morgen geplant</span><strong>${upcoming}</strong></div>
    <div class="review-row"><span>Im Wiederholsystem</span><strong>${Object.keys(saved.taskStats).length}</strong></div>
    <button class="btn primary full" id="dashboardReview">Fällige Aufgaben trainieren</button>`;
  byId("dashboardReview").addEventListener("click", startReview);
}

function renderPathStats() {
  byId("pathStats").innerHTML = Object.values(LEVELS).flatMap((level) => level.paths).map((path) => {
    const progress = pathProgress(path.id);
    const pathInfo = getPath(path.id);
    return `<div class="path-stat"><h3>${LEVELS[pathInfo.level].icon} ${escapeHTML(path.title)}</h3><p>${progress.solved}/${progress.total} Aufgaben</p><div class="progress-track"><span style="width:${progress.percent}%"></span></div></div>`;
  }).join("");
}

function renderCollection() {
  renderHeaderStats();
  byId("collectionAvatar").textContent = saved.profile.avatar;
  byId("collectionAccessory").textContent = saved.profile.accessory;
  byId("avatarChoices").innerHTML = AVATARS.map((avatar) => {
    const unlocked = saved.economy.xp >= avatar.xp;
    return `<button class="choice-button ${saved.profile.avatar === avatar.icon ? "selected" : ""} ${unlocked ? "" : "locked"}" data-avatar="${avatar.icon}" ${unlocked ? "" : "disabled"}><span>${avatar.icon}</span><small>${unlocked ? avatar.name : `${avatar.xp} XP`}</small></button>`;
  }).join("");
  byId("accessoryChoices").innerHTML = ACCESSORIES.map((accessory) => {
    const unlocked = saved.economy.xp >= accessory.xp;
    return `<button class="choice-button ${saved.profile.accessory === accessory.icon ? "selected" : ""} ${unlocked ? "" : "locked"}" data-accessory="${accessory.icon}" ${unlocked ? "" : "disabled"}><span>${accessory.icon || "✓"}</span><small>${unlocked ? accessory.name : `${accessory.xp} XP`}</small></button>`;
  }).join("");
  byId("avatarChoices").querySelectorAll("[data-avatar]").forEach((button) => button.addEventListener("click", () => selectAvatar(button.dataset.avatar)));
  byId("accessoryChoices").querySelectorAll("[data-accessory]").forEach((button) => button.addEventListener("click", () => selectAccessory(button.dataset.accessory)));

  byId("rewardSummary").innerHTML = `
    <div><b>🏆 ${saved.economy.trophies}</b><span>Pokale</span></div>
    <div><b>🏅 ${saved.economy.medals}</b><span>Medaillen</span></div>
    <div><b>💎 ${saved.economy.crystals}</b><span>Kristalle</span></div>`;

  const rewards = [
    ...FIXED_ACHIEVEMENTS.map((item) => ({ ...item, unlocked: Boolean(saved.achievements[item.id]) })),
    ...Object.values(LEVELS).flatMap((level) => level.paths).map((path) => ({ id: path.id, icon: "🏆", title: path.title, description: "Lernpfad vollständig", unlocked: saved.pathRewards.includes(path.id) })),
    ...Object.entries(LEVELS).map(([level, meta]) => ({ id: `level-${level}`, icon: "🏅", title: meta.title, description: "Alle 50 Sätze geschafft", unlocked: saved.levelRewards.includes(level) }))
  ];
  byId("rewardCabinet").innerHTML = rewards.map((reward) => `<div class="reward-item ${reward.unlocked ? "" : "locked"}"><span class="reward-icon">${reward.icon}</span><div><strong>${escapeHTML(reward.title)}</strong><small>${reward.unlocked ? escapeHTML(reward.description) : "Noch nicht freigeschaltet"}</small></div></div>`).join("");
}

function selectAvatar(icon) {
  if (!AVATARS.some((item) => item.icon === icon && saved.economy.xp >= item.xp)) return;
  saved.profile.avatar = icon;
  saveProgress();
  renderCollection();
}

function selectAccessory(icon) {
  if (!ACCESSORIES.some((item) => item.icon === icon && saved.economy.xp >= item.xp)) return;
  saved.profile.accessory = icon;
  saveProgress();
  renderCollection();
}

function renderTeacher() {
  renderHeaderStats();
  updateSharePaths();
  renderCustomSets();
}

function updateSharePaths() {
  const level = byId("shareLevel").value;
  const current = byId("sharePath").value;
  byId("sharePath").innerHTML = LEVELS[level].paths.map((path) => `<option value="${path.id}">${escapeHTML(path.title)}</option>`).join("");
  if (LEVELS[level].paths.some((path) => path.id === current)) byId("sharePath").value = current;
}

async function generateShareLink() {
  const pathId = byId("sharePath").value;
  const count = byId("shareCount").value;
  const seed = byId("shareSeed").value.trim() || "Lesetraining";
  const base = `${location.origin}${location.pathname}`;
  const url = new URL(base);
  url.searchParams.set("path", pathId);
  url.searchParams.set("count", count);
  url.searchParams.set("seed", seed);
  url.searchParams.set("autostart", "1");
  byId("shareLink").value = url.toString();
  byId("shareOutput").classList.remove("hidden");
  byId("qrFallback").classList.add("hidden");

  const canvas = byId("qrCanvas");
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (window.QRCode?.toCanvas) {
    try {
      await window.QRCode.toCanvas(canvas, url.toString(), { width: 260, margin: 2, errorCorrectionLevel: "M" });
      return;
    } catch (error) {
      console.warn("QR-Code konnte nicht erzeugt werden.", error);
    }
  }
  byId("qrFallback").classList.remove("hidden");
}

async function copyShareLink() {
  const value = byId("shareLink").value;
  try {
    await navigator.clipboard.writeText(value);
    toast("Trainingslink kopiert");
  } catch {
    byId("shareLink").select();
    document.execCommand("copy");
    toast("Trainingslink kopiert");
  }
}

function parseSyllabifiedText(text) {
  return text.trim().split(/\n+/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const syllables = [];
    const words = line.split(/\s+/).map((word) => {
      const parts = word.split("-").filter(Boolean);
      syllables.push(...parts);
      return parts.join("");
    });
    return { sentence: words.join(" "), syllables };
  });
}

function saveCustomSet() {
  const name = byId("customName").value.trim();
  const text = byId("customText").value.trim();
  const feedback = byId("customFeedback");
  feedback.className = "inline-feedback";
  if (!name || !text) {
    feedback.classList.add("bad");
    feedback.textContent = "Bitte gib einen Namen und mindestens einen Satz ein.";
    return;
  }
  const tasks = parseSyllabifiedText(text);
  if (!tasks.length || tasks.length > 50 || tasks.some((task) => task.syllables.length < 2 || task.sentence.length < 4)) {
    feedback.classList.add("bad");
    feedback.textContent = "Erlaubt sind 1 bis 50 vollständige Sätze mit mindestens zwei Silbenbausteinen.";
    return;
  }
  const set = { id: `set-${Date.now()}`, name: name.slice(0, 60), tasks, created: new Date().toISOString() };
  saved.customSets.unshift(set);
  saved.customSets = saved.customSets.slice(0, 30);
  saveProgress();
  byId("customName").value = "";
  byId("customText").value = "";
  feedback.classList.add("ok");
  feedback.textContent = `„${set.name}“ wurde mit ${tasks.length} Aufgaben gespeichert.`;
  renderCustomSets();
}

function renderCustomSets() {
  byId("customSets").innerHTML = saved.customSets.length
    ? saved.customSets.map((set) => `<div class="custom-set"><div><strong>${escapeHTML(set.name)}</strong><small>${set.tasks.length} Aufgaben · nur auf diesem Gerät</small></div><div class="custom-actions"><button class="mini-button" data-start-custom="${set.id}">Starten</button><button class="mini-button" data-export-custom="${set.id}">Export</button><button class="mini-button danger" data-delete-custom="${set.id}">Löschen</button></div></div>`).join("")
    : `<div class="empty-state">Noch kein eigenes Übungspaket gespeichert.</div>`;
  byId("customSets").querySelectorAll("[data-start-custom]").forEach((button) => button.addEventListener("click", () => startCustomSet(button.dataset.startCustom)));
  byId("customSets").querySelectorAll("[data-export-custom]").forEach((button) => button.addEventListener("click", () => exportCustomSet(button.dataset.exportCustom)));
  byId("customSets").querySelectorAll("[data-delete-custom]").forEach((button) => button.addEventListener("click", () => deleteCustomSet(button.dataset.deleteCustom)));
}

function exportCustomSet(id) {
  const set = saved.customSets.find((item) => item.id === id);
  if (!set) return;
  downloadJSON(set, `${fileSafe(set.name)}-silbenhelden.json`);
}

function deleteCustomSet(id) {
  const set = saved.customSets.find((item) => item.id === id);
  if (!set || !window.confirm(`Übungspaket „${set.name}“ wirklich löschen?`)) return;
  saved.customSets = saved.customSets.filter((item) => item.id !== id);
  saveProgress();
  renderCustomSets();
}

function importCustomSet(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed.name || !Array.isArray(parsed.tasks) || !parsed.tasks.length || parsed.tasks.some((task) => !task.sentence || !Array.isArray(task.syllables))) throw new Error("Ungültiges Format");
      const set = { id: `set-${Date.now()}`, name: String(parsed.name).slice(0, 60), tasks: parsed.tasks.slice(0, 50), created: new Date().toISOString() };
      saved.customSets.unshift(set);
      saveProgress();
      renderCustomSets();
      byId("customFeedback").className = "inline-feedback ok";
      byId("customFeedback").textContent = `„${set.name}“ wurde importiert.`;
    } catch (error) {
      byId("customFeedback").className = "inline-feedback bad";
      byId("customFeedback").textContent = "Die Datei ist kein gültiges Silbenhelden-Übungspaket.";
    }
  };
  reader.readAsText(file);
}

function exportProgress() {
  const exportData = {
    exportedAt: new Date().toISOString(),
    summary: {
      correct: totalCorrect(),
      errors: totalErrors(),
      minutes: totalMinutes(),
      trainingDays: trainingDays(),
      levelSkill: saved.levelSkill,
      weakSyllables: weakestSyllables(20)
    },
    progress: saved
  };
  downloadJSON(exportData, `silbenhelden-lernstand-${localDateKey()}.json`);
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function fileSafe(value) {
  return String(value).toLocaleLowerCase("de-DE").replace(/[^a-z0-9äöüß]+/gi, "-").replace(/^-|-$/g, "") || "uebung";
}

function startAssignmentFromURL() {
  const params = new URLSearchParams(location.search);
  if (params.get("autostart") !== "1") return;
  const pathId = params.get("path");
  if (!getPath(pathId)) return;
  const count = clamp(Number(params.get("count")) || 10, 1, 10);
  const seed = params.get("seed") || "Lesetraining";
  startPath(pathId, { count, seed, assignment: true });
}

function toast(message) {
  clearTimeout(toastTimer);
  document.querySelector(".toast")?.remove();
  const element = document.createElement("div");
  element.className = "toast";
  element.textContent = message;
  document.body.appendChild(element);
  toastTimer = setTimeout(() => element.remove(), 3400);
}

function launchConfetti(count = 20) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const symbols = ["⭐", "✨", "🎉", "💎", "🟣", "🟡"];
  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.fontSize = `${16 + Math.random() * 19}px`;
    piece.style.transition = `transform ${2 + Math.random() * 1.8}s linear, opacity 3s ease`;
    document.body.appendChild(piece);
    requestAnimationFrame(() => {
      piece.style.transform = `translate(${(Math.random() - 0.5) * 170}px, ${window.innerHeight + 90}px) rotate(${Math.random() * 720}deg)`;
      piece.style.opacity = "0";
    });
    setTimeout(() => piece.remove(), 4100);
  }
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch((error) => console.warn("Offline-Modus konnte nicht registriert werden.", error));
  }
}

function bindEvents() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (currentScreen === "game") leaveGame(button.dataset.screen);
      else showScreen(button.dataset.screen);
    });
  });
  byId("brandHome").addEventListener("click", () => currentScreen === "game" ? leaveGame("home") : showScreen("home"));
  byId("adaptiveStart").addEventListener("click", startAdaptive);
  byId("reviewStart").addEventListener("click", startReview);
  byId("check").addEventListener("click", checkAnswer);
  byId("next").addEventListener("click", nextTask);
  byId("reset").addEventListener("click", () => resetArrangement({ reshuffle: true }));
  byId("shuffleTiles").addEventListener("click", () => resetArrangement({ reshuffle: true }));
  byId("speak").addEventListener("click", speakSentence);
  byId("gameHome").addEventListener("click", () => leaveGame("home"));
  byId("resultHome").addEventListener("click", () => showScreen("home"));
  byId("resultDashboard").addEventListener("click", () => showScreen("dashboard"));
  byId("again").addEventListener("click", repeatCurrentTraining);
  byId("exportProgress").addEventListener("click", exportProgress);
  byId("shareLevel").addEventListener("change", updateSharePaths);
  byId("generateShare").addEventListener("click", generateShareLink);
  byId("copyShare").addEventListener("click", copyShareLink);
  byId("saveCustom").addEventListener("click", saveCustomSet);
  byId("importCustom").addEventListener("click", () => byId("customFile").click());
  byId("customFile").addEventListener("change", (event) => importCustomSet(event.target.files[0]));
  setupDropZone(byId("target"));
  setupDropZone(byId("bank"));
}

function init() {
  bindEvents();
  evaluateAchievements();
  saveProgress({ evaluate: false });
  renderHome();
  registerServiceWorker();
  startAssignmentFromURL();
}

init();
