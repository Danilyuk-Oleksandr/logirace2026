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
let currentEvent;

let oxygen = 80;
let power = 80;
let food = 80;
let morale = 80;
let credits = 100;

let minutes = 24;
let seconds = 0;
let timerInterval;

let totalSeconds = 24 * 60;

let sol = 1;
const solEl = document.getElementById("sol");

const events = [
    {
        text: "Пилова буря наближається до сонячних панелей.",
        effect: "sandstorm",
        options: [
            { text: "Активувати щити", action: () => { power -= 15; addLog("Щити активовано"); } },
            { text: "Ігнорувати бурю", action: () => { oxygen -= 15; morale -= 10; addLog("Буря пошкодила системи"); } },
            { text: "Відправити дрон", action: () => { power -= 5; addLog("Дрон дослідив бурю"); } }
        ]
    },

    {
        text: "Метеорит пошкодив зовнішній модуль.",
        effect: "impact",
        options: [
            { text: "Ремонт модуля", action: () => { power -= 10; oxygen += 5; addLog("Модуль відремонтовано"); } },
            { text: "Ізолювати сектор", action: () => { morale -= 5; addLog("Сектор ізольовано"); } },
            { text: "Ігнорувати", action: () => { oxygen -= 20; addLog("Втрачено кисень"); } }
        ]
    },

    {
        text: "Температура в теплиці падає.",
        effect: "freeze",
        options: [
            { text: "Перенаправити енергію", action: () => { power -= 10; food += 5; addLog("Енергію перенаправлено"); } },
            { text: "Вимкнути теплицю", action: () => { food -= 20; addLog("Теплицю вимкнено"); } },
            { text: "Резервний обігрів", action: () => { power -= 8; addLog("Обігрів увімкнено"); } }
        ]
    },

    {
        text: "Виявлено конфлікт серед екіпажу.",
        effect: "glitch",
        options: [
            { text: "Дати відпочинок", action: () => { morale += 10; power -= 5; addLog("Екіпаж відпочив"); } },
            { text: "Ігнорувати", action: () => { morale -= 20; addLog("Мораль впала"); } },
            { text: "Провести збори", action: () => { morale += 5; addLog("Проведено збори"); } }
        ]
    },

    {
        text: "Реактор перегрівається.",
        effect: "heat",
        options: [
            { text: "Охолодити", action: () => { power -= 15; addLog("Реактор охолоджено"); } },
            { text: "Вимкнути", action: () => { power -= 30; addLog("Реактор вимкнено"); } },
            { text: "Ризикнути", action: () => { morale -= 10; addLog("Реактор працює на межі"); } }
        ]
    },

    {
        text: "Запаси води знижуються.",
        effect: "warning",
        options: [
            { text: "Переробити лід", action: () => { power -= 10; addLog("Воду поповнено"); } },
            { text: "Економія", action: () => { morale -= 10; addLog("Економія води"); } },
            { text: "Пошук льоду", action: () => { power -= 5; addLog("Пошук льоду"); } }
        ]
    },

    {
        text: "Система зв'язку втратила сигнал із Землею.",
        effect: "glitch",
        options: [
            { text: "Перезавантажити антену", action: () => { power -= 8; addLog("Антену перезавантажено"); } },
            { text: "Чекати", action: () => { morale -= 8; addLog("Екіпаж нервує"); } },
            { text: "Резервний канал", action: () => { power -= 5; morale += 3; addLog("Резервний канал активовано"); } }
        ]
    },

    {
        text: "Робот-помічник зламався.",
        effect: "glitch",
        options: [
            { text: "Полагодити", action: () => { power -= 7; addLog("Робота полагоджено"); } },
            { text: "Розібрати на деталі", action: () => { power += 5; addLog("Отримано запчастини"); } },
            { text: "Ігнорувати", action: () => { morale -= 5; addLog("Екіпаж незадоволений"); } }
        ]
    },

    {
        text: "Знайдено нове родовище льоду.",
        effect: "success",
        options: [
            { text: "Добувати", action: () => { power -= 8; oxygen += 10; addLog("Лід добуто"); } },
            { text: "Позначити на карті", action: () => { addLog("Локацію збережено"); } },
            { text: "Ігнорувати", action: () => { addLog("Ресурс пропущено"); } }
        ]
    },

    {
        text: "Відмова системи фільтрації повітря.",
        effect: "danger",
        options: [
            { text: "Швидкий ремонт", action: () => { oxygen += 10; power -= 10; addLog("Фільтр відновлено"); } },
            { text: "Резервний фільтр", action: () => { credits -= 15; addLog("Резерв використано"); } },
            { text: "Чекати", action: () => { oxygen -= 20; addLog("Повітря погіршується"); } }
        ]
    },

    {
        text: "Виявлено невідому бактерію в лабораторії.",
        effect: "toxic",
        options: [
            { text: "Ізоляція", action: () => { power -= 5; addLog("Лабораторію ізольовано"); } },
            { text: "Дослідити", action: () => { morale += 5; addLog("Почато дослідження"); } },
            { text: "Знищити зразок", action: () => { addLog("Зразок знищено"); } }
        ]
    },

    {
        text: "Сонячний спалах впливає на електроніку.",
        effect: "flash",
        options: [
            { text: "Вимкнути системи", action: () => { power -= 5; addLog("Системи захищено"); } },
            { text: "Ризикнути", action: () => { power -= 20; addLog("Системи пошкоджено"); } },
            { text: "Щити", action: () => { power -= 10; addLog("Щити активовано"); } }
        ]
    },

    {
        text: "Екіпаж святкує маленьку перемогу.",
        effect: "success",
        options: [
            { text: "Святкувати", action: () => { morale += 15; food -= 5; addLog("Святкування завершено"); } },
            { text: "Працювати далі", action: () => { morale -= 5; addLog("Без відпочинку"); } },
            { text: "Коротка перерва", action: () => { morale += 5; addLog("Перерва завершена"); } }
        ]
    },

    {
        text: "Відкрито новий кратер поблизу бази.",
        effect: "impact",
        options: [
            { text: "Дослідити", action: () => { power -= 6; credits += 10; addLog("Знайдено ресурси"); } },
            { text: "Ігнорувати", action: () => { addLog("Кратер проігноровано"); } },
            { text: "Поставити маяк", action: () => { power -= 3; addLog("Маяк встановлено"); } }
        ]
    },

    {
        text: "Скафандр пошкоджено.",
        effect: "danger",
        options: [
            { text: "Полагодити", action: () => { credits -= 10; addLog("Скафандр полагоджено"); } },
            { text: "Замінити", action: () => { credits -= 20; addLog("Скафандр замінено"); } },
            { text: "Ігнорувати", action: () => { morale -= 8; addLog("Ризик для екіпажу"); } }
        ]
    },

    {
        text: "Несправність у системі освітлення.",
        effect: "glitch",
        options: [
            { text: "Ремонт", action: () => { power -= 4; addLog("Освітлення відновлено"); } },
            { text: "Резервне світло", action: () => { power -= 2; addLog("Резерв активовано"); } },
            { text: "Ігнорувати", action: () => { morale -= 5; addLog("Темрява нервує екіпаж"); } }
        ]
    },

    {
        text: "Марсохід повернувся з ресурсами.",
        effect: "success",
        options: [
            { text: "Прийняти вантаж", action: () => { food += 10; credits += 5; addLog("Ресурси отримано"); } },
            { text: "Перевірити", action: () => { addLog("Вантаж перевірено"); } },
            { text: "Відкласти", action: () => { morale -= 3; addLog("Доставка відкладена"); } }
        ]
    },

    {
        text: "Тривога: витік кисню.",
        effect: "danger",
        options: [
            { text: "Закрити шлюз", action: () => { oxygen -= 5; addLog("Шлюз закрито"); } },
            { text: "Ремонт", action: () => { power -= 8; oxygen += 8; addLog("Витік усунуто"); } },
            { text: "Евакуація сектора", action: () => { morale -= 6; addLog("Сектор евакуйовано"); } }
        ]
    },

    {
        text: "Знайдено старий покинутий модуль.",
        effect: "success",
        options: [
            { text: "Розібрати", action: () => { credits += 15; addLog("Отримано ресурси"); } },
            { text: "Дослідити", action: () => { morale += 5; addLog("Знайдено дані"); } },
            { text: "Залишити", action: () => { addLog("Модуль залишено"); } }
        ]
    },

    {
        text: "Ніч на Марсі особливо холодна.",
        effect: "freeze",
        options: [
            { text: "Підняти обігрів", action: () => { power -= 12; addLog("Обігрів посилено"); } },
            { text: "Теплі костюми", action: () => { morale += 3; addLog("Екіпаж утеплено"); } },
            { text: "Економити", action: () => { morale -= 7; addLog("Холодно, але економно"); } }
        ]
    }
];

