$(document).ready(function() {

document.createSvg = function(tagName) {
        var svgNS = "http://www.w3.org/2000/svg";
        return this.createElementNS(svgNS, tagName);
  	};

  	Number.prototype.between = function (min, max) {
    return this >= min && this < max;
    };


	d3.csv('peabodyData.csv', function(d){	
		var container = document.getElementById("compareGrid");
		container.appendChild(makeGrid(10, 48, 450, 0)); //makes four 5x5 quadrant with boxes 30 px wide

		/*populate chart*/
    fillChart1(d);
        
    fillEventList1(d);

    showData(d);

    drawTimeline();



	})

var arrayColors = ["#8D2B1D", "#325B67", "#458867"];
var countryNames = ["England", "Spain", "France"];
var numColors = countryNames.length;
    
var makeGrid = function(boxesPerSide, size, pixelsPerSide, currYearID){ 

    var noLeftOrange = [1,11,21,31,41,51,61,71,81,91];
    var orangeOnLft = [6,16,26,36,46,56,66,76,86,96]; 
    var orangeOnBtm = [51,52,53,54,55,56,57,58,59,60];
    var orangeOnRt = [5,15,25,35,45,55,65,75,85,95];
    
    //whole svg 
    var svg = document.createSvg("svg");
    svg.setAttribute("id", "comparesvg");
    svg.setAttribute("width", 522); //hard coded for now
    svg.setAttribute("height", 522);

    //group for everything: background, years, types. so when "maing" is translated, everything moves as a unit
    maing = document.createSvg("g");
    maing.setAttribute("id", "comparemaing");
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
            yearBox.setAttribute("id", "compareyear" + currYearID);
            currYearID = currYearID + 1;
            maing.appendChild(yearBox);
            yearBox.addEventListener( //event listener for hover
            "mouseover",
            function(e){
                    highlightItem(e.target); //e.target is the rect object, where id="type#year#" and class="typeSquare"
            },
             false);
            yearBox.addEventListener( //event listener for hover
              'mouseout',
              function(e){
                removeHighlight(e.target);
              },
              false);

          for(var numType = 0; numType < 9; numType++){ //for 9 times, create a type square and append to current year box

            var type = document.createSvg("rect");
            //any style or attribute applied to a year will filter to the types that make it up
            yearBox.appendChild(type);

            type.setAttribute("class","typeSquare"); //class for all type squares 
            type.setAttribute("class","compareType");
            type.setAttribute("id", "comparetype" + numType + type.parentNode.getAttribute("id")); //each type square has an ID according to its type: 0-8 AND ALSO ITS YEAR (otherwise it wont be unique)
            type.setAttribute("width", (size-9)/3);
            type.setAttribute("height", (size-9)/3);
            type.setAttribute("stroke", "white");
            type.setAttribute("stroke-width", 3);
            type.setAttribute("fill", "white");
            type.setAttribute("squareState","0");

 //0,1,2 are type boxes on the first row
            if(numType == 0 || numType == 1 || numType == 2){ 
            type.setAttribute("transform", ["translate(" + ((numType) * size/3 + numType + 2),2 + ")"]); //moves individual type square
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
                drawLine((numType+1)*size/3 + (0.5*(numType+1))+3,0,(numType+1)*size/3+(0.5*(numType+1))+3,size/3,yearBox,'orange',0,0,5);
              
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
              type.setAttribute("transform", ["translate(" + ((numType-3) * size/3 + (numType-3) + 2),size/3 + 2 + 2 + ")"]);
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
          drawLine((numType-2)*size/3+(0.5*(numType-2))+3,size/3,(numType-2)*size/3+(0.5*(numType-2))+3,2*size/3,yearBox,'orange',0,0,5);
               
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
                drawLine((numType-5)*size/3+(0.5*(numType-5))+3,2*size/3,(numType-5)*size/3+(0.5*(numType-5))+3,3*size/3+3,yearBox,'orange',0,0,5);
                
                if(currYearID.between(41,51))
                  drawLine((numType-6) * size/3 + (numType-6),3*size/3+3+3,(numType-6) * size/3 + (numType-6)+size/3+1,3*size/3+3+3,yearBox,'orange',0,0,5); //bottom thick orange
                
                type.setAttribute("transform", ["translate(" + ((numType-6) * (size/3) + (numType-6)+2),2*(size/3) + 3 + 2 +")"]);
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
  function fillChart1(dataArr){
    dataArr.forEach(function (element, index, array){
        var typeRect = document.getElementById('comparetype' + element.eventType + 'compareyear' + (+element.year % 100 - 1))
        if(typeRect.getAttribute('fill') != 'white'){
          //if a rectangle is present, draw a triangle over it
          var w = typeRect.getAttribute('width');
          var t = typeRect.getAttribute('transform');
          var pts = "0," + 14 + " " + 14 + ",0" + " " + 14 + "," + 14; //create a string of the triangle's coordinates //4

          var triangle = document.createSvg("polygon");

          triangle.setAttribute("id", "comparetri"+typeRect.getAttribute("id")); //give id, format is "tritype#year#"
          triangle.setAttribute("points", pts); //specify coordinates
          triangle.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated
          triangle.setAttribute('fill', element.color); //change color
         
          typeRect.parentNode.appendChild(triangle);
        }
        else
            typeRect.setAttribute('fill', element.color);
            typeRect.setAttribute('stroke', element.color);
            if (typeRect.getAttribute('fill') != typeRect.getAttribute('stroke')){
                typeRect.setAttribute('stroke', typeRect.getAttribute('fill'));
                                      }
    })
  }

/*function to display internal data*/
  function showData(dataArr){
    var oldTriType ='';
    dataArr.forEach(function (element, index, array){
        var typeRect = document.getElementById('comparetype' + element.eventType + 'compareyear' + (+element.year % 100 - 1))
        var triType = document.getElementById('comparetri' + typeRect.getAttribute('id'));
        var color = element.color;
        var country = element.country; //TODO: use map of country to color
        var id ="";
        if((triType != null) && (triType.getAttribute('id') == oldTriType)){
          //if the triangle event exists AND we know it's actually the triangle, not the underlying rect
          id = "tri"+typeRect.getAttribute("id");
        }
        else
          id = 'comparetype' + element.eventType + 'compareyear' + (+element.year % 100 - 1);
        if(triType != null)
          oldTriType = triType.getAttribute('id'); //store the previous triangle event so when it comes around again, we know it's really the second of the two events. The first one should be labeled w/o 'tri'
        
        //console.log(id);
        var dataEntry = country + ', ' +color + ', ' + id.replace(/compare/g,"");
        var dataList = document.getElementById("internalData").innerHTML;
        document.getElementById('internalData').innerHTML = dataList + '<li>' + dataEntry + '</li>';
    })
  }

  function drawTimeline() {
    var margin= {top:60, bottom:20, right:25, left:15};

    document.getElementById("timelineCompare").innerHTML = ""; //clear out any previous timeline
    
    var dataArr = generateEventDataArray(10,0);

    //object with key as year and value as the number of events during that year
    var yearsMap = {};

    var canvas = d3.select('#timelineCompare').append('svg')
              .attr("width",document.getElementById("timelineCompare").offsetWidth); //current width of the timelineContainer div
    
    var timeline = canvas.append('g')
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scale.linear()
                  .domain([0, 99])
                  .range([0,document.getElementById("timelineCompare").offsetWidth - margin.right])

    var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom")
                  .ticks(100)
                  .tickFormat(function(d) { //dont display text unless it's an even decade
                    if((d % 10) != 0){ 
                        return ("");
                    }else{ 
                        return (d + 1500); //the 1600 would be user input start century
                    }});

    var xGuide = canvas.append('g')
                  .attr("transform", "translate(" + margin.left + "," + (margin.top + margin.bottom) + ")")
                  .attr("class","axis")
                  .style("stroke-width",2)
                  .call(xAxis);

    d3.selectAll("g.axis g.tick") //g.tick is the value of the tick
      .style("stroke-width", function(d,i){
        if(i%10 === 0)
          return 2;
        else
          return 1;
      });

      d3.selectAll("g.axis g.tick line") //g.tick line is the actual tick mark
      .attr("y2", function(d,i){
        if(i%10 === 0)
          return 10;
        else
          return 5;
      });

    timeline.selectAll("rect")
      .data(dataArr)
      .enter()
      .append("rect")
      .attr("x",function(d){return (xScale(+d.year)-3)})
      .attr("y", function(d){ //prevent overlapping rectangles by keeping track of how many events occur each year
        if(yearsMap[d.year] == null)
            yearsMap[d.year] = 1;
        else 
            yearsMap[d.year] = +yearsMap[d.year] + 1;
        return (19 - 7*yearsMap[d.year] - yearsMap[d.year])})
      .attr("width", 7)
      .attr("height", 7)
      .attr("fill", function(d){return d.color})
      .on("mouseover",function(d){ //show and hide tooltip of event label
              document.getElementById(d.text + d.year).style.visibility = "visible";
              console.log(document.getElementById(d.text + d.year));
      })
      .on("mouseout", function(d){
        document.getElementById(d.text + d.year).style.visibility ="hidden";
      });

    timeline.selectAll("text") 
      .data(dataArr)
      .enter()
      .append("text")
      .text(function(d){return d.text})
      .style("visibility", "hidden")
      .attr("x",d3.mouse(this)[0]) //TODO: figure out correct placement
      .attr("y",d3.mouse(this)[1])
      .attr("class","textLabels")
      .attr("id", function(d){return d.text + d.year}) //allows text elements to be accessible by their corresponding rect
      .style("visibility", "hidden");
  };

  /*this function pulls events from a chart and returns as an array of objects*/
   function generateEventDataArray(boxesPerSide, yearID){ 
    var timelineDataPts = []; //array of points to be plotted on the timeline
      for(var i = 0; i < boxesPerSide; i++) {
        for(var j = 0; j < boxesPerSide; j++) {
          //document.getElementById("timeline").innerHTML = document.getElementById("timeline").innerHTML + yearID + "<br>"; //label for the year in which the events took place
          for(var numType = 0; numType < 9; numType++){ //check each square for a fill
            var typeSquare = document.getElementById("comparetype" + numType + "compareyear" + yearID);
            var triangle = document.getElementById("comparetricomparetype" + numType + "compareyear" + yearID); //the triangle occupying the type square. could be null
            //for number of colors
            for(var numClr = 1; numClr <= numColors; numClr++){ //check which color the fill is
              if(triangle != null){
                if(triangle.getAttribute("fill") == arrayColors[numClr-1])
                {
                  var country = countryNames[numClr-1];
                  //9 if else statements for type of event. to avoid: would be nice to have an added attribute during makeGrid that is eventName
                   if(numType == 0){
                    //add data point object: year, color, text
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Beginning of war"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Beginning of war <br>"; //using the color as a key, gets the corresponding country value from countries
                   }
                   else if(numType == 1){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Conquest, annexation, or union"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Conquest, annexation, or union <br>"; 
                   }
                   else if(numType == 2){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Loss or disaster"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Loss or disaster <br>";
                   }
                   else if(numType == 3){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Fall of state"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Fall of state <br>";
                   }
                   else if(numType == 4){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Foundation or revolution"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Foundation or revolution <br>";
                   }
                   else if(numType == 5){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Treaty or sundry"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Treaty or sundry <br>";
                   }
                   else if(numType == 6){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Birth of remarkable individual"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Birth of remarkable individual <br>";
                   }
                   else if(numType == 7){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Deed"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Deed <br>"; 
                   }
                   else if(numType == 8){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Death of remarkable individual"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Death of remarkable individual <br>";
                   }
                } //end if triangle.getAttr
              } //end if triangle != null
              if(typeSquare.getAttribute("fill") == arrayColors[numClr-1])
                {
                  var country = countryNames[numClr-1];
                  //9 if else statements for type of event. to avoid: would be nice to have an added attribute during makeGrid that is eventName
                   if(numType == 0){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Beginning of war"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Beginning of war <br>"; //using the color as a key, gets the corresponding country value from countries
                   }
                   if(numType == 1){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Conquest, annexation, or union"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Conquest, annexation, or union <br>"; 
                   }
                   if(numType == 2){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Loss or disaster"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Loss or disaster <br>";
                   }
                   if(numType == 3){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Fall of state"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Fall of state <br>";
                   }
                   if(numType == 4){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Foundation or revolution"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Foundation or revolution <br>";
                   }
                   if(numType == 5){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Treaty or sundry"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Treaty or sundry <br>";
                   }
                   if(numType == 6){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Birth of remarkable individual"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Birth of remarkable individual <br>";
                   }
                   if(numType == 7){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Deed"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Deed <br>"; 
                   }
                   if(numType == 8){
                    timelineDataPts.push({year: yearID, color: arrayColors[numClr-1], text: country + ": Death of remarkable individual"});
                    //document.getElementById("timeline").innerHTML =  document.getElementById("timeline").innerHTML + country + ": Death of remarkable individual <br>";
                   }
                } //end if typeSquare
            } //end for numClr
          } //end for numType
          yearID = yearID + 1;
        }
      }
      return timelineDataPts;
  };
    
function fillEventList1(dataArr){
    dataArr.forEach(function (e, i, a){
      var eventLi = document.getElementById('viewtype'+e.eventType+'text'+parseInt((e.year%100)-1));
        console.log(eventLi);
      var eventList = document.getElementById("compareList").innerHTML; 
      if(eventLi == null)                     //this math sets list element's id equal to type#text+year, e.g. type0text0
        document.getElementById('compareList').innerHTML = eventList + '<li id= viewtype'+e.eventType + 'text'+parseInt((e.year%100)-1) + '>' + e.text + '</li>';
      else //else, the event is a triangle
        document.getElementById('compareList').innerHTML = eventList + '<li id= viewtritype'+e.eventType + 'text'+parseInt((e.year%100)-1) + '>' + e.text + '</li>';
    })
  }
    
    function highlightItem(element){ //element is either text in list or typesquare or tritype 
    var id = element.getAttribute("id");
        //console.log(id);
    
    var offsets = null;

    if(id != null){
      if(id.includes("text")){ //if hovering over text
        element.setAttribute("class","highlight");
          console.log(id);
        //the text's id type#text# turns to a square's id type#year#
          var id1 = id.replace('viewtri', 'compare');
        var typeSquare = document.getElementById(id1.replace('text','compareyear'));
        if(typeSquare != null)
          typeSquare.setAttribute("class","highlightSquare");
        offsets = $('#'+id.replace('text','compareyear')).offset(); //have to use jquery to use its offset() method which accounts for scrolling offsets
      }
      else if(id.includes("year") && id.includes('type') && element.getAttribute('fill') != 'white'){ 
          console.log("should highlight");//if hovering over rect or tritype
          console.log(id);
        element.setAttribute("class","highlightSquare"); 
          var text1 = id.replace('comparetype', 'viewtritype');
        var text = document.getElementById(text1.replace('compareyear','text'))
        console.log(text);
        if(text != null)
          text.setAttribute("class","highlight");
        offsets = $('#'+id.replace('compareyear','text')).offset();
      }
  }
  }


  function removeHighlight(element){ 
    var id = element.getAttribute("id");
    if(id != null)
    {
      if(id.includes("text")){ //if hovering over text
          console.log('remove');
        element.removeAttribute("class","highlight"); 
        //type#text# turns to type#year# for the squares
          var id1 = id.replace('viewtri', 'compare');
        if(document.getElementById(id1.replace('text','compareyear')) != null)
          document.getElementById(id1.replace('text','compareyear')).removeAttribute("class","highlightSquare");      
      }
      else if(id.includes("year")){ //if hovering over rect or tritype
        element.removeAttribute("class","highlightSquare");
          var text1 = id.replace('comparetype', 'viewtritype');
        if(document.getElementById(text1.replace('compareyear','text')) != null) //if there exists a corresponding event
          document.getElementById(text1.replace('compareyear','text')).removeAttribute("class","highlight");
      }
   }
  }

  //event listener for hovering over a list element
  $('ol').on('mouseover', 'li', function(e){
          highlightItem(e.target);
    })

  $('ol').on('mouseout', 'li', function(e){
          removeHighlight(e.target);
    })

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