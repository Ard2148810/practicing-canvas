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
    let permissionGranted = false;

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

    const player1 = new Player(100, 570)

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
        if(!permissionGranted) {
            permission();
            permissionGranted = true;
        }
        userInput.isShooting = true
    }

    const stopShooting = () => {
        userInput.isShooting = false
    }

//printToScreen("works");

    const handleKeyDown = (event) => {
        switch (event.key) {
            case "ArrowRight": {
                event.preventDefault()
                turnRight()
                break
            }
            case "ArrowLeft": {
                event.preventDefault()
                turnLeft()
                break
            }
            case " ": {
                event.preventDefault()
                shoot()
                break
            }
        }
    }

    const handleKeyUp = (event) => {
        event.preventDefault();
        switch (event.key) {
            case "ArrowRight": {
                stopTurning();
                break;
            }
            case "ArrowLeft": {
                stopTurning();
                break;
            }
            case " ": {
                stopShooting();
                break;
            }
        }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    const handleTouch = () => {
        shoot();
    }

    canvas.addEventListener("touchstart", handleTouch, false);

    let score = 0;

    function isInRange(value, a, b) {
        return value >= a && value <= b;
    }

    function isOverlapping(object, target) {
        return (
                isInRange(target.position.y, object.position.y, object.position.y + object.size.y) ||
                isInRange(target.position.y + target.size.y, object.position.y, object.position.y + object.size.y)
            ) &&
            (
                isInRange(target.position.x, object.position.x, object.position.x + object.size.x) ||
                isInRange(target.position.x + target.size.x, object.position.x, object.position.x + object.size.x)
            );
    }

    let targets = new Set();

    function addTargetsWave(offset) {
        targets.forEach(target => {
            target.setPosition(target.position.x, target.position.y + target.size.y);
        })
        for (let i = 0; i < 16; i++) {
            targets.add(new Obstacle(i * 50, offset));
        }
    }

    let speed = 4

    bullets = new Set()

    let gameOver = false


    function updatePlayer(player) {
        if (userInput.isShooting) {
            player.shoot(bullets)
            stopShooting()
        }

        player.move(userInput.directionX, canvas.width)
        if (orientY !== 0) {
            player.move(Math.min(Math.max(orientY / 20, -1), 1), canvas.width)
        }

        ctx.beginPath()
        ctx.drawImage(player.img, player.position.x, player.position.y)
    }

    function updateScore(score) {
        ctx.font = "30px Arial"
        ctx.fillStyle = "#d5d5d5"
        ctx.fillText(`Score: ${score}`, 10, 30)
    }

    function printGameOver(msg) {
        ctx.font = "40px Arial"
        ctx.strokeText(msg, canvas.width / 2 - 200, canvas.height / 2)
    }

    function updateBullets(bullets) {
        bullets.forEach(bullet => {
            bullet.move();
            targets.forEach(target => {
                if (isOverlapping(bullet.getCollisionBox(), target) || isOverlapping(target, bullet.getCollisionBox())) {
                    targets.delete(target);
                    score++;
                    const bulletCenter = bullet.getCenterPoint();
                    const targetCenter = target.getCenterPoint();
                    if(Math.abs(bulletCenter.x - targetCenter.x) > target.size.x / 2 - 2)
                        bullet.speed.y = -Math.abs(bullet.speed.y);
                    else bullet.speed.x = -Math.abs(bullet.speed.x);

                }
            });

            if (isOverlapping(bullet.getCollisionBox(), player1) || isOverlapping(player1, bullet.getCollisionBox())) {
                bullet.speed.y = Math.abs(bullet.speed.y);
                const playerX = player1.getCenterPoint().x;
                const bulletX = bullet.getCenterPoint().x;
                bullet.speed.x += (playerX - bulletX) / 8;
            }

            if (bullet.position.y > canvas.height) {
                gameOver = true;
            }
            if (bullet.position.y < 0) {
                bullet.speed.y *= -1;
            }

            if (bullet.position.x < 0) {
                bullet.speed.x *= -1;
            } else if(bullet.position.x + (bullet.radius * 2) > canvas.width) {
                bullet.speed.x *= -1;
            }


            ctx.beginPath()
            ctx.fillStyle = bullet.color
            ctx.arc(bullet.position.x, bullet.position.y, bullet.radius, 0, 2 * Math.PI)
            ctx.fill()
        })
    }


    let orientX = 0;
    let orientY = 0;

    function handleOrientation(event) {
        orientX = event.beta;
        orientY = event.gamma;
    }

    function init() {
        addTargetsWave(30);
        setInterval(() => {
            if(permissionGranted) {
                addTargetsWave(30);
            }
        }, 1000 * 20);
    }

    function updateTargets(targets) {
        targets.forEach(target => {
            ctx.beginPath();
            ctx.drawImage(target.img, target.position.x, target.position.y);
        });
    }

    function animate(timestamp) {
        if (start === undefined) {
            start = timestamp
            init();
        }
        const elapsed = (timestamp - start);
        const elapsedSeconds = Math.floor(elapsed / 1000)
        if (gameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = "#FF0000"
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            printGameOver(`GAME OVER! SCORE: ${score}`)
        } else {
            if(!permissionGranted) {
                ctx.fillStyle = "#9dff6e"
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                printGameOver('TAP THE SCREEN TO START');
            }
            //if(!turn && (elapsedSeconds + 12) % 15 === 0) turn = true;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#0a0f3d";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            updateBullets(bullets);
            updateTargets(targets);
            updatePlayer(player1);
            updateScore(score);
        }
        window.requestAnimationFrame(animate);
    }

    window.requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', run);
