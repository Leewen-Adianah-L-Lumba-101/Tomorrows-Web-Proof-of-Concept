import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import _, { List } from "lodash";

// Register the GSAP plugins
gsap.registerPlugin(MorphSVGPlugin);

console.clear();

gsap.defaults({ ease: 'power1.easeInOut', duration: 1 });

const xmlns = "http://www.w3.org/2000/svg";
const log = console.log.bind(console);

export default function LoginMorpher() {
  const canvasRef = useRef<SVGSVGElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const clearRef = useRef<HTMLButtonElement>(null);
  const smoothRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const sidebar = sidebarRef.current;
    const slider = sliderRef.current;
    const clear = clearRef.current;
    const smooth = smoothRef.current;

    if (!canvas || !sidebar || !slider || !clear || !smooth) return;

    let count = 0;
    let paths: any[] = [];
    let path: any = null;
    let shape = new Spline({ stroke: "#cc0066", strokeWidth: 3 });

    const rebuild = _.debounce(rebuildTimeline, 150);
    const timeline = gsap.timeline({ repeat: 0, yoyo: true });
    let tolerance = 20;

    clear.addEventListener("click", clearDoodles);
    slider.addEventListener("input", updateTolerance);
    canvas.addEventListener("mousedown", startDrawing);

    gsap.set("main", { autoAlpha: 1 });

    // START DRAWING =========================================================
    function startDrawing(event: MouseEvent) {
      timeline.pause(0);
      shape.hide(true);
      count++;

      path = new Polyline({ stroke: "#cc0066" }, count);
      if (!canvas) { return; }
      const rect = canvas.getBoundingClientRect();
      path.last = new Point(event.clientX - rect.left, event.clientY - rect.top);
      paths.push(path);

      if (!sidebar || !canvas) { return; }
      
      sidebar.classList.add("drawing");

      canvas.addEventListener("mousemove", updateDrawing);
      canvas.addEventListener("mouseup", stopDrawing);
      canvas.addEventListener("mouseleave", stopDrawing);
    }

    // UPDATE DRAWING ========================================================
    function updateDrawing(event: MouseEvent) {
      if (!canvas) { return; }
      const rect = canvas.getBoundingClientRect();
      path.addPoint(new Point(event.clientX - rect.left, event.clientY - rect.top));
    }

    // STOP DRAWING ==========================================================
    function stopDrawing(event: MouseEvent) {

      if (!sidebar || !canvas) { return; }

      sidebar.classList.remove("drawing");

      canvas.removeEventListener("mousemove", updateDrawing);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);

      path.simplify(tolerance);
      shape.solve(path.reduced);

      animate();
    }

    // ANIMATE ===============================================================
    function animate() {
      path.hide();
      shape.show();

      if (count === 1) {
        shape.update();
        timeline.set(shape, { attr: { d: shape.path } });
      } else {
        timeline.to(shape, 1, { morphSVG: { shape: shape.path, shapeIndex: 0 } }).play();
      }
    }

    // REBUILD TIMELINE ======================================================
    function rebuildTimeline() {
      timeline.pause(0).clear();
      shape.hide();
      tolerance = getTolerance();

      _.reduce(paths, (tween, path, index) => {
        path.simplify(tolerance);
        shape.solve(path.reduced);

        if (!index) {
          shape.update();
          timeline.set(shape, { attr: { d: shape.path } });
        } else {
          timeline.to(shape, 1, { morphSVG: shape.path }).play();
        }
        return tween;
      }, timeline);

      shape.show();
      timeline.play(0);
    }

    // GET TOLERANCE =========================================================
    function getTolerance() {
      if (!slider) return 20;
      const value = parseInt(slider.value);
      if (smooth) smooth.textContent = value.toString();
      return value;
    }

    // UPDATE TOLERANCE ======================================================
    function updateTolerance() {
      tolerance = getTolerance();
      timeline.pause();
      if (paths.length) rebuild();
    }

    // CLEAR DOODLES =========================================================
    function clearDoodles() {
      timeline.pause(0).clear();
      shape.clear();
      paths.forEach(path => path.destroy());
      paths = [];
      count = 0;
    }

    // Cleanup
    return () => {
      clear.removeEventListener("click", clearDoodles);
      slider.removeEventListener("input", updateTolerance);
      canvas.removeEventListener("mousedown", startDrawing);
    };
  }, []);

  return (
    <div>
      <main>
        <div className="content">
          <svg id="canvas-login" ref={canvasRef} width="400" viewBox="0 0 400 auto"></svg>
        </div>

        <div className="sidebar" ref={sidebarRef}>
          <div className="row">
            <div className="col-xs-12">
              <h3>Start Doodling...</h3>
            </div>
          </div>

          <div className="row control">
            <div className="col-xs-12">
              <button id="clear" ref={clearRef} className="btn btn-shadow-drop btn-shadow-drop--black cafewhitebtn">Clear</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// POINT
class Point {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static parse(event: MouseEvent) {
    return new Point(event.clientX, event.clientY);
  }
}

// VECTOR
class Vector {
  x: number;
  y: number;

  constructor(x: number | Point = 0, y: number = 0) {
    const point = typeof x === "object" && x.x && x.y ? x : { x: typeof x === "number" ? x : 0, y };
    this.x = point.x;
    this.y = point.y;
  }

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  set magnitude(m) {
    const uv = this.normalize();
    this.x = uv.x * m;
    this.y = uv.y * m;
  }

  static fromPoints(p1: Point, p2: Point) {
    return new Vector(p2.x - p1.x, p2.y - p1.y);
  }

  cross(vector: Vector) {
    return this.x * vector.y - this.y * vector.x;
  }

  dot(vector: Vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  add(vector: Vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector: Vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  multiply(scalar: number) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number) {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  normalize() {
    const v = new Vector();
    const m = this.magnitude;
    v.x = this.x / m;
    v.y = this.y / m;
    return v;
  }

  unit() {
    return this.divide(this.magnitude);
  }

  perp() {
    return new Vector(-this.y, this.x);
  }

  perpendicular(vector: Vector) {
    return this.subtract(this.project(vector));
  }

  project(vector: Vector) {
    const percent = this.dot(vector) / vector.dot(vector);
    return vector.multiply(percent);
  }

  reflect(axis: Vector) {
    const vdot = this.dot(axis);
    const ldot = axis.dot(axis);
    const ratio = vdot / ldot;
    const v = new Vector();
    v.x = 2 * ratio * axis.x - this.x;
    v.y = 2 * ratio * axis.y - this.y;
    return v;
  }
}

// SPLINE
class Spline {
  group: SVGGElement;
  node: SVGPathElement;
  length: number;
  paths: any[];

  constructor(config: any = {}) {
    const canvas = document.querySelector("#canvas-login") as SVGSVGElement;
    this.group = createSVG("g", canvas, { autoAlpha: 0 }) as SVGGElement;
    this.node = createSVG("path", canvas, config) as SVGPathElement;
    this.length = 1;
    this.paths = [];
  }

  get path() {
    return this.paths[this.paths.length - 1].data;
  }

  hide(showGroup = false) {
    gsap.set(this.node, { autoAlpha: 0 });
    gsap.set(this.group, { autoAlpha: showGroup ? 1 : 0 });
    return this;
  }

  show() {
    gsap.set(this.node, { autoAlpha: 1 });
    gsap.set(this.group, { autoAlpha: 0 });
    return this;
  }

  set(vars: any) {
    gsap.set(this.node, vars);
    return this;
  }

  clear() {
    const group = this.group;
    while (group.lastChild) {
      group.removeChild(group.lastChild);
    }
    this.paths = [];
    this.hide();
    return this;
  }

  addPath(data: string) {
    const paths = this.paths;
    const props = { stroke: "#ddd", attr: { d: data } };
    const node = createSVG("path", this.group, props);
    let alpha = 0.95;

    paths.push({ node, data });

    let i = paths.length;
    while (i--) {
      gsap.set(paths[i].node, { autoAlpha: alpha });
      alpha = Math.max(alpha - 0.3, 0);
    }

    return this;
  }

  update() {
    this.node.setAttribute("d", this.path);
    return this;
  }

  solve(data: number[]) {
    const size = data.length;
    const last = size - 4;

    let path = `M${data[0]},${data[1]}`;

    for (let i = 0; i < size - 2; i += 2) {
      const x0 = i ? data[i - 2] : data[0];
      const y0 = i ? data[i - 1] : data[1];

      const x1 = data[i + 0];
      const y1 = data[i + 1];

      const x2 = data[i + 2];
      const y2 = data[i + 3];

      const x3 = i !== last ? data[i + 4] : x2;
      const y3 = i !== last ? data[i + 5] : y2;

      const cp1x = (-x0 + 6 * x1 + x2) / 6;
      const cp1y = (-y0 + 6 * y1 + y2) / 6;

      const cp2x = (x1 + 6 * x2 - x3) / 6;
      const cp2y = (y1 + 6 * y2 - y3) / 6;

      path += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;
    }

    this.addPath(path);
    return path;
  }
}

// POLYLINE
class Polyline {
  node: SVGPolylineElement;
  data: any;
  length: number;
  last: Point | null;
  points: Point[];
  initial: number[];
  reduced: number[];

  constructor(config: any = {}, count?: number) {
    const canvas = document.querySelector("#canvas-login") as SVGSVGElement;
    this.node = createSVG("polyline", canvas) as any;

    this.data = {};
    this.length = 1;
    this.last = null;
    this.points = [];
    this.initial = [];
    this.reduced = [];

    this.set(config);
  }

  addPoint(point: Point) {
    if (this.last!.x !== point.x || this.last!.y !== point.y) {
      this.last = point;
      this.points.push(point);
      this.initial.push(point.x);
      this.initial.push(point.y);
      this.data.initial = this.points.length;
      this.node.setAttribute("points", this.initial.join(","));
    }
    return this;
  }

  destroy() {
    const canvas = document.querySelector("#canvas-login") as SVGSVGElement;
    canvas.removeChild(this.node);
    this.last = null;
    this.points = [];
    this.initial = [];
    this.reduced = [];
  }

  hide() {
    this.set({ autoAlpha: 0 });
    return this;
  }

  show() {
    this.set({ autoAlpha: 1 });
    return this;
  }

  updatePoints() {
    this.data.reduced = this.reduced.length / 2;
    this.node.setAttribute("points", this.reduced.join(","));
    return this;
  }

  set(vars: any) {
    gsap.set(this.node, vars);
    return this;
  }

  simplify(tolerance = 10) {
    const points = this.points;
    const length = points.length;

    if (length < 3) {
      if (!length) {
        this.addPoint(new Point(this.last!.x, this.last!.y + 0.2));
      }
      this.addPoint(new Point(this.last!.x + 0.2, this.last!.y));
      this.reduced = [...this.initial];
      this.updatePoints();
      return;
    }

    function acceptPoint() {
      acceptedPoint = previousPoint;
      result.push(acceptedPoint);
      cache = [];
    }

    let previousPoint = points[0];
    let acceptedPoint = points[0];
    let currentPoint = points[1];
    let currentVector = Vector.fromPoints(previousPoint, currentPoint);
    let previousVector: Vector;

    const result: Point[] = [points[0]];
    let cache: Vector[] = [];

    for (let i = 2; i < length; i++) {
      previousPoint = currentPoint;
      currentPoint = points[i];
      previousVector = currentVector;
      currentVector = Vector.fromPoints(previousPoint, currentPoint);

      if (previousVector.dot(currentVector) < 0) {
        acceptPoint();
      } else {
        const candidate = Vector.fromPoints(acceptedPoint, currentPoint);
        const lastVector = Vector.fromPoints(acceptedPoint, previousPoint);

        cache.push(lastVector);

        for (let j = 0; j < cache.length; j++) {
          const perp = cache[j].perpendicular(candidate);
          if (perp.magnitude > tolerance) {
            acceptPoint();
            break;
          }
        }
      }
    }

    result.push(points[points.length - 1]);

    this.reduced = result.reduce((path, point) => {
      path.push(point.x);
      path.push(point.y);
      return path;
    }, [] as number[]);

    this.updatePoints();
    return this;
  }
}

// CREATE SVG
function createSVG(type: string, parent: Element, config?: any): SVGElement {
  const node = document.createElementNS(xmlns, type) as SVGElement;
  parent.appendChild(node);
  if (config) gsap.set(node, config);
  return node;
}