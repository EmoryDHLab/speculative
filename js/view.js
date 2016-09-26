  // function highlightItem(element){ //element is either text in list or typesquare or tritype
  //   var id = element.getAttribute("id");
  //     console.log(id);
  //   var offsets = null;

  //   if(id != null){
  //     // if(id.includes("text")){ //if hovering over text
  //     //   element.setAttribute("class","highlight");
  //     //   //the text's id type#text# turns to a square's id type#year#
  //     //   var typeSquare = document.getElementById(id.replace('text','viewyear'));
  //     //   if(typeSquare != null)
  //     //     typeSquare.setAttribute("class","highlightSquare");
  //     //   offsets = $('#'+id.replace('text','viewyear')).offset(); //have to use jquery to use its offset() method which accounts for scrolling offsets
  //     // }
  //     // else if(id.includes("year") && id.includes('type') && element.getAttribute('fill') != 'white'){ //if hovering over rect or tritype
  //     //   element.setAttribute("class","highlightSquare");
  //     //   var text = document.getElementById(id.replace('viewyear','text'))
  //     //   if(text != null)
  //     //     text.setAttribute("class","highlight");
  //     //   offsets = $('#'+id.replace('viewyear','text')).offset();
  //     // }
  //     if(id.includes("text")){
  //       console.log("hovering over text");
  //       element.setAttribute("class", "highlight");
  //       var typeSquare = document.getElementById(id.replace('text','viewyear'));
  //       typeSquare.setAttribute("class","highlightSquare");
  //     } else {
  //       console.log("hovering over square");
  //       element.setAttribute("class", "highlightSquare");
  //       var typeText = document.getElementById(id.replace('viewyear', 'text'));
  //       typeText.setAttribute("class", "highlight");
  //     }

  // }

  //   //TODO: draw line connecting the two elements
  //   // var aLine = document.createSvg('line');

  //   // aLine.setAttribute('x1', offsets.left-60);
  //   // aLine.setAttribute('y1', offsets.top-120);
  //   // aLine.setAttribute('x2', $('#'+element.getAttribute("id")).offset().left-60);
  //   // aLine.setAttribute('y2', $('#'+element.getAttribute("id")).offset().top-120);

  //   // aLine.setAttribute('stroke', 'black');
  //   // aLine.setAttribute('stroke-width', '1');
  //   // aLine.setAttribute('stroke-dasharray',"10,10");
  //   // aLine.setAttribute('id', 'viewaLine');
  //   //add line to page
  //   //document.getElementById('viewmaing').appendChild(aLine);
  // }

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

		/*populate chart*/
    fillChart(d);

    /*populate event list*/
    fillEventList(d);

	})

