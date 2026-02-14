// Initialize data structures
let currentUser = null;
let users = JSON.parse(localStorage.getItem('users')) || [];
let news = JSON.parse(localStorage.getItem('news')) || [];
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let members = JSON.parse(localStorage.getItem('members')) || [];
let chats = JSON.parse(localStorage.getItem('chats')) || [];
let messages = JSON.parse(localStorage.getItem('messages')) || {};
let logs = JSON.parse(localStorage.getItem('logs')) || [];
let currentChat = null;

// Force initialize default admin user
if (users.length === 0) {
    console.log('Creating default admin user...');
    users.push({
        id: 1,
        username: 'admin',
        nickname: 'Администратор',
        password: 'admin123',
        avatar: 'https://via.placeholder.com/80',
        isAdmin: true,
        showOnline: true,
        notifications: true
    });
    localStorage.setItem('users', JSON.stringify(users));
}

// Force initialize sample data
if (news.length === 0) {
    console.log('Creating default news...');
    news = [
        {
            id: 1,
            title: 'Запуск новой платформы KAALITION',
            subtitle: 'Мы рады представить вам обновленную версию нашей платформы с множеством новых функций',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
            description: 'Сегодня мы запускаем полностью обновленную платформу KAALITION. Новая версия включает в себя современный интерфейс, улучшенную систему коммуникации и множество других функций, которые сделают взаимодействие участников более эффективным.',
            date: new Date().toISOString()
        },
        {
            id: 2,
            title: 'Новые участники команды',
            subtitle: 'К нам присоединились талантливые специалисты',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
            description: 'Мы рады приветствовать новых участников в нашей команде. Это позволит нам реализовывать более амбициозные проекты.',
            date: new Date().toISOString()
        }
    ];
    localStorage.setItem('news', JSON.stringify(news));
}

if (projects.length === 0) {
    console.log('Creating default projects...');
    projects = [
        {
            id: 1,
            title: 'Project Alpha',
            description: 'Инновационное решение для автоматизации бизнес-процессов',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            buttonText: 'Скачать',
            link: '#'
        }
    ];
    localStorage.setItem('projects', JSON.stringify(projects));
}

if (members.length === 0) {
    console.log('Creating default members...');
    members = [
        {
            id: 1,
            photo: 'https://via.placeholder.com/80',
            nickname: 'Admin',
            group: 'Разработчики',
            telegram: 'https://t.me/admin',
            itd: '#'
        }
    ];
    localStorage.setItem('members', JSON.stringify(members));
}

if (chats.length === 0) {
    chats = [];
    messages = {};
    localStorage.setItem('chats', JSON.stringify(chats));
    localStorage.setItem('messages', JSON.stringify(messages));
}

console.log('=== Initial Data Loaded ===');
console.log('Users:', users.length);
console.log('News:', news.length);
console.log('Projects:', projects.length);
console.log('Members:', members.length);
console.log('==========================');

// Save data to localStorage
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('news', JSON.stringify(news));
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('members', JSON.stringify(members));
    localStorage.setItem('chats', JSON.stringify(chats));
    localStorage.setItem('messages', JSON.stringify(messages));
    localStorage.setItem('logs', JSON.stringify(logs));
}

// Add log entry
function addLog(action, details) {
    logs.unshift({
        timestamp: new Date().toISOString(),
        user: currentUser ? currentUser.username : 'system',
        action: action,
        details: details
    });
    if (logs.length > 100) logs = logs.slice(0, 100);
    saveData();
}

// DOM Elements
const hamburgerMenu = document.getElementById('hamburgerMenu');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const navLinks = document.querySelectorAll('.nav-menu a');
const pages = document.querySelectorAll('.page');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const logoutBtn = document.getElementById('logoutBtn');

// Check if critical elements exist
if (!hamburgerMenu || !sidebar || !loginModal) {
    console.error('Critical DOM elements not found!');
    console.log('hamburgerMenu:', hamburgerMenu);
    console.log('sidebar:', sidebar);
    console.log('loginModal:', loginModal);
}

