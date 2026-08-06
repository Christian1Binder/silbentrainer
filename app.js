const DATA = {
  leicht: DATA_LEICHT,
  mittel: DATA_MITTEL,
  schwer: DATA_SCHWER
};

const META = {
  leicht: { title: "Leicht · Grundschule", xp: 10 },
  mittel: { title: "Mittel · Sekundarstufe", xp: 15 },
  schwer: { title: "Schwer · Oberstufe", xp: 20 }
};

const byId = (id) => document.getElementById(id);
const STORAGE_KEY = "silbenhelden-v2";

let saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify({
  stars: 0,
  xp: 0,
  bestStreak: 0,
  solved: { leicht: [], mittel: [], schwer: [] }
}));

if (!saved.solved) saved.solved = { leicht: [], mittel: [], schwer: [] };

let state = {
  level: null,
  queue: [],
  position: 0,
  attempts: 0,
  correctFirstTry: 0,
  stars: 0,
  xp: 0,
  streak: 0,
  locked: false
};

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  renderStats();
}

function renderStats() {
  byId("totalStars").textContent = saved.stars || 0;
  byId("totalXP").textContent = saved.xp || 0;
  byId("bestStreak").textContent = saved.bestStreak || 0;

  Object.keys(DATA).forEach((level) => {
    const count = saved.solved[level]?.length || 0;
    byId(`prog-${level}`).style.width = `${Math.min(100, count * 2)}%`;
  });
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function showScreen(id) {
  ["home", "game", "result"].forEach((screen) => {
    byId(screen).classList.toggle("hidden", screen !== id);
  });
}

function startGame(level) {
  state = {
    level,
    queue: shuffle(DATA[level].map((task, index) => ({ ...task, id: index }))).slice(0, 10),
    position: 0,
    attempts: 0,
    correctFirstTry: 0,
    stars: 0,
    xp: 0,
    streak: 0,
    locked: false
  };

  byId("gameTitle").textContent = META[level].title;
  showScreen("game");
  renderTask();
}

function createTile(text) {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.textContent = text;
  tile.draggable = true;
  tile.tabIndex = 0;

  tile.addEventListener("dragstart", () => tile.classList.add("dragging"));
  tile.addEventListener("dragend", () => tile.classList.remove("dragging"));
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
  state.attempts = 0;
  state.locked = false;

  byId("roundText").textContent = `Aufgabe ${state.position + 1} von 10`;
  byId("roundProgress").style.width = `${state.position * 10}%`;
  byId("roundStars").textContent = "☆☆☆";
  byId("feedback").className = "feedback";
  byId("feedback").textContent = "";
  byId("next").disabled = true;
  byId("check").disabled = false;

  byId("target").querySelectorAll(".tile").forEach((tile) => tile.remove());
  byId("bank").innerHTML = "";

  shuffle(state.queue[state.position].syllables).forEach((syllable) => {
    byId("bank").appendChild(createTile(syllable));
  });

  updatePlaceholder();
}

function updatePlaceholder() {
  byId("placeholder").style.display = byId("target").querySelector(".tile") ? "none" : "block";
}

function normalize(text) {
  return text.replace(/\s+/g, "").toLowerCase();
}

function clearFeedback() {
  byId("feedback").textContent = "";
  byId("feedback").className = "feedback";
}

function showError(message) {
  byId("feedback").className = "feedback bad";
  byId("feedback").textContent = message;
}

function checkAnswer() {
  if (state.locked) return;

  if (byId("bank").querySelector(".tile")) {
    showError("Lege zuerst alle Silben nach oben.");
    return;
  }

  state.attempts += 1;
  const built = [...byId("target").querySelectorAll(".tile")]
    .map((tile) => tile.textContent)
    .join("");
  const task = state.queue[state.position];

  if (normalize(built) !== normalize(task.sentence)) {
    state.streak = 0;
    showError("Noch nicht ganz richtig. Sortiere die Silben neu.");
    return;
  }

  state.locked = true;
  const stars = state.attempts === 1 ? 3 : state.attempts === 2 ? 2 : 1;
  const xp = META[state.level].xp * stars;

  state.stars += stars;
  state.xp += xp;
  state.streak += 1;
  if (state.attempts === 1) state.correctFirstTry += 1;

  saved.stars = (saved.stars || 0) + stars;
  saved.xp = (saved.xp || 0) + xp;
  saved.bestStreak = Math.max(saved.bestStreak || 0, state.streak);

  if (!saved.solved[state.level].includes(task.id)) {
    saved.solved[state.level].push(task.id);
  }

  saveProgress();
  byId("roundStars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
  byId("feedback").className = "feedback ok";
  byId("feedback").textContent = `Richtig! +${stars} Sterne und +${xp} XP`;
  byId("next").disabled = false;
  byId("check").disabled = true;
  byId("roundProgress").style.width = `${(state.position + 1) * 10}%`;
  speakSentence();
}

function nextTask() {
  if (state.position < 9) {
    state.position += 1;
    renderTask();
  } else {
    finishRound();
  }
}

function finishRound() {
  showScreen("result");
  byId("earnedStars").textContent = state.stars;
  byId("earnedXP").textContent = state.xp;
  byId("accuracy").textContent = `${Math.round((state.correctFirstTry / 10) * 100)}%`;
  byId("resultMessage").textContent = `Du hast die Runde ${META[state.level].title} beendet.`;

  const badges = [];
  if (state.correctFirstTry === 10) badges.push("👑 Perfekte Runde");
  if (state.streak >= 5) badges.push("🔥 Leseserie");
  if (state.stars >= 25) badges.push("⭐ Sternensammler");
  if (saved.solved[state.level].length === 50) badges.push("🏅 Alle 50 geschafft");
  if (badges.length === 0) badges.push("💪 Weiter so!");

  byId("badges").innerHTML = badges.map((badge) => `<span class="badge">${badge}</span>`).join("");
}

function speakSentence() {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(state.queue[state.position].sentence);
  utterance.lang = "de-DE";
  utterance.rate = state.level === "leicht" ? 0.72 : state.level === "mittel" ? 0.8 : 0.87;
  speechSynthesis.speak(utterance);
}

function setupDropZone(zone) {
  zone.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("over");
    const dragging = document.querySelector(".dragging");
    if (dragging) zone.appendChild(dragging);
    updatePlaceholder();
  });

  zone.addEventListener("dragleave", () => zone.classList.remove("over"));
  zone.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("over");
    clearFeedback();
  });
}

document.querySelectorAll(".level").forEach((button) => {
  button.addEventListener("click", () => startGame(button.dataset.level));
});

byId("check").addEventListener("click", checkAnswer);
byId("next").addEventListener("click", nextTask);
byId("reset").addEventListener("click", renderTask);
byId("speak").addEventListener("click", speakSentence);
byId("homeBtn").addEventListener("click", () => showScreen("home"));
byId("resultHome").addEventListener("click", () => showScreen("home"));
byId("again").addEventListener("click", () => startGame(state.level));

setupDropZone(byId("target"));
setupDropZone(byId("bank"));
renderStats();