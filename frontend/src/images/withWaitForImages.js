import React, { useState, useEffect } from 'react';
import loadImages from './loadImages';

/*  Waits to render the child component until all images have been
    loaded, then passes the array of sources as a prop. */
// const withWaitForImages = (ChildComponent, imageNames) => {
//   return class extends Component {
//     constructor(props) {
//       super(props);
//       this.state = {
//         imagesLoaded: false,
//         imageSources: null,
//       }
//     }
//
//     componentDidMount() {
//       loadImages(imageNames)
//         .then(sources => {
//           this.setState({
//             imagesLoaded: true,
//             imageSources: sources,
//           });
//         });
//     }
//
//     render() {
//       console.log('here');
//       const { imagesLoaded, imageSources } = this.state;
//       return imagesLoaded && <ChildComponent {...this.props} imageSources={imageSources} />;
//     }
//   }
// }


// Using Hooks
const withWaitForImages = (Component, imageNames) => props => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageSources, setImageSources] = useState(null);

  useEffect(() => {
    loadImages(imageNames)
      .then(sources => {
        setImageSources(sources);
        setImagesLoaded(true);
      });
  }, []);

  return imagesLoaded && <Component {...props} imageSources={imageSources} />;
}

export default withWaitForImages;
