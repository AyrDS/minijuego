let time = new Date();
let deltaTime = 0;
let velScene;
let gameContainer;
let groundY;
let impulse;
let obstaclesArr = [
    {
        obstacle: '1',
        classObstacle: 'obstacle-1',
        object: '1',
        classObject: 'object-1'
    },
    {
        obstacle: '2',
        classObstacle: 'obstacle-2',
        object: '2',
        classObject: 'object-2'
    },
    {
        obstacle: '3',
        classObstacle: 'obstacle-3',
        object: '3',
        classObject: 'object-3'
    },
    {
        obstacle: '4',
        classObstacle: 'obstacle-4',
        object: '4',
        classObject: 'object-4'
    },
];
let counterArrObstacle = 0;
let obstaclesDivs = [];
let objectsDivs = [];
let insideDivs = [];
let startGame = false;
let minutes = 0;
let hours = 0;
let visual = false;
let ear = false;
let respiration = false;
let head = false;
let modalDiv = false;


const body = document.querySelector('body');
const scoreHours = document.querySelector('#hours');
const scoreMinutes = document.querySelector('#minutes');
const titleFinal = document.querySelector('#title-final');
const subFinal = document.querySelector('#sub-final');
const imgFinal = document.querySelector('#img-final');
const btnReset = document.querySelector('#reset');
const btnShare = document.querySelector('#share');
const containerBtnOut = document.querySelector('.out');
const btnOut = document.querySelector('.game-out');
const containerGameOver = document.querySelector('.game-over');
const playerName = document.querySelector('.name');
const containerInstruction = document.querySelector('.instruction');
const textInstruction = document.querySelector('#text-instruction');
let player = document.querySelector('.player');
playerName.innerHTML = localStorage.getItem('user-experta');
let screenWidth = window.innerWidth;
const urlOrigin = window.location.origin;

window.onload = function () {
    const spinner = document.querySelector('.spinner');
    gameContainer = document.querySelector('.game-container');
    if (localStorage.getItem('playerSelected') === 'Man') {
        player.classList.add('man');
    } else {
        player.classList.add('woman');
    }

    spinner.style.display = 'none';
    gameContainer.style.display = 'block';
}

if (screenWidth < 768) {
    velScene = 900 / 3
    groundY = 6;
    impulse = 750;
    textInstruction.textContent = 'Toca la pantalla para comenzar el juego y saltar los obstáculos';
} else {
    velScene = 1280 / 3
    groundY = 3;
    impulse = 900;
    textInstruction.textContent = 'Presiona la barra espaciadora para comenzar el juego y saltar los obstáculos';
}

document.addEventListener('keydown', init);
document.addEventListener('click', init);
btnReset.addEventListener('click', reset);
body.addEventListener('keydown', closeModal);
body.addEventListener('click', closeModal);
btnShare.addEventListener('click', share);
btnOut.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = urlOrigin;
});


function init() {
    if (!startGame) {
        console.log('Start Game');
        containerInstruction.removeChild(textInstruction);
        startGame = true;
        time = new Date();
        start();
        loop();
    } else {
        return
    }
};

function loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    update();
    requestAnimationFrame(loop);
};

let velY = 0;
let gravity = 2500;

let playerPosX = 10;
let playerPosY = groundY;

let groundX = 0;
let gameVel = 1;

let timeNextObstacle = 2;
let timeObstacleMin = 0.7;
let timeObstacleMax = 1.8;
let obstaclePosY = 16;

let timeNextWindow = 0.5;
let timeWindowMin = 0.7;
let timeWindowMax = 2.7;
let windowPosY = 150;
let windows = [];
let velWindow = 0.3;


let stopped = false;
let jumping = false;

let ground;

function start() {
    gameContainer = document.querySelector('.game-container');
    ground = document.querySelector('.ground');
    player.classList.add('run');
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', jump);
};

function handleKeydown(e) {
    if (e.keyCode === 32) {
        jump();
    }
}

function update() {
    if (stopped) {
        return
    }
    moveFloor();
    movePlayer();
    checkObstacle();
    checkWindow();
    moveWindow();
    moveObstacle();
    moveObject();
    checkCollision();
    checkCollisionObject();

    velY -= gravity * deltaTime;
}

function moveFloor() {
    groundX += calculateOffset();
    ground.style.left = -(groundX % gameContainer.clientWidth) + 'px';
}

function calculateOffset() {
    return velScene * deltaTime * gameVel;
}

function movePlayer() {
    playerPosY += velY * deltaTime;
    if (playerPosY < groundY) {
        hitGround();
    }
    player.style.bottom = playerPosY + 'px';
}

function jump() {
    if (playerPosY === groundY) {
        jumping = true;
        velY = impulse;
        player.classList.remove('run');
        player.classList.add('jump');
    }
}

