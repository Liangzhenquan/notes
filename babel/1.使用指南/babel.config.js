const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      useBuiltIns: 'usage',    //使用@babel/polyfill，将检查您所有的代码，以查找目标环境中缺少的功能，并且仅包括所需的polyfill。
    }
  ]
]

module.exports = {presets}