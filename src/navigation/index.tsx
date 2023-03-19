import {
	NavigationContainer,
	DefaultTheme,
	DarkTheme
} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {ColorSchemeName} from 'react-native'

import {HomeScreen, ListScreen} from '@screens/index'

const Stack = createNativeStackNavigator<StackParamList>()

const StackNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='Home'
				component={HomeScreen}
				options={{title: 'Mijn Boodschappenlijstjes'}}
			/>
			<Stack.Screen
				name='List'
				component={ListScreen}
				options={({route}) => ({title: route.params.listName})}
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
