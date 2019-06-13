import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ImageLoader.css';

class ImageLoader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
    };
    this.handleImageLoad = this.handleImageLoad.bind(this);
  }

  handleImageLoad = () => {
    this.setState({
      isLoaded: true,
    });
  };

  render() {
    const { src, alt, id } = this.props;
    const { isLoaded } = this.state;
    return (
      <div className={`image-container${!isLoaded ? ' not-loaded' : ''}`}>
        <img
          className='contained-image'
          src={src}
          alt={alt}
          id={id}
          onLoad={this.handleImageLoad}
        />
      </div>
    );
  }
}

ImageLoader.defaultProps = {
  id: PropTypes.string,
};

ImageLoader.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default ImageLoader;
