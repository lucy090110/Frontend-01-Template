import { createElement } from "./util";
// import { Carousel } from "./carousel.js";
// import { Panel } from "./panel.js";
// import { TabPanel } from "./TabPanel.js";
import { ListView } from "./ListView.js";

const data = [
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];

// let component = (
//   <Panel title="this is a panel">
//     <span>this is conent</span>
//   </Panel>
// );

// let component = (
//   <TabPanel>
//     <span title="title1">this is conent1</span>
//     <span title="title2">this is conent2</span>
//     <span title="title3">this is conent3</span>
//     <span title="title4">this is conent4</span>
//   </TabPanel>
// );

const list = [
  {
    title: "蓝猫",
    url:
      "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  },
  {
    title: "橘猫加白",
    url:
      "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  },
  {
    title: "狸花加白",
    url:
      "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  },
  {
    title: "橘猫",
    url:
      "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
  },
];

let component = (
  <ListView data={list}>
    {(record) => (
      <figure>
        <img src={record.url} />
        <figcaption>{record.title}</figcaption>
      </figure>
    )}
  </ListView>
);

component.mountTo(document.body);
