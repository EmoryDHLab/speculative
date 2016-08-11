$(function(){
  $('.fullrow').css({ height: $(window).innerHeight() });
  $(window).resize(function(){
    $('.fullrow').css({ height: $(window).innerHeight() });
  });
});