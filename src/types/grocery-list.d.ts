declare type GroceryListItem = string

declare type GroceryList = {
	uuid: string
	name: string
	items?: GroceryListItem[]
}
