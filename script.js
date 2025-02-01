const wordContainer = document.querySelector('.word');
const BACKEND_URL = "https://api-wordify.com";
const socket = io(BACKEND_URL);
let openChatMode = false; 

const openChatArea = document.getElementById("openChatArea");

const countdownText = document.createElement("h1");
countdownText.classList.add("countdown-text");
document.body.appendChild(countdownText);

socket.on("openChatMode", (data) => {
    if (data.status) {
        openChatArea.classList.add("open-chat-active");
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }, 300);
        startOpenChatCountdown();
    } else {
        openChatArea.classList.remove("open-chat-active");
    }
});

function startOpenChatCountdown() {
    let countdown = 5;
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

async function fetchLeaderboard() {
    try {
        const response = await fetch(`${BACKEND_URL}/leaderboard`);
        const data = await response.json();
        const leaderboardContainer = document.querySelector('.leaderboard');
        leaderboardContainer.innerHTML = '<h3 class="leaderboard-title">LeaderBoard:</h3>';
        data.forEach(player => {
            leaderboardContainer.innerHTML += `<p class="leaderboard-playername">${player.username}: ${player.score}</p>`;
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
    }
}

setInterval(fetchLeaderboard, 5000);

let countdownTimer;  
let timeLeft = 40;   

function startCountdown() {
    clearInterval(countdownTimer);  
    timeLeft = 40; 

    const timerText = document.getElementById("timer-text");  
    const timerBar = document.getElementById("timer-bar");

    if (!timerBar || !timerText) {
        console.log("Timer elements not found!");
        return;
    }

    timerText.textContent = `${timeLeft}s`;
    timerBar.style.width = "100%"; 

    let startTime = Date.now();
    countdownTimer = setInterval(() => {
        let elapsed = Math.floor((Date.now() - startTime) / 1000);
        timeLeft = 40 - elapsed;  

        let progress = (timeLeft / 40) * 100;
        timerBar.style.width = `${progress}%`;
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
        setcurrentplayer(data.playername);
        renderWord(data.word.word);
    }

    playSound();
    const descrip = document.getElementById("definition");
    if (descrip) {
        descrip.innerText = data.word.definition;
    }

    startCountdown();
});

socket.on("openChatWinner", (data) => {
    const openChatWordContainer = document.getElementById("openChatWord");
    openChatWordContainer.innerHTML = ''; 

    const winnerText = document.createElement("h2");
    winnerText.innerText = `🎉 ${data.winner}`;
    winnerText.classList.add("winner-reveal");
    openChatWordContainer.appendChild(winnerText);

    data.word.split('').forEach((char, index) => {
        setTimeout(() => {
            const li = document.createElement('li');
            li.textContent = char;
            li.classList.add("word-reveal");
            openChatWordContainer.appendChild(li);
        }, index * 300);
    });

    let blinkCount = 0;
    const blinkInterval = setInterval(() => {
        winnerText.style.backgroundColor = blinkCount % 2 === 0 ? 'green' : '';
        openChatWordContainer.style.backgroundColor = blinkCount % 2 === 0 ? 'green' : '';
        blinkCount++;
        if (blinkCount === 6) {
            clearInterval(blinkInterval);
            winnerText.style.backgroundColor = '';
            openChatWordContainer.style.backgroundColor = '';
        }
    }, 500);

    setTimeout(() => {
        winnerText.remove();
    }, 3000);
});

function playSound() {
    let audio = new Audio(`/sounds/gamestart.ogg`); 
    audio.play();
}

function setcurrentplayer(playername){
    const player = document.getElementById("playerName");
    player.innerText = playername;
}

socket.on("resetGame", () => {
   resetGame();
});

function resetGame(){
    document.getElementById("playerName").innerText = "!hello yazarak başlayabilirsiniz!";
    document.getElementById("definition").innerText = ".....";
    
    clearInterval(countdownTimer); 
    document.getElementById("timer-bar").style.width = "0%"; 
    document.getElementById("timer-text").textContent = "";
}

function renderOpenChatWord(word) {
    const openChatWordContainer = document.getElementById("openChatWord");
    openChatWordContainer.innerHTML = '';

    word.split('').forEach(() => {
        const li = document.createElement('li');
        li.textContent = '-';
        openChatWordContainer.appendChild(li);
    });
}

const openChatNotification = document.createElement('div');
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
