import {ReactElement} from 'react'

import ListItem, {LIST_ITEM_HEIGHT} from './item/list-item'
import {FlatList} from 'react-native-gesture-handler'
import {ListRenderItemInfo, StyleSheet} from 'react-native'
import {useSharedValue} from 'react-native-reanimated'

type ListProps = {
	items: any[]
	renderItemContent: (item: ListRenderItemInfo<any>) => ReactElement
}

export type ListItemPositions = {
	[key: string]: {
		updatedIndex: number
		updatedTop: number
	}
}

export const getInitialListItemPositions = (itemsLength: number) => {
	const initialListItemPositions: ListItemPositions = {}

	for (let i = 0; i < itemsLength; i++) {
		initialListItemPositions[i] = {
			updatedIndex: i,
			updatedTop: i * LIST_ITEM_HEIGHT
		}
	}

	return initialListItemPositions
}

const styles = StyleSheet.create({
	contentContainer: {
		alignItems: 'center'
	}
})

const List = ({items, renderItemContent}: ListProps) => {
	const currentItemPositions = useSharedValue<ListItemPositions>(
		getInitialListItemPositions(items.length)
	)
	const isDragging = useSharedValue<0 | 1>(0)
	const draggingItemId = useSharedValue(-1)

	return (
		<FlatList
			// This prop is necessary to be able to tap the save icon for the list item input,
			// since tapping outside the input ignores other click events by default.
			removeClippedSubviews={false}
			contentContainerStyle={styles.contentContainer}
			data={items}
			renderItem={(item) => (
				<ListItem
					item={item}
					key={item.item.toString()}
					currentItemPositions={currentItemPositions}
					isdragging={isDragging}
					draggingItemId={draggingItemId}
				>
					{renderItemContent(item)}
				</ListItem>
			)}
		/>
	)
}

export default List
