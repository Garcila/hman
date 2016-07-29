var word;
var error_count = 0;
var used_letters = [];
var index_chosen_letter= [];
var won = 0;
var lost = 0;
var word_computer_generated;
var game_type = 'friend';
var game_level;
var word_data;


function rand(minimum_letters, maximum_letters) {
  return Math.floor(Math.random()*(maximum_letters-minimum_letters+1)+minimum_letters);
}

//function to get random word from API.  AI game !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function RandomWord() {
  var random_word_frequency_easy = 'https://wordsapiv1.p.mashape.com/words/?hasDetails=typeOf&frequencyMin=6&frequencyMax=7&synonyms&random=true'
  var random_word_frequency_medium = 'https://wordsapiv1.p.mashape.com/words/?hasDetails=typeOf&frequencyMin=3&frequencyMax=5&random=true';
  var random_word_frequency_hard = 'https://wordsapiv1.p.mashape.com/words/?hasDetails=typeOf&frequencyMin=1&frequencyMax=2&random=true';

  $.ajax({
      type: 'GET',
      url: (function difficulty() {
            if(game_level === 'hard') {
              return random_word_frequency_hard
            } else if(game_level === 'medium') {
              return random_word_frequency_medium
            } else {
              return random_word_frequency_easy
            }
          }()),
      data: {}, // Additional parameters here
      dataType: 'json',
      success: function(data) {
        console.log((data.word));
        word = (data.word).toUpperCase();
        console.log(word);
        console.log((data.results[0].definition));
        console.log((data.results[0].synonyms));
        console.log((data));
        word_data = (data);
        separateWord(word);
        getLetter();
        $('.hint').bind('click', function thesaurus() {
          $('.hints').empty();
          $('.hints').append(word_data.results[0].synonyms[(rand(0,2))]);
        })
      },
      error: function(err) { alert(err); },
      beforeSend: function(xhr) {
      xhr.setRequestHeader("X-Mashape-Authorization", "hznNr7yF1Pmshdl9gk0G70l9yqjbp14ZeTdjsnMAll0VSZcGqF"); // Enter here your Mashape key
      }
  });
}














//function to get random word from API.  AI game !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// function RandomWord() {
//   var random_word_lenght = rand(7,3);
//   var requestStr = "http://randomword.setgetgo.com/get.php?len=" + random_word_lenght;
//
//   $.ajax({
//     type: "GET",
//     url: requestStr,
//     dataType: "jsonp",
//     jsonpCallback: 'RandomWordComplete'
//   });
// }
//
// function RandomWordComplete(data) {
//   word = data.Word.toUpperCase();
//   console.log(data.Word);
//   console.log(word);
//   separateWord(word);
//   getLetter();
// }



$(document).ready(function(){
  getWord();

  //function to get access Big Huge Thesaurus
  // $('.hint').bind('click', function thesaurus() {
  //   $.ajax({
  //     type: "GET",
  //     url: "http://words.bighugelabs.com/api/2/583adec71311cc870422e3e327d9b364/" + word + "/json",
  //     dataType: "json"
  //   }).done(function (json) {
  //     $('.hints').empty();
  //     if(json.hasOwnProperty('noun')) {
  //       $('.hints').append(json.noun.syn[rand(0,8)] || [0]);
  //     } else if(json.hasOwnProperty('verb')) {
  //       $('.hints').append(json.verb.syn[rand(0,8)] || [0]);
  //     } else if(json.hasOwnProperty('adverb')) {
  //       $('.hints').append(json.adverb.syn[rand(0,8)] || [0]);
  //     } else if(json.hasOwnProperty('adjective')) {
  //       $('.hints').append(json.adjective.syn[rand(0,8)] || [0]);
  //     } else if(json.hasOwnProperty()) {
  //       $('.hints').append('Do not know');
  //     }
  //   }).fail(function(f) {
  //     $('.hints').append(" 404");  //if the thesaurus, as it often does, has no synonym, append a friendly 404
  //   })
  // })

  //reveals or hides side menu
  $('.menu-toggle').bind('click', function() {
    $('body').toggleClass('menu-open')
    return false;
  });

  //select to human friend or AI by giving value to game_type
  function selectOponent() {
    $('li').bind('click', function() {
      $('.hints').empty();
      $('li').css('background-color', '');
      $(this).css('background-color', 'rgb(101, 49, 94)');
      if($(this).hasClass('friend')) {
        game_type = 'friend';
        aiOrHuman(game_type);
        console.log(game_type);
      } else if($(this).hasClass('ai')) {
        game_type = 'ai';
        aiOrHuman(game_type);
        console.log(game_type);
      }
    })
  };

  selectOponent();


})

function getWord() {
  $('.word_to_guess').off().on('keypress', function(e) {
    if(e.which == 13) {
      setTimeout(function() {
        $('.word_to_guess').hide();
      }, 800);
      word = this.value.toUpperCase();
      console.log(word)
      separateWord(word);
      getLetter();
    }
  });
}

  function aiOrHuman() {
    $('.lines').attr('style', '');
    if(game_type === 'ai') {
      $('.word_to_guess').hide();
      $('body').removeClass('menu-open');
      RandomWord();
    } else if(game_type === 'friend') {
      $('.word_to_guess').show();
      $('body').removeClass('menu-open');
      getWord();
    }
  }

  aiOrHuman();
// })



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
        $('.image div:nth-child(' + error_count + ')').hide();
        if(error_count === 7) {
          $('.image').append('NO MORE COLORS'+'<br>'+'<br>'+  'Ultraviolet' +'<br>'+'X-Rays' +'<br>'+' Gamma Rays' +'<br>'+'Cosmic Rays' +'<br>'+'is all that is left' +'<br>'+'<br>'+'  The word you were looking for was ' + word)
        }
        console.log('error, letter ' + chosen_letter + ' is not on word');
        console.log(error_count);
      }
    }
    isLetterInWord(chosen_letter);
    compareWords();
  })
  }

  function compareWords() {
    if(error_count < 7) {
      if(lines.join('') === word_array.join('')) {
        // console.log('you found the word.  the word is ' + (word_array.join('')));
        won += 1;
        console.log('won: ' + won + ' - lost: ' + lost);
        // $('.image').prepend(  word + '<br>' + 'is correct');
        $('.word_to_guess').show();
        $('.lines')
          .css('background-color', 'rgb(106, 28, 133)')
          .css('padding', '20px')
          .css('border-radius', '4%')
        $('.lines').prepend('Found word: ').addClass('lines-won')
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
    $('.image').children().show;
    $('.word_to_guess').val('').focus();
    $('.word_to_guess').hide();
    $('.hints').hide();
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