const rareEvents = [
   {
      text: "Виявлено покинуту земну капсулу.",
      effect: "success",
      options: [
          { text: "Обшукати", action: () => { credits += 30; morale += 10; } },
          { text: "Залишити", action: () => {} },
          { text: "Знищити", action: () => { morale -= 5; } }
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

let lastEventIndex = -1;

function randomEvent() {
    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * events.length);
    } while (randomIndex === lastEventIndex);

    lastEventIndex = randomIndex;

    if (Math.random() < 0.15) {
        currentEvent = rareEvents[Math.floor(Math.random() * rareEvents.length)];
    } else {
        currentEvent = events[randomIndex];
    }

    eventText.textContent = currentEvent.text;

    choice1.textContent = currentEvent.options[0].text;
    choice2.textContent = currentEvent.options[1].text;
    choice3.textContent = currentEvent.options[2].text;

    choice1.onclick = () => handleChoice(currentEvent.options[0]);
    choice2.onclick = () => handleChoice(currentEvent.options[1]);
    choice3.onclick = () => handleChoice(currentEvent.options[2]);
}

function handleChoice(option) {
    option.action();
    playEffect(currentEvent.effect);

    oxygen = Math.max(0, Math.min(100, oxygen));
    power = Math.max(0, Math.min(100, power));
    food = Math.max(0, Math.min(100, food));
    morale = Math.max(0, Math.min(100, morale));

    updateUI();
    checkStatus();
    setTimeout(() => {
        document.body.classList.remove(
            "effect-sandstorm",
            "effect-danger",
            "effect-success",
            "effect-glitch",
            "effect-freeze",
            "effect-heat",
            "effect-flash",
            "effect-toxic",
            "effect-impact",
            "effect-warning"
        );
    }, 2500);
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
        document.getElementById("restart-btn").style.display = "inline-block";

        choice1.style.display = "none";
        choice2.style.display = "none";
        choice3.style.display = "none";

        addLog("Колонія зруйнована");
    }
}

