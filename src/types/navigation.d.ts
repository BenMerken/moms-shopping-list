declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

declare type StackParamList = {
	Home: undefined
}

declare type StackScreenProps<Screen extends keyof RootStackParamList> =
	import('@react-navigation/native-stack').NativeStackScreenProps<
		RootStackParamList,
		Screen
	>
