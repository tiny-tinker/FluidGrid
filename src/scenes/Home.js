import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import ImageTileContainer from "./components/ImageTileContainer/ImageTileContainer";
import { getImageLists } from "../modules/imageUrl/imageUrlAction";
import { connect } from "react-redux";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.props.imageUrlActions.getImageLists();
  }

  componentDidMount() {}

  render() {
    return <div>Home Scene is here</div>;
  }
}

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

Home.propTypes = {
  imageUrlActions: PropTypes.shape({
    getImageLists: PropTypes.func
  })
};
