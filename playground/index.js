import debounce from "lodash/debounce";
import CodeMirror from "codemirror";
import Parser from "../src/jcl.parser";
import "codemirror/lib/codemirror.css";
import "./styles/3024-day.css";
import "codemirror/addon/lint/lint.css";
import "./styles/main.less";

class Editor {
  constructor(editorId, outputId, options) {
    this.lineHandles = [];
    const $container = document.getElementById(editorId);
    const codeEditorOptions = {
      lineNumbers: true,
      gutters: ["CodeMirror-linenumbers", "CodeMirror-lint-markers"],
      theme: "3024-day",
      lint: true
    };
    this.parser = new Parser();
    this.codeEditor = CodeMirror.fromTextArea($container, codeEditorOptions);
    this.$gutter = document.querySelector(".CodeMirror-gutters");
    this.$output = document.getElementById(outputId);
    this.initialize();
  }
  validate() {
    this.clear_marks();
    this.parser.parse(this.codeEditor.getValue());
    const errors = this.parser.errors;
    if (errors.length !== 0) {
      this.toggle_gutter_error(true);
      this.handleErrors(errors);
    } else {
      this.toggle_gutter_error(false);
    }
  }
  handleErrors(errors) {
    errors.forEach(err => {
      const { first_line, last_line, first_column, last_column } = err.location;
      const lineHandle = this.codeEditor.getLineHandle(first_line - 1);
      const marker = this.codeEditor.markText(
        CodeMirror.Pos(first_line - 1, first_column),
        CodeMirror.Pos(last_line - 1, last_column),
        {
          className: "CodeMirror-lint-mark-error",
          title: "error"
        }
      );
      this.lineHandles.push(lineHandle);
      this.codeEditor.addLineClass(lineHandle, "gutter", "error-line");
    });
  }
  clear_marks() {
    this.lineHandles.forEach(line => {
      this.codeEditor.removeLineClass(line, "gutter", "error-line");
    });
    this.codeEditor.getAllMarks().forEach(marker => {
      marker.clear();
    });
  }
  toggle_gutter_error(status = true) {
    this.$gutter.classList.toggle("error", status);
  }
  initialize() {
    this.codeEditor.on("changes", debounce(this.validate.bind(this), 500));
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const editor = new Editor("editor", "output");
});
