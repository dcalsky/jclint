import debounce from "lodash/debounce";
import CodeMirror from "codemirror";
import Parser from "../src/jcl.parser";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/shadowfox.css";
import "./styles/main.less";

class Editor {
  constructor(editor_id, output_id, options) {
    const $container = document.getElementById(editor_id);
    this.parser = new Parser();
    this.code_editor = CodeMirror.fromTextArea($container, {
      lineNumbers: true,
      mode: "jcl",
      matchBrackets: true,
      theme: "shadowfox"
    });
    this.$gutter = document.querySelector(".CodeMirror-gutters");

    this.$output = document.getElementById(output_id);
    this.initialize();
  }
  validate() {
    this.parser.parse(this.code_editor.getValue());
    console.log(this.parser.error)
    if (this.parser.error) {
      const body = this.parser.error;
      this.$gutter.classList.toggle("error", true);
      this.code_editor.addLineClass(
        body.location.first_line - 1,
        "gutter",
        "error-line"
      );
    } else {
      this.$output.textContent = "";
      this.clear_gutter_mark();
    }
    // catch (e) {
    //   const matches = e.message.match("line ([0-9]*)");
    //   this.$gutter.classList.toggle("error", true);
    //   if (matches) {
    //     this.code_editor.addLineClass(
    //       parseInt(matches[1] - 1),
    //       "gutter",
    //       "error-line"
    //     );
    //   } else {
    //     throw e;
    //     this.$output.textContent = e;
    //   }
    // }
  }
  clear_gutter_mark() {
    this.$gutter.classList.toggle("error", false);
    this.code_editor.eachLine(line => {
      this.code_editor.removeLineClass(line, "gutter", "error-line");
    });
  }
  initialize() {
    this.code_editor.on("changes", debounce(this.validate.bind(this), 500));
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const editor = new Editor("editor", "output");
});
