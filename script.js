const timerEl = document.getElementById("timer");
const eventText = document.getElementById("event-text");
const logList = document.getElementById("log-list");

const startBtn = document.getElementById("start-btn");
const choice1 = document.getElementById("choice1");
const choice2 = document.getElementById("choice2");

const oxygenEl = document.getElementById("oxygen");
const powerEl = document.getElementById("power");
const foodEl = document.getElementById("food");
const moraleEl = document.getElementById("morale");

let oxygen = 100;
let power = 100;
let food = 100;
let morale = 100;

let minutes = 24;
let seconds = 0;
let timerInterval;

const events = [
    {
        text: "Пилова буря наближається до сонячних панелей.",
        options: [
            {
                text: "Активувати щити",
                action: () => {
                    power -= 15;
                    addLog("Щити активовано");
                }
            },
            {
                text: "Ігнорувати бурю",
                action: () => {
                    oxygen -= 15;
                    morale -= 10;
                    addLog("Буря пошкодила системи");
                }
            }
        ]
    },
    {
        text: "Температура в теплиці падає.",
        options: [
            {
                text: "Перенаправити енергію",
                action: () => {
                    power -= 10;
                    food += 5;
                    addLog("Енергію перенаправлено");
                }
            },
            {
                text: "Вимкнути теплицю",
                action: () => {
                    food -= 20;
                    addLog("Теплицю вимкнено");
                }
            }
        ]
    },
    {
        text: "Виявлено конфлікт серед екіпажу.",
        options: [
            {
                text: "Дати час на відпочинок",
                action: () => {
                    morale += 10;
                    power -= 5;
                    addLog("Екіпаж відпочив");
                }
            },
            {
                text: "Ігнорувати конфлікт",
                action: () => {
                    morale -= 20;
                    addLog("Мораль екіпажу впала");
                }
            }
        ]
    }
];

function addLog(message) {
    const li = document.createElement("li");
    li.textContent = message;
    logList.prepend(li);
}

function updateUI() {
    oxygenEl.textContent = oxygen;
    powerEl.textContent = power;
    foodEl.textContent = food;
    moraleEl.textContent = morale;
}

function randomEvent() {
    const event = events[Math.floor(Math.random() * events.length)];

    eventText.textContent = event.text;
    choice1.textContent = event.options[0].text;
    choice2.textContent = event.options[1].text;

    choice1.onclick = () => {
        event.options[0].action();
        updateUI();
        checkStatus();
        randomEvent();
    };

    choice2.onclick = () => {
        event.options[1].action();
        updateUI();
        checkStatus();
        randomEvent();
    };
}

function checkStatus() {
    if (oxygen <= 0 || power <= 0 || food <= 0 || morale <= 0) {
        eventText.textContent = "МІСІЮ ПРОВАЛЕНО";
        clearInterval(timerInterval);
        choice1.style.display = "none";
        choice2.style.display = "none";
        addLog("Колонія зруйнована");
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timerInterval);
                eventText.textContent = "МІСІЮ УСПІШНО ЗАВЕРШЕНО";
                choice1.style.display = "none";
                choice2.style.display = "none";
                addLog("Бурю успішно пережито");
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        timerEl.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }, 1000);
}

startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    addLog("Місію розпочато");
    startTimer();
    randomEvent();
});