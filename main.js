function extractMatches (text, patterns, delimiter) {
  const matches = []
  const offsets = []

  let result = text
  let previousOffsets = []
  let totalMatchLength = 0

  patterns.map(({ type, pattern }) => {
    result = result.replace(pattern, (match, ...args) => {
      const offset = args[args.length - 2]

      matches.push({
        type,
        match,
        index: previousOffsets.reduce(
          // Add the lengths of previous matches to the left of the offset.
          (total, value, index) => (total += (index <= offset) ? value : 0),
          offset
        )
      })

      // Adjust the array to work in terms of the next result string.
      offsets[offset - totalMatchLength] = match.length - delimiter.length
      totalMatchLength += match.length - delimiter.length

      return delimiter
    })

    totalMatchLength = 0
    previousOffsets = offsets.slice()
  })

  return matches
}

function sequenceMatches (text, matches) {
  const sequence = []

  let previousIndex = 0

  matches.sort((a, b) => a.index - b.index).map(({ match, index, type }) => {
    if (index > previousIndex) {
      sequence.push({ data: text.substring(previousIndex, index) })
    }

    if (index >= previousIndex) {
      sequence.push({ type, data: match })
      previousIndex = index + match.length
    }
  })

  if (previousIndex < text.length) {
    sequence.push({ data: text.substring(previousIndex, text.length) })
  }

  return sequence
}

module.exports = function sequenceText (text, patterns, delimiter = ' ') {
  return sequenceMatches(text, extractMatches(text, patterns, delimiter))
}
