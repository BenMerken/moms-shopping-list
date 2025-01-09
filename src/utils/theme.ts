import {ExtendedTheme} from '@react-navigation/native'

const light: ExtendedTheme = {
	dark: false,
	colors: {
		primary: '#006d5b', // Teal green
		background: '#fff',
		card: '#fff',
		text: '#000',
		label: '#008080', // Teal blue
		placeholder: 'rgba(0,0,0, 0.4)',
		border: '#ccc',
		notification: 'rgb(255, 69, 58)'
	}
}

const dark: ExtendedTheme = {
	dark: true,
	colors: {
		primary: '#008080', // Teal blue
		background: '#000',
		card: '#1d1d1d',
		text: '#fff',
		label: '#008080', // Teal blue
		placeholder: 'rgba(255,255,255, 0.4)',
		border: '#ccc',
		notification: 'rgb(255, 69, 58)'
	}
}

const theme = {
	light,
	dark,
	dropShadow: {
		shadowColor: '#000',
		elevation: 5
	}
}

export default theme
