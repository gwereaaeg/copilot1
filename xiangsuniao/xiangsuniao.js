const canvas = document.getElementById('gameCanvas'); // 獲取畫布元素，用於渲染遊戲
const ctx = canvas.getContext('2d'); // 獲取2D繪圖上下文，用於繪製遊戲內容
alert("按空格跳躍、按ESC暫停、按回車重新開始遊戲"); // 提示玩家如何操作遊戲
// 调试代码：检查 body 的背景颜色
console.log('Body background color:', getComputedStyle(document.body).backgroundColor);

// 定義鳥類物件，表示遊戲中的小鳥
let bird = {
    x: 400, // 鳥的初始橫坐標（畫布左邊距離為50像素）
    y: 150, // 鳥的初始縱坐標（畫布上邊距離為150像素）
    width: 20, // 鳥的寬度（20像素）
    height: 20, // 鳥的高度（20像素）
    gravity: 0.9, // 重力加速度，每幀增加鳥的下落速度
    lift: -10, // 向上的推力，當按下按鍵時給鳥一個向上的加速度
    velocity: 0, // 初始速度（初始值為0）
    show: function () {
        ctx.fillStyle = '#00F'; // 設置填充顏色為藍色
        ctx.fillRect(this.x, this.y, this.width, this.height); // 繪製鳥
    },
    update: function () {
        if (!paused && !gameover) {
            this.velocity += this.gravity; // 每次更新時，速度增加重力值，模擬自由落體
            this.y += this.velocity; // 根據速度更新鳥的位置
            if (this.y > canvas.height - this.height) {
                this.y = canvas.height - this.height; // 防止鳥掉出畫布，固定在畫布底部
                this.velocity = 0; // 重置速度，防止加速度累積
            }
            if (this.y < 0) {
                this.y = 0; // 防止鳥飛出畫布，固定在畫布頂部
                this.velocity = 0; // 重置速度，防止加速度累積
            }
        }
    },
    up: function () {
        this.velocity = this.lift; // 當鳥向上飛時，立即設置速度為推力值
    }
};

// 调试代码：检查 canvas 的样式
console.log('Canvas border:', getComputedStyle(canvas).border);

// 管道物件的陣列，用於存儲生成的所有管道
let pipes = [];
let frame = 0; // 計算幀數，控制管道生成的間隔
let score = 0; // 計算分數
let gameover = false; // 遊戲結束標誌，用於控制遊戲結束狀態
let paused = false; // 暫停標誌，用於控制遊戲暫停狀態

// 定義管道物件，表示遊戲中的障礙物
function Pipe() {
    this.spacing = 125; // 上下管道之間的間距（125像素）
    this.top = Math.floor(Math.random() * (canvas.height / 2)); // 隨機生成上管道的高度（上半部分範圍內）
    this.bottom = this.top + this.spacing; // 計算下管道的起點位置
    this.x = canvas.width; // 管道的初始橫坐標（畫布右邊緣）
    this.width = 20; // 管道的寬度（20像素）
    this.speed = 3; // 管道的移動速度（每幀移動3像素）

    this.show = function () {
        ctx.fillStyle = '#0F0'; // 設置填充顏色為綠色
        ctx.fillRect(this.x, 0, this.width, this.top); // 繪製上管道
        ctx.fillRect(this.x, this.bottom, this.width, canvas.height - this.bottom); // 繪製下管道
    };

    this.update = function () {
        if (!paused && !gameover) {
            this.x -= this.speed; // 每次更新時，管道向左移動
        }
    };

    this.offscreen = function () {
        return this.x < -this.width; // 判斷管道是否移出畫布
    };

    this.hits = function (bird) {
        if (bird.y < this.top || bird.y > this.bottom) {
            if (bird.x > this.x && bird.x < this.x + this.width) {
                return true; // 檢測鳥是否撞到管道
            }
        }
        return false;
    };
}

// 主繪製函數，用於更新和繪製遊戲內容
function draw() {
    if (!paused && !gameover) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空畫布

        bird.show(); // 顯示鳥
        bird.update(); // 更新鳥的位置

        if (frame % 60 === 0) {
            pipes.push(new Pipe()); // 每60幀創建一個新管道
        }

        pipes.forEach((pipe, index) => {
            pipe.show(); // 顯示管道
            pipe.update(); // 更新管道的位置

            if (pipe.hits(bird)) {
                console.log('HIT'); // 當鳥撞到管道時，在控制台顯示“HIT”
                gameover = true; // 設置遊戲結束標誌
                return; // 遊戲結束後停止更新
            }

            if (pipe.offscreen()) {
                pipes.splice(index, 1); // 當管道移出畫布時，從陣列中移除
                score++; // 增加分數
            }
        });

        ctx.fillStyle = '#000'; // 設置填充顏色為黑色
        ctx.font = '20px Arial'; // 設置字體
        ctx.fillText('Score: ' + score, 10, 25); // 在畫布上顯示分數

        frame++; // 增加幀數
    }

    if (gameover) {
        ctx.fillStyle = '#F00'; // 設置填充顏色為紅色
        ctx.font = '40px Arial'; // 設置字體
        ctx.fillText('Game Over', 60, canvas.height / 2); // 顯示遊戲結束信息
    }
}

// 重置遊戲函數，用於重新開始遊戲
function resetGame() {
    bird.y = 150; // 重置鳥的位置
    bird.velocity = 0; // 重置鳥的速度
    pipes = []; // 清空管道物件
    score = 0; // 重置分數
    frame = 0; // 重置幀數
    gameover = false; // 重置遊戲結束標誌
    paused = false; // 重置暫停標誌
}

// 設置初始函數，用於設置事件監聽和開始遊戲
function setup() {

    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space' && !gameover) {
            bird.up(); // 當按下空格鍵時，讓鳥立即向上飛
        }
        if (event.code === 'Escape') {
            paused = !paused; // 當按下ESC鍵時，切換暫停狀態
        }
        if (event.code === 'Enter' && gameover) {
            resetGame(); // 當按下回車鍵時，重新開始遊戲
        }
    });

    setInterval(draw, 1000 / 60); // 設置更新頻率為每秒60次
}

setup(); // 初始化遊戲

// 添加返回按钮的点击事件
document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = '../index.html'; // 跳转到上层目录中的 index.html
});