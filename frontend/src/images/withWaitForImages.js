import React, { Component } from 'react';
import loadImages from './loadImages';

const withWaitForImages = (ChildComponent, imageNames) => {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        imagesLoaded: false,
        imageSources: null,
      }
    }

    componentDidMount() {
      loadImages(imageNames)
        .then(sources => {
          this.setState({
            imagesLoaded: true,
            imageSources: sources,
          });
        });
    }

    render() {
      const { imagesLoaded, imageSources } = this.state;
      return imagesLoaded && <ChildComponent {...this.props} imageSources={imageSources} />;
    }
  }
}

export default withWaitForImages;
