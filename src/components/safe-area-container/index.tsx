import {View, ViewStyle} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

type SafeAreaContainerProps = {
	style?: ViewStyle
}

const SafeAreaContainer = ({
	style,
	children
}: WithChildren<SafeAreaContainerProps>) => {
	const {
		top: paddingTop,
		bottom: paddingBottom,
		left: paddingLeft,
		right: paddingRight
	} = useSafeAreaInsets()

	return (
		<View
			style={{
				...style,
				flex: 1,
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight
			}}
		>
			{children}
		</View>
	)
}

export default SafeAreaContainer
