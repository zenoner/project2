//didnt work, gonan try something else.
$(document).ready(function() {
  console.log('loaded!!!')


  $('#submit_button').click(function(e){
   e.preventDefault();
   var query = $('#person').val()
   query = query.replace(' ','+')
   var myurl = "https://www.googleapis.com/books/v1/volumes?q="+query+"&callback=?"

   // console.log(myurl)

    $.getJSON(myurl,function(data){ //this is just like an ajax call, syntax is a bit different, but same results.
      // debugger

      data.items.forEach(function(result){
        console.log("result: "+result.volumeInfo.title)
      })

    })
  })

})// end doc.ready

