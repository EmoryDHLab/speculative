//TODO: fix highlight to regroup elements properly

// generates a grid with default styles
var Grid= function(id,scl=.75,build=0,sd=420){//build: 0- no building, 1- limited building, 2- play!
  this.type="grid";
  this.target=document.getElementById(id);
  this.two = new Two({width:sd,height:sd});
  this.two.appendTo(this.target);
  var defaultGridStyle={
    lines:[.25,2,18], // [0]--> most thin, [2]--> most thick
    colors:{
      empty:"#fff",
      hlght:"#F7DE65",
      hvr:"#dddddd",
      evt:"#b3b3b3",
      yr:"#FAAE3C",
      cent:"#DB882A"
    },
    sz:16, //size of squares-- affects inner square sizes, not lines.
    highlight: function(el,active){
      if(active){
        el.addTo(el.parent)
        el.children[0].linewidth=5;
      }else{
        el.children[0].linewidth=0;
      }
    },
    shade: function(el,active){
      if(active){
        if(el.fill==this.colors.empty){
          el.fill=this.colors.hvr;
        }
      }else{
        if(el.fill==this.colors.hvr){
          el.fill=this.colors.empty;
        }
      }
    },
    point:false
  }
  this.styles=defaultGridStyle;
  this.scale=scl;
  /*  the !!outermost!! position of the top right corner--
      stroke is not factored in here. I.E. How much to shift the grid once it0
      has been drawn.
  */
  this.eventSet=new EventSet();
  this.evtDict=new JSdict(); // a dictionary of events by id
  this.emptyDict=new JSdict(); // a dictionary of empty rects by id

  this.allGroup=null;
  this.build=build;
  this.allowMultiPlacement=false;
  if(build==0){
    this.setShader(function(){return;});
  }else{
    this.styles.point=true;
    if(build==2){
      this.allowMultiPlacement=true;
    }
  }
  this.pallete=null;
  this.corrector=null;
}
Grid.prototype.initBuild = function (pallete,corrector) {
  this.pallete=pallete;
  this.corrector=corrector;
};
Grid.prototype.getCenturySize=function(){ //gets inner size of century
  return this.styles.sz*30+this.styles.lines[0]*20+
    this.styles.lines[1]*8 + 2*this.styles.lines[2];
}
Grid.prototype.addEventSet=function(evtSet){
  this.eventSet=evtSet;
}
Grid.prototype.setEventSet=function(evtSet){
  this.eventSet=evtSet;
}
Grid.prototype.setShader=function(newFunc){
  this.styles.shade=newFunc;
}
Grid.prototype.setHiglighter=function(newFunc){
  this.styles.highlight=newFunc;
}
Grid.prototype.addEvtRepTri=function(x,y){
  var x2= x+this.styles.sz,
      y2= y,
      x3= x,
      y3= y+this.styles.sz,
      tri=this.two.makePath(x,y,x2,y2,x3,y3,false);
  tri.stroke=this.styles.colors.hlght;
  tri.linewidth=0;
  return tri;
}
Grid.prototype.addEvtRep=function(yr,tp){
  var y=Math.floor(tp/3)*(this.styles.lines[0]+this.styles.sz);
  var x=(tp%3)*(this.styles.lines[0]+this.styles.sz);
  var tempEvts=this.eventSet.findAll(yr,tp),
      r=this.two.makeRectangle(x+this.styles.sz/2,y+this.styles.sz/2,this.styles.sz,this.styles.sz),
      t=this.addEvtRepTri(x,y,this.two),
      grp=this.two.makeGroup(r,t);

  r.linewidth=0;
  if(tempEvts.length>0 && this.build==0){       // if we are not in build mode and we have events to place
    r.stroke=this.styles.colors.hlght;            // set the highlight
    grp.fill=tempEvts[0].getColors()[0];          // set the event fill to the color
    if (tempEvts.length>1){                       // if there should be a tri
      t.fill=tempEvts[1].getColors()[0];            // color it.
    }
    this.evtDict.add(grp.id,grp);                 // add the group to evtDict
  }else if(this.build==0){                      // else if we are not build mode and we have nothing to place
    grp.fill=this.styles.colors.empty;            // set the entire group's color to empty
    this.emptyDict.add(grp.id,grp);               // add the group to the empty dictionary
  }else if(this.build>0 && tempEvts.length==0){ // else if we are in a build mode, without evts
    grp.fill=this.styles.colors.empty;            // we set the evtFill to empty
    this.emptyDict.add(grp.id,grp);               // and add it to the empty dictionary
  }else{                                        // else we are in build mode with events to place
    grp.fill=this.styles.colors.empty;
    this.evtDict.add(grp.id,grp);
  }
  if(tempEvts.length>0){
    var c1=tempEvts[0].getColors()[0];
    if(tempEvts.length>1){
      var c2=tempEvts[1].getColors()[0];
    }
  }
  grp.classList.push({year:yr,eType:tp, colors:[c1,c2]});
  return [grp];
}

