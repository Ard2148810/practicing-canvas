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

    function generateMap(seed) {
        const s = seed ? seed : Math.floor(Math.random() * 10);
        console.log(`s${s}`);
        if(s % 2 === 0) {
            player = new Player(50, 50);
            winZone = new WinZone(canvas.width - 50, canvas.height - 50);
        } else {
            player = new Player(canvas.width - 50, canvas.height - 50);
            winZone = new WinZone(50, 50);
        }

        walls.add(new Wall(200, 200, 100, 10));
        walls.add(new Wall(350, 400, 10, 100));
        walls.add(new Wall(700, 500, 100, 10));
        walls.add(new Wall(canvas.width - 100, 0, 10, 100));

        if(s % 2 === 1) {
            walls.add(new Wall(canvas.width - 200, canvas.height - 200, 10, 200));
            walls.add(new Wall(150, 400, 200, 10));
            walls.add(new Wall(100, 0, 10, 200));
        } else {
            walls.add(new Wall(300, canvas.height - 200, 10, 200));
            walls.add(new Wall(100, canvas.height - 200, 200, 10));
            walls.add(new Wall(300, 100, 200, 10));
        }

        if(s === 1 || s === 4) {
            walls.add(new Wall(canvas.width - 150, 300, 150, 10));
            walls.add(new Wall(canvas.width - 150, 300, 10, 50));
            walls.add(new Wall(canvas.width - 100, 250, 10, 50));
        } else if(s === 2 || s === 8 || s === 9) {
            walls.add(new Wall(canvas.width - 150, 300, 150, 10));
            walls.add(new Wall(canvas.width - 150, 250, 150, 10));
        } else if(s > 5) {
            walls.add(new Wall( 400, canvas.height - 100, 100, 10));
            walls.add(new Wall( 500, canvas.height - 100, 10, 100));
            walls.add(new Wall( canvas.width - 250, canvas.height - 150, 10, 100));
            walls.add(new Wall( canvas.width - 250, canvas.height - 150, 50, 10));
        }
        if(s === 3 || s === 7) {
            walls.add(new Wall( 200, 300, 400, 10));
            walls.add(new Wall( 650, 300, 100, 10));
        } else {
            walls.add(new Wall(400, 50, 10, 350));
            walls.add(new Wall(450, 450, 10, 150));
        }
        if(s === 0 || s === 9) {
            walls.add(new Wall(0, 300, 100, 10));
            walls.add(new Wall(400, 300, 100, 10));
            walls.add(new Wall(400, 100, 150, 10));
            walls.add(new Wall(canvas.width - 100, canvas.height - 150, 100, 10));
            walls.add(new Wall(canvas.width - 100, canvas.height - 250, 10, 100));
            walls.add(new Wall(canvas.width - 300, canvas.height - 250, 200, 10));
        }
        if(s !== 9 && s !== 8) {
            walls.add(new Wall(canvas.width - 50, 300, 50, 10));
            if(s <= 5) {
                walls.add(new Wall(canvas.width - 150, 300, 50, 10));
            }
        }
        if(s === 3) {
            walls.add(new Wall(400, 50, 10, 250));
            walls.add(new Wall(450, 300, 10, 50));
            walls.add(new Wall(600, 250, 10, 100));
            walls.add(new Wall(650, 250, 10, 50));
            walls.add(new Wall(100, 250, 10, 100));
            walls.add(new Wall(150, 400, 10, 100));
            walls.add(new Wall(50, canvas.height - 100, 10, 100));
        } else if(s === 6) {
            walls.add(new Wall(0, 300, 150, 10));
            walls.add(new Wall(150, 200, 10, 110));
            walls.add(new Wall(canvas.width - 200, 100, 110, 10));
        } else  if(s === 8) {
            walls.add(new Wall(200, 200, 10, 100));
            walls.add(new Wall(100, 300, 110, 10));
            walls.add(new Wall(0, 200, 100, 10));
        } else if(s === 2) {
            walls.add(new Wall(0, 100, 100, 10));
            walls.add(new Wall(100, 200, 100, 10));
            walls.add(new Wall(200, 300, 200, 10));
            walls.add(new Wall(400, 400, 200, 10));
            walls.add(new Wall(590, 300, 10, 100));
            walls.add(new Wall(500, 300, 100, 10));
        } else if(s === 1) {
            walls.add(new Wall(500, 0, 10, 200));
            walls.add(new Wall(450, 190, 50, 10));
            walls.add(new Wall(150, 500, 210, 10));
        } else if(s === 7) {
            walls.add(new Wall(400, 0, 10, 250));
            walls.add(new Wall(450, 50, 10, 250));
            walls.add(new Wall(500, 300, 10, 150));
            walls.add(new Wall(0, 550, 150, 10));
        }
    }

    function startGame() {
        if(!gameStarted) {
            permission();
            generateMap();
            gameStarted = true;
        }
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

    const input = {
        x: 0,
        y: 0
    }

    window.addEventListener('keydown' ,e => {
        if(e.key === 'd') {
            input.x = 4;
        } else if(e.key === 'a') {
            input.x = -4;
        } else if(e.key === 'w') {
            input.y = -4;
        } else if(e.key === 's') {
            input.y = 4;
        }
    });
    window.addEventListener('keyup' ,e => {
        if(e.key === 'd') {
            input.x = 0;
        } else if(e.key === 'a') {
            input.x = 0;
        } else if(e.key === 'w') {
            input.y = 0;
        } else if(e.key === 's') {
            input.y = 0;
        }
    });

    function updatePlayer(debug) {
        if(debug) {
            player.move(input.x, input.y, canvas.height, canvas.width, walls);
        }
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
                ctx.fillStyle = "#2f3daa";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                // debugCollision();
                updateWalls();
                updateWinZone();
                updatePlayer(false);

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
