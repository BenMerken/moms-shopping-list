import {StyleSheet, Text, View} from 'react-native'

import theme from '@utils/theme'

const styles = StyleSheet.create({
	container: {
		backgroundColor: theme.light.background,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
})

const HomeScreen = () => {
	return <View style={styles.container}>
		<Text>Mom's Shopping List</Text>
	</View>
}

export default HomeScreen
