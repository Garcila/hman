var word;
var error_count = 0;
var used_letters = [];
var index_chosen_letter= [];
var won = 0;
var lost = 0;
var word_computer_generated;
var game_type = 0;

function rand() {
  return Math.floor(Math.random()*(7-3+1)+3);
}
//function to get random word from API.  AI game
function RandomWord() {
  var random_word_lenght = rand();
  var requestStr = "http://randomword.setgetgo.com/get.php?len=" + random_word_lenght;

  $.ajax({
    type: "GET",
    url: requestStr,
    dataType: "jsonp",
    jsonpCallback: 'RandomWordComplete'
  });
}

function RandomWordComplete(data) {
  word = data.Word.toUpperCase();
  console.log(data.Word);
  console.log(word);
  separateWord(word);
  getLetter();
}

aiOrHuman();

$(document).ready(function(){
  if(game_type === 0) {
    $('.word_to_guess').hide();
  }
})

  function aiOrHuman() {
    if(game_type === 0) {
      RandomWord();
    } else {
      $('.word_to_guess').show();
      getWord();
    }
  }
// })

  //reveals or hides side menu
  $('.menu-toggle').bind('click', function() {
      $('body').toggleClass('menu-open')
      return false;
  });

  function getWord() {
    $('.word_to_guess').off().on('keypress', function(e) {
      if(e.which == 13) {
        setTimeout(function() {
          $('.word_to_guess').hide();
        }, 1000);
        word = this.value.toUpperCase();
        console.log(word)
        separateWord(word);
        getLetter();
      }
    });
  }
// })

function separateWord(word) {
  word_array = [];
  word_array = word.split('');
  console.log(word_array);
  console.log('the word array is ' + word_array);
  var letter_count = word_array.length;
  lines = word_array.map(function(item) { return item, '_ '});
  $('.lines').empty();
  $('.lines').append(lines);
  console.log(lines.join(''));
}

function getLetter() {
  $('.Grid-cell').off().on('click', function(e) {
    var chosen_letter = $(this).text();
    console.log('you choose: ' + chosen_letter)
  if(used_letters.indexOf(chosen_letter) > -1) {
    // alert('you already played that letter');
    getLetter();
  } else {
    $(this)
      .css('background-color', '')
      .css('background-color', 'rgb(122, 77, 158)')
      .css('color','')
      .css('color','rgb(255, 255, 255)');
    used_letters.push(chosen_letter);
    console.log('letters used ' + used_letters);
  }

    function isLetterInWord(chosen_letter) {
      if(word_array.indexOf(chosen_letter) > -1) {
        for(var i = 0; i<word_array.length; i++) {
          if(word_array[i] === chosen_letter) {
            index_chosen_letter.push(i);
            lines.splice(i, 1, chosen_letter);
          };
        }
        $('.lines').empty();
        $('.lines').append(lines);
        console.log(lines);
      } else {
        error_count += 1;
        console.log('error, letter ' + chosen_letter + ' is not on word');
        console.log(error_count);
      }
    }
    isLetterInWord(chosen_letter);
    compareWords();
  })
  }

  function compareWords() {
    if(error_count < 6) {
      if(lines.join('') === word_array.join('')) {
        // console.log('you found the word.  the word is ' + (word_array.join('')));
        won += 1;
        console.log('won: ' + won + ' - lost: ' + lost);
        // $('.image').append('Correct, the word was: '+ '<br>' + word);
        $('.word_to_guess').show();
        // getWord();
        playAgain();
        // endGame();
      } else {
        getLetter();
      }
    } else {
      lost +=1;
      // $('.image').append('you loose the word you tried to find is: ' + word);
      console.log('you loose');
      playAgain();
      endGame();
    }
  }

  function playAgain() {
    error_count = 0;
    used_letters = [];
    index_chosen_letter= [];
    $('.word_to_guess').val('').focus();
    $('.word_to_guess').hide();

    // $('.lines').empty();
    $('.Grid-cell')
      .css('transform', 'scale(' + 1 + ')')
      .css('background-color', '')
      .css('background-color', 'rgb(50, 57, 61)')
      .css('color','')
      .css('color', 'rgb(96, 96, 91)');
    aiOrHuman();
  }


  function endGame() {
    console.log('game ended');
  }

// })