function hitGround() {
    playerPosY = groundY;
    velY = 0;
    if (jumping) {
        player.classList.remove('jump');
        player.classList.add('run');
    }
    jumping = false;
}

function checkObstacle() {
    timeNextObstacle -= deltaTime;
    if (timeNextObstacle <= 0) {
        createObstacle();
    }
}

function checkWindow() {
    timeNextWindow -= deltaTime;
    if (timeNextWindow <= 0) {
        createWindow();
    }
}

function createObstacle() {
    const obstacle = document.createElement('div');
    const objectDiv = document.createElement('div');
    const insideDiv = document.createElement('div');
    obstacle.classList.add('obstacle', `${obstaclesArr[counterArrObstacle].classObstacle}`);
    objectDiv.classList.add('object', `${obstaclesArr[counterArrObstacle].classObject}`);
    insideDiv.classList.add('inside');

    if (obstacle.classList.contains('obstacle-4')) {
        insideDiv.classList.add('obj4');
    }

    counterArrObstacle = counterArrObstacle + 1;
    if (counterArrObstacle > obstaclesArr.length - 1) {
        counterArrObstacle = 0;
    }

    obstacle.appendChild(insideDiv);
    gameContainer.appendChild(obstacle);
    gameContainer.appendChild(objectDiv);
    obstacle.posX = gameContainer.clientWidth;
    obstacle.style.left = gameContainer.clientWidth + 'px';
    objectDiv.posX = gameContainer.clientWidth;
    objectDiv.style.left = gameContainer.clientWidth + 'px';

    obstaclesDivs.push(obstacle);
    objectsDivs.push(objectDiv);
    insideDivs.push(insideDiv);

    timeNextObstacle = timeObstacleMin + Math.random() * (timeObstacleMax - timeObstacleMin) / gameVel;
}

function createWindow() {
    let window = document.createElement('div');
    gameContainer.appendChild(window);
    window.classList.add('window');
    window.posX = gameContainer.clientWidth;
    window.style.left = gameContainer.clientWidth + 'px';

    windows.push(window);
    timeNextWindow = timeWindowMin + Math.random() * (timeWindowMax - timeWindowMin) / gameVel;
}

function moveWindow() {
    for (let i = windows.length - 1; i >= 0; i--) {
        if (windows[i].posX < -windows[i].clientWidth) {
            windows[i].parentNode.removeChild(windows[i]);
            windows.splice(i, 1);
        } else {
            windows[i].posX -= calculateOffset() * velWindow;
            windows[i].style.left = windows[i].posX + 'px';
        }
    }
}

function moveObstacle() {
    for (let i = obstaclesDivs.length - 1; i >= 0; i--) {
        if (obstaclesDivs[i].posX < -obstaclesDivs[i].clientWidth) {
            obstaclesDivs[i].parentNode.removeChild(obstaclesDivs[i]);
            obstaclesDivs.splice(i, 1);
            addPoints();
        } else {
            obstaclesDivs[i].posX -= calculateOffset();
            obstaclesDivs[i].style.left = obstaclesDivs[i].posX + 'px';
        }
    }
}

function moveObject() {
    for (let i = objectsDivs.length - 1; i >= 0; i--) {
        if (objectsDivs[i].posX < -objectsDivs[i].clientWidth) {
            objectsDivs[i].parentNode.removeChild(objectsDivs[i]);
            objectsDivs.splice(i, 1);
        } else {
            objectsDivs[i].posX -= calculateOffset();
            objectsDivs[i].style.left = objectsDivs[i].posX + 'px';
        }
    }
}

function checkCollision() {
    for (let i = 0; i < insideDivs.length; i++) {
        if (insideDivs[i].posX > playerPosX + player.clientWidth) {
            //Evade
            break; //Como están en orden no puede chocar con más
        } else {
            if (isCollision(player, insideDivs[i])) {
                gameOver();
            }
        }
    }
}

function checkCollisionObject() {
    for (let i = 0; i < objectsDivs.length; i++) {
        if (objectsDivs[i].posX > playerPosX + player.clientWidth) {
            //Evade
            break; //Como están en orden no puede chocar con más
        } else {
            if (isCollision(player, objectsDivs[i])) {
                objectsDivs[i].style.display = 'none';
                console.log(objectsDivs[i].classList.value)
                if (objectsDivs[i].classList.contains('object-1')) {
                    if (!visual) {
                        showModal('assets/visual.png');
                        visual = true
                    }
                } else if (objectsDivs[i].classList.contains('object-2')) {
                    if (!ear) {
                        showModal('assets/auditiva.png');
                        ear = true
                    }
                } else if (objectsDivs[i].classList.contains('object-3')) {
                    if (!respiration) {
                        showModal('assets/respiracion.png');
                        respiration = true
                    }
                } else {
                    if (!head) {
                        showModal('assets/creaneo.png');
                        head = true;
                    }
                }
            }
        }
    }
}

