const element = query => document.querySelector(query)
const elements = query => [...document.querySelectorAll(query)]
const painter = new Worker('painter.js')
const presets = [
	[
		[
			'f(a,b)',
			'|cos(a^2)+sin(b^2)|/2',
		],
		[
			'g(a,b)',
			'0',
		],
		[
			'h',
			'0',
		],
		[
			'k',
			'0',
		],
		[
			'scale',
			'1'
		],
		[
			'hue',
			'f((x-h)/scale,(y-k)/scale)',
		],
		[
			'saturation',
			'1',
		],
		[
			'luminosity',
			'f((y-k)/scale,(x-h)/scale)',
		],
	],
	[
		[
				'f(a,b)',
				'|tan(x/b)*(b-sin(a))+cos(a/b)|*a',
		],
	],
	[
			[
				'f(a,b)',
				'sin(a)^tan(a/b)',
			],
	],
			[
				'f(a,b)',
				'|tan(a/b)*(b-sin(b*a))+cos(a/b)|*a',
			]
	],
	[
		[
			'f(a,b)',
			'atan2(sin(b/a),cos(b/a))',
		],
	],
	[
		[
			'f(a,b)',
			'|cos(a/b)-tan(a/b)*(b-sin(b*a))|*a',
		],
	],
	[
		[
			'f(a,b)',
			'tan(sin(a)/b)',
		]
	],
]

const canvas = {
	width: 32,
	height: 32,
	mode: 'hsl',
	element: element('canvas')
}
canvas.context = canvas.element.getContext('2d')

function handler ( event ) {
}
}
function sync_info () {
	$('width').value = width
	$('height').value = height
	$('mode').value = mode
	document.getElementById('width').value = width
}
function request_paint () {
	console.log('main: requesting paint...')
	painter.postMessage(JSON.stringify([width,height,mode,fn_strings]))
}
painter.onmessage = function ( image ) {
	console.log('main: received image data')
	canvas_element.width = width
	canvas_element.height = height
	canvas_context.putImageData(image.data,0,0)
	console.log('main: painted image data')
}
$('input,select').forEach(input=>{
	input.addEventListener('input',handler)
	input.addEventListener('change',request_paint)
})
$('[download]').forEach(link=>{
	link.addEventListener('click',()=>{
		link.href = canvas_element.toDataURL(`img/${link.id}`).replace(/^data:image\/[^;]*/, 'data:application/octet-stream')
	},false)
})
request_paint()
