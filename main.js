const element = query => document.querySelector(query)
const elements = query => [...document.querySelectorAll(query)]
const worker = new Worker('worker.js')
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
	definitions[event.target.previousSibling.innerText] = event.target.innerText
	console.log('main: updated definitions!')
	if ( 
		event.type === 'change'
		|| ( canvas.width * canvas.height < 1<<12 )
	) calculate()
}

const calculate = () => {
	worker.postMessage(JSON.stringify(definitions))	
	console.log('main: requesting calculations...')
	canvas.element.width = definitions['width']
	canvas.element.height = definitions['height']
}
worker.addEventListener('message', message => {
	console.log('main: calculations received!')	
})

element('#definitions').addEventListener('input', handler)
element('#definitions').addEventListener('change', handler)

elements('[download]').forEach(link => {
	link.addEventListener('click', () => {
		link.href = canvas.element.toDataURL(`img/${link.id}`).replace(/^data:image\/[^;]*/, 'data:application/octet-stream')
	},false)
})
calculate()
