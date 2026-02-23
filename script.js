//  CONFIG & STATE

const DEBUG = false;
function log(...args) {
  if (DEBUG) console.log(...args);
}

const SLICE_TIMELINE = {
  LINES_START: 2000,
  GLOW_START: 3500,
  SLICES_APPEAR: 4200,
  SHUFFLE_START: 5500,
  MOVE_TO_TRAY: 7500,
  TRAY_TRANSITION_DELAY: 100,
  TRAY_CLEANUP_DELAY: 1500,
};

const GAME_DEFAULTS = {
  TIMER: 60,
  MOVES: 25,
  GRID_SIZE: 3,
  TOTAL_PIECES: 9,
};

const gameState = {
  currentScreen: "home",
  selectedImage: null,
  selectedImageSrc: "",
  timer: GAME_DEFAULTS.TIMER,
  moves: GAME_DEFAULTS.MOVES,
  timerInterval: null,
  gameStartTime: 0,
  puzzlePieces: [],
  boardSlots: [],
  isGameActive: false,
  loadedImage: null,
  draggedPiece: null,
};

const availableImages = [
  {
    id: "Image_1",
    folder: "img/bucc_images/Image_1",
    format: "jpg",
    mainImage: "485363568_1045474904276027_8511738351646389283_n.jpg",
  },
  {
    id: "Image_2",
    folder: "img/bucc_images/Image_2",
    format: "jpg",
    mainImage: "539428404_1621179109080931_5401436227753736451_n.jpg",
  },
  {
    id: "Image_3",
    folder: "img/bucc_images/Image_3",
    format: "jpg",
    mainImage: "490265847_1503662957499214_5153368991087786338_n.jpg",
  },
  {
    id: "Image_4",
    folder: "img/bucc_images/Image_4",
    format: "jpeg",
    mainImage: "received_1950175139263103.jpeg",
  },
  {
    id: "Image_5",
    folder: "img/bucc_images/Image_5",
    format: "jpeg",
    mainImage: "received_891362893215010.jpeg",
  },
  {
    id: "Image_6",
    folder: "img/bucc_images/Image_6",
    format: "jpeg",
    mainImage: "received_1234930791987489.jpeg",
  },
  {
    id: "image_7",
    folder: "img/bucc_images/image_7",
    format: "jpg",
    mainImage: "493331078_1514163073115869_313677686971624500_n.jpg",
  },
  {
    id: "image_8",
    folder: "img/bucc_images/image_8",
    format: "jpg",
    mainImage: "499962311_1539698257229017_7680240705802142123_n.jpg",
  },
  {
    id: "image_9",
    folder: "img/bucc_images/image_9",
    format: "jpg",
    mainImage: "514571441_1572763660589143_6150610111745636301_n.jpg",
  },
  {
    id: "image_10",
    folder: "img/bucc_images/image_10",
    format: "png",
    mainImage: "Screenshot 2025-10-15 143603.png",
  },
  {
    id: "image_11",
    folder: "img/bucc_images/image_11",
    format: "jpg",
    mainImage: "633948170_1775000493698791_2948558201026065364_n.jpg",
  },
  {
    id: "image_12",
    folder: "img/bucc_images/image_12",
    format: "jpeg",
    mainImage: "received_766798879535285.jpeg",
  },
  {
    id: "image_13",
    folder: "img/bucc_images/image_13",
    format: "jpg",
    mainImage: "518321093_1586145185917657_2863071454949104301_n.jpg",
  },
  {
    id: "image_14",
    folder: "img/bucc_images/image_14",
    format: "jpg",
    mainImage: "497443361_1529995874865922_2469651225421764561_n.jpg",
  },
  {
    id: "image_15",
    folder: "img/bucc_images/image_15",
    format: "jpg",
    mainImage: "492493616_1515216823010494_676483715149682811_n.jpg",
  },
];

//  CACHED DOM REFERENCES

