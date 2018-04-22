import test from 'oletus'
import sequenceText from '../main'

const patterns = [
  { type: 'h1', pattern: /#.*/g },
  { type: 'strong', pattern: /\*\*.+?\*\*/g },
  { type: 'em', pattern: /\*.+?\*/g },
  { type: 'code', pattern: /`.+?`/g }
]

test('single token', t => {
  const sequence = sequenceText('#Hello, World!', patterns)

  t.deepEqual(sequence, [{ type: 'h1', data: '#Hello, World!' }])
})

test('multiple tokens', t => {
  const sequence = sequenceText('**strong** and **very strong**', patterns)

  t.deepEqual(sequence, [
    { type: 'strong', data: '**strong**' },
    { data: ' and ' },
    { type: 'strong', data: '**very strong**' }])
})

test('confilcting patterns', t => {
  const sequence = sequenceText(
    '*fancy* and **strong** *stuff* *yep...***hello** there',
    patterns)

  t.deepEqual(sequence, [
    { type: 'em', data: '*fancy*' },
    { data: ' and ' },
    { type: 'strong', data: '**strong**' },
    { data: ' ' },
    { type: 'em', data: '*stuff*' },
    { data: ' *yep...' },
    { type: 'strong', data: '***hello**' },
    { data: ' there' }])
})

test('nested patterns', t => {
  const sequence = sequenceText('**this stuff is *nested*!**', patterns)

  t.deepEqual(sequence, [
    { type: 'strong', data: '**this stuff is *nested*!**' }
  ])
})

test('custom delimiter', t => {
  const sequence = sequenceText('**custom****delimiter**', patterns, '|')

  t.deepEqual(sequence, [
    { type: 'strong', data: '**custom**' },
    { type: 'strong', data: '**delimiter**' }])
})

test('making sure the readme is correct', t => {
  const sequence = sequenceText(
    '*if only* there was a way to make `this` a **sequence**',
    patterns)

  t.deepEqual(sequence, [
    { type: 'em', data: '*if only*' },
    { data: ' there was a way to make ' },
    { type: 'code', data: '`this`' },
    { data: ' a ' },
    { type: 'strong', data: '**sequence**' }
  ])
})
