var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "title",
        message: "Your project title",
      },
    ]);
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      { title: this.answers.title } // user answer `title` used
    );
    this.fs.copyTpl(
      this.templatePath(".nycrc"),
      this.destinationPath(".nycrc")
    );
    this.fs.copyTpl(
      this.templatePath(".babelrc"),
      this.destinationPath(".babelrc")
    );
    this.fs.copyTpl(
      this.templatePath("util.js"),
      this.destinationPath("src/lib/util.js")
    );
    this.fs.copyTpl(
      this.templatePath("gesture.js"),
      this.destinationPath("src/lib/gesture.js")
    );
    this.fs.copyTpl(
      this.templatePath("index.js"),
      this.destinationPath("src/index.js")
    );
    this.fs.copyTpl(
      this.templatePath("index.test.js"),
      this.destinationPath("test/index.test.js")
    );
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("src/index.html"),
      { title: this.answers.title } // user answer `title` used
    );
    this.fs.copyTpl(
      this.templatePath("webpack.config.js"),
      this.destinationPath("config/webpack.config.js")
    );
    this.npmInstall(
      [
        "webpack",
        "webpack-cli",
        "webpack-dev-server",
        "@babel/core",
        "@babel/preset-env",
        "@babel/plugin-transform-react-jsx",
        "babel-loader",
        "clean-webpack-plugin",
        "html-webpack-plugin",
        "mocha",
        "nyc",
        "babel-plugin-istanbul",
        "@istanbuljs/nyc-config-babel",
        "@babel/register",
      ],
      {
        "save-dev": true,
      }
    );
  }
};
