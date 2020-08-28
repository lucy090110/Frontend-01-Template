var assert = require("assert");
// const test = require("ava");
const mod = require("../src/add");

describe("Array", function () {
  it("add(3,4) should be 7", function () {
    assert.equal(mod.add(3, 4), 7);
  });
});

// test("add", (t) => {
//   if (mod.add(3, 4) === 7) {
//     t.pass();
//   }
// });
