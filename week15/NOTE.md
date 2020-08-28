组件化
类 vue 的 SFC
SFC

module.exports = function (source, map) {
  let tree = parser.parseHTML(source);
  let template = null;
  let script = null;
  for (const node of tree.children) {
    if (node.tagName === "template") {
      template = node.children.find((e) => e.type !== "text");
    } else if (node.tagName === "script") {
      script = node.children[0].content;
    }
  }

  let visit = (node) => {
    if (node.type === "text") {
      return JSON.stringify(node.content);
    }
    let attrs = {};
    for (const attribute of node.attributes) {
      attrs[attribute.name] = attribute.value;
    }

    let children = node.children.map((node) => visit(node));
    return `createElement("${node.tagName}",${JSON.stringify(
      attrs
    )},${children})`;
  };

  const pData = `
  import { createElement, Text, Wrapper } from "./util";
  
  export class Carousel {
    setAttribute(name, value) {
      this[name] = value;
    }

    render(){
     return ${visit(template)};
    }

    mountTo(parent) {
      this.render().mountTo(parent);
    }
  }
  `;

  console.log("==============pData=================", pData);

  return pData;
};
组件化--动画
this.tick = () => {
  let t = Date.now() - this.startTime;
  let animations = this.animations.filter((animation) => !animation.finished);
  for (const animation of animations) {
    let {
      object,
      property,
      template,
      start,
      end,
      timingFunction,
      delay,
      duration,
      addTime,
    } = animation;
    let progression = timingFunction((t - delay - addTime) / duration); // 0-1之间的数
    if (t > duration + delay + addTime) {
      progression = 1;
      animation.finished = true;
    }
    let value = start + progression * (end - start);
    object[property] = template(value);
  }
  if (animations.length) {
    this.requestId = requestAnimationFrame(this.tick);
  }
};