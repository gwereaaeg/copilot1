const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

document.getElementById('drawBirdButton').addEventListener('click', () => {
    drawBird();
});

function drawBird() {
    const bird = {
        x: canvas.width / 2 - 10,
        y: canvas.height / 2 - 10,
        width: 20,
        height: 20,
        color: '#00F'
    };

    ctx.fillStyle = bird.color;
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}