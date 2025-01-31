const wordContainer = document.querySelector('.word');

const BACKEND_URL = "https://wordify-4ce3ae3ced68.herokuapp.com";
const socket = io(BACKEND_URL); 


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



socket.on("newplayer", (data) => {
    setcurrentplayer(data.playername);
    console.log(`got new player ${data.playername}`);
});

socket.on("newword", (data) => {
    renderWord(data.currentword.word);  
    console.log(`new word processed as ${data.currentword.word}`);
});


function setcurrentplayer(playername){
    const player = document.getElementById("playerName");
    player.innerText = playername;
    console.log(`player shown on screen`);

}

socket.on("resetGame", () => {
    const player = document.getElementById("playerName");
    console.log(`game reset command succesfull`);
    if (player) {
        player.innerText = "type !play to play!";
    }
});


socket.on("correctGuess", (data) => {
    console.log("revealing word.");
    revealWord(data.word);
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

fetchRandomWord();

