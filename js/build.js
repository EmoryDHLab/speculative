var gControl={
  x:18,
  y:18,
  offset:18,
  lines:{
    thick:18,
    medium:2,
    thin:.25
  },
  colors:{
    outer: "#DB882A",
    inner: "#FAAE3C",
    innermost: "#B3B3B3",
    sp:"#2B4461",
    fr:"#458867",
    en:"#8D2B1D"
  }
}

var Evt = function(tp, year, desc, country){
  this.tp=tp;
  this.year = year; //the integer value of the year
  this.desc = desc;
  this.country = country;
  this.clr = "white";
  if(country.toLowerCase()=="england"){
    this.clr = gControl.colors.en;
  }else if(country.toLowerCase()=="spain"){
    this.clr = gControl.colors.sp;
  }else if(country.toLowerCase()=="france"){
    this.clr = gControl.colors.fr;
  }
}

Evt.prototype.getYear=function(){
  return this.year%100;
}

Evt.prototype.getId=function(typ="build"){
  return typ + "type" + this.tp + typ + "year" + this.getYear();
}

var generateEvents=function(){
  return [
    new Evt(5, 1501, "Henry VII. grants patent for colonizing America.", "England"),
    new Evt(7, 1512, "Ponce de Leon discovers Florida.", "Spain"),
    new Evt(7, 1517, "Sebastian Cabot's last voyage in the English service.", "England"),
    new Evt(7, 1520, "Vasquez de Ayllon’s Piracy on Chicora.", "Spain"),
    new Evt(7, 1523, "Verrazzani explores American coasts for France.", "France"),
    new Evt(7, 1525, "Stephen Gomez tries to discover North West Passage to India for Spain.", "Spain"),
    new Evt(7, 1526, "Pamphilo de Narvaez attempts to conquer Florida.","Spain"),
    new Evt(7, 1534, "James Cartier discovers River St. Lawrence.","France"),
    new Evt(7, 1537, "Ferdinand de Soto attempts to conquer Florida.", "Spain"),
    new Evt(7, 1540, "Roberval and Cartier try in vain to colonize Canada.","France"),
    new Evt(8, 1542, "Ferdinand de Soto dies on the Mississippi.", "Spain"),
    new Evt(8, 1562, "Coligny sends a Huguenot Colony to America.", "France"),
    new Evt(7, 1565, "St. Augustine, founded by the Spanish Melendez, who conquers the French colony.", "Spain"),
    new Evt(4, 1576, "Martin Frobisher renews English Explorations.", "England"),
    new Evt(7, 1578, "Sir Humphrey Gilbert’s Voyage and Death.", "England"),
    new Evt(7, 1579, "Sir Francis Drake discovers Oregon, and names it New Albion.", "England"),
    new Evt(7, 1584, "Sir Walter Raleigh gets patent to colonize.", "England"),
    new Evt(7, 1585, "Sir W. R.’s unsuccessful colony at Roanoke, carried out by Sir Richard Grenville.","England")
  ];
}

