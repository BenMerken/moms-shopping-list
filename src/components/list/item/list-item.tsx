import {PropsWithChildren} from 'react'
import {StyleSheet} from 'react-native'
import Animated, {
	useAnimatedStyle,
	useSharedValue
} from 'react-native-reanimated'

type ListItemProps = PropsWithChildren<{}>

const styles = StyleSheet.create({
	item: {
		width: '100%'
	}
})

const ListItem = ({children}: ListItemProps) => {
	const top = useSharedValue(0)

	const animatedStyles = useAnimatedStyle(() => {
		return {
			top: top.value
		}
	})

	return (
		<Animated.View style={[styles.item, animatedStyles]}>
			{children}
		</Animated.View>
	)
}

export default ListItem
