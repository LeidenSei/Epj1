(function ($) {
	
	"use strict";

	$(window).on('load', function() {
        $('#js-preloader').addClass('loaded');
    });

	$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  var box = $('.header-text').height();
	  var header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	  
	  if (scroll >= 300) {
	    $("#scroll-to-top").addClass("active");
	  } else {
	    $("#scroll-to-top").removeClass("active");
	  }
	});

	$("#scroll-to-top").on('click', function(e) {
	  e.preventDefault();
	  $('html, body').animate({
	    scrollTop: 0
	  }, 700);
	});

	$('.owl-banner').owlCarousel({
	  center: true,
      items: 1,
      loop: true,
      nav: true,
	  dots: true,
	  navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
      margin: 30,
      responsive:{
        992:{
            items: 1
        },
		1200:{
			items: 3
		}
      }
	});

	const productsGrid = document.querySelector('.products-grid');
	const filtersElem = document.querySelector('.product-categories');
	if (productsGrid) {
		const productsList = new Isotope(productsGrid, {
			itemSelector: '.product-card',
			layoutMode: 'fitRows'
		});
		if (filtersElem) {
			filtersElem.addEventListener('click', function(event) {
				if (!matchesSelector(event.target, 'button')) {
					return;
				}
				const filterValue = event.target.getAttribute('data-filter');
				productsList.arrange({
					filter: filterValue
				});
				filtersElem.querySelector('.active').classList.remove('active');
				event.target.classList.add('active');
				event.preventDefault();
			});
		}
	}

	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}

	$('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				var width = $(window).width();
				if(width < 991) {
					$('.menu-trigger').removeClass('active');
					$('.header-area .nav').slideUp(200);	
				}				
				$('html,body').animate({
					scrollTop: (target.offset().top) - 80
				}, 700);
				return false;
			}
		}
	});

	function updateTicker() {
		const now = new Date();
		$('#currentDate').text(now.toLocaleDateString());
		$('#currentTime').text(now.toLocaleTimeString());

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				$('#currentLocation').text('Hanoi, Vietnam');
			}, function() {
				$('#currentLocation').text('Hanoi, Vietnam');
			});
		}
	}
	
	setInterval(updateTicker, 1000);
	updateTicker();
	$(window).on('load', function() {
		$("#preloader").animate({
			'opacity': '0'
		}, 600, function(){
			setTimeout(function(){
				$("#preloader").css("visibility", "hidden").fadeOut();
			}, 300);
		});
	});

})(window.jQuery);