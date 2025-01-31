const wordContainer = document.querySelector('.word');

const BACKEND_URL = "https://wordify-4ce3ae3ced68.herokuapp.com";
const socket = io(BACKEND_URL); 

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
        leaderboardContainer.innerHTML = "<h3>LeaderBoard:</h3>";
        data.forEach(player => {
            leaderboardContainer.innerHTML += `<p>${player.username}: ${player.score}</p>`;
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
    timerBar.style.width = "100%"; // Start full

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

    setcurrentplayer(data.playername);
    renderWord(data.word.word);

    const descrip = document.getElementById("definition");
    if (descrip) {
        descrip.innerText = data.word.definition;
    }

    startCountdown();
});




// socket.on("newplayer", (data) => {
//     setcurrentplayer(data.playername);
//     startCountdown();
//     console.log(`got new player ${data.playername}`);
// });

// socket.on("newword", (data) => {
//     if (data.currentword) {
//         console.log(`New word received: ${data.currentword.word}`);
//         renderWord(data.currentword.word);  

//         // Update the definition on screen
//         const descrip = document.getElementById("definition");
//         if (descrip) {
//             descrip.innerText = data.currentword.definition;
//         }
//     }
// });


function setcurrentplayer(playername){
    const player = document.getElementById("playerName");
    player.innerText = playername;
    console.log(`player shown on screen`);

}

socket.on("resetGame", () => {
    document.getElementById("playerName").innerText = "type !play / !play yazip oynayabilirsiniz!";
    document.getElementById("definition").innerText = ".....";
    
    clearInterval(countdownTimer); 
    document.getElementById("timer-bar").style.width = "0%"; 
    document.getElementById("timer-text").textContent = "";

    console.log(`Game reset.`);
});




socket.on("correctGuess", (data) => {
    console.log("✅ Correct guess received! Revealing word.");
    revealWord(data.word);
    
    clearInterval(countdownTimer); 
    document.getElementById("timer-bar").style.width = "0%";
    document.getElementById("timer-text").textContent = "";
});




function revealWord(word) {
    const wordContainer = document.querySelector('.word');
    wordContainer.innerHTML = ''; 

    word.split('').forEach((char, index) => {
        setTimeout(() => {
            const li = document.createElement('li');
            li.textContent = char;  
            wordContainer.appendChild(li);
        }, index * 300); 
    });
}



async function fetchRandomWord() {
    try {
        const response = await fetch(`${BACKEND_URL}/random-word`); 
        const data = await response.json(); 

        if(data.word){
            const word = data.word; 
            const definition = data.definition;
            
            
            const descrip = document.getElementById("definition");
            if (descrip) {
                descrip.innerText = definition;
            }
            renderWord(word); 
            
        }
        else{
            const screenword = document.getElementById("word");
            screenword.innerHTML = "<li> type !play to get a word! </li>";
        }
    } catch (error) {
        console.error('Error fetching random word:', error);
    }
}


function renderWord(word) {
    const wordContainer = document.querySelector('.word');
    if (!wordContainer) return;
    wordContainer.innerHTML = ''; 

    word.split('').forEach(() => {
        const li = document.createElement('li');
        li.textContent = '-'; 
        wordContainer.appendChild(li);
    });
}



