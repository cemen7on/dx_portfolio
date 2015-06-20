$(document).ready(function main(){
    // Fetch initialization data from document body is exist
    // (data has to be a json object)
    var dataString=document.body.textContent.trim(),
        dataJson=null;

    if(dataString.length){
        dataJson=JSON.parse(dataString);
    }

    document.body.textContent='';

    // When all scripts are loaded - init routes.
    // Routes is an object where:
    //  key is a path
    //  value is a controller's method to handle
    var routes={
        ''              :'Controllers.Main.index',
        'art/animations':'Controllers.Art.animations',
        'art/2d'        :'Controllers.Art.pictures2d',
        'art/3d'        :'Controllers.Art.art3d'
    };

    App.run(routes, dataJson);
});
