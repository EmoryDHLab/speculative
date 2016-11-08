/*
  This is a dictionary class built by a fantastic user on stack overflow. I use
  it to connect events to their elements on the page
*/
function JSdict() {
    this.Keys = [];
    this.Values = [];
}

// Check if dictionary extensions aren't implemented yet.
// Returns value of a key
if (!JSdict.prototype.getVal) {
    JSdict.prototype.getVal = function (key) {
        if (key == null) {
            return false;
        }
        for (var i = 0; i < this.Keys.length; i++) {
            if (this.Keys[i] == key) {
                return this.Values[i];
            }
        }
        return false;
    }
}


// Check if dictionary extensions aren't implemented yet.
// Updates value of a key
if (!JSdict.prototype.update) {
    JSdict.prototype.update = function (key, val) {
        if (key == null || val == null) {
            return "Key or Value cannot be null";
        }
        // Verify dict integrity before each operation
        if (keysLength != valsLength) {
            return "Dictionary inconsistent. Keys length don't match values!";
        }
        var keysLength = this.Keys.length;
        var valsLength = this.Values.length;
        var flag = false;
        for (var i = 0; i < keysLength; i++) {
            if (this.Keys[i] == key) {
                this.Values[i] = val;
                flag = true;
                break;
            }
        }
        if (!flag) {
            return "Key does not exist";
        }
    }
}

// Check if dictionary extensions aren't implemented yet.
// Adds a unique key value pair
if (!JSdict.prototype.add) {
    JSdict.prototype.add = function (key, val) {
        // Allow only strings or numbers as keys
        if (typeof (key) == "number" || typeof (key) == "string") {
            if (key == null || val == null) {
                return "Key or Value cannot be null";
            }
            if (keysLength != valsLength) {
                return "Dictionary inconsistent. Keys length don't match values!";
            }
            var keysLength = this.Keys.length;
            var valsLength = this.Values.length;
            for (var i = 0; i < keysLength; i++) {
                if (this.Keys[i] == key) {
                    return "Duplicate keys not allowed!";
                }
            }
            this.Keys.push(key);
            this.Values.push(val);
        }
        else {
            return "Only number or string can be key!";
        }
    }
}

// Check if dictionary extensions aren't implemented yet.
// Removes a key value pair
if (!JSdict.prototype.remove) {
    JSdict.prototype.remove = function (key) {
        if (key == null) {
            return "Key cannot be null";
        }
        if (keysLength != valsLength) {
            return "Dictionary inconsistent. Keys length don't match values!";
        }
        var keysLength = this.Keys.length;
        var valsLength = this.Values.length;
        var flag = false;
        for (var i = 0; i < keysLength; i++) {
            if (this.Keys[i] == key) {
                this.Keys.shift(key);
                this.Values.shift(this.Values[i]);
                flag = true;
                break;
            }
        }
        if (!flag) {
            return "Key does not exist";
        }
    }
}
// -----------------------------------------------------------------------------

/*
  The evt class serves to simplify the transfer and arrangement of data
  throughout or program. All events are required to have a description, a year,
  players involved, eType (event type 1-9).
*/

var Evt= function(year,eType,desc,players){
  this.year=year;
  this.eType=eType;
  this.desc=desc;
  this.players=players;
}

Evt.prototype.getPlayers = function () {
  var ps=[];
  for(var i in this.players){
    ps.push(this.players[i][0]);
  }
  return ps;
}

Evt.prototype.getColors = function () {
  var cs=[];
  for(var i in this.players){
    cs.push(this.players[i][1]);
  }
  return cs;
};

/*
  EventFactory is responsible for loading all events and placinge them into the
  global scope for visualizations to utilize.

  It can generate events in a number of ways, and its generated events will be
  accessible through the .events selector.

  You could feasably have multiple events based on different datasets.
*/

var EventSet= function(){
  this.events=[];// this will contain all Evts generated by this factory.
  this.loaded=false;
}

EventSet.prototype.createEvt=function(evtData){
  var year=evtData.year,
      eType=evtData.eventType,
      desc=evtData.text,
      players=[[evtData.country,evtData.color]];
  this.events.push(new Evt(year,eType,desc,players));
};

/*
  This function is meant to be called with a callback to execute after loading
  the data. This is due to the asynchronous nature of d3.csv().
*/
EventSet.prototype.loadFromCSV=function(csvFile,callback){
  this.events=[];
  var self = this;
  d3.csv(csvFile,function(allData){
    for(i in allData){
      self.createEvt(allData[i]);
    }
    callback();
  });
}
/*
  Searches EventSet for an event of the given year (by decade) and type. returns
  the Evt or null if not found
*/
EventSet.prototype.find=function (yr,tp, exclude=[]){
  return this.events.find(function(evt){
    return evt.year%100==yr && evt.eType==tp && !exclude.includes(evt);
  });
}

