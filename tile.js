class Tile {
    constructor(x, y, tileSize, color, tileInfo, spacing=5) {
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.color = color;
        this.selected = false;
        this.active = false;
        this.offset = {x: 0, y: 0};
        this.spacing = spacing;
        this.image = new Image(100,100);
        this.image.src = tileInfo.src;
        this.image.onerror = (err) => {console.log(err);};
        this.currentPositionInGrid = {
            col: this.x/(canvas.width / canvasShape.cols),
            row: this.y/(canvas.height / canvasShape.rows)
        };
        this.correctPositionInGrid = tileInfo.correctPositionInGrid;
    }
    draw(context) {
        context.fillStyle = this.color;
        if (this.selected) {
            context.lineWidth = 2;
            context.globalAlpha = 0.5;
            //context.fillRect(this.x+this.spacing, this.y+this.spacing, this.tileSize.width-this.spacing*2, this.tileSize.height-this.spacing*2);
            context.drawImage(this.image, this.x+this.spacing, this.y+this.spacing, this.tileSize.width-this.spacing*2, this.tileSize.height-this.spacing*2);
            context.strokeRect(this.x+this.spacing, this.y+this.spacing, this.tileSize.width-this.spacing*2, this.tileSize.height-this.spacing*2);
            context.globalAlpha = 1;
        } else if (this.active && !this.selected) {
            context.globalAlpha = 0.8;
            //context.fillRect(this.x+this.spacing, this.y+this.spacing, this.tileSize.width-this.spacing*2, this.tileSize.height-this.spacing*2);
            context.drawImage(this.image, this.x+this.spacing, this.y+this.spacing, this.tileSize.width-this.spacing*2, this.tileSize.height-this.spacing*2);
            context.globalAlpha = 1;
            context.textAlign='center';
            context.textBaseline='middle';
            ctx.font = ((this.tileSize.width-this.spacing*2) /2) + 'px serif';
            context.fillText("♻️", this.x+this.spacing + (this.tileSize.width-this.spacing*2) /2, this.y+this.spacing + (this.tileSize.height-this.spacing*2)/2);
        } else {
            //context.fillRect(this.x+this.spacing, this.y+this.spacing, this.tileSize.width-this.spacing*2, this.tileSize.height-this.spacing*2);
            
            context.drawImage(this.image, this.x+this.spacing, this.y+this.spacing, this.tileSize.width-this.spacing*2, this.tileSize.height-this.spacing*2);
        }
    }
    select() {
        this.selected = !this.selected;
    }
    activate() {
        this.active = !this.active;
    }
    getSnapCoords(x, y){
        return {
            x: (canvas.width / canvasShape.cols) * Math.floor(x / (canvas.width / canvasShape.cols)),
            y: (canvas.height / canvasShape.rows) * Math.floor(y / (canvas.height / canvasShape.rows))
        };
    }
    moveTo(x, y, snap) {
        if (snap) {
            let snapCoords = this.getSnapCoords(x, y);
            this.x = snapCoords.x;
            this.y = snapCoords.y;
            this.currentPositionInGrid = {
                col: this.x/(canvas.width / canvasShape.cols),
                row: this.y/(canvas.height / canvasShape.rows)
            };
        } else {
            this.x = x;
            this.y = y;
        }
    }
    isCorrectlyPlaced() {
        return this.currentPositionInGrid.col === this.correctPositionInGrid.col && this.currentPositionInGrid.row === this.correctPositionInGrid.row;
    }
}
