export function showLines({ element }) {
  splitLines(element)
  var lines = getLines(element)
  // console.log(lines)

  const splittedLines = lines.map(function (line) {
    return line
      .map(function (span) {
        return span.innerText
      })
      .join(' ')
  })

  return splittedLines
}

function splitLines(element) {
  var p = element
  p.innerHTML = p.innerText
    .split(/\s/)
    .map(function (word) {
      return '<span>' + word + '</span>'
    })
    .join(' ')
}

export function getLines(element) {
  splitLines(element)
  var lines = []
  var line
  var p = element
  var words = p.getElementsByTagName('span')
  var lastTop
  for (var i = 0; i < words.length; i++) {
    var word = words[i]
    if (word.offsetTop != lastTop) {
      lastTop = word.offsetTop
      line = []
      lines.push(line)
    }
    line.push(word)
  }
  return lines
}
