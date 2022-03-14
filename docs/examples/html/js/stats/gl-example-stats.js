
Stats.showAll = function(){

    let top = '2px', left = '20%';

    let stats = document.querySelectorAll('div.stat');

    stats.forEach((dom)=>{
      dom.style.marginTop = top;
      dom.style.left = left;
      dom.style.display = 'inline-block';
    });
};
