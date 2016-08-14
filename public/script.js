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
   var myurl = "https://www.googleapis.com/books/v1/volumes?q="+query+"&callback=?"

   // console.log(myurl)

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
          newBookObj.image = 'no image available';
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
        var newBook = $('<ul class="book" id='+ book.id +'></ul>');
        newBook.append($('<li class="title">'+ book.title + '</li>'));
        newBook.append($('<li class="author">'+ book.author + '</li>'));
        newBook.append($('<li class="image"><img src="'+book.image +'" /> </li>'));
        bookList.append(newBook);
      });

      console.log($('#bookList'))


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
                console.log('teSSSt')


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












//===================
//===================
//PAST CODE 8/12
//===================
//===================

// ends click function
      //----LIST OF AUTHORS----
//       var array_of_authors = []
//       var $authorList = $('<ul>')
//       data.items.forEach(function(result){
//         console.log(result.volumeInfo.authors)
//         array_of_authors.push(result.volumeInfo.authors)
//         //console.log(array_of_authors)
//         $authorList.append($('<li>').text(result.volumeInfo.authors))
//       })

//       //----LIST OF IMAGES----
//       var array_of_images = []
//       var $imageList = $('<ul>')
//       data.items.forEach(function(result){

//         if (result.volumeInfo.imageLinks){
//           console.log(result.volumeInfo.imageLinks.thumbnail)
//           array_of_images.push(result.volumeInfo.imageLinks.thumbnail)
//           // $imageList.append($('<li> src=').text(result.volumeInfo.imageLinks.thumbnail));
//           var getImage = $('<img>').attr('src', result.volumeInfo.imageLinks.thumbnail);
//         }else{
//           array_of_images.push("null")
//         }

//       })
//       //---LIST OF TITLES----
//       var array_of_titles = []
//       var $ul = $('<ul>');
//       data.items.forEach(function(result){
//         array_of_titles.push(result.volumeInfo.title)
//         $ul.append($('<li>').text(result.volumeInfo.title));
//       });

//       // //---LIST OF DESCRIPTION----
//       // var array_of_description = []
//       // var $desList = $('<ul>');
//       // data.items.forEach(function(result){
//       //  // console.log(result.searchInfo.textSnippet)
//       // })


// console.log(array_of_authors)
//       //APPEND THE LISTS
//      // $('body').append(getImage);
//       $('body').append($ul); //TITLES
//       $('body').append($authorList) //AUTHORS
//       $('body').append($imageList)

//       $('#test').empty()
//       $('p').empty()
//     })
//   })

// var a1 = [1,2], a2 = [7,8], a3 = [9,2];
// for (var i =0 ; i < a1.length; i++){
//   a3.map(function(e,i,a){
//     return [e, a2[i]]
//   })
// }
// console.log(i)

// i have my 1:1 with annette now, do you know where she went?
// after i do them, jared and i will help with the zipper function




//if you put all the titles into an array
//you could then send the array to the html with res.render
// then use {{# }} and {{/ }} to loop over it

