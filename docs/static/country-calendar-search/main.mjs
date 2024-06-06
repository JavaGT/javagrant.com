const content_element = document.getElementById('content')
const video_element = document.createElement('video')
const currently_playing = document.getElementById('currently-playing')

// check if search index is saved in local storage
setStatus('Downloading search index...')
// Download Search Index

const response = await fetch('./country-calendar-transcripts.json')
const searchIndexData = await response.json()
setStatus('Search index loaded!')


// setStatus('Decompressing search index... [this may take a while]')
// const decompressedData = await decompressGunzipBlob(response)
// setStatus('Loading search index (from memory)...')
// const searchIndexData = JSON.parse(decompressedData)
// setStatus('Search index loaded!')



const search_input = document.createElement('input')
search_input.type = 'text'
search_input.placeholder = 'Search for a term. $dirt$ will exclude partial matches, e.g. "dirty"'
search_input.style.width = '100%'
search_input.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        searchInput()
    }
})

const search_button = document.createElement('button')
search_button.innerText = 'Search'
search_button.onclick = searchInput

const search_results = document.createElement('div')
content_element.appendChild(search_input)
content_element.appendChild(search_button)
content_element.appendChild(search_results)

function searchInput() {
    const data = search(search_input.value)
    renderSearchData(data)
}

function renderSearchData(data) {
    // clear
    search_results.innerHTML = ''
    // search_results.innerHTML = JSON.stringify(data, null, 2)
    for (const file of data) {
        const file_element = document.createElement('div')
        file_element.style.border = '1px solid black'
        file_element.style.margin = '10px'
        file_element.style.padding = '10px'
        file_element.style.borderRadius = '10px'
        file_element.style.backgroundColor = 'lightgray'
        // filename
        const file_name = document.createElement('h3')
        file_name.innerText = file.file
        file_element.appendChild(file_name)
        for (const chunk of file.chunks) {
            const chunk_element = document.createElement('div')
            chunk_element.style.border = '1px solid black'
            chunk_element.style.margin = '10px'
            chunk_element.style.padding = '10px'
            chunk_element.style.borderRadius = '10px'
            chunk_element.style.backgroundColor = 'white'
            const chunk_text = document.createElement('p')
            chunk_text.innerHTML = chunk.text
            const chunk_time = document.createElement('p')
            chunk_time.innerText = `${msToTimestamp(chunk.timeStart)} - ${msToTimestamp(chunk.timeEnd)}`
            chunk_element.appendChild(chunk_text)
            chunk_element.appendChild(chunk_time)
            file_element.appendChild(chunk_element)
            const play_button = document.createElement('button')
            play_button.innerText = 'Play'
            play_button.onclick = () => {
                document.getElementById('video').src = file.link
                document.getElementById('video').onloadedmetadata = () => {
                    currently_playing.innerText = `Currently playing: ${file.file} - ${chunk.text}`
                    document.getElementById('video').currentTime = chunk.timeStart
                    document.getElementById('video').play()
                }
            }
            chunk_element.appendChild(play_button)
        }
        search_results.appendChild(file_element)
    }
}


function search(term) {
    term = term.trim()

    // if the term starts with and ends with a $, search for the exact term sorrunded by whitespace or start/end of string
    let onlyExact = false
    if (term.startsWith('$') && term.endsWith('$')) {
        term = term.slice(1, -1)
        onlyExact = true
    }

    return searchIndexData
        .filter(t => {
            if (onlyExact) {
                return t.text.match(new RegExp(`(^|\\s)${term}($|\\s)`, 'i'))
            }
            return t.text.match(new RegExp(term, 'i'))
        })
        .map(file => {
            return {
                chunks: file.chunks.map((x, index, all) => {
                    console.log(x)
                    return {
                        text: x.text,
                        timeStart: x.timestamp[0],
                        timeEnd: x.timestamp[1],
                        previous: index > 0 ? all[index - 1] : null,
                        next: index < all.length - 1 ? all[index + 1] : null
                    }
                }).filter(x => {
                    if (onlyExact) {
                        return x.text.match(new RegExp(`(^|\\s)${term}($|\\s)`, 'i'))
                    }
                    return x.text.match(new RegExp(term, 'i'))
                }).map(x => {
                    // include previous if end of previous is within 2 seconds of start of current
                    const includePrevious = x.previous && x.timeStart - x.previous.timeEnd < 2
                    // include next if start of next is within 2 seconds of end of current
                    const includeNext = x.next && x.next.timeStart - x.timeEnd < 2
                    return {
                        text: (includePrevious ? x.previous.text : '') + x.text + (includeNext ? x.next.text : '').replaceAll(term, `**${term}**`),
                        timeStart: (includePrevious ? x.previous.timeStart : x.timeStart),
                        timeEnd: (includeNext ? x.next.timeEnd : x.timeEnd),
                    }
                }),
                file: file.file,
                link: `https://cdn.etv.org.nz/etv/${file.file.replace('.json', '')}`
            }
        })
}



function msToTimestamp(s) {
    const date = new Date(s * 1000)
    return `${date.getUTCMinutes()}:${date.getUTCSeconds()}.${date.getUTCMilliseconds()}`
}
function setStatus(status) {
    document.getElementById('status').innerText = status
}