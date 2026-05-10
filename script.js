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

let crew = [
    {
        name: "Commander Vega",
        role: "Командир",
        health: 100,
        stress: 20,
        skill: "leadership"
    },
    {
        name: "Engineer Nova",
        role: "Інженер",
        health: 100,
        stress: 15,
        skill: "repair"
    },
    {
        name: "Biologist Orion",
        role: "Біолог",
        health: 100,
        stress: 10,
        skill: "science"
    }
];

let oxygen = 80;
let power = 80;
let food = 80;
let morale = 80;
let credits = 100;

let inventory = [
   "Repair Kit",
   "Food Pack",
   "Battery Cell",
   "Med Kit"
];

const lootItems = [
    "Oxygen Tank",
    "Repair Kit",
    "Food Pack",
    "Battery Cell",
    "Ice Sample",
    "Med Kit",
    "Minerals",
    "Alien Artifact"
];

function addItem(item) {
    inventory.push(item);
    addLog("Отримано предмет: " + item);
    updateInventoryUI();
}

function randomLoot() {
    const item = lootItems[Math.floor(Math.random() * lootItems.length)];
    addItem(item);
}

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
          { text: "Обшукати", action: () => { power += 30; morale += 10; } },
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
    if (Math.random() < 0.35) {
        randomLoot();
    }
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

        randomEvent(); // <-- НОВА ПОДІЯ
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
                showEnding();
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
    stopMenuMusic();
    switchScreen(menuScreen, gameContent);
    startGameMusic();
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
    stopMenuMusic();
    switchScreen(menuScreen, upgradeScreen);
});

backBtn.addEventListener("click", () => {
    switchScreen(upgradeScreen, menuScreen);
    menuMusic.play();
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
    stopMenuMusic();
    updateStatusScreen();
    switchScreen(menuScreen, statusScreen);
});

