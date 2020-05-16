

module.exports = {

  basePath:'./../../Projects/'

  clean_folder_name:function(name){

    return name.replace(' ', '_')

  },

  loop:function(object, callback){

    for(var x in object)
    {
      if(object.hasOwnProperty(x) && typeof object[x] == 'string')
      {
        //object is name of project-folder
          this.create_folder(this.basePath, this.clean_folder_name(x));
      }

      else if(object[x] instanceof Object && object[x].type)
      {

        switch(object[x].type)
        {

          case 'image/png':

          break;

          case 'text/json':

          break;

        }

      }
    }

  },

  create_folder:function(basePath, name){
  
  },

  SaveProject:function(){

  }
  ,

  GetProject:function(){

  }
};
