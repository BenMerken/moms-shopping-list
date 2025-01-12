import {Button, Modal, StyleSheet, Text, View} from 'react-native'

import theme from '@/utils/theme'

type UseDialogProps = {
	text: string
	reset: () => void
	action: () => void
}

const style = StyleSheet.create({
	modalBackground: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
	modalContent: {
		...theme.dropShadow,
		padding: 16,
		backgroundColor: '#fff',
		borderRadius: 8
	},
	text: {
		marginBottom: 16
	},
	buttons: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
})

const Dialog = ({text, reset, action}: UseDialogProps) => {
	return (
		<Modal animationType='slide' transparent>
			<View style={style.modalBackground}>
				<View style={style.modalContent}>
					<Text style={style.text}>{text}</Text>
					<View style={style.buttons}>
						<Button title='Annuleren' onPress={reset} />
						<Button
							color={'red'}
							title='Verwijderen'
							onPress={action}
						/>
					</View>
				</View>
			</View>
		</Modal>
	)
}

export default Dialog
