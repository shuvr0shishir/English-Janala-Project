const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(json => displayLevels(json.data))
}

const displayLevels = (Levels) => {
    const levelContainer = document.getElementById('level-container');
    levelContainer.innerHTML = '';

    Levels.forEach(lesson => {
        console.log(lesson);
        const btn = document.createElement('button');
        btn.innerHTML = `<button class="btn btn-outline btn-primary">
                <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
                </button>
        `
        levelContainer.appendChild(btn);
    });

}

loadLessons()