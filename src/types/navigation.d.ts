declare type StackParamList = {
	Home: undefined
	List: {
		listId: string
	}
}

declare type StackScreenProps<Screen extends keyof StackParamList> =
	import('@react-navigation/native-stack').NativeStackScreenProps<
		StackParamList,
		Screen
	>
