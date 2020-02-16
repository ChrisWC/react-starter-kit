export default function (ext = /\.(js|jsx)$/) {
  return {
    test: ext,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
    },
  }
}
