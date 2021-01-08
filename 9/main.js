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

    //const player1 = new Player(100, 570)

    const userInput = {
        directionX: 0,
        acceleration: 0,
        isShooting: false
    }

    const turnLeft = () => {
        userInput.directionX = -1
    }

    const turnRight = () => {
        userInput.directionX = 1
    }

    const stopTurning = () => {
        userInput.directionX = 0
    }

    const shoot = () => {
        userInput.isShooting = true
    }

    const stopShooting = () => {
        userInput.isShooting = false
    }

    printToScreen("...");

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

    function startGame() {
        permission();
        gameStarted = true;
    }

    const btnStart = document.getElementById("btnStart");
    btnStart.addEventListener("click", startGame)
    btnStart.addEventListener("touchstart", startGame)


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
            }
            printToScreen(`X: ${orientX}\nY: ${orientY}`);
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