const DOM = {};

function cacheDOMElements() {
  DOM.timer = document.getElementById("timer");
  DOM.moveCounter = document.getElementById("moveCounter");
  DOM.puzzleBoard = document.getElementById("puzzleBoard");
  DOM.piecesContainer = document.getElementById("piecesContainer");
  DOM.imageGrid = document.getElementById("imageGrid");
  DOM.sliceOverlay = document.getElementById("sliceOverlay");
  DOM.selectedImagePreview = document.getElementById("selectedImagePreview");
  DOM.sliceGrid = document.getElementById("sliceGrid");
  DOM.sliceLines = document.getElementById("sliceLines");
  DOM.resultTitle = document.getElementById("resultTitle");
  DOM.resultMessage = document.getElementById("resultMessage");
  DOM.finalMoves = document.getElementById("finalMoves");
  DOM.finalTime = document.getElementById("finalTime");
}

//  INITIALIZATION

document.addEventListener("DOMContentLoaded", () => {
  log("Game initializing...");
  cacheDOMElements();
  initializeGame();
  setupEventListeners();
});

function initializeGame() {
  showScreen("home");
}

//  EVENT LISTENERS

function setupEventListeners() {
  document.getElementById("startBtn").addEventListener("click", () => {
    showScreen("instructions");
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && gameState.currentScreen === "home") {
      e.preventDefault();
      showScreen("instructions");
    }
    if (e.code === "Escape" && gameState.currentScreen === "game") {
      e.preventDefault();
      endGame(false);
    }
  });

  document.getElementById("continueBtn").addEventListener("click", () => {
    showScreen("selection");
    loadImageOptions();
  });

  document.getElementById("playAgainBtn").addEventListener("click", () => {
    resetGame();
    showScreen("home");
  });
}


//  SCREEN NAVIGATION

function showScreen(screenName) {
  log("Showing screen:", screenName);

  const screens = document.querySelectorAll(".screen");
  for (let i = 0; i < screens.length; i++) {
    screens[i].classList.remove("active");
  }

  const screen = document.getElementById(screenName + "Screen");
  if (screen) {
    screen.classList.add("active");
    gameState.currentScreen = screenName;
  }
}

//  IMAGE SELECTION

function loadImageOptions() {
  clearChildren(DOM.imageGrid);

  log("Loading image options...");

  const fragment = document.createDocumentFragment();

  availableImages.forEach((imageData, index) => {
    const imageOption = document.createElement("div");
    imageOption.className = "image-option";

    const img = document.createElement("img");
    img.src = `${imageData.folder}/${imageData.mainImage}`;
    img.alt = "Puzzle Option " + (index + 1);

    img.onload = () => log("Image loaded in selection:", imageData.id);
    img.onerror = () => log("Failed to load image in selection:", imageData.id);

    imageOption.appendChild(img);
    imageOption.addEventListener("click", () => {
      selectImage(imageData, imageOption);
    });

    fragment.appendChild(imageOption);
  });

  DOM.imageGrid.appendChild(fragment);
}

function selectImage(imageData, element) {
  log("Image selected:", imageData.id);

  element.classList.add("selected");
  gameState.selectedImageSrc = imageData;

  showScreen("game");
  startSliceAnimation(imageData);
}

//  SLICE ANIMATION

