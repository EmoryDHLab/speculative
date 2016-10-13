$(document).ready(function() {
  //event listener for hovering over a list element
  $('ol').on('mouseover', function(e){
          console.log(e.target);
          highlightItem(e.target);
    })

  $('body').on('mouseover','rect', function(e){
        console.log(e.target);
        highlightItem(e.target);
  })

  $('ol').on('mouseout', function(e){
          removeHighlight(e.target);
    })

  $('body').on('mouseout','rect', function(e){
      console.log(e.target);
      removeHighlight(e.target);
  })


document.createSvg = function(tagName) {
        var svgNS = "http://www.w3.org/2000/svg";
        return this.createElementNS(svgNS, tagName);
  	};

  	Number.prototype.between = function (min, max) {
    return this >= min && this < max;
    };


	d3.csv('peabodyData.csv', function(d){
		var container = document.getElementById("compareGrid");
		container.appendChild(makeGrid(480,1)); //makes four 5x5 quadrant with boxes 30 px wide

    console.log("made it makeGrid");
		/*populate chart*/
    fillChart1(d);

    console.log("made it fillChart");

    fillEventList1(d);

    showData(d);

    drawTimeline(d);



	})

var arrayColors = ["#8D2B1D", "#325B67", "#458867"];
var countryNames = ["England", "Spain", "France"];
var numColors = countryNames.length;

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
    maing.setAttribute("id", "comparemaing");
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
          yearGroup.setAttribute("id", "compareyear" + (currYearID));
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
            typeBox.setAttribute("class","compareSquare"); //class for all type squares
            typeBox.setAttribute("id", "comparetype" + numType + typeBox.parentNode.getAttribute("id")); //each type square has an ID according to its type: 0-8 AND ALSO ITS YEAR (otherwise it wont be unique)
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
  function fillChart1(dataArr){
    dataArr.forEach(function (element, index, array){
        console.log(element);
        var typeRect = document.getElementById('comparetype' + element.eventType + 'compareyear' + (element.year % 100 ))
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
        var typeRect = document.getElementById('comparetype' + element.eventType + 'compareyear' + (element.year % 100 ))
        console.log("test");
        var triType = document.getElementById('comparetri' + typeRect.getAttribute('id'));
        var color = element.color;
        var country = element.country; //TODO: use map of country to color
        var id ="";
        if((triType != null) && (triType.getAttribute('id') == oldTriType)){
          //if the triangle event exists AND we know it's actually the triangle, not the underlying rect
          id = "tri"+typeRect.getAttribute("id");
        }
        else
          id = 'comparetype' + element.eventType + 'compareyear' + (+element.year % 100);
        if(triType != null)
          oldTriType = triType.getAttribute('id'); //store the previous triangle event so when it comes around again, we know it's really the second of the two events. The first one should be labeled w/o 'tri'

        var dataEntry = country + ', ' +color + ', ' + id.replace(/compare/g,"");
        var dataList = document.getElementById("internalData").innerHTML;
        document.getElementById('internalData').innerHTML = dataList + '<li id=' +id.replace(/compare/g,"data") +'>' + dataEntry + '</li>';
    })
  }

  function drawTimeline(d) {
    var margin= {top:60, bottom:20, right:25, left:15};

    document.getElementById("timelineCompare").innerHTML = ""; //clear out any previous timeline

    var dataArr = [];

    d.forEach(function(element){
      dataArr.push({year:element.year.substring(2), color: element.color, text: element.text, type: element.eventType});
    })


    console.log("dataArr: " + JSON.stringify(dataArr));

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
      .attr("id",function(d){return "timelinetype"+d.type+"timelineyear"+d.year})
      .attr("class","timelineRect")

timeline.selectAll("rect").addEventListener( //event listener for hover
            "mouseover",
            function(e){
              console.log("REACHED")
                    highlightItem(e.target); //e.target is the rect object, where id="type#year#" and class="typeSquare"
            },
             false);
            timeline.selectAll("rect").addEventListener( //event listener for hover
              'mouseout',
              function(e){
                removeHighlight(e.target);
              },
              false);

    timeline.selectAll("text")
      .data(dataArr)
      .enter()
      .append("text")
      .text(function(d){return d.text})
      .style("visibility", "hidden")
      .attr("x",d3.mouse(this)[0]) //TODO: figure out correct placement
      .attr("y",d3.mouse(this)[1])
      .attr("class","textLabels")
      .attr("id", function(d){return "timelinetype"+d.type+"timelineyear"+ d.year}) //allows text elements to be accessible by their corresponding rect
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
      var eventLi = document.getElementById('viewtype'+e.eventType+'text'+parseInt((e.year%100)));
        console.log(eventLi);
      var eventList = document.getElementById("compareList").innerHTML;
      if(eventLi == null)                     //this math sets list element's id equal to type#text+year, e.g. type0text0
        document.getElementById('compareList').innerHTML = eventList + '<li id= viewtype'+e.eventType + 'text'+parseInt((e.year%100)) + '>' + e.text + '</li>';
      else //else, the event is a triangle
        document.getElementById('compareList').innerHTML = eventList + '<li id= viewtritype'+e.eventType + 'text'+parseInt((e.year%100)) + '>' + e.text + '</li>';
    })
  }

    function highlightItem(element){ //element is either text in list or typesquare or tritype
    var id = element.getAttribute("id");

    var offsets = null;

    if(id != null){

      if(id.includes("text")){ //if hovering over text
        console.log("text el reached")
        highlightCorrForText(id);
        //offsets = $('#'+id.replace('text','compareyear')).offset(); //have to use jquery to use its offset() method which accounts for scrolling offsets
      }
      else if (id.includes("data")){
        console.log("data el reached")
        highlightCorrForData(id);
        // offsets = $('#'+id.replace('compareyear','text')).offset()
      }
      else if(id.includes("timeline") && element.getAttribute('fill') != 'white'){
        console.log("time el reached");
        highlightCorrForTimeline(id);
      }

      else if(id.includes("year") && id.includes('type') && element.getAttribute('fill') != '#F3F3F3'){
        console.log("square el reached")
        highlightCorrForSquare(id);
        // offsets = $('#'+id.replace('compareyear','text')).offset();
      }

  }

    function highlightCorrForSquare(id){
      document.getElementById(id).setAttribute("class", "highlightSquare")
      var text = document.getElementById(id.replace('comparetype','viewtype').replace('compareyear','text'));
      var data = document.getElementById(id.replace('comparetype','datatype').replace('compareyear','datayear'))
      text ? text.setAttribute("class", "highlight"): null;

      data? data.setAttribute("class", "highlight"): null;

      var timeline = document.getElementById(id.replace("comparetype","timelinetype").replace("compareyear","timelineyear"))
      timeline ? timeline.setAttribute("class","highlightSquare"): null;
    }

    function highlightCorrForText(id){
      document.getElementById(id).setAttribute("class", "highlight");
      document.getElementById(id.replace("viewtype","comparetype").replace('text','compareyear')).setAttribute("class", "highlightSquare");
      document.getElementById(id.replace("viewtype","datatype").replace("text","datayear")).setAttribute("class", "highlight");
      var timeline = document.getElementById(id.replace("viewtype","timelinetype").replace("text","timelineyear"))
      timeline ? timeline.setAttribute("class","highlightSquare"): null;
    }

    function highlightCorrForData(id){
      document.getElementById(id).setAttribute("class", "highlight");
      document.getElementById(id.replace("datatype","comparetype").replace("datayear","compareyear")).setAttribute("class","highlightSquare");
      document.getElementById(id.replace("datatype", "viewtype").replace("datayear","text")).setAttribute("class","highlight")
      var timeline = document.getElementById(id.replace("datatype","timelinetype").replace("datayear","timelineyear"))
      timeline ? timeline.setAttribute("class","highlightSquare"): null;
    }

    function highlightCorrForTimeline(id){
      document.getElementById(id).setAttribute("class", "highlightSquare");
      document.getElementById(id.replace("timelinetype","comparetype").replace("timelineyear","compareyear")).setAttribute("class", "highlightSquare");
      var compare = document.getElementById(id.replace("timelinetype", "viewtype").replace("timelineyear", "text"))
      compare? compare.setAttribute("class", "highlight") : null;
      var data = document.getElementById(id.replace("timelinetype","datatype").replace("timelineyear","datayear"))
      data ? data.setAttribute("class", "highlight") : null;
    }
  }


  function removeHighlight(element){
    var id = element.getAttribute("id");
    if(id != null)
    {
      if(id.includes("text")){ //if hovering over text
        removeHighlightCorrForText(id)
      }
      else if (id.includes("data")){
        removeHighlightCorrForData(id);
       }
      else if(id.includes("timeline") && element.getAttribute('fill') != 'white'){
        console.log("time el reached");
        removeHighlightCorrForTimeline(id);
      }
      else if(id.includes("year") && id.includes('type') && element.getAttribute('fill') != 'white'){ //if hovering over rect or tritype
        removeHighlightCorrForSquare(id);
      }


   }

    function removeHighlightCorrForSquare(id){
      document.getElementById(id).removeAttribute("class", "highlightSquare")
      var text = document.getElementById(id.replace('comparetype','viewtype').replace('compareyear','text'));
      var data = document.getElementById(id.replace('comparetype','datatype').replace('compareyear','datayear'))
      text ? text.removeAttribute("class", "highlight"): null;

      data? data.removeAttribute("class", "highlight"): null;

      var timeline = document.getElementById(id.replace("comparetype","timelinetype").replace("compareyear","timelineyear"))
      timeline ? timeline.removeAttribute("class","highlightSquare"): null;
    }

    function removeHighlightCorrForText(id){
      document.getElementById(id).removeAttribute("class", "highlight");
      document.getElementById(id.replace("viewtype","comparetype").replace('text','compareyear')).removeAttribute("class", "highlightSquare");
      document.getElementById(id.replace("viewtype","datatype").replace("text","datayear")).removeAttribute("class", "highlight");
      var timeline = document.getElementById(id.replace("viewtype","timelinetype").replace("text","timelineyear"))
      timeline ? timeline.removeAttribute("class","highlightSquare"): null;
    }

    function removeHighlightCorrForData(id){
      document.getElementById(id).removeAttribute("class", "highlight");
      document.getElementById(id.replace("datatype","comparetype").replace("datayear","compareyear")).removeAttribute("class","highlightSquare");
      document.getElementById(id.replace("datatype", "viewtype").replace("datayear","text")).removeAttribute("class","highlight")
      var timeline = document.getElementById(id.replace("datatype","timelinetype").replace("datayear","timelineyear"))
      timeline ? timeline.removeAttribute("class","highlightSquare"): null;
    }

    function removeHighlightCorrForTimeline(id){
      document.getElementById(id).removeAttribute("class", "highlightSquare");
      document.getElementById(id.replace("timelinetype","comparetype").replace("timelineyear","compareyear")).removeAttribute("class", "highlightSquare");
      var compare = document.getElementById(id.replace("timelinetype", "viewtype").replace("timelineyear", "text"))
      compare? compare.removeAttribute("class", "highlight") : null;
      var data = document.getElementById(id.replace("timelinetype","datatype").replace("timelineyear","datayear"))
      data ? data.removeAttribute("class", "highlight") : null;
    }
  }

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
