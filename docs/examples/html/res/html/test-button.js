


window.addTopButton = function(value, onClick){

    var index = document.querySelectorAll('.gl-top-item').length || 0;

    var button = document.createElement('button');
    button.classList.add('gl-top-item');
    button.innerText = value.toUpperCase();
    button.style.position = 'absolute';
    button.style.top = (55 + (index * 45)) + 'px';
    button.style.left = '11px';
    button.style.width = '130px';
    button.style.height = '30px';
    button.style.fontSize = '10px';
    button.style.color = 'lightgrey';
    button.style.background = '#111';
    button.style.border = '1px ridge #444';

    button.onclick = function(){
          var testbuttons = document.querySelectorAll('.gl-top-item');
          this.style.border = '2px ridge teal';
            this.style.color = 'lightblue';
          onClick();
    };

    document.body.appendChild(button);
};



window.addTopTextbox = function(labelText, value, onCreate, onClick){

    var index = document.querySelectorAll('.gl-top-item').length || 0;

    var textbox = document.createElement('input'),
    label = document.createElement('label');
    label.innerText = labelText;

    textbox.type = 'text';
    textbox.classList.add('gl-top-item');
    textbox.innerText = value;
    textbox.style.position = 'absolute';
    label.style.position = 'absolute';
    textbox.style.color = 'lightgrey';
    textbox.style.top = (75 + (index * 45)) + 'px';
    label.style.top = (75 + (index * 45) - 15) + 'px';
    label.style.left = '11px';
    textbox.style.left = '11px';
    textbox.style.width = '130px';
    textbox.style.height = '25px';
    textbox.style.fontSize = '10px';
    textbox.style.background = '#111';
    textbox.style.border = '1px ridge #444';

    onCreate.bind(textbox).call();

    textbox.addEventListener('change', function(){

      onClick.bind(this).call();

    });

  document.body.appendChild(label);
    document.body.appendChild(textbox);
};



window.addTopSpan = function(labelText, value, onCreate){

    var index = document.querySelectorAll('.gl-top-item').length || 0;

    var span = document.createElement('span'),
    label = document.createElement('label');
    label.innerText = labelText;

    span.type = 'text';
    span.classList.add('gl-top-item');
    span.innerText = value;
    span.style.position = 'absolute';
    label.style.position = 'absolute';
    span.style.color = 'lightgrey';
    span.style.top = (75 + (index * 45)) + 'px';
    label.style.top = (75 + (index * 45) - 15) + 'px';
    label.style.left = '11px';
    span.style.left = '11px';
    span.style.width = '130px';
    span.style.height = '25px';
    span.style.fontSize = '10px';
    span.style.background = '#111';
    span.style.border = '1px ridge #444';

    onCreate.bind(span).call();

  document.body.appendChild(label);
    document.body.appendChild(span);

    return span;
};


window.addTestButton = function(value, onClick){

  var index = document.querySelectorAll('.gl-test-item').length || 0;

  var button = document.createElement('button');
  button.classList.add('gl-test-item');
  button.innerText = value.toUpperCase();
  button.style.position = 'absolute';
  button.style.bottom = '11px';
  button.style.left = 55 + (index * 45 + 11) + 'px';
  button.style.width = '130px';
  button.style.height = '30px';
  button.style.fontSize = '10px';
  button.style.color = 'lightgrey';
  button.style.background = '#222';
  button.style.border = '1px ridge #444';

  button.onclick = function(){
        var testbuttons = document.querySelectorAll('.gl-test-item');
        this.style.border = '2px ridge teal';
          this.style.color = 'lightblue';
        onClick();
  };

  document.body.appendChild(button);
};



