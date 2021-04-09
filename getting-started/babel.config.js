module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/typescript",
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
  ],
  plugins: [["@babel/plugin-proposal-class-properties", { loose: true }]],
};
