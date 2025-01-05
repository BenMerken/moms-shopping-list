export type ShoppingListItem = string

export type ShoppingList = {
	uuid: string
	name: string
	items: ShoppingListItem[]
	createdAt: number
}