var BuildControl={
  i:0,
  guessed:[
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false,false,false,
      false,false,false
  ],
  allowed:[
    true,true,true,true,true,
    true,true,true,true,true,
    true,true,true,true,true,
    true,true,true
  ],
  placed:[
    "", "", "", "", "",
    "", "", "", "", "",
    "", "", "", "", "",
    "", "", ""
  ],
  eventsList: generateEvents(),
  inc: function(){
    if(this.i >= this.eventsList.length-1){
      this.i = -1;
    }
      this.i++;
      this.update();
  },
  dec: function(){
    if(this.i<=0){
      this.i=this.eventsList.length;
    }
    this.i--;
    this.update();
  },
  currentAnswer: function(){
    return [this.eventsList[this.i].getId(), this.eventsList[this.i].clr];
  },
  currentEventDesc: function(){
    return this.eventsList[this.i].desc;
  },
  currentYear: function(){
    return this.eventsList[this.i].year;
  },
  getCounter: function(){
    return (this.i+1).toString() +"/"+ this.eventsList.length.toString()
  },
  getPlacedData: function(){
    if(this.placed[this.i]!=""){
      return [this.placed[this.i].id, this.placed[this.i].getAttribute("fill")];
    }else{
      return "";
    }
  },
  checkAnswer: function(){
    if(this.getPlacedData()==""){//if nothing is place yet, return null.
      return null;
    }
    a=this.currentAnswer();
    p=this.getPlacedData();
    if (a[0]==p[0] && a[1]==p[1]){//if the ids and colors are equal, then it is correct.
      return true;
    }
    return false; //if not, then it is incorrect
  },
  lockAnswer:function(){
    this.allowed[this.i]=false;
  },
  unlockAnswer:function(){
    this.allowed[this.i]=true;
  },
  placeAnswer(e,g=true){// given an element, place it on the grid
    this.guessed[this.i]=g; // update guessed to true
    var temp=changeSquare(e,this.allowed[this.i]);// make sure the placement is allowed
    if(temp===""){// changesquare resulted in "",
      this.unlockAnswer();       // unlock the answer for future modification
      this.placed[this.i]=temp;
    }else if(temp===false){ // if not, but the placement was invalid
      this.update();
      return;           // revert the placement back to the old one.
    }else if(this.existsElsewhere(temp)){
      console.log("removing", temp)
      $(temp).remove();
    }else{
      this.placed[this.i]=temp;
      this.lockAnswer();
    }
    this.update(); // Update the UI to match
  },
  showMe: function(){
    if(this.placed[this.i]!=""){
      var wrongElem=this.placed[this.i];
      currColor=$(wrongElem).attr('fill');
      this.placeAnswer(wrongElem);
    }
    var correctElem=document.getElementById(this.currentAnswer()[0]);
    currColor=this.currentAnswer()[1];
    this.placeAnswer(correctElem);
  },
  hideMe: function(){
    var correctElem=document.getElementById(this.currentAnswer()[0]);
    currColor=this.currentAnswer()[1];
    this.placeAnswer(correctElem,false);
  },
  getShow: function(){
    console.log("SHOW?")
    if(this.guessed[this.i]==true){
      return "Hide";
    }else{
      return "Show";
    }
  },
  existsElsewhere: function(elem){ // checks for occurences of an id in placed other which aren't at the current position.
    var elemId=$(elem).attr("id");
    var elemYearType=[elemId.substr(9,1),elemId.substr(19)];
    if(elemId.startsWith("tri")){
      elemYearType=[elemId.substr(12,1),elemId.substr(22)]
    }
    console.log("THE ID IS:", elemYearType)
    // okay so the strings are buildtype[0-8]buildyear[1-100]

    for(var i in this.placed){
      pl=this.placed[i];
      if(this.i!=i && pl!=""){
        console.log("TEH OTHER ONE",[$(pl).attr("id").substr(9,1),$(pl).attr("id").substr(19)]);
        if ($(pl).attr("id").substr(9,1)==elemYearType[0] && $(pl).attr("id").substr(19)==elemYearType[1] ){
          return true
        }
      }
    }
    return false;
  },
  update: function(){
    var check=this.checkAnswer();
    if(check==null){
      $("#incorrect").hide();
      $("#correct").hide();
      $("#na").show();
    }else if(check){
      $("#correct").show()
      $("#incorrect").hide()
      $("#na").hide();
    }else{
      $("#incorrect").show()
      $("#correct").hide()
      $("#na").hide();
    }
    $("#show-hide").html(this.getShow());
  }
}
/*color palette interaction*/

