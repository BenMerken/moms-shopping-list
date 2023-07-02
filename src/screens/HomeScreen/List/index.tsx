import {FontAwesome} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useNavigation, useTheme} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react'
import {
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'

import layout from '@utils/layout'
import text from '@utils/text'
import theme from '@utils/theme'

type ShoppingListsListProps = {
	shoppingLists: ShoppingList[]
	setShoppingLists: Dispatch<SetStateAction<ShoppingList[]>>
}

type ShoppingListItemProps = ShoppingListsListProps & {
	item: ListRenderItemInfo<ShoppingList>
}

const ListItem = ({
	item,
	shoppingLists,
	setShoppingLists
}: ShoppingListItemProps) => {
	const {
		item: {createdAt, name, uuid}
	} = item

	const {navigate} =
		useNavigation<NativeStackNavigationProp<StackParamList>>()
	const {colors} = useTheme()

	const [listName, setListName] = useState(name)
	const [editing, setEditing] = useState(false)

	const inputRef = useRef<TextInput>(null)

	const styles = StyleSheet.create({
		shoppingListItem: {
			...theme.dropShadow,
			flexDirection: 'row',
			padding: 16,
			width: layout.window.widthWithMargin,
			backgroundColor: colors.card
		},
		listItemLeft: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: 32
		},
		shoppingListName: {
			...text.text,
			fontWeight: '700',
			color: colors.text
		}
	})

	const createdAtDate = new Date(createdAt || 0)

	// This sets the cursor behind the input text (for some reason, the selection prop on TextInput does not work).
	const cursorPosition = listName.length
	inputRef.current?.setNativeProps({
		selection: {start: cursorPosition, end: cursorPosition}
	})

	const removeListItem = async (uuid: string) => {
		await AsyncStorage.removeItem(uuid, () => {
			setShoppingLists([
				...shoppingLists.filter((list) => list.uuid !== uuid)
			])
		})
	}

	// Sets the editing boolean to true, to indicate the user wants to edit this list item.
	// An effect hook monitors this boolean, to set the focus on the input, in case the user wants to edit.
	const handleEditTap = () => setEditing(true)

	const handleSaveTap = async () => {
		if (listName.trim() === '') {
			return
		}

		const newShoppingList = {
			...item.item,
			name: listName
		}

		await AsyncStorage.mergeItem(
			uuid,
			JSON.stringify(newShoppingList),
			// Set the new value for the shopping lists top state object, otherwise the navigation would still use the old name value.
			() => {
				setShoppingLists(
					shoppingLists.map((list) =>
						list.uuid === uuid ? {...list, name: listName} : list
					)
				)
			}
		)
		// Since the parent FlatList's keyboardShouldPersistTaps prop will prevent the TextInput from blurring,
		// it must be triggered manually.
		inputRef.current?.blur()
	}

	// Set the editing boolean back to false, to make the text input directly uneditable again.
	const handleInputBlur = () => {
		setEditing(false)
	}

	const handleItemTextChange = (text: string) => {
		setListName(text)
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
		<TouchableOpacity
			style={styles.shoppingListItem}
			onPress={(e) => {
				e.preventDefault()
				e.stopPropagation()
				navigate('List', {
					listUuid: uuid,
					listName: name
				})
			}}
		>
			<View style={styles.listItemLeft}>
				<TouchableOpacity onPress={() => removeListItem(uuid)}>
					<FontAwesome name='close' color={colors.text} size={24} />
				</TouchableOpacity>
				<View>
					<TextInput
						ref={inputRef}
						editable={editing}
						style={styles.shoppingListName}
						value={listName}
						onChangeText={handleItemTextChange}
						onBlur={handleInputBlur}
						onSubmitEditing={handleSaveTap}
					/>
					<Text style={{...text.text, color: colors.text}}>
						aangemaakt op{' '}
						{`${createdAtDate.toLocaleDateString(
							'nl-BE'
						)}, om ${createdAtDate.toLocaleTimeString('nl-BE')}`}
					</Text>
				</View>
			</View>
			<TouchableOpacity onPress={editing ? handleSaveTap : handleEditTap}>
				<FontAwesome
					name={editing ? 'check' : 'pencil'}
					size={24}
					color={colors.text}
				/>
			</TouchableOpacity>
		</TouchableOpacity>
	)
}

const ShoppingListsList = ({
	shoppingLists,
	setShoppingLists
}: ShoppingListsListProps) => {
	const styles = StyleSheet.create({
		shoppingLists: {
			flexGrow: 1,
			alignItems: 'center',
			gap: 8
		}
	})

	return (
		<FlatList
			// This prop is necessary to be able to tap the save icon for the list item input,
			// since tapping outside the input ignores other click events by default.
			keyboardShouldPersistTaps='always'
			contentContainerStyle={styles.shoppingLists}
			data={shoppingLists}
			renderItem={(item) => (
				<ListItem
					shoppingLists={shoppingLists}
					setShoppingLists={setShoppingLists}
					item={item}
				/>
			)}
		/>
	)
}

export default ShoppingListsList
