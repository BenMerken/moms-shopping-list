export type StackParamList = {
	Home: undefined
	List: {
		listUuid: string
		listName: string
	}
}

export type StackScreenProps<Screen extends keyof StackParamList> =
	import('@react-navigation/native-stack').NativeStackScreenProps<
		StackParamList,
		Screen
	>
