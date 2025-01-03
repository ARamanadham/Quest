const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function() {
    console.log('Connected to bridge server');
    loadAchievements();
};

socket.onmessage = function(event) {
    const response = JSON.parse(event.data);
    displayAchievements(response.achievements);
};

function loadAchievements() {
    const quests = JSON.parse(localStorage.getItem('quests')) || [];
    socket.send(JSON.stringify({
        action: 'getAchievements',
        quests: quests
    }));
}

function displayAchievements(achievements) {
    const achievementList = document.getElementById('achievementList');
    achievementList.innerHTML = '';
    achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement';
        achievementElement.innerHTML = `
        <h3>${achievement.name}</h3>
        <p>${achievement.description}</p>
        <p>Progress: ${achievement.progress}/${achievement.target}</p>`;
        achievementList.appendChild(achievementElement);
    });
}

loadAchievements();
displayAchievements([]);