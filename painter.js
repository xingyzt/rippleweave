onmessage = function draw (e) {
	const [width,height,mode,functions] = e.data
	const array = new Uint8ClampedArray(width*height*4)
	const formatted_functions = [
		format_function(functions[1]),
		format_function(functions[2]),
		format_function(functions[3])
	]
	for ( let x = 0 ; x < width ; x ++ ) {
		for ( let y = 0 ; y < height ; y ++ ) {
			const index = x*y*4
			const results = [
				eval(formatted_functions[0]),
				eval(formatted_functions[1]),
				eval(formatted_functions[2])
			]
			let rgb

			if ( mode === 'hsl' ) {
				rgb = hslToRgb([
					results[0]%1,
					results[1],
					results[2]
				])
			} else {
				rgb = results
			}

			array[0] = rgb[0]
			array[1+index] = rgb[1]
			array[2+index] = rgb[2]
			array[3+index] = 255

			const image_data = new ImageData(array,width)
			postMessage(image_data)
		}
	}
}
function format_function ( fn ) {
	return fn.replace(/f\((.*),(.*)\)/g,functions[0].replace(/a/g,'$1').replace(/b/g,'$2'))
		.replace(/(x|y)(x|y)/g,'$1*$2')
		.replace(/(x|y)(x|y)/g,'$1*$2')
		.replace(/(abs|acos|acosh|asin|asinh|atan|atanh|atan2|cbrt|ceil|clz32|cos|cosh|exp|expm1|floor|fround|hypot|imul|log|log1p|log10|log2|max|min|pow|random|round|sign|sin|sinh|sqrt|tan|tanh|trunc|E|LN2|LN10|LOG2E|LOG10E|PI|SQRT1_2|SQRT2)/g,'Math.$1')
		.replace(/\^/g,'**')
		.replace(/\|/,'Math.abs(')
		.replace(/\|/,')')
}
function hueToRgb (p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}
function hslToRgb ( h , s , l ) {
  let r, g, b
  if ( s === 0 ) {
      r = g = b = l; // achromatic
  } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hueToRgb( p , q , h + 1/3 )
      g = hueToRgb( p , q , h )
      b = hueToRgb( p , q , h - 1/3 )
  }
  return [r,g,b].map(x=>Math.round(x*255))
}