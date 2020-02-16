export default function (path: string, name: string) {
  return {
    output: {
      filename: 'index.js',
      path: path,
      library: name,
      libraryTarget: 'umd',
    },
  }
}
