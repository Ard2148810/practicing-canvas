class GameObject {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
    }

    setPosition(x, y) {
        if (x !== undefined) this.position.x = x
        if (y !== undefined) this.position.y = y
    }
}

class Player extends GameObject {
    constructor(posX, posY) {
        super();
        this.speed = {
            x: 0,
            y: 0
        }
        this.size = {
            x: 20,
            y: 20
        };
        this.maxSpeed = 4;
        this.maxAcceleration = 2;
        this.accelerationMultiplier = 0.01;
        this.color = "#FFFFFF";
        this.setPosition(posX, posY);
        this.boundingBox = new BoundingBox(this.position, this.size);
    }

    move(inputX, inputY, mapHeight, mapWidth) {
        const newX = inputX * this.accelerationMultiplier;
        const newY = inputY * this.accelerationMultiplier;
        this.speed.x += Math.max(Math.min(newX, this.maxAcceleration), -this.maxAcceleration);
        this.speed.x = Math.max(Math.min(this.speed.x, this.maxSpeed), -this.maxSpeed);
        this.speed.y += Math.max(Math.min(newY, this.maxAcceleration), -this.maxAcceleration);
        this.speed.y = Math.max(Math.min(this.speed.y, this.maxSpeed), -this.maxSpeed);

        this.setPosition(
            Math.min(Math.max(this.position.x += this.speed.x, 0), mapWidth - this.size.x),
            Math.min(Math.max(this.position.y += this.speed.y, 0), mapHeight - this.size.x)
        );
    }

    print(ctx) {
        ctx.beginPath();
        ctx.arc(
            this.position.x + (this.size.x / 2),
            this.position.y + (this.size.y / 2),
            this.size.x / 2,
            0,
            2 * Math.PI, false
        );
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    printBoundingBox(ctx) {
        ctx.fillStyle = "#ffe800";
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}

class BoundingBox {
    constructor(position, size) {
        this.position = position;
        this.size = size;
    }

    isColliding(target) {
        return (
            this.position.x < target.position.x + target.size.x &&
            this.position.x + this.size.x > target.position.x &&
            this.position.y < target.position.y + target.size.y &&
            this.position.y + this.size.y > target.position.y
        );
    }
}

class WinZone extends GameObject {
    constructor(posX, posY) {
        super();
        this.setPosition(posX, posY);
        this.size = {
            x: 20,
            y: 20
        };
        this.color = "#00e9ff"
        this.boundingBox = new BoundingBox(this.position, this.size);
    }

    print(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}

class Wall extends GameObject {
    constructor(posX, posY, sizeX, sizeY) {
        super();
        this.setPosition(posX, posY);
        this.size = {
            x: sizeX,
            y: sizeY
        };
        this.color = "#e0d866";
    }

    print(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}
