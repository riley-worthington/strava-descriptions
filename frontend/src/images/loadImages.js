const nameToSrc = {
  'powered-by-dark-sky-black': './powered-by-dark-sky-black.png',
  'spotify-logo-green': './spotify-logo-green.png',
  'sun': './sun.png',
  'spotify-icon-green': './spotify-icon-green.png',
};

/*
  Returns a promise that resolves to a map of name -> source
  pairs when all images are loaded
*/
const loadImages = names => new Promise((resolve) => {
  const numImages = names.length;
  let imagesLoaded = 0;
  const imageSources = names.reduce((sources, name) => {
    const image = new Image();
    image.onload = () => {
      imagesLoaded += 1;
      if (imagesLoaded === numImages) {
        resolve(imageSources);
      }
    };
    image.src = require(`${nameToSrc[name]}`);
    // eslint-disable-next-line no-param-reassign
    sources[name] = image.src;
    return sources;
  }, {});
});

export default loadImages;
