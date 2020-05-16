





window.addTestButton = function(value, onClick){

  var index = document.querySelectorAll('.gl-test-button').length || 0;

  var button = document.createElement('button');
  button.classList.add('gl-test-button');
  button.innerText = value.toUpperCase();
  button.style.position = 'absolute';
  button.style.bottom = '11px';
  button.style.left = (index * 155 + 11) + 'px';
  button.style.width = '130px';
  button.style.height = '30px';
  button.style.fontSize = '10px';
  button.style.color = 'lightgrey';
  button.style.background = '#222';
  button.style.border = '1px ridge #444';



  button.onclick = function(){

        var testbuttons = document.querySelectorAll('.gl-test-button');

        if(testbuttons && testbuttons.length)
        {
          testbuttons.forEach(function(btn){

                btn.style.border = '1px ridge #444';
                btn.style.color = 'lightgrey';

          });
        }

        this.style.border = '2px ridge teal';
          this.style.color = 'lightblue';

        onClick();

  };

  document.body.appendChild(button);

};
