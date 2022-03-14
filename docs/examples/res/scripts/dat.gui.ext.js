

/***************************************
* dat.GUI :: addButton()
* function: add single button w/ onclick event
***************************************/

dat.GUI.prototype.addButton =function(text, onclick){
  let li = document.createElement('li'),
  button = document.createElement('button');
  button.style.color = 'lightgrey';
  button.style.width = '100%';
  button.style.height = '90%';
  button.style.background = '#222';
  button.style.border = '1px solid grey';
  button.innerText = text;
  button.onclick = onclick;
  li.appendChild(button);
  console.info(this.domElement);
  this.domElement.querySelectorAll('ul')[0].appendChild(li);
};

/***************************************
* dat.GUI :: addFileInput()
* function: add single file input w/ onchange event
***************************************/

dat.GUI.prototype.addFileInput =function(text, onchange){
  let li = document.createElement('li'),
  hiddenFile = document.createElement('input');
  hiddenFile.type = 'file';
  hiddenFile.id = 'hidden-file';
  hiddenFile.onchange = onchange;

  let label = document.createElement('label');
  label.innerText = text;
  label.style.display = 'block';
  label.style.color = 'lightgrey';
  label.style.width = '100%';
  label.style.height = '90%';
  label.style.background = '#222';
  label.style.border = '1px solid grey';

  label.for = hiddenFile.id;

  label.appendChild(hiddenFile);
  li.appendChild(label);
  console.info(this.domElement);
  this.domElement.querySelectorAll('ul')[0].appendChild(li);
};


/***************************************
* dat.GUI :: addFontInput()
* function: add single font-file input w/ onchange event
***************************************/

dat.GUI.prototype.addFontInput = function(text, onchange){
  this.addFileInput(text, function (evt) {
    var file = evt.target.files[0];
    SpriteBuilderProgram.surfaceFont = file;
    for (var x = 0; x < files.length; x++) {
      var $reader = new FileReader();
      var f = files[x];

      $reader.addEventListener("load", function () {
        var fontStyle = document.createElement('style');
        if (!['ttf', 'otf', 'woff', 'eot'].includes(f.name.split('.').pop().toLowerCase())) {
          console.error('Incorrect file type');
        }
        fontStyle.innerText = "@font-face {\nfont-family : surfaceFont;\nsrc : url(data:font/ttf;base64," + this.result + ");\n};";

        onchange(fontStyle);

      });
      $reader.readAsDataURL(f);
    }
  });

}
