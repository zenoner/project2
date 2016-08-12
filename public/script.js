//didnt work, gonan try something else.
//variable group
 var cList = $('ul.author')

$(document).ready(function() {
  console.log('loaded!!!')


  $('#submit_button').click(function(e){
   e.preventDefault();
   var query = $('#person').val()
   query = query.replace(' ','+')
   console.log(query)
   var myurl = "https://www.googleapis.com/books/v1/volumes?q="+query+"&callback=?"

   // console.log(myurl)

    $.getJSON(myurl,function(data){ //this is just like an ajax call, syntax is a bit different, but same results.
      console.log(data)
      // debugger
      var array_of_titles = []
      var $ul = $('<ul>');
      data.items.forEach(function(result){
        array_of_titles.push(result.volumeInfo.title)

        $ul.append($('<li>').text(result.volumeInfo.title));


      })
      $('body').append($ul);
    })
  })

})// end doc.ready


//if you put all the titles into an array
//you could then send the array to the html with res.render
// then use {{# }} and {{/ }} to loop over it

