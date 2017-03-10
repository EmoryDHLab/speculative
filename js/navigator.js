function navigate(el){
  console.log(el);
  var content = el.dataset.to;
  var parentAnimId = content;
  console.log(content);
  var yScroll = $(content).offset().top;
  var xScroll = $(content).offset().left;
  console.log("Scroll offsets (x,y): "+xScroll+", "+yScroll);
  if (content != "#credits") {
    $('html,body').animate(
      { scrollTop: yScroll, scrollLeft: xScroll }
      , 'slow'
    );
  }else{
    $('html,body').animate(
      {scrollTop: yScroll}
      ,'slow'
    );
  }
  var ids=[
    "#splash",
    "#intro","#howitworks","#explore",
    "#design","#learn","#interaction",
    "#play","#data","#compare",
    "#credits"
  ];
  console.log(content);
  if(content=="#creds" || content=="#aboutSite" || content=="#reading"){
    content = "#credits";
  }
  if(content=="#splash1" || content=="#splash2"){
    content = "#splash";
  }
  animateNav(parentAnimId);
  fillBurg(ids.indexOf(content));
}

function fillBurg(num){
  $(".sqr").removeClass("current");
  $(".capRow").removeClass("current");
  $(".modalSqr").removeClass("current");
  $(".modalCapRow").removeClass("current");
  $("#nav-"+num).addClass("current");
  $("#burg-"+num).addClass("current");
}

function animateNav(parent) {
  if (parent == "#credits") {
    parent = "#creds";
  }
  $(".current-bar").removeAttr('style');
  $(".current-bar").removeClass("current-bar");
  $(parent + " .gridline.suggested").addClass("current-bar");
  $(parent + " .gridline.suggested").animate({
    color: "rgb(219, 136, 42)",
    backgroundColor: "white",
  }, 2000);
}
