const socket = new WebSocket('ws://localhost:8080');
let quests = JSON.parse(localStorage.getItem('quests')) || [];
const questForm = document.getElementById('questForm');
const questList = document.getElementById('questList');
const submitButton = document.getElementById('submitButton');

socket.onopen = function() {
    console.log('Connected to bridge server');
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

async function saveQuest(event) {
    event.preventDefault();

    const questId = document.getElementById('questId').value;
    const currentDT = await getCurrentDateTime();
    const quest = {
        title: document.getElementById('questTitle').value,
        description: document.getElementById('questDesc').value,
        dueDate: document.getElementById('dueDate').value,
        priority: document.getElementById('priority').value,
        completed: false,
        createdAt: currentDT
    };

    if (questId === '') {
        quests.push(quest);
    } else {
        quests[parseInt(questId)] = quest;
    }

    localStorage.setItem('quests', JSON.stringify(quests));
    questForm.reset();
    document.getElementById('questId').value = '';
    submitButton.textContent = 'Add Quest';
    displayQuests();
}


function displayQuests() {
    questList.innerHTML = '';
    quests.forEach((quest, index) => {
        const questItem = document.createElement('div');
        questItem.className = 'quest-item';
        questItem.innerHTML = `
            <h3>${quest.title}</h3>
            <p>${quest.description}</p>
            <p>Due: ${quest.dueDate}</p>
            <p>Priority: ${quest.priority}</p>
            <button onclick="editQuest(${index})">Edit</button>
            <button onclick="deleteQuest(${index})">Delete</button>
        `;
        questList.appendChild(questItem);
    });
}

function editQuest(index) {
    const quest = quests[index];
    document.getElementById('questId').value = index;
    document.getElementById('questTitle').value = quest.title;
    document.getElementById('questDesc').value = quest.description;
    document.getElementById('dueDate').value = quest.dueDate;
    document.getElementById('priority').value = quest.priority;
    submitButton.textContent = 'Update Task';
}

function deleteQuest(index) {
    if (confirm('Are you sure you want to delete this Quest?')) {
        quests.splice(index, 1);
        localStorage.setItem('quests', JSON.stringify(quests));
        displayQuests();
    }
}

questForm.addEventListener('submit', saveQuest);

displayQuests();