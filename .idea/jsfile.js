let cellData = [];
var pivot;
async function getSudokuNum(){
  try {
    let response = await fetch("https://sudoku-api.vercel.app/api/dosuku");
    const data = await response.json();
    console.log(data);
    const grid = data.newboard.grids[0].value;
    setSudokuData(grid);
    draw();
  }catch (e){
    console.error(e);
  }
}

function setSudokuData(data){
  for (let r = 0; r<9; r++){
    for(let c = 0; c<9; c++){
      let value = data[r][c];
      cellData.push({
        row: r,
        col: c,
        num: value === 0 ? " " :value
      });
    }
  }
  console.log(cellData);
}

function draw() {
  pivot = new WebDataRocks({
    container: "#pivot-container",
    width: 552,
    height: 500,
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


getSudokuNum();


let newNum;
let button = document.querySelector('#buttons');

function getNewNum(){
  button.addEventListener('click', (e) => {
    const currentB = e.target.closest("button");

    if(currentB.classList.contains("var")){
      newNum = currentB.dataset.id;
    }
    if(currentB.classList.contains("eraser")){
      newNum =0;
    }
    if(currentB.classList.contains("hint")){
      newNum=10;
    }
    console.log(newNum);
  });
}
getNewNum();
// pivot.on('cellclick', function(cell) {
//   if(cell.type === "value"){
//
//   }
// });

function customizeCellFunction(){

}
