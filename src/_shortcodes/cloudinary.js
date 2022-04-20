const CLOUDNAME = "kerlaches"
const BASE_URL = `https://res.cloudinary.com/${CLOUDNAME}/image/fetch/`;
const HOSTNAME = "https://playful-crisp-33f7e0.netlify.app/";
const FALLBACK_WIDTHS = [ 320, 740, 960, 1200 ];
const FALLBACK_WIDTH = 640;
const TRANSFORMS = `q_auto,dpr_auto/f_auto`

// Generate srcset attribute using the fallback widths or a supplied array of widths
function getSrcset(file, widths) {
  const widthSet = widths ? widths : FALLBACK_WIDTHS
  return widthSet.map(width => {
    return `${getSrc(file, width)} ${width}w`;
  }).join(", ")
}

// Generate the src attribute using the fallback width or a width supplied
// by the shortcode params
function getSrc(file, width, height) {
    let sizing = `w_${width ? width : FALLBACK_WIDTH},h_auto`;
    if ( $width && height ) {
        sizing += `,ar_${width}:${height}`
    }
  return `${BASE_URL}${ sizing },${TRANSFORMS}/${HOSTNAME}${file}`
}

module.exports = {
  srcset: (file, widths) => getSrcset(file, widths),
  src: (file, width) => getSrc(file, width),
}