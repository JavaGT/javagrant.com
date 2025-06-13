import fspp from 'fs/promises';
import fsl from '../util/fsl.mjs';
import Parser from 'rss-parser';
import { exec } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';

const fsp = new fsl('./rss.db');

// Main function to handle downloading and processing all RSS feeds
async function processAllFeeds() {
    const feeds = Object.values(JSON.parse(await readFileContent('all.json', true))).filter(Boolean);

    for (const rss_url of feeds) {
        await downloadRSSData(rss_url.feedUrl).catch(console.error);
    }
}

// Function to download and process a single RSS feed
async function downloadRSSData(rss_url) {
    console.log(`Processing feed: ${rss_url}`);
    const parser = new Parser();
    const feed = await parser.parseURL(rss_url);
    const folderName = sanitizeFilename(feed.title);

    await createFolderIfNotExists(`rss/${folderName}`);
    await saveFile(`rss/${folderName}/_feed.json`, feed);

    for (const item of feed.items) {
        const itemFilePath = `rss/${folderName}/${item.guid}`;
        await processFeedItem(item, itemFilePath);
    }
}

// Function to process a single feed item
async function processFeedItem(item, filePath) {
    console.log(`Processing item: ${item.guid}`);

    // Save item metadata
    await saveFile(`${filePath}.json`, item);

    // Skip download and transcription if already done
    if (await fileExists(`${filePath}.whisper.json`)) {
        console.log(`Skipping ${item.guid}, already processed.`);
        return;
    }

    // Download and convert audio if not already present
    if (!await fileExists(`${filePath}.opus`)) {
        await downloadAndConvertAudio(item.enclosure.url, filePath);
    } else {
        console.log(`Skipping ${item.guid}, audio already exists.`);
    }

    // Transcribe audio if transcription is not already present
    if (!await fileExists(`${filePath}.whisper.json`)) {
        await transcribeAudio(`${filePath}.opus`, `${filePath}.whisper.json`);
        await deleteFile(`${filePath}.opus`);
    } else {
        console.log(`Skipping ${item.guid}, transcription already exists.`);
    }
}

// Function to delete a file
async function deleteFile(filePath) {
    await fsp.unlink(filePath);
}

// Function to check if a file exists
async function fileExists(path) {
    try {
        await fsp.access(path);
        return true;
    } catch {
        return false;
    }
}

// Function to read file content
async function readFileContent(filePath, realfile = false) {
    const fileContent = await (realfile ? fspp : fsp).readFile(filePath);
    return fileContent.toString();
}

// Function to create a folder if it doesn't exist
async function createFolderIfNotExists(folderPath) {
    await fsp.mkdir(folderPath, { recursive: true });
}

// Function to save JSON data to a file
async function saveFile(filePath, data) {
    await fsp.writeFile(filePath, JSON.stringify(data));
}

// Function to sanitize a filename
function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9-_]/g, '_');
}

// Function to download and convert audio
async function downloadAndConvertAudio(audioUrl, filePath) {
    console.log(`Downloading audio: ${audioUrl}`);

    const audioBuffer = await fetch(audioUrl).then(async response => Buffer.from(await response.arrayBuffer()));
    await fspp.writeFile(`${filePath}.audio`, audioBuffer);

    console.log(`Converting audio: ${filePath}.audio`);
    await convertAudioToOpus(`${filePath}.audio`, `${filePath}.opus`);

    console.log(`Cleaning up: ${filePath}.audio`);
    await fspp.unlink(`${filePath}.audio`);
}

// Function to convert audio to Opus format
async function convertAudioToOpus(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .audioCodec('libopus')
            .audioBitrate(32)
            .audioChannels(1)
            .audioFrequency(16000)
            .format('opus')
            .on('end', resolve)
            .on('error', reject)
            .save(outputPath);
    });
}

// Function to transcribe audio using external tool
async function transcribeAudio(audioPath, transcriptPath) {
    console.log(`Transcribing audio: ${audioPath}`);

    return new Promise((resolve, reject) => {
        const process = exec(`insanely-fast-whisper --device-id mps --model-name distil-whisper/distil-large-v3 --batch-size 4 --file-name ${audioPath} --transcript-path ${transcriptPath}`);
        process.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Transcription failed with code ${code}`));
            } else {
                resolve();
            }
        });
    });
}

// Start the process
processAllFeeds().catch(console.error);
