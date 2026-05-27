import {registerRootComponent} from 'expo'
import {SafeAreaProvider} from 'react-native-safe-area-context'

import {Text} from 'react-native'

const App = () => {
	return (
		<SafeAreaProvider>
			<Text>App works!</Text>
		</SafeAreaProvider>
	)
}

registerRootComponent(App)
