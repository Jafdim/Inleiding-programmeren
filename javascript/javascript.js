// Beginwaarden voor de statistieken van de kat
let hunger = 80         // Honger (0 = hongerig, 100 = vol)
let cleanliness = 90    // Netheid (0 = vies, 100 = schoon)
let happiness = 70      // Blijheid (0 = verdrietig, 100 = blij)
let energy = 100        // Energie (0 = moe, 100 = uitgerust)
let catState = "normal" // De huidige toestand van de kat
let gameScore = 0       // Punten tijdens het spel
let gameTimeLeft = 15   // Tijd over in het spel
let gameInterval = null // Interval voor het aftellen van spel
let targetMoveInterval = null // Interval voor het verplaatsen van doelwit
let statsInterval = null      // Interval voor het verminderen van stats

// Verwijzingen naar elementen in de HTML
const messageEl = document.getElementById("message")
const catDisplayContainer = document.getElementById("cat-display-container")
const catDisplay = document.getElementById("cat-display")
const catEffects = document.getElementById("cat-effects")
const gameContainer = document.getElementById("game-container")
const gameScoreEl = document.getElementById("game-score")
const gameTimeEl = document.getElementById("game-time")
const gameArea = document.getElementById("game-area")
const gameTarget = document.getElementById("game-target")

// Elementen voor het tonen van de statistieken en hun balken
const hungerValueEl = document.getElementById("hunger-value")
const hungerBarEl = document.getElementById("hunger-bar")
const cleanlinessValueEl = document.getElementById("cleanliness-value")
const cleanlinessBarEl = document.getElementById("cleanliness-bar")
const happinessValueEl = document.getElementById("happiness-value")
const happinessBarEl = document.getElementById("happiness-bar")
const energyValueEl = document.getElementById("energy-value")
const energyBarEl = document.getElementById("energy-bar")

// Knoppen voor acties met de kat
const feedBtn = document.getElementById("feed-btn")
const playBtn = document.getElementById("play-btn")
const washBtn = document.getElementById("wash-btn")
const sleepBtn = document.getElementById("sleep-btn")
const endGameBtn = document.getElementById("end-game-btn")

// Initialisatie van het spel
function init() {
  // Start automatisch het aftellen van statistieken
  statsInterval = setInterval(decreaseStats, 5000)

  updateStats()
  updateMessage()

  // Voeg eventlisteners toe aan knoppen
  feedBtn.addEventListener("click", feedCat)
  playBtn.addEventListener("click", playCat)
  washBtn.addEventListener("click", washCat)
  sleepBtn.addEventListener("click", sleepCat)
  endGameBtn.addEventListener("click", endGameEarly)
  gameTarget.addEventListener("click", handleTargetClick)

  positionGameTarget()
}

// Bijwerken van de statistieken en balken
function updateStats() {
  hungerValueEl.textContent = `${Math.round(hunger)}%`
  hungerBarEl.style.width = `${hunger}%`

  cleanlinessValueEl.textContent = `${Math.round(cleanliness)}%`
  cleanlinessBarEl.style.width = `${cleanliness}%`

  happinessValueEl.textContent = `${Math.round(happiness)}%`
  happinessBarEl.style.width = `${happiness}%`

  energyValueEl.textContent = `${Math.round(energy)}%`
  energyBarEl.style.width = `${energy}%`

  // Schakel knoppen uit als actie niet mogelijk is
  feedBtn.disabled = catState !== "normal" || hunger >= 100
  playBtn.disabled = catState !== "normal"
  washBtn.disabled = catState !== "normal" || cleanliness >= 100
  sleepBtn.disabled = catState !== "normal" || energy >= 100
}

// Verlaagt de statistieken geleidelijk
function decreaseStats() {
  hunger = Math.max(hunger - 0.5, 0)
  cleanliness = Math.max(cleanliness - 0.3, 0)
  happiness = Math.max(happiness - 0.4, 0)
  energy = Math.max(energy - 0.2, 0)

  updateStats()
  updateMessage()
}

// Bepaal welk bericht wordt weergegeven
function updateMessage() {
  if (hunger < 20) {
    messageEl.textContent = "Your cat is hungry! Please feed it."
  } else if (cleanliness < 20) {
    messageEl.textContent = "Your cat needs a bath!"
  } else if (happiness < 20) {
    messageEl.textContent = "Your cat is bored. Play with it!"
  } else if (energy < 20) {
    messageEl.textContent = "Your cat is tired. Let it sleep!"
  } else if (hunger > 80 && cleanliness > 80 && happiness > 80 && energy > 80) {
    messageEl.textContent = "Your cat is very happy and healthy!"
  } else {
    messageEl.textContent = "Your cat is doing okay."
  }
}

