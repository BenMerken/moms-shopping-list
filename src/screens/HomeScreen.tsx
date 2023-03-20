import {FontAwesome} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useEffect, useState} from 'react'
import {
	Alert,
	Button,
	Dimensions,
	FlatList,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import uuid from 'react-native-uuid'

import {CustomTextInput, SafeAreaContainer} from '@components/index'
import text from '@utils/text'
import theme from '@utils/theme'

type ShoppingListItemProps = {
	item: ShoppingList
}

const styles = StyleSheet.create({
	screenTitle: {
		...text.screenTitle,
		alignSelf: 'center'
	},
	addButton: {
		bottom: 16,
		right: 16,
		alignSelf: 'flex-end',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 64,
		width: 64,
		backgroundColor: theme.light.primary,
		borderRadius: 50,
		...theme.dropShadow
	},
	noShoppingListsPlaceholder: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		gap: 32
	},
	placeholderText: {
		width: Dimensions.get('screen').width * 0.8,
		textAlign: 'center'
	},
	modalBackground: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalTopRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignContent: 'center'
	},
	modalContent: {
		padding: 16,
		backgroundColor: '#fff',
		borderRadius: 8,
		...theme.dropShadow
	},
	input: {
		marginBottom: 16
	},
	shoppingLists: {
		flexGrow: 1,
		alignItems: 'center',
		gap: 8
	},
	shoppingListItem: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 4,
		paddingTop: 40,
		padding: 16,
		width: Dimensions.get('screen').width * 0.8,
		backgroundColor: 'white',
		...theme.dropShadow
	},
	listItemCloseIcon: {
		position: 'absolute',
		top: 16,
		right: 16
	},
	shoppingListName: {fontWeight: '700'}
})

const HomeScreen = ({navigation}: StackScreenProps<'Home'>) => {
	const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([])
	const [loadingShoppingLists, setLoadingShoppingLists] = useState(true)

	const [newListName, setNewListName] = useState('')

	const [openNewListModal, setOpenListModal] = useState(false)

	const removeListItem = async (uuid: string) => {
		await AsyncStorage.removeItem(uuid, () => {
			setShoppingLists([
				...shoppingLists.filter((list) => list.uuid !== uuid)
			])
		})
	}

	const _shoppingListItem = ({item}: ShoppingListItemProps) => {
		const createdAt = new Date(item.createdAt || 0)

		return (
			<TouchableOpacity
				style={styles.shoppingListItem}
				onPress={(e) => {
					e.preventDefault()
					e.stopPropagation()
					navigation.navigate('List', {
						listUuid: item.uuid,
						listName: item.name
					})
				}}
			>
				<TouchableOpacity
					style={styles.listItemCloseIcon}
					onPress={() => removeListItem(item.uuid)}
				>
					<FontAwesome name='close' color='#000' size={16} />
				</TouchableOpacity>
				<Text style={styles.shoppingListName}>{item.name},</Text>
				<Text>
					aangemaakt op{' '}
					{`${createdAt.toLocaleDateString(
						'nl-BE'
					)}, om ${createdAt.toLocaleTimeString('nl-BE')}`}
				</Text>
			</TouchableOpacity>
		)
	}

	const onCloseModal = () => {
		setOpenListModal(false)
		setNewListName('')
	}

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
			setShoppingLists([newList, ...shoppingLists])
			onCloseModal()
			navigation.navigate('List', {
				listUuid: newListUuid,
				listName: newListName
			})
		} catch (error) {
			Alert.alert('Het lijstje kon niet worden opgeslagen.')
		}
	}

	useEffect(() => {
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
	}, [])

	return (
		<SafeAreaContainer>
			{loadingShoppingLists ? (
				<Text>Laden...</Text>
			) : shoppingLists.length ? (
				<FlatList
					contentContainerStyle={styles.shoppingLists}
					data={shoppingLists}
					renderItem={_shoppingListItem}
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
				<FontAwesome
					name='plus'
					size={24}
					color={theme.light.background}
				/>
			</TouchableOpacity>
			<Modal animationType='slide' transparent visible={openNewListModal}>
				<View style={styles.modalBackground}>
					<View style={styles.modalContent}>
						<View style={styles.modalTopRow}>
							<Text style={{...text.subtitle}}>
								Nieuw Lijstje
							</Text>
							<TouchableOpacity onPress={onCloseModal}>
								<FontAwesome
									name='close'
									color='#000'
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
							title='Lijstje aanmaken'
							disabled={!newListName}
							color={theme.light.primary}
							onPress={createNewShoppingList}
						/>
					</View>
				</View>
			</Modal>
		</SafeAreaContainer>
	)
}

export default HomeScreen
