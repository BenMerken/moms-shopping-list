import {registerRootComponent} from 'expo'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {SafeAreaProvider} from 'react-native-safe-area-context'

import useCachedResources from './hooks/useCachedResources'
import Navigation from './navigation'

const App = () => {
	const isLoadingComplete = useCachedResources()

	if (!isLoadingComplete) {
		return null
	} else {
		return (
			<GestureHandlerRootView>
				<SafeAreaProvider>
					<Navigation />
				</SafeAreaProvider>
			</GestureHandlerRootView>
		)
	}
}

registerRootComponent(App)
