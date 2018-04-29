import test from 'oletus'
import sequenceText from '../index'

const patterns = [
  { type: 'h3', pattern: /###.*/g },
  { type: 'h2', pattern: /##.*/g },
  { type: 'h1', pattern: /#.*/g },
  { type: 'strong', pattern: /__.+?__/g },
  { type: 'em', pattern: /\*.+?\*/g },
  { type: 'code', pattern: /`.+?`/g }
]

test('single token', t => {
  const sequence = sequenceText('#Hello, World!', patterns)

  t.deepEqual(sequence, [{ type: ['h1'], data: '#Hello, World!' }])
})

test('multiple tokens', t => {
  const sequence = sequenceText('__strong__ and __very strong__', patterns)

  t.deepEqual(sequence, [
    { type: ['strong'], data: '__strong__' },
    { type: [], data: ' and ' },
    { type: ['strong'], data: '__very strong__' }])
})

test('confilcting patterns', t => {
  const sequence = sequenceText(
    '*fancy* and __strong__ *stuff* *yep...*__hello__ there',
    patterns)

  t.deepEqual(sequence, [
    { type: ['em'], data: '*fancy*' },
    { type: [], data: ' and ' },
    { type: ['strong'], data: '__strong__' },
    { type: [], data: ' ' },
    { type: ['em'], data: '*stuff*' },
    { type: [], data: ' ' },
    { type: ['em'], data: '*yep...*' },
    { type: ['strong'], data: '__hello__' },
    { type: [], data: ' there' }])
})

test('nested patterns', t => {
  const sequence = sequenceText('__this stuff is *nested*!__', patterns)

  t.deepEqual(sequence, [
    { type: ['strong'], data: '__this stuff is ' },
    { type: ['strong', 'em'], data: '*nested*' },
    { type: ['strong'], data: '!__' }])
})

test('adjacent patterns', t => {
  const sequence = sequenceText('__personal____space__', patterns)

  t.deepEqual(sequence, [
    { type: ['strong'], data: '__personal__' },
    { type: ['strong'], data: '__space__' }])
})

test('making sure the readme is correct', t => {
  const sequence = sequenceText(
    '*if only* there was a way to make `this` a __sequence__',
    patterns)

  t.deepEqual(sequence, [
    { type: ['em'], data: '*if only*' },
    { type: [], data: ' there was a way to make ' },
    { type: ['code'], data: '`this`' },
    { type: [], data: ' a ' },
    { type: ['strong'], data: '__sequence__' }])
})

test('known markdown oddities', t => {
  const sequence = sequenceText('### Which heading is this?', patterns)

  t.deepEqual(sequence, [
    { type: ['h3', 'h2', 'h1'], data: '### Which heading is this?' }])
})