function startSliceAnimation(imageData) {
  log("Starting slice animation for:", imageData.id);

  const overlay = DOM.sliceOverlay;
  const preview = DOM.selectedImagePreview;
  const sliceGrid = DOM.sliceGrid;
  const sliceLines = DOM.sliceLines;

  overlay.classList.remove("active");
  sliceGrid.classList.remove("show-slices", "shuffle", "move-to-tray");
  clearChildren(sliceGrid);
  preview.style.opacity = "1";
  preview.style.filter = "brightness(1)";
  preview.classList.remove("glow-white");

  overlay.classList.add("active");
  preview.src = `${imageData.folder}/${imageData.mainImage}`;

  log("Overlay activated — Phase 1: Image floating to center");

  preview.onload = () => log("Preview image loaded successfully");
  preview.onerror = () => log("Preview image failed to load:", imageData.id);

  // Phase 2: Slice lines appear
  setTimeout(() => {
    log("Phase 2: Slice lines shooting through image");
    sliceLines.classList.add("active");
  }, SLICE_TIMELINE.LINES_START);

  // Phase 3: Image glows white
  setTimeout(() => {
    log("Phase 3: Image glowing white");
    preview.classList.add("glow-white");
  }, SLICE_TIMELINE.GLOW_START);

  // Phase 4: Sliced pieces appear
  setTimeout(() => {
    log("Phase 4: Sliced pieces appearing");
    preview.style.opacity = "0";
    preview.style.visibility = "hidden";

    createSlicePieces(imageData, sliceGrid);
    sliceGrid.classList.add("show-slices");
  }, SLICE_TIMELINE.SLICES_APPEAR);

  // Phase 5: Shuffle animation
  setTimeout(() => {
    log("Phase 5: Shuffle animation");
    sliceGrid.classList.add("shuffle");
  }, SLICE_TIMELINE.SHUFFLE_START);

  // Phase 6: Pieces move to tray, then clean up
  setTimeout(() => {
    log("Phase 6: Pieces moving to tray");

    initializeGameBoard(imageData);

    setTimeout(() => {
      sliceGrid.classList.add("move-to-tray");

      setTimeout(() => {
        overlay.classList.remove("active");
        sliceGrid.classList.remove("show-slices", "shuffle", "move-to-tray");
        clearChildren(sliceGrid);
        preview.style.opacity = "1";
        preview.style.visibility = "visible";
        preview.classList.remove("glow-white");
        sliceLines.classList.remove("active");
      }, SLICE_TIMELINE.TRAY_CLEANUP_DELAY);
    }, SLICE_TIMELINE.TRAY_TRANSITION_DELAY);
  }, SLICE_TIMELINE.MOVE_TO_TRAY);
}

function createSlicePieces(imageData, container) {
  const fragment = document.createDocumentFragment();

  for (let row = 0; row < GAME_DEFAULTS.GRID_SIZE; row++) {
    for (let col = 0; col < GAME_DEFAULTS.GRID_SIZE; col++) {
      const piece = document.createElement("div");
      piece.className = "slice-piece";

      const pieceSrc = `${imageData.folder}/sliced/${row}${col}.${imageData.format}`;
      piece.style.backgroundImage = `url('${pieceSrc}')`;
      piece.style.backgroundSize = "150px 150px";
      piece.style.backgroundPosition = "center";

      const pieceIndex = row * GAME_DEFAULTS.GRID_SIZE + col;
      piece.style.setProperty("--piece-index", pieceIndex);

      fragment.appendChild(piece);
    }
  }

  container.appendChild(fragment);
}

//  GAME BOARD SETUP

function initializeGameBoard(imageData) {
  log("Initializing game board");

  gameState.moves = GAME_DEFAULTS.MOVES;
  gameState.timer = GAME_DEFAULTS.TIMER;
  gameState.isGameActive = true;
  gameState.puzzlePieces = [];
  gameState.boardSlots = [];

  DOM.moveCounter.textContent = GAME_DEFAULTS.MOVES;
  DOM.timer.textContent = GAME_DEFAULTS.TIMER;
  DOM.timer.classList.remove("warning", "danger");

  createPuzzleBoard();
  createPuzzlePieces(imageData);
  startTimer();
}

