const tintColorLight = '#f00'
const tintColorDark = '#0f0'

const theme = {
	light: {
		text: '#000',
		background: '#fff',
		tint: tintColorLight,
		tabIconDefault: '#f00',
		tabIconSelected: tintColorLight,
		buttonPrimary: '#006d5b' // Teal green
	},
	dark: {
		text: '#fff',
		background: '#000',
		tint: tintColorDark,
		tabIconDefault: '#f00',
		tabIconSelected: tintColorDark,
		buttonPrimary: '#008080' // Teal blue
	},
	dropShadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5
	}
}

export default theme
