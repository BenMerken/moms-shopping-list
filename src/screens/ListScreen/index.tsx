import AsyncStorage, {
	useAsyncStorage
} from '@react-native-async-storage/async-storage'
import {useTheme} from '@react-navigation/native'
import {Dispatch, SetStateAction, useEffect, useState} from 'react'
import {
	Alert,
	Button,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	View
} from 'react-native'
import uuid from 'react-native-uuid'

import {CustomTextInput, SafeAreaContainer} from '@/components/index'
import {StackScreenProps} from '@/types/navigation'
import {ShoppingList, ShoppingListItem} from '@/types/shopping-list'
import layout from '@/utils/layout'
import text from '@/utils/text'

import List from './List'

type NewItemControlsProps = {
	shoppingList: ShoppingList | undefined
	setShoppingList: Dispatch<SetStateAction<ShoppingList | undefined>>
}

const styles = StyleSheet.create({
	input: {
		marginBottom: 16
	},
	noItemsPlaceholder: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	newItemForm: {
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 32
	},
	newItemFormTitle: {
		...text.subtitle,
		width: layout.window.widthWithMargin
	}
})

const NewItemControls = ({
	shoppingList,
	setShoppingList
}: NewItemControlsProps) => {
	const [newItemName, setNewItemName] = useState('')

	const {colors} = useTheme()

	const addItem = async () => {
		if (
			shoppingList!
				.items!.map((item) => item.name.toLowerCase())
				.includes(newItemName.toLowerCase())
		) {
			Alert.alert(
				`Er bestaat al een artikel met naam "${newItemName}" in dit lijstje`
			)

			return
		}

		const newShoppingList = {
			...shoppingList!,
			items: [
				...shoppingList!.items!,
				{
					uuid: uuid.v4().toString(),
					order: shoppingList!.items.length,
					name: newItemName
				}
			]
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

	const {colors} = useTheme()

	const {getItem} = useAsyncStorage(route.params.listUuid)

	useEffect(() => {
		const getShoppingList = async () => {
			const shoppingListFromStorage = await getItem()

			//TODO: Remove when database structure has been reconfigured on mom's device
			const parsedList = JSON.parse(shoppingListFromStorage!)
			const listItems = parsedList.items as unknown[]

			const newShoppingList = {
				...parsedList,
				items: listItems.map((item, index) => {
					if (typeof item === 'string') {
						const itemObject: ShoppingListItem = {
							uuid: uuid.v4().toString(),
							order: index,
							name: item
						}

						return itemObject
					}

					return item
				})
			}

			await AsyncStorage.mergeItem(
				parsedList.uuid,
				JSON.stringify(newShoppingList)
			)
			setShoppingList(newShoppingList)
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
				<ListScreen.List
					shoppingList={shoppingList}
					setShoppingList={setShoppingList}
				/>
			)}
			<KeyboardAvoidingView
				style={styles.newItemForm}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<Text style={{...styles.newItemFormTitle, color: colors.text}}>
					Nieuw Artikel
				</Text>
				<NewItemControls
					shoppingList={shoppingList}
					setShoppingList={setShoppingList}
				/>
			</KeyboardAvoidingView>
		</SafeAreaContainer>
	)
}

ListScreen.List = List

export default ListScreen
