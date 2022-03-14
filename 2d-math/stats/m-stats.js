
let stats = document.querySelectorAll('div.stat');

//show stats, which are invisible by default
setTimeout(function(){

  stats.forEach((dom)=>{
    dom.style.display = 'inline-block';
    dom.style.left = '10px';
    dom.querySelectorAll('canvas').forEach(function(item){
      item.style.border = '3px ridge grey';
    });
  });

}, 200);
