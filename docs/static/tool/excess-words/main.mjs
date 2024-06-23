// load csv of words from https://cdn.jsdelivr.net/gh/berenslab/chatgpt-excess-words/results/excess_words.csv

// const csvUrl = 'https://cdn.jsdelivr.net/gh/berenslab/chatgpt-excess-words/results/excess_words.csv';
// const keys = 'word	type	part_of_speech	comment'.split('\t');
// const mark_words = await fetch(csvUrl)
//     .then((response) => response.text())
//     .then((text) => text.split('\n'))
//     .then((lines) => lines.map((line) => line.split(',')))
//     .then((rows) => rows.map((row) => Object.fromEntries(row.map((value, i) => [keys[i], value]))))
//     // remove header
//     .then((rows) => rows.slice(1))
//     // filter only need non-content words
//     .then((rows) => rows.filter((row) => row.type !== 'content'))
//     // remove empty rows
//     // sort by word length
//     .then((rows) => rows.sort((a, b) => b.word.length - a.word.length))
//     .then((rows) => rows.filter((row) => row.word !== ''));


const mark_words = [
    'accentuates', 'achieving', 'acknowledging', 'across',
    'additionally', 'address', 'addresses', 'addressing', 'adept',
    'adhered', 'advancement', 'advancements', 'advancing',
    'advocating', 'affirming', 'afflicted', 'aiding', 'akin', 'align',
    'aligning', 'aligns', 'alongside', 'amplifies', 'approach',
    'assess', 'augmenting', 'avenue', 'avenues', 'bolster',
    'bolstered', 'bolstering', 'burgeoning', 'capabilities',
    'capitalizing', 'categorizing', 'challenges', 'commendable',
    'compelling', 'comprehend', 'comprehended', 'comprehending',
    'comprehensive', 'consequently', 'consolidates', 'contributing',
    'conversely', 'crafting', 'crucial', 'culminating', 'delineates',
    'delve', 'delved', 'delves', 'delving', 'demonstrated',
    'demonstrates', 'demonstrating', 'dependable', 'detrimentally',
    'diminishes', 'discern', 'discerned', 'discernible', 'discerning',
    'displaying', 'distinct', 'distinctions', 'distinctive', 'diverse',
    'elevates', 'elevating', 'elucidate', 'elucidates', 'elucidating',
    'emerged', 'emerges', 'emphasises', 'emphasising', 'emphasize',
    'emphasizes', 'emphasizing', 'employed', 'employing', 'employs',
    'empowers', 'enabling', 'encapsulates', 'encompass', 'encompassed',
    'encompasses', 'encompassing', 'endeavors', 'endeavours',
    'enduring', 'enhance', 'enhancements', 'enhances', 'enhancing',
    'ensuring', 'escalating', 'exacerbating', 'exceeding', 'excels',
    'exceptional', 'exceptionally', 'exhibit', 'exhibited',
    'exhibiting', 'exhibits', 'expedite', 'expediting', 'exploration',
    'explores', 'facilitated', 'facilitating', 'featuring', 'findings',
    'focusing', 'formidable', 'forthcoming', 'fostering', 'fosters',
    'foundational', 'garnered', 'gauged', 'grappling',
    'groundbreaking', 'groundwork', 'harness', 'harnesses',
    'harnessing', 'heightened', 'highlighting', 'highlights', 'hinges',
    'hinting', 'hold', 'holds', 'illuminates', 'illuminating',
    'impact', 'impacting', 'impede', 'impeding', 'imperative',
    'impressive', 'inadequately', 'including', 'incorporates',
    'incorporating', 'inherent', 'innovative', 'inquiries', 'insights',
    'integrates', 'interconnectedness', 'interplay', 'into',
    'intricacies', 'intricate', 'intricately', 'intriguing',
    'introduces', 'invaluable', 'involves', 'juxtaposed', 'leverages',
    'leveraging', 'merges', 'meticulous', 'meticulously',
    'multifaceted', 'necessitate', 'necessitates', 'necessitating',
    'necessity', 'notable', 'notably', 'noteworthy', 'nuanced',
    'nuances', 'observed', 'offer', 'offering', 'offers', 'optimizing',
    'orchestrating', 'outcomes', 'overlooking', 'particularly',
    'paving', 'pinpoint', 'pinpointed', 'pinpointing', 'pioneering',
    'pioneers', 'pivotal', 'poised', 'posed', 'poses', 'posing',
    'potential', 'precise', 'pressing', 'primarily', 'promise',
    'prompting', 'propelling', 'realm', 'realms', 'refine', 'refining',
    'remains', 'remarkable', 'renowned', 'revealed', 'revealing',
    'revolutionize', 'revolutionizing', 'revolves', 'scrutinize',
    'scrutinized', 'scrutinizing', 'seamless', 'seamlessly', 'serves',
    'shedding', 'sheds', 'showcased', 'showcases', 'showcasing',
    'signifying', 'spanned', 'spanning', 'spurred', 'stands',
    'strategically', 'streamline', 'streamlines', 'streamlining',
    'subsequently', 'substantial', 'substantiated', 'substantiates',
    'substantiating', 'surmount', 'surpassed', 'surpasses',
    'surpassing', 'swift', 'thereby', 'these', 'thorough', 'through',
    'transformative', 'uncharted', 'uncovering', 'underexplored',
    'underscore', 'underscored', 'underscores', 'underscoring',
    'understanding', 'unraveling', 'unveil', 'unveiled', 'unveiling',
    'unveils', 'uphold', 'upholding', 'urging', 'utilizes',
    'utilizing', 'valuable', 'various', 'varying', 'versatility',
    'warranting', 'while', 'within']

const submit_button = document.getElementById('submit');
const input_element = document.getElementById('input');
const processing_element = document.getElementById('processing');

// on paste event listener
input_element.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
});

submit_button.addEventListener('click', () => {
    // lowercase the input
    // processing
    processing_element.style.display = 'block';
    input_element.innerText = input_element.innerText.toLowerCase();
    input_element.innerText = input_element.innerText.replace(/\s+/g, ' ')
    const total_words = input_element.innerText.split(' ').length;
    let excess_words = 0;
    for (const word of mark_words) {
        const regex = new RegExp(`${word.word}`, 'gi');
        excess_words += (input_element.innerText.match(regex) || []).length;
        input_element.innerHTML = input_element.innerHTML.replace(regex, `<mark>${word.word}</mark>`);
    }
    const excess_percentage = (excess_words / total_words) * 100;
    document.getElementById('excess-words').innerText = excess_words;
    document.getElementById('excess-percentage').innerText = excess_percentage.toFixed(2);
    document.getElementById('total-words').innerText = total_words;
    document.getElementById('excess-words-container').style.display = 'block';
    processing_element.style.display = 'none';
});