/*update the current color based on what user clicks*/
var updateCurrColor = function(e){
  var numColors = 3;
  //returns the svg element of the color square, <rect>
  console.log($(e.target).attr("class"))
  if($(e.target).attr("class").includes("colorBox") && document.getElementById("colorPaletteSVG")){ //second check is for when color palette isn't there because of updating
    var clickedItemID = e.target.id; //id= #colorBox[i]
    currColor = document.getElementById(clickedItemID).getAttribute("fill");
    console.log("currColor " + currColor); //working

    //remove all selection css
    for (var i=0; i<numColors;i++){
      document.getElementById("colorBox"+i).setAttribute("class","colorBox");
    }
    //add new selection css
    document.getElementById(clickedItemID).setAttribute("class","colorBox selectedColor");
  }
  e.stopPropagation();
}
/*function changes type square based on current square state and color. currently states are identified by number, could have
better-named string variables but doesn't matter*/
function changeSquare(element, allowed=true){
  var w = element.getAttribute('width');
  var t = element.getAttribute('transform');
  console.log(w,t)
  //create the polygon svg elements for the triangle overlay
  var triangle = document.createSvg("polygon");  //triangle order 1
  var triangle2 = document.createSvg("polygon"); //triangle order 2




  /*case 1: square is empty, fill it with current color*/
  if(element.getAttribute("squareState") == "0"){
    console.log("squareState == 1");
    if(allowed){
      element.setAttribute("fill", currColor); //fill square with currColor
      element.setAttribute("stroke", currColor); //fill square with currColor

      prevColor = element.getAttribute("fill"); //store previous color

      element.setAttribute("squareState","1"); //change squareState, 1=filled with color
    }else{
      return false;
    }
  /*case 1.5: if the square is already filled with a color and the currColor is the same, make it blank*/
  }else if(element.getAttribute("squareState") == "1" && element.getAttribute("fill") == currColor){
    console.log("squareState == 0");

    console.log(element.getAttribute("fill"));
    console.log(currColor);

    element.setAttribute("fill", "white");
    element.setAttribute("stroke", "white");
    element.setAttribute("squareState","0");
    return "";
  /*case 2: square is already filled with color, split it with current color*/
  }else if(element.getAttribute("squareState") == "1"){
    console.log("squareState == 1");


    var pts = "0," + w + " " + w + ",0" + " " + w + "," + w; //create a string of the triangle's coordinates //4

    triangle.setAttribute("id", "tri"+element.getAttribute("id")); //give id, format is "tritype#year#"
    triangle.setAttribute("points", pts); //specify coordinates
    triangle.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated
    triangle.setAttribute('fill', currColor); //change color
    triangle.setAttribute("pointer-events","none"); //make the triangle "unclickable" so whatever else is underneath it is clicked on

    element.parentNode.appendChild(triangle); //set triangle's parent as yearbox

    element.setAttribute("squareState","2");
    return triangle;
  /*case 3: square is already split with color one way, split it the other way*/
  //Lauren didn't request this but I think it is necessary for some of the chart possibilites
  }else if(element.getAttribute("squareState") == "2"){
    console.log("squareState == 2");

    //remove triangle to add
    var triRemoved = document.getElementById("tri"+element.getAttribute("id"));
    element.parentNode.removeChild(triRemoved);


    /*set up second triangle to be opposite of previous triangle*/
    var pts =  "0,0 " + "0," + w + " " + w + ",0"; //create a string of the triangle's coordinates //3

    triangle2.setAttribute("id", "tri"+element.getAttribute("id")); //give id, format is "tritype#year#"
    triangle2.setAttribute("points", pts); //specify coordinates
    triangle2.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated
    triangle2.setAttribute('fill', currColor); //change color
    triangle2.setAttribute("pointer-events","none"); //make the triangle "unclickable" so whatever else is underneath it is clicked on

    element.parentNode.appendChild(triangle2); //set triangle's parent as yearbox

    element.setAttribute("fill", prevColor); //change type square color

    element.setAttribute("squareState","3");
    return triangle2;
  }

  //new case, case 4: fill opposite direction
  else if(element.getAttribute("squareState") == "3"){
    console.log("squareState == 3");

    //remove triangle to add
    var triRemoved = document.getElementById("tri"+element.getAttribute("id"));
    element.parentNode.removeChild(triRemoved);

    /*set up second triangle to be opposite of previous triangle*/
    var pts =  "0,0 " + "0," + w + " " + w + "," + w; //create a string of the triangle's coordinates //1
    console.log(pts);
    triangle2.setAttribute("id", "tri"+element.getAttribute("id")); //give id, format is "tritype#year#"
    triangle2.setAttribute("points", pts); //specify coordinates
    triangle2.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated
    triangle2.setAttribute('fill', currColor); //change color
    triangle2.setAttribute("pointer-events","none"); //make the triangle "unclickable" so whatever else is underneath it is clicked on

    element.parentNode.appendChild(triangle2); //set triangle's parent as yearbox

    element.setAttribute("fill", prevColor); //change type square color

    element.setAttribute("squareState","4");
    return triangle2;
  }

  //new case, case 5: fill opposite opposite direction
  else if(element.getAttribute("squareState") == "4"){
    console.log("squareState == 4");

    //remove triangle to add
    var triRemoved = document.getElementById("tri"+element.getAttribute("id"));
    element.parentNode.removeChild(triRemoved);

    /*set up second triangle to be opposite of previous triangle*/
    var pts =  "0,0 " + w + ",0" + " " + w + "," + w; //create a string of the triangle's coordinates //2
    triangle2.setAttribute("id", "tri"+element.getAttribute("id")); //give id, format is "tritype#year#"
    triangle2.setAttribute("points", pts); //specify coordinates
    triangle2.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated
    triangle2.setAttribute('fill', currColor); //change color
    triangle2.setAttribute("pointer-events","none"); //make the triangle "unclickable" so whatever else is underneath it is clicked on

    element.parentNode.appendChild(triangle2); //set triangle's parent as yearbox

    element.setAttribute("fill", prevColor); //change type square color

    element.setAttribute("squareState","5");
    return triangle2;
  }

  //case 6: square is split with color the second way, fill it with current color
  else if(element.getAttribute("squareState") == "5"){
    console.log("squareState == 5");
    element.setAttribute("fill", currColor);


    /*remove triangle so it can be a solid square again*/
    var triRemoved2 = document.getElementById("tri"+element.getAttribute("id"));
    element.parentNode.removeChild(triRemoved2);

    element.setAttribute("squareState","6");
  }

  //case 0: square is filled with current color, make it blank
  else if(element.getAttribute("squareState") == "6"){
    console.log("squareState == 0");

    element.setAttribute("fill","white");

    element.setAttribute("squareState","0");
    return "";
  }

  //if it's not 0,1,2,3,4, we have a problem...it's usually been null
  else{
    console.log("Houston we have a problem");
    console.log("squareState is " + element.getAttribute("squareState"));
    return false;
  }
  return element;
}