function createPuzzleBoard() {
  clearChildren(DOM.puzzleBoard);

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < GAME_DEFAULTS.TOTAL_PIECES; i++) {
    const row = Math.floor(i / GAME_DEFAULTS.GRID_SIZE);
    const col = i % GAME_DEFAULTS.GRID_SIZE;
    const correctPieceName = `${col}${row}`;

    const slot = document.createElement("div");
    slot.className = "puzzle-slot";
    slot.dataset.slotIndex = i;
    slot.dataset.correctPiece = correctPieceName;

    slot.addEventListener("dragover", handleDragOver);
    slot.addEventListener("drop", handleDrop);
    slot.addEventListener("dragleave", handleDragLeave);

    fragment.appendChild(slot);
    gameState.boardSlots.push(slot);
  }

  DOM.puzzleBoard.appendChild(fragment);

  DOM.piecesContainer.addEventListener("dragover", handleDragOver);
  DOM.piecesContainer.addEventListener("drop", handleDrop);
  DOM.piecesContainer.addEventListener("dragleave", handleDragLeave);

  log("Board created with", GAME_DEFAULTS.TOTAL_PIECES, "slots");
}

function createPuzzlePieces(imageData) {
  log("Creating puzzle pieces from:", imageData.id);
  clearChildren(DOM.piecesContainer);

  const pieces = Array.from({ length: GAME_DEFAULTS.TOTAL_PIECES }, (_, i) => i);
  shuffleArray(pieces);
  log("Pieces shuffled order:", pieces);

  const fragment = document.createDocumentFragment();
  let loadedCount = 0;

  pieces.forEach((pieceIndex) => {
    const row = Math.floor(pieceIndex / GAME_DEFAULTS.GRID_SIZE);
    const col = pieceIndex % GAME_DEFAULTS.GRID_SIZE;
    const pieceName = `${col}${row}`;

    const piece = document.createElement("img");
    piece.className = "puzzle-piece piece-in-tray";
    piece.draggable = true;
    piece.dataset.pieceIndex = pieceName;
    piece.src = `${imageData.folder}/sliced/${col}${row}.${imageData.format}`;

    piece.onload = () => {
      loadedCount++;
      log(`Piece ${row}${col} loaded (${loadedCount}/${GAME_DEFAULTS.TOTAL_PIECES})`);
      if (loadedCount === GAME_DEFAULTS.TOTAL_PIECES) {
        log("All pieces loaded successfully!");
      }
    };

    piece.onerror = () => {
      log(`Failed to load piece: ${row}${col}.${imageData.format}`);
    };

    piece.addEventListener("dragstart", handleDragStart);
    piece.addEventListener("dragend", handleDragEnd);

    fragment.appendChild(piece);
    gameState.puzzlePieces.push(piece);
  });

  DOM.piecesContainer.appendChild(fragment);
  log(`Created ${GAME_DEFAULTS.TOTAL_PIECES} puzzle pieces`);
}

//  DRAG AND DROP

function handleDragStart(e) {
  if (!gameState.isGameActive) return;
  gameState.draggedPiece = e.target;
  e.target.classList.add("dragging");
  log("Dragging piece:", gameState.draggedPiece.dataset.pieceIndex);
}

function handleDragEnd(e) {
  e.target.classList.remove("dragging");
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";

  const slot = e.target.closest(".puzzle-slot");
  const tray = e.target.closest(".pieces-container");

  if (slot) {
    slot.classList.add("drag-over");
  } else if (tray) {
    tray.classList.add("drag-over");
  }
}

function handleDragLeave(e) {
  const slot = e.target.closest(".puzzle-slot");
  const tray = e.target.closest(".pieces-container");

  if (slot) {
    slot.classList.remove("drag-over");
  } else if (tray) {
    tray.classList.remove("drag-over");
  }
}

function handleDrop(e) {
  e.preventDefault();

  const slot = e.target.closest(".puzzle-slot");
  const tray = e.target.closest(".pieces-container");

  if (slot) {
    slot.classList.remove("drag-over");
  } else if (tray) {
    tray.classList.remove("drag-over");
  }

  if (!gameState.isGameActive || !gameState.draggedPiece) return;

  if (slot) {
    placePieceInSlot(gameState.draggedPiece, slot);
  } else if (tray) {
    returnPieceToTray(gameState.draggedPiece);
  }

  gameState.draggedPiece = null;
}

