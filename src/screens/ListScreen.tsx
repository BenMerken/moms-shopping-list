import {FlatList, Text, View} from 'react-native'

import {SafeAreaContainer} from '@components/index'

type ListItemProps = {
	item: GroceryListItem
}

const _listItem = ({item}: ListItemProps) => {
	return (
		<View>
			<Text>{item.name}</Text>
		</View>
	)
}

const ListScreen = ({listId}: StackScreenProps<'List'>) => {
	const groceries: GroceryList = [
		{name: 'Butter'},
		{name: 'Cheese'},
		{name: 'Eggs'}
	]

	return (
		<SafeAreaContainer>
			<FlatList data={groceries} renderItem={_listItem} />
		</SafeAreaContainer>
	)
}

export default ListScreen