function isCollision(player1, obstacle) {
    let playerRect = player1?.getBoundingClientRect();
    let obstacleRect = obstacle?.getBoundingClientRect();

    if (playerRect?.x < obstacleRect?.x + obstacleRect?.width &&
        playerRect?.x + playerRect?.width > obstacleRect?.x &&
        playerRect?.y < obstacleRect?.y + obstacleRect?.height &&
        playerRect?.height + playerRect?.y > obstacleRect?.y) {
        return true
    }
}

function addPoints() {
    minutes = minutes + 10;
    scoreMinutes.textContent = minutes;
    if (minutes >= 60) {
        minutes = 0;
        scoreMinutes.textContent = '00';
        hours++;
        scoreHours.textContent = hours;
    }

    switch (hours) {
        case 1:
            gameVel = 1.25;
            break;

        case 3:
            gameVel = 1.50;
            break;

        case 6:
            gameVel = 2;
            break;

        case 8:
            win();
            break;

        default:
            break;
    }
}

function showModal(src) {
    modalDiv = document.createElement('div');
    stopped = true;
    modalDiv.classList.add('fix');
    const img = document.createElement('img');
    img.setAttribute('src', src);
    img.classList.add('img-fluid', 'd-block', 'mx-auto', 'image-modal');
    const imgContinue = document.createElement('img');
    if (screenWidth > 768) {
        imgContinue.setAttribute('src', 'assets/tap-desk.png');
    } else {
        imgContinue.setAttribute('src', 'assets/tap.png');
    }
    imgContinue.classList.add('img-fluid', 'd-block', 'mx-auto', 'image-modal_touch');
    modalDiv.appendChild(img);
    modalDiv.appendChild(imgContinue);
    body.appendChild(modalDiv);
}

function closeModal(e) {
    if (modalDiv) {
        e.stopPropagation();
        stopped = false;
        body.removeChild(modalDiv);
        modalDiv = null;
    } else {
        return
    }
}

function win() {
    stopped = true;
    if (localStorage.getItem('playerSelected') === 'Man') {
        imgFinal.setAttribute('src', 'assets/win-man.png');
    } else {
        imgFinal.setAttribute('src', 'assets/win-woman.png');
    }

    titleFinal.textContent = `¡Felicitaciones ${localStorage.getItem('user-experta')}`
    subFinal.textContent = 'estuviste protegido durante toda tu jornada laboral!'
    subFinal.classList.add('subFinal');
    gameContainer.classList.add('d-none');
    containerBtnOut.classList.add('d-none');
    containerGameOver.classList.remove('d-none');
}

function gameOver() {
    stopped = true;
    if (localStorage.getItem('playerSelected') === 'Man') {
        imgFinal.setAttribute('src', 'assets/lose-man.png');
    } else {
        imgFinal.setAttribute('src', 'assets/lose-woman.png');
    }
    titleFinal.textContent = `¡Vaya, ${localStorage.getItem('user-experta')}!`;
    subFinal.textContent = 'Tuviste un accidente y no estabas protegido correctamente, volvé a intentarlo.';
    subFinal.classList.add('subFinal');
    setTimeout(() => {
        gameContainer.classList.add('d-none');
        containerBtnOut.classList.add('d-none');
        containerGameOver.classList.remove('d-none');
    }, 1000);
}

function reset(e) {
    e.stopPropagation();
    if (screenWidth < 768) {
        velScene = 900 / 3
        groundY = 4;
    } else {
        velScene = 1280 / 3
        groundY = 3;
    }
    containerGameOver.classList.add('d-none');
    gameContainer.classList.remove('d-none');
    containerBtnOut.classList.remove('d-none');
    scoreMinutes.textContent = '00';
    scoreHours.textContent = '0';
    minutes = 0;
    hours = 0;
    gameVel = 1;
    obstaclesDivs = [];
    objectsDivs = [];
    groundX = 0;
    startGame = false;
    stopped = false;
    playerPosX = 10;
    playerPosY = groundY;
    const obstacles = document.querySelectorAll('.obstacle');
    const objects = document.querySelectorAll('.object');
    clearGame(obstacles);
    clearGame(objects);
}

function clearGame(arr) {
    arr.forEach(element => {
        gameContainer.removeChild(element);
    });
}

function share() {
    fetch(`${urlOrigin}/assets/share-img.png`)
        .then((res) => {
            return res.blob()
        })
        .then((blob) => {
            const file = new File([blob], 'share-img.png', { type: 'image/png' });
            const fileArr = [file];

            if (navigator.canShare && navigator.canShare({ files: fileArr })) {
                navigator.share({
                    files: fileArr,
                    title: 'Si te cuidás, ganás. ¿Jugás?',
                    text: 'Si te cuidás, ganás. ¿Jugás?',
                    url: urlOrigin
                });
            }
        })
}