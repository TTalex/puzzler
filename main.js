let rounds = [];
const setStandardTiles = (folderPath, cols, rows) => {
    let tiles = [];
    let i = 1;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            tiles.push({src: `${folderPath}/${i}.png`, correctPositionInGrid: {col: col, row: row}});
            i = i + 1;
        }   
    }
    return tiles;
};
rounds.push({
    cols: 3,
    rows: 3,
    spacing: 0,
    tiles: setStandardTiles("data/1", 3, 3),
    srcImageAspectRatio: 1
});
rounds.push({
    cols: 5,
    rows: 5,
    spacing: 0,
    tiles: setStandardTiles("data/2", 5, 5),
    srcImageAspectRatio: 1
});
rounds.push({
    cols: 3,
    rows: 2,
    spacing: 0,
    tiles: setStandardTiles("data/3", 3, 2),
    srcImageAspectRatio: 1.8
});
rounds.push({
    cols: 3,
    rows: 3,
    spacing: 0,
    tiles: setStandardTiles("data/4", 3, 3),
    srcImageAspectRatio: 1
});
rounds.push({
    cols: 7,
    rows: 1,
    spacing: 0,
    tiles: setStandardTiles("data/5", 7, 1),
    srcImageAspectRatio: 0.9
});
rounds.push({
    cols: 7,
    rows: 1,
    spacing: 0,
    tiles: setStandardTiles("data/6", 7, 1),
    srcImageAspectRatio: 0.9
});
rounds.push({
    cols: 7,
    rows: 2,
    spacing: 0,
    tiles: setStandardTiles("data/7", 7, 2),
    srcImageAspectRatio: 3.5
});
let customTileset = setStandardTiles("data/8", 4, 5);
customTileset.splice(16,3)
rounds.push({
    cols: 4,
    rows: 5,
    spacing: 0,
    tiles: customTileset,
    srcImageAspectRatio: 0.5
});
let index = 0;
setupTiles(rounds[index]);

document.getElementById("next").addEventListener("click", () => {
    index = (index + 1) % rounds.length;
    setupTiles(rounds[index]);
});
