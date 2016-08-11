$(document).ready(function() {
  console.log('loaded')

  $('button').click(function(){
    $.ajax({
      method: "GET",
      dataType: "JSONP", //this says im working from localhost, let me.
      url: "http://www.stands4.com/services/v2/quotes.php?uid=1001&tokenid=tk324324324&searchtype=AUTHOR&query=Albert+Einstein",
      success: function(data){
        debugger
        console.log(data)
      },
      error: function(data){
        debugger
      }
    })
  })
})// end doc.ready

