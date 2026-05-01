const startBtn = document.getElementById("start-btn");
const eventText = document.getElementById("event-text");
const logList = document.getElementById("log-list");

const choice1 = document.getElementById("choice1");
const choice2 = document.getElementById("choice2");

const oxygenEl = document.getElementById("oxygen");
const energyEl = document.getElementById("energy");
const moraleEl = document.getElementById("morale");

let oxygen = 100;
let energy = 100;
let morale = 100;

const events = [
    {
        text: "Warning! Dust storm approaching.",
        options: [
            {
                text: "Activate shields",
                effect: () => {
                    energy -= 15;
                    addLog("Shields activated");
                }
            },
            {
                text: "Ignore storm",
                effect: () => {
                    oxygen -= 20;
                    morale -= 10;
                    addLog("Storm damaged outer systems");
                }
            }
        ]
    },
    {
        text: "Oxygen leak detected in habitat.",
        options: [
            {
                text: "Repair leak",
                effect: () => {
                    energy -= 10;
                    addLog("Leak repaired");
                }
            },
            {
                text: "Seal sector",
                effect: () => {
                    morale -= 15;
                    oxygen -= 5;
                    addLog("Sector sealed");
                }
            }
        ]
    },
    {
        text: "Crew member panic attack.",
        options: [
            {
                text: "Send medic",
                effect: () => {
                    energy -= 5;
                    morale += 10;
                    addLog("Medic helped crew");
                }
            },
            {
                text: "Ignore",
                effect: () => {
                    morale -= 20;
                    addLog("Crew morale decreased");
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

function updateStats() {
    oxygenEl.textContent = oxygen;
    energyEl.textContent = energy;
    moraleEl.textContent = morale;
}

function nextEvent() {
    const randomEvent = events[Math.floor(Math.random() * events.length)];

    eventText.textContent = randomEvent.text;

    choice1.textContent = randomEvent.options[0].text;
    choice2.textContent = randomEvent.options[1].text;

    choice1.onclick = () => {
        randomEvent.options[0].effect();
        updateStats();
        checkGameStatus();
        nextEvent();
    };

    choice2.onclick = () => {
        randomEvent.options[1].effect();
        updateStats();
        checkGameStatus();
        nextEvent();
    };
}

function checkGameStatus() {
    if (oxygen <= 0 || energy <= 0 || morale <= 0) {
        eventText.textContent = "Mission Failed";
        choice1.style.display = "none";
        choice2.style.display = "none";
        startBtn.style.display = "none";
        addLog("Base systems collapsed");
    }
}

startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    addLog("Mission started");
    nextEvent();
});