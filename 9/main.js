function run() {
    const myConsole = document.getElementById('myConsole');
    const printToScreen = (msg) => {
        myConsole.innerHTML = msg;
    }
    // Prevent context menu on button press and hold activity
    document.querySelectorAll('button').forEach(element => {
        element.addEventListener('contextmenu', event => event.preventDefault());
    });

    let canvas = document.getElementById("myCanvas");
    let ctx = canvas.getContext("2d");

    let start;

    let gameStarted = false;

    let msgBuffer = '';
    const addToConsole = (msg) => {
        msgBuffer += msg;
    }


    let orientation = 'portrait';
    if(window.innerWidth > window.innerHeight) {
        orientation = 'landscape';
    }

    window.onorientationchange = function(event) {
        if(window.innerWidth > window.innerHeight) {
            orientation = 'landscape';
        }
    };

    function permission() {
        if (typeof (DeviceMotionEvent) !== "undefined" && typeof (DeviceMotionEvent.requestPermission) === "function") {
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response === "granted") {
                        window.addEventListener('deviceorientation', handleOrientation, true);
                    }
                })
                .catch(console.error)
        } else {
            window.addEventListener('deviceorientation', handleOrientation, true);
        }
    }

    permission();

    let gameWin = false;

    function printOnScreen(msg) {
        ctx.font = "40px Arial"
        ctx.strokeText(msg, canvas.width / 2 - 200, canvas.height / 2)
    }

    let orientX = 0;
    let orientY = 0;

    function handleOrientation(event) {
        if(orientation === 'portrait') {
            orientX = event.beta;
            orientY = event.gamma;
        } else {
            orientX = -event.gamma;
            orientY = event.beta;
        }
    }

    let player = null;
    let winZone = null;
    const walls = new Set();

    function startGame() {
        permission();

        walls.add(new Wall(200, 200, 100, 10));
        walls.add(new Wall(350, 400, 10, 100));
        walls.add(new Wall(700, 500, 100, 10));

        player = new Player(100, 100);
        winZone = new WinZone(500, 500);

        gameStarted = true;
    }

    const btnStart = document.getElementById("btnStart");
    btnStart.addEventListener("click", startGame)
    btnStart.addEventListener("touchstart", startGame)

    function debugOrientation() {
        ctx.beginPath();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + orientY, centerY + orientX);
        ctx.strokeStyle = "#FF0000";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    function debugCollision() {
        const player = new Player(100, 100);
        const winZone = new WinZone(119, 119);

        player.print(ctx);
        winZone.print(ctx);
    }

    function updatePlayer() {
        player.move(orientY, orientX, canvas.height, canvas.width, walls);
        player.print(ctx);
    }


    function checkWin() {
        if(player.boundingBox.isColliding(winZone)) {
            gameWin = true;
        }
    }

    function updateWinZone() {
        winZone.print(ctx);
    }

    function updateWalls() {
        walls.forEach(wall => {
            wall.print(ctx);
        })
    }

    function animate(timestamp) {
        if(gameStarted) {
            if (start === undefined) {
                start = timestamp
            }
            const elapsed = (timestamp - start);
            const elapsedSeconds = Math.floor(elapsed / 1000);
            if (gameWin) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#87c965";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                printOnScreen(`YOU WIN!`);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#0a0f3d";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // debugCollision();
                updateWalls();
                updateWinZone();
                updatePlayer();

                checkWin();

                addToConsole(`${orientation} | width: ${window.innerWidth}; height: ${window.innerHeight}`);
            }
            printToScreen(msgBuffer);
            msgBuffer = '';
            debugOrientation();


        } else {
            ctx.fillStyle = "#3f4993"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            printOnScreen('CLICK START BUTTON');
        }
        window.requestAnimationFrame(animate);
    }

    window.requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', run);
