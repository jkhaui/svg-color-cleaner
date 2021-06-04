export default class SVGColorCleaner {
  constructor({
    fillColor = "#000",
    strokeColor = "#000",
  }) {
    // Define global variables.
    this.FILL_ATTRIBUTE = "fill";
    this.SVG_NODE = "svg";

    // Low-level nodes.
    this.PATH_NODE = "path";
    this.RECT_NODE = "rect";
    this.CIRCLE_NODE = "circle";
    this.TEXT_NODE = "#text";

    // Wrapper nodes.
    this.GLOBAL_NODE = "g";
    this.MASK_NODE = "mask";
    this.DEFS_NODE = "defs";
    this.CLIPPATH_NODE = "clipPath";

    this.STROKE_ATTRIBUTE = "stroke";

    // SVG attributes to be copied onto the virtual SVG.
    this.WIDTH_ATTRIBUTE = "width";
    this.HEIGHT_ATTRIBUTE = "height";
    this.VIEWBOX_ATTRIBUTE = "viewBox";

    this.FILL_COLOR = fillColor;
    this.STROKE_COLOR = strokeColor;
  }

  mutateAttribute = (newSvg, node) => {
    const hasFillAttribute =
      node.hasAttribute(this.FILL_ATTRIBUTE) ||
      window
        .getComputedStyle(node)
        .getPropertyValue(this.FILL_ATTRIBUTE) !== "none";
    const hasStrokeAttribute =
      node.hasAttribute(this.STROKE_ATTRIBUTE) ||
      window
        .getComputedStyle(node)
        .getPropertyValue(this.STROKE_ATTRIBUTE) !== "none";

    if (hasFillAttribute) {
      node.removeAttribute(this.FILL_ATTRIBUTE);
      node.setAttribute("style", `fill: ${this.FILL_COLOR}`);
    }

    // TODO: FInd a way to handle transparent strokes.
    if (hasStrokeAttribute) {
      node.removeAttribute(this.STROKE_ATTRIBUTE);
      node.setAttribute("style", `stroke: ${this.STROKE_COLOR}`);
    }

    newSvg.appendChild(node);
  };

  copySvgAttributes = (oldSvg, newSvg) => {
    if (oldSvg.hasAttribute(this.STROKE_ATTRIBUTE)) {
      const _stroke = oldSvg.getAttribute(this.STROKE_ATTRIBUTE);

      if (_stroke) {
        newSvg.setAttribute(this.STROKE_ATTRIBUTE, _stroke);
      }
    }
    if (oldSvg.hasAttribute(this.FILL_ATTRIBUTE)) {
      const _fill = oldSvg.getAttribute(this.FILL_ATTRIBUTE);

      if (_fill) {
        newSvg.setAttribute(this.FILL_ATTRIBUTE, _fill);
      }
    }
    if (oldSvg.hasAttribute(this.WIDTH_ATTRIBUTE)) {
      const _width = oldSvg.getAttribute(this.WIDTH_ATTRIBUTE);

      if (_width) {
        newSvg.setAttribute(this.WIDTH_ATTRIBUTE, _width);
      }
    }
    if (oldSvg.hasAttribute(this.HEIGHT_ATTRIBUTE)) {
      const _height = oldSvg.getAttribute(this.HEIGHT_ATTRIBUTE);

      if (_height) {
        newSvg.setAttribute(this.HEIGHT_ATTRIBUTE, _height);
      }
    }
    if (oldSvg.hasAttribute(this.VIEWBOX_ATTRIBUTE)) {
      const _viewBox = oldSvg.getAttribute(this.VIEWBOX_ATTRIBUTE);

      if (_viewBox) {
        newSvg.setAttribute(this.VIEWBOX_ATTRIBUTE, _viewBox);
      }
    }
  };

  traverseChildren = (oldSvg, newSvg, node) => {
    const nodeType = node.nodeName;

    switch (nodeType) {
      case this.SVG_NODE:
        this.copySvgAttributes(oldSvg, newSvg, node);
        break;
      // TODO: do NOT apply styling to rect nodes for now... It appears to
      // ruin the svg.
      case this.RECT_NODE:
      case this.TEXT_NODE:
        break;
      case this.CIRCLE_NODE:
      case this.PATH_NODE:
        this.mutateAttribute(newSvg, node);
        break;
      case this.DEFS_NODE:
      case this.GLOBAL_NODE:
        // Declare a variable with (what is assumed to be) the low-level SVG
        // element.
        const grandchildNodes = node.childNodes;
        const grandchildrenCollection = grandchildNodes;
        const grandchildrenLength = grandchildNodes.length;

        // const grandchildNodeType = grandchildNodes.nodeName;
        // const hasGreatGrandChildren =
        //   grandchildNodes.length > 0;
        // const grandchildNodeCount = grandchildNodes.length;

        let i = -1;

        if (++i < grandchildrenLength) {
          do {
            if (grandchildrenCollection[i]) {
              this.traverseChildren(oldSvg, newSvg, grandchildrenCollection[i]);
            }
          }
          while (++i < grandchildrenCollection);
        }

        // First-child nodes, e.g. <g>, <defs>, etc.
        // if (++i < grandchildNodeCount) do {
        //   console.log(grandchildrenCollection[i]);
        //   if (hasGreatGrandChildren) {
        //     // TODO: handle recursive looping through n layers of child
        // nodes. // const greatGrandChild = ... //
        // this.mutateAttribute(greatGrandChild); return; } } while (++i <
        // grandchildNodeCount);
        break;
      case this.CLIPPATH_NODE:
      case this.MASK_NODE:
      default:
        // An exception error message is passed back to the caller if any of
        // the above nodes, or otherwise unknown node types, are detected.
        return false;
    }
  };

  renderVirtualSvg = async (fileData) => {
    // 1. Instantiate a new virtual DOM instance.
    // This creates an empty document node in-memory, with an empty svg element
    // as the single child node.
    const parser = new DOMParser();
    const vDom = parser.parseFromString(fileData, "image/svg+xml");
    const oldSvg = vDom.children[0];

    const newSvg =
      document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const childrenCollection = vDom.all;

    // Cache the length prop to maximise performance.
    const parentLength = childrenCollection.length;

    let i = -1;
    let throwError = false;

    // 2. Iterate through, and extract, all the low-level SVG elements.
    if (++i < parentLength) {
      do {
        if (childrenCollection[i]) {
          const mutate = this.traverseChildren(
            oldSvg,
            newSvg,
            childrenCollection[i],
          );
          if ((childrenCollection[i] || {}).nodeName ===
              this.PATH_NODE && i > 0) {
            i--;
          }

          if (mutate === false) {
            throwError = true;
          }
        }
      }
      while (++i < parentLength);
    }

    if (throwError) {
      return Error("Unidentified node type.");
    }

    vDom.removeChild(oldSvg);
    vDom.appendChild(newSvg);
    const serializer = new XMLSerializer();
    const stringifiedSvg = serializer.serializeToString(vDom);

    // Returns the cleaned SVG string as a promise, if successful.
    return stringifiedSvg;
  };

  setSvgColor = (svgString, color = this.FILL_COLOR) => {
    const svg = `${svgString}`;

    const svgNode = new DOMParser().parseFromString(svg, "text/html");
    const pathList = svgNode.getElementsByTagName("path");

    for (let i = 0; i < pathList.length; i++) {
      const hasFillAttribute =
        pathList[i].hasAttribute(this.FILL_ATTRIBUTE) ||
        window
          .getComputedStyle(pathList[i])
          .getPropertyValue(this.FILL_ATTRIBUTE) !== "none";
      const hasStrokeAttribute =
        pathList[i].hasAttribute(this.STROKE_ATTRIBUTE) ||
        window
          .getComputedStyle(pathList[i])
          .getPropertyValue(this.STROKE_ATTRIBUTE) !== "none";

      if (hasFillAttribute) {
        pathList[i].removeAttribute(FILL_ATTRIBUTE);
        pathList[i].setAttribute("style", `fill: ${this.FILL_COLOR}`);
      }

      if (hasStrokeAttribute) {
        pathList[i].removeAttribute(STROKE_ATTRIBUTE);
        pathList[i].setAttribute("style", `stroke: ${this.STROKE_COLOR}`);
      }
    }
    const serializer = new XMLSerializer();
    const stringifiedSvg =
      serializer.serializeToString(svgNode.getElementsByTagName("svg")[0]);

    return stringifiedSvg;
  };
}
