//didnt work, gonan try something else.
//variable group
 var cList = $('ul.author')


$(document).ready(function() {
  console.log('loaded!!!')

  $('#submit_button').click(function(e){
  $(".book").unbind();
  $('#bookList').remove()
   e.preventDefault();
   var query = $('#person').val()
   query = query.replace(' ','+')
   //console.log(query)

   var myurl = "https://www.googleapis.com/books/v1/volumes?q="+query+"&callback=?&startIndex=0&maxRange=40"

   console.log(myurl)

    $.getJSON(myurl,function(data){ //this is just like an ajax call, syntax is a bit different, but same results.
      console.log(data);
      var books = [];

      data.items.forEach(function(book){
        //console.log(book.volumeInfo.title + " by " + book.volumeInfo.authors[0]);
        var newBookObj = {};
        // these check if the data is valid before adding it
        //title
        if (book.volumeInfo.title){
          newBookObj.title = book.volumeInfo.title;
        } else {
          newBookObj.title = 'no title available';
        }
        // author
        if (book.volumeInfo.authors && book.volumeInfo.authors[0]){
          newBookObj.author = book.volumeInfo.authors[0];
        } else {
          newBookObj.author = 'no author available';
        }
        // image
        if (book.volumeInfo.imageLinks.thumbnail){
          newBookObj.image = book.volumeInfo.imageLinks.thumbnail;
        } else {
          newBookObj.image = "http://placehold.it/350x150"
        }
        // book id
        if (book.id){
          newBookObj.id = book.id;
        } else {
          newBookObj.id = 'no id';
        }
        //description
        if (book.searchInfo){
          newBookObj.description = book.searchInfo.textSnippet;
        } else {
          newBookObj.description = 'no description available';
        }
        books.push(newBookObj)
      });

      console.log(books)


      var bookList = $('<div id="bookList">');
      $('.container').append(bookList);
      // append sstuff
      books.forEach(function(book){
        console.log(book)
        var newBook = $('<div class="book" id='+ book.id +'></div>');
        newBook.append($('<div class="title">'+ book.title + '</div>'));
        newBook.append($('<div class="author">'+ book.author + '</div>'));
        newBook.append($('<div class="image"><img src="'+book.image +'" /> </div>'));
        bookList.append(newBook);
      });

      console.log($('#bookList'))

      //----MODLA PART ---
       $('.book').click(function(e){
          e.preventDefault();
          // console.log(this,'this is "this" keyword ')
          var selectedId = this.id
          var result = books.filter(function(obj) {
            // console.log(obj.id === this.id)
            return obj.id === selectedId;
          });
          console.log(result)
          $('#modal-content').modal({
            show: true
           });
           $('#favoriteButton').unbind()
          $('#favoriteButton').click(function(e){
            //alert("test")
            var bookInfo = { title:result[0].title, author:result[0].author, image:result[0].image, description:result[0].description }
            $.ajax({
              "url": "http://localhost:3000/favorite/",
              "method": "POST",
              "data": bookInfo,
              "success": function(){
                console.log('You got favorite book!')


              }
            })
          })

          console.log(this)
          console.log(books)
          $('#infoTitle').text(result[0].title)
          $('#infoImage').find('img').attr("src", result[0].image)
          $('#infoDep').text(result[0].description)
        })




    }); //end of json
  })  //end of click function


})// end doc.ready



