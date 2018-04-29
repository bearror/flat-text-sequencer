'use strict'

function extractMatches (text, patterns) {
  const matches = []

  patterns.map(({ type, pattern }) => {
    text.replace(pattern, (match, ...args) => {
      const index = args[args.length - 2]

      matches.push({ type, match, start: index, finish: index + match.length - 1 })
    })
  })

  return matches
}

function sequenceMatches (text, matches) {
  const sequence = []

  let next = 0

  matches.sort((a, b) => a.finish - b.finish).map(({ type, match, start, finish }) => {
    const types = []
    const ongoing = matches
      .filter(range => range.start <= finish && range.finish >= finish && finish >= next)
      .sort((a, b) => a.start - b.start)

    ongoing.map((range, index) => {
      types.push(range.type)

      if (next < range.start) sequence.push({ type: [], data: text.substring(next, range.start) })
      if (ongoing[index + 1]) {
        if (ongoing[index + 1].start > Math.max(range.start, next)) {
          sequence.push({ type: types.slice(), data: text.substring(Math.max(range.start, next), ongoing[index + 1].start) })
        }

        next = Math.max(next, ongoing[index + 1].start)
      } else {
        sequence.push({ type: types.slice(), data: text.substring(Math.max(range.start, next), finish + 1) })
        next = finish + 1
      }
    })

    next = finish + 1
  })

  if (next < text.length) sequence.push({ type: [], data: text.substring(next, text.length) })

  return sequence
}

module.exports = function sequenceText (text, patterns) {
  return sequenceMatches(text, extractMatches(text, patterns))
}
