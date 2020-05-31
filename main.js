const element = query => document.querySelector(query)
const elements = query => [...document.querySelectorAll(query)]
const painter = new Worker('painter.js')

const presets = [
	{
		'f(a,b)':	'|cos(a^2)+sin(b^2)|/2',
		'g(a,b)':	'0',
		'h':		'0',
		'k':		'0',
		'scale':	'1',
		'channel_1':	'f((x-h)/scale,(y-k)/scale)',
		'channel_2':	'1',
		'channel_3':	'f((y-k)/scale,(x-h)/scale)',
		
		'mode':		'hsl',
		'width':	32,
		'height':	32,
	},
	{
		'f(a,b)':	'|tan(x/b)*(b-sin(a))+cos(a/b)|*a',
	},
	{
		'f(a,b)':	'sin(a)^tan(a/b)',
	},
	{
		'f(a,b)':	'|tan(a/b)*(b-sin(b*a))+cos(a/b)|*a',
	},
	{
		'f(a,b)':	'atan2(sin(b/a),cos(b/a))',
	},
	{
		'f(a,b)':	'|cos(a/b)-tan(a/b)*(b-sin(b*a))|*a',
	},
	{
		'f(a,b)':	'tan(sin(a)/b)',
	},
]
const definitions = presets[0]


const canvas = {
	width: 32,
	height: 32,
	mode: 'hsl',
	element: element('canvas')
}
canvas.context = canvas.element.getContext('2d')

const handler = event => {

	if ( 
		event.type === 'change'
		|| ( canvas.width * canvas.height < 1<<12 )
	) request_paint()
}
function calculate () {
	console.log('main: requesting calculations...')
	painter.postMessage(JSON.stringify([width,height,mode,fn_strings]))
}
painter.addEventListener('mmessage', image => {
	console.log('main: received image data')
	canvas.element.width = canvas.width
	canvas.element.height = canvas.height
	canvas.context.putImageData(image.data,0,0)
	console.log('main: painted image data')
})
element('#definitions').addEventListener('input', handler)
element('#definitions').addEventListener('change', handler)
elements('[download]').forEach(link=>{
	link.addEventListener('click',()=>{
		link.href = canvas.element.toDataURL(`img/${link.id}`).replace(/^data:image\/[^;]*/, 'data:application/octet-stream')
	},false)
})
calculate()
