function addStyles(win, styles) {
  styles.forEach((style) => {
    const link = win.document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', style)
    win.document.getElementsByTagName('head')[0].appendChild(link)
  })
}

export function print(el: string, cb = () => true, localOptions?: Record<string, any>) {
  const defaultStyles = []
  let styles = defaultStyles

  // If has localOptions
  // TODO: improve logic
  if (localOptions)
    if (localOptions.styles) styles = localOptions.styles

  const element = window.document.getElementById(el)

  if (!element) {
    alert(`Element to print #${el} not found!`)
    return
  }

  const ifprint = document.createElement('iframe')
  document.body.appendChild(ifprint)
  ifprint.setAttribute('style', 'height:0;width:0;')

  const win = ifprint.contentWindow

  win.document.write(`
        <html>
          <head>
            <title>${window.document.title}</title>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `)

  addStyles(win, styles)

  setTimeout(() => {
    win.document.close()
    win.focus()
    win.print()
    win.close()
    document.body.removeChild(ifprint)
    cb()
  }, 1)

  return true
}

