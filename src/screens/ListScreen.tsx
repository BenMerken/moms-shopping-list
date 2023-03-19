import {useAsyncStorage} from '@react-native-async-storage/async-storage'
import {useEffect, useState} from 'react'
import {FlatList, Text, View} from 'react-native'

import {SafeAreaContainer} from '@components/index'

type ListItemProps = {
	item: GroceryListItem
}

const ListScreen = ({route}: StackScreenProps<'List'>) => {
	const [groceryList, setGroceryList] = useState<GroceryList | undefined>(
		undefined
	)

	const {getItem} = useAsyncStorage(route.params.listUuid)

	const _listItem = ({item}: ListItemProps) => {
		return (
			<View>
				<Text>{item}</Text>
			</View>
		)
	}

	useEffect(() => {
		const getGroceryList = async () => {
			const groceryListFromStorage = await getItem()

			setGroceryList(JSON.parse(groceryListFromStorage!))
		}

		getGroceryList()
	}, [])

	return (
		<SafeAreaContainer>
			<Text>{groceryList?.name}</Text>
			<FlatList data={groceryList?.items} renderItem={_listItem} />
		</SafeAreaContainer>
	)
}

export default ListScreen
