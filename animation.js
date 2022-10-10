class SVGImage {
  constructor(element, w, h) {
    this._svg = d3.select(element).append("svg").attr("width", w).attr("height", h);
  }

  add_image(path, x, y, w, h) {
    return this._svg.append("image")
      .attr("x", x)
      .attr("y", y)
      .attr("width", w)
      .attr("height", h)
      .attr("href", path);
  }

  draw_bbox(element) {
    let parent_bbox = this._svg.node().getBoundingClientRect();
    let bbox = element.node().getBoundingClientRect();

    let output = this._svg.append("g");

    output.append("rect")
      .attr("x", bbox.x - parent_bbox.x)
      .attr("y", bbox.y - parent_bbox.y)
      .attr("width", bbox.width)
      .attr("height", bbox.height)
      .attr("fill", "none")
      .attr("stroke", "rgba(0,0,0,0.25)")
      .attr("stroke-dasharray", "16,8");

    output.append("text")
      .attr("class", "bbox-label")
      .attr("x", bbox.x - parent_bbox.x)
      .attr("y", bbox.y - parent_bbox.y - 10)
      .text(`(${(bbox.x - parent_bbox.x).toFixed(2)}, ${(bbox.y - parent_bbox.y).toFixed(2)})`);

    return output;
  }
}

let svg = new SVGImage("#display", 1920, 1080);
let image_files = [
  "1F332.svg", "1F4D9.svg", "1F603.svg",
  "1F7E9.svg", "1F9C0.svg", "1FAAA.svg",
  "2B50.svg"
];

let images = [];
let bboxes = [];

for (let i = 0; i < image_files.length; i++) {
  let image = svg.add_image(`imgs/${image_files[i]}`, 0, 0, 100, 100);

  let x = 100 + (Math.floor(Math.random() * 6)) * 250;
  let y = Math.random() * 1080 / 2;
  let scale = 1.75 + Math.random() * 1;

  let transforms = [
    `translate(${x}, ${y})`,
    `scale(${scale})`
  ];

  image.attr("transform", transforms.join(","));
  images.push(image);
  bboxes.push(svg.draw_bbox(image));
}

let current_frame = 0;
const max_frames = 200;
const interval = 100;

let step = (t) => {
  for (let i in bboxes) {
    bboxes[i].node().remove();
  }

  bboxes = [];

  for (let i in images) {
    let image = images[i];

    let dx = (2 + i / 3) * Math.sin(4 * Math.PI * Math.pow(current_frame / interval, 1)) * 6;
    let dy = (2 + i / 3) * Math.cos(4 * Math.PI * Math.pow(current_frame / interval, 1)) * 6;

    if (i % 3 == 0 || i % 5 == 0) {
      dx = -dx;
    }

    image.attr("y", parseInt(image.attr("y")) + dy);
    image.attr("x", parseInt(image.attr("x")) + dx);
    // image.attr("width", parseInt(image.attr("width")) + 1);
    // image.attr("height", parseInt(image.attr("height")) + 1);

    bboxes.push(svg.draw_bbox(image));
  }

  current_frame++;

  if (current_frame < max_frames) {
    setTimeout(step, 33);
  }
};

step();