window.createRadioButton = function(value, onClick){

    var button = document.createElement('button');

    button.classList.add('radio');
    button.innerText = value.toUpperCase();
    button.style.position = 'relative';

    button.style.width = '130px';
    button.style.height = '30px';
    button.style.fontSize = '9px';
    button.style.color = 'lightgrey';

    button.style.padding = '2px';

    button.style.background = ' url(images/unchecked.png), url(images/button-background.png)';
    button.style.backgroundSize = '16px 16px, 100% 100%';
    button.style.backgroundPosition = 'right center, right top';
    button.style.backgroundRepeat = 'no-repeat, repeat';

    button.style.textAlign = 'left';
    button.setAttribute('data-selected', 0);
    button.style.border = '1px solid grey';

    button.select = function(){

                var selected = 1;

                this.setAttribute('data-selected', selected);

                this.style.border = '2px solid teal';
                this.style.color = 'lightblue';

                button.style.background = ' url(images/radio.png), url(images/button-background.png)';
                button.style.backgroundSize = '16px 16px, 100% 100%';
                button.style.backgroundPosition = 'right center, right top';
                button.style.backgroundRepeat = 'no-repeat, repeat';

    };


        button.deselect = function(){

                    var selected = 0;

                    this.setAttribute('data-selected', selected);


                      this.style.border = '2px solid grey';
                      this.style.color = 'lightgrey';

                      button.style.background = ' url(images/unchecked.png), url(images/button-background.png)';
                      button.style.backgroundSize = '16px 16px, 100% 100%';
                      button.style.backgroundPosition = 'right center, right top';
                      button.style.backgroundRepeat = 'no-repeat, repeat';

        };


    button.onclick = function(){

          var selected = this.getAttribute('data-selected');

          selected = selected == 0 ? 1 : 0;

          this.setAttribute('data-selected', selected);

          if(selected == 1)
          {
            this.style.border = '2px solid teal';
            this.style.color = 'lightblue';

            button.style.background = ' url(images/radio.png), url(images/button-background.png)';
            button.style.backgroundSize = '16px 16px, 100% 100%';
            button.style.backgroundPosition = 'right center, right top';
            button.style.backgroundRepeat = 'no-repeat, repeat';
          }
          else{
            this.style.border = '2px solid grey';
            this.style.color = 'lightgrey';

            button.style.background = ' url(images/unchecked.png), url(images/button-background.png)';
            button.style.backgroundSize = '16px 16px, 100% 100%';
            button.style.backgroundPosition = 'right center, right top';
            button.style.backgroundRepeat = 'no-repeat, repeat';
          }
          onClick.bind(this).call();
    };
    return button;
};


window.createCheckButton = function(value, onClick){

    var button = document.createElement('button');

    button.classList.add('radio');
    button.innerText = value.toUpperCase();
    button.style.position = 'relative';

    button.style.width = '130px';
    button.style.fontSize = '8px';
    button.style.color = 'lightgrey';
    button.style.padding = '3px';
    button.style.margin = '0px';
    button.style.background = ' url(images/unchecked.png), url(images/button-background.png)';
    button.style.backgroundSize = '16px 16px, 100% 100%';
    button.style.backgroundPosition = '85% center, right top';
    button.style.backgroundRepeat = 'no-repeat, repeat';
    button.style.textAlign = 'left';
    button.setAttribute('data-selected', 0);
    button.style.border = '1px solid grey';


    button.select = function(){

                var selected = 1;

                this.setAttribute('data-selected', selected);

                this.style.border = '2px solid teal';
                this.style.color = 'lightblue';

                button.style.background = ' url(images/checked.png), url(images/button-background.png)';
                button.style.backgroundSize = '16px 16px, 100% 100%';
                button.style.backgroundPosition = '85% center, right top';
                button.style.backgroundRepeat = 'no-repeat, repeat';

    };


        button.deselect = function(){

                    var selected = 0;

                      this.setAttribute('data-selected', selected);

                      this.style.border = '2px solid grey';
                      this.style.color = 'lightgrey';

                      button.style.background = ' url(images/unchecked.png), url(images/button-background.png)';
                      button.style.backgroundSize = '16px 16px, 100% 100%';
                      button.style.backgroundPosition = '85% center, right top';
                      button.style.backgroundRepeat = 'no-repeat, repeat';

        };


    button.onclick = function(){

          var selected = this.getAttribute('data-selected');

          selected = selected == 0 ? 1 : 0;

          this.setAttribute('data-selected', selected);

          if(selected == 1)
          {
            this.select();
          }
          else{
            this.deselect();
          }

          onClick.bind(this).call();

    };

    return button;


};



window.addBooleanButton = function(value, onClick){

  var index = document.querySelectorAll('.gl-test-item').length || 0;

  var button = document.createElement('button');
  button.classList.add('gl-test-item');
  button.innerText = value.toUpperCase();
  button.style.position = 'absolute';
  button.style.bottom = '11px';
  button.style.left = (index * 155 + 11) + 'px';
  button.style.width = '130px';
  button.style.height = '30px';
  button.style.fontSize = '10px';
  button.style.color = 'lightgrey';

  button.style.background = ' url(images/unchecked.png), url(images/button-background.png)';
  button.style.backgroundSize = '16px 16px, 100% 100%';
  button.style.backgroundPosition = 'right center, right top';
  button.style.backgroundRepeat = 'no-repeat, repeat';


  button.style.border = '1px ridge #444';

  button.style.textAlign = 'left';

  button.setAttribute('data-selected', 0);

  button.style.border = '2px solid grey';
  button.style.color = 'lightgrey';

  button.onclick = function(){

        var testbuttons = document.querySelectorAll('.gl-test-item');

        var selected = this.getAttribute('data-selected');

        selected = selected == 0 ? 1 : 0;

        this.setAttribute('data-selected', selected);

        if(selected == 1)
        {
          this.style.border = '2px solid teal';
          this.style.color = 'lightblue';

          button.style.background = ' url(images/checked.png), url(images/button-background.png)';
          button.style.backgroundSize = '16px 16px, 100% 100%';
          button.style.backgroundPosition = 'right center, right top';
          button.style.backgroundRepeat = 'no-repeat, repeat';
        }
        else{
          this.style.border = '2px solid grey';
          this.style.color = 'lightgrey';

          button.style.background = ' url(images/unchecked.png), url(images/button-background.png)';
          button.style.backgroundSize = '16px 16px, 100% 100%';
          button.style.backgroundPosition = 'right center, right top';
          button.style.backgroundRepeat = 'no-repeat, repeat';
        }

        onClick();

  };

  document.body.appendChild(button);

};





