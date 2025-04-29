import {ReactElement} from 'react'
import {ListRenderItemInfo, StyleSheet} from 'react-native'
import {FlatList} from 'react-native-gesture-handler'
import {useSharedValue} from 'react-native-reanimated'

import ListItem from './item/list-item'

type ListProps<T> = {
	items: T[]
	renderItemContent: (item: ListRenderItemInfo<T>) => ReactElement
	listItemHeight?: number
	onItemDragEnd?: (item: ListRenderItemInfo<T>) => void
}

export type ListItemPositions = {
	[key: string]: {
		updatedIndex: number
		updatedTop: number
	}
}

export const DEFAULT_LIST_ITEM_HEIGHT = 72

const getInitialListItemPositions = (
	items: any[],
	listItemHeightWithMargin: number
) => {
	const initialListItemPositions: ListItemPositions = {}

	for (let i = 0; i < items.length; i++) {
		initialListItemPositions[i] = {
			updatedIndex: i,
			updatedTop: i * listItemHeightWithMargin
		}
	}

	return initialListItemPositions
}

function List<T>({
	items,
	renderItemContent,
	listItemHeight = DEFAULT_LIST_ITEM_HEIGHT,
	onItemDragEnd
}: ListProps<T>) {
	const listItemHeightWithMargin = listItemHeight + 24

	const currentItemPositions = useSharedValue<ListItemPositions>(
		getInitialListItemPositions(items, listItemHeightWithMargin)
	)
	const isDragging = useSharedValue<0 | 1>(0)
	const draggingItemId = useSharedValue(-1)

	const styles = StyleSheet.create({
		listContainer: {
			width: '100%',
			paddingHorizontal: 32,
			height: listItemHeightWithMargin * items.length
		}
	})

	return (
		<FlatList
			// This prop is necessary to be able to tap the save icon for the list item input,
			// since tapping outside the input ignores other click events by default.
			removeClippedSubviews={false}
			contentContainerStyle={styles.listContainer}
			data={items}
			renderItem={(item) => (
				<ListItem
					item={item}
					key={String(item.item)}
					currentItemPositions={currentItemPositions}
					isDragging={isDragging}
					draggingItemId={draggingItemId}
					onDragEnd={onItemDragEnd}
					maxTop={(items.length - 1) * listItemHeightWithMargin}
					itemHeight={listItemHeight}
					itemHeightWithMargin={listItemHeightWithMargin}
				>
					{renderItemContent(item)}
				</ListItem>
			)}
		/>
	)
}

export default List
