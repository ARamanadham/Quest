const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function() {
    console.log('Connected to bridge server');
    loadQuests();
};

function getCurrentDateTime() {
    return new Promise((resolve, reject) => {
        socket.send(JSON.stringify({action: 'getCurrentDateTime'}));

        socket.onmessage = function(event) {
            const response = JSON.parse(event.data);
            resolve(response.datetime);
        };
    });
}

async function loadQuests() {
    const questList = document.getElementById('questList');
    questList.innerHTML = '';
    const quests = JSON.parse(localStorage.getItem('quests')) || [];

    quests.forEach((quest, index) => {
        if (!quest.completed) {
            const questElement = document.createElement('div');
            questElement.className = 'quest';
            questElement.innerHTML = `
            <h3>${quest.title}</h3>
            <p>${quest.description}</p>
            <p>Due: ${quest.dueDate}</p>
            <p>Priority: ${quest.priority}</p>
            <button onclick="completeQuest(${index})">Complete</button>`;
            questList.appendChild(questElement);
        }
    });
}

async function completeQuest(index) {
    let quests = JSON.parse(localStorage.getItem('quests')) || [];
    const currentDT = await getCurrentDateTime();
    quests[index].completed = true;
    quests[index].completedAt = currentDT;

    const createdAt = new Date(quests[index].createdAt);
    const completedAt = new Date(currentDT);
    const timeTaken = (completedAt - createdAt) / (1000 * 60);
    quests[index].timeTaken = timeTaken;

    localStorage.setItem('quests', JSON.stringify(quests));
    loadQuests();
}