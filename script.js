let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapTimes = [];

const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStop');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');
const lapsDiv = document.getElementById('laps');

function formatTime(time) {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0')}`;
}

function updateDisplay() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    display.textContent = formatTime(elapsedTime);
}

function startStop() {
    beep();
    if (isRunning) {
        clearInterval(timerInterval);
        startStopBtn.textContent = 'Start';
    } else {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 10);
        startStopBtn.textContent = 'Stop';
    }
    isRunning = !isRunning;
}

function reset() {
    beep();
    clearInterval(timerInterval);
    elapsedTime = 0;
    display.textContent = '00:00:00:000';
    startStopBtn.textContent = 'Start';
    isRunning = false;
    lapTimes = [];
    lapsDiv.innerHTML = '';
}

function lap() {
    if (isRunning) {
        const lapTime = elapsedTime;
        lapTimes.push(lapTime);
        const lapElement = document.createElement('div');
        lapElement.className = 'lap-time';
        lapElement.textContent = `Lap ${lapTimes.length}: ${formatTime(lapTime)}`;
        lapsDiv.appendChild(lapElement);
        lapsDiv.scrollTop = lapsDiv.scrollHeight;
    }
}

function beep() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'square';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

startStopBtn.addEventListener('click', startStop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);