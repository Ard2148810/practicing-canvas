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
        this.speed = 5;
        this.size = {
            x: 30,
            y: 30
        };
        this.setPosition(posX, posY);
        this.boundingBox = new BoundingBox(this.position, this.size);
    }

    move(directionX, mapWidth) {
        let clampedPositionX = Math.min(this.position.x + (this.speed * directionX), mapWidth - this.size.x);
        clampedPositionX = Math.max(clampedPositionX, 0);
        this.setPosition(clampedPositionX, this.position.y);
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
