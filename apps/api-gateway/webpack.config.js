const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin");
const { join } = require("path");

module.exports = {
  output: {
    path: join(__dirname, "dist"),
  },
  resolve: {
    alias: {
      "@packages": require("path").resolve(__dirname, "../../packages"),
      packages: require("path").resolve(__dirname, "../../packages"),
    },
    extensions: [".ts", ".js"],
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: "node",
      compiler: "tsc",
      main: "./src/main.ts",
      tsConfig: "./tsconfig.app.json",
      optimization: false,
      outputHashing: "none",
      generatePackageJson: true,
      sourceMaps: true,
    }),
  ],
};