<<<<<<< HEAD
var makeGrid = function(boxesPerSide, size, pixelsPerSide, currYearID){ //TODO: handle edge cases for specific yearboxes

  var noLeftOrange = [1,11,21,31,41,51,61,71,81,91];
  var orangeOnLft = [6,16,26,36,46,56,66,76,86,96];
  var orangeOnBtm = [51,52,53,54,55,56,57,58,59,60];
  var orangeOnRt = [5,15,25,35,45,55,65,75,85,95];
    //whole svg
    var svg = document.createSvg("svg");
    svg.setAttribute("id","viewsvg");
    svg.setAttribute("width", 522); //hard coded for now
    svg.setAttribute("height", 522);

    //group for everything: background, years, types. so when "maing" is translated, everything moves as a unit
    maing = document.createSvg("g");
    maing.setAttribute("id", "viewmaing");
    maing.setAttribute("width", pixelsPerSide + size/3);
    maing.setAttribute("height", pixelsPerSide + size/3);

    //"physical" bg element, this goes on top of "maing", a little redundant but think of it as the physical object in the container
    // var bg = document.createSvg("rect");
    // var sizeBG = (pixelsPerSide);
    // bg.setAttribute("id","viewbg");
    // bg.setAttribute("width", sizeBG + size/3);
    // bg.setAttribute("height", sizeBG + size/3);
    // bg.setAttribute("fill","white");
    // bg.setAttribute("fill-opacity",".1");

     //the bg belong to the maing
   // maing.appendChild(bg);

    //append maing to svg
    svg.appendChild(maing);

    for(var i = 0; i < boxesPerSide; i++) {
        for(var j = 0; j < boxesPerSide; j++) {
          var numYear = boxesPerSide * i + j; //which number year box we're on
          var yearBox = document.createSvg("g");
            yearBox.setAttribute("width", size);
            yearBox.setAttribute("height", size);
            yearBox.setAttribute("id", "viewyear" + currYearID);
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
            type.setAttribute("id", "viewtype" + numType + type.parentNode.getAttribute("id")); //each type square has an ID according to its type: 0-8 AND ALSO ITS YEAR (otherwise it wont be unique)
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
=======
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
>>>>>>> 1ee37248322fc82b609fced897f192d0afde8c7f
              }
              if(i>4){
                  currEvtY+=18;
              }
<<<<<<< HEAD
        if(numType == 5 && (orangeOnRt.includes(currYearID)))//thick orange on right
          drawLine((numType-2)*size/3+(0.5*(numType-2))+3,size/3,(numType-2)*size/3+(0.5*(numType-2))+3,2*size/3,yearBox,'orange',0,0,5);

              drawLine((numType-3) * size/3 + (numType-3),size/3+2.5+size/3,(numType-3) * size/3 + (numType-3)+size/3,size/3+2.5+size/3,yearBox,'black',2,2,0.5); //dotted line 1px below the bottom of type square
=======
              var typeBox = drawRect(currEvtX,currEvtY,eventSize,eventSize);
              //any style or attribute applied to a year will filter to the types that make it up
              yearGroup.appendChild(typeBox);
              typeBox.setAttribute("class","viewSquare"); //class for all type squares
              typeBox.setAttribute("id", "viewtype" + numType + typeBox.parentNode.getAttribute("id")); //each type square has an ID according to its type: 0-8 AND ALSO ITS YEAR (otherwise it wont be unique)
              typeBox.setAttribute("fill", "white");
              typeBox.setAttribute("squareState","0");
              //0,1,2 are type boxes on the first row
>>>>>>> 1ee37248322fc82b609fced897f192d0afde8c7f
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
<<<<<<< HEAD
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
=======
              topG.appendChild(drawLine(gControl.x,gControl.y+yrPos,gControl.x+size+gControl.offset,gControl.y+yrPos,thickness,clr));
              topG.appendChild(drawLine(gControl.x+yrPos,gControl.y,gControl.x+yrPos,gControl.y+size+gControl.offset,thickness,clr));
            }else{
                yrPos+=9;
            }
>>>>>>> 1ee37248322fc82b609fced897f192d0afde8c7f
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

<<<<<<< HEAD
  //   if(id != null){
  //     if(id.includes("text")){ //if hovering over text
  //       element.setAttribute("class","highlight");
  //       //the text's id type#text# turns to a square's id type#year#
  //       var typeSquare = document.getElementById(id.replace('text','viewyear'));
  //       if(typeSquare != null)
  //         typeSquare.setAttribute("class","highlightSquare");
  //       offsets = $('#'+id.replace('text','viewyear')).offset(); //have to use jquery to use its offset() method which accounts for scrolling offsets
  //     }
  //     else if(id.includes("year") && id.includes('type') && element.getAttribute('fill') != 'white'){ //if hovering over rect or tritype
  //       element.setAttribute("class","highlightSquare");
  //       var text = document.getElementById(id.replace('viewyear','text'))
  //       if(text != null)
  //         text.setAttribute("class","highlight");
  //       offsets = $('#'+id.replace('viewyear','text')).offset();
  //     }
  // }

        if(id.includes("text")){
        console.log("hovering over text");
        element.setAttribute("class", "highlight");
        var typeSquare = document.getElementById(id.replace('text','viewyear'));
        typeSquare.setAttribute("class","highlightSquare");
      } else {
        console.log("hovering over square");
        element.setAttribute("class", "highlightSquare");
        var typeText = document.getElementById(id.replace('viewyear', 'text'));
        typeText ? typeText.setAttribute("class", "highlight") : null;
      }
=======
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
>>>>>>> 1ee37248322fc82b609fced897f192d0afde8c7f

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
