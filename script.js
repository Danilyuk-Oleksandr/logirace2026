const startBtn = document.getElementById("start-btn");
const eventText = document.getElementById("event-text");
const logList = document.getElementById("log-list");

function addLog(message) {
    const li = document.createElement("li");
    li.textContent = message;
    logList.appendChild(li);
}

startBtn.addEventListener("click", () => {
    eventText.textContent = "Warning! Dust storm detected.";
    addLog("Mission started");
    addLog("Dust storm detected");
});