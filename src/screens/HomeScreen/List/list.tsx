import {Dispatch, SetStateAction} from 'react'
import {FlatList, StyleSheet} from 'react-native'

import ListItem from './list-item'

export type ListProps = {
	shoppingLists: ShoppingList[]
	setShoppingLists: Dispatch<SetStateAction<ShoppingList[]>>
}

const List = ({shoppingLists, setShoppingLists}: ListProps) => {
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
			removeClippedSubviews={false}
			keyboardShouldPersistTaps='always'
			contentContainerStyle={styles.shoppingLists}
			data={shoppingLists}
			keyExtractor={(item) => item.uuid}
			renderItem={(item) => (
				<ListItem
					key={item.item.uuid}
					shoppingLists={shoppingLists}
					setShoppingLists={setShoppingLists}
					item={item}
				/>
			)}
		/>
	)
}

export default List