// Hamburger menu toggle
if (hamburgerMenu && sidebar) {
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        sidebar.classList.toggle('active');
    });
}

// Close sidebar when clicking outside
if (sidebar && hamburgerMenu) {
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !hamburgerMenu.contains(e.target) && sidebar.classList.contains('active')) {
            hamburgerMenu.classList.remove('active');
            sidebar.classList.remove('active');
        }
    });
}

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.dataset.page;
        
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        pages.forEach(p => p.classList.remove('active'));
        document.getElementById(pageId + 'Page').classList.add('active');
        
        hamburgerMenu.classList.remove('active');
        sidebar.classList.remove('active');
        
        // Load page content
        if (pageId === 'news') loadNews();
        else if (pageId === 'projects') loadProjects();
        else if (pageId === 'members') loadMembers();
        else if (pageId === 'messenger') loadMessenger();
        else if (pageId === 'admin') loadAdmin();
    });
});

// Login/Register
if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginModal) loginModal.classList.remove('active');
        if (registerModal) registerModal.classList.add('active');
    });
}

if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (registerModal) registerModal.classList.remove('active');
        if (loginModal) loginModal.classList.add('active');
    });
}

document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        loginModal.classList.remove('active');
        updateUserProfile();
        addLog('login', `User ${username} logged in`);
        loadNews();
    } else {
        alert('Неверный username или пароль');
    }
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const nickname = document.getElementById('registerNickname').value;
    const password = document.getElementById('registerPassword').value;
    
    if (users.find(u => u.username === username)) {
        alert('Пользователь с таким username уже существует');
        return;
    }
    
    const newUser = {
        id: users.length + 1,
        username,
        nickname,
        password,
        avatar: 'https://via.placeholder.com/80',
        isAdmin: false,
        showOnline: true,
        notifications: true
    };
    
    users.push(newUser);
    saveData();
    addLog('register', `New user registered: ${username}`);
    
    alert('Регистрация успешна! Теперь вы можете войти.');
    registerModal.classList.remove('active');
    loginModal.classList.add('active');
});

logoutBtn.addEventListener('click', () => {
    addLog('logout', `User ${currentUser.username} logged out`);
    currentUser = null;
    localStorage.removeItem('currentUser');
    location.reload();
});

// Update user profile in sidebar
function updateUserProfile() {
    document.getElementById('sidebarUserName').textContent = currentUser.nickname;
    document.getElementById('sidebarUserAvatar').src = currentUser.avatar;
    
    if (currentUser.isAdmin) {
        document.getElementById('adminPanelLink').style.display = 'block';
    }
}

