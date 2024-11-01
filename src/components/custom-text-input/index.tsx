import {useTheme} from '@react-navigation/native'
import {
	StyleSheet,
	Text,
	TextInput,
	TextInputProps,
	View,
	ViewStyle
} from 'react-native'

import layout from '@utils/layout'
import text from '@utils/text'

type CustomTextInputProps = TextInputProps & {
	label: string
	inputGroupStyle?: ViewStyle
}

const CustomTextInput = ({
	label,
	inputGroupStyle,
	...textInputProps
}: CustomTextInputProps) => {
	const {colors} = useTheme()

	const styles = StyleSheet.create({
		inputGroup: {
			padding: 8,
			width: layout.window.widthWithMargin,
			borderWidth: 1,
			borderColor: colors.border,
			borderRadius: 8
		},
		input: {
			...text.text,
			padding: 8,
			color: colors.text
		}
	})

	return (
		<View style={{...styles.inputGroup, ...inputGroupStyle}}>
			<Text style={{...text.label, color: colors.label}}>{label}</Text>
			<TextInput
				placeholderTextColor={colors.placeholder}
				style={styles.input}
				{...textInputProps}
			/>
		</View>
	)
}

export default CustomTextInput
