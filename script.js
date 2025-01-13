const wordContainer = document.querySelector('.word');

const BACKEND_URL = "https://wordify-4ce3ae3ced68.herokuapp.com";



async function fetchRandomWord() {
    try {
        const response = await fetch(BACKEND_URL); // Backend API'sine istek
        const data = await response.json(); 

        const word = data.word; // Kelime
        const definition = data.definition; // Tanım

        // DOM Güncelleme
        const descrip = document.getElementById("definition");
        descrip.innerText = definition;

        renderWord(word); // Kelimeyi ekrana yerleştir
    } catch (error) {
        console.error('Error fetching random word:', error);
    }
}


function renderWord(word) {
    const wordContainer = document.querySelector('.word');
    wordContainer.innerHTML = ''; // Önceki kelimeyi temizle

    word.split('').forEach(() => {
        const li = document.createElement('li');
        li.textContent = '-'; // Harfler başlangıçta gizli
        wordContainer.appendChild(li);
    });
}

fetchRandomWord();
