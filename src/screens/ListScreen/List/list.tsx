import {Dispatch, SetStateAction} from 'react'
import {FlatList, StyleSheet} from 'react-native'

import ListItem from './list-item'

type ListProps = {
	shoppingList: ShoppingList
	setShoppingList: Dispatch<SetStateAction<ShoppingList | undefined>>
}

const List = ({shoppingList, setShoppingList}: ListProps) => {
	const styles = StyleSheet.create({
		shoppingListItems: {
			alignItems: 'center'
		}
	})

	return (
		<FlatList
			// This prop is necessary to be able to tap the save icon for the list item input,
			// since tapping outside the input ignores other click events by default.
			removeClippedSubviews={false}
			keyboardShouldPersistTaps='always'
			contentContainerStyle={styles.shoppingListItems}
			data={shoppingList?.items}
			keyExtractor={(item) => item}
			renderItem={(item) => (
				<ListItem
					shoppingList={shoppingList}
					setShoppingList={setShoppingList}
					itemInfo={item}
				/>
			)}
		/>
	)
}

export default List
