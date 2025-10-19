//fix stat display, all not working

const quotes = [
  'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
  'There is nothing more deceptive than an obvious fact.',
  'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
  'I never make exceptions. An exception disproves the rule.',
  'What one man can invent another can discover.',
  'Nothing clears up a case so much as stating it to another person.',
  'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

let words = []; 
let wordIndex = 0; 
let startTime = Date.now(); 

// DOM references
const qEl= document.getElementById('quote');
const msgEl = document.getElementById('message');
const typedEl = document.getElementById('typed-value'); 
const wpmEl = document.getElementById('wpm');
const accEl = document.getElementById('accuracy'); 
const streakEl = document.getElementById('streak'); 
const lastResultEl = document.getElementById('lastResult'); 

const resultsHistory = []; 
let streak = 0; 
let wrong = 0; 

function evalPerformance(quote, wrong, elapsedTime) {
  try {
    const acc = ((quote.length - wrong) / quote.length) * 100;
        
    const wps = quote.length / elapsedTime; 
    const wpm = Math.round(wps * 60); 
    
    console.log(wrong); 
    console.log(wps); 
    return { wpm, accuracy: Math.round(acc * 100) / 100 }; 
  } catch (err) {
    console.error('evalPerformance error:', err); 
    return { wpm: 0, accuracy: 0}; 
  }
}

function updateStats(wpm, acc) {
  wpmEl.textContent = isFinite(wpm) ? wpm : 0; 
  accEl.textContent = (isFinite(acc) ? acc : 0) + '%'; 
  streakEl.textContent = streak; 
}

function finish(result) {
  try {
    const rec = {
      wpm: result.wpm, 
      accuracy: result.accuracy, 
      date: new Date().toISOString(), 
      good: isGood(result)
    }; 
    resultsHistory.push(rec);
    if(rec.good) {
      streak++;
    } else {
      streak = 0; 
    }

    console.log(rec); 

    updateStats(rec.wpm, rec.accuracy); 
  } catch(err) {
    console.error('finish error:', err); 
  }
}

function isGood(result) {
  try {
    return result.wpm >= 45 && result.accuracy >= 80; 
  } catch(err) {
    console.error('isGood error:', err); 
    return false; 
  }
}

document.getElementById('start').addEventListener('click', () => {
  const qIndex = Math.floor(Math.random() * quotes.length); 
  const quote = quotes[qIndex]; 

  words = quote.split(' '); 
  wordIndex = 0; 
  wrong = 0; 
  
  //UI
  //allows highlighting with <span>
  const spanWords = words.map(function(word) { return `<span>${word} </span>`}); 
  qEl.innerHTML = spanWords.join(''); 
  qEl.childNodes[0].className = 'highlight'; //sets first span El to highlight
  msgEl.innerText = '';
  
  //textbox
  typedEl.value = '';
  typedEl.focus(); 

  startTime = new Date().getTime(); 
}); 

typedEl.addEventListener('input', () => {
  const curWord = words[wordIndex]; 
  const typedVal = typedEl.value; 

  if (typedVal === curWord && wordIndex === words.length - 1) {
    //end of sentence
    const elapsedTime = (new Date().getTime() - startTime) / 1000; 
    const msg = `Congrats! You finished in ${elapsedTime} sec`;
    msgEl.innerText = msg;

    const perf = evalPerformance(words, wrong, elapsedTime)
    updateStats(perf.wpm, perf.accuracy);

    finish(perf); 

  } else if (typedVal.endsWith(' ') && typedVal.trim() === curWord) {
    //end of word
    typedEl.value = ''; 
    wordIndex++; 

    for (const wordEl of qEl.childNodes) {
      wordEl.className = ''; 
    }
    //hightlight new word
    qEl.childNodes[wordIndex].className = 'highlight'; 

  } else if (curWord.startsWith(typedVal)) {
    //currently correct, highlights next word
    typedEl.className = ''; 
  } else {
    //error
    typedEl.className = 'error'; 
    wrong++; 
  }
});
