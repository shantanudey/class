//var $ = jQuery.noConflict();
(function($){
	
	$.fn.msdResponsiveSlider = function(options){
		
		var settings = $.extend({
			innerWrapper : '.msd-slider-inner',
			slides : '.msd-slides',
			slideDelay : 5000,
			slideDuration : 1000,
			//animationType : 'easeInOutQuart',
			animationType : 'fade',
			autoSlide : 'true',
			navigation : 'true',
			navLeftImage : 'images/msd-nav-left.png',
			navRightImage : 'images/msd-nav-right.png',
			navigationAutoHide : 'false',
			pauseOnHover : 'true',
			pagination : 'true',
			paginationImage : 'images/pagination-normal.png',
			paginationActiveImage : 'images/pagination-active.png',
			paginationAutoHide : 'false',
			isDraggable : 'true'
		},options);
		
		return this.each(function(n){
			var bigWrapper = $(this),
				innerWrapper = $(this).children(settings.innerWrapper),
				eachSlides = $(this).children(innerWrapper).children(settings.slides),
				intervalId,
				isRunning = 0,
				isHovered = 0,
				isDragging = 0,
				forFadeIsActive = 0;
			
			function msdSliderHeightWidth()
			{
				if(settings.animationType != 'fade')
				{
					bigWrapper.css({
						'width' : bigWrapper.parent().width(),
						'overflow':'hidden',
						'position':'relative'
					});
					innerWrapper.children(eachSlides).css({
						'float':'left',
						'width':bigWrapper.width()
					});
					innerWrapper.children(eachSlides).children('img').css({
						'width' : bigWrapper.width()
					});
					bigWrapper.css({
						'height' : innerWrapper.children(eachSlides).children('img').height()
					});
					innerWrapper.css({
						'width':bigWrapper.width() * (innerWrapper.children(eachSlides).length + 1),
						'overflow':'hidden'
					});
				}else if(settings.animationType == 'fade')
				{
					bigWrapper.css({
						'width' : bigWrapper.parent().width(),
						'overflow':'hidden',
						'position':'relative'
					});
					innerWrapper.children(eachSlides).css({
						'position':'absolute',
						'width':bigWrapper.width(),
						'left':0,
						'right':0,
						'top':0,
						'bottom':0
					});
					innerWrapper.children(eachSlides).children('img').css({
						'width' : bigWrapper.width()
					});
					bigWrapper.css({
						'height' : innerWrapper.children(eachSlides).children('img:visible').height()
					});
					innerWrapper.css({
						'width':bigWrapper.width(),
						'position':'relative'
					});
				}
			}
			dataTarget = 0;
			innerWrapper.children(eachSlides).each(function(n){
				$(this).attr('data-target',dataTarget);
				dataTarget++;
			});
			if(settings.animationType == 'fade')
			{
				innerWrapper.children(eachSlides).css('display','none');
				innerWrapper.children(eachSlides).eq(0).css('display','block');
			}
			if(settings.navigation == 'true')
			{
				bigWrapper.append('<img src="'+settings.navLeftImage+'" class="msd-left-nav" alt="Prev" />');
				bigWrapper.append('<img src="'+settings.navRightImage+'" class="msd-right-nav" alt="Next" />');
				bigWrapper.find('.msd-left-nav').css({
					'max-width':'40px',
					'min-width':'20px',
					'width':'10%',
					'position':'absolute',
					'left':'20px',
					'top':'45%',
					'cursor':'pointer'
				});
				bigWrapper.find('.msd-right-nav').css({
					'max-width':'40px',
					'min-width':'20px',
					'width':'10%',
					'position':'absolute',
					'right':'20px',
					'top':'45%',
					'cursor':'pointer'
				});
				if(settings.navigationAutoHide == 'true' && settings.animationType != 'fade')
					$('.msd-left-nav, .msd-right-nav').delay(2000).fadeOut(500,settings.animationType);
				if(settings.navigationAutoHide == 'true' && settings.animationType == 'fade')
					$('.msd-left-nav, .msd-right-nav').delay(2000).fadeOut(500);
			}
			if(settings.pagination == 'true')
			{
				bigWrapper.append('<div class="pagination-wrapper" style="position:absolute; left:0; right:0; bottom:15px;"></div>');
				bigWrapper.children('.pagination-wrapper').append('<p style="text-align:center"></p>');
				for(var i=0; i<innerWrapper.children(eachSlides).length; i++)
					bigWrapper.children('.pagination-wrapper').children('p').append('<img src="'+settings.paginationImage+'" class="pagination" data-pagi="'+i+'" alt="" />');
				bigWrapper.children('.pagination-wrapper').css({
					'position':'absolute',
					'left':0,
					'right':0,
					'bottom':'15px'
				});
				bigWrapper.children('.pagination-wrapper').children('p').children('img').css({
					'width':'15px',
					'margin':'0 5px',
					'cursor':'pointer'
				});
				bigWrapper.children('.pagination-wrapper').children('p').children('img').eq(0).attr('src',settings.paginationActiveImage);
				if(settings.paginationAutoHide == 'true' && settings.animationType != 'fade')
					bigWrapper.children('.pagination-wrapper').delay(2000).fadeOut(500,settings.animationType);
				if(settings.paginationAutoHide == 'true' && settings.animationType == 'fade')
					bigWrapper.children('.pagination-wrapper').delay(2000).fadeOut(500);
			}
			msdSliderHeightWidth();
			function autoSlideFunc()
			{
				if(settings.autoSlide == 'true')
				{
					intervalId = setInterval(function(){
						if(isRunning == 0 && isHovered == 0 && settings.animationType != 'fade')
						{
							isRunning = 1;
							bigWrapper.children('.pagination-wrapper').children('p').children('img').attr('src',settings.paginationImage);
							bigWrapper.children('.pagination-wrapper').children('p').children('img').eq(innerWrapper.children(eachSlides).eq(1).attr('data-target')).attr('src',settings.paginationActiveImage);
							innerWrapper.animate({'margin-left':bigWrapper.width() * (-1)},settings.slideDuration, settings.animationType, function(){
								innerWrapper.children(eachSlides).eq(0).clone().appendTo(innerWrapper);
								innerWrapper.children(eachSlides).eq(0).remove();
								innerWrapper.css({'margin-left':0});
								isRunning = 0;
								msdSliderHeightWidth();
							});
						}
						if(isRunning == 0 && isHovered == 0 && settings.animationType == 'fade')
						{
							isRunning = 1;
							forFadeIsActive++;
							if(forFadeIsActive >= bigWrapper.children(innerWrapper).children(eachSlides).length - 1)
								forFadeIsActive = 0;
							bigWrapper.children('.pagination-wrapper').children('p').children('img').attr('src',settings.paginationImage);
							bigWrapper.children('.pagination-wrapper').children('p').children('img').eq(innerWrapper.children(eachSlides).eq(forFadeIsActive).attr('data-target')).attr('src',settings.paginationActiveImage);
							bigWrapper.find(eachSlides).fadeOut(settings.slideDuration);
							bigWrapper.find(eachSlides).eq(forFadeIsActive).stop().fadeIn(settings.slideDuration);
							isRunning = 0;
						}
					},settings.slideDelay);
				}
			}
			bigWrapper.hover(function(e){
				if(settings.pauseOnHover == 'true')
					isHovered = 1;
				if(settings.navigationAutoHide == 'true' && settings.animationType != 'fade')
					bigWrapper.children('.msd-left-nav, .msd-right-nav').stop().fadeIn(1000,settings.animationType);
				if(settings.paginationAutoHide == 'true' && settings.animationType != 'fade')
					bigWrapper.children('.pagination-wrapper').stop().fadeIn(1000,settings.animationType);
					
				if(settings.navigationAutoHide == 'true' && settings.animationType == 'fade')
					bigWrapper.children('.msd-left-nav, .msd-right-nav').stop().fadeIn(1000);
				if(settings.paginationAutoHide == 'true' && settings.animationType == 'fade')
					bigWrapper.children('.pagination-wrapper').stop().fadeIn(1000);
			},function(e){
				if(settings.pauseOnHover == 'true')
					isHovered = 0;
				if(settings.navigationAutoHide == 'true' && settings.animationType != 'fade')
					bigWrapper.children('.msd-left-nav, .msd-right-nav').stop().fadeOut(1000,settings.animationType);
				if(settings.paginationAutoHide == 'true' && settings.animationType != 'fade')
					bigWrapper.children('.pagination-wrapper').stop().fadeOut(1000,settings.animationType);
					
				if(settings.navigationAutoHide == 'true' && settings.animationType == 'fade')
					bigWrapper.children('.msd-left-nav, .msd-right-nav').stop().fadeOut(1000);
				if(settings.paginationAutoHide == 'true' && settings.animationType == 'fade')
					bigWrapper.children('.pagination-wrapper').stop().fadeOut(1000);
			});
			bigWrapper.children('.msd-left-nav').click(function(e) {
                if(isRunning == 0 && settings.animationType != 'fade')
				{
					isRunning = 1;
					innerWrapper.css({'margin-left':bigWrapper.width() * (-1)});
					innerWrapper.children(eachSlides).eq(innerWrapper.children(eachSlides).length - 1).clone().prependTo(innerWrapper);
					innerWrapper.animate({'margin-left':0},settings.slideDuration, settings.animationType, function(){
						innerWrapper.children(eachSlides).eq(innerWrapper.children(eachSlides).length - 1).remove();
						isRunning = 0;
						msdSliderHeightWidth();
					});
					bigWrapper.children('.pagination-wrapper').children('p').children('img').attr('src',settings.paginationImage);
					bigWrapper.children('.pagination-wrapper').children('p').children('img').eq(innerWrapper.children(eachSlides).eq(0).attr('data-target')).attr('src',settings.paginationActiveImage);
				}
                if(isRunning == 0 && settings.animationType == 'fade')
				{
					isRunning = 1;
					if(forFadeIsActive <= 0)
						forFadeIsActive = bigWrapper.children(innerWrapper).children(eachSlides).length - 1;
					forFadeIsActive--;
					bigWrapper.children('.pagination-wrapper').children('p').children('img').attr('src',settings.paginationImage);
					bigWrapper.children('.pagination-wrapper').children('p').children('img').eq(innerWrapper.children(eachSlides).eq(forFadeIsActive).attr('data-target')).attr('src',settings.paginationActiveImage);
					bigWrapper.find(eachSlides).fadeOut(settings.slideDuration);
					bigWrapper.find(eachSlides).eq(forFadeIsActive).stop().fadeIn(settings.slideDuration,function(){
						isRunning = 0;
					});
				}
            });
			bigWrapper.children('.msd-right-nav').click(function(e) {
                if(isRunning == 0 && settings.animationType != 'fade')
				{
					isRunning = 1;
					bigWrapper.children('.pagination-wrapper').children('p').children('img').attr('src',settings.paginationImage);
					bigWrapper.children('.pagination-wrapper').children('p').children('img').eq(innerWrapper.children(eachSlides).eq(1).attr('data-target')).attr('src',settings.paginationActiveImage);
					innerWrapper.animate({'margin-left':bigWrapper.width() * (-1)},settings.slideDuration, settings.animationType, function(){
						innerWrapper.children(eachSlides).eq(0).clone().appendTo(innerWrapper);
						innerWrapper.children(eachSlides).eq(0).remove();
						innerWrapper.css({'margin-left':0});
						isRunning = 0;
						msdSliderHeightWidth();
					});
				}
				if(isRunning == 0 && settings.animationType == 'fade')
				{
					isRunning = 1;
					forFadeIsActive++;
					if(forFadeIsActive >= bigWrapper.children(innerWrapper).children(eachSlides).length - 1)
						forFadeIsActive = 0;
					bigWrapper.children('.pagination-wrapper').children('p').children('img').attr('src',settings.paginationImage);
					bigWrapper.children('.pagination-wrapper').children('p').children('img').eq(innerWrapper.children(eachSlides).eq(forFadeIsActive).attr('data-target')).attr('src',settings.paginationActiveImage);
					bigWrapper.find(eachSlides).fadeOut(settings.slideDuration);
					bigWrapper.find(eachSlides).eq(forFadeIsActive).stop().fadeIn(settings.slideDuration);
					isRunning = 0;
				}
            });
			bigWrapper.on('click','.pagination',function(e){
				var difference = parseInt($(this).attr('data-pagi')) - parseInt(innerWrapper.children(eachSlides).eq(0).attr('data-target'));
				bigWrapper.children('.pagination-wrapper').children('p').children('img').attr('src',settings.paginationImage);
				$(this).attr('src',settings.paginationActiveImage);
				if(difference > 0 && isRunning == 0 && settings.animationType != 'fade')
				{
					isRunning = 1;
					innerWrapper.animate({'margin-left':bigWrapper.width() * (-1) * difference},settings.slideDuration, settings.animationType, function(){
						for(var i=0; i<difference; i++)
						{
							innerWrapper.children(eachSlides).eq(0).clone().appendTo(innerWrapper);
							innerWrapper.children(eachSlides).eq(0).remove();
						}
						innerWrapper.css({'margin-left':0});
						isRunning = 0;
						msdSliderHeightWidth();
					});
				}
				if(difference < 0 && isRunning == 0 && settings.animationType != 'fade')
				{
					isRunning =1;
					for(var i=0; i<difference*(-1); i++)
					{
						innerWrapper.children(eachSlides).eq(innerWrapper.children(eachSlides).length - 1).clone().prependTo(innerWrapper);
						innerWrapper.children(eachSlides).eq(innerWrapper.children(eachSlides).length - 1).remove();
					}
					innerWrapper.css({'margin-left':bigWrapper.width() * difference});
					innerWrapper.animate({'margin-left':0},settings.slideDuration, settings.animationType, function(){
						isRunning = 0;
						msdSliderHeightWidth();
					});
				}
				if(settings.animationType == 'fade')
				{
					isRunning = 1;
					forFadeIsActive = $(this).attr('data-pagi');
					bigWrapper.find(eachSlides).fadeOut(settings.slideDuration);
					bigWrapper.find(eachSlides).eq(forFadeIsActive).stop().fadeIn(settings.slideDuration);
					isRunning = 0;
				}
			});
			
			if(settings.isDraggable == 'true' && settings.animationType != 'fade')
			{
				bigWrapper.css({
					'cursor':'move'
				});
				innerWrapper.draggable({
					axis:'x',
					start:function(e, ui){
						start = e.pageX;
						dragFirst = 0;
					},
					drag:function(e, ui){
						if(isDragging == 0)
						{
							isDragging = 1;
							if(e.pageX - start > 0)
							{
								if(dragFirst == 0)
								{
									dragFirst = 1;
									innerWrapper.children(eachSlides).eq(innerWrapper.children(eachSlides).length - 1).clone().prependTo(innerWrapper);
									innerWrapper.css({'margin-left':bigWrapper.width() * (-1)});
								}
							}
						}
						else
							innerWrapper.draggable('disable');
					},
					stop:function(e, ui){
						if(e.pageX - start < 0)
						{
							if(start - e.pageX > bigWrapper.width() / 3)
							{
								isRunning = 1;
								bigWrapper.children('.pagination-wrapper').children('p').children('img').attr('src',settings.paginationImage);
								bigWrapper.children('.pagination-wrapper').children('p').children('img').eq(innerWrapper.children(eachSlides).eq(1).attr('data-target')).attr('src',settings.paginationActiveImage);
								//innerWrapper.animate({},settings.slideDuration, settings.animationType);
								innerWrapper.animate({'margin-left':bigWrapper.width() * (-1), 'left':0},settings.slideDuration, settings.animationType, function(){
									innerWrapper.children(eachSlides).eq(0).clone().appendTo(innerWrapper);
									innerWrapper.children(eachSlides).eq(0).remove();
									innerWrapper.css({'margin-left':0});
									isRunning = 0;
									msdSliderHeightWidth();
									isDragging = 0;
									innerWrapper.draggable('enable');
								});
							}
							else
							{
								innerWrapper.animate({'left':0},settings.slideDuration, settings.animationType,function(){
									isDragging = 0;
									innerWrapper.draggable('enable');
								});
							}
						}
						if(e.pageX - start > 0)
						{
							if(e.pageX -start > bigWrapper.width() / 3)
							{
								innerWrapper.animate({'left':bigWrapper.width()},settings.slideDuration, settings.animationType, function(){
									innerWrapper.children(eachSlides).eq(innerWrapper.children(eachSlides).length - 1).remove();
									innerWrapper.css({'margin-left':0, 'left':0});
									isRunning = 0;
									msdSliderHeightWidth();
									isDragging = 0;
									innerWrapper.draggable('enable');
								});
								bigWrapper.children('.pagination-wrapper').children('p').children('img').attr('src',settings.paginationImage);
								bigWrapper.children('.pagination-wrapper').children('p').children('img').eq(innerWrapper.children(eachSlides).eq(0).attr('data-target')).attr('src',settings.paginationActiveImage);
							}
							else
							{
								isRunning = 1;
								innerWrapper.animate({'margin-left':bigWrapper.width() * (-1), 'left':0},settings.slideDuration, settings.animationType, function(){
									innerWrapper.children(eachSlides).eq(0).remove();
									innerWrapper.css({'margin-left':0});
									isRunning = 0;
									msdSliderHeightWidth();
									isDragging = 0;
									innerWrapper.draggable('enable');
								});
							}
						}
					}
				});
			}
			
			$(window).load(function(e) {
                msdSliderHeightWidth();
				autoSlideFunc();
            });
			$(window).resize(function(e) {
                msdSliderHeightWidth();
            });
		});
	};
}(jQuery));