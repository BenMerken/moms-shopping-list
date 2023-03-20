import {
	StyleSheet,
	Text,
	TextInput,
	TextInputProps,
	View,
	ViewStyle
} from 'react-native'

import layout from '@utils/layout'
import theme from '@utils/theme'

type CustomTextInputProps = TextInputProps & {
	label: string
	inputGroupStyle?: ViewStyle
}

const styles = StyleSheet.create({
	inputGroup: {
		padding: 8,
		width: layout.window.widthWithMargin,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 8
	},
	label: {
		color: theme.dark.primary,
		textTransform: 'uppercase'
	},
	input: {
		padding: 8
	}
})

const CustomTextInput = ({
	label,
	inputGroupStyle,
	...textInputProps
}: CustomTextInputProps) => {
	return (
		<View style={{...styles.inputGroup, ...inputGroupStyle}}>
			<Text style={styles.label}>{label}</Text>
			<TextInput style={styles.input} {...textInputProps} />
		</View>
	)
}

export default CustomTextInput
