const wordContainer = document.querySelector(".word");
const BACKEND_URL = "https://api-wordify.com";
const socket = io(BACKEND_URL);
let openChatMode = false;
const Correctguessaudio = new Audio(`./sounds/correctguess.mp3`);
const GameStartaudio = new Audio(`./sounds/gamestart.ogg`);
const countdownText = document.getElementById("countdownText");
const countdownContainer = document.getElementById("countdown-container");
const countdowntitle = document.getElementById("countdown-title");
const currentplayer = document.getElementById("currentplayer-text");




//#region  Openchat Kontrol
//hem acik hem kapalisi icin calisacak true false degeri direk backend den geliyor.


//#endregion

async function startOpenChatCountdown(time) {
  let countdown = time;
  countdownText.innerText = countdown;

  const countdownInterval = setInterval(() => {
    countdown--;
    countdownText.innerText = countdown;

    if (countdown === 0) {
      clearInterval(countdownInterval);

      socket.emit("startOpenChatRound");
      countdownContainer.classList.add("hidden");
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

socket.on("openChatMode", (data) => {
  console.log("Backend openChatMode status:", data.status); 
  openChatMode = data.status; // Eğer tersse, bunu !data.status yap
  
  openchatModeSwitch();
  renderWord(data.word, data.definition);
});

function openchatModeSwitch() {
  let timerbar = document.getElementById("timercontainer"); 
  
  if (openChatMode) {
    console.log("✅ OpenChat Mode is being activated...");
    countdownContainer.classList.remove("hidden");
    countdowntitle.innerText = "Açık sohbet modu açılıyor...";
    startOpenChatCountdown(5);
   
    timerbar.style.display = "none";
    document.querySelector(".content-container").style.backgroundColor = "red";
    currentplayer.innerHTML = ""; 
   
  } else {
    console.log("❌ OpenChat Mode is being deactivated...");
    countdownContainer.classList.remove("hidden");
    countdowntitle.innerText = "Açık sohbet modu kapatılıyor...";
    startOpenChatCountdown(5);

    document.querySelector(".content-container").style.backgroundColor = "purple";
    timerbar.style.display = "block";
    
    currentplayer.innerHTML = `
      Mevcut oyuncu:
      <span id="playerName"> !hello yazarak başlayabilirsiniz!</span>
    `;
  }
}

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
  console.log(`openchatmode: ${openChatMode}`);


  if (openChatMode) {
    renderOpenChatWord(data.word.word);
  } else {
    playGameStartSound();
    setcurrentplayer(data.playername);
    renderWord(data.word);
  }

  playGameStartSound();
  startCountdown();
});

socket.on("gameStartOpenChat", (data) => {
  console.log(`🟢 Received gameStartOpenChat event!`);
  console.log(`🟡 Word received: ${data.word.word}`);

  if (openChatMode) {
    renderOpenChatWord(data.word.word);
  } else {
    playGameStartSound();
    renderWord(data.word.word, data.word.definition);
  }

  playGameStartSound();
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

socket.on("correctGuessOpenChat", (data) => {
  console.log("✅ Correct guess received openchat! Revealing word.");
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

  let message = document.getElementById("currentplayer-text");
  message.innerText = `Kelimeyi bilen oyuncu: ${data.username}`;
  
  startOpenChatCountdown(5);
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

function renderWord(wordObj) {
  
  console.log("🔎 Debug: Word received in renderWord:", wordObj.word);
  console.log("🔎 Debug: Type of word:", typeof wordObj);

  const wordContainer = document.getElementById("word");
  const description = document.getElementById("definition");
  wordContainer.innerHTML = "";
  console.log(`${wordObj.definition}`);
  description.innerText = wordObj.definition;

  (wordObj.word).split("").forEach(() => {
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
