const GeneralFunctions = {
  // https://codepen.io/davidhalford/pen/ywEva?editors=0010
  contrastColor: (hex) => {
    if (hex === undefined) {
      return
    }
    hex = hex.replace("#", "");
    /*
			From this W3C document: http://www.webmasterworld.com/r.cgi?f=88&d=9769&url=http://www.w3.org/TR/AERT#color-contrast
			
			Color brightness is determined by the following formula: 
			((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
      
      I know this could be more compact, but I think this is easier to read/explain.
		*/

    const threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */

    const hRed = parseInt(hex.substring(0, 2), 16);
    const hGreen = parseInt(hex.substring(2, 4), 16);
    const hBlue = parseInt(hex.substring(4, 6), 16);

    const cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
    if (cBrightness > threshold) {
      return "#333333";
    } else {
      return "#eeeeee";
    }
  },
  // https://stackoverflow.com/a/60880664
  adjustColor: (hex, percent, alpha) => {
    // strip the leading # if it's there
    hex = hex.toString().replace("#", "");
    alpha = alpha !== undefined ? parseInt(alpha, 16) : 'FF';

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (hex.length === 3) {
        hex = hex.replace(/(.)/g, "$1$1");
    }

    if(hex.length > 6) {
      alpha = parseInt(hex.substr(6, 2), 16);
    }

    let r = parseInt(hex.substr(0, 2), 16);
    let g = parseInt(hex.substr(2, 2), 16);
    let b = parseInt(hex.substr(4, 2), 16);

    const calculatedPercent = (100 + percent) / 100;

    r = Math.round(Math.min(255, Math.max(0, r * calculatedPercent)));
    g = Math.round(Math.min(255, Math.max(0, g * calculatedPercent)));
    b = Math.round(Math.min(255, Math.max(0, b * calculatedPercent)));

    return (`#${r.toString(16).toUpperCase()}${g.toString(16).toUpperCase()}${b.toString(16).toUpperCase()}${alpha}`).padStart(6, '0');
  }
};


export default GeneralFunctions