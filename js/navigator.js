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
  window.location.hash = content;
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

navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem,
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

function recommendBrowser(){
  if (navigator.sayswho.indexOf("Chrome") == -1) {
    alert("This project is recommended for Chrome. " +
      "Your browser may be incompatible.");
    $("#browser-notice").html("This project is recommended for Chrome. " +
      "Your browser may be incompatible.");
  }
}

function checkHash(hash){
	if (hash != "") {
		var el = document.querySelector(hash); 
		navigate(el);
	}
}