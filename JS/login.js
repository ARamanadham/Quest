const socket = new WebSocket('ws://localhost:8080')

socket.onopen = function() {
    console.log('Connected to bridge server');
};

socket.onmessage = function(event) {
    const response = JSON.parse(event.data);

    if (response.username) {
        document.getElementById('registerUsername').value = response.username;
    }
    if (response.password) {
        document.getElementById('registerPassword').value = response.password;
        document.getElementById('confirmPassword').value = response.password;
        document.getElementById('passwordDisplay').textContent = response.password;
        document.getElementById('generatePassword').style.display = 'block';
    }
};

function generateCredentials() {
    const request = {
        username: true,
        password: {
            generatePassword: true,
            length: 6,
            uppercase: true,
            lowercase: true,
            special: false,
            numbers: false
        }
    };
    socket.send(JSON.stringify(request));
}

function copyPassword() {
    const passwordDisplay = document.getElementById('passwordDisplay');
    const tempInput = document.createElement('input');
    tempInput.value = passwordDisplay.textContent;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Password copied to clipboard!');
}

function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');
}

document.getElementById('login').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        localStorage.setItem('user', JSON.stringify({username, password}));
        window.location.href = 'quest_home.html';
    } else {
        alert('Username and password cannot be blank');
    }
});

document.getElementById('register').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (username && password && confirmPassword) {
        if (password === confirmPassword) {
            localStorage.setItem('user', JSON.stringify({username, password}));
            alert('Registration successful! You can now log in.');
            toggleForm();
        } else {
            alert('Passwords do not match');
        }
    } else {
        alert('All fields are required');
    }
});