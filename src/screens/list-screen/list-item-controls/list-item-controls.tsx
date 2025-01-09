import AsyncStorage from '@react-native-async-storage/async-storage'
import {useTheme} from '@react-navigation/native'
import {Dispatch, SetStateAction, useState} from 'react'
import {Alert, Button, StyleSheet} from 'react-native'

import {CustomTextInput} from '@/components/index'
import {ShoppingList} from '@/types/shopping-list'

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

	const styles = StyleSheet.create({
		input: {
			marginBottom: 16
		}
	})

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

export default NewItemControls