// Load News
function loadNews() {
    const newsGrid = document.getElementById('newsGrid');
    newsGrid.innerHTML = '';
    
    const sortedNews = [...news].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedNews.forEach((item, index) => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item' + (index === 0 ? ' featured' : '');
        newsItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="news-image">
            <div class="news-content">
                <h3 class="news-title">${item.title}</h3>
                <p class="news-subtitle">${item.subtitle}</p>
            </div>
        `;
        newsItem.addEventListener('click', () => openNewsDetail(item));
        newsGrid.appendChild(newsItem);
    });
}

function openNewsDetail(item) {
    document.getElementById('newsDetailTitle').textContent = item.title;
    document.getElementById('newsDetailSubtitle').textContent = item.subtitle;
    document.getElementById('newsDetailImage').src = item.image;
    document.getElementById('newsDetailDescription').textContent = item.description;
    document.getElementById('newsModal').classList.add('active');
}

document.getElementById('closeNewsModal').addEventListener('click', () => {
    document.getElementById('newsModal').classList.remove('active');
});

// Load Projects
function loadProjects() {
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    
    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.innerHTML = `
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <a href="${project.link}" class="project-button" target="_blank">${project.buttonText}</a>
        `;
        projectsList.appendChild(projectItem);
    });
}

// Load Members
function loadMembers() {
    const membersGrid = document.getElementById('membersGrid');
    membersGrid.innerHTML = '';
    
    members.forEach(member => {
        const memberItem = document.createElement('div');
        memberItem.className = 'member-item';
        memberItem.innerHTML = `
            <div class="member-avatar">
                <img src="${member.photo}" alt="${member.nickname}">
            </div>
            <div class="member-info">
                <div class="member-nickname">${member.nickname}</div>
                <div class="member-group">${member.group}</div>
                <div class="member-links">
                    ${member.telegram ? `<a href="${member.telegram}" class="member-link" target="_blank">Telegram</a>` : ''}
                    ${member.itd ? `<a href="${member.itd}" class="member-link" target="_blank">ITD</a>` : ''}
                </div>
            </div>
        `;
        membersGrid.appendChild(memberItem);
    });
}

// Load Messenger
function loadMessenger() {
    const chatList = document.getElementById('chatList');
    const searchInput = document.getElementById('messengerSearch');
    const searchDropdown = document.getElementById('searchDropdown');
    
    // Show empty state initially
    chatList.innerHTML = '<div class="empty-state"><p>Используйте поиск выше, чтобы найти пользователя и начать диалог</p></div>';
    
    // Search functionality with dropdown
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            
            if (query.length === 0) {
                searchDropdown.classList.remove('active');
                return;
            }
            
            // Get all users except current user
            const allUsers = users.filter(u => u.id !== currentUser.id);
            
            // Filter users by username or nickname
            const filteredUsers = allUsers.filter(u => 
                u.username.toLowerCase().includes(query) || 
                u.nickname.toLowerCase().includes(query)
            ).slice(0, 5); // Show max 5 results
            
            if (filteredUsers.length > 0) {
                searchDropdown.innerHTML = '';
                filteredUsers.forEach(user => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = `
                        <div class="search-result-avatar">
                            <img src="${user.avatar}" alt="${user.nickname}">
                        </div>
                        <div class="search-result-info">
                            <div class="search-result-name">${user.nickname}</div>
                            <div class="search-result-username">@${user.username}</div>
                        </div>
                    `;
                    resultItem.addEventListener('click', () => {
                        startChatWithUser(user);
                        searchInput.value = '';
                        searchDropdown.classList.remove('active');
                    });
                    searchDropdown.appendChild(resultItem);
                });
                searchDropdown.classList.add('active');
            } else {
                searchDropdown.innerHTML = '<div class="empty-state"><p>Пользователи не найдены</p></div>';
                searchDropdown.classList.add('active');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                searchDropdown.classList.remove('active');
            }
        });
    }
}

function startChatWithUser(user) {
    // Find or create chat
    let chat = chats.find(c => c.userId === user.id);
    if (!chat) {
        chat = {
            id: Date.now(),
            userId: user.id,
            name: user.nickname,
            avatar: user.avatar,
            lastMessage: '',
            online: user.showOnline
        };
        chats.push(chat);
        saveData();
    }
    
    // Add chat to list
    const chatList = document.getElementById('chatList');
    chatList.innerHTML = '';
    
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item active';
    chatItem.innerHTML = `
        <div class="chat-item-avatar">
            <img src="${chat.avatar}" alt="${chat.name}">
        </div>
        <div class="chat-item-info">
            <div class="chat-item-name">${chat.name} (@${user.username})</div>
            <div class="chat-item-last-message">${chat.lastMessage || 'Начните диалог'}</div>
        </div>
    `;
    chatList.appendChild(chatItem);
    
    // Open chat
    currentChat = chat;
    document.querySelector('.chat-name').textContent = chat.name;
    document.querySelector('.chat-status').textContent = chat.online ? 'онлайн' : 'оффлайн';
    document.querySelector('.chat-avatar img').src = chat.avatar;
    
    // Enable input
    document.getElementById('messageInput').disabled = false;
    document.getElementById('sendMessageBtn').disabled = false;
    
    loadMessages(chat.id);
}

function openChat(chat) {
    currentChat = chat;
    document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    document.querySelector('.chat-name').textContent = chat.name;
    document.querySelector('.chat-status').textContent = chat.online ? 'онлайн' : 'оффлайн';
    document.querySelector('.chat-avatar img').src = chat.avatar;
    
    loadMessages(chat.id);
}

function loadMessages(chatId) {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';
    
    const chatMessages = messages[chatId] || [];
    
    chatMessages.forEach(msg => {
        const message = document.createElement('div');
        message.className = 'message' + (msg.userId === currentUser.id ? ' own' : '');
        
        const user = users.find(u => u.id === msg.userId);
        
        message.innerHTML = `
            <div class="message-avatar">
                <img src="${user ? user.avatar : 'https://via.placeholder.com/35'}" alt="User">
            </div>
            <div class="message-content">
                <div class="message-text">${msg.text}</div>
                <div class="message-time">${msg.time}</div>
            </div>
        `;
        messagesContainer.appendChild(message);
    });
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text || !currentChat) return;
    
    if (!messages[currentChat.id]) messages[currentChat.id] = [];
    
    const newMessage = {
        id: messages[currentChat.id].length + 1,
        userId: currentUser.id,
        text: text,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
    
    messages[currentChat.id].push(newMessage);
    
    // Update last message in chat
    const chat = chats.find(c => c.id === currentChat.id);
    if (chat) chat.lastMessage = text;
    
    saveData();
    addLog('message', `Message sent to chat ${currentChat.name}`);
    
    input.value = '';
    loadMessages(currentChat.id);
    loadMessenger();
}

// Settings
document.getElementById('saveProfileBtn').addEventListener('click', () => {
    currentUser.username = document.getElementById('settingsUsername').value;
    currentUser.nickname = document.getElementById('settingsNickname').value;
    currentUser.avatar = document.getElementById('settingsAvatar').value;
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    users[userIndex] = currentUser;
    
    saveData();
    addLog('profile_update', 'User profile updated');
    updateUserProfile();
    alert('Профиль успешно обновлен!');
});

document.getElementById('changePasswordBtn').addEventListener('click', () => {
    const oldPassword = document.getElementById('settingsOldPassword').value;
    const newPassword = document.getElementById('settingsNewPassword').value;
    
    if (oldPassword !== currentUser.password) {
        alert('Неверный текущий пароль');
        return;
    }
    
    if (!newPassword) {
        alert('Введите новый пароль');
        return;
    }
    
    currentUser.password = newPassword;
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    users[userIndex] = currentUser;
    
    saveData();
    addLog('password_change', 'Password changed');
    alert('Пароль успешно изменен!');
    
    document.getElementById('settingsOldPassword').value = '';
    document.getElementById('settingsNewPassword').value = '';
});

// Load settings when page opens
document.querySelector('[data-page="settings"]').addEventListener('click', () => {
    document.getElementById('settingsUsername').value = currentUser.username;
    document.getElementById('settingsNickname').value = currentUser.nickname;
    document.getElementById('settingsAvatar').value = currentUser.avatar;
    document.getElementById('settingsShowOnline').checked = currentUser.showOnline;
    document.getElementById('settingsNotifications').checked = currentUser.notifications;
});

// Admin Panel
function loadAdmin() {
    if (!currentUser.isAdmin) {
        alert('У вас нет доступа к админ-панели');
        return;
    }
    
    // Load statistics
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalNews').textContent = news.length;
    document.getElementById('totalProjects').textContent = projects.length;
    document.getElementById('totalMembers').textContent = members.length;
    
    // Load all admin content
    loadAdminLogs();
    loadAdminUsers();
    loadAdminNews();
    loadAdminProjects();
    loadAdminMembers();
    
    console.log('Admin panel loaded:', {
        news: news.length,
        projects: projects.length,
        members: members.length
    });
}

// Admin tabs
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tab.dataset.tab + 'Tab').classList.add('active');
        
        // Reload content when switching tabs
        const tabName = tab.dataset.tab;
        if (tabName === 'admin-news') {
            loadAdminNews();
        } else if (tabName === 'admin-projects') {
            loadAdminProjects();
        } else if (tabName === 'admin-members') {
            loadAdminMembers();
        } else if (tabName === 'logs') {
            loadAdminLogs();
        } else if (tabName === 'users') {
            loadAdminUsers();
        }
    });
});

function loadAdminLogs() {
    const logsContainer = document.getElementById('logsContainer');
    logsContainer.innerHTML = '';
    
    logs.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.textContent = `[${new Date(log.timestamp).toLocaleString()}] ${log.user}: ${log.action} - ${log.details}`;
        logsContainer.appendChild(logItem);
    });
}

function loadAdminUsers() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.username}</td>
            <td>${user.nickname}</td>
            <td>${user.isAdmin ? 'Админ' : 'Пользователь'}</td>
            <td>
                <button class="btn-small btn-edit" onclick="toggleAdmin(${user.id})">
                    ${user.isAdmin ? 'Убрать админа' : 'Сделать админом'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function toggleAdmin(userId) {
    const user = users.find(u => u.id === userId);
    user.isAdmin = !user.isAdmin;
    saveData();
    addLog('admin_toggle', `User ${user.username} admin status: ${user.isAdmin}`);
    loadAdminUsers();
}

// Make function globally accessible
window.toggleAdmin = toggleAdmin;

function loadAdminNews() {
    const list = document.getElementById('adminNewsList');
    
    console.log('Loading admin news. Total news:', news.length, news);
    
    if (!list) {
        console.error('adminNewsList element not found!');
        return;
    }
    
    list.innerHTML = '';
    
    if (!news || news.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>Новостей пока нет. Нажмите кнопку "+ Добавить новость" выше.</p></div>';
        console.log('No news to display');
        return;
    }
    
    console.log('Rendering', news.length, 'news items');
    
    news.forEach((item, index) => {
        console.log('Rendering news item:', index, item);
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
            <div style="flex: 1;">
                <strong>${item.title || 'Без названия'}</strong><br>
                <small style="color: var(--text-secondary);">${item.subtitle || ''}</small>
            </div>
            <div class="admin-item-actions">
                <button class="btn-small btn-edit" onclick="window.editNews(${item.id})">Изменить</button>
                <button class="btn-small btn-delete" onclick="window.deleteNews(${item.id})">Удалить</button>
            </div>
        `;
        list.appendChild(div);
    });
    
    console.log('Admin news loaded successfully');
}

