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
    let bbox = element.node().getBBox();
    let ctm = element.node().getCTM();

    let output = this._svg.append("rect")
      .attr("x", bbox.x)
      .attr("y", bbox.y)
      .attr("width", bbox.width)
      .attr("height", bbox.height)
      .attr("fill", "none")
      .attr("stroke", "rgba(0,0,0,0.25)")
      .attr("stroke-dasharray", "2,2");

    output.node().transform.baseVal.initialize(output.node().ownerSVGElement.createSVGTransformFromMatrix(ctm));
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

  let x = 100 + i * 250;
  let y = 0 + (Math.random()) * 200;
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
const max_frames = 250;

let step = (t) => {
  for (let i in images) {
    let image = images[i];
    let bbox = bboxes[i];
    let dx = Math.floor(Math.random() * 4);
    let dy = Math.floor(Math.random() * 8);

    image.attr("y", parseInt(image.attr("y")) + dy);
    image.attr("x", parseInt(image.attr("x")) + dx);
    bbox.attr("y", parseInt(bbox.attr("y")) + dy);
    bbox.attr("x", parseInt(bbox.attr("x")) + dx);
  }

  current_frame++;

  if (current_frame < max_frames) { window.requestAnimationFrame(step); }
};

window.requestAnimationFrame(step);
