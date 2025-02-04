module.exports = {
  parserOpts: { allowReturnOutsideFunction: true },
  plugins: ['transform-react-jsx'],
  presets: ['@babel/preset-env'],
};
// npx babel ./src/app.jsx -d ../