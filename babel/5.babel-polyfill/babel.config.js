module.exports = function(api) {
  api.cache(true);
  const presets = [[
    "@babel/env",
    {
      // targets: "> 0.25%, not dead",
      // targets: "last 2 Chrome versions",
      targets: {
        ie: '8',
        chrome: "78"
      },
      useBuiltIns: "usage"
    }
  ]]
  return {
    presets
  }
}