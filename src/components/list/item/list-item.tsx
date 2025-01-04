import {useTheme} from '@react-navigation/native'
import {PropsWithChildren} from 'react'
import {ListRenderItemInfo, StyleSheet} from 'react-native'
import Animated, {
	interpolate,
	interpolateColor,
	SharedValue,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withDelay,
	withSpring
} from 'react-native-reanimated'

import layout from '@utils/layout'
import theme from '@utils/theme'

import {ListItemPositions} from '../list'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'

type ListItemProps = PropsWithChildren<{
	item: ListRenderItemInfo<any>
	currentItemPositions: SharedValue<ListItemPositions>
	isDragging: SharedValue<0 | 1>
	draggingItemId: SharedValue<number>
}>

export const LIST_ITEM_HEIGHT = 64

const ListItem = ({
	children,
	item,
	isDragging,
	draggingItemId
}: ListItemProps) => {
	const top = useSharedValue(0)
	const isCurrentDraggingItem = useDerivedValue(() => {
		return isDragging.value === 1 && draggingItemId.value === item.index
	})

	const {colors} = useTheme()

	const styles = StyleSheet.create({
		item: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 8,
			padding: 16,
			width: layout.window.widthWithMargin,
			backgroundColor: colors.card
		}
	})

	const animatedStyles = useAnimatedStyle(() => {
		return {
			top: top.value,
			transform: [
				{
					scale: isCurrentDraggingItem.value
						? interpolate(isDragging.value, [0, 1], [1, 1.025])
						: interpolate(isDragging.value, [0, 1], [1, 0.98])
				}
			],
			shadowColor: isCurrentDraggingItem.value
				? interpolateColor(
						isDragging.value,
						[0, 1],
						[colors.primary, colors.text]
				  )
				: undefined,
			shadowOffset: {
				width: theme.dropShadow.shadowOffset.width,
				height: isCurrentDraggingItem.value
					? interpolate(isDragging.value, [0, 1], [0, 7])
					: theme.dropShadow.shadowOffset.height
			},
			shadowOpacity: isCurrentDraggingItem.value
				? interpolate(isDragging.value, [0, 1], [0, 0.2])
				: theme.dropShadow.shadowOpacity,
			shadowRadius: isCurrentDraggingItem.value
				? interpolate(isDragging.value, [0, 1], [0, 10])
				: theme.dropShadow.shadowRadius,
			elevation: isCurrentDraggingItem.value
				? interpolate(isDragging.value, [0, 1], [0, 5])
				: theme.dropShadow.elevation,
			zIndex: isCurrentDraggingItem.value ? 1 : 0
		}
	}, [draggingItemId.value, isDragging.value])

	const gesture = Gesture.Pan()
		.onStart(() => {
			isDragging.value = withSpring(1)
			draggingItemId.value = item.index
		})
		.onEnd(() => {
			isDragging.value = withDelay(100, withSpring(0))
		})

	return (
		<GestureDetector gesture={gesture}>
			<Animated.View style={[styles.item, animatedStyles]}>
				{children}
			</Animated.View>
		</GestureDetector>
	)
}

export default ListItem
