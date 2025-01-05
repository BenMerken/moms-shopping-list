import {FontAwesome} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useIsFocused, useTheme} from '@react-navigation/native'
import {useEffect, useState} from 'react'
import {
	Alert,
	Button,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import uuid from 'react-native-uuid'

import {CustomTextInput, SafeAreaContainer} from '@/components/index'
import {StackScreenProps} from '@/types/navigation'
import {ShoppingList} from '@/types/shopping-list'
import layout from '@/utils/layout'
import text from '@/utils/text'
import theme from '@/utils/theme'

import List from './List/list'

type NewListModalContentProps = {
	addNewShoppingList: (newList: ShoppingList) => void
	closeModal: () => void
	navigateToNewShoppingListScreen: (
		newListUuid: string,
		newListName: string
	) => void
}

const NewListModalContent = ({
	addNewShoppingList,
	closeModal,
	navigateToNewShoppingListScreen
}: NewListModalContentProps) => {
	const {colors} = useTheme()

	const [newListName, setNewListName] = useState('')

	const styles = StyleSheet.create({
		modalBackground: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		modalContent: {
			...theme.dropShadow,
			padding: 16,
			backgroundColor: colors.card,
			borderRadius: 8
		},
		modalTopRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignContent: 'center'
		},
		input: {
			marginBottom: 16
		}
	})

	const createNewShoppingList = async () => {
		try {
			const newListUuid = uuid.v4() as string
			const newList: ShoppingList = {
				uuid: newListUuid,
				name: newListName,
				items: [],
				createdAt: Date.now()
			}

			await AsyncStorage.setItem(newListUuid, JSON.stringify(newList))
			addNewShoppingList(newList)
			onCloseModal()
			navigateToNewShoppingListScreen(newListUuid, newListName)
		} catch (error) {
			Alert.alert('Het lijstje kon niet worden opgeslagen.')
		}
	}

	const onCloseModal = () => {
		closeModal()
	}

	return (
		<View style={styles.modalBackground}>
			<View style={styles.modalContent}>
				<View style={styles.modalTopRow}>
					<Text style={{...text.subtitle, color: colors.text}}>
						Nieuw Lijstje
					</Text>
					<TouchableOpacity onPress={onCloseModal}>
						<FontAwesome
							name='close'
							color={colors.text}
							size={24}
						/>
					</TouchableOpacity>
				</View>
				<CustomTextInput
					inputGroupStyle={styles.input}
					label='Naam lijstje'
					value={newListName}
					placeholder='bijv. "Aldi/Lidl/AH..."'
					onChangeText={(newName) => setNewListName(newName)}
				/>
				<Button
					title='+ Lijstje aanmaken'
					disabled={!newListName}
					color={colors.primary}
					onPress={createNewShoppingList}
				/>
			</View>
		</View>
	)
}

const HomeScreen = ({navigation}: StackScreenProps<'Home'>) => {
	const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([])
	const [loadingShoppingLists, setLoadingShoppingLists] = useState(true)
	const [openNewListModal, setOpenListModal] = useState(false)

	const {colors} = useTheme()

	const isFocused = useIsFocused()

	const styles = StyleSheet.create({
		addButton: {
			...theme.dropShadow,
			bottom: 16,
			right: 16,
			alignSelf: 'flex-end',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: 64,
			width: 64,
			backgroundColor: colors.primary,
			borderRadius: 50
		},
		noShoppingListsPlaceholder: {
			flexGrow: 1,
			justifyContent: 'center',
			alignItems: 'center',
			gap: 32
		},
		placeholderText: {
			...text.text,
			width: layout.window.widthWithMargin,
			textAlign: 'center',
			color: colors.text
		}
	})

	// Get the shopping lists in app storage, and add them to the component's state, if the Home screen becomes focused.
	useEffect(() => {
		if (isFocused) {
			const getShoppingListsFromStorage = async () => {
				const shoppingListsKeys = await AsyncStorage.getAllKeys()
				const shoppingListsFromStorage = (await AsyncStorage.multiGet(
					shoppingListsKeys
				).then((storage) =>
					storage.map((d) => d[1] && JSON.parse(d[1]))
				)) as ShoppingList[]

				setShoppingLists(
					shoppingListsFromStorage.sort((a, b) =>
						a.createdAt > b.createdAt ? -1 : 0
					)
				)
			}

			getShoppingListsFromStorage()
			setLoadingShoppingLists(false)
		}
	}, [isFocused])

	return (
		<SafeAreaContainer>
			{loadingShoppingLists ? (
				<Text>Laden...</Text>
			) : shoppingLists.length ? (
				<List
					shoppingLists={shoppingLists}
					setShoppingLists={setShoppingLists}
				/>
			) : (
				<View style={styles.noShoppingListsPlaceholder}>
					<Text style={styles.placeholderText}>
						Er zijn geen boodschappenlijstjes opgeslagen.
					</Text>
					<Text style={styles.placeholderText}>
						Je kan een nieuw lijstje maken, door op de '+' knop te
						drukken.
					</Text>
				</View>
			)}
			<TouchableOpacity
				style={styles.addButton}
				onPress={() => {
					setOpenListModal(true)
				}}
			>
				<FontAwesome name='plus' size={24} color={colors.background} />
			</TouchableOpacity>
			<Modal animationType='slide' transparent visible={openNewListModal}>
				<NewListModalContent
					closeModal={() => setOpenListModal(false)}
					addNewShoppingList={(newList) =>
						setShoppingLists([newList, ...shoppingLists])
					}
					navigateToNewShoppingListScreen={(
						newListUuid,
						newListName
					) =>
						navigation.navigate('List', {
							listUuid: newListUuid,
							listName: newListName
						})
					}
				/>
			</Modal>
		</SafeAreaContainer>
	)
}

export default HomeScreen
