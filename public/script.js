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

   var myurl = "https://www.googleapis.com/books/v1/volumes?q="+query+"&callback=?&startIndex=0&maxResults=40"

   console.log(myurl)
   //AJAX FUNCTION
    $.getJSON(myurl,function(data){ //this is just like an ajax call, syntax is a bit different, but same results.
      console.log(data);
      var books = [];
      // TITLE AND AUTHORS
      data.items.forEach(function(book){
        //console.log(book.volumeInfo.title + " by " + book.volumeInfo.authors[0]);
        var newBookObj = {};
        // these check if the data is valid before adding it
        //TITLE
        if (book.volumeInfo.title){
          newBookObj.title = book.volumeInfo.title;
        } else {
          newBookObj.title = 'no title available';
        }
        // AUTHOR
        if (book.volumeInfo.authors && book.volumeInfo.authors[0]){
          newBookObj.author = book.volumeInfo.authors[0];
        } else {
          newBookObj.author = 'no author available';
        }
        // IMAGE
        if (!book.volumeInfo.imageLinks) {
          newBookObj.image = 'http://tomcrosshill.com/wp-content/uploads/2016/06/cover-not-available.gif';
        } else if (book.volumeInfo.imageLinks.thumbnail){
          newBookObj.image = book.volumeInfo.imageLinks.thumbnail;
        }

        // BOOK ID
        if (book.id){
          newBookObj.id = book.id;
        } else {
          newBookObj.id = 'no id';
        }
        //description
        if (book.searchInfo){
          newBookObj.description = book.volumeInfo.description;  //searchInfo.textSnippet;
        } else {
          newBookObj.description = 'no description available';
        }
        books.push(newBookObj)
      });

      console.log(books)


      var bookList = $('<div id="bookList">');
      $('.container').append(bookList);
      // APPEND STUFF
      books.forEach(function(book){
        console.log(book)
        var newBook = $('<div class="book" id='+ book.id +'></div>');
        newBook.append($('<div class="title">'+ book.title + '</div>'));
        newBook.append($('<div class="author">'+ book.author + '</div>'));
        newBook.append($('<div class="image"><img src="'+book.image +'" /> </div>'));
        bookList.append(newBook);
      });

      console.log($('#bookList'))

      //----MODAL PART FUNCTION ---
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
          //TO APPEND THE DATA TO MODAL
          $('#infoTitle').text(result[0].title)
          $('#infoImage').find('img').attr("src", result[0].image)
          $('#infoDep').text(result[0].description)
        })


    }); //end of json

  })  //end of click function
 //----------DELETE row in favorite table
          $('.deleteUser').click(function(e){
            var delete_button = $(this);
            var parent = delete_button.parent();
            var grandParent = parent.parent();
            //console.log(grandParent)

            e.preventDefault()
            console.log('DELETE CLICK WORKING!')
            id = $(this).attr('data-id')
            console.log(id);
            // div = $(this).parent()
            $.ajax({
              "url": "http://localhost:3000/favorite/"+id,
              "method": "DELETE",
              "success": function(){
                grandParent.remove();
                return false


              }
            })
          })
 //-----------------

})// end doc.ready
