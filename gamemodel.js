const SPEED = 1000; //this will determine the falling speed of the pieces, 
const BLOCKSIZE = 30; // this is the size of each block in the canvas
const ROWS = 20; // number of rows in the board
const COLS = 10; // number of columns in the board
const POINTS = 10; // Here we established the number of points the player will get every time they complete a line



//Create the tiles with their respective rotations
const SHAPES = [
  [], //Don't erase it, everything breaks!
    [
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ], 

    [
        [2,0,0],
        [2,2,2],
        [0,0,0]
    ],

    [
        [0,0,3],
        [3,3,3],
        [0,0,0]
    ],

    [
        [4,4],
        [4,4]
    ],

    [
        [0,5,5],
        [5,5,0],
        [0,0,0]
    ],

    [
        [0,6,0],
        [6,6,6],
        [0,0,0]
    ],

    [
        [7,7,0],
        [0,7,7],
        [0,0,0]
    ]

]

// set of colors for the figures
const COLORS = [
    '#000000',
    '#F2005D', //Red
    '#C2ADFF', //lilac
    '#17EDFF', //blue
    '#E80EE8', //fuchsia
    '#E66E18', //orange
    '#F0E614', //yellow
    '#0FF882' //green
]


class GameModel { // special functions, similar to function expressions and function declarations 
    constructor(ctx) { //allows us to create and initialize the object created with "class"
        this.ctx = ctx;
        this.fallingPiece = null; // piece
        this.board = this.createBoard()
    }


    createBoard() {
        let board = [] 
        //instead of creating the matrix writing each value within the array, one by one, we can create a for loop that automatically generates the board
        for (let r = 0; r < ROWS; r++) {
            board.push([])
            for (let c = 0; c < COLS; c++) {  
                board[board.length - 1].push(0) // [0,0,0,0,0,0,0,0]
            }
        }
        return board 
    }

    
    collision(x, y, candidate=null) {
        const shape = candidate || this.fallingPiece.shape //candidate to prevent error (exceptions)
        const n = shape.length //shaping the pieces? 
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (shape[r][c] > 0) {
                    let p = x + c; //??
                    let q = y + r;
                    if (p >= 0 && p < COLS && q < ROWS) {

                        if (this.board[q][p] > 0) {
                            return true;
                        }
                    } else {
                        return true;
                    }
                }
            }
        }
        return false
    }

    renderGameState() { //this function "reloads" the board including the color of the pieces***
        for (let r = 0; r < this.board.length; r++) {
            for (let c = 0; c < this.board[r].length; c++) {
                let cell = this.board[r][c] 
                this.ctx.fillStyle = COLORS[cell] 
                this.ctx.fillRect(c, r, 1, 1) //structure: fillRect(x,y,width,height) 
            }
        }

        if (this.fallingPiece !== null) { //this part checks if thers a piece in the board, if there's no piece, it will generate one with the next function
            this.fallingPiece.renderPiece()
        }
    }


    moveDown() {
        if (this.fallingPiece === null) { 
            this.renderGameState() 
            return
        } else if (this.collision(this.fallingPiece.x, this.fallingPiece.y + 1)) {
            const shape = this.fallingPiece.shape 
            const x = this.fallingPiece.x 
            const y = this.fallingPiece.y 
            shape.map((row, r) => {
                row.map((cell, c) => {
                    let p = x + c 
                    let q = y + r 
                    if (p >= 0 && p < COLS && q < ROWS && cell > 0) {
                        this.board[q][p] = shape[r][c]
                    }
                })
            })

            // this lines checks if a piece is "touching" the upper side of the board, and when it does, it restarts the game by calling the function createBoard()
            if (this.fallingPiece.y === 0) {
                alert("Game over! Try again");
                this.board = this.createBoard() //restarts the game by creating the new board again
            }
            this.fallingPiece = null
        } else {
            this.fallingPiece.y += 1 // allows for the ppiece to move down
        }
        this.renderGameState()
    }

    move(right) {
        if (this.fallingPiece === null) {
            return
        }
        
        let x = this.fallingPiece.x 
        let y = this.fallingPiece.y 
        if (right) {
            // if it moves to the right
            if (!this.collision(x + 1, y)) {
                this.fallingPiece.x += 1
            }
        } else {
            // if it moves to the left
            if (!this.collision(x - 1, y)) {
                this.fallingPiece.x -= 1
            }
        }
        this.renderGameState()
    }

    rotate() {
        if (this.fallingPiece !== null) {
            let shape = [...this.fallingPiece.shape.map((row) => [...row])]
            // transpose of matrix 
            for (let y = 0; y < shape.length; ++y) {
                for (let x = 0; x < y; ++x) {
                    [shape[x][y], shape[y][x]] = 
                    [shape[y][x], shape[x][y]]
                }
            }
            // reverse order of rows 
            shape.forEach((row => row.reverse()))
            if (!this.collision(this.fallingPiece.x, this.fallingPiece.y, shape)) {
                this.fallingPiece.shape = shape
            }
        }
        this.renderGameState()
    }
}