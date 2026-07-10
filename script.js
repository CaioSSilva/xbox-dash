document.addEventListener("DOMContentLoaded", () => {
  const bgLayer = document.getElementById("main-bg");
  const bgVideo = document.getElementById("bg-video");
  const navItems = document.querySelectorAll(".nav-item");
  const games = document.querySelectorAll(".games-row .selectable");
  const promos = document.querySelectorAll(".bottom-tiles-row .selectable");
  const guideItems = document.querySelectorAll(".selectable-guide");
  const guideOverlay = document.getElementById("guide-overlay");

  const sysModal = document.getElementById("system-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalIcon = document.getElementById("modal-icon");
  const modalContent = document.getElementById("modal-content");

  const btnA = document.getElementById("btn-action-a");
  const btnB = document.getElementById("btn-action-b");
  const btnMenu = document.getElementById("btn-action-menu");

  const grid = [Array.from(navItems), Array.from(games), Array.from(promos)];

  let currentRow = 1;
  let currentCol = 0;
  let guideRow = 0;
  let modalRow = 0;
  let modalItems = [];
  let isLaunching = false;
  let isGuideOpen = false;
  let isModalOpen = false;

  const gameTitles = [
    "Hogwarts Legacy",
    "Forza Horizon 5",
    "Grand Theft Auto VI",
    "Overwatch",
    "No Man's Sky",
    "The Division 2",
    "Cyberpunk 2077",
  ];
  const promoTitles = [
    "Microsoft Store",
    "Conquistas",
    "Xbox Game Pass",
    "Stranded Alien Dawn",
  ];

  const translations = {
    en: {
      gameVersion: "Xbox One Version",
      storeLabel: "Store",
      achieveLabel: "Operation Brains<br /><small>Rare Achievement</small>",
      gpLabel: "Play Ghost Recon Wildlands<br />now",
      optionsBtn: "<i class='bi bi-list'></i> More options",
      status:
        "<i class='bi bi-circle-fill' style='font-size: 0.5rem'></i> Online",
      alertHeader: "Try it on a real console!",
      alertDesc: "This action is not available on the web version.",
      actionA: "Select",
      actionB: "Back",
      actionMenu: "Guide",
      launching: "Launching",
      notifConnectedTitle: "Controller Connected!",
      notifConnectedDesc: "Let's play!",
      notifDisconnectedTitle: "Controller Disconnected",
      notifDisconnectedDesc: "Connect a controller to play!",
      guideMenu: [
        "Home",
        "My games & apps",
        "People",
        "Groups & chat",
        "Achievements",
        "Capture & share",
        "Settings",
      ],
      modals: {
        gamesApps: {
          title: "My games & apps",
          items: ["See all", "Installation queue", "Updates"],
        },
        people: {
          title: "People",
          items: ["Find someone", "Friends online (4)", "Clubs"],
        },
        chat: {
          title: "Groups & chat",
          items: ["Start a party", "Recent chats"],
        },
        achievements: {
          title: "Achievements",
          items: ["Hogwarts Legacy - 45%", "Forza Horizon 5 - 12%"],
        },
        capture: {
          title: "Capture & share",
          items: ["Record what happened", "Take screenshot", "Recent captures"],
        },
        settings: {
          title: "Settings",
          items: ["General", "Account", "System", "Personalization"],
        },
        store: {
          title: "Microsoft Store",
          items: ["Highlights", "Deals", "Subscriptions"],
        },
        search: {
          title: "Search",
          placeholder: "Search games, apps, people...",
          items: ["Search store", "Search people"],
        },
      },
    },
    pt: {
      gameVersion: "Versão Xbox One",
      storeLabel: "Loja",
      achieveLabel: "Cérebros da Operação<br /><small>Conquista Rara</small>",
      gpLabel: "Jogue Ghost Recon Wildlands<br />agora",
      optionsBtn: "<i class='bi bi-list'></i> Mais opções",
      status:
        "<i class='bi bi-circle-fill' style='font-size: 0.5rem'></i> Online",
      alertHeader: "Tente isso num console real!",
      alertDesc: "Esta ação não está disponível na versão web.",
      actionA: "Selecionar",
      actionB: "Voltar",
      actionMenu: "Guia",
      launching: "Iniciando",
      notifConnectedTitle: "Controle Conectado!",
      notifConnectedDesc: "Vamos jogar!",
      notifDisconnectedTitle: "Controle Desconectado",
      notifDisconnectedDesc: "Conecte um controle para jogar!",
      guideMenu: [
        "Início",
        "Meus jogos e apps",
        "Pessoas",
        "Grupos e bate-papo",
        "Conquistas",
        "Capturar e compartilhar",
        "Configurações",
      ],
      modals: {
        gamesApps: {
          title: "Meus jogos e apps",
          items: ["Ver tudo", "Fila de instalação", "Atualizações"],
        },
        people: {
          title: "Pessoas",
          items: ["Encontrar alguém", "Amigos online (4)", "Clubes"],
        },
        chat: {
          title: "Grupos e bate-papo",
          items: ["Iniciar um grupo", "Bate-papos recentes"],
        },
        achievements: {
          title: "Conquistas",
          items: ["Hogwarts Legacy - 45%", "Forza Horizon 5 - 12%"],
        },
        capture: {
          title: "Capturar e compartilhar",
          items: [
            "Gravar o que aconteceu",
            "Fazer captura de tela",
            "Capturas recentes",
          ],
        },
        settings: {
          title: "Configurações",
          items: ["Geral", "Conta", "Sistema", "Personalização"],
        },
        store: {
          title: "Microsoft Store",
          items: ["Destaques", "Promoções", "Assinaturas"],
        },
        search: {
          title: "Buscar",
          placeholder: "Procurar jogos, apps, pessoas...",
          items: ["Buscar na loja", "Buscar pessoas"],
        },
      },
    },
  };

  const userLang = navigator.language.startsWith("en") ? "en" : "pt";
  const t = translations[userLang];

  function applyTranslations() {
    document
      .querySelectorAll(".txt-game-version")
      .forEach((el) => (el.textContent = t.gameVersion));
    document.querySelector(".txt-store-label").textContent = t.storeLabel;
    document.querySelector(".txt-achieve-label").innerHTML = t.achieveLabel;
    document.querySelector(".txt-gp-label").innerHTML = t.gpLabel;
    document.querySelector(".txt-options-btn").innerHTML = t.optionsBtn;
    document.querySelector(".txt-status").innerHTML = t.status;
    document.querySelector(".txt-alert-header").textContent = t.alertHeader;
    document.querySelector(".txt-alert-desc").textContent = t.alertDesc;

    document.getElementById("notif-title").textContent =
      t.notifDisconnectedTitle;
    document.getElementById("notif-desc").textContent = t.notifDisconnectedDesc;

    const actionLabels = document.querySelectorAll(".action-lbl");
    if (actionLabels.length >= 3) {
      actionLabels[0].textContent = t.actionA;
      actionLabels[1].textContent = t.actionB;
      actionLabels[2].textContent = t.actionMenu;
    }

    const guideLabels = document.querySelectorAll(".guide-lbl");
    guideLabels.forEach((el, idx) => {
      if (t.guideMenu[idx]) el.textContent = t.guideMenu[idx];
    });
  }
  applyTranslations();

  function triggerControllerNotification() {
    setTimeout(() => {
      let isConnected = false;
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (let gp of gamepads) {
        if (gp) isConnected = true;
      }

      document.getElementById("notif-title").textContent = isConnected
        ? t.notifConnectedTitle
        : t.notifDisconnectedTitle;
      document.getElementById("notif-desc").textContent = isConnected
        ? t.notifConnectedDesc
        : t.notifDisconnectedDesc;

      const notif = document.getElementById("xbox-notification");
      notif.classList.add("active");
      setTimeout(() => {
        notif.classList.remove("active");
      }, 5000);
    }, 1200);
  }
  triggerControllerNotification();

  window.addEventListener("gamepadconnected", (e) => {
    document.getElementById("notif-title").textContent = t.notifConnectedTitle;
    document.getElementById("notif-desc").textContent = t.notifConnectedDesc;
    const notif = document.getElementById("xbox-notification");
    notif.classList.add("active");
    setTimeout(() => {
      notif.classList.remove("active");
    }, 5000);
  });

  window.addEventListener("gamepaddisconnected", (e) => {
    document.getElementById("notif-title").textContent =
      t.notifDisconnectedTitle;
    document.getElementById("notif-desc").textContent = t.notifDisconnectedDesc;
    const notif = document.getElementById("xbox-notification");
    notif.classList.add("active");
    setTimeout(() => {
      notif.classList.remove("active");
    }, 5000);
  });

  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    document.querySelector(".clock span").textContent = `${hours}:${minutes}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

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

  function playBackSound() {
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(
      300,
      audioCtx.currentTime + 0.15,
    );
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 0.2,
    );
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  }

  function updateFocus() {
    if (isLaunching || isGuideOpen || isModalOpen) return;
    document
      .querySelectorAll(".focused")
      .forEach((el) => el.classList.remove("focused"));
    if (currentCol >= grid[currentRow].length)
      currentCol = grid[currentRow].length - 1;

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

      const videoSrc = target.getAttribute("data-video");
      if (videoSrc) {
        if (bgVideo.src !== videoSrc) bgVideo.src = videoSrc;
        bgVideo.classList.add("playing");
      } else {
        bgVideo.classList.remove("playing");
        setTimeout(() => bgVideo.pause(), 800);
      }

      const infoDiv = document.createElement("div");
      infoDiv.className = "game-info";
      infoDiv.innerHTML = `<h6>${gameTitles[currentCol]}</h6><small>${t.gameVersion}</small>`;
      target.appendChild(infoDiv);
    }
  }

  function updateGuideFocus() {
    guideItems.forEach((el) => el.classList.remove("focused"));
    guideItems[guideRow].classList.add("focused");
  }

  function updateModalFocus() {
    modalItems.forEach((el) => el.classList.remove("focused"));
    if (modalItems[modalRow]) modalItems[modalRow].classList.add("focused");
  }

  function toggleGuide() {
    if (isModalOpen) return;
    isGuideOpen = !isGuideOpen;
    document
      .getElementById("xbox-guide")
      .classList.toggle("active", isGuideOpen);
    guideOverlay.classList.toggle("active", isGuideOpen);
    if (audioCtx.state === "suspended") audioCtx.resume();
    playNavSound();

    if (isGuideOpen) {
      guideRow = 0;
      updateGuideFocus();
    } else {
      updateFocus();
    }
  }

  function triggerDirection(dir) {
    if (isLaunching) return;
    let moved = false;

    if (isModalOpen) {
      if (dir === "Up" && modalRow > 0) {
        modalRow--;
        moved = true;
      } else if (dir === "Down" && modalRow < modalItems.length - 1) {
        modalRow++;
        moved = true;
      }
      if (moved) updateModalFocus();
    } else if (isGuideOpen) {
      if (dir === "Up" && guideRow > 0) {
        guideRow--;
        moved = true;
      } else if (dir === "Down" && guideRow < guideItems.length - 1) {
        guideRow++;
        moved = true;
      }
      if (moved) updateGuideFocus();
    } else {
      if (dir === "Right" && currentCol < grid[currentRow].length - 1) {
        currentCol++;
        moved = true;
      } else if (dir === "Left" && currentCol > 0) {
        currentCol--;
        moved = true;
      } else if (dir === "Down" && currentRow < grid.length - 1) {
        currentRow++;
        moved = true;
        if (currentRow === 2) currentCol = Math.floor(currentCol / 2.25);
      } else if (dir === "Up" && currentRow > 0) {
        currentRow--;
        moved = true;
        if (currentRow === 1) currentCol = currentCol * 2;
      }
      if (moved) updateFocus();
    }

    if (moved) {
      if (audioCtx.state === "suspended") audioCtx.resume();
      playNavSound();
    }
  }

  function generateModalHTML(itemsArray) {
    let html = "<ul class='dummy-list'>";
    itemsArray.forEach((item) => {
      html += `<li class='modal-item'>${item}</li>`;
    });
    html += "</ul>";
    return html;
  }

  function openSystemModal(title, iconClass, htmlContent) {
    isModalOpen = true;
    if (isGuideOpen) toggleGuide();
    playSelectSound();

    modalTitle.textContent = title;
    modalIcon.className = "bi " + iconClass;
    modalContent.innerHTML = htmlContent;
    sysModal.classList.add("active");

    modalItems = document.querySelectorAll(".modal-item");
    if (modalItems.length > 0) {
      modalRow = 0;
      updateModalFocus();
      modalItems.forEach((el, index) => {
        el.addEventListener("mouseenter", () => {
          if (modalRow !== index) {
            modalRow = index;
            if (audioCtx.state === "running") playNavSound();
            updateModalFocus();
          }
        });
        el.addEventListener("click", () => {
          if (audioCtx.state === "suspended") audioCtx.resume();
          handleModalAction();
        });
      });
    }
  }

  function closeSystemModal() {
    isModalOpen = false;
    playBackSound();
    sysModal.classList.remove("active");
    updateFocus();
  }

  function handleModalAction() {
    if (!isModalOpen) return;
    playSelectSound();
    const fakeAlert = document.getElementById("fake-alert-overlay");
    fakeAlert.classList.add("active");

    setTimeout(() => {
      fakeAlert.classList.remove("active");
      closeSystemModal();
    }, 2500);
  }

  function handleAction() {
    if (isLaunching) return;

    if (isModalOpen) {
      handleModalAction();
      return;
    }

    if (isGuideOpen) {
      if (guideRow === 0) {
        toggleGuide();
        return;
      }
      if (guideRow === 1)
        openSystemModal(
          t.modals.gamesApps.title,
          "bi-controller",
          generateModalHTML(t.modals.gamesApps.items),
        );
      else if (guideRow === 2)
        openSystemModal(
          t.modals.people.title,
          "bi-people",
          generateModalHTML(t.modals.people.items),
        );
      else if (guideRow === 3)
        openSystemModal(
          t.modals.chat.title,
          "bi-chat-dots",
          generateModalHTML(t.modals.chat.items),
        );
      else if (guideRow === 4)
        openSystemModal(
          t.modals.achievements.title,
          "bi-trophy",
          generateModalHTML(t.modals.achievements.items),
        );
      else if (guideRow === 5)
        openSystemModal(
          t.modals.capture.title,
          "bi-camera-video",
          generateModalHTML(t.modals.capture.items),
        );
      else if (guideRow === 6)
        openSystemModal(
          t.modals.settings.title,
          "bi-gear",
          generateModalHTML(t.modals.settings.items),
        );
      return;
    }

    if (currentRow === 0) {
      if (currentCol === 0)
        openSystemModal(
          t.modals.gamesApps.title,
          "bi-controller",
          generateModalHTML([
            t.modals.gamesApps.items[0],
            t.modals.gamesApps.items[1],
          ]),
        );
      else if (currentCol === 1)
        openSystemModal(
          t.modals.store.title,
          "bi-bag",
          generateModalHTML(t.modals.store.items),
        );
      else if (currentCol === 2) toggleGuide();
      else if (currentCol === 3)
        openSystemModal(
          t.modals.search.title,
          "bi-search",
          `<div style='margin-bottom:20px;'><input type='text' class='form-control bg-dark text-white border-secondary' placeholder='${t.modals.search.placeholder}'></div>` +
            generateModalHTML(t.modals.search.items),
        );
      else if (currentCol === 4)
        openSystemModal(
          t.modals.settings.title,
          "bi-gear",
          generateModalHTML(t.modals.settings.items),
        );
      return;
    }

    isLaunching = true;
    playSelectSound();

    let appName =
      currentRow === 1 ? gameTitles[currentCol] : promoTitles[currentCol];
    let redirectUrl = grid[currentRow][currentCol].getAttribute("data-url");

    const overlay = document.getElementById("launch-overlay");
    document.getElementById("launch-title").textContent =
      `${t.launching} ${appName}...`;
    overlay.classList.add("active");

    setTimeout(() => {
      if (redirectUrl) window.location.href = redirectUrl;
      else {
        overlay.classList.remove("active");
        isLaunching = false;
      }
    }, 2500);
  }

  function handleBack() {
    if (isModalOpen) closeSystemModal();
    else if (isGuideOpen) toggleGuide();
    else playBackSound();
  }

  btnA.addEventListener("click", () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
    handleAction();
  });

  btnB.addEventListener("click", () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
    handleBack();
  });

  btnMenu.addEventListener("click", () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
    toggleGuide();
  });

  document.querySelectorAll(".selectable, .nav-item").forEach((el) => {
    el.addEventListener("mouseenter", function () {
      if (isLaunching || isGuideOpen || isModalOpen) return;
      for (let r = 0; r < grid.length; r++) {
        const c = grid[r].indexOf(this);
        if (c !== -1 && (currentRow !== r || currentCol !== c)) {
          currentRow = r;
          currentCol = c;
          if (audioCtx.state === "running") playNavSound();
          updateFocus();
          break;
        }
      }
    });

    el.addEventListener("click", function () {
      if (isGuideOpen || isModalOpen) return;
      if (audioCtx.state === "suspended") audioCtx.resume();
      currentRow = grid.findIndex((row) => row.includes(this));
      currentCol = grid[currentRow].indexOf(this);
      updateFocus();
      handleAction();
    });
  });

  guideItems.forEach((el, index) => {
    el.addEventListener("mouseenter", function () {
      if (isLaunching || !isGuideOpen || isModalOpen) return;
      if (guideRow !== index) {
        guideRow = index;
        if (audioCtx.state === "running") playNavSound();
        updateGuideFocus();
      }
    });

    el.addEventListener("click", function () {
      if (audioCtx.state === "suspended") audioCtx.resume();
      guideRow = index;
      updateGuideFocus();
      handleAction();
    });
  });

  guideOverlay.addEventListener("click", () => {
    if (isGuideOpen) toggleGuide();
  });

  document.addEventListener("keydown", (e) => {
    if (
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Enter",
        "Tab",
        "Escape",
      ].includes(e.key)
    ) {
      e.preventDefault();
    }

    if (isLaunching) return;

    if (e.key === "Tab") toggleGuide();
    else if (e.key === "Escape") handleBack();
    else if (e.key === "Enter") handleAction();
    else triggerDirection(e.key.replace("Arrow", ""));
  });

  let lastGamepadState = {
    A: false,
    B: false,
    Guide: false,
    Up: false,
    Down: false,
    Left: false,
    Right: false,
  };
  let axisCooldown = 0;

  function pollGamepad() {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0];

    if (gp && !isLaunching) {
      const axes = gp.axes;
      const buttons = gp.buttons;

      if (axisCooldown > 0) axisCooldown--;

      const upPressed = buttons[12]?.pressed || axes[1] < -0.5;
      const downPressed = buttons[13]?.pressed || axes[1] > 0.5;
      const leftPressed = buttons[14]?.pressed || axes[0] < -0.5;
      const rightPressed = buttons[15]?.pressed || axes[0] > 0.5;

      if (axisCooldown === 0) {
        if (upPressed && !lastGamepadState.Up) {
          triggerDirection("Up");
          axisCooldown = 12;
        } else if (downPressed && !lastGamepadState.Down) {
          triggerDirection("Down");
          axisCooldown = 12;
        } else if (leftPressed && !lastGamepadState.Left) {
          triggerDirection("Left");
          axisCooldown = 12;
        } else if (rightPressed && !lastGamepadState.Right) {
          triggerDirection("Right");
          axisCooldown = 12;
        }
      }

      if (buttons[0].pressed && !lastGamepadState.A) {
        if (audioCtx.state === "suspended") audioCtx.resume();
        handleAction();
      }

      if (buttons[1].pressed && !lastGamepadState.B) {
        if (audioCtx.state === "suspended") audioCtx.resume();
        handleBack();
      }

      const guidePressed = buttons[9]?.pressed || buttons[16]?.pressed;
      if (guidePressed && !lastGamepadState.Guide) {
        toggleGuide();
      }

      lastGamepadState = {
        A: buttons[0].pressed,
        B: buttons[1].pressed,
        Guide: guidePressed,
        Up: upPressed,
        Down: downPressed,
        Left: leftPressed,
        Right: rightPressed,
      };
    }
    requestAnimationFrame(pollGamepad);
  }

  requestAnimationFrame(pollGamepad);
  updateFocus();
});
