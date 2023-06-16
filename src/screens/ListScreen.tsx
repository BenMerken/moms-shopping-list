import {FontAwesome} from '@expo/vector-icons'
import AsyncStorage, {
	useAsyncStorage
} from '@react-native-async-storage/async-storage'
import {useHeaderHeight} from '@react-navigation/elements'
import {useTheme} from '@react-navigation/native'
import {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react'
import {
	Alert,
	Button,
	FlatList,
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'

import {CustomTextInput, SafeAreaContainer} from '@components/index'
import layout from '@utils/layout'
import text from '@utils/text'
import theme from '@utils/theme'

type ListItemProps = {
	item: ShoppingListItem
}

type NewItemControlsProps = {
	shoppingList: ShoppingList | undefined
	setShoppingList: Dispatch<SetStateAction<ShoppingList | undefined>>
}

const NewItemControls = ({
	shoppingList,
	setShoppingList
}: NewItemControlsProps) => {
	const [newItemName, setNewItemName] = useState('')

	const {colors} = useTheme()

	const styles = useMemo(
		() =>
			StyleSheet.create({
				input: {
					marginBottom: 16
				}
			}),
		[]
	)

	const addItem = async () => {
		if (
			shoppingList!
				.items!.map((item) => item.toLowerCase())
				.includes(newItemName.toLowerCase())
		) {
			Alert.alert(
				`Er bestaat al een artikel met naam "${newItemName}" in dit lijstje`
			)

			return
		}

		const newShoppingList = {
			...shoppingList!,
			items: [...shoppingList!.items!, newItemName]
		}

		await AsyncStorage.mergeItem(
			shoppingList!.uuid,
			JSON.stringify(newShoppingList)
		)
		setShoppingList(newShoppingList)
		setNewItemName('')
	}

	return (
		<>
			<CustomTextInput
				inputGroupStyle={styles.input}
				label='Naam artikel'
				value={newItemName}
				placeholder='bijv. "Boter/Kaas/eieren..."'
				onChangeText={(newName) => setNewItemName(newName)}
			/>
			<Button
				title='+ Artikel toevoegen'
				disabled={!newItemName}
				color={colors.primary}
				onPress={addItem}
			/>
		</>
	)
}

const ListScreen = ({route}: StackScreenProps<'List'>) => {
	const [shoppingList, setShoppingList] = useState<ShoppingList>()

	const headerHeight = useHeaderHeight()

	const {colors} = useTheme()

	const styles = useMemo(
		() =>
			StyleSheet.create({
				shoppingListItems: {
					alignItems: 'center'
				},
				noItemsPlaceholder: {
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center'
				},
				shoppingListItem: {
					...theme.dropShadow,
					flexDirection: 'row',
					flexWrap: 'wrap',
					alignItems: 'center',
					gap: 32,
					marginBottom: 8,
					padding: 16,
					width: layout.window.widthWithMargin,
					backgroundColor: colors.card
				},
				newItemForm: {
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: 32
				},
				newItemFormTitle: {
					...text.subtitle,
					width: layout.window.widthWithMargin,
					color: colors.text
				}
			}),
		[colors, text, theme, layout]
	)

	const {getItem} = useAsyncStorage(route.params.listUuid)

	const _listItem = ({item}: ListItemProps) => {
		const removeItem = async () => {
			const newShoppingList = {
				...shoppingList!,
				items: shoppingList!.items!.filter(
					(itemOnList) => itemOnList !== item
				)
			}

			await AsyncStorage.mergeItem(
				shoppingList!.uuid,
				JSON.stringify(newShoppingList)
			)
			setShoppingList(newShoppingList)
		}

		return (
			<View key={item} style={styles.shoppingListItem}>
				<TouchableOpacity onPress={removeItem}>
					<FontAwesome name='close' size={24} color={colors.text} />
				</TouchableOpacity>
				<Text style={{...text.text, color: colors.text}}>{item}</Text>
			</View>
		)
	}

	useEffect(() => {
		const getShoppingList = async () => {
			const shoppingListFromStorage = await getItem()

			setShoppingList(JSON.parse(shoppingListFromStorage!))
		}

		getShoppingList()
	}, [])

	return (
		<SafeAreaContainer>
			{!shoppingList?.items?.length ? (
				<View style={styles.noItemsPlaceholder}>
					<Text style={{...text.text, color: colors.text}}>
						Dit lijstje is (nog) leeg...
					</Text>
				</View>
			) : (
				<FlatList
					contentContainerStyle={styles.shoppingListItems}
					data={shoppingList?.items}
					renderItem={_listItem}
				/>
			)}
			<KeyboardAvoidingView
				style={styles.newItemForm}
				keyboardVerticalOffset={headerHeight + 32}
				behavior='padding'
			>
				<Text style={styles.newItemFormTitle}>Nieuw Artikel</Text>
				<NewItemControls
					shoppingList={shoppingList}
					setShoppingList={setShoppingList}
				/>
			</KeyboardAvoidingView>
		</SafeAreaContainer>
	)
}

export default ListScreen
