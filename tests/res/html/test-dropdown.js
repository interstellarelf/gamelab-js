

window.addTestDropdown = function(kvs, labelText) {
  var index = document.querySelectorAll('.gl-test-button').length || 0;
  var button = document.createElement('select');
  button.classList.add('gl-test-button');


  var label = document.createElement('label');
  label.style.color = 'lightgrey';
  label.innerText = labelText;

  for (var x in kvs) {
    var option = document.createElement('option');
    option.innerText = x;
    option.style.fontSize = '11px';
    option.style.color = 'lightgrey';
    option.style.background = '#222';
    option.style.border = '1px ridge #444';
    button.appendChild(option);
  }

  button.style.position = 'absolute';
  button.style.bottom = '11px';
  label.style.position = 'absolute';
  label.style.bottom = '40px';
  button.style.left = (index * 155 + 11) + 'px';
  label.style.left = button.style.left;
  button.style.width = '130px';
  button.style.height = '30px';
  button.style.fontSize = '11px';
  button.style.color = 'lightgrey';
  button.style.background = '#222';
  button.style.border = '1px ridge #444';

  button.kvs = kvs;


  button.addEventListener('change', function(evt) {
    var obj = evt.target;
    var value = obj.options[obj.selectedIndex].text;

    if(kvs.hasOwnProperty(value)){
      kvs[value]();
    };

  });



  document.body.appendChild(label);
  document.body.appendChild(button);

  return button;
};
