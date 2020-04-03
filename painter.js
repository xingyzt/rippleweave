onmessage = function (message) {
	console.log('worker: received paint request')
	const [width,height,mode,fn_strings] = JSON.parse(message.data)

	fn_strings.defined.forEach()




	const image_data = fnToImageData(fn_evaluables,width,height)
	console.log('worker: sending image data...')
	postMessage(image_data)
}
const operators = {
	'^':'pow',
	'**':'pow',
	'*':'product',
	'/':'div',
	'+':'sum',
	'-':'dif'
}
function format_fn (fn) {
	return fn.replace(/\|(.*)\|/g,'abs($1)')
	.replace(/(.*)\+(.*)/g,'sum($1,$2)')
	.replace(/(.*)\-(.*)/g,'dif($1,$2)')
	.
}
function fnToImageData (fn_evaluables,width,height) {
	const channels = [[],[],[]]
	for ( let y = 0 ; y < width ; y ++ ) {
		for ( let x = 0 ; x < height ; x ++ ) {
			const index = y*height+x
			let results = fn_evaluables.map(fn=>eval(fn))
			if ( mode === 'hsl' ) {
				results = hslToRgb(...results)
			}
			channels.forEach((channel,index)=>{
				channel.push(results[index])
			})
		}
	}
	channels.forEach(channel=>{
		const min = Math.min(...channel)
		const max = Math.max(...channel) - min
		channel.forEach(value=>{
			value = 255*(value-min)/max
		})
	})
	const image = new Uint8ClampedArray(width*height*4)
	for( let index = 0 ; index < width*height ; index++ ) {
		image[0+index] = channels[0][index]
		image[1+index] = channels[1][index]
		image[2+index] = channels[2][index]
		image[3+index] = 255
	}
	return new ImageData(image,width)
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
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hueToRgb( p , q , h + 1/3 )
    g = hueToRgb( p , q , h )
    b = hueToRgb( p , q , h - 1/3 )
  }
  return [r,g,b].map(x=>{})
}
