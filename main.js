const VOWEL_SET = new Set('aeiouAEIOU');
function isVowelBit(c) {
    c = c.toLowerCase();
    return c === 'a' || c === 'e' || c === 'i' || c === 'o' || c === 'u' ? 1 : 0;
}

const triTable = [false, true, true, true, true, true, true, true];

const experimental = {
    tritable: (str) => {
        let i = 0;
        const len = str.length;
        for (; i + 2 < len; i += 3) {
            const b1 = isVowelBit(str[i]);
            const b2 = isVowelBit(str[i + 1]);
            const b3 = isVowelBit(str[i + 2]);
            const index = (b1 << 2) | (b2 << 1) | b3;
            if (triTable[index]) return true;
        }
        // leftover 1 or 2 chars:
        for (; i < len; i++) {
            if (isVowelBit(str[i])) return true;
        }
        return false;
    },

    pairTable: (() => {
        const T = Array.from({ length: 128 }, () => new Uint8Array(128));
        const isV = c => VOWEL_SET.has(c);
        for (let i = 0; i < 128; i++) {
            for (let j = 0; j < 128; j++) {
                T[i][j] = isV(String.fromCharCode(i)) || isV(String.fromCharCode(j)) ? 1 : 0;
            }
        }
        return (str) => {
            const len = str.length;
            let k = 0;
            for (; k + 1 < len; k += 2) {
                const a = str.charCodeAt(k);
                const b = str.charCodeAt(k + 1);
                if (T[a][b]) return true;
            }
            // Fallback for leftover single char
            if (k < len && VOWEL_SET.has(str[k])) return true;
            return false;
        };
    })(),

    // Batch-of-4 bitmask processing
    batch4Bitmask(str) {
        const vowelMask = (1 << 0) | (1 << 4) | (1 << 8) | (1 << 14) | (1 << 20); // a,e,i,o,u bits
        const len = str.length;
        let i = 0;
        while (i < len) {
            let chunkMask = 0;
            for (let j = 0; j < 4 && i < len; j++, i++) {
                const c = str.charCodeAt(i) | 32; // to lowercase
                const off = c - 97;
                if (off >= 0 && off < 26) {
                    chunkMask |= (1 << off);
                }
            }
            if (chunkMask & vowelMask) return true;
        }
        return false;
    },

    // Bloom-filter style approximate membership + confirm
    bloomFilter: (() => {
        const M = 64;
        const table = new Uint8Array(M);
        for (const c of 'aeiouAEIOU') {
            table[c.charCodeAt(0) % M] = 1;
        }
        return (str) => {
            for (let i = 0; i < str.length; i++) {
                const code = str.charCodeAt(i);
                if (table[code % M]) {
                    const lc = String.fromCharCode(code).toLowerCase();
                    if ('aeiou'.includes(lc)) return true;
                }
            }
            return false;
        };
    })(),

    // Regex in chunks to limit backtracking
    regexChunks(str, chunkSize = 32) {
        for (let i = 0; i < str.length; i += chunkSize) {
            if (/[aeiou]/i.test(str.slice(i, i + chunkSize))) return true;
        }
        return false;
    },

    // Buffer scan in Node.js for raw byte check
    bufferScan(str) {
        const buf = Buffer.from(str, 'utf8');
        for (let i = 0; i < buf.length; i++) {
            const b = buf[i] | 32;
            if (b === 97 || b === 101 || b === 105 || b === 111 || b === 117) return true;
        }
        return false;
    },
}

function generateTestStrings(count, length = 10) {
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const strings = [];
    for (let i = 0; i < count; i++) {
        let s = '';
        const useVowel = Math.random() < 0.5;
        for (let j = 0; j < length; j++) {
            s += useVowel && j === 0
                ? vowels[Math.floor(Math.random() * vowels.length)]
                : consonants[Math.floor(Math.random() * consonants.length)];
        }
        strings.push(s);
    }
    return strings;
}

