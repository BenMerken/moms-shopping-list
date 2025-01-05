import {useAsyncStorage} from '@react-native-async-storage/async-storage'
import {useHeaderHeight} from '@react-navigation/elements'
import {useTheme} from '@react-navigation/native'
import {useEffect, useState} from 'react'
import {KeyboardAvoidingView, StyleSheet, Text, View} from 'react-native'

import {SafeAreaContainer} from '@/components/index'
import List from '@/components/list/list'
import {StackScreenProps} from '@/types/navigation'
import {ShoppingList} from '@/types/shopping-list'
import layout from '@/utils/layout'
import text from '@/utils/text'

import ListItem from './list-item/list-item'
import NewItemControls from './list-item-controls/list-item-controls'

const ListScreen = ({route}: StackScreenProps<'List'>) => {
	const [shoppingList, setShoppingList] = useState<ShoppingList>()

	const headerHeight = useHeaderHeight()

	const {colors} = useTheme()

	const styles = StyleSheet.create({
		noItemsPlaceholder: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center'
		},
		newItemForm: {
			justifyContent: 'center',
			alignItems: 'center',
			marginBottom: 32
		},
		newItemFormTitle: {
			...text.subtitle,
			width: layout.window.widthWithMargin,
			color: colors.text
		}
	})

	const {getItem} = useAsyncStorage(route.params.listUuid)

	useEffect(() => {
		const getShoppingList = async () => {
			const shoppingListFromStorage = await getItem()

			setShoppingList(JSON.parse(shoppingListFromStorage!))
		}

		getShoppingList()
	}, [])

	return (
		<SafeAreaContainer>
			{!shoppingList?.items?.length ? (
				<View style={styles.noItemsPlaceholder}>
					<Text style={{...text.text, color: colors.text}}>
						Dit lijstje is (nog) leeg...
					</Text>
				</View>
			) : (
				<List
					items={shoppingList.items}
					renderItemContent={(item) => (
						<ListItem
							itemInfo={item}
							shoppingList={shoppingList}
							setShoppingList={setShoppingList}
						/>
					)}
				/>
			)}
			<KeyboardAvoidingView
				style={styles.newItemForm}
				keyboardVerticalOffset={headerHeight + 32}
				behavior='padding'
			>
				<Text style={styles.newItemFormTitle}>Nieuw Artikel</Text>
				<NewItemControls
					shoppingList={shoppingList}
					setShoppingList={setShoppingList}
				/>
			</KeyboardAvoidingView>
		</SafeAreaContainer>
	)
}

export default ListScreen
