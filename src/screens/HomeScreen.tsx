import {FontAwesome} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useTheme} from '@react-navigation/native'
import {useEffect, useMemo, useState} from 'react'
import {
	Alert,
	Button,
	FlatList,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import uuid from 'react-native-uuid'

import {CustomTextInput, SafeAreaContainer} from '@components/index'
import layout from '@utils/layout'
import text from '@utils/text'
import theme from '@utils/theme'

type ShoppingListItemProps = {
	item: ShoppingList
}

const HomeScreen = ({navigation}: StackScreenProps<'Home'>) => {
	const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([])
	const [loadingShoppingLists, setLoadingShoppingLists] = useState(true)
	const [newListName, setNewListName] = useState('')
	const [openNewListModal, setOpenListModal] = useState(false)

	const {colors} = useTheme()

	const styles = useMemo(
		() =>
			StyleSheet.create({
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
					...theme.dropShadow,
					padding: 16,
					backgroundColor: colors.card,
					borderRadius: 8
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
					...theme.dropShadow,
					flexDirection: 'row',
					flexWrap: 'wrap',
					gap: 4,
					paddingTop: 40,
					padding: 16,
					width: layout.window.widthWithMargin,
					backgroundColor: colors.card
				},
				listItemCloseIcon: {
					position: 'absolute',
					top: 16,
					right: 16
				},
				shoppingListName: {
					...text.text,
					fontWeight: '700',
					color: colors.text
				}
			}),
		[colors, theme.dropShadow, layout.window.widthWithMargin, text]
	)

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
					<FontAwesome name='close' color={colors.text} size={24} />
				</TouchableOpacity>
				<Text style={styles.shoppingListName}>{item.name},</Text>
				<Text style={{...text.text, color: colors.text}}>
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

	// Get the shopping lists in app storage, and add them to the component's state.
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
				<FontAwesome name='plus' size={24} color={colors.background} />
			</TouchableOpacity>
			<Modal animationType='slide' transparent visible={openNewListModal}>
				<View style={styles.modalBackground}>
					<View style={styles.modalContent}>
						<View style={styles.modalTopRow}>
							<Text
								style={{...text.subtitle, color: colors.text}}
							>
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
			</Modal>
		</SafeAreaContainer>
	)
}

export default HomeScreen
