

var InfoBit = document.registerElement('info-bit', {
    prototype: Object.create(HTMLParagraphElement.prototype),
    extends: 'p'
});



var UsageTip = document.registerElement('usage-tip', {
    prototype: Object.create(HTMLParagraphElement.prototype),
    extends: 'p'
});




var ExampleLink = document.registerElement('example-link', {
    prototype: Object.create(HTMLAnchorElement.prototype),
    extends: 'a'
});


$(document).ready(function(){


  var ex_links = $('example-link');

  $(ex_links).each(function(ix, jqElement){

    $(jqElement).click(function(){

    var iframe = document.createElement('IFRAME');

    iframe.classList.add('content-frame');
    iframe.classList.add('right-window-full');

    var main = $('#main section')[0];

    $(main).html('');

    $(main).append(iframe);


        var frameState = $(main).find('iframe')[0];

        $(frameState).css('width', '100%');

        $(frameState).css('height', $(frameState).width() + 'px');

        var sectionHeader = $(main).find('header')[0];

        $(frameState).attr('src', $(jqElement).attr('href'));

        $(sectionHeader).text('');

            var pageTitle = $('h1.page-title')[0];
            $(pageTitle).text($(jqElement).text());


    });

  });

});
