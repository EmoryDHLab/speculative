$(document).ready(function() {

document.createSvg = function(tagName) {
        var svgNS = "http://www.w3.org/2000/svg";
        return this.createElementNS(svgNS, tagName);
  	};

  	Number.prototype.between = function (min, max) {
    return this >= min && this < max;
    };


	d3.csv('peabodyData.csv', function(d){
		var container = document.getElementById("viewGrid");
		container.appendChild(makeGrid(480, 1)); //makes four 5x5 quadrant with boxes 30 px wide
    makeTypeSvg();
		/*populate chart*/
    fillChart(d);

    /*populate event list*/
    fillEventList(d);

	})

  var makeTypeSvg = function(){
    function gridData(){
      var data = new Array();
      var width = 30;
      var height = 30;
      var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
      var ypos = 1;
      var i = 1;

      for (var row = 0; row < 3; row++){
         data.push( new Array() );
         for (var column = 0; column < 3; column++) {
           data[row].push({
                    x: xpos,
                    y: ypos,
                    width: width,
                    height: height,
                    number: i
                })
            xpos += width;
            i++;
        }
                // reset the x position after a row is complete
          xpos = 1;
          // increment the y position for the next row. Move it down 50 (height variable)
          ypos += height;


      }
      return data;
    }
      var gridData = gridData();

      var grid = d3.select("div#typeGrid")
    .append("svg")
    .attr("width","100px")
    .attr("height","100px");

    var row = grid.selectAll(".row")
  .data(gridData)
  .enter().append("g")
  .attr("class", "row");

var column = row.selectAll(".square")
  .data(function(d) { return d; })
  .enter().append("rect")
  .attr("class","square")
  .attr("x", function(d) { return d.x; })
  .attr("y", function(d) { return d.y; })
  .attr("width", function(d) { return d.width; })
  .attr("height", function(d) { return d.height; })
  .style("fill", "#fff")
  .style("stroke", "#222")
  // .text(function(d) { return d.number.toString(); });

  column.append("text")
    .attr("x", function(d){return d.x +2})
    .attr("y", function(d){return d.x +2})
    .attr("dy", ".35em")
    .text(function(d) { return d.number; });


    // var row = grid.selectAll(".row")
    // .data(gridData)
    // .enter().append("g")
    // .attr("class", "row");

    // var column = row.selectAll(".square")
    // .data(function(d) { return d; })
    // .enter().append("rect")
    // .attr("class","square")
    // .attr("x", function(d) { return d.x; })
    // .attr("y", function(d) { return d.y; })
    // .attr("width", function(d) { return d.width; })
    // .attr("height", function(d) { return d.height; })
    // .style("fill", "#fff")
    // .style("stroke", "#222");

  }



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
      maing.setAttribute("id", "viewmaing");
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
            yearGroup.setAttribute("id", "viewyear" + (currYearID-1));
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
              typeBox.setAttribute("class","viewSquare"); //class for all type squares
              typeBox.setAttribute("id", "viewtype" + numType + typeBox.parentNode.getAttribute("id")); //each type square has an ID according to its type: 0-8 AND ALSO ITS YEAR (otherwise it wont be unique)
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
  function fillChart(dataArr){
    dataArr.forEach(function (element, index, array){
        var typeRect = document.getElementById('viewtype' + element.eventType + 'viewyear' + (element.year % 100 - 1))
        if(typeRect.getAttribute('fill') != 'white'){
          //if a rectangle is present, draw a triangle over it
          var w = typeRect.getAttribute('width');
          var t = typeRect.getAttribute('transform');
          var pts = "0," + 14 + " " + 14 + ",0" + " " + 14 + "," + 14; //create a string of the triangle's coordinates //4

          var triangle = document.createSvg("polygon");

          triangle.setAttribute("id", "viewtri"+typeRect.getAttribute("id")); //give id, format is "tritype#year#"
          triangle.setAttribute("points", pts); //specify coordinates
          triangle.setAttribute("transform", t); //translate the triangle by the same amount that the typerect has been translated

          triangle.setAttribute('fill', element.color); //change color

          typeRect.parentNode.appendChild(triangle);
          typeRect.setAttribute('stroke', "black");

        }
        else
            //var colorc = element.color;
            typeRect.setAttribute('fill', element.color);
            typeRect.setAttribute('stroke', element.color);
            if (typeRect.getAttribute('fill') != typeRect.getAttribute('stroke')){
                typeRect.setAttribute('stroke', typeRect.getAttribute('fill'));
                                      }
    })
  }

  /*creates a list of events based on a "text" attribute of objects in an array*/
  function fillEventList(dataArr){
    dataArr.forEach(function (e, i, a){
      var eventLi = document.getElementById('viewtype'+e.eventType+'text'+parseInt((e.year%100)-1));
      var eventList = document.getElementById("sampleList").innerHTML;
      if(eventLi == null)                     //this math sets list element's id equal to type#text+year, e.g. type0text0
        document.getElementById('sampleList').innerHTML = eventList + '<li id= viewtype'+e.eventType + 'text'+parseInt((e.year%100)-1) + '>' + e.text + '</li>';
      else //else, the event is a triangle
        document.getElementById('sampleList').innerHTML = eventList + '<li id= viewtritype'+e.eventType + 'text'+parseInt((e.year%100)-1) + '>' + e.text + '</li>';
    })
  }

  function highlightItem(element){ //element is either text in list or typesquare or tritype
    var id = element.getAttribute("id");
      console.log(id);
    var offsets = null;

    if(id != null){
      if(id.includes("text")){ //if hovering over text
        element.setAttribute("class","highlight");
        //the text's id type#text# turns to a square's id type#year#
        var typeSquare = document.getElementById(id.replace('text','viewyear'));
        console.log(typeSquare)
        if(typeSquare != null)
          typeSquare.setAttribute("class","highlightSquare");
        offsets = $('#'+id.replace('text','viewyear')).offset(); //have to use jquery to use its offset() method which accounts for scrolling offsets
      }
      else if(id.includes("year") && id.includes('type') && element.getAttribute('fill') != 'white'){ //if hovering over rect or tritype
        element.setAttribute("class","highlightSquare");
        var text = document.getElementById(id.replace('viewyear','text'))
        if(text != null)
          text.setAttribute("class","highlight");
        offsets = $('#'+id.replace('viewyear','text')).offset();
      }
    }

    //TODO: draw line connecting the two elements
    // var aLine = document.createSvg('line');

    // aLine.setAttribute('x1', offsets.left-60);
    // aLine.setAttribute('y1', offsets.top-120);
    // aLine.setAttribute('x2', $('#'+element.getAttribute("id")).offset().left-60);
    // aLine.setAttribute('y2', $('#'+element.getAttribute("id")).offset().top-120);

    // aLine.setAttribute('stroke', 'black');
    // aLine.setAttribute('stroke-width', '1');
    // aLine.setAttribute('stroke-dasharray',"10,10");
    // aLine.setAttribute('id', 'viewaLine');
    //add line to page
    //document.getElementById('viewmaing').appendChild(aLine);
      var type = document.getElementById("type" + /\d+/g.exec(id));

      type ? type.setAttribute("class", "highlight"): null;
  }


  function removeHighlight(element){
    var id = element.getAttribute("id");
    if(id != null)
    {
      if(id.includes("text")){ //if hovering over text
        element.removeAttribute("class","highlight");
        //type#text# turns to type#year# for the squares
        if(document.getElementById(id.replace('text','viewyear')) != null)
          document.getElementById(id.replace('text','viewyear')).removeAttribute("class","highlightSquare");
      }
      else if(id.includes("year")){ //if hovering over rect or tritype
        element.removeAttribute("class","highlightSquare");
        if(document.getElementById(id.replace('viewyear','text')) != null) //if there exists a corresponding event
          document.getElementById(id.replace('viewyear','text')).removeAttribute("class","highlight");
      }
   }

      var type = document.getElementById("type" + /\d+/g.exec(id));

      type ? type.removeAttribute("class", "highlight"): null;

  }

  //This function finds all squares horiz and vert of given square
  function getHorizVert(element){
    //get the id of the element
    var id= element.getAttribute("id");
    //Check id is valid, if not, stop this
    if(id==null){
      return
    }
    // are we hovering over a list element or a rect?
    if(id.includes("text")){ //list
      console.log("list element")

      //get the year of the element
      year=parseInt(id.substring(13))
      console.log(year)
    }else if (id.includes("year")) {//rect
      //get the year of the element
      year=parseInt(id.substring(17))
    }else{
      console.log("What are you hovering over??");
      return
    }
    //get the type of the element
    var tp=parseInt(id.charAt(8))
    console.log(tp)
    var hYears=[];
    var vYears=[];
    var ones=parseInt(year) %10

    console.log("Tens: ")
    var tens=Math.floor(parseInt(year)/10)
    //find years
    for (i = 0; i < 10; i++) { //one loop used for ones and tens.
        vYears.push((i*10)+ones)//for all vertical
        if(!(i==ones & i==tens))
        hYears.push((tens*10)+i)//for all horizontal
    }
    console.log(hYears)
    console.log(vYears)
    //find types
    var vTypes=[]
    var hTypes=[]
    if (tp>=0 && tp<3){
      hTypes=[0,1,2]
    }else if(tp>2 && tp<6){
      hTypes=[3,4,5]
    }else if(tp>5 && tp<9){
      hTypes=[6,7,8]
    }else{
      console.log("Type Error in crosshair")
    }
    if(tp==0 || tp==3 || tp==6){
      vTypes=[0,3,6]
    }else if (tp==1 || tp==4 || tp==7) {
      vTypes=[1,4,7]
    }else if (tp==2 || tp==5 || tp==8) {
      vTypes=[2,5,8]
    }else {
      console.log("Type Error in crosshair")
    }

    // all ids
    ids=[]
      for(h of hYears){//for each year I need to go through
        for(t of hTypes){//for each horizontal w/in that year
          if(!(h==year && t==tp)){
            ids.push("viewtype"+t.toString()+"viewyear"+h.toString())
          }
        }
      }
      for(v of vYears){//for each year I need to go through
        for(t of vTypes){//for each vertical w/in said that
          if(!(v==year && t==tp)){
            ids.push("viewtype"+t.toString()+"viewyear"+v.toString())
          }
        }
      }
    console.log(ids)
    return ids
  }

  function addCrosshair(ids){
    for(id of ids){
      console.log(id)
      document.getElementById("#"+id).class="crosshair";
    }
  }
  function removeCrosshair(){
    $('.crosshair').removeClass('crosshair');
  }


  //event listener for hovering over a list element
  $('ol').on('mouseover', 'li', function(e){
        highlightItem(e.target);
        //  ids=getHorizVert(e.target);
        //  addCrosshair(ids);

    })

  $('ol').on('mouseout', 'li', function(e){
          removeHighlight(e.target);
          //removeCrosshair();
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
