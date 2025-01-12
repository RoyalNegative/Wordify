const wordContainer = document.querySelector('.word');
const word = 'galaxy'; 

function renderWord(word) {
    wordContainer.innerHTML = ''; 
    word.split('').forEach(() => {
        const li = document.createElement('li');
        li.textContent = '-'; 
        wordContainer.appendChild(li);
    });
}

renderWord(word);
