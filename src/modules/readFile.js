/* global BufferedReader FileReader */

export function readFile (dir, filename, defaultExt, exts) {
  const file = context.getSafeOpenFile(dir, filename, defaultExt, exts)

  if (!file.exists()) {
    return undefined
  } else {
    var buffer = new BufferedReader(new FileReader(file))
    var bufStr = ''
    var line = ''

    do {
      bufStr = bufStr + line
      bufStr = bufStr + '\n'
      line = buffer.readLine()
    } while (line)

    buffer.close()

    return bufStr
  }
}

export function getConfig () {
  const config = readFile('craftscripts', 'config', 'json', [])
  return config
    ? JSON.parse(config)
    : {}
}