Grid.prototype.draw= function(){// draws grid DOES NOT POPULATE IT
  console.log("drawing grid");
  // I add the main grid rectangle (the century block)
  this.two.clear();
  var cSz=this.getCenturySize();
  var cSzOuter=cSz + 2*this.styles.lines[2];
  var century=this.two.makeRectangle(0,0,cSz,cSz);
  century.translation.set((cSz+this.styles.lines[2])/2,(cSz+this.styles.lines[2])/2);
  century.linewidth= this.styles.lines[2];
  century.stroke=this.styles.colors.cent;
  century.fill=this.styles.colors.evt;
  var allGrid= this.two.makeGroup(century);
  // Once I have the main bounds, I put in the main lines-- the years, and the subsections.
  // year lines
  var yearLines=this.two.makeGroup();
  var topLines=this.two.makeGroup();
  var bleh=1;
  for(var i=1; i<10; i++){
    // if the line is a century line.
    if(i==5){
      bleh=-1;
      pos=(this.styles.lines[1])*(i-1)+(this.styles.sz*3+this.styles.lines[0]*2)*i+
        this.styles.lines[2]/2;
      //horizontal line1
      var line1=this.two.makeLine(-1,pos,cSz-this.styles.lines[2]+1,pos),//  x, y, x1, y1
      //vertical line
        line2=this.two.makeLine(pos,-1,pos,cSz-this.styles.lines[2]+1);
      line1.linewidth=this.styles.lines[2];
      line2.linewidth=this.styles.lines[2];
      line1.stroke=this.styles.colors.cent;
      line2.stroke=this.styles.colors.cent;
      topLines.add(line1);
      topLines.add(line2);
    //if the line is a year line
    }else{
      pos=(this.styles.lines[1])*(i-1)+(this.styles.sz*3+this.styles.lines[0]*2)*i+
        (this.styles.lines[2])*Math.floor(i/5)+(bleh*(this.styles.lines[1]/2));
      //horizontal line
      var line1=this.two.makeLine(0,pos,cSz-this.styles.lines[2],pos),//  x, y, x1, y1
      //vertical line
        line2=this.two.makeLine(pos,0,pos,cSz-this.styles.lines[2]);
      line1.linewidth=this.styles.lines[1];
      line2.linewidth=this.styles.lines[1];
      line1.stroke=this.styles.colors.yr;
      line2.stroke=this.styles.colors.yr;
      yearLines.add(line1);
      yearLines.add(line2);
    }
  }
  topLines.addTo(yearLines);
  yearLines.translation.set(this.styles.lines[2],this.styles.lines[2]);
  //yearLines.translation.set(this.styles.lines[2],this.styles.lines[2]);

  // represent all events on the grid.
  var evtReps=this.two.makeGroup()
  // for each decade
  for(var i=0; i<10; i++){
    // for each year in that decade
    for(var j=0; j<10; j++){
      var yr=(i*10)+j+1;
      var yearGroup=this.two.makeGroup();
      // for each event type in that year
      for(var k=0; k<9; k++){
        //  addEvtRep(eType); determines position of and draws a rectangle/rect-tri
        //  combo to represent the event or lack thereof, given the current year
        //  and eType.
        yearGroup.add(this.addEvtRep(yr,k));
      }// end event loop
      var yrX=(this.styles.lines[1]+this.styles.sz*3+2*this.styles.lines[0])*j+
        (Math.floor(j/5)*(this.styles.lines[2]-this.styles.lines[1]));
      var yrY=(this.styles.lines[1]+this.styles.sz*3+2*this.styles.lines[0])*i+
        (Math.floor(i/5)*(this.styles.lines[2]-this.styles.lines[1]));
      yearGroup.translation.set(yrX,yrY);
      yearGroup.addTo(evtReps);
    }// end year loop
    evtReps.translation.set(this.styles.lines[2],this.styles.lines[2]);
  }// end decade loop
  yearLines.addTo(allGrid);
  evtReps.addTo(allGrid);
  allGrid.scale=this.scale;
  /**/
  // update this.two
  this.two.update();
  this.allGroup=allGrid;
  if(this.styles.point){
    this.doPointer();
  }
  for(let g of this.evtDict.Values){
    setDateAndType(document.getElementById(g.id),g.classList[0].year,g.classList[0].eType);
  }
  for(let g of this.emptyDict.Values){
    setDateAndType(document.getElementById(g.id),g.classList[0].year,g.classList[0].eType);
  }
  return;
};
Grid.prototype.getGroupIdByData=function(yr,tp){
  rep1=this.evtDict.Values.find(function(rep){
    return rep.children[0].year==yr && rep.children[0].eType==tp;
  });
  rep2=this.emptyDict.Values.find(function(rep){
    return rep.children[0].year==yr && rep.children[0].eType==tp;
  });
  if(rep1===undefined){
    return rep1.id;
  }else if (rep2===undefined){
    return rep2.id;
  }
}
Grid.prototype.reload = function (evtSet) {
  this.setEventSet(evtSet);
  this.allGroup.remove();
  this.evtDict=new JSdict();
  this.emptyDict=new JSdict();
  this.draw(this.two);
};
Grid.prototype.isEvtRep= function(id){
  if(this.evtDict.getVal(id)){
    return true;
  }else if(this.emptyDict.getVal(id)) {
    return false;
  }else{
    return undefined;
  }
};

