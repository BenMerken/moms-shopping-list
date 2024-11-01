export type ShoppingListItem = {
	uuid: string
	order: number
	name: string
}

export type ShoppingList = {
	uuid: string
	name: string
	items: ShoppingListItem[]
	createdAt: number
}
