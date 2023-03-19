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

type GroceryListItemProps = {
	item: GroceryList
}

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
		backgroundColor: theme.light.primary,
		borderRadius: 50,
		...theme.dropShadow
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
	groceryLists: {
		flexGrow: 1,
		alignItems: 'center',
		gap: 8
	},
	groceryListItem: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 4,
		padding: 16,
		width: Dimensions.get('screen').width * 0.8,
		backgroundColor: 'white',
		...theme.dropShadow
	}
})

const HomeScreen = ({navigation}: StackScreenProps<'Home'>) => {
	const [groceryLists, setGroceryLists] = useState<GroceryList[]>([])
	const [loadingGroceryLists, setLoadingGroceryLists] = useState(true)

	const [newListName, setNewListName] = useState('')

	const [openNewListModal, setOpenListModal] = useState(false)

	const _groceryListItem = ({item}: GroceryListItemProps) => {
		const createdAt = new Date(item.createdAt || 0)

		return (
			<TouchableOpacity
				style={styles.groceryListItem}
				onPress={() =>
					navigation.navigate('List', {
						listUuid: item.uuid,
						listName: item.name
					})
				}
			>
				<Text>{item.name},</Text>
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
			const newList: GroceryList = {
				uuid: newListUuid,
				name: newListName,
				items: [],
				createdAt: Date.now()
			}

			await AsyncStorage.setItem(newListUuid, JSON.stringify(newList))
			setGroceryLists([newList, ...groceryLists])
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
		const getGroceryListsFromStorage = async () => {
			const groceryListsKeys = await AsyncStorage.getAllKeys()
			const groceryListsFromStorage = (await AsyncStorage.multiGet(
				groceryListsKeys
			).then((storage) =>
				storage.map((d) => d[1] && JSON.parse(d[1]))
			)) as GroceryList[]

			setGroceryLists(
				groceryListsFromStorage.sort((a, b) =>
					a.createdAt > b.createdAt ? -1 : 0
				)
			)
		}

		getGroceryListsFromStorage()
		setLoadingGroceryLists(false)
	}, [])

	return (
		<SafeAreaContainer>
			{loadingGroceryLists ? (
				<Text>Laden...</Text>
			) : groceryLists.length ? (
				<FlatList
					contentContainerStyle={styles.groceryLists}
					data={groceryLists}
					renderItem={_groceryListItem}
				/>
			) : (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Text>Er zijn geen boodschappenlijstjes opgeslagen.</Text>
					<Text>
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
