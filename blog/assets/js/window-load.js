window.blogs = {
  data: []
};

function getBlogArray() {
  return window.blogs.data;
};

function getBlogs(callback) {

  var xmlhttp = new XMLHttpRequest();

  var data = window.blogs.data;

  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) { // XMLHttpRequest.DONE == 4
      if (xmlhttp.status == 200) {
        console.log('--BLOG-RESPONSE');
        data = JSON.parse(xmlhttp.responseText);
        console.info(data);

        if (callback) {
          callback(data);

        }
      } else if (xmlhttp.status == 400) {
        console.errr('blog-request error 400');
      } else {
        console.error('blog-request error --cause unknown');
      }
    }
  };

  xmlhttp.open("GET", "/blogs/all", true);
  xmlhttp.send();

};


function NormalLink(link) {

  var ql = link;

  while (ql.indexOf('-') >= 0) {
    ql = ql.replace('-', ' ');
  }
  return ql;
};


window.onload = function() {

  document.querySelector('#page-links').innerHTML = '';
  document.querySelector('#library-links').innerHTML = '';

  getBlogs(function(dataObject) {

    console.info(dataObject);

    var blogs = dataObject.blogs,
      main = dataObject.main;

    var blogLinks = '',
      mainLinks = '';

    for (var x = 0; x < blogs.length; x++) {
      blogLinks += `<li><a href="${'/' + blogs[x].path}">${NormalLink(blogs[x].name)}</a></li>`;
    }

    for (var x = 0; x < main.length; x++) {
      mainLinks += `<li><a href="${'/' + main[x].path}">${NormalLink(main[x].name)}</a></li>`;
    }

    document.querySelector('#page-links').innerHTML = blogLinks;
    document.querySelector('#library-links').innerHTML = mainLinks;
  });


  [].forEach.call(document.querySelectorAll('code'), function($code) {

    var lines = $code.textContent.split('\n');

    if (lines[0] === '') {
      lines.shift()
    }

    var matches;
    var indentation = (matches = /^[\s\t]+/.exec(lines[0])) !== null ?
      matches[0] :
      null;
    if (!!indentation) {
      lines = lines.map(function(line) {
        line = line.replace(indentation, '')
        return line.replace(/\t/g, '    ')
      });

      $code.textContent = lines.join('\n').trim();
    }
  });


};