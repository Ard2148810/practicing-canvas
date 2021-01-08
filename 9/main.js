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
        orientX = event.beta;
        orientY = event.gamma;
    }

    let player = null;
    let winZone = null;

    function startGame() {
        permission();

        player = new Player(100, 100);
        winZone = new WinZone(500, 500);

        gameStarted = true;
    }

    const btnStart = document.getElementById("btnStart");
    btnStart.addEventListener("click", startGame)
    btnStart.addEventListener("touchstart", startGame)

    function debugOrientation() {
        addToConsole(`\nX:${orientX}\nY:${orientY}`);
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
        // player.printBoundingBox(ctx);
        addToConsole(`\n${winZone.boundingBox.isColliding(player)}`);
    }

    function updatePlayer() {
        player.move(orientY, orientX, canvas.width, canvas.height);
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
                debugOrientation();
                updateWinZone();
                updatePlayer();
                checkWin();
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