$(document).ready(function() {

document.createSvg = function(tagName) {
        var svgNS = "http://www.w3.org/2000/svg";
        return this.createElementNS(svgNS, tagName);
  	};

  	Number.prototype.between = function (min, max) {
    return this >= min && this < max;
    };


	d3.csv('peabodyData.csv', function(d){

    var numColors = 3;

		var container = document.getElementById("buildGrid");
		container.appendChild(makeGrid(480, 1));

    var cpContainer = document.getElementById("buildPalette");
    cpContainer.appendChild(makeColorPalette(numColors)); //make dynamic color palette with 6 colors

	})

var makeGrid = function(size, currYearID){ //TODO: handle edge cases for specific yearboxes
    var centSize=size+gControl.lines.thick*3;
    var yearSize=size/10;
    var eventSize=yearSize/3;
    //whole svg
    var svg = document.createSvg("svg");

    svg.setAttribute("width", centSize); //hard coded for now
    svg.setAttribute("height", centSize);

    //group for everything: background, years, types. so when "maing" is translated, everything moves as a unit
    maing = document.createSvg("g");
    maing.setAttribute("id", "buildmaing");
    maing.setAttribute("height",centSize);
    maing.setAttribute("width",centSize);
    var century= drawRect(gControl.lines.thick/2,gControl.lines.thick/2, size+gControl.lines.thick*2, size+gControl.lines.thick*2, gControl.lines.thick);
    maing.appendChild(century);
    topG= document.createSvg("g");
    maing.appendChild(topG);

    century.setAttribute("fill","white");
    century.setAttribute("stroke",gControl.colors.outer);
    //append maing to svg
    //TODO add generic function for hover event on the yearbox elements.

    for(var i = 0; i < 10; i++) {// for each decade
      for(var j = 0; j < 10; j++) {//for each year
          var numYear = i*10 + j; //which number year box we're on
          var yearGroup = document.createSvg("g");
          yearGroup.setAttribute("width", size+gControl.lines.medium);
          yearGroup.setAttribute("height", size+gControl.lines.medium);
          yearGroup.setAttribute("id", "buildyear" + (currYearID));
          yearGroup.setAttribute("class","yearBox")
          currYearID = currYearID + 1;
          for(var numType = 0; numType < 9; numType++){ //for 9 times, create a type square and append to current year box
            var currEvtX=gControl.x,
                currEvtY=gControl.y;
            currEvtX += j * yearSize; // add year x offset
            currEvtY += i * yearSize; // add year y offset
            currEvtY += Math.floor(numType/3) * eventSize;  // som cool math to find y offset
            currEvtX += numType%3 * eventSize;              // some cool math to find x offset
            if(j>4){
                currEvtX+=18;
            }
            if(i>4){
                currEvtY+=18;
            }
            var typeBox = drawRect(currEvtX,currEvtY,eventSize,eventSize);
            //any style or attribute applied to a year will filter to the types that make it up
            yearGroup.appendChild(typeBox);
            typeBox.setAttribute("class","buildSquare"); //class for all type squares
            typeBox.setAttribute("id", "buildtype" + numType + typeBox.parentNode.getAttribute("id")); //each type square has an ID according to its type: 0-8 AND ALSO ITS YEAR (otherwise it wont be unique)
            typeBox.setAttribute("fill", "white");
            typeBox.setAttribute("squareState","0");
            //0,1,2 are type boxes on the first row
          }
          maing.appendChild(yearGroup);
        }//close inner for loop
    }//close outer for loop

    for(var i=1; i<30; i++){//draws event lines
      var eventPos=((i)*eventSize),
          thickness=gControl.lines.thin,
          clr=gControl.colors.innermost;
      if((i)%3!=0){
        if (i>15) {
          eventPos+=18;
        }
        topG.appendChild(drawLine(gControl.x,gControl.y+eventPos,gControl.x+size+gControl.offset,gControl.y+eventPos,thickness,clr));
        topG.appendChild(drawLine(gControl.x+eventPos,gControl.y,gControl.x+eventPos,gControl.y+size+gControl.offset,thickness,clr));
      }
    }

    for(var i=0;i<9;i++){// draws year lines
      for(var j=0; j<9; j++){
        var thickness=gControl.lines.medium,
            clr=gControl.colors.inner,
            yrPos=((i+1)*yearSize);
        if(i<9){
          if((i+1)%5!=0){
            if (i>4) {
              yrPos+=18;
            }
            topG.appendChild(drawLine(gControl.x,gControl.y+yrPos,gControl.x+size+gControl.offset,gControl.y+yrPos,thickness,clr));
            topG.appendChild(drawLine(gControl.x+yrPos,gControl.y,gControl.x+yrPos,gControl.y+size+gControl.offset,thickness,clr));
          }else{
              yrPos+=9;
          }
        }
      }
    }
    // draws thick centers.
    var midPos=(5*yearSize)+9,
        clr=gControl.colors.outer;

    topG.appendChild(drawLine(gControl.x, gControl.y+midPos,gControl.x+size+gControl.offset,gControl.y+midPos, gControl.lines.thick, clr));
    topG.appendChild(drawLine(gControl.x+midPos, gControl.y, gControl.x+midPos, gControl.y+size+gControl.offset, gControl.lines.thick,clr));
    svg.appendChild(maing);
    svg.appendChild(topG);

    return svg;
  }

/*fill in squares on chart given an array of objects w/ year, eventType, color*/
// function fillChart(dataArr){
//   dataArr.forEach(function (element, index, array){
//       var typeRect = document.getElementById('buildtype' + element.eventType + 'buildyear' + (+element.year % 100 - 1))
//       if(typeRect.getAttribute('fill') != 'white'){
//         //if a rectangle is present, draw a triangle over it
//         var w = typeRect.getAttribute('width');
//         var t = typeRect.getAttribute('transform');
//         var pts = "0," + w + " " + w + ",0" + " " + w + "," + w; //create a string of the triangle's coordinates //4

//         var triangle = document.createSvg("polygon");

//         triangle.setAttribute("id", "buildtri"+typeRect.getAttribute("id")); //give id, format is "tritype#year#"
//         triangle.setAttribute("points", pts); //specify coordinates
//         triangle.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated
//         triangle.setAttribute('fill', element.color); //change color

//         typeRect.parentNode.appendChild(triangle);
//       }
//       else
//           typeRect.setAttribute('fill', element.color);
//   })
// }

  /*creates a list of events based on a "text" attribute of objects in an array*/
function fillEventList(dataArr){
  dataArr.forEach(function (e, i, a){
    var eventLi = document.getElementById('buildtype'+e.eventType+'text'+parseInt((e.year%100)));
    var eventList = document.getElementById("buildList").innerHTML;
    if(eventLi == null)                     //this math sets list element's id equal to type#text+year, e.g. type0text0
      document.getElementById('buildList').innerHTML = eventList + '<li id= buildtype'+e.eventType + 'text'+parseInt((e.year%100)-1) + '>' + e.text + '</li>';
    else //else, the event is a triangle
      document.getElementById('buildList').innerHTML = eventList + '<li id= buildtritype'+e.eventType + 'text'+parseInt((e.year%100)-1) + '>' + e.text + '</li>';
  })
}

/*copied code from build.js*/




/**dynamic color palette to size according to number of colors*/
var makeColorPalette = function(numColors){

  var arrayColors = ["#8D2B1D", "#2B4461", "#458867"];
  var countryNames = ["England", "Spain", "France"];

  // var svg = document.createSvg("svg"); //no difference between this line
  var svgNS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(svgNS, "svg"); //and this line, they both work
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", 40);
  svg.setAttribute("id","colorPaletteSVG");


  for(var i=0; i<numColors;i++){
    //group for country color square and its label
    colorGroup = document.createSvg("g");

    var colorBox = document.createSvg("rect");
    colorBox.setAttribute("width", "20px");
    colorBox.setAttribute("height", "20px");
    colorBox.setAttribute("transform", ["translate("  + (4+80*i), 10  + ")"]);
    colorBox.setAttribute("id", "colorBox" + i); //colorbox1, colorbox2, etc
    colorBox.setAttribute("class","colorBox");
    colorBox.setAttribute("fill", arrayColors[i]);
    console.log(colorBox.getAttribute("id"));

    /*tutorial: http://www.kirupa.com/html5/handling_events_for_many_elements.htm*/
    var colorPalette = document.querySelector("#buildPalette");
    colorPalette.addEventListener("click", updateCurrColor, false);

    //form labels don't work because they can't be appended to an svg...

    /*label for color in palette*/
    var colorLabel = document.createSvg("text");
    colorLabel.textContent = countryNames[i];
    colorLabel.setAttribute("x","30");
    colorLabel.setAttribute("y","30");
    colorLabel.setAttribute("font-family", "PT Sans Narrow");
    colorLabel.setAttribute("font-size", "15");
    colorLabel.setAttribute("transform", ["translate("  + (80*i + 1), -5  + ")"]);
    colorLabel.setAttribute("textAlign","center");


    colorGroup.setAttribute("id", "colorGroup" + i);
    colorGroup.setAttribute("width", "250px");

    colorGroup.appendChild(colorBox);
    colorGroup.appendChild(colorLabel);

    svg.appendChild(colorGroup);
  }
  return svg;
}


  /*end copy of old code*/

function highlightItem(element){ //element is either text in list or typesquare or tritype
    var id = element.getAttribute("id");
    var offsets = null;

    if(id != null){
      if(id.includes("text")){ //if hovering over text
        element.setAttribute("class","highlight");
        //the text's id type#text# turns to a square's id type#year#
        var typeSquare = document.getElementById(id.replace('text','buildyear'));
        if(typeSquare != null)
          typeSquare.setAttribute("class","highlightSquare");
          console.log("high");
        offsets = $('#'+id.replace('text','buildyear')).offset(); //have to use jquery to use its offset() method which accounts for scrolling offsets
      }
      else if(id.includes("year") && id.includes('type') && element.getAttribute('fill') != 'white'){ //if hovering over rect or tritype
        console.log(id);
        console.log("hover");
        element.setAttribute("stroke", "blue");
        /*element.setAttribute("class","highlightSquare");
        var text = document.getElementById(id.replace('buildyear','text'))
        if(text != null)
          text.setAttribute("class","highlight");
        offsets = $('#'+id.replace('buildyear','text')).offset();
        */
      }
  }
}


  function removeHighlight(element){
    var id = element.getAttribute("id");
    if(id != null)
    {
      if(id.includes("text")){ //if hovering over text
        element.removeAttribute("class","highlight");
        //type#text# turns to type#year# for the squares
        if(document.getElementById(id.replace('text','buildyear')) != null)
          document.getElementById(id.replace('text','buildyear')).removeAttribute("class","highlightSquare");
      }
      else if(id.includes("year")){ //if hovering over rect or tritype
          element.setAttribute("stroke", element.getAttribute("fill"));
          /*
        element.removeAttribute("class","highlightSquare");
        if(document.getElementById(id.replace('buildyear','text')) != null) //if there exists a corresponding event
          document.getElementById(id.replace('buildyear','text')).removeAttribute("class","highlight");
          */
      }
   }
  }

    /*
  //event listener for hovering over a list element
  $('ol').on('mouseover', 'li', function(e){
          highlightItem(e.target);
    })

  $('ol').on('mouseout', 'li', function(e){
          removeHighlight(e.target);
    })
*/

//function to draw gridlines
  drawLine = function(x1,y1,x2,y2,strokeWidth,strokeClr){
  	var aLine = document.createSvg('line');
  	aLine.setAttribute('stroke-width',strokeWidth);
    aLine.setAttribute('x1', x1);
    aLine.setAttribute('y1', y1);
    aLine.setAttribute('x2', x2);
    aLine.setAttribute('y2', y2);
    aLine.setAttribute('stroke', strokeClr);
    return aLine;
  }
  drawRect = function(x,y,w,h,strokeWidth=0){
    var aRect = document.createSvg('rect');
    aRect.setAttribute('stroke-width',strokeWidth);
    aRect.setAttribute('transform', ["translate("+x,y+")"]);
    aRect.setAttribute('width', w);
    aRect.setAttribute('height', h);
    return aRect;
  }
});
