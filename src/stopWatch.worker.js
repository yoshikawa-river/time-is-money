let timer = 0;
let timerInterval;

onmessage = (e) => {
    const data = e.data;

    switch (data.type) {
        case "start":
            timer = data.startTime;
            startTimer();
            break;
        case "stop":
            stopTimer(data.timerId);
            break;
        case "reset":
            timer = 0;
            postMessage({ type: "reset" });
            stopTimer(data.timerId);
            break;
        default:
            break;
    }
};

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            timer += 1;
            postMessage({ timerId: timerInterval, startTime: timer });
        }, 1000);
    }
}

function stopTimer(id) {
    if (id) {
        clearInterval(id);
        timerInterval = null;
    }
}