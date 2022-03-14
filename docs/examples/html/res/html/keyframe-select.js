class KeyframeSelect extends HTMLElement {
  constructor() {
    super();

  }
  connectedCallback() {
    this.domElement = document.createElement('select');

    this.values = ['quadratic-in', 'cubic-in'];

    var dom = this.domElement;

    this.style.background = 'black';

    this.values.forEach(function(v) {
      var option = document.createElement('option');
      option.innerHTML = v;
      dom.appendChild(option);
    });

    this.appendChild(this.domElement);
  }
}


customElements.define('keyframe-select', KeyframeSelect);