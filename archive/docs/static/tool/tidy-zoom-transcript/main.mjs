// Create a dropzone for a file on the page

const dropzone = document.querySelector('#dropzone')
const fileout = document.querySelector('#fileout')

dropzone.addEventListener('dragover', (event) => {
    event.preventDefault()
    dropzone.classList.add('dragover')
})

dropzone.addEventListener('dragleave', (event) => {
    event.preventDefault()
    dropzone.classList.remove('dragover')
})

dropzone.addEventListener('drop', (event) => {
    event.preventDefault()
    dropzone.classList.remove('dragover')
    const file = event.dataTransfer.files[0]
    ondrop(file)
})

async function ondrop(file) {
    let text = await file.text()
    text = text.replace('WEBVTT', '').trim().replace(/\n*\d+[^\n]+/g, '') // removes line numbers and empty lines and timestamps
    let texts = text.split('\n').filter((text) => text !== '') // splits into an array of messages
    texts = texts.map((text) => text.trim().split(':'))
    console.log(text)
    // texts[i][0] is the name of the person
    // texts[i][1] is the message
    // if two messages are sent in a row by the same person, they are combined into one message
    let messages = []
    let lastperson = ''
    for (let i = 0; i < texts.length; i++) {
        // if there is not two parts to the message, then the person is unknown
        if (texts[i].length !== 2) {
            texts[i].unshift('Unknown')
        }
        // skip if no message
        if (texts[i][1] === '') {
            continue
        }
        if (texts[i][0] === lastperson) {
            messages[messages.length - 1].message += ' ' + texts[i][1]
        } else {
            messages.push({ person: texts[i][0], message: texts[i][1] })
        }
        lastperson = texts[i][0]
    }
    // messages is now an array of objects with the person and message
    console.log(messages)
    fileout.innerHTML = messages.map(m => `${m.person}: ${m.message.trim()}`).join('\n\n')
    // download as text file
    const blob = new Blob([fileout.innerHTML], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name.replace('.vtt', '.txt')
    a.click()
    URL.revokeObjectURL(url)
}