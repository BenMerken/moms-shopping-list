import {SafeAreaProvider} from 'react-native-safe-area-context'

import {Text} from 'react-native'

const Page = () => {
	return (
		<SafeAreaProvider>
			<Text>App works!</Text>
		</SafeAreaProvider>
	)
}

export default Page
