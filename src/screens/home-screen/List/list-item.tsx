import {FontAwesome} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useNavigation, useTheme} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useEffect, useRef, useState} from 'react'
import {
	ListRenderItemInfo,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'

import {StackParamList} from '@/types/navigation'
import {ShoppingList} from '@/types/shopping-list'
import layout from '@/utils/layout'
import text from '@/utils/text'
import theme from '@/utils/theme'

import {ListProps} from './list'

type ShoppingListItemProps = ListProps & {
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
			justifyContent: 'space-between',
			alignItems: 'center',
			gap: 16,
			padding: 16,
			width: layout.window.widthWithMargin,
			backgroundColor: colors.card
		},
		listItemTextContainer: {
			flexShrink: 1
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
		// This is a safety reset, in case the user would click away from the input, without explicitly saving the new value.
		setListName(name)
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
			<TouchableOpacity onPress={() => removeListItem(uuid)}>
				<FontAwesome name='close' color={colors.text} size={24} />
			</TouchableOpacity>
			<View style={styles.listItemTextContainer}>
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
					{`aangemaakt op ${createdAtDate.toLocaleDateString(
						'nl-BE'
					)}, om ${createdAtDate.toLocaleTimeString('nl-BE')}`}
				</Text>
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

export default ListItem
