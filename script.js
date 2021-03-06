import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 10;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
document.getElementById("answer").style.visibility = "hidden";

//console.log(rightGuessString)

function initBoard() {
    let board = document.getElementById("game-board");
    let header = document.getElementById("header");
    let headrow = document.createElement("div")
    headrow.className = "header-row"
    for (let j = 0; j < 5; j++) {
        let headbox = document.createElement("div")
        headbox.className = "header-box"
        headrow.appendChild(headbox)
    }
    for (let j = 5; j < 6; j++) {
        let headscorebox = document.createElement("div")
        headscorebox.className = "alpha-box2"
        headrow.appendChild(headscorebox)
    }
    for (let j = 6; j < 7; j++) {
        let headscorebox = document.createElement("div")
        headscorebox.className = "beta-box2"
        headrow.appendChild(headscorebox)
    }

    header.appendChild(headrow)
    document.getElementsByClassName("header-box")[0].style.visibility = 'hidden';
    document.getElementsByClassName("header-box")[1].style.visibility = 'hidden';
    document.getElementsByClassName("header-box")[2].style.visibility = 'hidden';
    document.getElementsByClassName("header-box")[3].style.visibility = 'hidden';
    document.getElementsByClassName("header-box")[4].style.visibility = 'hidden';
    document.getElementsByClassName("alpha-box2")[0].textContent = '\u03B1';
    document.getElementsByClassName("beta-box2")[0].textContent = '\u03B2';




    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "letter-row"
        
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "letter-box"
            row.appendChild(box)
        }

        for (let j = 5; j < 6; j++) {
            let scorebox = document.createElement("div")
            scorebox.className = "alpha-box"
            row.appendChild(scorebox)
        }
        for (let j = 6; j < 7; j++) {
            let scorebox = document.createElement("div")
            scorebox.className = "beta-box"
            row.appendChild(scorebox)
        }

        board.appendChild(row)
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}

function deleteLetter () {
    let row = document.getElementsByClassName("letter-row")[10 - guessesRemaining]
    let box = row.children[nextLetter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextLetter -= 1
}

function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[10 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5) {
        toastr.error("Not enough letters!")
        return
    }

    if (!WORDS.includes(guessString)) {
        toastr.error("Word not in list!")
        return
    }

    var alpha = 0;
    var beta = 0;
    for (let i = 0; i < 5; i++) {
        let letterColor = ''
        let box = row.children[i]
        let letter = currentGuess[i]
        //let alpha = 0;
        //let beta = 0;
        
        let letterPosition = rightGuess.indexOf(currentGuess[i])
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor = 'grey'
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position 
            if (currentGuess[i] === rightGuess[i]) {
                // shade green 
                letterColor = 'grey'
                alpha +=1;
            } else {
                // shade box yellow
                letterColor = 'grey'
                beta += 1;
            }
            
            rightGuess[letterPosition] = "#"

        }

        let delay = 250 * i
        setTimeout(()=> {
            //flip box
            animateCSS(box, 'flipInX')
            //shade box
            box.style.backgroundColor = letterColor
            //shadeKeyBoard(letter, letterColor)
        }, delay)
    }
    //document.getElementById('alpha-value').innerHTML =alpha;
    //document.getElementById('beta-value').innerHTML =beta;
    document.getElementsByClassName("alpha-box")[10 - guessesRemaining].textContent = alpha;
    document.getElementsByClassName("beta-box")[10 - guessesRemaining].textContent = beta;

    if (guessString === rightGuessString) {
        toastr.success("You guessed right! Game over!")
        guessesRemaining = 0
        document.getElementById("answer").style.visibility = "visible";
        document.getElementById("answer").textContent = rightGuessString;
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (guessesRemaining === 0) {
            toastr.error("You've run out of guesses! Game over!")
            toastr.info(`The right word was: "${rightGuessString}"`)
            document.getElementById("answer").style.visibility = "visible";
            document.getElementById("answer").textContent = rightGuessString;
        }
    }
}

function insertLetter (pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[10 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertLetter(pressedKey)
    }
})

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

initBoard();