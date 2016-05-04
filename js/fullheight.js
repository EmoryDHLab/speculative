$(function(){
  $('.row').css({ height: $(window).innerHeight() });
  $(window).resize(function(){
    $('.row').css({ height: $(window).innerHeight() });
  });
});