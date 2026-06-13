let cellData = [];
let answData = [];
let pivot;
let newNum =11;
let spanDif = document.querySelector(".difficulty");
let mistakeCounter = 0;
let gameOver = false;
let spanMistakes = document.querySelector(".lives");
let hintButton = document.querySelector(".hint");
let hintNumber = document.querySelector(".hint-num");
let hint = 3;
let button = document.querySelector('#buttons');
let pauseButton = document.querySelector('.pause');
let resumeButton = document.querySelector('.resume');
let grid= document.querySelector('.grid-window');
let hintbar = document.querySelector('.top-hintbar');
let isRunning = false;
let timerInterval = null;
let startTime = 0;
let elapsedTime = 0;
let currentNum = null;

async function getSudokuNum(){
  try {
    let response = await fetch("https://sudoku-api.vercel.app/api/dosuku");
    const data = await response.json();
    const grid = data.newboard.grids[0].value;
    const answ = data.newboard.grids[0].solution;
    const dif = data.newboard.grids[0].difficulty;
    setDifficulty(dif);
    setSudokuData(grid, answ);
    draw();
    checkNum();
  }catch (e){
    console.error(e);
  }
}
function checkLives(mis){
  let text = ` Mistakes: ${mis}/3`;
  spanMistakes.textContent = text;
  if(mistakeCounter===3) gameOver = true;
  gameEnd(gameOver);
}

function setDifficulty(dif){
  let inlineHTML = `Difficulty: ${dif}`;
  spanDif.insertAdjacentHTML("afterbegin", inlineHTML);
}

function gameEnd(gameOverStatus){
  if (gameOverStatus === true){
    alert("Game Over");
    window.location.reload();
    redraw();
  }
  return;
}

function setSudokuData(data, answ){
  for (let r = 0; r<9; r++){
    for(let c = 0; c<9; c++){
      let value = data[r][c];
      cellData.push({
        row: r,
        col: c,
        num: value === 0 ? " " :value,
        isOriginal: value !== 0
      });

      let res = answ[r][c];
      answData.push({
        row: r,
        col: c,
        num: res === 0 ? " " :res
      });
    }
  }
  console.log(answData);
}

function draw() {
  pivot = new WebDataRocks({
    container: "#pivot-container",
    width: 650,
    height: 650,
    toolbar: false,
    customizeCell: customizeCellFunction,
    report: {
      dataSource: {data: cellData},
      slice: {
        rows: [{uniqueName: "row"}],
        columns: [{uniqueName: "col"}],
        measures: [{uniqueName: "num", aggregation: "max"}]
      },
      options: {
        grid: {
          showHeaders: false,
          showTotals: "off",
          showGrandTotals: "off",
          showHierarchyCaptions: false,
          showFilter: false
        },
        configuratorButton: false,
        showAggregations: false,
        drillThrough: false,
        showDrillThroughConfigurator: false,
        sorting: false
      },
      tableSizes: {
        columns: [
          {idx: 1, width: 50},
          {idx: 2, width: 50},
          {idx: 3, width: 50},
          {idx: 4, width: 50},
          {idx: 5, width: 50},
          {idx: 6, width: 50},
          {idx: 7, width: 50},
          {idx: 8, width: 50},
          {idx: 9, width: 50}],

        rows: [
          {idx: 1, height: 50},
          {idx: 2, height: 50},
          {idx: 3, height: 50},
          {idx: 4, height: 50},
          {idx: 5, height: 50},
          {idx: 6, height: 50},
          {idx: 7, height: 50},
          {idx: 8, height: 50},
          {idx: 9, height: 50}]
      }

    }
  });

clickHandler();
}
function redraw(){
  pivot.setReport({
    dataSource: {data: cellData},
    slice: {
      rows: [{uniqueName: "row"}],
      columns: [{uniqueName: "col"}],
      measures: [{uniqueName: "num", aggregation: "max"}]
    },
    options: {
      grid: {
        showHeaders: false,
        showTotals: "off",
        showGrandTotals: "off",
        showHierarchyCaptions: false,
        showFilter: false
      },
      configuratorButton: false,
      showAggregations: false,
      drillThrough: false,
      showDrillThroughConfigurator: false,
      sorting: false
    },
    tableSizes: {
      columns: [
        {idx: 1, width: 50},
        {idx: 2, width: 50},
        {idx: 3, width: 50},
        {idx: 4, width: 50},
        {idx: 5, width: 50},
        {idx: 6, width: 50},
        {idx: 7, width: 50},
        {idx: 8, width: 50},
        {idx: 9, width: 50}],

      rows: [
        {idx: 1, height: 50},
        {idx: 2, height: 50},
        {idx: 3, height: 50},
        {idx: 4, height: 50},
        {idx: 5, height: 50},
        {idx: 6, height: 50},
        {idx: 7, height: 50},
        {idx: 8, height: 50},
        {idx: 9, height: 50}]
    }
  });
}

