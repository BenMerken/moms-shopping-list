import {FontAwesome} from '@expo/vector-icons'
import {useState} from 'react'
import {
	Button,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'

import {CustomTextInput, SafeAreaContainer} from '@components/index'
import text from '@utils/text'
import theme from '@utils/theme'

const styles = StyleSheet.create({
	screenTitle: {
		...text.screenTitle,
		alignSelf: 'center'
	},
	addButton: {
		position: 'absolute',
		bottom: 16,
		right: 16,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 64,
		width: 64,
		backgroundColor: theme.light.buttonPrimary,
		borderRadius: 50,
		...theme.dropShadow
	},
	modalBackground: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.2)'
	},
	modalContent: {
		padding: 16,
		backgroundColor: '#fff',
		borderRadius: 8,
		...theme.dropShadow
	},
	input: {
		marginBottom: 16
	}
})

const HomeScreen = () => {
	const [openNewListModal, setOpenListModal] = useState(false)

	const [newListName, setNewListName] = useState('')

	return (
		<SafeAreaContainer>
			<Text style={styles.screenTitle}>Mijn Boodschappenlijstjes</Text>
			<TouchableOpacity
				style={styles.addButton}
				onPress={() => {
					setOpenListModal(true)
				}}
			>
				<FontAwesome
					name='plus'
					size={24}
					color={theme.light.background}
				/>
			</TouchableOpacity>
			<Modal animationType='slide' transparent visible={openNewListModal}>
				<View style={styles.modalBackground}>
					<View style={styles.modalContent}>
						<Text style={{...text.subtitle}}>Nieuw Lijstje</Text>
						<CustomTextInput
							inputGroupStyle={styles.input}
							label='Naam lijstje'
							value={newListName}
							placeholder='bijv. "Aldi/Lidl/AH..."'
							onChangeText={(newName) => setNewListName(newName)}
						/>
						<Button
							title='Lijstje aanmaken'
							disabled={!newListName}
							color={theme.light.buttonPrimary}
						/>
					</View>
				</View>
			</Modal>
		</SafeAreaContainer>
	)
}

export default HomeScreen
