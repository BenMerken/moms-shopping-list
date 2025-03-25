import {FontAwesome} from '@expo/vector-icons'
import {useTheme} from '@react-navigation/native'
import {PropsWithChildren} from 'react'
import {ListRenderItemInfo, StyleSheet, View} from 'react-native'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
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

type NullableNumber = number | null

type ListItemProps = PropsWithChildren<{
	item: ListRenderItemInfo<any>
	currentItemPositions: SharedValue<ListItemPositions>
	isDragging: SharedValue<0 | 1>
	draggingItemId: SharedValue<number>
	maxTop: number
	itemHeight: number
	itemHeightWithMargin: number
}>

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
	maxTop,
	itemHeight,
	itemHeightWithMargin
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
		return draggingItemId.value === item.index
	})

	const {colors} = useTheme()

	const styles = StyleSheet.create({
		itemContainer: {
			position: 'absolute',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			gap: 16,
			height: itemHeight,
			padding: 16,
			width: '100%',
			backgroundColor: colors.card
		},
		contentContainer: {
			flexShrink: 1,
			flexGrow: 1
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
			elevation: isCurrentDraggingItem.value
				? interpolate(
						isDraggingDerived.value,
						[0, 1],
						[
							theme.dropShadow.elevation,
							theme.dropShadow.elevation + 5
						]
				  )
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
				(newTop + itemHeightWithMargin / 2) / itemHeightWithMargin
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
								currentIndex.value * itemHeightWithMargin
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

			top.value = withSpring(newIndex.value * itemHeightWithMargin)

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
						updatedTop: newIndex.value * itemHeightWithMargin
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
					itemHeightWithMargin
			}
		}
	)

	return (
		<Animated.View style={[styles.itemContainer, animatedStyles]}>
			<View style={styles.contentContainer}>{children}</View>
			<GestureDetector gesture={gesture}>
				<View>
					<FontAwesome name='bars' size={16} color={colors.text} />
				</View>
			</GestureDetector>
		</Animated.View>
	)
}

export default ListItem
