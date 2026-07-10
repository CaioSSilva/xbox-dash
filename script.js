document.addEventListener("DOMContentLoaded", () => {
  const bgLayer = document.getElementById("main-bg");

  // Setup Grid for Navigation
  const navItems = document.querySelectorAll(".nav-item");
  const games = document.querySelectorAll(".games-row .selectable");
  const promos = document.querySelectorAll(".bottom-tiles-row .selectable");

  const grid = [Array.from(navItems), Array.from(games), Array.from(promos)];

  let currentRow = 1;
  let currentCol = 0;
  let isLaunching = false;

  // Names for dynamically generating titles
  const gameTitles = [
    "Hogwarts Legacy",
    "Forza Horizon 5",
    "Grand Theft Auto VI",
    "Overwhatch",
    "No Man's Sky",
    "Cyberpunk 2077",
  ];

  const promoTitles = [
    "Microsoft Store",
    "Conquistas",
    "Xbox Game Pass",
    "Stranded Alien Dawn",
  ];

  // --- FEATURE 1: REAL-TIME CLOCK ---
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    document.querySelector(".clock span").textContent = `${hours}:${minutes}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- FEATURE 2: SYNTHESIZED UI SOUNDS ---
  // Using Web Audio API so we don't rely on external audio files that get blocked
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioCtx = new AudioContext();

  function playNavSound() {
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(450, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      600,
      audioCtx.currentTime + 0.05,
    );
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 0.1,
    );
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  }

  function playSelectSound() {
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      800,
      audioCtx.currentTime + 0.15,
    );
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 0.3,
    );
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  }

  // --- LOGIC ---
  function updateFocus() {
    if (isLaunching) return; // Prevent focus updates while an app is loading

    document
      .querySelectorAll(".focused")
      .forEach((el) => el.classList.remove("focused"));

    if (currentCol >= grid[currentRow].length) {
      currentCol = grid[currentRow].length - 1;
    }

    const target = grid[currentRow][currentCol];
    target.classList.add("focused");

    if (currentRow === 1) {
      document.querySelectorAll(".game-tile").forEach((t) => {
        t.classList.remove("active");
        const info = t.querySelector(".game-info");
        if (info) info.remove();
      });

      target.classList.add("active");

      const newBg = target.getAttribute("data-bg");
      if (newBg) bgLayer.style.backgroundImage = `url('${newBg}')`;

      const infoDiv = document.createElement("div");
      infoDiv.className = "game-info";
      infoDiv.innerHTML = `<h6>${gameTitles[currentCol]}</h6><small>Versão Xbox One</small>`;
      target.appendChild(infoDiv);
    }
  }

  // --- FEATURE 3: LAUNCH OVERLAY ---
  function launchApp() {
    if (isLaunching) return;
    isLaunching = true;
    playSelectSound();

    let appName = "";
    if (currentRow === 0) appName = "Menu de Navegação";
    else if (currentRow === 1) appName = gameTitles[currentCol];
    else if (currentRow === 2) appName = promoTitles[currentCol];

    const overlay = document.getElementById("launch-overlay");
    document.getElementById("launch-title").textContent =
      `Iniciando ${appName}...`;

    overlay.classList.add("active");

    // Auto-close after 2.5 seconds to simulate a load
    setTimeout(() => {
      overlay.classList.remove("active");
      isLaunching = false;
    }, 2500);
  }

  // Controls
  document.addEventListener("keydown", (e) => {
    if (
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(
        e.key,
      )
    ) {
      e.preventDefault();
    }

    if (isLaunching) return; // Lock controls during launch

    let moved = false;

    if (e.key === "ArrowRight" && currentCol < grid[currentRow].length - 1) {
      currentCol++;
      moved = true;
    } else if (e.key === "ArrowLeft" && currentCol > 0) {
      currentCol--;
      moved = true;
    } else if (e.key === "ArrowDown" && currentRow < grid.length - 1) {
      currentRow++;
      moved = true;
      if (currentRow === 2) currentCol = Math.floor(currentCol / 2.25);
    } else if (e.key === "ArrowUp" && currentRow > 0) {
      currentRow--;
      moved = true;
      if (currentRow === 1) currentCol = currentCol * 2;
    } else if (e.key === "Enter") {
      // First user interaction is required by browsers to allow AudioContext to play
      if (audioCtx.state === "suspended") audioCtx.resume();
      launchApp();
    }

    if (moved) {
      // First user interaction is required by browsers to allow AudioContext to play
      if (audioCtx.state === "suspended") audioCtx.resume();
      playNavSound();
      updateFocus();
    }
  });

  // Mouse support
  document.querySelectorAll(".selectable, .nav-item").forEach((el, index) => {
    el.addEventListener("mouseenter", function () {
      if (isLaunching) return;
      for (let r = 0; r < grid.length; r++) {
        const c = grid[r].indexOf(this);
        if (c !== -1 && (currentRow !== r || currentCol !== c)) {
          currentRow = r;
          currentCol = c;

          // Web audio requires user interaction first, mouseenter doesn't strictly count for unmuting,
          // but we will try anyway if already unmuted.
          if (audioCtx.state === "running") playNavSound();

          updateFocus();
          break;
        }
      }
    });

    el.addEventListener("click", function () {
      if (audioCtx.state === "suspended") audioCtx.resume();
      launchApp();
    });
  });
});
