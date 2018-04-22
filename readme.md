# ▶ flat text sequencer

[![Build Status](https://travis-ci.org/bearror/flat-text-sequencer.svg?branch=master)](https://travis-ci.org/bearror/flat-text-sequencer)

Looking to parse a custom text model, render markdown, or highlight code? Here's a module that chunks text into a sequence of typed ranges by pattern.

```js
sequence('*if only* there was a way to make `this` a **sequence**', [
  { type: 'strong', pattern: /\*\*.+?\*\*/g },
  { type: 'em', pattern: /\*.+?\*/g },
  { type: 'code', pattern: /`.+?`/g }
])
```
*From text to a sequence.*
```js
[
  { type: 'em', data: '*if only*' },
  { data: ' there was a way to make ' },
  { type: 'code', data: '`this`' },
  { data: ' a ' },
  { type: 'strong', data: '**sequence**' }
]
```

## Usage

Install it with npm:
```bash
npm install --save flat-text-sequencer
```
Load the package to your application:
```js
const sequenceText = require('flat-text-sequecner')
```
And call it with your data:
```js
const sequence = sequenceText(text, patterns, delimiter)
```

### API

Flat text sequencer exports a single function with the following signature:
```
(text: string, patterns: [{ type: string, pattern: RegExp }], delimiter = ' ')
-> [{ data: string, type?: string }]
```

## Author

Joonatan Vuorinen ([@bearror](https://twitter.com/bearror))
