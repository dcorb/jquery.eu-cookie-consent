/**
 * jQuery EU Cookie Consent v0.9
 * https://github.com/dcorb/eu-cookie-consent
 * (c) 2016 David Corbacho
 * @license MIT
 */

;(function ($, undefined){
  'use strict';

  var _createLink = function(href, val, clas) {
    return $("<a />", {
      'href' : href,
      'text' : val,
      'class' : clas
    })[0].outerHTML;
  };

  // Replace {{variable}}s with their values
  // Inspired on http://stackoverflow.com/questions/14879866/javascript-templating-function-replace-string-and-dont-take-care-of-whitespace
  var _tpl = function(str, tokens) {
    return str.replace(/\{\{([^}]+)\}\}/g, function(wholeMatch, key) {
      var subst = tokens[$.trim(key)];
      return (subst === undefined ? wholeMatch : subst);
    });
  };

  $.EUCookie = function(options) {
    var $el,
      now,
      storage,
      $doc = $(document),
      once = true,
      opts = {
        message: 'This website uses cookies. By using this website we assume you are ok with this.',
        acceptBtn: 'OK',
        links: [],
        theme: 'dark',
        expiryDays: 365,
        hideOnScroll: true,
        hideOnAnyClick: true,
        scrollDelay: 3000,
        debug:false, // don't persist while debugging
        beforeShowFn: function() {
          // return true, to give permission to show.
          return true;
        },
        afterShowFn: $.noop // You can use $(this) here to reference the container
      };

    $.extend(opts, options);

    var self = {
      init: function () {

        if (now){
          return; // already initialized
        }
        now = new Date();

        if (typeof jQuery.fn.on === "undefined") { // Support for < jQuery 1.7
          $.fn.on = jQuery.fn.bind;
          $.fn.off = jQuery.fn.unbind;
        }

        // Feature detect + local reference
        // Based on https://mathiasbynens.be/notes/localstorage-pattern
        var exception;
        var fail;
        var uid = now;
        try {
          (storage = window.localStorage).setItem(uid, uid);
          fail = storage.getItem(uid) != uid;
          storage.removeItem(uid);
          fail && (storage = false);
        } catch (exception) {
          exception = e;
        }

        if (self.valid() && opts.beforeShowFn(opts, storage, exception)) {
          self.show();
          $doc.on('click.EUc', '.EUc__btn', self.accept);
          if (opts.hideOnScroll) {
            // Give a bit of time to attach the handler. Sometimes scroll is triggered by browser at loading,
            // because of scrolling down to an #anchor, for example
            setTimeout(function () {
              $doc.on('scroll.EUc', self.accept);
            }, opts.scrollDelay);
          }
          if (opts.hideOnAnyClick) {
            $doc.on('click.EUc', self.accept);
          }
          // React to localStorage event, when the cookieEU value has been stored in other tab/window
          $(window).on('storage', function(e) {
            if (e.originalEvent.key === 'EUcookie') {
              self.accept();
            }
          });
        }
      },

      show: function () {
        var links = {
          'link_1' : undefined,
          'link_2' : undefined
        };
        $.each(links, function (index, value) {
          if (typeof (opts.links[index]) !== 'undefined'){
            links[index] = _createLink(opts.links.index, opts.links[index + '_text'], 'EUc__' + index);
          }
        });
        var button = _createLink('#', opts.acceptBtn, 'EUc__btn');
        var inner = button + '<div class="EUc__message">' + _tpl(opts.message, links) + '</div>';
        $el = $('<div class="EUc initialEffect ' + opts.theme + '">' + inner + '</div>');
        $el.appendTo('body');

        // use proxy to provide useful context (this)
        $.proxy(opts.afterShowFn, $el)();
      },

      valid: function () {
        var ret = false;
        if (storage) {
          var stored = JSON.parse(storage.getItem('EUcookie'));
          // check it has not expired
          // Inspired on https://gist.github.com/porkeypop/1096149
          ret = !stored || (stored && !!stored.stamp && (now.getTime() < stored.stamp));
        }
        return ret;
      },

      accept: function (e) {
        // protect against multiple events.
        if (once) {
          once = false;
          $doc.off('click.EUc scroll.EUc');
          // use proxy to provide useful context (this)
          self.hide();
          self.persist();
        }
      },

      hide: function() {
        if ($el.length){
          $el.removeClass('initialEffect');
          // needed to trigger a reverse CSS keyframe animation
          setTimeout(function(){
            $el.addClass('hideBar');
          },0);
          setTimeout(function(){
            $el.remove();
          },1000); // animation ends at 500ms, give margin in case of custom CSS
        }
      },

      persist: function () {
        if (storage && !opts.debug) {
          storage.setItem('EUcookie', JSON.stringify({stamp: now.toUTCString()}));
        }
      },

      destroy: function () { // for external use. Destroys localStorage too!
        $el.remove();
        storage.removeItem('EUcookie');
      }
    };

    return self;
  }

})(jQuery, undefined);
