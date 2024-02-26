var localStorageKey = 'to-do-list-gn';

function validateIfExistsNewTask() {
    var values = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
    var inputValue = document.getElementById('input-new-task').value;
    var exists = values.find(x => x.name === inputValue);
    return !!exists;
}

function newTask() {
    let input = document.getElementById('input-new-task');
    input.style.border = '';
    let user = JSON.parse(localStorage.getItem('logado') || "{}");
    let userId = user.id;
    if (!input.value) {
        input.style.border = '1px solid red';
        alert('Digite algo para inserir em sua lista');
        return;
    }
    if (validateIfExistsNewTask()) {
        alert('Já existe uma task com essa descrição');
        return;
    }
    let values = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
    values.push({
        name: input.value,
        userId: userId // Assumindo um userId fixo; isso deve ser dinâmico em uma aplicação real
    });
    localStorage.setItem(localStorageKey, JSON.stringify(values));
    showValues();
    input.value = '';
}

function showValues() {
    var user = JSON.parse(localStorage.getItem('logado'));
    var values = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
    var sortedValues = values.filter(item => item.userId === user.id);
    console.log(sortedValues);
    var list = document.getElementById('to-do-list');
    console.log(user, values, sortedValues, list);
    list.innerHTML = '';
    sortedValues.forEach(function (item) {
        list.innerHTML += `<li>${item.name}<button id='btn-ok' onclick='removeItem("${item.name}")'><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg></button></li>`;
    });
}

function removeItem(data) {
    var values = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
    var index = values.findIndex(task => task.name === data);
    if (index > -1) {
        values.splice(index, 1);
    }
    localStorage.setItem(localStorageKey, JSON.stringify(values));
    showValues();
}

function createUser(username, password) {
    var users = JSON.parse(localStorage.getItem('users') || "[]");
    var lastId = parseInt(localStorage.getItem('lastId') || "0");
    lastId++;

    var newUser = {
        id: lastId,
        username: username,
        password: password // Em produção, a senha deve ser criptografada
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('lastId', lastId.toString());
}

function login() {
    var usernameInput = document.getElementById('usernameInput').value;
    var passwordInput = document.getElementById('passwordInput').value;
    var users = JSON.parse(localStorage.getItem('users') || "[]");
    var validUser = users.find(user => user.password === passwordInput && user.username === usernameInput);

    if (validUser) {
        sessionStorage.setItem('user', JSON.stringify(validUser));
        window.location.href = './index.html';
    } else {
        alert('Usuário ou senha inválidos!');
    }
}

function addUser(username, password) {
    var users = JSON.parse(localStorage.getItem('users') || "[]");
    var lastId = parseInt(localStorage.getItem('lastId') || "0");

    var userExists = users.some(user => user.username === username);
    if (userExists) {
        alert('Usuário já existe!');
        return;
    }

    lastId++;
    var newUser = {
        id: lastId,
        username: username,
        password: password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('lastId', lastId.toString());
    localStorage.setItem('logado', JSON.stringify({username: username, id: lastId, logged: true}));
    alert('Usuário adicionado com sucesso!');
    window.location.href = 'index.html'
}


function login() {
    const usernameInput = document.getElementById('iemail').value;
    const passwordInput = document.getElementById('isenha').value;
    const users = JSON.parse(localStorage.getItem('users') || "[]");
    const validUser = users.find(user => user.password === passwordInput && user.username === usernameInput);

    if (validUser) {
        localStorage.setItem('logado', JSON.stringify({username: validUser.username, id: validUser.id, logged: true}));
        window.location.href = 'index.html';
    } else {
        alert('Usuário ou senha inválidos!');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Verifica se a URL atual corresponde a 'index.html'
    showValues();
    if (window.location.pathname.endsWith('index.html')) {
        verificarLogin();
    }
});


function verificarLogin() {
    const usuarioLogado = JSON.parse(localStorage.getItem('logado'));
    if (!usuarioLogado || !usuarioLogado.logged) {
        // Altere o caminho para a página de login conforme necessário
        window.location.href = 'login.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Identifica a página atual baseada no pathname
    const path = window.location.pathname;
    const isLoginPage = path.includes('login.html') || path === '/' || path.endsWith('/login'); // Ajuste conforme necessário
    const isIndexPage = path.includes('index.html') || path.endsWith('/index'); // Ajuste conforme necessário

    if (isLoginPage) {
        verificarLoginParaLogin();
    } else if (isIndexPage) {
        verificarLoginParaIndex();
    }

    // Configura o botão de logout se presente
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', deslogar);
    }
});

function verificarLoginParaLogin() {
    const usuarioLogado = JSON.parse(localStorage.getItem('logado'));
    // Se já estiver logado, redireciona para a index.html
    if (usuarioLogado && usuarioLogado.logged) {
        window.location.href = 'index.html';
    }
}

function verificarLoginParaIndex() {
    const usuarioLogado = JSON.parse(localStorage.getItem('logado'));
    // Se não estiver logado, redireciona para a login.html
    if (!usuarioLogado || !usuarioLogado.logged) {
        window.location.href = 'login.html';
    }
}

function deslogar() {
    localStorage.removeItem('logado');
    window.location.href = 'login.html';
}

