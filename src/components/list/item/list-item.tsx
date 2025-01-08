import {useTheme} from '@react-navigation/native'
import {PropsWithChildren} from 'react'
import {ListRenderItemInfo, StyleSheet} from 'react-native'
import Animated, {
	interpolate,
	interpolateColor,
	SharedValue,
	useAnimatedReaction,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withDelay,
	withSpring
} from 'react-native-reanimated'

import theme from '@/utils/theme'

import {ListItemPositions} from '../list'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'

type NullableNumber = number | null

type ListItemProps = PropsWithChildren<{
	item: ListRenderItemInfo<any>
	currentItemPositions: SharedValue<ListItemPositions>
	isDragging: SharedValue<0 | 1>
	draggingItemId: SharedValue<number>
	maxTop: number
}>

export const LIST_ITEM_HEIGHT = 72
export const LIST_ITEM_HEIGHT_WITH_MARGIN = LIST_ITEM_HEIGHT + 24
const MIN_TOP = 0

const getKeyOfValue = (
	value: NullableNumber,
	object: ListItemPositions
): NullableNumber => {
	'worklet'
	for (const [key, val] of Object.entries(object)) {
		if (val.updatedIndex === value) {
			return parseInt(key)
		}
	}

	return null
}

const ListItem = ({
	children,
	item,
	currentItemPositions,
	isDragging,
	draggingItemId,
	maxTop
}: ListItemProps) => {
	const top = useSharedValue(0)
	const newIndex = useSharedValue<NullableNumber>(null)
	const currentIndex = useSharedValue<NullableNumber>(null)
	const currentItemPositionsDerived = useDerivedValue(() => {
		return currentItemPositions.value
	})
	const isDraggingDerived = useDerivedValue(() => {
		return isDragging.value
	})
	const draggingItemIdDerived = useDerivedValue(() => {
		return draggingItemId.value
	})
	const isCurrentDraggingItem = useDerivedValue(() => {
		return draggingItemId.value
	})

	const {colors} = useTheme()

	const styles = StyleSheet.create({
		itemContainer: {
			position: 'absolute',
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'space-between',
			alignItems: 'center',
			height: LIST_ITEM_HEIGHT,
			padding: 16,
			width: '100%',
			backgroundColor: colors.card
		}
	})

	const animatedStyles = useAnimatedStyle(() => {
		return {
			top: top.value,
			transform: [
				{
					scale: isCurrentDraggingItem.value
						? interpolate(
								isDraggingDerived.value,
								[0, 1],
								[1, 1.025]
						  )
						: interpolate(
								isDraggingDerived.value,
								[0, 1],
								[1, 0.98]
						  )
				}
			],
			shadowColor: isCurrentDraggingItem.value
				? interpolateColor(
						isDraggingDerived.value,
						[0, 1],
						[colors.text, colors.primary]
				  )
				: colors.text,
			shadowOffset: {
				width: theme.dropShadow.shadowOffset.width,
				height: isCurrentDraggingItem.value
					? interpolate(isDraggingDerived.value, [0, 1], [0, 7])
					: theme.dropShadow.shadowOffset.height
			},
			shadowOpacity: isCurrentDraggingItem.value
				? interpolate(isDraggingDerived.value, [0, 1], [0, 0.2])
				: theme.dropShadow.shadowOpacity,
			shadowRadius: isCurrentDraggingItem.value
				? interpolate(isDraggingDerived.value, [0, 1], [0, 10])
				: theme.dropShadow.shadowRadius,
			elevation: isCurrentDraggingItem.value
				? interpolate(isDraggingDerived.value, [0, 1], [0, 5])
				: theme.dropShadow.elevation,
			zIndex: isCurrentDraggingItem.value ? 1 : 0
		}
	}, [top.value, isCurrentDraggingItem.value, isDraggingDerived.value])

	const gesture = Gesture.Pan()
		.onStart(() => {
			isDragging.value = withSpring(1)
			draggingItemId.value = item.index
			currentIndex.value =
				currentItemPositionsDerived.value[item.index].updatedIndex
		})
		.onUpdate(({translationY}) => {
			if (draggingItemIdDerived.value === null) {
				return
			}

			const newTop =
				currentItemPositionsDerived.value[draggingItemIdDerived.value]
					.updatedTop + translationY

			if (
				currentIndex.value === null ||
				newTop < MIN_TOP ||
				newTop > maxTop
			) {
				return
			}

			top.value = newTop
			newIndex.value = Math.floor(
				(newTop + LIST_ITEM_HEIGHT_WITH_MARGIN / 2) /
					LIST_ITEM_HEIGHT_WITH_MARGIN
			)

			if (newIndex.value !== currentIndex.value) {
				const newIndexItemKey = getKeyOfValue(
					newIndex.value,
					currentItemPositionsDerived.value
				)
				const currentIndexItemKey = getKeyOfValue(
					currentIndex.value,
					currentItemPositionsDerived.value
				)

				if (newIndexItemKey !== null && currentIndexItemKey !== null) {
					currentItemPositions.value = {
						...currentItemPositionsDerived.value,
						[newIndexItemKey]: {
							...currentItemPositionsDerived.value[
								newIndexItemKey
							],
							updatedIndex: currentIndex.value,
							updatedTop:
								currentIndex.value *
								LIST_ITEM_HEIGHT_WITH_MARGIN
						},
						[currentIndexItemKey]: {
							...currentItemPositionsDerived.value[
								currentIndexItemKey
							],
							updatedIndex: newIndex.value
						}
					}

					currentIndex.value = newIndex.value
				}
			}
		})
		.onEnd(() => {
			if (currentIndex.value === null || newIndex.value === null) {
				return
			}

			top.value = withSpring(
				newIndex.value * LIST_ITEM_HEIGHT_WITH_MARGIN
			)

			const currentDragIndexItemKey = getKeyOfValue(
				currentIndex.value,
				currentItemPositionsDerived.value
			)

			if (currentDragIndexItemKey !== null) {
				currentItemPositions.value = {
					...currentItemPositionsDerived.value,
					[currentDragIndexItemKey]: {
						...currentItemPositionsDerived.value[
							currentDragIndexItemKey
						],
						updatedTop:
							newIndex.value * LIST_ITEM_HEIGHT_WITH_MARGIN
					}
				}
			}
			isDragging.value = withDelay(100, withSpring(0))
		})

	useAnimatedReaction(
		() => {
			return currentItemPositionsDerived.value[item.index].updatedIndex
		},
		(currentValue, previousValue) => {
			if (currentValue !== previousValue) {
				top.value =
					currentItemPositionsDerived.value[item.index].updatedIndex *
					LIST_ITEM_HEIGHT_WITH_MARGIN
			}
		}
	)

	return (
		<GestureDetector gesture={gesture}>
			<Animated.View style={[styles.itemContainer, animatedStyles]}>
				{children}
			</Animated.View>
		</GestureDetector>
	)
}

export default ListItem
