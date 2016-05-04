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
		container.appendChild(makeGrid(10, 36, 450, 0)); //makes four 5x5 quadrant with boxes 30 px wide

    var cpContainer = document.getElementById("buildPalette");
    cpContainer.appendChild(makeColorPalette(numColors)); //make dynamic color palette with 6 colors

    fillEventList(d);
	})

  var makeGrid = function(boxesPerSide, size, pixelsPerSide, currYearID){ //TODO: handle edge cases for specific yearboxes

    var noLeftOrange = [1,11,21,31,41,51,61,71,81,91];
    var orangeOnLft = [6,16,26,36,46,56,66,76,86,96]; 
    var orangeOnBtm = [51,52,53,54,55,56,57,58,59,60];
    var orangeOnRt = [5,15,25,35,45,55,65,75,85,95];
    //whole svg 
    var svg = document.createSvg("svg");
    svg.setAttribute("width", 402); //hardcoded for now
    svg.setAttribute("height", 402);

    //group for everything: background, years, types. so when "maing" is translated, everything moves as a unit
    maing = document.createSvg("g");
    maing.setAttribute("id", "viewmaing");
    maing.setAttribute("width", pixelsPerSide + size/3);
    maing.setAttribute("height", pixelsPerSide + size/3);

    //append maing to svg
    svg.appendChild(maing);

    for(var i = 0; i < boxesPerSide; i++) {
        for(var j = 0; j < boxesPerSide; j++) {
          var numYear = boxesPerSide * i + j; //which number year box we're on
          var yearBox = document.createSvg("g");
            yearBox.setAttribute("width", size);
            yearBox.setAttribute("height", size);
            yearBox.setAttribute("id", "buildyear" + currYearID);
            currYearID = currYearID + 1;
            maing.appendChild(yearBox);
            yearBox.addEventListener( //adds event listener to each yearBox
            "click",
            function(e){
                {
                    changeSquare(e.target); //e.target is the rect object, where id="type#year#" and class="typeSquare"
                }
            },
             false);

          for(var numType = 0; numType < 9; numType++){ //for 9 times, create a type square and append to current year box

            var type = document.createSvg("rect");
            //any style or attribute applied to a year will filter to the types that make it up
            yearBox.appendChild(type);

            type.setAttribute("class","typeSquare"); //class for all type squares 
            type.setAttribute("id", "buildtype" + numType + type.parentNode.getAttribute("id")); //each type square has an ID according to its type: 0-8 AND ALSO ITS YEAR (otherwise it wont be unique)
            type.setAttribute("width", size/3);
            type.setAttribute("height", size/3);
            type.setAttribute("fill", "white");
            type.setAttribute("squareState","0");

            //0,1,2 are type boxes on the first row
            if(numType == 0 || numType == 1 || numType == 2){ 
            type.setAttribute("transform", ["translate(" + ((numType) * size/3 + numType),1 + ")"]); //moves individual type square
              if(numType == 0 || numType == 1){ //if 0 or 1 do right dotted 
                if(numType == 0 && (!noLeftOrange.includes(currYearID))){ //if 0 do left orange
                  if(orangeOnLft.includes(currYearID))
                    drawLine(0,0,(numType)*size/3,size/3,yearBox,'orange',0,0,5);
                  else
                    drawLine(0,0,(numType)*size/3,size/3,yearBox,'orange',0,0,1);
                }
                drawLine((numType+1)*size/3 + (0.5*(numType+1)),0,(numType+1)*size/3+(0.5*(numType+1)),size/3,yearBox,'black',2,2,0.5);
              }   
              if(numType == 2 && (orangeOnRt.includes(currYearID)))//thick orange on right
                drawLine((numType+1)*size/3 + (0.5*(numType+1)),0,(numType+1)*size/3+(0.5*(numType+1)),size/3,yearBox,'orange',0,0,5);
              
              if(currYearID.between(11,101))//exclude top row from orange line
              {
                  if(currYearID.between(51,61))//extra thick orange line on top if middle row
                    drawLine((numType)*size/3+numType,0,(numType)*size/3+numType+size/3 + 1,0,yearBox,'orange',0,0,5);
                  else
                    drawLine((numType)*size/3+numType,0,(numType)*size/3+numType+size/3 + 1,0,yearBox,'orange',0,0,1); //orange line one px above the top of each type square
              }
              drawLine((numType)*size/3+numType,1.5+size/3,(numType)*size/3+numType+size/3,1.5+size/3,yearBox,'black',2,2,0.5); //bottom dotted line
            }
            else if(numType == 3 || numType == 4 || numType == 5){
              type.setAttribute("transform", ["translate(" + ((numType-3) * size/3 + (numType-3)),size/3 + 2 + ")"]);
              if(numType == 3 || numType == 4){ //if 3 or 4 draw right dotted
                if(numType == 3 && (!noLeftOrange.includes(currYearID))){//if 3 and not in the left column, draw left orange
                  if(orangeOnLft.includes(currYearID))
                    drawLine(0,size/3,(numType-3)*size/3,2*size/3,yearBox,'orange',0,0,5);
                  else
                    drawLine(0,size/3,(numType-3)*size/3,2*size/3,yearBox,'orange',0,0,1);
                }
                drawLine((numType-2)*size/3+(0.5*(numType-2)),size/3,(numType-2)*size/3+(0.5*(numType-2)),2*size/3,yearBox,'black',2,2,0.5);
              }
        if(numType == 5 && (orangeOnRt.includes(currYearID)))//thick orange on right
          drawLine((numType-2)*size/3+(0.5*(numType-2)),size/3,(numType-2)*size/3+(0.5*(numType-2)),2*size/3,yearBox,'orange',0,0,5);
               
              drawLine((numType-3) * size/3 + (numType-3),size/3+2.5+size/3,(numType-3) * size/3 + (numType-3)+size/3,size/3+2.5+size/3,yearBox,'black',2,2,0.5); //dotted line 1px below the bottom of type square
            }
            else if(numType == 6 || numType == 7 || numType == 8){
              if(numType == 6 || numType == 7){ //if 6 or 7 draw right dotted
                if(numType == 6 && (!noLeftOrange.includes(currYearID))){ //if 6 draw left orange
                  if(orangeOnLft.includes(currYearID))
                    drawLine(0,2*size/3,(numType-6)*size/3,3*size/3+3,yearBox,'orange',0,0,5);
                  else
                    drawLine(0,2*size/3,(numType-6)*size/3,3*size/3+3,yearBox,'orange',0,0,1);
                }
                drawLine((numType-5)*size/3+(0.5*(numType-5)),2*size/3,(numType-5)*size/3+(0.5*(numType-5)),3*size/3+1,yearBox,'black',2,2,0.5); //right dotted
              }
              if(numType == 8 && orangeOnRt.includes(currYearID)) 
                drawLine((numType-5)*size/3+(0.5*(numType-5)),2*size/3,(numType-5)*size/3+(0.5*(numType-5)),3*size/3+3,yearBox,'orange',0,0,5);
                
                if(currYearID.between(41,51))
                  drawLine((numType-6) * size/3 + (numType-6),3*size/3+3,(numType-6) * size/3 + (numType-6)+size/3+1,3*size/3+3,yearBox,'orange',0,0,5); //bottom thick orange
                
                type.setAttribute("transform", ["translate(" + ((numType-6) * (size/3) + (numType-6)),2*(size/3) + 3 +")"]);
            }
          } //end for loop

        if(numYear.between(0,50)){  //upper half of grid
            yearBox.setAttribute("transform", ["translate(", j*size + j*3, ",", i*size + i*3, ")"].join("")); //offset to see bkg. j is x, i is y
            if(numYear.between(5,10) || numYear.between(15,20) || numYear.between(25,30) || numYear.between(35,40) || numYear.between(45,50)) // right quadrant
              yearBox.setAttribute("transform", ["translate(", j*size + j*3 + size/3, ",", i*size + i*3, ")"].join(""));
          }
        if(numYear.between(50,100)){ //lower half of grid
            yearBox.setAttribute("transform", ["translate(", j*size + j*3, ",", i*size + i*3 + size/3, ")"].join("")); 
            if(numYear.between(55,60) || numYear.between(65,70) || numYear.between(75,80) || numYear.between(85,90) || numYear.between(95,100)) // right quadrant
              yearBox.setAttribute("transform", ["translate(", j*size + j*3 + size/3, ",", i*size + i*3 + size/3, ")"].join(""));
          }
        }//close inner for loop
    }//close outer for loop


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
      var eventLi = document.getElementById('buildtype'+e.eventType+'text'+parseInt((e.year%100)-1));
      var eventList = document.getElementById("buildList").innerHTML; 
      if(eventLi == null)                     //this math sets list element's id equal to type#text+year, e.g. type0text0
        document.getElementById('buildList').innerHTML = eventList + '<li id= buildtype'+e.eventType + 'text'+parseInt((e.year%100)-1) + '>' + e.text + '</li>';
      else //else, the event is a triangle
        document.getElementById('buildList').innerHTML = eventList + '<li id= buildtritype'+e.eventType + 'text'+parseInt((e.year%100)-1) + '>' + e.text + '</li>';
    })
  }

  /*copied code from build.js*/

  /*color palette interaction*/

  /*update the current color based on what user clicks*/
  var updateCurrColor = function(e){
    var numColors = 3;
    //returns the svg element of the color square, <rect>
    if(e.target !== e.currentTarget && document.getElementById("colorPaletteSVG")){ //second check is for when color palette isn't there because of updating
      var clickedItemID = e.target.id; //id= #colorBox[i]
      currColor = document.getElementById(clickedItemID).getAttribute("fill"); 
      console.log("currColor " + currColor); //working

      //remove all selection css
      for (var i=0; i<numColors;i++){
        document.getElementById("colorBox"+i).removeAttribute("class","selectedColor");
      }
      //add new selection css
      e.target.setAttribute("class","selectedColor");
    }
    e.stopPropagation();
  }


  /**dynamic color palette to size according to number of colors*/
  var makeColorPalette = function(numColors){

    var arrayColors = ["#8D2B1D", "#325B67", "#458867"];
    var countryNames = ["England", "Spain", "France"]; 

    // var svg = document.createSvg("svg"); //no difference between this line 
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg"); //and this line, they both work 
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", 60);
    svg.setAttribute("id","colorPaletteSVG");


    for(var i=0; i<numColors;i++){

      //group for country color square and its label
      colorGroup = document.createSvg("g");

      var colorBox = document.createSvg("rect");
      colorBox.setAttribute("width", "20px");
      colorBox.setAttribute("height", "20px");
      colorBox.setAttribute("transform", ["translate("  + (80*i), 25  + ")"]); 
      colorBox.setAttribute("id", "colorBox" + i); //colorbox1, colorbox2, etc
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
      colorLabel.setAttribute("transform", ["translate("  + (80*i), 10  + ")"]);
      colorLabel.setAttribute("textAlign","center");


      colorGroup.setAttribute("id", "colorGroup" + i);
      colorGroup.setAttribute("width", "250px");

      colorGroup.appendChild(colorBox);
      colorGroup.appendChild(colorLabel);

      svg.appendChild(colorGroup);
    }
    return svg;
  }

  /*function changes type square based on current square state and color. currently states are identified by number, could have 
  better-named string variables but doesn't matter*/
  function changeSquare(element){
    var w = element.getAttribute('width');
    var t = element.getAttribute('transform');

    //create the polygon svg elements for the triangle overlay 
    var triangle = document.createSvg("polygon");  //triangle order 1
    var triangle2 = document.createSvg("polygon"); //triangle order 2




    /*case 1: square is empty, fill it with current color*/
    if(element.getAttribute("squareState") == "0"){
      console.log("squareState == 1");

      element.setAttribute("fill", currColor); //fill square with currColor

      prevColor = element.getAttribute("fill"); //store previous color

      element.setAttribute("squareState","1"); //change squareState, 1=filled with color

    /*case 1.5: if the square is already filled with a color and the currColor is the same, make it blank*/
    }else if(element.getAttribute("squareState") == "1" && element.getAttribute("fill") == currColor){
      console.log("squareState == 0");

      console.log(element.getAttribute("fill")); 
      console.log(currColor);

      element.setAttribute("fill", "white");
      element.setAttribute("squareState","0");
    
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
    }

    //if it's not 0,1,2,3,4, we have a problem...it's usually been null 
    else{
      console.log("Houston we have a problem");
      console.log("squareState is " + element.getAttribute("squareState"));
    }
  }
  
  /*end copy of old code*/

//function to draw gridlines
  drawLine = function(x1,y1,x2,y2,group,strokeClr,dashWidth,dashSpace,strokeWidth){ 
  	var aLine = document.createSvg('line');
  	aLine.setAttribute('stroke-width',strokeWidth);
    aLine.setAttribute('x1', x1);
    aLine.setAttribute('y1', y1);
    aLine.setAttribute('x2', x2);
    aLine.setAttribute('y2', y2);
    aLine.setAttribute('stroke', strokeClr);
    aLine.setAttribute('stroke-dasharray',dashWidth+","+dashSpace);
    group.appendChild(aLine);
  }



});