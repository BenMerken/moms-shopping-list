import {FontAwesome} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useTheme} from '@react-navigation/native'
import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react'
import {
	Alert,
	ListRenderItemInfo,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'

import {Dialog} from '@/components/index'
import {ShoppingList, ShoppingListItem} from '@/types/shopping-list'
import text from '@/utils/text'

type ListProps = {
	shoppingList: ShoppingList
	setShoppingList: Dispatch<SetStateAction<ShoppingList | undefined>>
}

type ListItemProps = {
	itemInfo: ListRenderItemInfo<ShoppingListItem>
	shoppingList: ShoppingList
	setShoppingList: Dispatch<SetStateAction<ShoppingList | undefined>>
}

const ListItem = ({itemInfo, shoppingList, setShoppingList}: ListItemProps) => {
	const {item} = itemInfo
	// Use this boolean state to make the list item input field only editable, if the user tapped the edit button.
	// Directly focusing the input should not be possible, to prevent the keyboard from sliding in, by accidently tapping the input field.
	const [editing, setEditing] = useState(false)
	const [itemValue, setItemValue] = useState(item)
	const [showRemoveDialog, setShowRemoveDialog] = useState(false)

	const inputRef = useRef<TextInput>(null)

	const {colors} = useTheme()

	const styles = StyleSheet.create({
		shoppingListItem: {
			flex: 1,
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		shoppingListItemLeft: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 16
		}
	})

	// This sets the cursor behind the input text (for some reason, the selection prop on TextInput does not work).
	const cursorPosition = itemValue.length
	inputRef.current?.setNativeProps({
		selection: {start: cursorPosition, end: cursorPosition}
	})

	const removeItem = async () => {
		const newShoppingList = {
			...shoppingList,
			items: shoppingList!.items!.filter(
				(itemOnList) => itemOnList !== itemValue
			)
		}

		await AsyncStorage.mergeItem(
			shoppingList.uuid,
			JSON.stringify(newShoppingList)
		)
		setShoppingList(newShoppingList)
	}

	// Sets the editing boolean to true, to indicate the user wants to edit this list item.
	// An effect hook monitors this boolean, to set the focus on the input, in case the user wants to edit.
	const handleEditTap = () => setEditing(true)

	const handleSaveTap = async () => {
		if (item === itemValue) {
			inputRef.current?.blur()

			return
		}

		if (itemValue.trim() === '') {
			return
		}

		if (
			shoppingList.items
				.map((item) => item.toLowerCase())
				.includes(itemValue.toLowerCase())
		) {
			Alert.alert(
				`Er bestaat al een artikel met naam "${itemValue}" in dit lijstje`
			)

			return
		}

		const newShoppingList = {
			...shoppingList,
			items: shoppingList.items.map((item, index) =>
				index === itemInfo.index ? itemValue : item
			)
		}

		await AsyncStorage.mergeItem(
			shoppingList.uuid,
			JSON.stringify(newShoppingList)
		)
		setShoppingList(newShoppingList)
		// Since the parent FlatList's keyboardShouldPersistTaps prop will prevent the TextInput from blurring,
		// it must be triggered manually.
		inputRef.current?.blur()
	}

	// Set the editing boolean back to false, to make the text input directly uneditable again.
	const handleInputBlur = () => {
		setEditing(false)
		// This is a safety reset, in case the user would click away from the input, without explicitly saving the new value.
		setItemValue(item)
	}

	const handleItemTextChange = (text: string) => {
		setItemValue(text)
	}

	// Use boolean flag to check whether the user wants to edit the list item
	// If so, focus on the input, so the user can start typing.
	useEffect(() => {
		if (editing) {
			// Timeout is necessary, in order to focus the element after sufficient time has passed to render the editable input,
			// otherwise, the input won't be focused.
			const timeout = setTimeout(() => inputRef.current?.focus(), 100)

			return () => clearTimeout(timeout)
		}
	}, [editing])

	return (
		<>
			<View style={styles.shoppingListItem}>
				<View style={styles.shoppingListItemLeft}>
					<TouchableOpacity onPress={() => setShowRemoveDialog(true)}>
						<FontAwesome
							name='close'
							size={16}
							color={colors.text}
						/>
					</TouchableOpacity>
					<TextInput
						ref={inputRef}
						editable={editing}
						style={{...text.text, color: colors.text}}
						value={itemValue}
						onChangeText={handleItemTextChange}
						onBlur={handleInputBlur}
						onSubmitEditing={handleSaveTap}
					/>
				</View>
				<TouchableOpacity
					onPress={editing ? handleSaveTap : handleEditTap}
				>
					<FontAwesome
						name={editing ? 'check' : 'pencil'}
						size={16}
						color={colors.text}
					/>
				</TouchableOpacity>
			</View>
			{showRemoveDialog && (
				<Dialog
					text={`Weet je zeker dat je "${item}" wilt verwijderen?`}
					reset={() => setShowRemoveDialog(false)}
					action={() => removeItem()}
				/>
			)}
		</>
	)
}

export default ListItem
