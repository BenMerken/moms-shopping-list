import {FontAwesome} from '@expo/vector-icons'
import {useTheme} from '@react-navigation/native'
import React, {createContext, useContext, useState} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {useSharedValue, SharedValue} from 'react-native-reanimated'

import layout from '@utils/layout'
import theme from '@utils/theme'

type DraggingItemProps = {
	item: ShoppingListItem
	position: {
		x: SharedValue<number>
		y: SharedValue<number>
	}
}

const styles = StyleSheet.create({
	draggingItem: {
		...theme.dropShadow,
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginHorizontal: 'auto',
		padding: 16,
		width: layout.window.widthWithMargin
	},
	draggingItemLeft: {
		flexDirection: 'row',
		gap: 16
	}
})

const DraggingItem = ({item, position}: DraggingItemProps) => {
	const {colors} = useTheme()

	return (
		<Animated.View
			style={{
				...styles.draggingItem,
				position: 'absolute',
				left: position.x,
				top: position.y
			}}
		>
			<View style={styles.draggingItemLeft}>
				<FontAwesome name='close' size={24} color={colors.text} />
				<Text style={{color: colors.text}}>{item.name}</Text>
			</View>
			<FontAwesome name='pencil' size={24} color={colors.text} />
		</Animated.View>
	)
}

type DraggingAreaContext = {
	setDraggingItem: (item: ShoppingListItem) => void
}

const DraggingAreaContext = createContext<DraggingAreaContext>({
	setDraggingItem: () => {}
})

const DragArea = ({children}: WithChildren) => {
	const [draggingItem, setDraggingItem] = useState<ShoppingListItem | null>(
		null
	)

	const dragX = useSharedValue(0)
	const dragY = useSharedValue(0)

	const pan = Gesture.Pan().onUpdate((event) => {
		dragX.value = event.x
		dragY.value = event.y
	})

	return (
		<DraggingAreaContext.Provider value={{setDraggingItem}}>
			{children}
			<GestureDetector gesture={pan}>
				{draggingItem ? (
					<View
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							bottom: 0,
							right: 0
						}}
					>
						<DraggingItem
							position={{x: dragX, y: dragY}}
							item={{uuid: '', name: 'aaaaa', order: 0}}
						/>
					</View>
				) : (
					// GestureDetector need a single child, so we give it a View without a height if no item is being dragged
					<View></View>
				)}
			</GestureDetector>
		</DraggingAreaContext.Provider>
	)
}

export default DragArea

export const useDraggingAreaContext = () => useContext(DraggingAreaContext)