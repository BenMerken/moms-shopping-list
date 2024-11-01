import {FontAwesome} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useTheme} from '@react-navigation/native'
import {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react'
import {
	Alert,
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import Animated, {
	interpolate,
	interpolateColor,
	SharedValue,
	useAnimatedReaction,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming
} from 'react-native-reanimated'

import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import {ShoppingList, ShoppingListItem} from '@/types/shopping-list'
import text from '@/utils/text'
import theme from '@/utils/theme'

type ListProps = {
	shoppingList: ShoppingList
	setShoppingList: Dispatch<SetStateAction<ShoppingList | undefined>>
}

type ListItemPositions = {
	[key: number]: {
		updatedIndex: number
		updatedTop: number
	}
}

type ListItemProps = {
	itemInfo: ListRenderItemInfo<ShoppingListItem>
	shoppingList: ShoppingList
	setShoppingList: Dispatch<SetStateAction<ShoppingList | undefined>>
	currentItemPositions: SharedValue<ListItemPositions>
	isDragging: SharedValue<0 | 1>
	draggedItemId: SharedValue<null | number>
	maxBoundary: number
}

const ITEM_HEIGHT = 56
const MIN_BOUNDARY = 0

const styles = StyleSheet.create({
	shoppingListItem: {
		...theme.dropShadow,
		flexDirection: 'row',
		position: 'absolute',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		width: '100%',
		height: ITEM_HEIGHT
	},
	shoppingListItemLeft: {
		flexDirection: 'row',
		gap: 16
	}
})

const getKeyOfValue = (
	value: number,
	obj: ListItemPositions
): number | undefined => {
	'worklet'
	for (const [key, val] of Object.entries(obj)) {
		if (val.updatedIndex === value) {
			return Number(key)
		}
	}
	return undefined // Return undefined if the value is not found
}

const ListItem = ({
	itemInfo,
	shoppingList,
	setShoppingList,
	currentItemPositions,
	isDragging,
	draggedItemId,
	maxBoundary
}: ListItemProps) => {
	const {item, index: itemIndex} = itemInfo
	// Use this boolean state to make the list item input field only editable, if the user tapped the edit button.
	// Directly focusing the input should not be possible, to prevent the keyboard from sliding in, by accidently tapping the input field.
	const [editing, setEditing] = useState(false)
	const [itemValue, setItemValue] = useState(item)
	const ref = useRef(null)

	const inputRef = useRef<TextInput>(null)

	const {colors} = useTheme()

	const top = useSharedValue(itemIndex * ITEM_HEIGHT)
	const currentIndex = useSharedValue<null | number>(null)
	const newIndex = useSharedValue<null | number>(null)
	const currentItemPositionsDerived = useDerivedValue(() => {
		return currentItemPositions.value
	})
	const isDraggingDerived = useDerivedValue(() => {
		return isDragging.value
	})
	const draggedItemIdDerived = useDerivedValue(() => {
		return draggedItemId.value
	})
	const isCurrentDraggingItem = useDerivedValue(() => {
		return (
			isDraggingDerived.value && draggedItemIdDerived.value === itemIndex
		)
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
			backgroundColor: isCurrentDraggingItem.value
				? interpolateColor(
						isDraggingDerived.value,
						[0, 1],
						[colors.card, colors.background]
				  )
				: colors.background,

			shadowColor: isCurrentDraggingItem.value
				? interpolateColor(
						isDraggingDerived.value,
						[0, 1],
						[colors.card, colors.background]
				  )
				: undefined,
			shadowOffset: {
				width: 0,
				height: isCurrentDraggingItem.value
					? interpolate(isDraggingDerived.value, [0, 1], [0, 7])
					: 0
			},
			shadowOpacity: isCurrentDraggingItem.value
				? interpolate(isDraggingDerived.value, [0, 1], [0, 0.2])
				: 0,
			shadowRadius: isCurrentDraggingItem.value
				? interpolate(isDraggingDerived.value, [0, 1], [0, 10])
				: 0,
			elevation: isCurrentDraggingItem.value
				? interpolate(isDraggingDerived.value, [0, 1], [0, 5])
				: 0, // For Android,
			zIndex: isCurrentDraggingItem.value ? 1 : 0
		}
	}, [draggedItemIdDerived.value, isDraggingDerived.value])

	// This sets the cursor behind the input text (for some reason, the selection prop on TextInput does not work).
	const cursorPosition = itemValue.name.length
	inputRef.current?.setNativeProps({
		selection: {start: cursorPosition, end: cursorPosition}
	})

	const gesture = Gesture.Pan()
		.onStart(() => {
			isDragging.value = withSpring(1)

			draggedItemId.value = itemIndex

			currentIndex.value =
				currentItemPositionsDerived.value[itemIndex].updatedIndex
		})
		.onUpdate((e) => {
			if (draggedItemIdDerived.value === null) {
				return
			}

			const newTop =
				currentItemPositionsDerived.value[draggedItemIdDerived.value]
					.updatedTop + e.translationY

			if (
				currentIndex.value === null ||
				newTop < MIN_BOUNDARY ||
				newTop > maxBoundary
			) {
				return
			}

			top.value = newTop

			newIndex.value = Math.floor(
				(newTop + ITEM_HEIGHT / 2) / ITEM_HEIGHT
			)

			if (newIndex.value !== currentIndex.value) {
				const newIndexItemKey = getKeyOfValue(
					newIndex.value,
					currentItemPositionsDerived.value
				)
				const currentDragIndexItemKey = getKeyOfValue(
					currentIndex.value,
					currentItemPositionsDerived.value
				)

				if (
					newIndexItemKey !== undefined &&
					currentDragIndexItemKey !== undefined
				) {
					currentItemPositions.value = {
						...currentItemPositionsDerived.value,
						[newIndexItemKey]: {
							...currentItemPositionsDerived.value[
								newIndexItemKey
							],
							updatedIndex: currentIndex.value,
							updatedTop: currentIndex.value * ITEM_HEIGHT
						},
						[currentDragIndexItemKey]: {
							...currentItemPositionsDerived.value[
								currentDragIndexItemKey
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

			top.value = withSpring(newIndex.value * ITEM_HEIGHT)

			const currentDragIndexItemKey = getKeyOfValue(
				currentIndex.value,
				currentItemPositionsDerived.value
			)

			if (currentDragIndexItemKey !== undefined) {
				currentItemPositions.value = {
					...currentItemPositionsDerived.value,
					[currentDragIndexItemKey]: {
						...currentItemPositionsDerived.value[
							currentDragIndexItemKey
						],
						updatedTop: newIndex.value * ITEM_HEIGHT
					}
				}
			}

			isDragging.value = withDelay(200, withSpring(0))

			// TODO: Update the position property of the items in DB
		})

	const removeItem = async () => {
		const newShoppingList = {
			...shoppingList,
			items: shoppingList!.items!.filter(
				(itemOnList) => itemOnList !== itemValue
			)
		}

		await AsyncStorage.mergeItem(
			shoppingList.uuid,
			JSON.stringify(newShoppingList)
		)
		setShoppingList(newShoppingList)
	}

	// Sets the editing boolean to true, to indicate the user wants to edit this list item.
	// An effect hook monitors this boolean, to set the focus on the input, in case the user wants to edit.
	const handleEditTap = () => setEditing(true)

	const handleSaveTap = async () => {
		if (item === itemValue) {
			inputRef.current?.blur()

			return
		}

		if (itemValue.name.trim() === '') {
			return
		}

		if (
			shoppingList.items
				.map((item) => item.name.toLowerCase())
				.includes(itemValue.name.toLowerCase())
		) {
			Alert.alert(
				`Er bestaat al een artikel met naam "${itemValue}" in dit lijstje`
			)

			return
		}

		const newShoppingList = {
			...shoppingList,
			items: shoppingList.items.map((item, index) =>
				index === itemInfo.index ? itemValue : item
			)
		}

		await AsyncStorage.mergeItem(
			shoppingList.uuid,
			JSON.stringify(newShoppingList)
		)
		setShoppingList(newShoppingList)
		// Since the parent FlatList's keyboardShouldPersistTaps prop will prevent the TextInput from blurring,
		// it must be triggered manually.
		inputRef.current?.blur()
	}

	// Set the editing boolean back to false, to make the text input directly uneditable again.
	const handleInputBlur = () => {
		setEditing(false)
		// This is a safety reset, in case the user would click away from the input, without explicitly saving the new value.
		setItemValue(item)
	}

	const handleItemTextChange = (text: string) => {
		setItemValue({...itemValue, name: text})
	}

	useAnimatedReaction(
		() => {
			return currentItemPositionsDerived.value[itemIndex].updatedIndex
		},
		(currentValue, previousValue) => {
			if (currentValue !== previousValue) {
				if (
					draggedItemIdDerived.value !== null &&
					itemIndex === draggedItemIdDerived.value
				) {
					top.value = withSpring(
						currentItemPositionsDerived.value[itemIndex]
							.updatedIndex * ITEM_HEIGHT
					)
				} else {
					top.value = withTiming(
						currentItemPositionsDerived.value[itemIndex]
							.updatedIndex * ITEM_HEIGHT,
						{duration: 500}
					)
				}
			}
		}
	)

	// Use boolean flag to check whether the user wants to edit the list item
	// If so, focus on the input, so the user can start typing.
	useEffect(() => {
		if (editing) {
			// Timeout is necessary, in order to focus the element after sufficient time has passed to render the editable input,
			// otherwise, the input won't be focused.
			const timeout = setTimeout(() => inputRef.current?.focus(), 100)

			return () => clearTimeout(timeout)
		}
	}, [editing])

	return (
		<GestureDetector gesture={gesture}>
			<Animated.View
				ref={ref}
				style={[styles.shoppingListItem, animatedStyles]}
			>
				<View style={styles.shoppingListItemLeft}>
					<TouchableOpacity onPress={removeItem}>
						<FontAwesome
							name='close'
							size={24}
							color={colors.text}
						/>
					</TouchableOpacity>
					<TextInput
						ref={inputRef}
						editable={editing}
						style={{...text.text, color: colors.text}}
						value={itemValue.name}
						onChangeText={handleItemTextChange}
						onBlur={handleInputBlur}
						onSubmitEditing={handleSaveTap}
					/>
				</View>
				<TouchableOpacity
					onPress={editing ? handleSaveTap : handleEditTap}
				>
					<FontAwesome
						name={editing ? 'check' : 'pencil'}
						size={24}
						color={colors.text}
					/>
				</TouchableOpacity>
			</Animated.View>
		</GestureDetector>
	)
}

const List = ({shoppingList, setShoppingList}: ListProps) => {
	const getInitialPositions = (): ListItemPositions => {
		const itemPositions: ListItemPositions = {}

		for (let i = 0; i < shoppingList.items.length; i++) {
			itemPositions[i] = {
				updatedIndex: i,
				updatedTop: i * ITEM_HEIGHT
			}
		}

		return itemPositions
	}

	const currentItemPositions = useSharedValue<ListItemPositions>(
		getInitialPositions()
	)
	const isDragging = useSharedValue<0 | 1>(0)
	const draggingItemId = useSharedValue<null | number>(null)

	return (
		<FlatList
			// This prop is necessary to be able to tap the save icon for the list item input,
			// since tapping outside the input ignores other click events by default.
			removeClippedSubviews={false}
			keyboardShouldPersistTaps='always'
			contentContainerStyle={{
				height: shoppingList.items.length * ITEM_HEIGHT
			}}
			data={shoppingList?.items.sort((item) => item.order)}
			keyExtractor={(item) => item.uuid}
			renderItem={(item) => (
				<ListItem
					shoppingList={shoppingList}
					setShoppingList={setShoppingList}
					itemInfo={item}
					currentItemPositions={currentItemPositions}
					isDragging={isDragging}
					draggedItemId={draggingItemId}
					maxBoundary={(shoppingList.items.length - 1) * ITEM_HEIGHT}
				/>
			)}
		/>
	)
}

export default List
