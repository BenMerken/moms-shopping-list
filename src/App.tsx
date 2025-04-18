import {registerRootComponent} from 'expo'
import {SafeAreaProvider} from 'react-native-safe-area-context'

import useCachedResources from './hooks/use-cached-resources'
import Navigation from './navigation'

const App = () => {
	const isLoadingComplete = useCachedResources()

	if (!isLoadingComplete) {
		return null
	} else {
		return (
			<SafeAreaProvider>
				<Navigation />
			</SafeAreaProvider>
		)
	}
}

registerRootComponent(App)
