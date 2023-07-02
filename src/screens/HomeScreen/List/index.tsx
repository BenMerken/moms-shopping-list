import {FontAwesome} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useNavigation, useTheme} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {Dispatch, SetStateAction} from 'react'
import {
	FlatList,
	ListRenderItemInfo,
	StyleSheet,
	Text,
	TouchableOpacity
} from 'react-native'

import layout from '@utils/layout'
import text from '@utils/text'
import theme from '@utils/theme'

type ShoppingListsListProps = {
	shoppingLists: ShoppingList[]
	setShoppingLists: Dispatch<SetStateAction<ShoppingList[]>>
}

type ShoppingListItemProps = ShoppingListsListProps & {
	item: ListRenderItemInfo<ShoppingList>
}

const ListItem = ({
	item,
	shoppingLists,
	setShoppingLists
}: ShoppingListItemProps) => {
	const {
		item: {createdAt, name, uuid}
	} = item

	const {navigate} =
		useNavigation<NativeStackNavigationProp<StackParamList>>()
	const {colors} = useTheme()

	const styles = StyleSheet.create({
		shoppingListItem: {
			...theme.dropShadow,
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 4,
			paddingTop: 40,
			padding: 16,
			width: layout.window.widthWithMargin,
			backgroundColor: colors.card
		},
		listItemCloseIcon: {
			position: 'absolute',
			top: 16,
			right: 16
		},
		shoppingListName: {
			...text.text,
			fontWeight: '700',
			color: colors.text
		}
	})

	const createdAtDate = new Date(createdAt || 0)

	const removeListItem = async (uuid: string) => {
		await AsyncStorage.removeItem(uuid, () => {
			setShoppingLists([
				...shoppingLists.filter((list) => list.uuid !== uuid)
			])
		})
	}

	return (
		<TouchableOpacity
			style={styles.shoppingListItem}
			onPress={(e) => {
				e.preventDefault()
				e.stopPropagation()
				navigate('List', {
					listUuid: uuid,
					listName: name
				})
			}}
		>
			<TouchableOpacity
				style={styles.listItemCloseIcon}
				onPress={() => removeListItem(uuid)}
			>
				<FontAwesome name='close' color={colors.text} size={24} />
			</TouchableOpacity>
			<Text style={styles.shoppingListName}>{name},</Text>
			<Text style={{...text.text, color: colors.text}}>
				aangemaakt op{' '}
				{`${createdAtDate.toLocaleDateString(
					'nl-BE'
				)}, om ${createdAtDate.toLocaleTimeString('nl-BE')}`}
			</Text>
		</TouchableOpacity>
	)
}

const ShoppingListsList = ({
	shoppingLists,
	setShoppingLists
}: ShoppingListsListProps) => {
	const styles = StyleSheet.create({
		shoppingLists: {
			flexGrow: 1,
			alignItems: 'center',
			gap: 8
		}
	})

	return (
		<FlatList
			contentContainerStyle={styles.shoppingLists}
			data={shoppingLists}
			renderItem={(item) => (
				<ListItem
					shoppingLists={shoppingLists}
					setShoppingLists={setShoppingLists}
					item={item}
				/>
			)}
		/>
	)
}

export default ShoppingListsList
