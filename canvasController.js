let canvas = document.getElementById('maincanvas');
let ctx = canvas.getContext('2d');
let mouseIsCurrentlyPressed = false;
let mouseDownAt;
let canvasShape;
let tileSize;
let tiles = [];
let availableSpots = [];
let srcImageAspectRatio;

const setupTiles = (config) => {
    canvasShape = {cols: config.cols, rows: config.rows};
    availableSpots = [];
    tiles = [];
    srcImageAspectRatio = config.srcImageAspectRatio;
    updateCanvasSize();
    for (let i = 0; i < canvasShape.rows; i++) {
        for (let j = 0; j < canvasShape.cols; j++) {
            availableSpots.push({
                x: (canvas.width / canvasShape.cols) * j,
                y: (canvas.height / canvasShape.rows) * i
            });
        }
    }
    let hsl = (h, s, l) => `hsl(${h},${s}%,${l}%)`;
    for (let i = 0; i < config.tiles.length; i++) {
        let spot = availableSpots.splice(Math.floor(Math.random()*availableSpots.length), 1)[0];
        tiles.push(new Tile(spot.x, spot.y, tileSize, hsl(Math.floor(Math.random() * 360), 100, 50), config.tiles[i], config.spacing));
    }
};

let updateCanvasSize = () => {
    // Not working well on fast resizes
    let canvasAspectRatio = srcImageAspectRatio; // canvasShape.cols / canvasShape.rows;
    let windowAspectRatio = window.innerWidth / window.innerHeight;
    if (canvasAspectRatio > windowAspectRatio) {
        canvas.width = window.innerWidth - 80;
        canvas.height = Math.max(200, window.innerWidth / canvasAspectRatio - 80);
    } else {
        canvas.width = window.innerHeight * canvasAspectRatio - 80;
        canvas.height = window.innerHeight - 80;
    }
    tileSize = {
        width: canvas.width / canvasShape.cols,
        height: canvas.height / canvasShape.rows
    };
    tiles.forEach(e => {
        e.tileSize = tileSize;
        e.moveTo(e.x, e.y, true);
    });
};

let getMouseCoords = (canvas, event) => {
    const canvasCoords = canvas.getBoundingClientRect();
    const pageX = event.pageX != undefined ? event.pageX : event.changedTouches[0].pageX;
    const pageY = event.pageY != undefined ? event.pageY : event.changedTouches[0].pageY;
    return {
        x: Math.min(canvasCoords.right - 1, pageX - canvasCoords.left),
        y: Math.min(canvasCoords.bottom - 1, pageY - canvasCoords.top)
    };
};
let getOffsetCoords = (mouse, rect) => {
    return {
        x: mouse.x - rect.x,
        y: mouse.y - rect.y
    };
};
let cursorInRect = (mouseX, mouseY, rectX, rectY, rectW, rectH) => {
    let xLine = mouseX > rectX && mouseX < rectX + rectW;
    let yLine = mouseY > rectY && mouseY < rectY + rectH;

    return xLine && yLine;
};


window.addEventListener('resize', updateCanvasSize);

["touchmove", "mousemove"].forEach(eventName => {
    canvas.addEventListener(eventName, e => {
        e.preventDefault();
        let mouse = getMouseCoords(canvas, e);

        let arr = tiles.map(e => cursorInRect(mouse.x, mouse.y, e.x, e.y, e.tileSize.width, e.tileSize.height));
        !arr.every(e => e === false) ? canvas.classList.add('pointer') : canvas.classList.remove('pointer');

        tiles.forEach(e => {
            if (e.selected) {
                e.moveTo(mouse.x - e.offset.x, mouse.y - e.offset.y, false);
            }
            if (mouseIsCurrentlyPressed) {
                cursorInRect(mouse.x, mouse.y, e.x, e.y, e.tileSize.width, e.tileSize.height) ?
                    e.active != true ? e.activate() : false
                    : e.active = false;
            }
        });
    });
});

["touchstart", "mousedown"].forEach(eventName => {
    canvas.addEventListener(eventName, e => {
        if (mouseIsCurrentlyPressed) {
            // Shouldn't happen, skip
            return;
        }
        let mouse = getMouseCoords(canvas, e);
        mouseIsCurrentlyPressed = true;
        mouseDownAt = mouse;
        tiles.forEach(e => {
            if (cursorInRect(mouse.x, mouse.y, e.x, e.y, e.tileSize.width, e.tileSize.height)) {
                e.selected = true;
                e.offset = getOffsetCoords(mouse, e);
            } else {
                e.selected = false;
            }
        });
    });
});

["touchend", "mouseup"].forEach(eventName => {
    canvas.addEventListener(eventName, e => {
        if (!mouseIsCurrentlyPressed) {
            // Shouldn't happen, skip
            return;
        }
        let mouse = getMouseCoords(canvas, e);
        mouseIsCurrentlyPressed = false;
        tiles.forEach(e => {
            if (e.selected) {
                e.selected = false;
                e.moveTo(mouse.x, mouse.y, true);
            } else if (e.active) {
                e.moveTo(mouseDownAt.x, mouseDownAt.y, true);
            }
            e.active = false;
        });
    });
});

const checkVictory = () => {
    if (tiles.length && tiles.every(e => e.isCorrectlyPlaced())){
        return true;
    } else {
        return false;
    }
};
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (checkVictory()) {
        ctx.globalAlpha = 0.5;
        tiles.forEach(e => {
            e.draw(ctx);
        });
        ctx.globalAlpha = 1;
        ctx.fillText("🎉🎉🎉", canvas.width / 2, canvas.height / 2);
    } else {
        tiles.forEach(e => {
            e.draw(ctx);
        });
    }
    window.requestAnimationFrame(animate);
}
animate();