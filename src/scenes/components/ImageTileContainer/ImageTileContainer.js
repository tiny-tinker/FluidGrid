import React from "react";
import PropTypes from "prop-types";
import Image from "../Image/Image";

class ImageTileContainer extends React.Component {
  render() {
    return <div className="image-title-container">{this.props.children}</div>;
  }
}

ImageTileContainer.propTypes = {
  imgUrls: PropTypes.array.isRequired
};
