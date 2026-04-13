"use strict";
let ballCanvas;
const generateDecimalBetween = (minimum, maximum) => {
    const randomDecimal = Math.random() * (minimum - maximum) + maximum;
    return Math.round(randomDecimal * 1e2) / 1e2;
};
const requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        ((callback) => {
            window.setTimeout(callback, 1000 / 60);
        });
})();
class BallCanvas {
    constructor() {
        this.density = () => {
            return Math.floor(Math.sqrt((this.canvas.height, this.canvas.width) * 3));
        };
        this.redraw = (width, height) => {
            this.bouncyBallList = [];
            this.canvas.width = width;
            this.canvas.height = height;
            this.spawnBalls({ density: this.density() });
        };
        this.animate = () => {
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            ballCanvas.bouncyBallList.forEach(function (ball) {
                ball.update();
            });
            requestAnimationFrame(this.animate.bind(this));
        };
        this.drawLine = (startX, startY, endX, endY, distance) => {
            const opacity = ((1.0 / distance) * 10).toFixed(2);
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(startX, startY);
            this.canvasContext.lineTo(endX, endY);
            this.canvasContext.strokeStyle = "rgba(215, 215, 215," + opacity + ")";
            this.canvasContext.lineWidth = 0.3;
            this.canvasContext.stroke();
        };
        this.drawBall = (ball) => {
            this.canvasContext.beginPath();
            this.canvasContext.arc(ball.spawnXPosition, ball.spawnYPosition, ball.size, 0, 2 * Math.PI);
            this.canvasContext.fillStyle = "rgba(215, 215, 215, 0.7)";
            this.canvasContext.fill();
            this.canvasContext.strokeStyle = "rgba(215, 215, 215, 0.7)";
            this.canvasContext.stroke();
        };
        this.spawnBalls = ({ xPosition, yPosition, density = 3 }) => {
            for (let i = 0; i < density; i++) {
                new BouncyBall(xPosition, yPosition);
            }
        };
        this.bouncyBallList = [];
        this.canvas = document.getElementById("bouncyBall");
        this.canvasContext = this.canvas.getContext("2d");
        requestAnimationFrame(this.animate.bind(this));
    }
}
class BouncyBall {
    constructor(spawnX, spawnY) {
        this.update = () => {
            this.spawnXPosition = this.spawnXPosition - this.velocityX;
            this.spawnYPosition = this.spawnYPosition - this.velocityY;
            if (this.doesBallIntersectCanvasBoundary() && this.wasSpawnedByClick) {
                ballCanvas.bouncyBallList.splice(ballCanvas.bouncyBallList.indexOf(this), 1);
                return;
            }
            if (this.spawnXPosition < 0 + this.size || this.spawnXPosition > ballCanvas.canvas.width - this.size) {
                this.velocityX = this.velocityX * -1;
            }
            else if (this.spawnYPosition < 0 + this.size || this.spawnYPosition > ballCanvas.canvas.height - this.size) {
                this.velocityY = this.velocityY * -1;
            }
            this.linkedbouncyBalls = [];
            this.seekLines();
            ballCanvas.drawBall(this);
        };
        this.seekLines = () => {
            for (let i = 0; i < ballCanvas.bouncyBallList.length; i++) {
                const distanceX = ballCanvas.bouncyBallList[i].spawnXPosition - this.spawnXPosition;
                const distanceY = ballCanvas.bouncyBallList[i].spawnYPosition - this.spawnYPosition;
                const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
                if (ballCanvas.bouncyBallList[i] != this && ballCanvas.bouncyBallList[i].linkedbouncyBalls != null && distance < ballCanvas.density() && this.linkedbouncyBalls.indexOf(ballCanvas.bouncyBallList[i]) === -1) {
                    ballCanvas.drawLine(this.spawnXPosition, this.spawnYPosition, ballCanvas.bouncyBallList[i].spawnXPosition, ballCanvas.bouncyBallList[i].spawnYPosition, distance);
                    this.linkedbouncyBalls.push(ballCanvas.bouncyBallList[i]);
                }
            }
        };
        this.doesBallIntersectCanvasBoundary = () => {
            return this.spawnXPosition < 0 + this.size || this.spawnXPosition > ballCanvas.canvas.width - this.size || this.spawnYPosition < 0 + this.size || this.spawnYPosition > ballCanvas.canvas.height - this.size;
        };
        if (spawnX && spawnY) {
            this.spawnXPosition = spawnX;
            this.spawnYPosition = spawnY;
            this.wasSpawnedByClick = true;
        }
        else {
            this.spawnXPosition = Math.floor(Math.random() * (ballCanvas.canvas.width));
            this.spawnYPosition = Math.floor(Math.random() * (ballCanvas.canvas.height));
        }
        this.velocityX = Math.random() * generateDecimalBetween(-1.0, 1.0);
        this.velocityY = Math.random() * generateDecimalBetween(-1.0, 1.0);
        this.size = generateDecimalBetween(0.3, 1.3);
        ballCanvas.bouncyBallList.push(this);
    }
}
window.addEventListener("resize", function () {
    ballCanvas.redraw(window.innerWidth, window.innerHeight);
});
window.onload = function () {
    ballCanvas = new BallCanvas();
    ballCanvas.redraw(window.innerWidth, window.innerHeight);
};
document.addEventListener('click', function (event) {
    ballCanvas.spawnBalls({ xPosition: event.x, yPosition: event.y });
}, false);
document.addEventListener("touchstart", function (event) {
    ballCanvas.spawnBalls({ xPosition: event.touches[0].pageX, yPosition: event.touches[0].pageY });
}, false);