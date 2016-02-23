# EU Cookie Consent #
Use this tiny jQuery plugin to add a bottom bar to inform your visitors about your cookie policy.


## Features ##
Tiny
    JS 2KB minified
    JS 1KB minified & gzipped
    CSS 2KB minified
    CSS 0.7KB minified & gzipped
Accept on Scroll
Accept on Any Click
Responsive CSS
Animated
2 themes: dark / light
Multiple ways to hook your custom JavaScript or initialize it.
Easily add Geo localization 

## localStorage ##
This plugin uses `localStorage` and because of not using cookies, it fits better for high-traffic websites with caching systems like Varnish.
But <strong> you won't be able to detect from the server</strong> if the user accepted or not the cookies usage.
A nice extra feature is that if user consent the usage cookies in one browser tab, the message will be hidden in other already opened tabs.


## Installation ##
```
...
<script src="jquery.eu-cookie-consent.min.js"></script>
...
<link rel="stylesheet" href="css/jquery.columntoggle.min.css" />
....
```

## Usage ##
See, that we call `init()` method. This gives you a better control. See Full example at the bottom.
```
...
$.EUCookie({
'acceptBtn' : 
    'acceptBtn': 'Ok!',
    'message': 'We use cookies to give you the best personalised experience. Check {{ link_1 }} to find out more.'
    'links' {
        'link_1' : '/cookie-policy' // relative or Absolute URL
        'link_1_text' : 'our cookie policy'
    }
}).init();
...
```
This is not a traditional jQuery plugin. Don't use it as `<stroke>jQuery('selector').EUCookie.</stroke>`

## Options ##


`message`: Default: ````'This website uses cookies. By using this website we assume you are ok with this.'````
You can use HTML and placeholders `{{link_1}}` and `{{link_2}}` to be replaced with your own links.

`links`: Default ````{}````. Object that optionally can contain these 4 keys: `{{link_1}}`, `{{link_1_text_}}`, `{{link_2}}`, `{{link_2_text}}`. See examples on how to use it. 

`acceptBtn`: Default ````'Ok'````. Text on the Accept Button. 

`theme`: Default ````'dark'````. Theme of the cookie message. `'dark'` or `'light'`

`expiryDays`: Default ````365````. Number of days until the message is displayed again.

`hideOnAnyClick`: Default ````true````. Hide on any click on the website.

`hideOnScroll`: Default ````true````. Hide on Scroll. 

`scrollDelay`: Default ````3000````. Initial delay (in milliseconds) until the scroll starts to be tracked. It prevents that accidental (or browser-initiated) scrolling hides the message without the user noticing. <em>Default value: 2000 (2 seconds)

`beforeShowFn`: Default: `function() { return true; }` . Function where you can hook any logic before message is shown. Must return `true` to give permission to show the message. 

`afterShowFn`: Default: `$.noop` . Function where you can hook any logic after message is shown

`debug`: Default: `false` . If debug is enabled, it won't store (persist) the user consent, displaying again after a page refresh.

     

## Full Example ##


```
...
// Save it in a variable, so later we call it with .init()
var $EUCookie = $.EUCookie({
'acceptBtn' : 
    'acceptBtn': 'Ok!',
    'message': 'We use cookies to give you the best personalised experience. Check {{ link_1 }} and {{ link_2 }} _to find out more.'
    'links' {
        'link_1' : '/cookie-policy' 
        'link_1_text' : 'our cookie policy'
        'link_2' : '/terms'
        'link_2_text' : 'terms and conditions'
    }
    'theme': light',
    'expiryDays': 180,
    'hideOnAnyClick': false,
    'hideOnScroll': true,
    'scrollDelay': 4000,
    'beforeShowFn': function($el){
       // Notice, the first argument is the the element, wrapped as a jQuery object.
       $el.addClass('EUc--metro'); // a Windows metro style
       
       // return true to show the message. Otherwise
       return true;
    },
    'afterShowFn': function($el){
       // you can trigger here some analytics ? or add your own events 
       $el.find('.EUc__btn').on('click', function() {
         // user clicked the Ok button
       });
    },
    
});

// Check if user is in EU (users who are actually subject to the cookie law)
// Other free services: commando.io, freegeoip, maxmind geocity lite, ip2location, eurekAPI, DB-IP, ip-api.com, ipinfo.io, 
// Check their terms and conditions, before using a Geo location service. 
$.get("http://freegeoip.net/json/", function (response) {
    var EU_COUNTRY_CODES = ['AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'GR', 'ES', 'FI', 'FR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'RO', 'SK', 'SL', 'SE', 'SI', 'GB'];
    if (response.country_code && $.inArray(response.country_code), EU_COUNTRY_CODES) > 0) {
       $EUCookie.init();
    }
}, "jsonp");




// Other public methods:
// --------------------------

// $EUCookie.remove();  // hides the message 

// $EUCookie.destroy(); // hides the message and deletes the persistent localStorage key

...
```



