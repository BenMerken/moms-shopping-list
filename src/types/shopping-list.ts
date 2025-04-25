export type ShoppingListItem = string

type BaseProps = {
	uuid: string
	name: string
	createdAt: number
	position: number
}

export type ShoppingList = BaseProps & {
	items: ShoppingListItem[]
}
