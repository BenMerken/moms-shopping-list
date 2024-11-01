import {NavigationContainer, Theme} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import useColorScheme from '@hooks/use-color-scheme'
import {HomeScreen, ListScreen} from '@screens/index'
import {StackParamList} from '@/types/navigation'
import theme from '@utils/theme'

type StackNavigatorProps = {
	theme: Theme
}

const Stack = createNativeStackNavigator<StackParamList>()

const StackNavigator = ({theme}: StackNavigatorProps) => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='Home'
				component={HomeScreen}
				options={{
					title: 'Mijn Boodschappenlijstjes',
					navigationBarColor: theme.colors.primary,
					statusBarColor: theme.colors.primary,
					headerTintColor: theme.colors.background,
					headerStyle: {
						backgroundColor: theme.colors.primary
					},
					orientation: 'all'
				}}
			/>
			<Stack.Screen
				name='List'
				component={ListScreen}
				options={({route}) => ({
					title: route.params.listName,
					statusBarColor: theme.colors.primary,
					navigationBarColor: theme.colors.primary,
					headerTintColor: theme.colors.background,
					headerStyle: {
						backgroundColor: theme.colors.primary
					},
					orientation: 'all'
				})}
			/>
		</Stack.Navigator>
	)
}

const Navigation = () => {
	const colorScheme = useColorScheme()

	const appTheme = colorScheme === 'dark' ? theme.dark : theme.light

	return (
		<NavigationContainer theme={appTheme}>
			<StackNavigator theme={appTheme} />
		</NavigationContainer>
	)
}

export default Navigation
