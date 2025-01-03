const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function() {
    console.log('Connected to bridge server');
    loadHistory();
};

socket.onmessage = function(event) {
    const response = JSON.parse(event.data);
    document.getElementById('avgQuestPerDay').textContent = response.avgQuestPerDay.toFixed(2);
    document.getElementById('avgTimePerQuest').textContent = response.avgTimePerQuest.toFixed(2) + 'minutes';
};

function loadHistory() {
    const logList = document.getElementById('logList');
    logList.innerHTML = '';
    const quests = JSON.parse(localStorage.getItem('quests')) || [];
    const currentDT = new Date().toLocaleDateString();

    quests.forEach(quest => {
        if (quest.completed) {
            const questElement = document.createElement('div');
            questElement.className = 'quest';
            questElement.innerHTML = `
                <h3>${quest.title}</h3>
                <p>${quest.description}</p>
                <p>Completed on: ${quest.completedDate || currentDT}</p>
                <p>Time Taken: ${quest.timeTaken || 'N/A'} minutes </p>
            `;
            logList.append(questElement);
        }
    });

    socket.send(JSON.stringify({
        action: 'getStats',
        quests: quests.filter(quest => quest.completed)
    }));
}

loadHistory();