function loadAdminProjects() {
    const list = document.getElementById('adminProjectsList');
    
    console.log('Loading admin projects. Total projects:', projects.length, projects);
    
    if (!list) {
        console.error('adminProjectsList element not found!');
        return;
    }
    
    list.innerHTML = '';
    
    if (!projects || projects.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>Проектов пока нет. Нажмите кнопку "+ Добавить проект" выше.</p></div>';
        console.log('No projects to display');
        return;
    }
    
    console.log('Rendering', projects.length, 'project items');
    
    projects.forEach((item, index) => {
        console.log('Rendering project item:', index, item);
        const div = document.createElement('div');
        div.className = 'admin-item';
        const description = item.description || '';
        const shortDesc = description.length > 50 ? description.substring(0, 50) + '...' : description;
        div.innerHTML = `
            <div style="flex: 1;">
                <strong>${item.title || 'Без названия'}</strong><br>
                <small style="color: var(--text-secondary);">${shortDesc}</small>
            </div>
            <div class="admin-item-actions">
                <button class="btn-small btn-edit" onclick="window.editProject(${item.id})">Изменить</button>
                <button class="btn-small btn-delete" onclick="window.deleteProject(${item.id})">Удалить</button>
            </div>
        `;
        list.appendChild(div);
    });
    
    console.log('Admin projects loaded successfully');
}

