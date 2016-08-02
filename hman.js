var word;
var error_count = 0;
var used_letters = [];
var index_chosen_letter= [];
var won = 0;
var lost = 0;
var word_computer_generated;
var game_type = 'friend';
var game_level = 'Easy';
var word_data;

function rand(minimum_letters, maximum_letters) {
  return Math.floor(Math.random()*(maximum_letters-minimum_letters+1)+minimum_letters);
}

//function to get random word from API.  AI game !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function randomWord() {
  var random_word_frequency_easy = 'https://wordsapiv1.p.mashape.com/words/?hasDetails=typeOf&frequencyMin=6&frequencyMax=7&synonyms&random=true'
  var random_word_frequency_medium = 'https://wordsapiv1.p.mashape.com/words/?hasDetails=typeOf&frequencyMin=3&frequencyMax=5&random=true';
  var random_word_frequency_hard = 'https://wordsapiv1.p.mashape.com/words/?hasDetails=typeOf&frequencyMin=1&frequencyMax=2&random=true';

  $.ajax({
    type: 'GET',
    url: (function difficulty() {
          if(game_level === 'Hard') {
            return random_word_frequency_hard
            game_type = 'ai';
            console.log('game set to Hard');
          } else if(game_level === 'Medium') {
            game_type = 'ai';
            console.log('game set to Medium');
            return random_word_frequency_medium
          } else if(game_level === 'Easy') {
            game_type = 'ai';
            console.log('game set to Easy');
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
        if($.type(word_data.results[0].synonyms) === "undefined") {
          $('.hints').append('42');
        } else {
          $('.hints').append(word_data.results[0].synonyms[(rand(0,((word_data.results[0].synonyms.length)-1)))]);
        }
      })
      $('.def').off().bind('click', function wordDefinition() {
        alert(word_data.results[0].definition);
      })
    },
    error: function(err) {
      randomWord();
    },
    beforeSend: function(xhr) {
    xhr.setRequestHeader("X-Mashape-Authorization", "hznNr7yF1Pmshdl9gk0G70l9yqjbp14ZeTdjsnMAll0VSZcGqF"); // Enter here your Mashape key
    }
  });
}

function thesaurusDefinition(word) {
  $.ajax({
    type: 'GET',
    url: 'https://wordsapiv1.p.mashape.com/words/' + word + '?hasDetails=typeOf&synonyms',
    data: {}, // Additional parameters here
    dataType: 'json',
    success: function(data) {
      console.log((data.results[0].definition));
      console.log((data.results[0].synonyms));
      console.log((data));
      word_data = (data);
      $('.hint').bind('click', function thesaurus() {
        $('.hints').empty();
        if($.type(word_data.results[0].synonyms) === "undefined") {
          $('.hints').append('42');
        } else {
          $('.hints').append(word_data.results[0].synonyms[(rand(0,((word_data.results[0].synonyms.length)-1)))]);
        }
      })
      $('.def').off().bind('click', function wordDefinition() {
        alert(word_data.results[0].definition);
      })
    },
    error: function() {
     alert('I can not find that WORD in my datbase, pelase try a different word')
     aiOrHuman();
    },
    beforeSend: function(xhr) {
    xhr.setRequestHeader("X-Mashape-Authorization", "hznNr7yF1Pmshdl9gk0G70l9yqjbp14ZeTdjsnMAll0VSZcGqF"); // Enter here your Mashape key
    }
  });
}

$(document).ready(function(){
  getWord();

  //reveals or hides side menu
  $('.menu-toggle').bind('click', function() {
    $('body').toggleClass('menu-open')
    return false;
  });

  //determines the difficulty level to play at.  By default it is set at easy
  function chooseDifficultyLevel() {
    $('.difficulty > li').bind('click', function() {
      console.log($(this).text());
      game_level = $(this).text();
      $('.word_to_guess').hide();
      randomWord();
    })
  }
  chooseDifficultyLevel();

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
      thesaurusDefinition(word);
    }
  });
}

function aiOrHuman() {
  $('.lines').attr('style', '');
  if(game_type === 'ai') {
    $('.word_to_guess').hide();
    $('body').removeClass('menu-open');
    randomWord();
  } else if(game_type === 'friend') {
    $('.word_to_guess').show();
    $('body').removeClass('menu-open');
    $('.word_to_guess').val('').focus();
    getWord();
  }
}

aiOrHuman();

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

    isLetterInWord(chosen_letter);
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
          // $('.image').append('<div>NO MORE COLORS'+'<br>'+'<br>'+  'Ultraviolet' +'<br>'+'X-Rays' +'<br>'+' Gamma Rays' +'<br>'+'Cosmic Rays' +'<br>'+'is all that is left' +'<br>'+'<br>'+'  The word you were looking for was ' + word + '</div>')
          $('<div/>', {
            class: 'loosing_message',
            text: 'NO MORE COLORS. Ultraviolet, X-Rays, Gamma Rays, Cosmic Rays, is all that is left.  The word you were looking for was ' + word
          }).appendTo('.image');
        }
        console.log('error, letter ' + chosen_letter + ' is not on word');
        console.log(error_count);
      }
    compareWords();
    }
  }
})
}

function compareWords() {
  if(error_count < 7) {
    if(lines.join('') === word_array.join('')) {
      won += 1;
      console.log('won: ' + won + ' - lost: ' + lost);
      // $('.image').prepend(  word + '<br>' + 'is correct');
      $('.word_to_guess').show();
      $('.lines')
        .css('background-color', 'rgb(106, 28, 133)')
        .css('padding', '20px')
        .css('border-radius', '4%')
      $('.lines').prepend('Found word: ').addClass('lines-won');
      $('.Grid-cell').unbind('click');
      $('.word_to_guess').focus();
      $('.hints').html($('.hints').children())
      setTimeout(function() {
        playAgain();
        // $('.word_to_guess').hide();
      }, 2000);
    } else {
      getLetter();
    }
  } else {
    lost +=1;
    // $('.image').append('you loose the word you tried to find is: ' + word);
    console.log('you loose');
    $('.word_to_guess').show();
    $('.lines')
      .css('background-color', 'rgb(106, 28, 133)')
      .css('padding', '20px')
      .css('border-radius', '4%')
    $('.Grid-cell').unbind('click');
    $('.word_to_guess').focus();
    $('.hints').html($('.hints').children())
    // if(confirm('Sorry, the word you were looking for was ' + '<br>' + word + '<br>' + 'Do you want to play again?')) {
    setTimeout(function() {
      playAgain();
    }, 5000)
    // }
    // endGame();
  }
}

function playAgain() {
  error_count = 0;
  used_letters = [];
  index_chosen_letter= [];
  $('.loosing_message').empty();
  $('.image').children().show();
  $('.word_to_guess').val('').focus();
  $('.word_to_guess').hide();
  $('.Grid-cell')
    .css('transform', 'scale(' + 1 + ')')
    .css('background-color', '')
    .css('background-color', 'rgb(50, 57, 61)')
    .css('color','')
    .css('color', 'rgb(96, 96, 91)');
  aiOrHuman();
}

// function endGame() {
//   console.log('game ended');
// }
