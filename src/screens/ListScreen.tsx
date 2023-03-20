import {FontAwesome} from '@expo/vector-icons'
import AsyncStorage, {
	useAsyncStorage
} from '@react-native-async-storage/async-storage'
import {useHeaderHeight} from '@react-navigation/elements'
import {useEffect, useState} from 'react'
import {
	Alert,
	Button,
	Dimensions,
	FlatList,
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'

import {CustomTextInput, SafeAreaContainer} from '@components/index'
import text from '@utils/text'
import theme from '@utils/theme'

type ListItemProps = {
	item: ShoppingListItem
}

const styles = StyleSheet.create({
	shoppingListItems: {
		alignItems: 'center'
	},
	noItemsPlaceholder: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	shoppingListItem: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'center',
		gap: 32,
		marginBottom: 8,
		padding: 16,
		width: Dimensions.get('screen').width * 0.8,
		backgroundColor: 'white',
		...theme.dropShadow
	},
	newItemForm: {
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 32
	},
	input: {
		marginBottom: 16
	}
})

const ListScreen = ({route}: StackScreenProps<'List'>) => {
	const [shoppingList, setShoppingList] = useState<ShoppingList>()
	const [newItemName, setNewItemName] = useState('')

	const headerHeight = useHeaderHeight()

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
					<FontAwesome name='close' size={24} />
				</TouchableOpacity>
				<Text>{item}</Text>
			</View>
		)
	}

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
					<Text>Dit lijstje is (nog) leeg...</Text>
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
				<Text style={{...text.subtitle}}>Nieuw Artikel</Text>
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
					color={theme.light.primary}
					onPress={addItem}
				/>
			</KeyboardAvoidingView>
		</SafeAreaContainer>
	)
}

export default ListScreen
