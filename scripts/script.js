const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(json => displayLevels(json.data))
}

// dynamically load all lessons btn
loadLessons()

const displayLevels = (Levels) => {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = '';

    Levels.forEach(lesson => {
        const btn = document.createElement('button');
        btn.innerHTML = `<button id ="lesson-btn-${lesson.level_no}" onclick = "loadLevelWord(${lesson.level_no})" class="lesson-btn btn btn-outline btn-primary">
                <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
                </button>
        `
        levelContainer.appendChild(btn);
    });

}

// tab toggle
const toggle = (id)=>{
    const allBtns = document.querySelectorAll('.lesson-btn');
    allBtns.forEach(btn =>{
        btn.classList.add('btn-outline');
    })
    const clickedBtn = document.getElementById(id);
    clickedBtn.classList.remove('btn-outline');
}


// word card generate
const loadLevelWord = (id) => {
    fetch(`https://openapi.programming-hero.com/api/level/${id}`)
        .then(res => res.json())
        .then(json => {
            toggle(`lesson-btn-${id}`)
            displayWords(json.data)
        })
}

const displayWords = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = ''

    if (words.length === 0) {
        const div = document.createElement('div');
        div.className = "text-center font-bangla col-span-full space-y-5 py-10"
        div.innerHTML = `<img class="mx-auto" src="./assets/alert-error.png" alt="">
        <p class="text-[#79716B] text-lg">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h3 class="font-bold text-4xl">নেক্সট Lesson এ যান</h3>
        `;

        wordContainer.appendChild(div);
        return;
    }

    words.forEach(word => {
        const wordCard = document.createElement('div')
        wordCard.className = "word-card bg-white text-center p-10 rounded-xl space-y-4"
        wordCard.innerHTML = `
                <h2 class="font-inter font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায় নি"}</h2>
                <p class="font-inter font-semibold text-xl">Meaning / Pronounciation</p>
                <p class="font-bangla font-medium  text-2xl text-[#5f5f62]">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায় নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায় নি"}"</p>
                <div class="flex justify-between items-center">
                    <button class="info-btn btn bg-[#1A91FF10] hover:bg-[#1A91FF50]"><i class="fa-solid fa-circle-info"></i></button>
                    <button class="sound-btn btn bg-[#1A91FF10] hover:bg-[#1A91FF50]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
        `;
        wordContainer.appendChild(wordCard);
    })
}