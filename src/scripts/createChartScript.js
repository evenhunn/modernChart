var element;
var decks = [];
var numberOfDecks;

function fillChart(sort) {
  findDecks(chartInfo);
  if (sort==="name") {
    decks.sort(function(a,b){
      if (a>b)return 1;
      if (a<b)return -1;
      return 0;
    })
  }
  var tableHTML = "<table class='chart' id='chart'><tr><td></td><td>" +
    "<button type='button' onclick='showAll()'>Show all</button>" +
    "</td>";
  for (var i in decks) {
    tableHTML +=
      "<td class='hide-button " +
      decks[i] + "x" +
      "'>" +
      "<button type='button' onclick='hideClass(\"" +
      decks[i]+ "x" +
      "\")'>Hide</button>" +
      "</td>";
  }
  tableHTML += "</tr>" +
    "<tr>" +
    "<td></td><td></td>";
  for (i in decks) {
    tableHTML += indexCellContent(decks[i], "x");
  }
  tableHTML += "</tr>";
  for (i in decks) {
    tableHTML +=
      "<tr><td class='hide-button " +
      decks[i] + "y" +
      "'>" +
      "<button type='button' onclick='hideClass(\"" +
      decks[i]+ "y" +
      "\")'>Hide</button>" +
      "</td>" +
      indexCellContent(decks[i], "y");
    for (var j in decks) {

      /*CONTENT IN EACH CELL*/

      var winRatio = findWinRatio(decks[i], decks[j]);
      tableHTML +=
        "<td class='inner-cell win" +
        winRatio + " " +
        decks[i] + "y " +
        decks[j] + "x " +
        "'><div class='cell-content'>" +
        winRatio +
        "\%" +
        "</div></td>"
    }
  }
  tableHTML += "</tr></table>";
  document.getElementById("modernChart").innerHTML = tableHTML
}

function hideClass(className) {
  var elementsToHide = document.getElementsByClassName(className);
  for (var i in elementsToHide) {
    elementsToHide[i].classList.add("hide-cell");
  }
}

function findDecks(chartInfo) {
  var chartInfoArray = Object.entries(chartInfo);
  var deckContents;
  for (var i = 0; i < chartInfoArray.length; i++) {
    addToDecks(chartInfoArray[i][0]);
  }
}

function addToDecks(deckName) {
  if (decks.indexOf(deckName) < 0) {
    decks.push(deckName);
  }
}

function indexCellContent(deckName, direction) {
  return "<td class='index-cell " +
    deckName + direction +
    "' " +
    "onclick='showInfo(\"" +
    deckName +
    "\")'>" +
    chartInfo[deckName]["deckName"] +
    "</td>"
}

function findWinRatio(deck1, deck2) {
  if (deck1 === deck2) {
    return 50;
  } else if (typeof chartInfo[deck1][deck2] === 'undefined') {
    if (typeof chartInfo[deck2][deck1] === 'undefined') {
      return "-"
    } else {
      return 100 - chartInfo[deck2][deck1];
    }
  } else if (chartInfo[deck1][deck2] === (100 - chartInfo[deck2][deck1]) || typeof chartInfo[deck2][deck1] === 'undefined') {
    return chartInfo[deck1][deck2];
  } else {
    console.log("crash in " + deck1 + ", " + deck2);
    return chartInfo[deck1][deck2];
  }
}

function showAll() {
  var innerCells = document.getElementsByClassName("inner-cell");
  var indexCells = document.getElementsByClassName("index-cell");
  var hideButtons = document.getElementsByClassName("hide-button");
  console.log(innerCells);
  console.log(indexCells);
  console.log(hideButtons);
  function removeHideCell(list){
    for (var i in list) {
      console.log(list[i])
      list[i].classList.remove("hide-cell")
    }
  }

  removeHideCell(innerCells);
  removeHideCell(indexCells);
  removeHideCell(hideButtons);
}

window.onload = fillChart("none");