const methods = {
    earlyReturnRegex: (s) => /^[^aeiou]*[aeiou]/i.test(s),
    regexMatch: (s) => !!s.match(/[aeiou]/i),
    uint8ArraySet: (() => {
        const lookup = new Uint8Array(128);
        for (const c of 'aeiouAEIOU') lookup[c.charCodeAt(0)] = 1;
        return (s) => {
            for (let i = 0; i < s.length; i++) {
                if (lookup[s.charCodeAt(i)]) return true;
            }
            return false;
        };
    })(),
    bitmaskArray: (() => {
        const map = new Uint8Array(128);
        for (const c of 'aeiouAEIOU') map[c.charCodeAt(0)] = 1;
        return (s) => {
            for (let i = 0; i < s.length; i++) {
                if (map[s.charCodeAt(i)]) return true;
            }
            return false;
        };
    })(),
    bitmaskBits: (str) => {
        const bitmask = (1 << 0) | (1 << 4) | (1 << 8) | (1 << 14) | (1 << 20); // aeiou
        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i) | 32;
            const offset = c - 97;
            if (offset >= 0 && offset < 26 && (bitmask & (1 << offset))) return true;
        }
        return false;
    },
    charCodeTable: (() => {
        const table = new Array(128).fill(false);
        for (const c of 'aeiouAEIOU') table[c.charCodeAt(0)] = true;
        return (s) => {
            for (let i = 0; i < s.length; i++) {
                if (table[s.charCodeAt(i)]) return true;
            }
            return false;
        };
    })(),
    forLoopManual: (s) => {
        for (let i = 0; i < s.length; i++) {
            const c = s[i].toLowerCase();
            if (c === 'a' || c === 'e' || c === 'i' || c === 'o' || c === 'u') return true;
        }
        return false;
    },
    charCodeSwitch: (s) => {
        for (let i = 0; i < s.length; i++) {
            switch (s.charCodeAt(i)) {
                case 65: case 69: case 73: case 79: case 85: // A E I O U
                case 97: case 101: case 105: case 111: case 117: // a e i o u
                    return true;
            }
        }
        return false;
    },
    regexFirstChar: (s) => /[aeiou]/i.test(s),
    regexTest: (s) => /[aeiou]/i.test(s),
    indexOf: (s) => 'aeiouAEIOU'.split('').some(v => s.indexOf(v) !== -1),
    switchCase: (s) => {
        for (let i = 0; i < s.length; i++) {
            switch (s[i]) {
                case 'a': case 'e': case 'i': case 'o': case 'u':
                case 'A': case 'E': case 'I': case 'O': case 'U':
                    return true;
            }
        }
        return false;
    },
    mapLookup: (() => {
        const map = {};
        for (const c of 'aeiouAEIOU') map[c] = true;
        return (s) => {
            for (let i = 0; i < s.length; i++) {
                if (map[s[i]]) return true;
            }
            return false;
        };
    })(),
    bitwiseString: (s) => {
        const vowels = 'aeiouAEIOU';
        for (let i = 0; i < s.length; i++) {
            if (~vowels.indexOf(s[i])) return true;
        }
        return false;
    },
    setLookup: (() => {
        const set = new Set('aeiouAEIOU');
        return (s) => {
            for (let i = 0; i < s.length; i++) {
                if (set.has(s[i])) return true;
            }
            return false;
        };
    })(),
    includesLoop: (s) => {
        const vowels = 'aeiouAEIOU';
        for (let i = 0; i < s.length; i++) {
            if (vowels.includes(s[i])) return true;
        }
        return false;
    },
    functionalSome: (s) => [...s].some(c => 'aeiouAEIOU'.includes(c)),

    // 🔽 NEW METHODS
    jumpTable: (() => {
        const table = new Array(128).fill(false);
        for (const c of 'aeiouAEIOU') table[c.charCodeAt(0)] = true;
        return (s) => {
            for (let i = 0; i < s.length; i++) {
                const code = s.charCodeAt(i);
                if (code < 128 && table[code]) return true;
            }
            return false;
        };
    })(),
    balancedTree: (s) => {
        const check = (c) => {
            switch (c) {
                case 'i': return true;
                case 'e': case 'o': return true;
                case 'a': case 'u': return true;
                default: return false;
            }
        };
        for (let i = 0; i < s.length; i++) {
            if (check(s[i].toLowerCase())) return true;
        }
        return false;
    },
    lowercaseSetOnce: (s) => {
        s = s.toLowerCase();
        return s.includes('a') || s.includes('e') || s.includes('i') || s.includes('o') || s.includes('u');
    },
    ...experimental
};

const testCases = [
    ['hello', true],
    ['bcdfg', false],
    ['AEIOU', true],
    ['XYZ', false],
    ['', false],
    ['qwrtyp', false],
    ['u', true],
    ['mnopa', true],
    ['EEE', true],
    ['bcdefghijklmnopqrstvwxyz', true]
];

console.log('✅ Verifying correctness:');
let allPass = true;
for (const [name, fn] of Object.entries(methods)) {
    for (const [input, expected] of testCases) {
        const result = fn(input);
        if (result !== expected) {
            console.error(`❌ ${name} failed for "${input}". Expected ${expected}, got ${result}`);
            allPass = false;
            break;
        }
    }
}
if (allPass) console.log('All methods passed the test cases.\n');

console.log('🧪 Benchmarking 10000 random strings (50% with vowels):\n');

const strings = generateTestStrings(1000000);

const timings = [];
for (const [name, fn] of Object.entries(methods)) {
    const start = performance.now();
    for (const s of strings) fn(s);
    const duration = performance.now() - start;
    timings.push([name, duration]);
}

timings.sort((a, b) => a[1] - b[1]);
for (const [name, time] of timings) {
    console.log(name.padEnd(18), ':', time.toFixed(2), 'ms');
}



function generateCSVPerformanceReport() {
    const textLengths = [10, 100, 1000, 10000, 100000];
    const testCount = 10000;
    const csvRows = [];
    
    // CSV header
    csvRows.push(['Method', ...textLengths.map(len => `${len} chars`)].join(','));
    
    // Test each method with different text lengths
    for (const [methodName, methodFn] of Object.entries(methods)) {
        const rowData = [methodName];
        
        for (const length of textLengths) {
            // Generate test strings of this length
            const testStrings = generateTestStrings(testCount, length);
            
            // Warm-up run (discard results)
            for (const s of testStrings.slice(0, 100)) methodFn(s);
            
            // Actual benchmark
            const start = performance.now();
            for (const s of testStrings) {
                methodFn(s);
            }
            const duration = performance.now() - start;
            
            // Calculate operations per second
            const opsPerSecond = (testCount / (duration / 1000)).toFixed(2);
            rowData.push(opsPerSecond);
        }
        
        csvRows.push(rowData.join(','));
    }
    
    // Write to CSV file
    const csvContent = csvRows.join('\n');
    fs.writeFileSync('performance_report.csv', csvContent);
    console.log('Performance report saved to performance_report.csv');
}

// First verify correctness
console.log('✅ Verifying correctness:');

for (const [name, fn] of Object.entries(methods)) {
    for (const [input, expected] of testCases) {
        const result = fn(input);
        if (result !== expected) {
            console.error(`❌ ${name} failed for "${input}". Expected ${expected}, got ${result}`);
            allPass = false;
            break;
        }
    }
}
if (allPass) console.log('All methods passed the test cases.\n');

// Generate the performance report
generateCSVPerformanceReport();