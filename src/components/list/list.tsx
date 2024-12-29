import {ReactElement} from 'react'

import ListItem from './item/list-item'
import {FlatList} from 'react-native-gesture-handler'
import {ListRenderItemInfo, StyleSheet} from 'react-native'

type ListProps = {
	items: any[]
	renderItem: (item: ListRenderItemInfo<any>) => ReactElement
}

const styles = StyleSheet.create({
	contentContainer: {
		alignItems: 'center'
	}
})

const List = ({items, renderItem}: ListProps) => {
	return (
		<FlatList
			// This prop is necessary to be able to tap the save icon for the list item input,
			// since tapping outside the input ignores other click events by default.
			removeClippedSubviews={false}
			contentContainerStyle={styles.contentContainer}
			data={items}
			renderItem={(item) => <ListItem>{renderItem(item)}</ListItem>}
		/>
	)
}

export default List
