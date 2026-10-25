const myCanvas = document.getElementById("myCanvas");
const textDisplay = document.getElementById("text-display");
const arraySizeSlider = document.getElementById("array-size");
const arraySizeValue = document.getElementById("array-size-value");
const animationSpeedSlider = document.getElementById("animation-speed");
const animationSpeedValue = document.getElementById("animation-speed-value");

myCanvas.width = 750;
myCanvas.height = 400;
const margin = 30;
let n = parseInt(arraySizeSlider.value);
let array = [];
let moves = [];
let cols = [];
const ctx = myCanvas.getContext("2d");
const maxColumnHeight = 200;
let animationSpeed = parseInt(animationSpeedSlider.value);

arraySizeSlider.addEventListener('input', (e) => updateArraySize(e.target.value));
animationSpeedSlider.addEventListener('input', (e) => updateSpeed(e.target.value));

function updateArraySize(value) {
    n = parseInt(value);
    arraySizeValue.innerText = value;
    init();
}

function updateSpeed(value) {
    animationSpeed = parseInt(value);
    animationSpeedValue.innerText = value;
}

function init() {
    array = [];
    cols = [];
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    moves = [];
    const spacing = (myCanvas.width - margin * 2) / n;
    for (let i = 0; i < array.length; i++) {
        const x = i * spacing + spacing / 2 + margin;
        const y = myCanvas.height - margin - i * 2.5;
        const height = maxColumnHeight * array[i];
        const width = spacing - 1;
        cols[i] = new Column(x, y, width, height);
    }
    textDisplay.innerText = " ";

    animate();
}

function bubble() {
    textDisplay.innerText = "Bubble Sort: A simple comparison-based algorithm where each pair of adjacent elements is compared and swapped if they are in the wrong order.";
    moves = bubblesort(array);
    animate();
}

function quick() {
    textDisplay.innerText = "Quick Sort: A divide-and-conquer algorithm that partitions the array into two halves around a pivot element, then recursively sorts the subarrays.";
    moves = quicksort(array);
    animate();
}

function selection() {
    textDisplay.innerText = "Selection Sort: A simple comparison-based algorithm that repeatedly selects the minimum element from the unsorted portion and moves it to the sorted portion.";
    moves = selectionsort(array);
    animate();
}

function insertion() {
    textDisplay.innerText = "Insertion Sort: A simple comparison-based algorithm that builds the sorted array one element at a time by repeatedly inserting the next element into the correct position.";
    moves = insertionsort(array);
    animate();
}

function animate() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    let changed = false;
    for (let i = 0; i < cols.length; i++) {
        changed = cols[i].draw(ctx) || changed;
    }
    if (!changed && moves.length > 0) {
        const move = moves.shift();
        const [i, j] = move.indices;
        if (i >= 0 && j >= 0 && cols[i] && cols[j]) {
            if (move.swap) {
                cols[i].moveTo(cols[j], -1, animationSpeed);
                cols[j].moveTo(cols[i], -1, animationSpeed);
                [cols[i], cols[j]] = [cols[j], cols[i]];
            } else {
                cols[i].jump(animationSpeed);
                cols[j].jump(animationSpeed);
            }
        }
    }
    requestAnimationFrame(animate);
}

class Column {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.queue = [];
        this.color = "rgb(0, 191, 255)"; // Default color
    }

    draw(ctx) {
        let changd = false;
        if (this.queue.length > 0) {
            const { x, y, color } = this.queue.shift();
            this.x = x;
            this.y = y;
            this.color = color;
            changd = true;
        }
        const left = this.x - this.width / 2;
        const top = this.y - this.height;
        const right = this.x + this.width / 2;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.moveTo(left, top);
        ctx.lineTo(left, this.y);
        ctx.ellipse(this.x, this.y, this.width / 2, this.width / 4, 0, Math.PI, Math.PI * 2, true);
        ctx.lineTo(right, top);
        ctx.ellipse(this.x, top, this.width / 2, this.width / 4, 0, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        return changd;
    }

    moveTo(loc, yoffset = 1, speed) {
        const frameCount = Math.floor(1000 / speed);
        for (let i = 0; i <= frameCount; i++) {
            const t = i / frameCount;
            const u = Math.sin(t * Math.PI);
            this.queue.push({
                x: lerp(this.x, loc.x, t),
                y: lerp(this.y, loc.y, t) + u * this.width / 2 * yoffset,
                color: "rgb(0, 204, 0)" // Green color for moveTo
            });
        }
        // Push the final position with the default color to reset it
        this.queue.push({
            x: loc.x,
            y: loc.y,
            color: "rgb(0, 191, 255)" // Reset to default color
        });
    }

    jump(speed) {
        const frameCount = Math.floor(1000 / speed);
        for (let i = 0; i <= frameCount; i++) {
            const t = i / frameCount;
            const u = Math.sin(t * Math.PI);
            this.queue.push({
                x: this.x,
                y: this.y - u * this.width,
                color: "rgb(255, 0, 0)" // Red color for jump
            });
        }
        // Push the final position with the default color to reset it
        this.queue.push({
            x: this.x,
            y: this.y,
            color: "rgb(0, 191, 255)" // Reset to default color
        });
    }
}

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}
