
var Pallete = function(target="pallete", isTemplate=false){
  this.colors=[];
  this.labels=[];
  this.isTemplate=isTemplate;
  this.eventSet=null;
  this.target= document.getElementById(target);
  this.currentColor=null;
}
Pallete.prototype.init = function (eventSet) {
  if (this.isTemplate){
    return this.initEmpty(eventSet);
  }
  this.eventSet=eventSet;
  for(let evt of this.eventSet.events){
    if(!this.colors.includes(evt.getColors()[0])){
      this.colors.push(evt.getColors()[0]);
      this.labels.push(evt.getActor());
    }
  }
  this.currentColor=this.colors[0];
};
Pallete.prototype.initEmpty = function (colorLabel) {// passed in as a list of two lists, one for colors, one for labels
  for(var i in colorLabel){
    this.colors.push(colorLabel[i][0]);
    this.labels.push(colorLabel[i][1]);
  }
  this.currentColor=this.colors[0];
};

Pallete.prototype.draw = function () {
  var tempRow=document.createElement("div");
  for (var i=0; i<6; i++){
    if (i==3){
      this.target.appendChild(tempRow);
      tempRow=document.createElement("div");
      tempRow.className="palleteRow";
    }
    var tempContainerDiv=document.createElement("div");
    tempContainerDiv.className="colorLabelPair";

    if (!this.isTemplate){
      var tempLabel= document.createElement("div");
      tempLabel.className="palleteLabel";
      tempLabel.innerHTML=(this.labels[i]) ? this.labels[i]:"Unused";
    }else{
      var tempLabel= document.createElement("input");
      tempLabel.value=(this.labels[i]) ? this.labels[i]:"Unused";
      tempLabel.className="palleteLabel editable";
      tempLabel.overflowX="auto";
      tempLabel.style.width="6em";
    }

    var tempDiv=document.createElement("div");
    tempDiv.className=(i==0) ? "palleteSquare currentColor":"palleteSquare";
    tempDiv.className+=(this.colors[i]) ? "":" disabled";
    tempDiv.style.width="30px";
    tempDiv.style.height="30px";
    tempDiv.style.backgroundColor= (this.colors[i]) ? this.colors[i]:"#dfdfdf";
    if (this.isTemplate){
      var colorInput=document.createElement("INPUT");
      colorInput.className="secretColor";
      colorInput.value=this.colors[i];
      colorInput.type="color";
      colorInput.style.width="30px";
      colorInput.style.height="30px";
      colorInput.style.opacity="0";
      colorInput.disabled=true;
      tempDiv.appendChild(colorInput);
    }
    console.log(tempContainerDiv);
    tempContainerDiv.appendChild(tempDiv);
    tempContainerDiv.appendChild(tempLabel);
    tempRow.appendChild(tempContainerDiv);
  }
  this.target.appendChild(tempRow);
};
Pallete.prototype.selectColor = function(el){
  console.log("Selecting!")
  this.currentColor=rgb2hex(el.style.backgroundColor);
  var selected=document.getElementsByClassName("currentColor");
  for(let ele of selected){
    ele.className="palleteSquare";
  }
  el.className+=" currentColor";
}
Pallete.prototype.changeColor = function(){}

/*
  The Event key is a small square which sits at the bottom of the page. it
  represents the event being hovered over.
  size is given in px
*/
var EventKey=function(size,target="eventKey"){
  this.size=size;
  this.linewidth=size*.01;
  this.borderwidth=size*.04;
  this.evtSize=(size/3)-(size*.50);
  this.eventTypes=[
    "Battles, Sieges, Beginning of War",
    "Conquests, Annexations, Unions",
    "Losses and Disasters",
    "Falls of States",
    "Foundations of States and Revolutions",
    "Treaties and Sundries",
    "Births",
    "Deeds",
    "Deaths, of remarkable individuals"
  ];
  this.target=document.getElementById(target);
}

EventKey.prototype.draw=function(){
  //draw total square:
  var t=document.createElement("table");
  t.id="eventKeySqr";
  t.style.tableLayout="fixed";
  t.style.width=this.size-this.borderwidth+'px';
  t.style.height=this.size-this.borderwidth+'px';
  t.style.outlineWidth=this.borderwidth+'px';
  t.style.margin=this.borderwidth+'px';
  var tr=null;
  for(var i=1; i<10; i++){
    if((i-1)%3==0){
      tr=document.createElement("tr");
    }
    var td=document.createElement("td");
    td.innerHTML=i;
    td.className="nineSquare";
    td.style.borderWidth=this.linewidth+'px';
    td.dataset.type=i-1;
    tr.appendChild(td);
    if(i%3==0){
      t.appendChild(tr);
    }
  }
  this.target.appendChild(t);
  var ol=document.createElement("ol");
  ol.id="eventKeyTypes";
  var ct=0;
  for(let type of this.eventTypes){
    var li=document.createElement("li");
    li.innerHTML=type;
    li.dataset.type=ct;
    ol.appendChild(li);
    ct++;
  }
  ol.style.width=2*this.size+"px";
  this.target.appendChild(ol);
}

EventKey.prototype.highlight=function(yr,tp){
  var elems=this.target.querySelectorAll('[data-type="'+tp+'"]');
  for(i in elems){
    elems[i].className='highlight';
  }
}
EventKey.prototype.unhighlight=function(yr,tp){
  var elems=this.target.querySelectorAll('[data-type="'+tp+'"]');
  for(i in elems){
    elems[i].className='';
  }
}
