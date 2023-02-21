export default class ParagraphSplit {
  constructor({ paragraph }) {
    this.paragraph = paragraph
    this.splitLines()

    this.lines = []
    this.words = this.paragraph.getElementsByTagName('span')
    this.splittedLines = []
    this.showLines()
  }

  getLines() {
    let line, lastTop
    for (i = 0; i < this.words.length; i++) {
      var word = this.words[i]
      if (word.offsetTop != lastTop) {
        lastTop = word.offsetTop
        line = []
        this.lines.push(line)
      }
      line.push(word)
    }
  }

  splitLines() {
    this.paragraph.innerHTML = this.paragraph.innerText
      .split(/\s/)
      .map(function (word) {
        return '<span>' + word + '</span>'
      })
      .join(' ')
  }

  showLines() {
    this.splitLines = this.lines.map(function (line) {
      return line
        .map(function (span) {
          return span.innerText
        })
        .join(' ')
    })
  }

  onResize() {
    this.showLines()
  }
}

// splitLines();

// window.onresize = showLines;

// function showLines() {
//     var lines = getLines();
//     console.log(
//     lines.map(function (line) {
//         return line.map(function (span) {
//             return span.innerText;
//         }).join(' ')
//     }));
// }

// function splitLines() {
//     this.paragraph.innerHTML = this.paragraph.innerText.split(/\s/).map(function (word) {
//         return '<span>' + word + '</span>'
//     }).join(' ');
// }

// function getLines() {
//     let line, lastTop
//     for (i = 0; i < this.words.length; i++) {
//         var word = this.words[i];
//         if (word.offsetTop != lastTop) {
//             lastTop = word.offsetTop;
//             line = [];
//             this.lines.push(line);
//         }
//         line.push(word);
//     }
// }
