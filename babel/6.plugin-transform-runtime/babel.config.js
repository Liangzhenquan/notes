module.exports = function(api) {
  api.cache(true)
  // const plugins = ["@babel/transform-runtime"]
  const plugins = []
  const presets = [
    [
      "@babel/env",
      {
        "useBuiltIns": "usage",
      }
    ]
  ]
  return {
    plugins,
    presets
  }
}