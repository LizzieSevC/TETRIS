let canvas = document.getElementById("game-canvas") 
let scoreboard = document.getElementById("scoreboard") 
let ctx = canvas.getContext("2d") 
ctx.scale(BLOCKSIZE, BLOCKSIZE) 
let model = new GameModel(ctx)

let score = 0 


//"Main game loop", setInterval makes a function repeat with a determined time of waiting in between
setInterval(() => {
    newGameState()
}, SPEED); 


let newGameState = () => {
    fullSend() 
    if (model.fallingPiece === null) {
        const rand = Math.round(Math.random() * 6) + 1
        const newPiece = new Piece(SHAPES[rand], ctx) 
        model.fallingPiece = newPiece 
        model.moveDown()
    } else {
        model.moveDown()
    }
}

const fullSend = () => {
    const allFilled = (row) => {
        for (let x of row) {
            if (x === 0) {
                return false
            }
        }
        return true
    }

    for (let r = 0; r < model.board.length; r++) {
        if (allFilled(model.board[r])) {
            score += POINTS
            model.board.splice(r, 1) 
            model.board.unshift([0,0,0,0,0,0,0,0,0,0])
        }
    }

    scoreboard.innerHTML = "Your score: " + String(score)
}


//keydown makes posible for the code to recognize and use user input with they keyboard
document.addEventListener("keydown", (k) => {
    k.preventDefault() 
    switch(k.key) {
        case "w":
            model.rotate() 
            break 
        case "d":
            model.move(true) 
            break 
        case "s": 
            model.moveDown() 
            break 
        case "a":
            model.move(false) 
            break
        //added arrows too so the user can choose wich set of keys they want to use to play
        case "ArrowUp":
            model.rotate() 
            break 
        case "ArrowRight":
            model.move(true) 
            break 
        case "ArrowDown": 
            model.moveDown() 
            break 
        case "ArrowLeft":
            model.move(false) 
            break
    }
})