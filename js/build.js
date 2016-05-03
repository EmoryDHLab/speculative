$(document).ready(function() {

document.createSvg = function(tagName) {
        var svgNS = "http://www.w3.org/2000/svg";
        return this.createElementNS(svgNS, tagName);
  	};

  	Number.prototype.between = function (min, max) {
    return this >= min && this < max;
    };


	d3.csv('peabodyData.csv', function(d){	
		var container = document.getElementById("buildGrid");
		container.appendChild(makeGrid(10, 36, 450, 0)); //makes four 5x5 quadrant with boxes 30 px wide

		/*populate chart*/
    fillChart(d);




	})

  var makeGrid = function(boxesPerSide, size, pixelsPerSide, currYearID){ //TODO: handle edge cases for specific yearboxes

    //whole svg 
    var svg = document.createSvg("svg");
    svg.setAttribute("width", pixelsPerSide + size/3);
    svg.setAttribute("height", pixelsPerSide + size/3);

    //group for everything: background, years, types. so when "maing" is translated, everything moves as a unit
    maing = document.createSvg("g");
    maing.setAttribute("id", "buildmaing");
    maing.setAttribute("width", pixelsPerSide + size/3);
    maing.setAttribute("height", pixelsPerSide + size/3);

    //"physical" bg element, this goes on top of "maing", a little redundant but think of it as the physical object in the container
    var bg = document.createSvg("rect");
    var sizeBG = (pixelsPerSide);
    bg.setAttribute("id","buildbg");
    bg.setAttribute("width", sizeBG + size/3);
    bg.setAttribute("height", sizeBG + size/3);
    bg.setAttribute("fill","white");
    bg.setAttribute("fill-opacity",".1");

    //append maing to svg
    svg.appendChild(maing);

    //the bg belong to the maing
    maing.appendChild(bg);

    for(var i = 0; i < boxesPerSide; i++) {
        for(var j = 0; j < boxesPerSide; j++) {
          var numYear = boxesPerSide * i + j; //which number year box we're on
          var yearBox = document.createSvg("g");
            yearBox.setAttribute("width", size);
            yearBox.setAttribute("height", size);
            yearBox.setAttribute("id", "buildyear" + currYearID);
            currYearID = currYearID + 1;
            maing.appendChild(yearBox);
            yearBox.addEventListener( //event listener for hover
            "mouseover",
            function(e){
                    //highlightItem(e.target); //e.target is the rect object, where id="type#year#" and class="typeSquare"
            },
             false);
            yearBox.addEventListener( //event listener for hover
              'mouseout',
              function(e){
                //removeHighlight(e.target);
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
              if(numType == 0 || numType == 1){ //if 0 or 1 do right dotted 
              	if(numType == 0){ //if 0 do left orange
              		drawLine(0,0,(numType)*size/3,size/3,yearBox,'orange',0,0,1);
				}
              	drawLine((numType+1)*size/3 + (0.5*(numType+1)),0,(numType+1)*size/3+(0.5*(numType+1)),size/3,yearBox,'black',2,2,0.5);

              }   

              type.setAttribute("transform", ["translate(" + ((numType) * size/3 + numType),1 + ")"]); //moves individual type square
              drawLine((numType)*size/3+numType,0,(numType)*size/3+numType+size/3 + 1,0,yearBox,'orange',0,0,1); //line one px above the top of each type square
              drawLine((numType)*size/3+numType,1.5+size/3,(numType)*size/3+numType+size/3,1.5+size/3,yearBox,'black',2,2,0.5);
            }
            else if(numType == 3 || numType == 4 || numType == 5){
            	if(numType == 3 || numType == 4){ //if 3 or 4 draw right dotted
            		if(numType == 3){//if 3 draw left orange
            			drawLine(0,size/3,(numType-3)*size/3,2*size/3,yearBox,'orange',0,0,1);
            		}
            		drawLine((numType-2)*size/3+(0.5*(numType-2)),size/3,(numType-2)*size/3+(0.5*(numType-2)),2*size/3,yearBox,'black',2,2,0.5);
            	}

                type.setAttribute("transform", ["translate(" + ((numType-3) * size/3 + (numType-3)),size/3 + 2 + ")"]);
            	drawLine((numType-3) * size/3 + (numType-3),size/3+2.5+size/3,(numType-3) * size/3 + (numType-3)+size/3,size/3+2.5+size/3,yearBox,'black',2,2,0.5); //dotted line 1px below the bottom of type square
            }
            else if(numType == 6 || numType == 7 || numType == 8){
            	if(numType == 6 || numType == 7){ //if 6 or 7 draw right dotted
            		if(numType == 6){ //if 6 draw left orange
            			drawLine(0,2*size/3,(numType-6)*size/3,3*size/3+3,yearBox,'orange',0,0,1);
            		}
            		drawLine((numType-5)*size/3+(0.5*(numType-5)),2*size/3,(numType-5)*size/3+(0.5*(numType-5)),3*size/3+1,yearBox,'black',2,2,0.5);
            	}
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
  function fillChart(dataArr){
    dataArr.forEach(function (element, index, array){
        var typeRect = document.getElementById('buildtype' + element.eventType + 'buildyear' + (+element.year % 100 - 1))
        if(typeRect.getAttribute('fill') != 'white'){
          //if a rectangle is present, draw a triangle over it
          var w = typeRect.getAttribute('width');
          var t = typeRect.getAttribute('transform');
          var pts = "0," + w + " " + w + ",0" + " " + w + "," + w; //create a string of the triangle's coordinates //4

          var triangle = document.createSvg("polygon");

          triangle.setAttribute("id", "buildtri"+typeRect.getAttribute("id")); //give id, format is "tritype#year#"
          triangle.setAttribute("points", pts); //specify coordinates
          triangle.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated
          triangle.setAttribute('fill', element.color); //change color
         
          typeRect.parentNode.appendChild(triangle);
        }
        else
            typeRect.setAttribute('fill', element.color);
    })
  }

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