EventSet.prototype.findAll=function(yr,tp){
  var allEvts=[];
  while(!allEvts.includes(undefined)){
    allEvts.push(this.find(yr,tp,allEvts));
  }
  allEvts.pop();
  return allEvts
}
// generates a grid with default styles
var Grid= function(location,scl=1,styles=null){
  var defaultGridStyle={
    lines:[.25,2,18], // [0]--> most thin, [2]--> most thick
    colors:{
      empty:"#fff",
      hlght:"#",
      hvr:"#",
      evt:"#b3b3b3",
      yr:"#FAAE3C",
      cent:"#DB882A"
    },
    sz:16 //size of squares-- affects inner square sizes, not lines.
  }
  this.styles= (styles==null) ? defaultGridStyle : styles;
  this.scale=scl;
  this.loc=location;// the id of the svg to append to
  /*  the !!outermost!! position of the top right corner--
      stroke is not factored in here. I.E. How much to shift the grid once it0
      has been drawn.
  */
  this.evtSet=null;
  this.evtDict=new JSdict();
  this.allGroup=null;
}
Grid.prototype.getCenturySize=function(){ //gets inner size of century
  return this.styles.sz*30+this.styles.lines[0]*20+
    this.styles.lines[1]*8 + 2*this.styles.lines[2];
}
Grid.prototype.addEventSet=function(evtSet){
  this.evtSet=evtSet;
}
Grid.prototype.replaceEventSet=function(evtSet){
  this.evtSet=evtSet;
}
Grid.prototype.addEvtRepTri=function(yr,tp,color,two){
  var y1=Math.floor(tp/3)*(this.styles.lines[0]+this.styles.sz), // top left
      x1=(tp%3)*(this.styles.lines[0]+this.styles.sz),
      x2= x1+this.styles.sz,
      y2= y1,
      x3= x1,
      y3= y1+this.styles.sz,
      tri=two.makePath(x1,y1,x2,y2,x3,y3,false);
  tri.fill=color;
  tri.linewidth=0;
  return tri;
}
Grid.prototype.addEvtRep=function(yr,tp,two){
  var tempEvts=this.evtSet.findAll(yr,tp);
  var evtFill=this.styles.colors.empty;
  if(tempEvts.length>0){
    evtFill=tempEvts[0].getColors()[0];
  }
  var y=Math.floor(tp/3)*(this.styles.lines[0]+this.styles.sz);
  var x=(tp%3)*(this.styles.lines[0]+this.styles.sz);
  var r=two.makeRectangle(x+this.styles.sz/2,y+this.styles.sz/2,this.styles.sz,this.styles.sz)
  r.linewidth=0;
  r.fill=evtFill;
  if(tempEvts.length>0){
      this.evtDict.add(r.id,r);
    if(tempEvts.length>1){
      var t=this.addEvtRepTri(yr,tp,tempEvts[1].getColors()[0],two);
      this.evtDict.add(t.id,t);
      return [r,t]
    }
  }
  return [r];
}

Grid.prototype.draw= function(two){// draws grid DOES NOT POPULATE IT
  // I add the main grid rectangle (the century block)
  var cSz=this.getCenturySize();
  var cSzOuter=cSz + 2*this.styles.lines[2];
  var century=two.makeRectangle(0,0,cSz,cSz);
  century.translation.set((cSz+this.styles.lines[2])/2,(cSz+this.styles.lines[2])/2);
  century.linewidth= this.styles.lines[2];
  century.stroke=this.styles.colors.cent;
  century.fill=this.styles.colors.evt;
  var allGrid= two.makeGroup(century);
  // Once I have the main bounds, I put in the main lines-- the years, and the subsections.
  // year lines
  var yearLines=two.makeGroup();
  var topLines=two.makeGroup();
  var bleh=1;
  for(var i=1; i<10; i++){
    // if the line is a century line.
    if(i==5){
      bleh=-1;
      pos=(this.styles.lines[1])*(i-1)+(this.styles.sz*3+this.styles.lines[0]*2)*i+
        this.styles.lines[2]/2;
      //horizontal line1
      var line1=two.makeLine(-1,pos,cSz-this.styles.lines[2]+1,pos),//  x, y, x1, y1
      //vertical line
        line2=two.makeLine(pos,-1,pos,cSz-this.styles.lines[2]+1);
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
      var line1=two.makeLine(0,pos,cSz-this.styles.lines[2],pos),//  x, y, x1, y1
      //vertical line
        line2=two.makeLine(pos,0,pos,cSz-this.styles.lines[2]);
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
  var evtReps=two.makeGroup()
  // for each decade
  for(var i=0; i<10; i++){
    // for each year in that decade
    for(var j=0; j<10; j++){
      var yr=(i*10)+j+1;
      var yearGroup=two.makeGroup();
      // for each event type in that year
      for(var k=0; k<9; k++){
        //  addEvtRep(eType); determines position of and draws a rectangle/rect-tri
        //  combo to represent the event or lack thereof, given the current year
        //  and eType.
        yearGroup.add(this.addEvtRep(yr,k,two));
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
  evtReps.addTo(allGrid)
  yearLines.addTo(allGrid)
  allGrid.scale=this.scale;
  /**/
  // update two
  two.update();
  this.allGroup=allGrid;
  return;
}

Grid.prototype.reload = function (two) {
  this.allGroup.remove();
  this.draw(two);
};


/*
  
*/
