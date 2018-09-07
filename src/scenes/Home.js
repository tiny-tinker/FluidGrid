import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import GridImageViewer from "./components/GridImageViewer/GridImageViewer";
import { getImageLists } from "../modules/imageUrl/imageUrlAction";
import { connect } from "react-redux";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props.imageUrlActions.getImageLists();
  }

  componentDidMount() {}

  render() {
    const { imageUrls } = this.props.imageUrl;
    return (
      <div className="container">
        <GridImageViewer imageUrls={imageUrls} />
      </div>
    );
  }
}

Home.propTypes = {
  imageUrlActions: PropTypes.shape({
    getImageLists: PropTypes.func
  })
};

export default connect(
  state => ({ ...state }),
  dispatch => ({
    imageUrlActions: bindActionCreators(
      {
        getImageLists
      },
      dispatch
    )
  })
)(Home);
