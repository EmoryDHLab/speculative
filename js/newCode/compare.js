var List= function(target="evtList"){
  this.type="list"
  this.eventSet=null;
  this.target=document.getElementById(target);
}
List.prototype.draw = function() {
  for(let evt of this.eventSet.events){
    li=document.createElement("LI");
    setDateAndType(li,evt.year%100,evt.eType);
    li.innerHTML=evt.year+". "+evt.desc;
    this.target.appendChild(li);
  }
};
List.prototype.addEventSet=function(evtSet){
  this.eventSet=evtSet;
}
List.prototype.highlight=function(yr,tp,el){
  if(el.tagName=="LI"){
    el.className+=" highlight";
  }else{
    try{
      this.target.querySelectorAll('[data-date="'+yr+'"][data-type="'+tp+'"]')[0].className+=(" highlight");
    }catch(e){
      return;
    }
  }
}
List.prototype.unhighlight=function(yr,tp,el){
  if(el.tagName!="LI"){
    el=this.target.querySelectorAll('[data-date="'+yr+'"][data-type="'+tp+'"]')[0];
  }
  try{
    if(el.className==undefined){
      el.className="";
      return;
    }
  }catch(e){
    return;
  }
  el.className = el.className.replace( /(?:^|\s)highlight(?!\S)/g , '');// regex to remove class w/o affecting other classes applied
}

List.prototype.reload = function(evtSet) {
  this.eventSet=evtSet;
  while(this.target.firstChild){
    this.target.removeChild(this.target.firstChild);
  }
  this.draw();
};

/*
  Timeline
*/
var Timeline=function(target="timeline"){
  this.target=document.getElementById(target);
  this.type="timeline";
  console.log(this.target);
  this.eventSet=new EventSet();
  this.canvas = d3.select("#"+this.target.id).append('svg')
            .attr("width",this.target.offsetWidth); //current width of the timelineContainer div
  this.eventTypes=[
    "Battle, Siege, or Beginning of War",
    "Conquest, Annexation, or Union",
    "Loss and Disaster",
    "Fall of State",
    "Foundation of State and Revolution",
    "Treaty and Sundry",
    "Birth",
    "Deed",
    "Death, of remarkable individual"
  ];
}

Timeline.prototype.draw=function(){
  var margin= {top:60, bottom:20, right:25, left:15};
  document.getElementById("timeline").innerHTML = "";
  var timeline = this.canvas.append('g')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var xScale = d3.scale.linear()
                .domain([0, 99])
                .range([0,this.target.offsetWidth - margin.right]);
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

  var xGuide = this.canvas.append('g')
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
  var dataArr=[];
  for(let evt of this.eventSet.events){
    dataArr.push({
      year:evt.year%100,
      color:evt.getColors()[0],
      text: evt.getActor() + ": "+this.eventTypes[evt.eType],
      eType:evt.eType
    });
  }
  yearsMap={};
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
    .attr("class","timelinePoint")
    .attr("data-date",function(d){return d.year})
    .attr("data-type",function(d){return d.eType})
    .attr("fill", function(d){return d.color})
    .attr("stroke", getHighlightColor())
    .attr("stroke-width", 0)
    .on("mouseover",function(d){
      console.log(d.color);
      //document.querySelectorAll("[data-clr='"+d.color+"'][data-type='"+d.eType+"'][data-date='"+d.year+"']")[0].setAttribute("style","visibility:visible;")
    })
    .on("mouseout",function(d){
      //document.querySelectorAll("[data-clr='"+d.color+"'][data-type='"+d.eType+"'][data-date='"+d.year+"']")[0].setAttribute("style","visibility:hidden;")
    });

  timeline.selectAll("text")
    .data(dataArr)
    .enter()
    .append("text")
    .text(function(d){return d.text})
    .attr("x",function(d){return xScale(+d.year)})
    .attr("y",5)
    .attr("class","textLabels")
    .attr("data-clr",function(d){return d.color})
    .attr("data-date",function(d){return d.year})
    .attr("data-type",function(d){return d.eType})
    .style("visibility", "hidden");
  this.target.appendChild(this.canvas[0][0]);
}
Timeline.prototype.addEventSet=function(eventSet){
  this.eventSet=eventSet;
}
Timeline.prototype.reload=function(eventSet){
  this.eventSet=eventSet;
  this.draw();
}
Timeline.prototype.highlight=function(yr,tp, el){
  try{
    console.log(el.className.baseVal);
    if (el.className.baseVal=="timelinePoint"){
      el.setAttribute("stroke-width",2);
    }else{
      try{
        el=this.target.querySelectorAll('[data-date="'+yr+'"][data-type="'+tp+'"]')[0];
        el.setAttribute("stroke-width",2);
        return;
      }catch(e){
        return;
      }
    }
    return;
  }catch(e){
    try{
      el=this.target.querySelectorAll('[data-date="'+yr+'"][data-type="'+tp+'"]')[0];
      el.setAttribute("stroke-width",2);
      return;
    }catch(e){
      return;
    }
  }
}
Timeline.prototype.unhighlight=function(yr,tp,el){
  try{
    console.log(el.className.baseVal);
    if (el.className.baseVal=="timelinePoint"){
      el.setAttribute("stroke-width",0);
    }else{
      try{
        el=this.target.querySelectorAll('[data-date="'+yr+'"][data-type="'+tp+'"]')[0];
        el.setAttribute("stroke-width",0);
        return;
      }catch(e){
        return;
      }
    }
    return;
  }catch(e){
    try{
      el=this.target.querySelectorAll('[data-date="'+yr+'"][data-type="'+tp+'"]')[0];
      el.setAttribute("stroke-width",0);
      return;
    }catch(e){
      return;
    }
  }
}
