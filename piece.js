class Piece {
    constructor(shape, ctx) {
        this.shape = shape 
        this.ctx = ctx 
        this.y = 0 
        this.x = Math.floor(COLS / 2)
    }

    renderPiece() {
        this.shape.map((row, r) => {
            row.map((cell, c) => {
                if (cell > 0) {
                    this.ctx.fillStyle = COLORS[cell] 
                    this.ctx.fillRect(this.x + c, this.y + r, 1, 1)
                }
            })
        })
    }
}

