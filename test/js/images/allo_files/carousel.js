jQuery.fn.carousel = function() {
  return this.each (function () {
    var carousel       = $(this);
    var buttonPrev     = $('#prev a', carousel);
    var buttonNext     = $('#next a', carousel);
    var paymentMethods = $('#payment-methods', carousel);
    var list           = $('ul', paymentMethods);
    
    var pos                     = 0;
    var posReference            = null;
    var sizeSide                = null;
    var windowsSide             = null;
    var paymentMethodsDimension = null;
    var boxDimension            = null;
    var listSide                = null;
    var visibleBoxCount         = null;
    var step                    = null;
    var animSpeed               = null;
    var overflow                = null;

    $('#carousel #payment-methods a').live('click', function(e) {
      if (e.which == 3) {
        return true;
      }
      
      li = $(this).parent('li')
          
      if (li.hasClass('active')) {
        return false;
      }
          
      $('li', list).removeClass('active');
      li.addClass('active');

      content = $('#content');
      
      url = $(this).attr('href');

      //draw the timer
      content.html('<div id="method-loading"></div>');

      $.get(
        url,
        null,
        function(data) {
            content.html($(data).find('#content').html());
        }
      );
    
      return false;
    });

    buttonPrev.live('click', function(e) {
      if (e.which == 3) {
        return true;
      }

      if (!isEnabledButton(buttonPrev)) {
        return false;
      }

      pos += step;
      moveList();
      return false;
    });

    buttonNext.live('click', function(e) {
      if (e.which == 3) {
        return true;
      }

      if (!isEnabledButton(buttonNext)) {
        return false;
      }

      pos -= step;
      moveList();
      return false;
    });

    function moveList() {
      var option = {};

      if (posReference == 'left') {
        option.left = pos;
      } else {
        option.top = pos;
      }

      list.animate(option, animSpeed, null, manageMoveLinks());
    }

    function disableButton(button) {
      if (button.hasClass('enable')) {
        button.removeClass('enable');
        button.css('cursor', 'default');
      }
    }

    function enableButton(button) {
      if (!button.hasClass('enable')) {
        button.addClass('enable');
        button.css('cursor', 'pointer');
      }
    }
    
    function isEnabledButton(button) {
      if (button.hasClass('enable')) {
        return 'true';
      }

      return false;
    }

    function manageMoveLinks(afterResize) {
      currentWindowsSide = eval('$(window).' + sizeSide + '()');

      initVisibleBoxCount();

      if (pos == 0) {
        disableButton(buttonPrev);
      } else {
        enableButton(buttonPrev);
      }

      if ((listSide - getPaymentSide() + pos) > 0) {
        enableButton(buttonNext);
        overflow = false;
      } else if (currentWindowsSide !== windowsSide) {
        disableButton(buttonNext);

        if (overflow == false && afterResize === true) {
          if (listSide - getPaymentSide() <= 0) {
            pos = 0;
            list.css(posReference, pos);
            disableButton(buttonPrev);

            overflow = true;
          }
        }
      } else {
          if (listSide - getPaymentSide() + pos < 0) {
            disableButton(buttonNext);
          }
      }

      windowsSide = currentWindowsSide;
    }
    
    function getPaymentSide() {
        if (sizeSide == 'width') {
          side = eval('paymentMethods.' + sizeSide + '()');
        } else {
          side = buttonNext.offset().top - buttonPrev.height();
        }

        return side;
    }
    
    function initVisibleBoxCount() {
        
        paymentMethodsDimension = getPaymentSide();
        visibleBoxCount = parseInt(paymentMethodsDimension / boxDimension, 10);
        step = boxDimension * visibleBoxCount;
        animSpeed = visibleBoxCount * 130;
    }

    function init() {
      buttonPrev     = $('#prev a', carousel);
      buttonNext     = $('#next a', carousel);
      paymentMethods = $('#payment-methods', carousel);
      list           = $('ul', paymentMethods);

      if (carousel.hasClass('in-row')) {
        posReference = 'left';
        sizeSide     = 'width';
        boxDimension  = parseInt(eval('$("a:first", paymentMethods).width()'), 10);
      } else {
        posReference = 'top';
        sizeSide     = 'height';
        boxDimension  = parseInt(eval('$("a:first", paymentMethods).height()') + 1, 10);
      }
      listSide = $('li', list).length * boxDimension;
      list.css(sizeSide, listSide);
      initVisibleBoxCount();

      manageMoveLinks();
    }

    /* Fix remove outline in ie6 */
    $('a').live('click', function() {
      this.blur();
      return true;
    });

    $(window).bind('resize', function() {
      manageMoveLinks(true);
    });

    init();
  });
}
