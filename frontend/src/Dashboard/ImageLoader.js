import React, { Component } from 'react';
import './ImageLoader.css';

class ImageLoader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false
    }
    this.handleImageLoad = this.handleImageLoad.bind(this);
  }

  handleImageLoad = () => {
    console.log('loaded');
    this.setState({
      isLoaded: true
    })
  }

  render() {
    const { src, alt, id } = this.props;
    const { isLoaded } = this.state;
    return (
      <div className={`image-container${!isLoaded ? ' not-loaded' : ''}`}>
        <img className='contained-image' src={src} alt={alt} id={id} onLoad={this.handleImageLoad}/>
      </div>
    );
  }
}

export default ImageLoader;
