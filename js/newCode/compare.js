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
List.prototype.highlight=function(yr,tp){
  try{
    this.target.querySelectorAll('[data-date="'+yr+'"][data-type="'+tp+'"]')[0].className+=(" highlight");
  }catch(e){
    return;
  }
}
List.prototype.unhighlight=function(yr,tp){
  var el=this.target.querySelectorAll('[data-date="'+yr+'"][data-type="'+tp+'"]')[0];
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
