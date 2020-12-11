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
        super()
        this.speed = 7
        this.img = new Image()
        this.img.src = "spaceship.png"
        this.size = {
            x: 70,
            y: 10
        }
        this.setPosition(posX, posY)
    }

    move(directionX, mapWidth) {
        let clampedPositionX = Math.min(this.position.x + (this.speed * directionX), mapWidth - this.size.x);
        clampedPositionX = Math.max(clampedPositionX, 0);
        this.setPosition(clampedPositionX, this.position.y);
    }

    shoot(bullets) {
        if (bullets.size < 1) {
            bullets.add(
                new Bullet(this.position.x + (this.size.x / 2), this.position.y - (this.size.y / 2) - 10)
            );
        }
    }

    getCenterPoint() {
        return {
            x: this.position.x + (this.size.x / 2),
            y: this.position.y + (this.size.y / 2)
        }
    }
}

class Obstacle extends GameObject {
    constructor(posX, posY) {
        super();
        this.color = "#ffb0b0"
        this.img = new Image()
        this.img.src = "target.png"
        this.size = {
            x: 50,
            y: 20
        }
        this.setPosition(posX, posY)
    }

    getCenterPoint() {
        return {
            x: this.position.x + (this.size.x / 2),
            y: this.position.y + (this.size.y / 2)
        }
    }
}


class Bullet extends GameObject {
    constructor(posX, posY) {
        super();
        this.setPosition(posX, posY)
        this.speed = {
            x: 0,
            y: 7
        }
        this.radius = 10
        this.color = "#9c6107"
    }

    getCenterPoint() {
        return {
            x: this.position.x + this.radius,
            y: this.position.y + this.radius
        }
    }

    getCollisionBox() {
        return {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            size: {
                x: this.radius * 2,
                y: this.radius * 2
            }
        }
    }

    move() {
        this.setPosition(this.position.x - this.speed.x, this.position.y - this.speed.y)
    }
}