//  PIECE PLACEMENT

function placePieceInSlot(piece, slot) {
  log("Placing piece", piece.dataset.pieceIndex, "in slot", slot.dataset.slotIndex);

  if (slot.classList.contains("filled")) {
    const existingPiece = slot.querySelector(".puzzle-piece");
    if (existingPiece && existingPiece !== piece) {
      returnPieceToTray(existingPiece);
    }
  }

  const oldParent = piece.parentElement;
  const isFromSlot = oldParent && oldParent.classList.contains("puzzle-slot");

  if (isFromSlot) {
    oldParent.classList.remove("filled");
    oldParent.dataset.placedPiece = "";
  }

  // Switch from tray sizing to slot sizing via CSS classes
  piece.classList.remove("piece-in-tray");
  piece.classList.add("piece-in-slot");
  piece.draggable = true;

  slot.innerHTML = "";
  slot.appendChild(piece);
  slot.classList.add("filled");
  slot.dataset.placedPiece = piece.dataset.pieceIndex;

  // Decrement moves counter
  gameState.moves--;
  DOM.moveCounter.textContent = gameState.moves;
  log("Moves remaining:", gameState.moves);

  // Check if out of moves
  if (gameState.moves <= 0 && gameState.isGameActive) {
    log("Out of moves! Game Over!");
    endGame(false);
    return;
  }

  checkPuzzleComplete();
}

function returnPieceToTray(piece) {
  log("Returning piece", piece.dataset.pieceIndex, "to tray");

  const oldParent = piece.parentElement;
  if (oldParent && oldParent.classList.contains("puzzle-slot")) {
    oldParent.classList.remove("filled");
    oldParent.dataset.placedPiece = "";
  }

  // Switch from slot sizing to tray sizing via CSS classes
  piece.classList.remove("piece-in-slot");
  piece.classList.add("piece-in-tray");
  piece.draggable = true;

  DOM.piecesContainer.appendChild(piece);

  // Decrement moves counter
  gameState.moves--;
  DOM.moveCounter.textContent = gameState.moves;

  // Check if out of moves
  if (gameState.moves <= 0 && gameState.isGameActive) {
    log("Out of moves! Game Over!");
    endGame(false);
  }
}

//  TIMER

function startTimer() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }

  gameState.timerInterval = setInterval(() => {
    if (!gameState.isGameActive) {
      clearInterval(gameState.timerInterval);
      return;
    }

    gameState.timer--;
    DOM.timer.textContent = gameState.timer;

    if (gameState.timer <= 10 && gameState.timer > 5) {
      DOM.timer.classList.add("warning");
      DOM.timer.classList.remove("danger");
    } else if (gameState.timer <= 5) {
      DOM.timer.classList.remove("warning");
      DOM.timer.classList.add("danger");
    }

    if (gameState.timer <= 0) {
      endGame(false);
    }
  }, 1000);
}

//  WIN / LOSE CHECKING

function checkPuzzleComplete() {
  const slots = gameState.boardSlots;
  const allFilled = slots.every((slot) => slot.classList.contains("filled"));

  log("Checking puzzle completion — All filled:", allFilled);
  if (!allFilled) return;

  const isCorrect = slots.every((slot) => {
    const match = slot.dataset.correctPiece === slot.dataset.placedPiece;
    log(`Slot: correct="${slot.dataset.correctPiece}", placed="${slot.dataset.placedPiece}", match=${match}`);
    return match;
  });

  log("Puzzle is correct:", isCorrect);

  if (isCorrect) {
    log("PUZZLE COMPLETE!");
    showCompletionAnimation();
  }
}

