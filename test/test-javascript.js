import test from 'oletus'
import sequenceText from '../index'

const patterns = [
  { type: 'comment', pattern: /\/\/.+/g },
  { type: 'string', pattern: /'.+?'/g },
  { type: 'keyword', pattern: /function|return|var/g },
  { type: 'operator', pattern: /[()[\]{};:.,\-+=<>*/^&\\]/g },
  { type: 'number', pattern: /\d+\.?\d*/g }
]

test('function', t => {
  const sequence = sequenceText('function parentFunc() {', patterns)

  t.deepEqual(sequence, [
    { type: ['keyword'], data: 'function' },
    { type: [], data: ' parentFunc' },
    { type: ['operator'], data: '(' },
    { type: ['operator'], data: ')' },
    { type: [], data: ' ' },
    { type: ['operator'], data: '{' }])
})

test('comment', t => {
  const sequence = sequenceText(
    `    var b = 4; // parentFunc can't use this`,
    patterns)

  t.deepEqual(sequence, [
    { type: [], data: '    ' },
    { type: ['keyword'], data: 'var' },
    { type: [], data: ' b ' },
    { type: ['operator'], data: '=' },
    { type: [], data: ' ' },
    { type: ['number'], data: '4' },
    { type: ['operator'], data: ';' },
    { type: [], data: ' ' },
    { type: ['operator', 'comment'], data: '/' },
    { type: ['comment', 'operator'], data: '/' },
    { type: ['comment'], data: ` parentFunc can't use this` }])
})