statusBackBtn.addEventListener("click", () => {
    switchScreen(statusScreen, menuScreen);
    menuMusic.play();
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
    gameContent.classList.remove(
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

    gameContent.classList.add("effect-" + type);

    if (type === "sandstorm") activateSandstorm();

    setTimeout(() => {
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

function setDifficulty(mode, button) {
    document.querySelectorAll(".difficulty").forEach(btn => {
        btn.classList.remove("active-mode");
    });

    button.classList.add("active-mode");

    oxygen = 80;
    power = 80;
    food = 80;
    morale = 80;
    credits = 100;

    if (mode === "easy") {
        oxygen = 100;
        power = 100;
        food = 100;
        morale = 100;
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
    addLog("Режим: " + mode.toUpperCase());
}

function showEnding() {

    clearInterval(timerInterval);

    choice1.style.display = "none";
    choice2.style.display = "none";
    choice3.style.display = "none";

    document.getElementById("restart-btn").style.display = "inline-block";

    const score =
        oxygen +
        power +
        food +
        morale +
        credits;

    let endingTitle = "";
    let endingText = "";

    // ===== СЕКРЕТНА КІНЦІВКА =====
    if (
        oxygen >= 90 &&
        power >= 90 &&
        food >= 90 &&
        morale >= 90 &&
        credits >= 150
    ) {

        endingTitle = "🌟 ІДЕАЛЬНИЙ ФІНАЛ";
        endingText =
            "BASE OMEGA стала першою повністю стабільною колонією Марса. Земля запускає нову хвилю колонізації.";

        addLog("Отримано секретний фінал");

    }

    // ===== ЛЕГЕНДАРНА =====
    else if (score >= 420) {

        endingTitle = "🏆 ЛЕГЕНДАРНИЙ ФІНАЛ";
        endingText =
            "Колонія пережила бурю майже без втрат. Екіпаж увійшов в історію Марса.";

    }

    // ===== ДУЖЕ ХОРОША =====
    else if (score >= 340) {

        endingTitle = "✅ УСПІШНИЙ ФІНАЛ";
        endingText =
            "BASE OMEGA вистояла. Системи стабільні, екіпаж готовий до нових місій.";

    }

    // ===== НОРМАЛЬНА =====
    else if (score >= 260) {

        endingTitle = "🟡 СТАБІЛЬНИЙ ФІНАЛ";
        endingText =
            "Колонія вижила, але ресурси сильно виснажені.";

    }

    // ===== ВАЖКИЙ =====
    else if (score >= 180) {

        endingTitle = "⚠️ ВАЖКИЙ ФІНАЛ";
        endingText =
            "Бурю пережито ціною серйозних втрат. Частина бази непридатна.";

    }

    // ===== ПОГАНИЙ =====
    else if (score >= 100) {

        endingTitle = "☠️ КРИТИЧНИЙ ФІНАЛ";
        endingText =
            "Колонія майже зруйнована. Екіпаж чекає евакуації із Землі.";

    }

    // ===== ЖАХЛИВИЙ =====
    else if (score > 0) {

        endingTitle = "💀 ФІНАЛ КАТАСТРОФИ";
        endingText =
            "BASE OMEGA перестала функціонувати. Вижили лише одиниці.";

    }

    // ===== ПОВНИЙ ПРОВАЛ =====
    else {

        endingTitle = "🚨 ПОВНЕ ЗНИЩЕННЯ";
        endingText =
            "Усі системи бази відмовили. Місія Марса провалена.";

    }

    eventText.innerHTML = `
        <h2 style="color:#ff7a3d; margin-bottom:15px;">
            ${endingTitle}
        </h2>

        <p style="font-size:18px; line-height:1.7;">
            ${endingText}
        </p>

        <br>

        <p>
            🫁 Кисень: ${oxygen}%<br>
            ⚡ Енергія: ${power}%<br>
            🍖 Їжа: ${food}%<br>
            🙂 Мораль: ${morale}%<br>
            💳 Кредити: ${credits}<br>
            ⭐ Score: ${score}
        </p>
    `;

    addLog("Фінал гри: " + endingTitle);
}

function updateCrewUI() {
    const crewBox = document.getElementById("crew-list");
    crewBox.innerHTML = "";

    crew.forEach((member, index) => {
        crewBox.innerHTML += `
            <div class="crew-card">
                <h3>${member.name}</h3>
                <p>${member.role}</p>
                <p>❤️ Здоров'я: ${member.health}</p>
                <p>😵 Стрес: ${member.stress}</p>

                <button onclick="sendMission(${index})">
                    🚀 Відправити на місію
                </button>

                <button onclick="restCrew(${index})">
                    🛌 Відпочинок
                </button>

                <button onclick="healCrew(${index})">
                    💉 Лікувати
                </button>
            </div>
        `;
    });
}

function updateInventoryUI() {
    const inv = document.getElementById("inventory-list");
    inv.innerHTML = "";

    inventory.forEach(item => {
        inv.innerHTML += `<li>${item}</li>`;
    });
}

function useItem(item) {
    const index = inventory.indexOf(item);

    if (index === -1) return;

    if (item === "Food Pack") food += 15;
    if (item === "Repair Kit") power += 15;
    if (item === "Oxygen Tank") oxygen += 20;
    if (item === "Battery Cell") power += 10;
    if (item === "Med Kit") morale += 10;
    if (item === "Ice Sample") morale += 5;
    if (item === "Minerals") credits += 10;
    if (item === "Alien Artifact") morale += 20;

    oxygen = Math.min(100, oxygen);
    power = Math.min(100, power);
    food = Math.min(100, food);
    morale = Math.min(100, morale);

    inventory.splice(index, 1);

    updateUI();
    updateInventoryUI();
    addLog("Використано: " + item);
}

function saveGame() {
    const saveData = {
        oxygen,
        power,
        food,
        morale,
        inventory,
        crew,
        sol,
        totalSeconds,
        credits,
        timer: timerEl.textContent
    };

    localStorage.setItem("marsSave", JSON.stringify(saveData));
    addLog("Гру збережено");
}

function loadGame() {
    const data = JSON.parse(localStorage.getItem("marsSave"));
    if (!data) return;

    oxygen = data.oxygen;
    power = data.power;
    food = data.food;
    morale = data.morale;
    inventory = data.inventory;
    crew = data.crew;
    sol = data.sol;
    totalSeconds = data.totalSeconds;
    credits = data.credits;

    timerEl.textContent = data.timer;

    updateUI();
    updateInventoryUI();
    updateCrewUI();

    addLog("Гру завантажено");
}

function sendMission(memberIndex) {
    let member = crew[memberIndex];

    if (member.health <= 20) {
        addLog(member.name + " занадто слабкий для місії");
        return;
    }

    member.stress += 10;
    member.health -= 5;

    if (Math.random() < 0.6) {
        const foundItem = lootItems[Math.floor(Math.random() * lootItems.length)];
        inventory.push(foundItem);
        credits += 5;

        addLog(member.name + " знайшов " + foundItem);
    } else {
        member.health -= 15;
        addLog(member.name + " отримав травму");
    }

    member.health = Math.max(0, member.health);

    updateCrewUI();
    updateInventoryUI();
    updateUI();
}

updateUI();
updateCrewUI();
updateInventoryUI();

function updateInventoryUI() {
    const inv = document.getElementById("inventory-list");
    inv.innerHTML = "";

    inventory.forEach(item => {
        inv.innerHTML += `
            <li onclick="useItem('${item}')" style="cursor:pointer; margin:8px 0;">
                ${item}
            </li>
        `;
    });
}

function restCrew(memberIndex) {
    let member = crew[memberIndex];

    if (power < 5) {
        addLog("Недостатньо енергії для відпочинку");
        return;
    }

    member.stress = Math.max(0, member.stress - 15);
    morale += 5;
    power -= 5;

    addLog(member.name + " відпочив");

    updateCrewUI();
    updateUI();
}

function healCrew(memberIndex) {
    let member = crew[memberIndex];

    if (member.health >= 100) {
        addLog(member.name + " вже повністю здоровий");
        return;
    }

    const medIndex = inventory.indexOf("Med Kit");

    if (medIndex === -1) {
        addLog("Немає Med Kit");
        return;
    }

    member.health = Math.min(100, member.health + 25);
    inventory.splice(medIndex, 1);

    addLog(member.name + " вилікуваний на +25 HP");

    updateCrewUI();
    updateInventoryUI();
}

function buyItem(item, price) {
    if (credits < price) {
        addLog("Недостатньо кредитів");
        return;
    }

    credits -= price;
    inventory.push(item);

    addLog("Куплено: " + item);

    updateInventoryUI();
    updateUI();
}

const menuMusic = document.getElementById("menu-music");

document.addEventListener("click", startMusicOnce, { once: true });

function startMusicOnce() {
    menuMusic.volume = 0.5;

    menuMusic.play().catch(error => {
        console.log("Музика не запустилась:", error);
    });
}

function stopMenuMusic() {
    let fade = setInterval(() => {
        if (menuMusic.volume > 0.05) {
            menuMusic.volume -= 0.05;
        } else {
            clearInterval(fade);
            menuMusic.pause();
            menuMusic.currentTime = 0;
            menuMusic.volume = 0.5;
        }
    }, 100);
}

const gameMusic = document.getElementById("game-music");

function startGameMusic() {
    gameMusic.volume = 0.35;
    gameMusic.play().catch(() => {});
}

function stopGameMusic() {
    gameMusic.pause();
    gameMusic.currentTime = 0;
}

// ==========================
// Чіти чісто для мене
// ==========================

const cheatMenu = document.getElementById("cheat-menu");

let cheatCode = [];
const secretCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight"
];

document.addEventListener("keydown", (e) => {

    cheatCode.push(e.key);

    if (cheatCode.length > secretCode.length) {
        cheatCode.shift();
    }

    if (
        JSON.stringify(cheatCode) ===
        JSON.stringify(secretCode)
    ) {

        cheatMenu.classList.toggle("active");

        addLog("CHEAT TERMINAL ACTIVATED");

        cheatCode = [];
    }

    // ESC закриває меню
    if (e.key === "Escape") {
        cheatMenu.classList.remove("active");
    }

});

// + ресурси
function addResources() {

    oxygen = Math.min(100, oxygen + 25);
    power = Math.min(100, power + 25);
    food = Math.min(100, food + 25);
    morale = Math.min(100, morale + 25);

    updateUI();

    addLog("CHEAT: ресурси додано");
}

// + кредити
function addCredits() {

    credits += 100;

    updateUI();

    addLog("CHEAT: +100 кредитів");
}

// loot
function addRandomLoot() {

    for (let i = 0; i < 3; i++) {
        randomLoot();
    }

    updateInventoryUI();

    addLog("CHEAT: loot додано");
}

// перемотка часу
function skipTime() {

    totalSeconds -= 300;

    if (totalSeconds < 0) {
        totalSeconds = 0;
    }

    minutes = Math.floor(totalSeconds / 60);
    seconds = totalSeconds % 60;

    timerEl.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    addLog("CHEAT: час перемотано");
}

// лікування екіпажу
function healAllCrew() {

    crew.forEach(member => {
        member.health = 100;
        member.stress = 0;
    });

    updateCrewUI();

    addLog("CHEAT: екіпаж вилікувано");
}

// max stats
function maxStats() {

    oxygen = 100;
    power = 100;
    food = 100;
    morale = 100;
    credits = 999;

    updateUI();

    addLog("CHEAT: MAX STATS");
}