const searchfnc = async(id) => {
    //tab highlight reset
    const allBtns = document.querySelectorAll('.lesson-btn');
    allBtns.forEach(btn => {
        btn.classList.add('btn-outline');
    })


    document.getElementById('warning').classList.add('hidden')
    const input = document.getElementById(id).value;
    if (input === '' || input === ' ') {
        document.getElementById('warning').classList.remove('hidden')
        return;
    }
    manageLoading(true);

    const res = await fetch("https://openapi.programming-hero.com/api/words/all");
    const data = await res.json();
    let allWords = data.data

    const filteredWords = allWords.filter(i => i.word.toLowerCase().includes(input.toLowerCase()) )
    displayWords(filteredWords);


    manageLoading(false);
}

const manageLoading = (status) => {
    if (status) {
        document.getElementById('loading-ele').classList.remove('hidden')
        document.getElementById('word-container').classList.add('hidden')
    } else {
        document.getElementById('loading-ele').classList.add('hidden')
        document.getElementById('word-container').classList.remove('hidden')
    }
}

const displayWordDetails = (word) => {
    const wordDetailContainer = document.getElementById('word-detaiils-container');

    // "word": "Benevolent",
    // "meaning": "দয়ালু",
    // "pronunciation": "বেনেভোলেন্ট",
    // "level": 6,
    // "sentence": "The benevolent man donated food to the poor.",
    // "points": 4,
    // "partsOfSpeech": "adjective",
    // "synonyms": [
    // "kind",
    // "generous",
    // "compassionate"
    // ],
    // "id": 2


    let synonyms = word.synonyms;
    let allBadgesEle = synonyms.map(i => `<div class="badge badge-soft badge-primary mr-2 p-4 text-black">${i}</div>`)
    allBadgesEle = allBadgesEle.join(' ');

    wordDetailContainer.innerHTML = `<div>
            <h2 class = "font-semibold text-xl">${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})</h2>
        </div>
        <div>
            <h3 class = "font-semibold text-lg mb-2">Meaning</h3>
            <p class = "font-bangla">${word.meaning} </p>
        </div>
        <div>
            <h3 class = "font-semibold text-lg mb-2">Example</h3>
            <p class = "">${word.sentence} </p>
        </div>
        <div>
            <h3 class = "font-bangla font-semibold text-lg mb-2">সমার্থক শব্দ গুলো</h3>
            ${allBadgesEle}
        </div>
    `

    document.getElementById('word_modal').showModal();
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();

    displayWordDetails(details.data);

    // fetch(url)
    //     .then(res => res.json())
    //     .then(data => {
    //         console.log(data);
    //     });
}

// display level word
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
        manageLoading(false);
        return;
    }

    // "id": 1,
    // "level": 3,
    // "word": "Abundant",
    // "meaning": null,
    // "pronunciation": "অবানডান্ট"

    words.forEach(word => {
        const wordCard = document.createElement('div')
        wordCard.className = "word-card bg-white text-center p-10 rounded-xl space-y-4"
        wordCard.innerHTML = `
                <h2 class="font-inter font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায় নি"}</h2>

                <p class="font-inter font-semibold text-xl">Meaning / Pronounciation</p>

                <p class="font-bangla font-medium  text-2xl text-[#5f5f62]">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায় নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায় নি"}"</p>

                <div class="flex justify-between items-center">
                    <button onclick="loadWordDetail(${word.id})" class="info-btn btn bg-[#1A91FF10] hover:bg-[#1A91FF50]"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="sound-btn btn bg-[#1A91FF10] hover:bg-[#1A91FF50]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
        `;
        wordContainer.appendChild(wordCard);
    })
    manageLoading(false);
}

// tab toggle
const toggle = (id) => {
    const allBtns = document.querySelectorAll('.lesson-btn');
    allBtns.forEach(btn => {
        btn.classList.add('btn-outline');
    })
    const clickedBtn = document.getElementById(id);
    clickedBtn.classList.remove('btn-outline');
}

// word card generate
const loadLevelWord = (id) => {
    manageLoading(true);
    fetch(`https://openapi.programming-hero.com/api/level/${id}`)
        .then(res => res.json())
        .then(json => {
            toggle(`lesson-btn-${id}`)
            displayWords(json.data)   //passing array
        })
}

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

const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(json => displayLevels(json.data))
}

// dynamically load all lessons btn
loadLessons()