document.body.addEventListener('click', (e) => {
  const currentB = e.target.closest("button");
  if(!currentB)return;
  if(currentB.classList.contains("var")){
    newNum = currentB.dataset.id;
  }
  if(currentB.classList.contains("hint")){
    newNum=10;
  }
  if(currentB.classList.contains("pause")){
    pauseTimer();
    button.classList.add("hide");
    grid.classList.add("hide");
    hintbar.classList.add("hide");
  }
  if(currentB.classList.contains("resume")){
    timer();
    button.classList.remove("hide");
    grid.classList.remove("hide");
    hintbar.classList.remove("hide");
  }

});

function clickHandler(){
  pivot.on('cellclick', function(cell) {
    if(cell.type === "value" ) {
      let c = parseInt(cell.columns[0].caption);
      let r = parseInt(cell.rows[0].caption);
      let findCell = cellData.find(elem => elem.row === r && elem.col === c);
      let findAnsw = answData.find(elem => elem.row === r && elem.col === c);

      if(findCell.num !== " ") currentNum = findCell.num;
      else currentNum = null;
      redraw();

      if (newNum !== 11) {
        if(newNum === 10 ) {
          if(hint>0){
            if(findCell.isOriginal === false && findCell.num === " ") {
              findCell.num = findAnsw.num;
              checkNum();
              hint--;
              let hText = `${hint}`;
              hintNumber.innerHTML = hText;
              redraw();
            }
          }
          if(hint===0){
            hintButton.classList.add("disabled");
            hintNumber.style.display = "none";
            newNum = 11;
            redraw();
          }
          return;
        }

        if(findCell.isOriginal) return;
        if(findCell.isOriginal === false && parseInt(newNum)=== findAnsw.num && findCell.num === " ") {
          findCell.num = parseInt(newNum);
          checkNum();
          redraw();
        }else {
          mistakeCounter++;
          checkLives(mistakeCounter);
          redraw();

        }
      } else alert("choose number you want to put");

    }
  });
}

function checkNum() {
  for (let i = 1; i <= 9; i++) {
    let amount = cellData.filter(elem => elem.num === i).length;
    let btn = document.querySelector(`.var[data-id="${i}"]`);
    if(amount === 9){
      btn.classList.add("disabled");
      if (parseInt(newNum) === i) newNum = 11;

    } else {
      btn.classList.remove("disabled");
    }
  }
  let empty = cellData.filter(el => el.num === " ");
  if(empty.length === 0){
    alert("Sudoku is completed!");
    window.location.reload();
    redraw();
  }
}

function customizeCellFunction(cellStyle, cell) {
  if (cell.type == "value"&& cell.rows && cell.rows.length > 0 && cell.columns && cell.columns.length > 0) {
     cellStyle.addClass("customizeCell");

    let c = parseInt(cell.columns[0].caption);
    let r = parseInt(cell.rows[0].caption);
    let findCell = cellData.find(elem => elem.row === r && elem.col === c);
     if(findCell.isOriginal===false && findCell && findCell.num !==" ")cellStyle.addClass("user-num");
     if(currentNum !== null && findCell.num === currentNum) cellStyle.addClass("chosen");
  }
}

function timer() {
  if (!isRunning) {
    isRunning = true;
    startTime = Date.now()- elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;

    const totalSeconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    document.querySelector(".timer").innerText = formattedTime;
  }, 1000);
  if (gameOver === true) clearInterval(timerInterval);
}
}
function pauseTimer(){
  if(isRunning){
    isRunning = false;
    clearInterval(timerInterval);
  }
}
getSudokuNum();
timer();

