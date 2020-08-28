import { createElement, Text, Wrapper } from "./util";

export class ListView {
  constructor(config) {
    this.children = [];
    this.attribute = new Map();
    this.properties = new Map();
    this.state = Object.create(null);
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  getAttribute(name) {
    return this[name];
  }

  appendChild(child) {
    this.children.push(child);
  }

  render() {
    const data = this.getAttribute("data");

    const root = (
      <div class="list-view" style="width:300px;">
        {data.map(this.children[0])}
      </div>
    );

    return root;
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
