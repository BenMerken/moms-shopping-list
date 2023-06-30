declare type ShoppingListItem = string

declare type ShoppingList = {
	uuid: string
	name: string
	items: ShoppingListItem[]
	createdAt: number
}
