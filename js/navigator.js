function navigate(el){
  console.log(el);
  var content = el.dataset.to;
  console.log(content);
  var yScroll=$(content).offset().top;
  var xScroll=$(content).offset().left;
  console.log("Scroll offsets (x,y): "+xScroll+", "+yScroll);
  if(content!="#splash" && content!="#credits"){
    $('html,body').animate({
      scrollTop: yScroll, scrollLeft: xScroll},
      'slow');
  }else{
    $('html,body').animate({
      scrollTop: yScroll},
      'slow');
  }
  var ids=[
    "#splash","#intro","#howitworks","#explore",
    "#compare","#play","#learn",
    "#data","#design","#interaction",
    "#credits"
  ];
  fillBurg(ids.indexOf(content));
}

function fillBurg(num){
  console.log($("#burg-"+num));
  $(".sqr").removeClass("current");
  $(".capRow").removeClass("current");
  $(".modalSqr").removeClass("current");
  $(".modalCapRow").removeClass("current");
  $("#nav-"+num).addClass("current");
  $("#burg-"+num).addClass("current");
}
