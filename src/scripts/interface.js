function showInfo(deckName) {
  document.getElementById("infoSection").classList.add("show-content");
  document.getElementById("closeButton").classList.add("show-delayed");

  var contentHTML = "";
  if (typeof deckInfo[deckName] !== 'undefined') {
    contentHTML +=
      "<h2>" +
      deckInfo[deckName]["deckName"] + " ";
    if (deckInfo[deckName]["colors"]["white"]) {
      contentHTML += "W"
    }
    if (deckInfo[deckName]["colors"]["blue"]) {
      contentHTML += "U"
    }
    if (deckInfo[deckName]["colors"]["black"]) {
      contentHTML += "B"
    }
    if (deckInfo[deckName]["colors"]["red"]) {
      contentHTML += "R"
    }
    if (deckInfo[deckName]["colors"]["green"]) {
      contentHTML += "G"
    }
    contentHTML +=
      "</h2><div class='deck-content'>" +
      deckInfo[deckName]["content"] +
      "</div><div class='bestworst'>" +
      "The best matchups are: <br>" +
      deckInfo[deckName]["best"] +
      "<br><br>" +
      "The worst matchups are: <br>" +
      deckInfo[deckName]["worst"] +
      "<br>" +
      "<button type='button' onclick='openDecklist(\"" + deckName + "\")'>" +
      "View sample decklist" +
      "</button>" +
      "</div>";
  } else {
    contentHTML += "No info available";
  }

  document.getElementById("infoContent").innerHTML = contentHTML;
  document.getElementById("infoContent").classList.add("show-delayed");

}

function removeInfo() {
  document.getElementById("infoSection").classList.remove("show-content");
  document.getElementById("closeButton").classList.remove("show-delayed");
  document.getElementById("infoContent").classList.remove("show-delayed");
  document.getElementById("infoContent").innerHTML = "";
}

function showDecklist() {
  document.getElementById("decklistOverlay").classList.add("show-decklist-overlay");
  document.getElementById("decklist").classList.add("show-decklist");
}

function closeDecklist() {
  document.getElementById("decklistOverlay").classList.remove("show-decklist-overlay");
  document.getElementById("decklist").classList.remove("show-decklist");
}

var allCardsJsonLink = "https://mtgjson.com/json/AllCards-x.json";

function getCard(cardName) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var myObj = JSON.parse(this.responseText);
      console.log("got here");
      console.log(myObj);
      var cardObj = myObj[cardName];
      console.log(cardObj["name"] + " " + cardObj["colors"]);
      return (myObj[cardName]);
    }
  };
  xmlhttp.open("GET", allCardsJsonLink, true);
  xmlhttp.send();
}

function logCard(cardName) {
  var cardObj = getCard(cardName);
}

function openDecklist(deckName) {

  var decklistOutput = "";

  var decklist = decklists[deckName];
  var mainArray = Object.keys(decklist["main"]);
  var sideArray = Object.keys(decklist["side"]);

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var myObj = JSON.parse(this.responseText);
      var lands, creatures, other;
      [lands, creatures, other] = separateCardTypes(mainArray, myObj);
      document.getElementById("decklist").innerHTML = formatDeckList(decklist, lands, creatures, other);
      showDecklist()
    }
  };
  xmlhttp.open("GET", allCardsJsonLink, true);
  xmlhttp.send();
}

function separateCardTypes(cards, allCardsObject) {

  var lands = [], creatures = [], other = [];
  var landsSorted = [], creaturesSorted = [], otherSorted = [];

  for (var i in cards) {
    if (allCardsObject[cards[i]]["types"].includes("Land")) {
      lands.push(cards[i])
    } else if (allCardsObject[cards[i]]["types"].includes("Creature")) {
      creatures.push(cards[i]);
    } else {
      other.push(cards[i]);
    }
  }

  /*sort creatures by cmc*/
  for (var cmc = 0; cmc < 16; cmc++) {
    for (var cardNum in creatures) {
      if (allCardsObject[creatures[cardNum]]["cmc"] === cmc) {
        creaturesSorted.push(creatures[cardNum]);
      }
    }
  }

  /*sort other by cmc*/
  for (var cmc = 0; cmc < 16; cmc++) {
    for (cardNum in other) {
      if (allCardsObject[other[cardNum]]["cmc"] === cmc) {
        otherSorted.push(other[cardNum]);
      }
    }
  }

  /*sort land by basic*/

  var basicLands = ["Plains", "Island", "Swamp", "Mountain", "Forest", "Wastes", "Snow-Covered Plains", "Snow-Covered Island", "Snow-Covered Swamp", "Snow-Covered Mountain", "Snow-Covered Forest"]
  for (cardNum in lands) {
    if (basicLands.includes(lands[cardNum])) {
      landsSorted.push(lands[cardNum]);
    }
  }
  for (cardNum in lands) {
    if (!basicLands.includes(lands[cardNum])) {
      landsSorted.push(lands[cardNum]);
    }
  }

  return [landsSorted, creaturesSorted, otherSorted]
}

function formatDeckList(decklist, lands, creatures, other) {
  decklistHTML =
    "<div class='decklist-container'>\n" +
    "<div class='lands-div'>\n" +
    "<ul class='lands-list'>\n";
  for (var cardNum in lands) {
    decklistHTML += "<li>" +
      decklist["main"][lands[cardNum]] +
      " " +
      lands[cardNum] +
      "</li>\n";
  }
  decklistHTML +=
    "</ul></div>\n" +
    "<div class='creatures-div'>\n" +
    "<ul class='creatures-list'>\n";
  for (cardNum in creatures) {
    decklistHTML += "<li>" +
      decklist["main"][creatures[cardNum]] +
      " " +
      creatures[cardNum] +
      "</li>\n";
  }
  decklistHTML +=
    "</ul></div>\n" +
    "<div class='other-div'>\n" +
    "<ul class='other-list'>\n";
  for (cardNum in other) {
    decklistHTML += "<li>" +
      decklist["main"][other[cardNum]] +
      " " +
      other[cardNum] +
      "</li>\n";
  }

  decklistHTML +=
    "</ul>\n" +
    "</div>\n" +
    "</div>\n" +
    "<button type='button' class='close-decklist' onclick='closeDecklist()'>Click to close </button>";
  return decklistHTML;
}
