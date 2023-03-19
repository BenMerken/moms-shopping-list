import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme
} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {ColorSchemeName} from 'react-native'

import {HomeScreen, ListScreen} from '@screens/index'
import theme from '@utils/theme'

const Stack = createNativeStackNavigator<StackParamList>()

const StackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='Home'
				component={HomeScreen}
				options={{
					title: 'Mijn Boodschappenlijstjes',
					navigationBarColor: theme.light.primary,
					statusBarColor: theme.light.primary,
					headerTintColor: theme.light.background,
					headerStyle: {backgroundColor: theme.light.primary},
					orientation: 'all'
				}}
			/>
			<Stack.Screen
				name='List'
				component={ListScreen}
				options={({route}) => ({
					title: route.params.listName,
					statusBarColor: theme.light.primary,
					navigationBarColor: theme.light.primary,
					headerTintColor: theme.light.background,
					headerStyle: {backgroundColor: theme.light.primary},
					orientation: 'all'
				})}
			/>
		</Stack.Navigator>
	)
}

const Navigation = ({colorScheme}: {colorScheme: ColorSchemeName}) => {
	return (
		<NavigationContainer
			theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
		>
			<StackNavigator />
		</NavigationContainer>
	)
}

export default Navigation