function loadAdminMembers() {
    const list = document.getElementById('adminMembersList');
    
    console.log('Loading admin members. Total members:', members.length, members);
    
    if (!list) {
        console.error('adminMembersList element not found!');
        return;
    }
    
    list.innerHTML = '';
    
    if (!members || members.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>Участников пока нет. Нажмите кнопку "+ Добавить участника" выше.</p></div>';
        console.log('No members to display');
        return;
    }
    
    console.log('Rendering', members.length, 'member items');
    
    members.forEach((item, index) => {
        console.log('Rendering member item:', index, item);
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
            <div style="flex: 1;">
                <strong>${item.nickname || 'Без имени'}</strong><br>
                <small style="color: var(--text-secondary);">${item.group || 'Без группы'}</small>
            </div>
            <div class="admin-item-actions">
                <button class="btn-small btn-edit" onclick="window.editMember(${item.id})">Изменить</button>
                <button class="btn-small btn-delete" onclick="window.deleteMember(${item.id})">Удалить</button>
            </div>
        `;
        list.appendChild(div);
    });
    
    console.log('Admin members loaded successfully');
}

// Image upload handlers
function setupImageUpload(fileInputId, urlInputId, previewId) {
    const fileInput = document.getElementById(fileInputId);
    const urlInput = document.getElementById(urlInputId);
    const preview = document.getElementById(previewId);
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target.result;
                    urlInput.value = base64;
                    preview.innerHTML = `<img src="${base64}" alt="Preview">`;
                    preview.classList.add('active');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    if (urlInput) {
        urlInput.addEventListener('input', (e) => {
            const url = e.target.value;
            if (url) {
                preview.innerHTML = `<img src="${url}" alt="Preview">`;
                preview.classList.add('active');
            } else {
                preview.classList.remove('active');
            }
        });
    }
}

// Initialize image upload for all forms
setupImageUpload('newsFormImageFile', 'newsFormImage', 'newsImagePreview');
setupImageUpload('projectFormImageFile', 'projectFormImage', 'projectImagePreview');
setupImageUpload('memberFormPhotoFile', 'memberFormPhoto', 'memberPhotoPreview');

// News Management
document.getElementById('addNewsBtn').addEventListener('click', () => {
    document.getElementById('newsFormTitle').textContent = 'Добавить новость';
    document.getElementById('newsForm').reset();
    document.getElementById('newsFormId').value = '';
    document.getElementById('newsImagePreview').classList.remove('active');
    document.getElementById('newsFormModal').classList.add('active');
});

document.getElementById('closeNewsFormModal').addEventListener('click', () => {
    document.getElementById('newsImagePreview').classList.remove('active');
    document.getElementById('newsFormModal').classList.remove('active');
});

document.getElementById('newsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('newsFormId').value;
    const newsData = {
        id: id ? parseInt(id) : Date.now(),
        title: document.getElementById('newsFormTitleInput').value,
        subtitle: document.getElementById('newsFormSubtitle').value,
        image: document.getElementById('newsFormImage').value,
        description: document.getElementById('newsFormDescription').value,
        date: new Date().toISOString()
    };
    
    console.log('Saving news:', newsData);
    
    if (id) {
        const index = news.findIndex(n => n.id === parseInt(id));
        news[index] = newsData;
        addLog('news_edit', `News edited: ${newsData.title}`);
        console.log('News updated at index:', index);
    } else {
        news.push(newsData);
        addLog('news_add', `News added: ${newsData.title}`);
        console.log('News added. Total news:', news.length);
    }
    
    saveData();
    console.log('Data saved to localStorage');
    
    document.getElementById('newsFormModal').classList.remove('active');
    document.getElementById('newsImagePreview').classList.remove('active');
    
    // Reload both admin and public views
    loadAdminNews();
    loadNews();
    
    // Update statistics
    if (currentUser && currentUser.isAdmin) {
        document.getElementById('totalNews').textContent = news.length;
    }
    
    alert('Новость сохранена!');
});

function editNews(id) {
    const item = news.find(n => n.id === id);
    document.getElementById('newsFormTitle').textContent = 'Изменить новость';
    document.getElementById('newsFormId').value = item.id;
    document.getElementById('newsFormTitleInput').value = item.title;
    document.getElementById('newsFormSubtitle').value = item.subtitle;
    document.getElementById('newsFormImage').value = item.image;
    document.getElementById('newsFormDescription').value = item.description;
    
    // Show image preview
    const preview = document.getElementById('newsImagePreview');
    preview.innerHTML = `<img src="${item.image}" alt="Preview">`;
    preview.classList.add('active');
    
    document.getElementById('newsFormModal').classList.add('active');
}

function deleteNews(id) {
    if (confirm('Удалить эту новость?')) {
        const item = news.find(n => n.id === id);
        news = news.filter(n => n.id !== id);
        saveData();
        addLog('news_delete', `News deleted: ${item.title}`);
        loadAdminNews();
        loadNews();
        alert('Новость удалена!');
    }
}

// Make functions globally accessible
window.editNews = editNews;
window.deleteNews = deleteNews;

// Project Management
document.getElementById('addProjectBtn').addEventListener('click', () => {
    document.getElementById('projectFormTitle').textContent = 'Добавить проект';
    document.getElementById('projectForm').reset();
    document.getElementById('projectFormId').value = '';
    document.getElementById('projectImagePreview').classList.remove('active');
    document.getElementById('projectFormModal').classList.add('active');
});

document.getElementById('closeProjectFormModal').addEventListener('click', () => {
    document.getElementById('projectImagePreview').classList.remove('active');
    document.getElementById('projectFormModal').classList.remove('active');
});

document.getElementById('projectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('projectFormId').value;
    const projectData = {
        id: id ? parseInt(id) : Date.now(),
        title: document.getElementById('projectFormTitleInput').value,
        description: document.getElementById('projectFormDescription').value,
        image: document.getElementById('projectFormImage').value,
        buttonText: document.getElementById('projectFormButtonText').value,
        link: document.getElementById('projectFormLink').value
    };
    
    console.log('Saving project:', projectData);
    
    if (id) {
        const index = projects.findIndex(p => p.id === parseInt(id));
        projects[index] = projectData;
        addLog('project_edit', `Project edited: ${projectData.title}`);
        console.log('Project updated at index:', index);
    } else {
        projects.push(projectData);
        addLog('project_add', `Project added: ${projectData.title}`);
        console.log('Project added. Total projects:', projects.length);
    }
    
    saveData();
    console.log('Data saved to localStorage');
    
    document.getElementById('projectFormModal').classList.remove('active');
    document.getElementById('projectImagePreview').classList.remove('active');
    
    // Reload both admin and public views
    loadAdminProjects();
    loadProjects();
    
    // Update statistics
    if (currentUser && currentUser.isAdmin) {
        document.getElementById('totalProjects').textContent = projects.length;
    }
    
    alert('Проект сохранен!');
});

function editProject(id) {
    const item = projects.find(p => p.id === id);
    document.getElementById('projectFormTitle').textContent = 'Изменить проект';
    document.getElementById('projectFormId').value = item.id;
    document.getElementById('projectFormTitleInput').value = item.title;
    document.getElementById('projectFormDescription').value = item.description;
    document.getElementById('projectFormImage').value = item.image;
    document.getElementById('projectFormButtonText').value = item.buttonText;
    document.getElementById('projectFormLink').value = item.link;
    
    // Show image preview
    const preview = document.getElementById('projectImagePreview');
    preview.innerHTML = `<img src="${item.image}" alt="Preview">`;
    preview.classList.add('active');
    
    document.getElementById('projectFormModal').classList.add('active');
}

function deleteProject(id) {
    if (confirm('Удалить этот проект?')) {
        const item = projects.find(p => p.id === id);
        projects = projects.filter(p => p.id !== id);
        saveData();
        addLog('project_delete', `Project deleted: ${item.title}`);
        loadAdminProjects();
        loadProjects();
        alert('Проект удален!');
    }
}

// Make functions globally accessible
window.editProject = editProject;
window.deleteProject = deleteProject;

// Member Management
document.getElementById('addMemberBtn').addEventListener('click', () => {
    document.getElementById('memberFormTitle').textContent = 'Добавить участника';
    document.getElementById('memberForm').reset();
    document.getElementById('memberFormId').value = '';
    document.getElementById('memberPhotoPreview').classList.remove('active');
    document.getElementById('memberFormModal').classList.add('active');
});

document.getElementById('closeMemberFormModal').addEventListener('click', () => {
    document.getElementById('memberPhotoPreview').classList.remove('active');
    document.getElementById('memberFormModal').classList.remove('active');
});

document.getElementById('memberForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('memberFormId').value;
    const memberData = {
        id: id ? parseInt(id) : Date.now(),
        photo: document.getElementById('memberFormPhoto').value,
        nickname: document.getElementById('memberFormNickname').value,
        group: document.getElementById('memberFormGroup').value,
        telegram: document.getElementById('memberFormTelegram').value,
        itd: document.getElementById('memberFormItd').value
    };
    
    console.log('Saving member:', memberData);
    
    if (id) {
        const index = members.findIndex(m => m.id === parseInt(id));
        members[index] = memberData;
        addLog('member_edit', `Member edited: ${memberData.nickname}`);
        console.log('Member updated at index:', index);
    } else {
        members.push(memberData);
        addLog('member_add', `Member added: ${memberData.nickname}`);
        console.log('Member added. Total members:', members.length);
    }
    
    saveData();
    console.log('Data saved to localStorage');
    
    document.getElementById('memberFormModal').classList.remove('active');
    document.getElementById('memberPhotoPreview').classList.remove('active');
    
    // Reload both admin and public views
    loadAdminMembers();
    loadMembers();
    
    // Update statistics
    if (currentUser && currentUser.isAdmin) {
        document.getElementById('totalMembers').textContent = members.length;
    }
    
    alert('Участник сохранен!');
});

function editMember(id) {
    const item = members.find(m => m.id === id);
    document.getElementById('memberFormTitle').textContent = 'Изменить участника';
    document.getElementById('memberFormId').value = item.id;
    document.getElementById('memberFormPhoto').value = item.photo;
    document.getElementById('memberFormNickname').value = item.nickname;
    document.getElementById('memberFormGroup').value = item.group;
    document.getElementById('memberFormTelegram').value = item.telegram;
    document.getElementById('memberFormItd').value = item.itd;
    
    // Show image preview
    const preview = document.getElementById('memberPhotoPreview');
    preview.innerHTML = `<img src="${item.photo}" alt="Preview">`;
    preview.classList.add('active');
    
    document.getElementById('memberFormModal').classList.add('active');
}

function deleteMember(id) {
    if (confirm('Удалить этого участника?')) {
        const item = members.find(m => m.id === id);
        members = members.filter(m => m.id !== id);
        saveData();
        addLog('member_delete', `Member deleted: ${item.nickname}`);
        loadAdminMembers();
        loadMembers();
        alert('Участник удален!');
    }
}

// Make functions globally accessible
window.editMember = editMember;
window.deleteMember = deleteMember;

// Check if user is logged in
const savedUser = localStorage.getItem('currentUser');
if (savedUser) {
    currentUser = JSON.parse(savedUser);
    if (loginModal) loginModal.classList.remove('active');
    updateUserProfile();
    loadNews();
} else {
    if (loginModal) loginModal.classList.add('active');
}

// Initialize
loadNews();

// Debug: Log current state
console.log('=== KAALITION Ready ===');
console.log('Users:', users.length);
console.log('News:', news.length);
console.log('Projects:', projects.length);
console.log('Members:', members.length);
console.log('Current User:', currentUser);
console.log('=======================');
