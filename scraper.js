/*
A scraper to retrieve (most of) the seasons data stored in the PRODUCE variable
in index.js

To run:
* Navigate to http://nashvillefarmersmarket.org/seasonality_calendar and paste
the contents of this file into the console. Run the code by pressing Enter
* A list of names and DOM nodes, followed by a long string of data should pop
out. I paste the data directly into the file.
* The list of names and DOM nodes have text dates (e.g. figs in "Late September")
and the seasons have to be manually generated
* Manually add "veg" or "fruit" to each link, verifying that it exists. Not all
do - if you find something that doesn't work add it the noLinks variable
* Add an appropriate icon link for each from
http://www.iconshock.com/flat-icons/food-icons. Not all have an icon just for
them, be creative. The icon under default.png if a produce item has no "icon"
field.

TODO: Move the stuff that doesn't change (links, icons, text seasons) into a
base data structure so no one has to regenerate each time.
 */

function parseDayAndMonth(dateAndMonthString) {
  var parts = dateAndMonthString.split("/")
  return [Number(parts[0]), Number(parts[1])]
}

var noIcons = [
  "arugula", "basil", "bok choy", "boysenberries", "collards",
  "gooseberries", "greens", "herbs", "kale", "mustard", "okra",
  "radicchio", "rhubarb", "scallions", "spinach", "soybeans",
  "swiss chard", "turnip greens", "zucchini",
]
var noLinks = [
  "artichokes", "basil", "boysenberries", "bok choy",
  "garlic", "gooseberries", "greens", "honey", "leeks",
  "pecans", "radicchio", "rhubarb", "scallions", "soybeans",
  "swiss chard", "zucchini",
]
var rows = document.querySelectorAll("#seasonality_cal tr")
var result = []

// Skip the first row, a header
for (var i = 1; i < rows.length; i++) {
  var data = {}
  var row = rows[i]
  var name = row.children[0].textContent.toLowerCase()
  data["name"] = name
  if (noLinks.indexOf(name) === -1) {
    // "fruit" or "veg" has to be hand added, and links need to be verified
    data["link"] =  "https://agriculture.tn.gov/Marketing.asp?QSTRING=_" + name
  }
  var seasons = row.children[1].children[0].children
  data["seasons"] = []
  for (var j = 0; j < seasons.length; j++) {
    var rangeString = seasons[j].textContent.trim()
    if (rangeString.indexOf("Year-Round") !== -1) {
      data["seasons"].push({
        "seasonStartMonth": 1,
        "seasonStartDay": 1,
        "seasonEndMonth": 12,
        "seasonEndDay": 31,
      })
      continue
    }
    var startAndEnd = rangeString.split("-")
    if (startAndEnd.length !== 2){
      console.log(name, seasons[j])
      continue
    }
    var startMonthAndDay = parseDayAndMonth(startAndEnd[0])
    if (startMonthAndDay.length !== 2 || isNaN(startMonthAndDay[0]) || isNaN(startMonthAndDay[1])) {
      console.log(name, seasons[j])
      continue
    }
    var endMonthAndDay = parseDayAndMonth(startAndEnd[1])
    data["seasons"].push({
      "seasonStartMonth": startMonthAndDay[0],
      "seasonStartDay": startMonthAndDay[1],
      "seasonEndMonth": endMonthAndDay[0],
      "seasonEndDay": endMonthAndDay[1],
    })
  }
  result.push(data)
}
console.log(JSON.stringify(result))
