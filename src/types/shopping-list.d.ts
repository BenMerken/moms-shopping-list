declare type ShoppingListItem = {
	uuid: string
	order: number
	name: string
}

declare type ShoppingList = {
	uuid: string
	name: string
	items: ShoppingListItem[]
	createdAt: number
}
