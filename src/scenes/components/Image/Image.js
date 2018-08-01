import React from "react";
import PropTypes from "prop-types";
import "./Image.css";

class Image extends React.Component {
  render() {
    const { imgSrc, maxWidth, maxHeight, dataWidth, dataHeight } = this.props;
    let imgStyle = {};
    if (maxWidth != undefined) {
      imgStyle = { ...imgStyle, maxWidth: maxWidth };
    }
    if (maxHeight != undefined) {
      imgStyle = { ...imgStyle, maxHeight: maxHeight };
    }
    return (
      <img src={imgSrc} style={imgStyle} data-width={dataWidth} data-height={dataHeight}/>
    );
  }
}

Image.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  dataWidth: PropTypes.number,
  dataHeight: PropTypes.number
};

Image.defaultProps = {
  imgSrc: "https://www.freeimages.com/photo/black-jaguar-1402097"
};

export default Image;
