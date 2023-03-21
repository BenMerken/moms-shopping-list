import '@react-navigation/native'

// Override the theme in react native navigation to accept my custom theme props
declare module '@react-navigation/native' {
	declare type ExtendedTheme = {
		dark: boolean
		colors: {
			primary: string
			background: string
			card: string
			text: string
			label: string
			placeholder: string
			border: string
			notification: string
		}
	}
	declare function useTheme(): ExtendedTheme
}
