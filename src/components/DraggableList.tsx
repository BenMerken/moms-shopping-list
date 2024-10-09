import {View} from 'react-native'

type DraggableListProps<T> = {
	items: T[]
}

type ItemProps<T> = {
	item: T
}

const Item = <T extends unknown>({item}: ItemProps<T>) => {
	return <View></View>
}

const DraggableList = <T extends unknown>({items}: DraggableListProps<T>) => {
	return
}

DraggableList.Item = Item

export default DraggableList