function showCompletionAnimation() {
  log("Starting completion animation");
  gameState.isGameActive = false;
  clearInterval(gameState.timerInterval);

  const board = DOM.puzzleBoard;
  const pieces = board.querySelectorAll(".puzzle-piece");

  board.style.gap = "0";
  pieces.forEach((piece) => {
    piece.style.border = "none";
  });

  board.classList.add("puzzle-complete");

  setTimeout(() => {
    endGame(true);
  }, 2500);
}

//  GAME END & RESET

function endGame(won) {
  log("Game ended. Won:", won);
  gameState.isGameActive = false;
  clearInterval(gameState.timerInterval);

  const timeTaken = GAME_DEFAULTS.TIMER - gameState.timer;
  const movesUsed = GAME_DEFAULTS.MOVES - gameState.moves;

  if (won) {
    log("Setting WIN text");
    DOM.resultTitle.textContent = "Congratulations!";
    DOM.resultTitle.className = "result-title win";
    DOM.resultMessage.textContent = "Puzzle Solved!";
  } else {
    log("Setting LOSE text");
    DOM.resultTitle.textContent = "Game Over!";
    DOM.resultTitle.className = "result-title lose";
    if (gameState.moves <= 0) {
      DOM.resultMessage.textContent = "Out of Moves!";
    } else {
      DOM.resultMessage.textContent = "Time's Up!";
    }
  }

  DOM.finalMoves.textContent = movesUsed;
  DOM.finalTime.textContent = timeTaken + "s";

  log("Showing result screen in 1 second...");
  setTimeout(() => {
    log("Now showing result screen");
    showScreen("result");
  }, 1000);
}

function resetGame() {
  log("Resetting game");
  gameState.moves = GAME_DEFAULTS.MOVES;
  gameState.timer = GAME_DEFAULTS.TIMER;
  gameState.isGameActive = false;
  gameState.selectedImageSrc = "";
  gameState.draggedPiece = null;

  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }

  clearChildren(DOM.puzzleBoard);
  clearChildren(DOM.piecesContainer);
}

//  UTILITIES

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

//  TITLE LANGUAGE CYCLING (Hacker Scramble)

const TITLE_VARIANTS = [
  "PUZZLE_FUSION_V2",
  "拼图融合_V2",
  "পাজল_ফিউশন_V2",
  "0x50 55 5A 5A 4C 45",
  "퍼즐_퓨전_V2",
  "パズル融合_V2",
  "لغز_الدمج_V2",
  "01010000 01010101",
];

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]=/\\|~^拼图融合파즐퓨전パズルপাজলফিউশনلغزالدمج";

let titleIndex = 0;
let scrambleTimer = null;

function startTitleCycling() {
  const titleEl = document.querySelector(".game-title");
  if (!titleEl) return;

  setInterval(() => {
    titleIndex = (titleIndex + 1) % TITLE_VARIANTS.length;
    scrambleTo(titleEl, TITLE_VARIANTS[titleIndex]);
  }, 4500);
}

function scrambleTo(element, targetText) {
  const targetChars = Array.from(targetText);
  const len = targetChars.length;

  let resolved = new Array(len).fill(false);
  let display = new Array(len).fill("");
  let iteration = 0;
  const maxIterations = 12;

  for (let i = 0; i < len; i++) {
    display[i] = randomScrambleChar();
  }

  if (scrambleTimer) clearInterval(scrambleTimer);

  scrambleTimer = setInterval(() => {
    iteration++;

    const resolveCount = Math.floor((iteration / maxIterations) * len);

    for (let i = 0; i < len; i++) {
      if (i < resolveCount) {
        resolved[i] = true;
        display[i] = targetChars[i];
      } else {
        display[i] = randomScrambleChar();
      }
    }

    element.textContent = display.join("");

    if (iteration >= maxIterations) {
      clearInterval(scrambleTimer);
      scrambleTimer = null;
      element.textContent = targetText;
    }
  }, 70);
}

function randomScrambleChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

//  PARTICLE CANVAS BACKGROUND

const PARTICLE_CONFIG = {
  COUNT: 45,
  MIN_SIZE: 12,
  MAX_SIZE: 28,
  MIN_SPEED: 0.3,
  MAX_SPEED: 1.0,
  MIN_OPACITY: 0.15,
  MAX_OPACITY: 0.45,
  CONNECTION_DIST: 150,
};

const LANG_SYMBOLS = [
  "{ }", "</>", "py", "JS", "C++", "C#",
  "Go", "λ", "SQL", "PHP", "TS", "fn()",
  "Bangla", "English", "Arabic", "Chinese",
  "Japanese", "Korean", "Hindi", "French",
  "Spanish", "German", "বাংলা", "العربية",
  "中文", "日本語", "한국어", "русский",
];

const PARTICLE_COLORS = [
  "rgba(255, 255, 255, ",   // white
  "rgba(240, 240, 240, ",   // off-white
  "rgba(220, 220, 220, ",   // light gray
  "rgba(255, 245, 245, ",   // warm white
  "rgba(250, 250, 255, ",   // cool white
];

let particles = [];
let particleCanvas = null;
let particleCtx = null;
let animFrameId = null;

function initParticleSystem() {
  particleCanvas = document.getElementById("particleCanvas");
  if (!particleCanvas) return;

  particleCtx = particleCanvas.getContext("2d");
  resizeCanvas();
  createParticles();
  animateParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });
}

function resizeCanvas() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  const w = particleCanvas.width;
  const h = particleCanvas.height;

  for (let i = 0; i < PARTICLE_CONFIG.COUNT; i++) {
    const size =
      PARTICLE_CONFIG.MIN_SIZE +
      Math.random() * (PARTICLE_CONFIG.MAX_SIZE - PARTICLE_CONFIG.MIN_SIZE);

    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * PARTICLE_CONFIG.MAX_SPEED * 2,
      vy:
        -(PARTICLE_CONFIG.MIN_SPEED +
          Math.random() * (PARTICLE_CONFIG.MAX_SPEED - PARTICLE_CONFIG.MIN_SPEED)),
      size: size,
      opacity:
        PARTICLE_CONFIG.MIN_OPACITY +
        Math.random() * (PARTICLE_CONFIG.MAX_OPACITY - PARTICLE_CONFIG.MIN_OPACITY),
      symbol: LANG_SYMBOLS[Math.floor(Math.random() * LANG_SYMBOLS.length)],
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }
}

function drawConnections(ctx) {
  const maxDist = PARTICLE_CONFIG.CONNECTION_DIST;

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDist) {
        const opacity = (1 - dist / maxDist) * 0.2;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  const ctx = particleCtx;
  const w = particleCanvas.width;
  const h = particleCanvas.height;

  ctx.clearRect(0, 0, w, h);

  drawConnections(ctx);

  particles.forEach((p) => {
    // Update position
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationSpeed;

    // Pulse opacity
    p.pulsePhase += 0.01;
    const pulse = Math.sin(p.pulsePhase) * 0.08;
    const currentOpacity = Math.max(0.05, Math.min(0.5, p.opacity + pulse));

    // Wrap around edges
    if (p.y < -50) {
      p.y = h + 50;
      p.x = Math.random() * w;
    }
    if (p.x < -50) p.x = w + 50;
    if (p.x > w + 50) p.x = -50;

    // Draw
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.font = `bold ${p.size}px "Courier New", monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = p.color + currentOpacity + ")";
    ctx.fillText(p.symbol, 0, 0);
    ctx.restore();
  });

  animFrameId = requestAnimationFrame(animateParticles);
}

document.addEventListener("DOMContentLoaded", () => {
  initParticleSystem();
  startTitleCycling();
});
