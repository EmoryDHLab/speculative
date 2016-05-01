$(function(){
  
      var $heroTitle = $(".hero_area .content");
      var TWEEN_TIME = 1.5;
      var EASING = Quad.easeOut;

      TweenLite.to($heroTitle, TWEEN_TIME, {
        delay: .5,
        ease: EASING,
        opacity: 1,
        y: 50

      });
       

});
$(function(){
  
});
$(function() {
  
  $('header .nav').click(function(){
    $('body').toggleClass('closed');
  })

});
function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
       {
            return sParameterName[1];
        }
    }

}

$(function(){

  var USE_GSAP = false;
  var USE_RAF = false;

  //TweenLite.defaultOverwrite = "all";

  var currentlyScrolledTrendElementId = 0;
  var currentlyOpenedTrendElementId = null;
  var $currentTrend = null;
  var TRANSITION_DURATION = 700;
  var TWEEN_TIME = 0.7;
  var EASING = Quad.easeInOut;
  var trendsCount = 0;

  var transitionInProgress = false;

  var trendTitles = [];
  $('.row h2').each(function(){
    var txt = $(this).text()
    txt = generateSlug(txt);
    trendTitles.push(txt);
  });

  var RafScrollCurrent = 0;
	var RafScrollTarget = 0;
	var RafScrollIncrement = 0;
	var RafScrollNow = false;
	var RafScrollDuration = TRANSITION_DURATION;

	var RafExpandTrend = {object:null, current:0, target:0, increment:0};
	var RafExpandTrendDetails = {object:null, current:0, target:0, increment:0};
	var RafExpandNow = false;
	var RafExpandDuration = TRANSITION_DURATION;

	var $pageElement = $(document.documentElement);
	if ($.browser.safari) $pageElement = $("body");

  ////////////////////////////////
	// PANEL CONTROL
	////////////////////////////////

	var expandTrendElement = function ($trend) {

    // add active class to the new trend
    $trend.addClass('active');

		var $details = $trend.find('.trend_details');
		var trendBackgroundHeight = $trend.find('.trend_background').outerHeight();
    var trendIntroHeight = $trend.find('.trend_intro').outerHeight();
    var trendDiamondHeight = $trend.find('.trend_intro').find('p').outerHeight();
    var height = $trend[0].scrollHeight + trendBackgroundHeight - (trendDiamondHeight * 2);


    if (USE_GSAP) {
      TweenLite.to($trend, TWEEN_TIME, {
        delay: 0,
        ease: EASING,
        height: height
      });

      TweenLite.to($details, TWEEN_TIME, {
        delay: -TWEEN_TIME,
        ease: EASING,
        y: trendBackgroundHeight
      });
    } else if (USE_RAF) {

      RafExpandDuration = TRANSITION_DURATION;
      RafExpandTrend.object = $trend;
      RafExpandTrend.current = 0;
      RafExpandTrend.target = height;
      RafExpandTrend.increment = (height-0)/RafExpandDuration*40;

      RafExpandTrendDetails.object = $details;
      RafExpandTrendDetails.current = 0;
      RafExpandTrendDetails.target = trendBackgroundHeight;
      RafExpandTrendDetails.increment = (trendBackgroundHeight-0)/RafExpandDuration*40;

    	RafExpandNow = true;

    } else {

      $trend.transition({
              'height': height + 'px'
            }, TRANSITION_DURATION);

      $details.transition({
              'margin-top': trendBackgroundHeight
             }, TRANSITION_DURATION);


		}

		// close the old element (if any) after the new one is opened
		setTimeout(function() {
		  var newElementId = $trend.attr('id');
		  // if the closed element was above the newly opened one, adjust scrolling
		  if ( currentlyOpenedTrendElementId &&
		    parseInt(currentlyOpenedTrendElementId.split('-')[1]) < parseInt(newElementId.split('-')[1]) ) {
  	    var oldElementHeight = $('#' + currentlyOpenedTrendElementId).outerHeight();
  	    var trendBackgroundHeight = $('#' + currentlyOpenedTrendElementId).find('.trend_background').outerHeight();

  			var $pageElement = $(document.documentElement);
  			if ($.browser.safari) $pageElement = $("body");
  			$pageElement.scrollTop($pageElement.scrollTop() - oldElementHeight + trendBackgroundHeight);
			}
		  collapseTrendElement( $('#' + currentlyOpenedTrendElementId), false);
		  currentlyOpenedTrendElementId = newElementId;
		  // add Disqus
      // addDisqus();
	  }, TRANSITION_DURATION + 100);

	  // Set trend height to auto so disqus works
	  setTimeout(function() {
	    $trend.css({'height':'auto'});
	  }, TRANSITION_DURATION);
	}

	var collapseTrendElement = function ($trend, useTransition) {

		if (currentlyOpenedTrendElementId === $trend.attr('id')) {
		  currentlyOpenedTrendElementId = null;
		}

    $trend.removeClass('active');

    var backgroundHeight = $trend.find('.trend_background').outerHeight();

		var $details = $trend.find('.trend_details');

		if (useTransition) {
      if (USE_GSAP) {
        TweenLite.to($trend, TWEEN_TIME, {
          delay: 0,
          ease: EASING,
          height: backgroundHeight
        });

        TweenLite.to($details, TWEEN_TIME, {
          delay: -TWEEN_TIME,
          ease: EASING,
          y: 0
        });

      } else {
  			$trend.transition({'height': backgroundHeight}, TRANSITION_DURATION);
  			$details.transition({'margin-top': '0'}, TRANSITION_DURATION);
      }

    	setTimeout(function () {
      // reactivate();
			}, TRANSITION_DURATION);
		} else {
			$trend.css('height', backgroundHeight);

      if (USE_GSAP) {
        TweenLite.to($details, TWEEN_TIME, {
          delay: 0,
          ease: EASING,
          y: 0
        });
      } else {
  			$details.transition({'margin-top': '0'}, TRANSITION_DURATION);
      }
      // reactivate();
		}

		$("iframe.youtube").parent().find('img').height('auto');
		$("iframe.youtube").remove();

	};

	var scrollToTrendElement = function ($trend, expanding, callback) {
	  var value = $trend.offset().top;
	  var currentScroll = $pageElement.scrollTop();
	  var scrollDuration = currentScroll;
	  var distanceLimit = 500;
	  $currentTrend = $trend;

	  if (Math.abs(currentScroll - value) > distanceLimit) {
	    scrollDuration = TRANSITION_DURATION;
	  } else {
	    scrollDuration = (700 * Math.abs(currentScroll - value))/distanceLimit;
	  }

	  if (expanding) {
	    value += $('.trend_background').first().outerHeight();
	  }
    // var $pageElement = $(document.documentElement);
    // if ($.browser.safari) $pageElement = $("body");

    //Using Scroll.to, seems faster
    //$.scrollTo(value, TRANSITION_DURATION);

    if (USE_RAF) {
      //Using rAF Scroll!
      RafScrollCurrent = $pageElement.scrollTop();
      RafScrollTarget = value;
      RafScrollDuration = TRANSITION_DURATION;
      RafScrollIncrement = (RafScrollTarget-RafScrollCurrent)/RafScrollDuration*40;
    	RafScrollNow = true;
  	} else {
  	  //Using Scroll.to
      $.scrollTo(value, scrollDuration, {onAfter:callback, axis:'y'});
  	}
	}


	////////////////////////////////
	// BOOT UP
	////////////////////////////////

	trendsCount = $('.trend').length;
  $('#total').html(' / ' + trendsCount);

  // Old number based URL
  // var trendParameter = GetURLParameter('trend');

  var trendParameter = trendTitles.indexOf(document.location.search.substring(1));
  trendParameter += 1;

  if (trendParameter) {
    var trend = $('#trend-' + trendParameter);
    setTimeout(function(){
      scrollToTrendElement(trend, false, function() { expandTrendElement(trend); });
    }, TRANSITION_DURATION/2);
    //setTimeout(function(){ expandTrendElement(trend); }, TRANSITION_DURATION);
  }


  ////////////////////////////////
	// BUTTON ACTIONS
	////////////////////////////////

	$('.trend_intro, .trend_image').live('click', function(){
		var elem = $(this).parent().parent();
		if (elem.attr('id') == currentlyOpenedTrendElementId) {
      scrollToTrendElement(elem, false, function(){ collapseTrendElement(elem, true); });
      //setTimeout(function(){ collapseTrendElement(elem, true); }, TRANSITION_DURATION);
		} else {
      scrollToTrendElement(elem, false, function() { expandTrendElement(elem); });
      //expandTrendElement(elem);
      //setTimeout(function(){ expandTrendElement(elem); }, TRANSITION_DURATION);
		}
	});

	var stepTrend = function (forward) {
	  if (transitionInProgress) return;
	  setTransitionInProgress(TRANSITION_DURATION*2.3);

	  if (forward) removeDisqus();

		var trendId = currentlyScrolledTrendElementId;
		var oldTrend = $('#trend-' + currentlyScrolledTrendElementId);

		trendId += forward ? 1 : -1;
		if (trendId > trendsCount || trendId < 1)
			return;

		var newTrend = $('#trend-' + trendId);

		// Expand only if one trend is expanded, if all are collapsed just scroll
		if (currentlyOpenedTrendElementId) {
		  scrollToTrendElement(newTrend, false, function(){ expandTrendElement(newTrend); });
		  //setTimeout(function() { expandTrendElement(newTrend); }, TRANSITION_DURATION);
	  } else {
	    // Just scroll
	    scrollToTrendElement(newTrend);
	  }
	};

	$('#next').live('click', function(e) {
		stepTrend(true);
	});

 	$('#prev').live('click', function(e) {
		stepTrend(false);
	});

  ////////////////////////////////
	// KEYBOARD SHORTCUTS
	////////////////////////////////

	$('body').keydown(function( event ) {
		switch (event.which) {
			case 37: // arrow left
			case 38: // arrow up
				stepTrend(false);
				return;
			case 39: // arrow right
			case 40: // arrow down
				stepTrend(true);
				return;
		}
	});


	////////////////////////////////
	// SCROLLING
	////////////////////////////////

 	// Cache selectors
	var lastId;
	var topMenu = $(".trends");
	// All list items
	var menuItems = topMenu.find(".trend");

	// Anchors corresponding to menu items
	var scrollItems = menuItems.map( function() {
		var item = $("#"+$(this).attr("id"));
		if (item.length)
			return item;
	});

	var refreshCurrentScroll = function () {

		// Get container scroll position
		var fromTop = $(this).scrollTop()+300;

		// Get id of current scroll item
		var cur = scrollItems.map( function() {
			if ($(this).offset().top < fromTop)
				return this;
		});

		// Get the id of the current element
		cur = cur[cur.length-1];
		var id = cur && cur.length ? cur[0].id : "";

		if (lastId !== id) {
			lastId = id;
			var nextId = $("#"+id).next().attr('id');
      var prevId = $("#"+id).prev().attr('id');

			currentlyScrolledTrendElementId = parseInt(id.split('-')[1]);
			var trendUrl = isNaN(currentlyScrolledTrendElementId) ? "/" : "/?" + trendTitles[currentlyScrolledTrendElementId-1];
			if ( trendUrl != null && trendUrl != "index.html?trend=") {
				history.pushState(null, null, trendUrl);
			}
			$('#current').html(currentlyScrolledTrendElementId);

			$('#menu').removeClass().addClass('trend-'+currentlyScrolledTrendElementId);
		}
	};

	// Bind to scroll
	$(window).scroll(function() {
	  if (document.location.pathname.substring(1) != "about.html" && document.location.pathname.substring(1) != "contact.html" && document.location.pathname.substring(1) != "news.html") {
		  refreshCurrentScroll();
	  }
	});

	////////////////////////////////
	// TRANSITION IN PROGRESS LOCK
	////////////////////////////////

	var setTransitionInProgress = function(duration) {
	  //Not an elegant solution but it solves for now.
	  transitionInProgress = true;
	  setTimeout(function(){
	    transitionInProgress = false;
	  }, duration);

	}



	////////////////////////////////
	// SHARING
	////////////////////////////////

	$('#share').live('click', function(e) {
		$(this).find('#container').toggleClass('active');
	});

	$('#share #facebook').live('click', function(e) {
	  $(this).parent().removeClass('active');
		window.open('https://www.facebook.com/sharer/sharer.php?u='+document.location, 'facebook-share','width=580,height=296');
		return false;
	});

	$('#share #twitter').live('click', function(e) {
	  $(this).parent().removeClass('active');
	  var trendId = $('#trend-'+currentlyScrolledTrendElementId);
	  var trendTitle = trendId.find('h2').text();
	  var trendSubtitle = trendId.find('h3').first().text();

	  var tweetText = trendTitle+' - '+trendSubtitle;
	  var tweetTextSub = tweetText.substr(0,93);
	  if (tweetText.length > tweetTextSub.length) {
	   tweetTextSub += '...';
	  }
	  tweetTextSub += ' @fjord';

	  window.open('http://twitter.com/share?text='+tweetTextSub+'&url='+document.URL.replace('localhost:3000','fjordnet.com')+'&hashtags=FjordTrends', 'twitter-share','width=550,height=235');
		return false;
	});

	$('#share #google-plus').live('click', function(e) {
	  $(this).parent().removeClass('active');
		window.open('https://plus.google.com/share?url='+document.location, 'google-plus-share','width=490,height=530');
		return false;
	});

	$('#share #linkedin').live('click', function(e) {
	  $(this).parent().removeClass('active');
		window.open('http://www.linkedin.com/shareArticle?mini=true&;url='+document.location, 'linkedin-share','width=500,height=350');
		return false;
	});

	////////////////////////////////
	// VIDEO STUFF
	////////////////////////////////
  var $allVideoThumbs = $("img");

  $allVideoThumbs.each(function() {
    if (!!$(this).attr('data-videourl')) {
      var $imageBeforeEmbed = $(this);
      var embedUrl = $(this).attr('data-videourl');
      var embedSource = $(this).attr('data-videosource');

      $(this).live('click', function(e) {
        var embedWidth = $imageBeforeEmbed.width();
        var embedHeight = $imageBeforeEmbed.height();

        if (embedSource == 'youtube') {
          $(this).height(0);
          $(this).after("<iframe class='youtube' width='"+embedWidth+"' height='"+embedHeight+"' src='"+embedUrl+"?autoplay=1&theme=light&modestbranding=1' frameborder='0' allowfullscreen></iframe>");
        }
      })
    }
  });

  // Adjust height of all vimeo videos
  var $allVimeoVideos = $("iframe[src^='//player.vimeo.com']");

	$allVimeoVideos.each(function() {
	  $video = $(this);
	  $(this).parent().parent().find('img').first().on('load', function(){
	    $video.height($(this).height());
    });
  });

	////////////////////////////////
	// DISQUS
	////////////////////////////////
	var disqusInitiated = false;

	function initDisqus() {
	  var disqus_shortname = 'fjordtrends'; // required: replace example with your forum shortname

	  $('#trend-1 .disqus').append('<div id="disqus_thread"></div>');

	  /* * * DON'T EDIT BELOW THIS LINE * * */
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

    disqusInitiated = true;
	}

  function addDisqus() {
    if (!disqusInitiated)
      initDisqus();

    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
    var disqus_shortname = 'fjordtrends'; // required: replace example with your forum shortname
    var disqus_title = $('#trend-'+currentlyScrolledTrendElementId).find('h2').text();

    setTimeout(function(){
      $('#disqus_thread').remove();
      $currentTrend.find('.disqus').append('<div id="disqus_thread"></div>');
      //if (window.DISQUS)
        //cleanDisqus();
    }, 700);
  }

  function cleanDisqus() {
    DISQUS.reset({
       reload: true,
       config: function () {
       this.page.identifier = identifier;
       this.page.url = url;
       }
    });
  }

  function removeDisqus() {
    //console.log($('#disqus_thread').length);
    //$('#disqus_thread').remove();
  }

	////////////////////////////////
	// HELPER METHODS
	////////////////////////////////

	// Generates a URL-friendly "slug" from a provided string.
  // For example: "This Is Great!!!" transforms into "this-is-great"
  function generateSlug (value) {
    // 1) convert to lowercase
    // 2) remove dashes and pluses
    // 3) replace spaces with dashes
    // 4) remove everything but alphanumeric characters and dashes
    return value.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };


  ////////////////////////////////
	// rAF - requestAnimationFrame
	////////////////////////////////

	var rAF = (function(){
  		return  window.requestAnimationFrame   ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
  	})();

  // animation loop
  function update(timestamp) {
    if (RafScrollNow) {
      RafScrollCurrent += RafScrollIncrement;
      $pageElement.scrollTop(RafScrollCurrent);

      // Stop if done
      if (Math.abs(RafScrollTarget-RafScrollCurrent) < 50) {
        RafScrollNow = false;
        $pageElement.scrollTop(RafScrollTarget);
      }
    }

    if (RafExpandNow) {
      RafExpandTrend.current += RafExpandTrend.increment;
      $(RafExpandTrend.object).css({"height": RafExpandTrend.current});

      RafExpandTrendDetails.current += RafExpandTrendDetails.increment;
      $(RafExpandTrendDetails.object).css({"margin-top": RafExpandTrendDetails.current});

      if (RafExpandTrend.target-RafExpandTrend.current < 1) {
        RafExpandNow = false;
        $(RafExpandTrend.object).css({"height": RafExpandTrend.target});
        $(RafExpandTrendDetails.object).css({"margin-top": RafExpandTrendDetails.target});
      }
    }

  	rAF(update);
  };
  rAF(update);

});
