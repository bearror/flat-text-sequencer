import test from 'oletus'
import sequenceText from '../index'

const patterns = [
  { type: 'new', pattern: /§.+?§/g },
  { type: 'comment', pattern: /\/\/.+/g },
  { type: 'string', pattern: /'.+?'/g }
]

test('nest types', t => {
  const sequence = sequenceText('// support §multiple§ types', patterns)

  t.deepEqual(sequence, [
    { type: ['comment'], data: '// support ' },
    { type: ['comment', 'new'], data: '§multiple§' },
    { type: ['comment'], data: ' types' }])
})

test('sequential nesting', t => {
  const sequence = sequenceText('// §a§ §b§§c§ §d§', patterns)

  t.deepEqual(sequence, [
    { type: ['comment'], data: '// ' },
    { type: ['comment', 'new'], data: '§a§' },
    { type: ['comment'], data: ' ' },
    { type: ['comment', 'new'], data: '§b§' },
    { type: ['comment', 'new'], data: '§c§' },
    { type: ['comment'], data: ' ' },
    { type: ['comment', 'new'], data: '§d§' }])
})

test('nesting should play nice with others', t => {
  const sequence = sequenceText("How about 'a §str§ing' with 'nesting'", patterns)

  t.deepEqual(sequence, [
    { type: [], data: 'How about ' },
    { type: ['string'], data: "'a " },
    { type: ['string', 'new'], data: '§str§' },
    { type: ['string'], data: "ing'" },
    { type: [], data: ' with ' },
    { type: ['string'], data: "'nesting'" }])
})

test('should handle duplicate ranges', t => {
  const sequence = sequenceText('// duplicates §oh no§!', [
    { type: 'new', pattern: /§.+?§/g },
    { type: 'comment', pattern: /\/\/.+/g },
    { type: 'duplicate', pattern: /\/\/.+/g }
  ])

  t.deepEqual(sequence, [
    { type: ['comment', 'duplicate'], data: '// duplicates ' },
    { type: ['comment', 'duplicate', 'new'], data: '§oh no§' },
    { type: ['comment', 'duplicate'], data: '!' }])
})

test('should handle shared start', t => {
  const sequence = sequenceText(`'some end here' some here"...`, [
    { type: 'string', pattern: /'.+?'/g },
    { type: 'sharedStart', pattern: /'.+?"/g }
  ])

  t.deepEqual(sequence, [
    { type: ['string', 'sharedStart'], data: `'some end here'` },
    { type: ['sharedStart'], data: ' some here"' },
    { type: [], data: '...' }])
})

test('should handle shared finish', t => {
  const sequence = sequenceText(`some 'start "here'...`, [
    { type: 'string', pattern: /'.+?'/g },
    { type: 'sharedFinish', pattern: /".+?'/g }
  ])

  t.deepEqual(sequence, [
    { type: [], data: 'some ' },
    { type: ['string'], data: `'start ` },
    { type: ['string', 'sharedFinish'], data: `"here'` },
    { type: [], data: '...' }])
})
