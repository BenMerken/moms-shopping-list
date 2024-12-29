import {useTheme} from '@react-navigation/native'
import {PropsWithChildren} from 'react'
import {ListRenderItemInfo, StyleSheet} from 'react-native'
import Animated, {
	SharedValue,
	useAnimatedStyle,
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
	isdragging: SharedValue<0 | 1>
	draggingItemId: SharedValue<number>
}>

export const LIST_ITEM_HEIGHT = 64

const ListItem = ({
	children,
	item,
	isdragging,
	draggingItemId
}: ListItemProps) => {
	const top = useSharedValue(0)

	const {colors} = useTheme()

	const styles = StyleSheet.create({
		item: {
			...theme.dropShadow,
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
			top: top.value
		}
	})

	const gesture = Gesture.Pan()
		.onStart(() => {
			isdragging.value = withSpring(1)
			draggingItemId.value = item.index
		})
		.onEnd(() => {
			isdragging.value = withDelay(100, withSpring(0))
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
