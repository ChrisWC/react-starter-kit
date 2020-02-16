export default function (path: string, name: string, verbose = false) {
  return {
    output: {
      path,
      publicPath: '/assets',
      verbose,
      filename: '[name].chunk.js',
    },
  }
}
