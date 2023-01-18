import * as readline from 'readline'

export async function awaitStdin(
  question: string = '',
  hideInput: boolean = true,
  awaitMillis: number = 100
): Promise<string | undefined> {
  const input = process.stdin
  const output = process.stdout
  const rl = readline.createInterface(input, output)

  let keypressOccurred = true
  let text: string | undefined = undefined
  const keypressListener = () => {
    text = rl.line
    const len = text.length
    if (hideInput) {
      readline.moveCursor(output, -len, 0)
      readline.clearLine(output, 1)
    }
    keypressOccurred = true
  }
  input.on('keypress', keypressListener)

  while (keypressOccurred) {
    keypressOccurred = false
    let timeout: NodeJS.Timeout | undefined = undefined
    await new Promise(resolve => {
      timeout = setTimeout(() => resolve('timeout'), awaitMillis)
    })
    if (timeout != null)
      clearTimeout(timeout)
  }

  input.removeListener('keypress', keypressListener)
  rl.close()
  return text
}
