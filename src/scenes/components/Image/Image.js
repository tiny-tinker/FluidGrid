import React from "react";
import PropTypes from "prop-types";
import "./Image.css";

class Image extends React.Component {
  render() {
    const { imgSrc, maxWidth, maxHeight } = this.props;
    let imgStyle = {};
    if (maxWidth != undefined) {
      imgStyle = { ...imgStyle, maxWidth: maxWidth };
    }
    if (maxHeight != undefined) {
      imgStyle = { ...imgStyle, maxHeight: maxHeight };
    }
    return (
      <div className="flexible-image">
        <img src={imgSrc} style={imgStyle} />
      </div>
    );
  }
}

Image.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number
};

Image.defaultProps = {
  imgSrc: "https://www.freeimages.com/photo/black-jaguar-1402097"
};

export default Image;
