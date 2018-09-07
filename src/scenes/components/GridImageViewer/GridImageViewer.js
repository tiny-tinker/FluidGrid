import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import $ from "jquery";
import Image from "../Image/Image";
import "./GridImageViewer.css";

function getImgProperty(img) {
  let $img = $(img);
  let params = new Array();
  params["w"] =
    parseFloat($img.css("border-left-width")) +
    parseFloat($img.css("border-right-width"));
  params["h"] =
    parseFloat($img.css("border-top-width")) +
    parseFloat($img.css("border-bottom-width"));
  return params;
}

function resizeRow(obj, row, settings, rownum) {
  /**
   *
   * How much bigger is this row than the available space?
   * At this point we have adjusted the images height to fit our target height
   * so the image size will already be different from the original.
   * The resizing we're doing here is to adjust it to the album width
   *
   * We also need to change the album width (basically available space) by
   * the amount of padding and css borders of the images otherwise
   * this will skew the result
   *
   * This is because padding and borders remain at a fixed size and we only need to scale the images
   *
   */

  let imageExtras =
      settings.padding * (obj.length - 1) + obj.length * obj[0][3],
    albumWidthAdjusted = settings.albumWidth - imageExtras,
    overPercent = albumWidthAdjusted / (row - imageExtras),
    // start tracking our width with know values that will make up the total width
    // like borders and padding
    trackWidth = imageExtras,
    // guess where this is the last row in a set by checking if the width is less
    // than the parent width
    lastRow = row < settings.albumWidth ? true : false;

  /*
     * Resize the images by the above % so that they'ill fit in the album space
     */

  for (let i = 0; i < obj.length; i++) {
    let $obj = $(obj[i][0]),
      fw = Math.floor(obj[i][1] * overPercent),
      fh = Math.floor(obj[i][2] * overPercent),
      // if the element is the last in the row,
      // don't apply right hand padding (this is our flag for later)
      isNotLast = !!(i < obj.length - 1);

    /**
     *
     * Checking if the user wants to not stretch the images of the last row to fit the parent element size
     *
     */

    if (settings.allowPartialLastRow === true && lastRow === true) {
      fw = obj[i][1];
      fh = obj[i][2];
    }

    /**
     *
     * Because we use % to calculate the widths, it's possible that they are
     * a few pixels out in which case we need to track this and adjust the last image accordingly
     *
     */

    trackWidth += fw;

    /**
     *
     * here we check if the combined images are exactly the width
     * of the parent. If not then we add a few pixels on to make up the difference
     *
     * This will after the aspect ratio of the image slightly, but
     * by a noticeable amount.
     *
     * If the user doesn't want full width last row, we check for that here
     *
     */

    if (!isNotLast && trackWidth < settings.albumWidth) {
      if (settings.allowPartialLastRow === true && lastRow === true) {
        fw = fw;
      } else {
        fw = fw + (settings.albumWidth - trackWidth);
      }
    }

    fw--;

    /**
     *
     * We'll be doing a few things to the image so here we cache the image selector
     *
     *
     */
    let $img = $obj.is("img") ? $obj : $obj.find("img");

    /**
     *
     * Set the width of the image and parent element
     * if the resized element is not an image, we apply it to the child image also
     *
     * We need to check if it's an image as the css borders are only measured on images.
     * If the parent is a div, we need make the contained image smaller
     * to accommodate the css image borders.
     *
     */
    $img.width(fw);
    if (!$obj.is("img")) {
      $obj.width(fw + obj[i][3]);
    }

    /**
     *
     * Set the height of the image
     * if the resized element is not an image, we apply it to the child image also
     *
     */
    $img.height(fh);
    if (!$obj.is("img")) {
      $obj.height(fh + obj[i][4]);
    }

    /**
     *
     * Apply the css extras like padding
     */
    applyModifications($obj, isNotLast, settings);

    /**
     *
     * Assign the effect to show the image
     *
     */
    $img
      .one(
        "load",
        (function(target) {
          return function() {
            if (settings.effect == "default") {
              target.animate(
                { opacity: "1" },
                { duration: settings.fadeSpeed }
              );
            } else {
              if (settings.direction == "vertical") {
                var sequence = rownum <= 10 ? rownum : 10;
              } else {
                var sequence = i <= 9 ? i + 1 : 10;
              }
              /* Remove old classes with the "effect-" name */
              target.removeClass(function(index, css) {
                return (css.match(/\beffect-\S+/g) || []).join(" ");
              });
              target.addClass(settings.effect);
              target.addClass("effect-duration-" + sequence);
            }
          };
        })($obj)
      )
      /*
             * fix for cached or loaded images
             * For example if images are loaded in a "window.load" call we need to trigger
             * the load call again
             */
      .each(function() {
        if (this.complete) $(this).trigger("load");
      });
  }
}

/**
 *
 * This private function applies the required css to space the image gallery
 * It applies it to the parent element so if an image is wrapped in a <div> then
 * the css is applied to the <div>
 *
 */
function applyModifications($obj, isNotLast, settings) {
  let css = {
    // Applying padding to element for the grid gap effect
    "margin-bottom": settings.padding + "px",
    "margin-right": isNotLast ? settings.padding + "px" : "0px",
    // Set it to an inline-block by default so that it doesn't break the row
    display: settings.display,
    // Set vertical alignment otherwise you get 4px extra padding
    "vertical-align": "bottom",
    // Hide the overflow to hide the caption
    overflow: "hidden"
  };

  return $obj.css(css);
}

