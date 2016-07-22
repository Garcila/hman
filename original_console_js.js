var error_count = 0;
var used_letters = [];
var index_chosen_letter= [];
var won = 0;
var lost = 0;

function getWord() {
  word = prompt("type a word");
  // console.log('the word is: ' +word);

  function separateWord(word) {
    word_array = [];
    word_array = word.split('');
    // console.log('the word array is ' + word_array);
    var letter_count = word_array.length;
    lines = word_array.map(function(item) { return item, '__ '});
    console.log(lines.join(''));
  }
  separateWord(word);
  getLetter();
}

// getWord();

function getLetter() {
var chosen_letter = prompt("type a letter");
if(used_letters.indexOf(chosen_letter) > -1) {
  alert('you already played that letter');
  getLetter();
} else {
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
      console.log(lines);
    } else {
      error_count += 1;
      console.log('error, letter ' + chosen_letter + ' is not on word');
      console.log(error_count);
    }
  }
  isLetterInWord(chosen_letter);
  compareWords();
}


function compareWords() {
  if(error_count < 20) {
    if(lines.join('') === word_array.join('')) {
      console.log('you found the word.  the word is ' + (word_array.join('')));
      won += 1;
      console.log('won: ' + won + ' - lost: ' + lost);
      playAgain();
      endGame();
    } else {
      getLetter();
    }
  } else {
    lost +=1;
    console.log('you loose');
    playAgain();
    endGame();
  }
}

function playAgain() {
  var continue_game = prompt('do you want to keep on playing?')
  if(continue_game === 'Y') {
    var error_count = 0;
    var used_letters = [];
    var index_chosen_letter= [];
    getWord();
  // } else {
  //   endGame();
  }
}


function endGame() {
  console.log('game ended');
  // thisFunctionDoesNotExistAndWasCreatedWithTheOnlyPurposeOfStopJavascriptExecutionOfAllTypesIncludingCatchAndAnyArbitraryWeirdScenario();
}
