var assert = require("assert");
import { parseHTML } from "../src/parser";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";

it("parse a single element", () => {
  let doc = parseHTML("<div></div>");
  let element = doc.children[0];
  assert.equal(element.tagName, "div");
  assert.equal(element.children.length, 0);
  assert.equal(element.type, "element");
  assert.equal(element.attributes.length, 2);
});

it("parse a single element with text content", () => {
  let doc = parseHTML("<div>hello</div>");
  let element = doc.children[0].children[0];
  assert.equal(element.content, "hello");
  assert.equal(element.type, "text");
});

it("tag mismatch", () => {
  try {
    let doc = parseHTML("<div></vid>");
  } catch (error) {
    assert.equal(error.message, "Tag start end doesn't match!");
  }
});

it("text with text <", () => {
  let doc = parseHTML("<div>a < b</div>");
  let element = doc.children[0].children[0];
  assert.equal(element.content, "a < b");
  assert.equal(element.type, "text");
});

it("with property", () => {
  let doc = parseHTML("<div id=a class='cls' data=\"abc\" ></div>");
  let element = doc.children[0];
  let count = 0;

  for (const attr of element.attributes) {
    if (attr.name === "id") {
      count++;
      assert.equal(attr.value, "a");
    }
    if (attr.name === "class") {
      count++;
      assert.equal(attr.value, "cls");
    }
    if (attr.name === "data") {
      count++;
      assert.equal(attr.value, "abc");
    }
  }
  assert.ok(count === 3);
});

it("with property 2", () => {
  let doc = parseHTML("<div id=a class='cls' data=\"abc\"></div>");
  let element = doc.children[0];
  let count = 0;

  for (const attr of element.attributes) {
    if (attr.name === "id") {
      count++;
      assert.equal(attr.value, "a");
    }
    if (attr.name === "class") {
      count++;
      assert.equal(attr.value, "cls");
    }
    if (attr.name === "data") {
      count++;
      assert.equal(attr.value, "abc");
    }
  }
  assert.ok(count === 3);
});

it("with property 3", () => {
  let doc = parseHTML("<div id=a class='cls' data=\"abc\" />");
  let element = doc.children[0];
  let count = 0;

  for (const attr of element.attributes) {
    if (attr.name === "id") {
      count++;
      assert.equal(attr.value, "a");
    }
    if (attr.name === "class") {
      count++;
      assert.equal(attr.value, "cls");
    }
    if (attr.name === "data") {
      count++;
      assert.equal(attr.value, "abc");
    }
  }
  assert.ok(count === 3);
});

it("script", () => {
  const content = `
  <div>abcd</div>
  <span>x</span>
  /script>
  <script
  <
  </
  </s
  </sc
  </scr
  </scri
  </scrip
  </script`;
  let doc = parseHTML(`<script>${content}</script>`);
  let element = doc.children[0].children[0];
  assert.equal(element.content, content);
  assert.equal(element.type, "text");
});

it("<", () => {
  const content = `<`;
  let doc = parseHTML(`<script>${content}</script>`);
  let element = doc.children[0].children[0];
  assert.equal(element.content, content);
  assert.equal(element.type, "text");
});

it("attribute with no value", () => {
  let doc = parseHTML("<div class />");
  let element = doc.children[0];
});

it("attribute with no value", () => {
  let doc = parseHTML("<div class id/>");
});

it("attribute with no value", () => {
  let doc = parseHTML("<div/>");
});

it("tagName with Capital letter", () => {
  let doc = parseHTML("<divA></divA>");
});

it("before attribute name", () => {
  let doc = parseHTML("<div       ></div>");
});

it("after attribute name", () => {
  let doc = parseHTML("<div />");
});

it("before single quote attribute value", () => {
  let doc = parseHTML("<div class='></div>");
});

it("single quote attribute value end", () => {
  let doc = parseHTML("<div class='cls'></div>");
});

it("after quote attribute value", () => {
  let doc = parseHTML("<div class='cls'666></div>");
});

it("unquoted attribute value selfClosing startTag", () => {
  let doc = parseHTML("<div id=a/>");
});

it("unquoted  attribute value end", () => {
  let doc = parseHTML("<div id=a></div>");
});
