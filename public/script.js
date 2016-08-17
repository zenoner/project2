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
        // PUBLISHER
        if (book.volumeInfo.publisher){
          newBookObj.publisher = book.volumeInfo.publisher;
        } else {
          newBookObj.publisher = 'no publisher available';
        }

        //for whatever reason, its stopping here when making the object

        // PUBLISHERDATE
        if (book.volumeInfo.publishedDate){
          newBookObj.publisherdate = book.volumeInfo.publishedDate;
        } else {
          newBookObj.publisherdate = 'no published date available';
        }
        // CATEGORIES
        if (book.volumeInfo.categories){
          newBookObj.categories = book.volumeInfo.categories[0];
        } else {
          newBookObj.categories = 'no categories available';
        }
        // pagenum
        if (book.volumeInfo.pageCount){
          newBookObj.pageCount = book.volumeInfo.pageCount.toString();
        } else {
          newBookObj.pageCount = 'no page number available';
        }
        // ISBM
        if (book.volumeInfo.industryIdentifiers){
          newBookObj.isbm = book.volumeInfo.industryIdentifiers[0].identifier.toString();
        } else {
          newBookObj.isbm = 'no ISBM available';
        }
        // buy_book
        if (book.volumeInfo.infoLink){
          newBookObj.buy_book = book.volumeInfo.infoLink;
        } else {
          newBookObj.buy_book = 'no buy infomation available';
        }

        // sample_book
        if (book.volumeInfo.previewLink){
          newBookObj.sample_book = book.volumeInfo.previewLink;
        } else {
          newBookObj.sample_book = 'no sample book available';
        }



        //you have to build the rest of it here


        //DATA INTO BOOKS ARRAY
        books.push(newBookObj)
     }); //end of forEach() function

      console.log(books)

      //FOR BOOKLIST IMAGES N INFO IN FAVORITE PAGE
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
          var bookid = this.id
          var result = $.grep(books, function(e){ return e.id == bookid; });
          var result = result[0]
          console.log(result)
          // debugger
          $('#modal-content').modal({
            show: true
           });
           $('#favoriteButton').unbind()

          $('#favoriteButton').click(function(e){
            //alert("test")
            $.ajax({
              "url": "http://localhost:3000/favorite/",
              "method": "POST",
              "data": result, //bookInfo,// This isn't the full book object we are expecting
              "success": function(){
                console.log('You got favorite book!')
              }
            })
          })

          // console.log(this)
          // console.log(books)

          //TO APPEND THE DATA TO MODAL
          $('#infoTitle').text(result.title)
          $('#infoImage').find('img').attr("src", result.image)
          $('#infoDep').text(result.description)
          $('#pubName').text(result.publisher)
          $('#pubDate').text(result.publisherdate)
          $('#categInfo').text(result.categories)
          $('#pageNum').text(result.pageCount)
          $('#isbm').text(result.isbm)
          $('#buyBook').text.("Buy Book").attr("href", result.buy_book);
          // $('#sampleBook').text(result.sample_book)
          // Insert whatever you want the link to be called inside .text
          // Insert whatever you want the link to direct to inside the attr href
          $('#sampleBook').text("Sample Book").attr("href", result.sample_book);
        })


//-----TESTING------
//.attr("href", "http://www.google.com");

// function myFunction() {
//     var str = "Free Web Building Tutorials!";
//     var result = str.link("http://www.w3schools.com");
//     document.getElementById("demo").innerHTML = result;
// }




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