// Verander de toestand van de kat (eten, slapen, etc.)
function setCatState(state) {
  catState = state

  catDisplay.classList.remove("cat-eating", "cat-washing", "cat-sleeping", "cat-playing")
  catEffects.innerHTML = ""

  if (state !== "normal") {
    catDisplay.classList.add(`cat-${state}`)

    // Toon visuele effecten afhankelijk van de actie
    if (state === "eating") {
      const foodBowl = document.createElement("div")
      foodBowl.className = "food-bowl"
      catEffects.appendChild(foodBowl)
    } else if (state === "washing") {
      const waterEffect1 = document.createElement("div")
      waterEffect1.className = "water-effect water-effect-1"
      const waterEffect2 = document.createElement("div")
      waterEffect2.className = "water-effect water-effect-2"
      catEffects.appendChild(waterEffect1)
      catEffects.appendChild(waterEffect2)
    } else if (state === "sleeping") {
      const sleepEffect = document.createElement("div")
      sleepEffect.className = "sleep-effect"
      sleepEffect.textContent = "💤"
      catEffects.appendChild(sleepEffect)
    } else if (state === "playing") {
      const playEffect = document.createElement("div")
      playEffect.className = "play-effect"
      playEffect.textContent = "🎮"
      catEffects.appendChild(playEffect)
    }
  }

  updateStats()
}

// Voer de kat
function feedCat() {
  if (catState !== "normal" || hunger >= 100) return

  setCatState("eating")
  messageEl.textContent = "Yum! Your cat is eating..."

  setTimeout(() => {
    hunger = Math.min(hunger + 30, 100)
    happiness = Math.min(happiness + 10, 100)
    cleanliness = Math.max(cleanliness - 5, 0)

    setCatState("normal")
    messageEl.textContent = "Your cat enjoyed the meal!"
    updateStats()
  }, 2000)
}

// Was de kat
function washCat() {
  if (catState !== "normal" || cleanliness >= 100) return

  setCatState("washing")
  messageEl.textContent = "Splash! Your cat is getting clean..."

  setTimeout(() => {
    cleanliness = Math.min(cleanliness + 40, 100)
    happiness = Math.max(happiness - 10, 0)
    energy = Math.max(energy - 10, 0)

    setCatState("normal")
    messageEl.textContent = "Your cat is now clean!"
    updateStats()
  }, 2000)
}

// Laat de kat slapen
function sleepCat() {
  if (catState !== "normal" || energy >= 100) return

  setCatState("sleeping")
  messageEl.textContent = "Zzz... Your cat is sleeping..."

  setTimeout(() => {
    energy = Math.min(energy + 50, 100)
    hunger = Math.max(hunger - 10, 0)
    happiness = Math.min(happiness + 5, 100)

    setCatState("normal")
    messageEl.textContent = "Your cat woke up feeling refreshed!"
    updateStats()
  }, 3000)
}

// Laat de kat spelen en start het spel
function playCat() {
  if (catState !== "normal") return

  gameContainer.classList.remove("hidden")
  catDisplayContainer.classList.add("hidden")

  gameScore = 0
  gameTimeLeft = 15
  gameScoreEl.textContent = gameScore
  gameTimeEl.textContent = gameTimeLeft

  setCatState("playing")
  messageEl.textContent = "Your cat is playing!"

  // Aftellen van speeltijd
  gameInterval = setInterval(() => {
    gameTimeLeft--
    gameTimeEl.textContent = gameTimeLeft

    if (gameTimeLeft <= 0) {
      endGame()
    }
  }, 1000)

  // Beweeg het doelwit
  targetMoveInterval = setInterval(positionGameTarget, 2000)
}

// Plaats het doelwit op een willekeurige locatie in het spelgebied
function positionGameTarget() {
  const maxX = gameArea.clientWidth - gameTarget.clientWidth
  const maxY = gameArea.clientHeight - gameTarget.clientHeight

  const x = Math.floor(Math.random() * maxX)
  const y = Math.floor(Math.random() * maxY)

  gameTarget.style.left = `${x}px`
  gameTarget.style.top = `${y}px`
}

// Verhoog score wanneer het doelwit wordt geklikt
function handleTargetClick() {
  gameScore++
  gameScoreEl.textContent = gameScore
  positionGameTarget()
}

// Beëindig het spel voortijdig
function endGameEarly() {
  endGame()
}

// Beëindig het spel en pas statistieken aan
function endGame() {
  clearInterval(gameInterval)
  clearInterval(targetMoveInterval)

  gameContainer.classList.add("hidden")
  catDisplayContainer.classList.remove("hidden")

  const happinessIncrease = gameScore * 5

  happiness = Math.min(happiness + happinessIncrease, 100)
  energy = Math.max(energy - 20, 0)
  hunger = Math.max(hunger - 10, 0)

  setCatState("normal")
  messageEl.textContent = `Game over! Your cat had fun and gained ${happinessIncrease} happiness!`
  updateStats()
}

// Start het spel automatisch bij laden van de pagina
window.addEventListener("load", init)