Grid.prototype.hoverHandle = function(e,isIn){
  // if build mode, do shading on empties
  var evtR=this.isEvtRep(e.currentTarget.parentNode.id);
  var isBuild=this.build!=0;
  if(evtR===undefined){
    return;
  }
  if(evtR){// if its not empty
    var evt= this.evtDict.getVal(e.currentTarget.parentNode.id);
    if(isBuild){// if its in build mode
      if(evt.fill!=this.styles.colors.empty && evt.fill!=this.styles.colors.hvr){// and its colored
        this.styles.highlight(evt,isIn);
      }else{//and its empty
        this.styles.shade(evt,isIn);
      }
    }else{// its not build mode
      this.styles.highlight(evt,isIn);
    }
  }else{// it is empty
    var evt = this.emptyDict.getVal(e.currentTarget.parentNode.id);
    this.styles.shade(evt,isIn);
  }
  this.two.update();
  return [evt.year,evt.eType]
};
Grid.prototype.clickHandle = function(e){
  var evtR=this.isEvtRep(e.currentTarget.parentNode.id);
  if(evtR===undefined || this.build==0){
    return;
  }
  if(this.build==1){
    this.attemptPlace(e.currentTarget.parentNode.id);
  }else if (this.build==2) {
    var clr=this.pallete.currentColor;
    this.place(e.currentTarget.parentNode.id,clr);
  }
  this.two.update();
}
Grid.prototype.doPointer=function(){
  console.log("doing pointer!")
  for(let k of this.evtDict.Keys){
    $("#"+k).css("cursor","pointer");
  }
  for(let k of this.emptyDict.Keys){
    $("#"+k).css("cursor","pointer");
  }
}
Grid.prototype.noPointer=function(){
  for(let k of this.evtDict.Keys){
    console.log(k);
    $("#"+k).css("cursor","default");
  }
  for(let k of this.emptyDict.Keys){
    $("#"+k).css("cursor","default");
  }
}
/*
  attemptPlace(id) -- checks to see placement is currently allowed
  checks to see if the area is already colored, if not, then it colors the area
  Otherwise it colors/adds the triangle.
*/
Grid.prototype.attemptPlace=function(id){
  var clr=this.pallete.currentColor;
  if(this.corrector.isAllowed(id)){
    console.log(this.place(id,clr));
  }
}
Grid.prototype.place=function(id,color){
  if (this.isEvtRep(id)===undefined){
    return;
  }else if(this.isEvtRep(id)){
    var grp=this.evtDict.getVal(id);
  }else{
    var grp=this.emptyDict.getVal(id);
  }
  if (grp.fill==this.styles.colors.empty || grp.fill==this.styles.colors.hvr){
    grp.fill=color;
  }else if (grp.fill==color){
    if(grp.children[1].fill==color){
      grp.fill=this.styles.colors.empty;
      return this.corrector.unattempt(id);
    }else{
      grp.fill=color;
    }
  }else{
    if(grp.children[1].fill==color){
      grp.fill=color;
    }else{
      grp.children[1].fill=color;
    }
  }
  var yr=grp.classList[0].year,
      tp=grp.classList[0].eType;
  return this.corrector.attempt(id,yr,tp,color);
}

Grid.prototype.highlight=function(yr,tp){
  console.log(this.id);
  try{
    var el=this.target.querySelectorAll('[data-date="'+yr+'"][data-type="'+tp+'"]')[0];
  }catch(e){
    console.log(e);
  }
  var twoRep=this.evtDict.getVal(el.id);
  if (twoRep!=null){
    this.styles.highlight(twoRep,true);
  }
  this.two.update();
}

Grid.prototype.unhighlight=function(yr,tp){
  try{
    var el=this.target.querySelectorAll('[data-date="'+yr+'"][data-type="'+tp+'"]')[0];
  }catch(e){
    console.log(e);
  }
  var twoRep=this.evtDict.getVal(el.id);
  if(twoRep!=null){
    this.styles.highlight(twoRep,false);
  }
  this.two.update();
}

Grid.prototype.showAnswer=function(){
  console.log("heyo");
  this.corrector.unattemptCurrent();
  var e1=this.corrector.currentA.evt,
      e2=this.corrector.currentA.evt2;
  for(i in this.evtDict.Values){
    console.log(i);
    var evt = this.evtDict.Values[i];
    console.log(evt.classList[0].colors.includes(e1.getColors()[0]),evt.classList[0].year);
    console.log(e1);
    if (evt.classList[0].colors.includes(e1.getColors()[0]) && evt.classList[0].year==e1.getDecade() && evt.classList[0].eType==e1.eType){
      console.log("GOTE<");
      this.place(this.evtDict.Keys[i],e1.getColors()[0]);
      break;
    }
  }
  this.two.update()
}
