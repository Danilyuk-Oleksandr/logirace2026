const stormOverlay = document.getElementById("storm-overlay");

const startScreen = document.getElementById("start-screen");
const gameContent = document.getElementById("game-content");
const enterBtn = document.getElementById("enter-btn");
const menuScreen = document.getElementById("menu-screen");
const playBtn = document.getElementById("play-btn");

const upgradeBtn = document.getElementById("upgrade-btn");
const upgradeScreen = document.getElementById("upgrade-screen");
const backBtn = document.getElementById("back-btn");

const statusBtn = document.getElementById("status-btn");
const statusScreen = document.getElementById("status-screen");
const statusBackBtn = document.getElementById("status-back-btn");

const timerEl = document.getElementById("timer");
const eventText = document.getElementById("event-text");
const logList = document.getElementById("log-list");

const startBtn = document.getElementById("start-btn");
const choice1 = document.getElementById("choice1");
const choice2 = document.getElementById("choice2");
const choice3 = document.getElementById("choice3");

const oxygenEl = document.getElementById("oxygen");
const powerEl = document.getElementById("power");
const foodEl = document.getElementById("food");
const moraleEl = document.getElementById("morale");

const particlesContainer = document.getElementById("particles");

let stormInterval;


let oxygen = 80;
let power = 80;
let food = 80;
let morale = 80;
let credits = 100;

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
                    activateStorm();
                    addLog("Щити активовано");
                }
            },
            {
                text: "Ігнорувати бурю",
                action: () => {
                    oxygen -= 15;
                    morale -= 10;
                    activateStorm();
                    addLog("Буря пошкодила системи");
                }
            },
            {
                text: "Відправити дрон",
                action: () => {
                    power -= 5;
                    addLog("Дрон дослідив бурю");
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
            },
            {
                text: "Увімкнути резервний обігрів",
                action: () => {
                    power -= 8;
                    addLog("Резервний обігрів активовано");
                }
            }
        ]
    },

    {
        text: "Виявлено конфлікт серед екіпажу.",
        options: [
            {
                text: "Дати відпочинок",
                action: () => {
                    morale += 10;
                    power -= 5;
                    addLog("Екіпаж відпочив");
                }
            },
            {
                text: "Ігнорувати",
                action: () => {
                    morale -= 20;
                    addLog("Мораль екіпажу впала");
                }
            },
            {
                text: "Провести збори",
                action: () => {
                    morale += 5;
                    addLog("Проведено збори екіпажу");
                }
            }
        ]
    },

    {
        text: "Реактор перегрівається.",
        options: [
            {
                text: "Охолодити реактор",
                action: () => {
                    power -= 15;
                    addLog("Реактор охолоджено");
                }
            },
            {
                text: "Вимкнути реактор",
                action: () => {
                    power -= 30;
                    addLog("Реактор вимкнено");
                }
            },
            {
                text: "Ризикнути",
                action: () => {
                    morale -= 10;
                    addLog("Реактор працює на межі");
                }
            }
        ]
    },

    {
        text: "Запаси води знижуються.",
        options: [
            {
                text: "Переробити лід",
                action: () => {
                    power -= 10;
                    addLog("Запаси води поповнено");
                }
            },
            {
                text: "Економія води",
                action: () => {
                    morale -= 10;
                    addLog("Увімкнено економію води");
                }
            },
            {
                text: "Пошук підземного льоду",
                action: () => {
                    power -= 5;
                    addLog("Розпочато пошук льоду");
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

    document.getElementById("oxygen-bar").style.width = oxygen + "%";
    document.getElementById("power-bar").style.width = power + "%";
    document.getElementById("food-bar").style.width = food + "%";
    document.getElementById("morale-bar").style.width = morale + "%";

    updateStatusScreen();
}

function randomEvent() {
    let lastEventIndex = -1;

    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * events.length);
    } while (randomIndex === lastEventIndex);

    lastEventIndex = randomIndex;
    const event = events[randomIndex];

    eventText.textContent = event.text;

    choice1.textContent = event.options[0].text;
    choice2.textContent = event.options[1].text;
    choice3.textContent = event.options[2].text;

    choice1.onclick = () => handleChoice(event.options[0]);
    choice2.onclick = () => handleChoice(event.options[1]);
    choice3.onclick = () => handleChoice(event.options[2]);
}

function handleChoice(option) {
    option.action();
    updateUI();
    checkStatus();
    randomEvent();
}

function checkStatus() {
    if (oxygen < 25 || power < 25 || food < 25 || morale < 25) {
        document.body.classList.add("danger");
    } else {
        document.body.classList.remove("danger");
    }

    if (oxygen <= 0 || power <= 0 || food <= 0 || morale <= 0) {
        eventText.textContent = "МІСІЮ ПРОВАЛЕНО";
        clearInterval(timerInterval);

        choice1.style.display = "none";
        choice2.style.display = "none";
        choice3.style.display = "none";

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

enterBtn.addEventListener("click", () => {
    switchScreen(startScreen, menuScreen);
});

playBtn.addEventListener("click", () => {
    switchScreen(menuScreen, gameContent);
});

function createParticle() {
    const p = document.createElement("div");
    p.classList.add("particle");

    const colors = ["#ffcc00", "#ff7b00", "#ff3b1f"];
    p.style.background = colors[Math.floor(Math.random() * colors.length)];

    p.style.left = Math.random() * window.innerWidth + "px";
    p.style.top = "-10px";

    const size = Math.random() * 6 + 2;
    p.style.width = size + "px";
    p.style.height = size + "px";

    const duration = Math.random() * 3 + 2;
    p.style.animationDuration = duration + "s";

    particlesContainer.appendChild(p);

    setTimeout(() => {
        p.remove();
    }, duration * 1000);
}

function activateStorm() {
    document.body.classList.add("blurred");

    stormInterval = setInterval(() => {
        for (let i = 0; i < 6; i++) {
            createParticle();
        }
    }, 120);

    setTimeout(() => {
        clearInterval(stormInterval);
        document.body.classList.remove("blurred");
    }, 5000);
}

upgradeBtn.addEventListener("click", () => {
    switchScreen(menuScreen, upgradeScreen);
});

backBtn.addEventListener("click", () => {
    switchScreen(upgradeScreen, menuScreen);
});

function buyUpgrade(type, price) {

    if (credits < price) {
        addLog("Недостатньо кредитів");
        return;
    }

    const button = document.getElementById(type + "-upgrade");

    if (button.disabled) {
        addLog("Покращення вже куплено");
        return;
    }

    credits -= price;

    if (type === "oxygen") oxygen = Math.min(100, oxygen + 20);
    if (type === "power") power = Math.min(100, power + 20);
    if (type === "food") food = Math.min(100, food + 20);
    if (type === "morale") morale = Math.min(100, morale + 20);

    button.disabled = true;
    button.textContent = "ПРИДБАНО";
    button.style.background = "#2ea043";

    document.getElementById("credits").textContent = credits;

    updateUI();
    addLog("Придбано покращення: " + type);
}

statusBtn.addEventListener("click", () => {
    updateStatusScreen();
    switchScreen(menuScreen, statusScreen);
});

statusBackBtn.addEventListener("click", () => {
    switchScreen(statusScreen, menuScreen);
});

function updateStatusScreen() {
    document.getElementById("status-oxygen").textContent = oxygen;
    document.getElementById("status-power").textContent = power;
    document.getElementById("status-food").textContent = food;
    document.getElementById("status-morale").textContent = morale;
    document.getElementById("status-credits").textContent = credits;
    document.getElementById("status-time").textContent = timerEl.textContent;
}

function switchScreen(hideScreen, showScreen) {
    hideScreen.classList.remove("active");

    setTimeout(() => {
        showScreen.classList.add("active");
    }, 500);
}