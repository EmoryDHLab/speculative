
/*
  BuildCorrector is an object in
*/
var BuildCorrector= function(evtSet){
  this.answers=[];// list of objects {color, year, type, attempted}
  this.placed=[];// list of rect ids placed on buildGrid
  this.eventSet=evtSet;
  this.currentA=null;
  var count=0;
  var ignore=[]
  for(let e of evtSet.events){
    if (!ignore.includes(e)){
      var a={
        evt:e,
        evt2:null,
        attempted:false,
        correct:false,
        i:count
      }
      if(this.eventSet.isMulti(e.year,e.eType)){
        a.evt2=this.eventSet.findAll(e.year,e.eType)[1];
        ignore.push(a.evt2);
      }
      this.answers.push(a);
      count+=1;
    }
  }
  this.currentA=this.answers[0];
  this.update();
};
BuildCorrector.prototype.getPlaced = function (id) {
  for(let p of this.placed){
    if (p.id==id){
      return p;
    }
  }
  return null;
};
BuildCorrector.prototype.attempt=function(id,year,type,color){
  console.log(id,year,type,color);
  console.log(this.currentA.evt.getDecade(),this.currentA.evt.eType,this.currentA.evt.getColors()[0]);
  this.currentA.attempted=true;
  var tempP=this.getPlaced(id);
  if(tempP===null){
    this.placed.push({
      id:id,
      color:color,
      color2:null,
      i:this.currentA.i
    });
    var a=this.currentA.evt2===null,
        b=false;
  }else{
    tempP.color2=color;
    if (this.currentA.evt2===null){
      var a=this.currentA.evt2===null,
          b=false;
    }else{
      var a= (this.currentA.evt2.getColors()[0]==tempP.color2 && this.currentA.evt.getColors()[0]==tempP.color),
          b= (this.currentA.evt2.getColors()[0]==tempP.color && this.currentA.evt.getColors()[0]==tempP.color2);
    }
  }
  this.currentA.correct=(a||b) && this.currentA.evt.getDecade()==year && this.currentA.evt.eType==type;
  this.correct();
  return this.currentA.correct;
};
BuildCorrector.prototype.unattempt=function(id){
  this.currentA.attempted=false;
  this.currentA.correct=false;
  var tempA=[];
  for(let p of this.placed){
    if(p.id!=id){
      tempA.push(this.placed);
    }
  }
  this.placed=tempA;
  this.correct();
};
BuildCorrector.prototype.unattemptCurrent=function(){
  for(let p of this.placed){
    if(p.i==this.currentA.i){
      this.unattempt(p.id);
    }
  }
}
BuildCorrector.prototype.next=function(){
  var nextI=this.currentA.i+1;
  if (nextI>=this.answers.length){
    nextI=0;
  }
  this.currentA=this.answers[nextI];
};
BuildCorrector.prototype.prev=function(){
  var prevI=this.currentA.i-1;
  if (prevI<0){
    prevI=this.answers.length-1;
  }
  this.currentA=this.answers[prevI];
};
BuildCorrector.prototype.loadNext=function(){
  this.next();
  this.update();
};
BuildCorrector.prototype.loadPrev=function(){
  this.prev();
  this.update();
};

BuildCorrector.prototype.isAllowed=function(id,color){
  for(let placed of this.placed){
    if(placed.id==id){
      if (placed.i != this.currentA.i){ // if somthing is placed for
        return false;
      }
    }if(placed.i==this.currentA.i){
      if(placed.id!=id){
        return false;
      }
    }
  }

  return true;
}

BuildCorrector.prototype.update=function(){
  $("#currentYr").html(this.currentA.evt.year+".");
  $("#currentBuildEvent").html(this.currentA.evt.desc);
  $("#eventCounter").html(this.currentA.i+1+"/"+this.answers.length);
  this.correct();
};
BuildCorrector.prototype.correct = function () {
  if (this.currentA.correct){
    $(".corIncor:not(#correct)").css("display","none");
    $("#correct").css('display',"block");
  }else if(!this.currentA.attempted){
    $(".corIncor:not(#na)").css("display","none");
    $("#na").css('display',"block");
  }else{
    $(".corIncor:not(#incorrect)").css("display","none");
    $("#incorrect").css('display',"block");
  }
};
