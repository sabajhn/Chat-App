const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');

//get username and room
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

//join room
socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = ''
    e.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                    <p class="text">
                    ${message.text}
                    </p>`;
    document.querySelector('.chat-messages').appendChild(div);                
}

function outputRoomName(room){
    roomName.innerHTML = room
}

function outputUsers(users){
    usersList.innerHTML =`
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}