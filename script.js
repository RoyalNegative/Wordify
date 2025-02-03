const wordContainer = document.querySelector(".word");
const BACKEND_URL = "https://api-wordify.com";
const socket = io(BACKEND_URL);
let openChatMode = false;
const Correctguessaudio = new Audio(`./sounds/correctguess.mp3`);
const GameStartaudio = new Audio(`./sounds/gamestart.ogg`);

const openChatArea = document.getElementById("openChatArea");

const countdownText = document.createElement("h1");
countdownText.classList.add("countdown-text");
document.body.appendChild(countdownText);


socket.on("openChatMode", (data) => {
  console.log("Received openChatMode event:", data); // Gelen veriyi logla

  openChatMode = data.status;
  console.log("Updated openChatMode:", openChatMode); // Güncellenmiş durumu kontrol et

  const openChatNotification = document.getElementById("openChatNotification");
  if (!openChatNotification) {
    console.error("Error: #openChatNotification element not found!");
    return;
  }

  const openChatArea = document.getElementById("openChatArea");
  if (!openChatArea) {
    console.error("Error: #openChatArea element not found!");
    return;
  }

  if (openChatMode) {
    console.log("OpenChat Mode is being activated...");

    openChatArea.style.display = "flex";
    openChatArea.classList.add("open-chat-active");

    setTimeout(() => {
      console.log("Scrolling to bottom...");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 300);

    openChatNotification.innerText = `🚀 OpenChat Modu Açıldı! Herkes tahmin yapabilir.`;
    openChatNotification.style.backgroundColor = "red";
    openChatNotification.style.display = "block";

    openChatArea.style.bottom = "0";

    setTimeout(() => {
      console.log("Hiding openChatNotification...");
      openChatNotification.style.display = "none";
    }, 3000);

    if (typeof startOpenChatCountdown === "function") {
      console.log("Starting OpenChat Countdown...");
      startOpenChatCountdown();
    } else {
      console.error("Error: startOpenChatCountdown function is not defined!");
    }
  } else {
    console.log("OpenChat Mode is being deactivated...");

    openChatArea.classList.remove("open-chat-active");

    openChatNotification.innerText = `🔒 OpenChat Modu Kapatıldı!`;
    openChatNotification.style.backgroundColor = "black";
    openChatNotification.style.display = "block";

    openChatArea.style.bottom = "-250px";

    setTimeout(() => {
      console.log("Hiding openChatNotification...");
      openChatNotification.style.display = "none";
    }, 3000);
  }
});

function deneme(data){
  console.log("Received openChatMode event:", data); // Gelen veriyi logla

  openChatMode = true;
  console.log("Updated openChatMode:", openChatMode); // Güncellenmiş durumu kontrol et

  const openChatNotification = document.getElementById("openChatNotification");
  if (!openChatNotification) {
    console.error("Error: #openChatNotification element not found!");
    return;
  }

  const openChatArea = document.getElementById("openChatArea");
  if (!openChatArea) {
    console.error("Error: #openChatArea element not found!");
    return;
  }

  if (openChatMode) {
    console.log("OpenChat Mode is being activated...");

    openChatArea.style.display = "flex";
    openChatArea.classList.add("open-chat-active");

    setTimeout(() => {
      console.log("Scrolling to bottom...");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 300);

    openChatNotification.innerText = `🚀 OpenChat Modu Açıldı! Herkes tahmin yapabilir.`;
    openChatNotification.style.backgroundColor = "red";
    openChatNotification.style.display = "block";

    openChatArea.style.bottom = "0";

    setTimeout(() => {
      console.log("Hiding openChatNotification...");
      openChatNotification.style.display = "none";
    }, 3000);

    if (typeof startOpenChatCountdown === "function") {
      console.log("Starting OpenChat Countdown...");
      startOpenChatCountdown();
    } else {
      console.error("Error: startOpenChatCountdown function is not defined!");
    }
  } else {
    console.log("OpenChat Mode is being deactivated...");

    openChatArea.classList.remove("open-chat-active");

    openChatNotification.innerText = `🔒 OpenChat Modu Kapatıldı!`;
    openChatNotification.style.backgroundColor = "black";
    openChatNotification.style.display = "block";

    openChatArea.style.bottom = "-250px";

    setTimeout(() => {
      console.log("Hiding openChatNotification...");
      openChatNotification.style.display = "none";
    }, 3000);
  }
}

function startOpenChatCountdown() {
  let countdown = 10;
  countdownText.innerText = countdown;
  countdownText.style.display = "block";

  const countdownInterval = setInterval(() => {
    countdown--;
    countdownText.innerText = countdown;

    if (countdown === 0) {
      clearInterval(countdownInterval);
      countdownText.style.display = "none";
      socket.emit("startOpenChatRound");
    }
  }, 1000);
}

socket.on("connect", () => {
  console.log("✅ Connected to server!");
});

socket.on("disconnect", () => {
  console.warn("❌ Disconnected from server. Trying to reconnect...");
});

socket.on("connect_error", (error) => {
  console.error("⚠️ Socket connection error:", error);
});

socket.on("leaderboardUpdate", (data) => {
  console.log("📊 Leaderboard güncellemesi alındı:", data);

  const leaderboardContainer = document.querySelector(".leaderboard");
  leaderboardContainer.innerHTML = '<h3 class="leaderboard-title">LeaderBoard</h3>';
  
  data.forEach((player) => {
    leaderboardContainer.innerHTML += `<p class="leaderboard-playername">${player.Name || "Unknown"}: ${player.Score || 0}</p>`;
  });
});


async function fetchLeaderboard() {
  try {
    const response = await fetch(`${BACKEND_URL}/leaderboard`);
    const data = await response.json();
    console.log("📊 Gelen Leaderboard Verisi:", data); 

    const leaderboardContainer = document.querySelector(".leaderboard");
    leaderboardContainer.innerHTML =
      '<h3 class="leaderboard-title">LeaderBoard</h3>';

    data.forEach((player) => {
      leaderboardContainer.innerHTML += `<p class="leaderboard-playername">${player.Name || "Unknown"}: ${player.Score || 0}</p>`;
    });
  } catch (error) {
    console.error("⚠️ Leaderboard çekme hatası:", error);
  }
}


let countdownTimer;
let timeLeft = 40;

function startCountdown() {
  console.log("geri sayim basladi");
  clearInterval(countdownTimer); 
  timeLeft = 40;

  const timerText = document.getElementById("timer-text");
  const timerBar = document.getElementById("timer-bar");

  if (!timerBar || !timerText) {
    console.log("Timer elements not found!");
    return;
  }

  // Reset initial values
  timerText.textContent = `${timeLeft}s`;
  timerBar.style.width = "100%";

  let startTime = Date.now();
  countdownTimer = setInterval(() => {
    let elapsed = Math.floor((Date.now() - startTime) / 1000);
    timeLeft = 40 - elapsed;

    let progress = (timeLeft / 40) * 100;
    timerBar.style.width = `${progress}%`;

    // ✅ Update text countdown
    timerText.textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(countdownTimer);
      timerText.textContent = `⏳ Time's up!`;
      timerBar.style.width = "0%";
    }
  }, 1000);
}


socket.on("gameStart", (data) => {
  console.log(`🟢 Received gameStart event!`);
  console.log(`🔵 New player: ${data.playername}`);
  console.log(`🟡 Word received: ${data.word.word}`);

  if (openChatMode) {
    renderOpenChatWord(data.word.word);
  } else {
    playGameStartSound();
    setcurrentplayer(data.playername);
    renderWord(data.word.word, data.word.definition);
  }

  playGameStartSound();
  startCountdown();
});


socket.on("correctGuess", (data) => {
  console.log("✅ Correct guess received! Revealing word.");
  correctGuessSound();

  const wordContainer = document.getElementById("word");
  wordContainer.innerHTML = "";
  
  data.word.split("").forEach((char, index) => {
    setTimeout(() => {
      const li = document.createElement("li");
      li.textContent = char;
      li.classList.add("word-reveal");
      wordContainer.appendChild(li);
    }, index * 300);
  });

  
  let blinkCount = 0;
  const blinkInterval = setInterval(() => {
    wordContainer.style.backgroundColor = blinkCount % 2 === 0 ? "green" : "";
    blinkCount++;
    if (blinkCount === 3) {
      clearInterval(blinkInterval);
      wordContainer.style.backgroundColor = "";
    }
  }, 1000);

  clearInterval(countdownTimer);
  document.getElementById("timer-bar").style.width = "0%";
  document.getElementById("timer-text").textContent = "";

  setTimeout(() => {
    resetGame();
  }, 5000);
});

function correctGuessSound(){
  Correctguessaudio.play();
}

function playGameStartSound() {
  GameStartaudio.play();
}

socket.on("wrongGuess", () => {
  console.log("❌ Yanlış tahmin!");
  playSoundWrongGuess();

  const wordContainer = document.getElementById("word");
  let blinkCount = 0;

  const blinkInterval = setInterval(() => {
    wordContainer.style.backgroundColor = blinkCount % 2 === 0 ? "red" : "";
    blinkCount++;
    if (blinkCount === 3) {
      clearInterval(blinkInterval);
      wordContainer.style.backgroundColor = "";
    }
  }, 700);
});

function playSoundWrongGuess() {
  let audio = new Audio(`./sounds/wrongguess.mp3`);
  audio.play();
}

function setcurrentplayer(playername) {
  const player = document.getElementById("playerName");
  player.innerText = playername;
}

function renderWord(word, definition) {
  const wordContainer = document.getElementById("word");
  const description = document.getElementById("definition");
  wordContainer.innerHTML = "";
  description.innerText = definition;

  word.split("").forEach(() => {
    const li = document.createElement("li");
    li.textContent = "-";
    wordContainer.appendChild(li);
  });

}

socket.on("resetGame", () => {
  resetGame();
});

function resetGame() {
  document.getElementById("playerName").innerText =
    "!hello yazarak başlayabilirsiniz!";
  document.getElementById("definition").innerText = ".....";

  clearInterval(countdownTimer);
  document.getElementById("timer-bar").style.width = "0%";
  document.getElementById("timer-text").textContent = "";
}

const openChatNotification = document.createElement("div");
openChatNotification.classList.add("open-chat-notification");
document.body.appendChild(openChatNotification);

function showOpenChatMode() {
  openChatNotification.innerHTML = `🚀 OpenChat Modu Açıldı! Herkes tahmin yapabilir.`;
  openChatNotification.style.display = "block";
  wordContainer.style.fontSize = "100px";
  fetchRandomWord();
}

function hideOpenChatMode() {
  openChatNotification.innerHTML = `🔒 OpenChat Modu Kapatıldı.`;
  setTimeout(() => {
    openChatNotification.style.display = "none";
  }, 3000);
  wordContainer.innerHTML = "";
}