function startTimer() {
    if (timerInterval) return;

    totalSeconds--;

    minutes = Math.floor(totalSeconds / 60);
    seconds = totalSeconds % 60;

    if (totalSeconds % 60 === 0) {
        sol++;
        solEl.textContent = sol;
    }

    timerInterval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timerInterval);
                eventText.textContent = "МІСІЮ УСПІШНО ЗАВЕРШЕНО";
                choice1.style.display = "none";
                choice2.style.display = "none";
                choice3.style.display = "none";
                document.getElementById("restart-btn").style.display = "inline-block";
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

function createSandParticle() {
    const particle = document.createElement("div");
    particle.classList.add("sand-particle");

    particle.style.left = Math.random() * window.innerWidth + "px";
    particle.style.top = "-10px";

    const size = Math.random() * 2 + 1;
    particle.style.width = size + "px";
    particle.style.height = size + "px";

    particle.style.animationDuration = (Math.random() * 2 + 1) + "s";

    particlesContainer.appendChild(particle);

    setTimeout(() => particle.remove(), 3000);
}

function activateSandstorm() {
    document.body.classList.add("sandstorm");

    let interval = setInterval(() => {
        for (let i = 0; i < 25; i++) {
            createSandParticle();
        }
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        document.body.classList.remove("sandstorm");
    }, 2500);
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
    document.getElementById("status-time").textContent =
        timerEl.textContent || "24:00";
}

function switchScreen(hideScreen, showScreen) {
    hideScreen.classList.remove("active");
    showScreen.classList.add("active");
}

function playEffect(type) {
    document.body.classList.remove(
        "effect-sandstorm",
        "effect-danger",
        "effect-success",
        "effect-glitch",
        "effect-freeze",
        "effect-heat",
        "effect-flash",
        "effect-toxic",
        "effect-impact",
        "effect-warning"
    );

    document.body.classList.add("effect-" + type);

    if (type === "sandstorm") activateSandstorm();

    setTimeout(() => {
        document.body.className = "";
    }, 2500);
}

function calculateScore() {
    return oxygen + power + food + morale + credits;
}

if (minutes === 0 && seconds === 0) {
   const finalScore = calculateScore();
   addLog("Фінальний score: " + finalScore);
}

setInterval(() => {
    oxygen -= 1;
    power -= 1;
    food -= 1;

    updateUI();
    checkStatus();
}, 10000);

function setDifficulty(mode) {
   if (mode === "easy") {
      credits = 150;
   }

   if (mode === "hard") {
      oxygen = 60;
      power = 60;
      food = 60;
      morale = 60;
      credits = 70;
   }

   updateUI();
}

function showEnding() {
   const score = calculateScore();

   if (score > 420) {
      eventText.textContent = "ЛЕГЕНДАРНИЙ ФІНАЛ: BASE OMEGA ВРЯТОВАНО";
   } else if (score > 300) {
      eventText.textContent = "ХОРОШИЙ ФІНАЛ: БАЗА ВИЖИЛА";
   } else {
      eventText.textContent = "ПОГАНИЙ ФІНАЛ: ВИЖИВАННЯ ЦІНОЮ ВТРАТ";
   }
}