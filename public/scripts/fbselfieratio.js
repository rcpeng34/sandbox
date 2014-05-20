window.photoArray = [];
window.photosByYou = 0;
window.photosByOthers = 0;
window.username;

define(['facebook'], function(){
  // initializes fb call
  FB.init({
    appId : '711138455590961', // this app id might need to be hidden at some point
  });
  FB.login(function(response){
    if(response.authResponse){
      // if window.username is undefined, set it
      if(!window.username){
        FB.api('/me', function(res){
          window.username = res.name;
          console.log('window.username', window.username);
        });
      }
      // do not nest the api calls because even if you should nest the callbacks or use promisify...
      // the api call below is much slower: 400 photo objects vs in window.username.
      FB.api('/me/photos?limit=400', function(res){
        window.photoArray.push(res.data);
        // with more time, this is where to begin logic to grab data from pagination
        // note that total photos is only 400 so it's hardcoded for the purpose of the hackathon
        // you can call getNextPage and break when the last item in the array has lengh < the limit in '/me/photos?limit=x'
        console.log('Completed photo fetch');
        // in case of pagination, assume window.photoArray is an array of arrays (the pages)
        for (var i = 0; i < window.photoArray.length; i++ ) {
          // run through the loop and increment photographer counters
          for (var j = 0; j < window.photoArray[i].length; j++) {
            if (window.photoArray[i][j].from.name === window.username) {
              window.photosByYou++;
            } else {
              window.photosByOthers++;
            }
          }
        }
        console.log('Photographer count is complete');
      });
    } else {
       console.log('User cancelled login or did not fully authorize.');      
    }
  }, {scope: ['user_photos']});
});


// this is an incomplete method to grab data from the next page
// return a bool on whether it is the last page and the next page's url if not null
// it should accept as argument the array to push to
// note this is not necessary for this purpose
var getNextPage = function(nextURL) {
  $.ajax({
    url: res.paging.next, complete: function(res) {
      window.photoArray.push(JSON.parse(res.responseText).data);
      console.log('page get call returned and pushed');
      return res.paging.next;
    }
  });
};