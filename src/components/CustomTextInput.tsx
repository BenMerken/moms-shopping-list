import {
	Dimensions,
	StyleSheet,
	Text,
	TextInput,
	TextInputProps,
	View,
	ViewStyle
} from 'react-native'

import theme from '@utils/theme'

type CustomTextInputProps = TextInputProps & {
	label: string
	inputGroupStyle?: ViewStyle
}

const styles = StyleSheet.create({
	inputGroup: {
		padding: 8,
		width: Dimensions.get('screen').width * 0.8,
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