window.addTopBooleanButton = function(value, onClick){

  var index = document.querySelectorAll('.gl-top-item').length || 0;

  var button = document.createElement('button');
  button.classList.add('gl-top-item');
  button.innerText = value.toUpperCase();
  button.style.position = 'absolute';
  button.style.bottom = '11px';
  button.style.top = (75 + (index * 55)) + 'px';
  button.style.left = '11px';
  button.style.width = '130px';
  button.style.height = '30px';
  button.style.fontSize = '10px';
  button.style.color = 'lightgrey';

  button.style.background = ' url(images/unchecked.png), url(images/button-background.png)';
  button.style.backgroundSize = '16px 16px, 100% 100%';
  button.style.backgroundPosition = 'right center, right top';
  button.style.backgroundRepeat = 'no-repeat, repeat';


  button.style.border = '1px ridge #444';

  button.style.textAlign = 'left';

  button.setAttribute('data-selected', 0);

  button.style.border = '2px solid grey';
  button.style.color = 'lightgrey';

  button.onclick = function(){


        var selected = this.getAttribute('data-selected');

        selected = selected == 0 ? 1 : 0;

        this.setAttribute('data-selected', selected);

        if(selected == 1)
        {
          this.style.border = '2px solid teal';
          this.style.color = 'lightblue';

          button.style.background = ' url(images/checked.png), url(images/button-background.png)';
          button.style.backgroundSize = '16px 16px, 100% 100%';
          button.style.backgroundPosition = 'right center, right top';
          button.style.backgroundRepeat = 'no-repeat, repeat';
        }
        else{
          this.style.border = '2px solid grey';
          this.style.color = 'lightgrey';

          button.style.background = ' url(images/unchecked.png), url(images/button-background.png)';
          button.style.backgroundSize = '16px 16px, 100% 100%';
          button.style.backgroundPosition = 'right center, right top';
          button.style.backgroundRepeat = 'no-repeat, repeat';
        }

        onClick();

  };

  document.body.appendChild(button);

};


window.addContainer = function(title_text, onCreate){

    var index = document.querySelectorAll('.gl-test-item').length || 0;

    var title = document.createElement('label');
    title.innerText = title_text;
    title.style.fontSize = '14px';
    title.style.padding = '4px';
    title.style.width = '100%';
    title.style.textAlign = 'left';
    title.style.color = 'lightgrey';
    var container =  document.createElement('div');

    container.classList.add('gl-test-item');

    container.style.paddingTop = '15px';

    container.appendChild(title);

    container.style.position = 'absolute';
    container.style.bottom = '11px';
    container.style.left = (index * 145 + 11) + 'px';
    container.style.width = '130px';
    container.style.minHeight = '30px';
    container.style.fontSize = '10px';
    container.style.color = 'lightgrey';

    container.style.background = '#222';


    container.style.border = '1px ridge #444';

    container.style.textAlign = 'left';

    container.style.border = '2px solid grey';
    container.style.color = 'lightgrey';

    document.body.appendChild(container);

    if(onCreate)
    {

        onCreate.bind(container).call();

    }


    return container;


};




window.addRightContainer = function(title_text, onCreate){

    var index = document.querySelectorAll('.gl-test-right-item').length || 0;

    var title = document.createElement('label');
    title.innerText = title_text;
    title.style.fontSize = '14px';
    title.style.padding = '4px';
    title.style.width = '100%';
    title.style.textAlign = 'left';
    title.style.color = 'lightgrey';
    var container =  document.createElement('div');

    container.classList.add('gl-test-right-item');

    container.style.paddingTop = '15px';

    container.appendChild(title);

    container.style.position = 'absolute';
    container.style.bottom = '11px';
    container.style.right = (index * 145 + 11) + 'px';
    container.style.width = '130px';
    container.style.minHeight = '30px';
    container.style.fontSize = '10px';
    container.style.color = 'lightgrey';

    container.style.background = '#222';


    container.style.border = '1px ridge #444';

    container.style.textAlign = 'left';

    container.style.border = '2px solid grey';
    container.style.color = 'lightgrey';

    container.style.maxHeight = '400px';
    container.style.overflowY = 'scroll';
    container.style.overflowX = 'hidden';

    document.body.appendChild(container);

    if(onCreate)
    {

        onCreate.bind(container).call();

    }


};