class GridImageViewer extends React.Component {
  constructor(props) {
    super(props);
    this.gridImage = this.gridImage.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }
  gridImage(options) {
    /**
     *
     * setup bars
     */

    // track row with by adding images, padding and css borders etc
    let row = 0.0,
      // collect elements to be re-sized in current row
      elements = [],
      // track the number of rows generated
      rownum = 1,
      // album container HTML DOM
      albumContainerDom = ReactDOM.findDOMNode(this.albumContainer),
      // album container HTML DOM Style
      albumContainerStyle = window.getComputedStyle(albumContainerDom);

    // width of the area
    const padding = parseFloat(
      albumContainerStyle.getPropertyValue("padding-left")
    );
    let defaults = {
      // Remove the left-padding and right-padding width
      albumWidth: this.albumContainer.clientWidth - padding * 2,
      padding: padding,
      images: $(albumContainerDom).children()
    };

    let defaultOptions = {
      // how quickly you want images to fade in once ready can be in ms, "slow" or "fast"
      fadeSpeed: "fast",
      // how the resized block should be displayed. inline-block by default so that it doesn't break the row
      display: "inline-block",
      // which effect you want to use for revealing the images (note CSS3 browsers only),
      effect: "default",
      // effect delays can either be applied per row to give the impression of descending appearance
      // or horizontally, so more like a flock of birds changing direction
      direction: "vertical",
      // Sometimes there is just one image on the last row and it gets blown up to a huge size to fit the
      // parent div width. To stop this behaviour, set this to true
      allowPartialLastRow: false
    };

    let settings = {
      ...defaults,
      ...defaultOptions,
      ...options
    };

    settings.images.each(function(index) {
      /**
       *
       * Cache selector
       * Even if first child is not an image the whole sizing is based on images
       * so where we take measurements, we take on the images
       *
       */

      let $this = $(this),
        $img = $this.is("img") ? $this : $(this).find("img");

      /**
       *
       * get the current image size. Get image size in this order
       *
       * 1. from <img> tag
       * 2. from data set from initial calculation
       * 3. after loading the image and checking it's actual size
       *
       */

      let w =
          typeof $img.data("width") != "undefined"
            ? $img.data("width")
            : $img.width(),
        h =
          typeof $img.data("height") != "undefined"
            ? $img.data("height")
            : $img.height();

      /**
       *
       * Get any current additional properties that may affect the width and height (i.e css border examples)
       *
       */
      let imgParams = getImgProperty($img);

      /**
       *
       * Store the original size for resize events
       *
       */

      $img.data("width", w);
      $img.data("height", h);

      /**
       *
       * calculate the w/h based on the target height
       * this is our ideal size, but we will recalculate it to fit the width
       *
       */

      let nw = Math.ceil((w / h) * settings.targetHeight),
        nh = Math.ceil(settings.targetHeight);

      /**
       *
       * Keep track of which images are in our row so far
       *
       */
      elements.push([this, nw, nh, imgParams["w"], imgParams["h"]]);

      /**
       *
       * calculate the width of the element including extra properties (i.e css borders)
       *
       */
      row += nw + imgParams["w"] + settings.padding;

      /**
       *
       * if the current row width is wider than the parent container
       * it's time to make a row out of our images
       *
       */
      if (row > settings.albumWidth && elements.length != 0) {
        // call the method that calclates the final image sizes
        // remove one set of padding as it's not needed for the last image in the row
        resizeRow(elements, row - settings.padding, settings, rownum);

        // reset our row
        row = 0;
        elements = [];
        rownum += 1;
      }

      /**
       *
       * if the images left are not enough to make a row
       * then we'll force them to make one anyway
       *
       */

      if (settings.images.length - 1 == index && elements.length != 0) {
        resizeRow(elements, row, settings, rownum);

        // reset our row
        row = 0;
        elements = [];
        rownum += 1;
      }
    });
  }

  renderImages(imageUrls) {
    return imageUrls.map(item => {
      item.width /= 10;
      item.height /= 10;
      return (
        <Image
          imgSrc={
            "https://picsum.photos/" +
            item.width +
            "/" +
            item.height +
            "?image=" +
            item.id
          }
          dataWidth={item.width}
          dataHeight={item.height}
          key={item.id}
        />
      );
    });
  }

  updateDimensions() {
    const { targetHeight } = this.props;
    this.gridImage({ targetHeight });
  }

  handleResize() {
    this.updateDimensions();
  }
  componentDidMount() {
    this.updateDimensions();

    // Add resize event listener to update dimension when window size changes
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  componentDidUpdate() {
    this.updateDimensions();
  }
  render() {
    const { imageUrls } = this.props;
    return (
      <div
        className="grid-image-viewer"
        ref={ref => (this.albumContainer = ref)}
      >
        {this.renderImages(imageUrls)}
      </div>
    );
  }
}

GridImageViewer.propTypes = {
  imageUrls: PropTypes.array.isRequired,
  targetHeight: PropTypes.number
};

GridImageViewer.defaultProps = {
  imageUrls: [],
  // the ideal height you want your images to be
  targetHeight: 300
};

export default GridImageViewer;
