export function spans(targetSelector, wrapEl = 'span', wrapClass = 'new-line') {
  const content = targetSelector

  let sectionWidth = content.getBoundingClientRect().width
  let words = content.innerText.split(/( )/g)
  content.innerHTML = words.map((word) => `<span>${word}</span>`).join(' ')
  let lines = []
  let line = []
  let lineWidth = 0
  let spans = content.querySelectorAll('span')
  spans.forEach((span, i) => {
    let spanWidth = span.getBoundingClientRect().width
    if (lineWidth + spanWidth <= sectionWidth - 4) {
      line.push(span)
      lineWidth += spanWidth
    } else {
      lines.push(line)
      line = []
      lineWidth = 0
      line.push(span)
      lineWidth += spanWidth
    }
  })
  if (line.length) lines.push(line)
  let newLines = lines
    .map(
      (line) =>
        `<${wrapEl} class=${wrapClass}>${line
          .map((span) => span.innerText)
          .join('  ')}</${wrapEl}>`
    )
    .join(' ')
  content.innerHTML = newLines
}
