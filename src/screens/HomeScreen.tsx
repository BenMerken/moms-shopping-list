import {StyleSheet, Text} from 'react-native'

import {SafeAreaContainer} from '@components/index'
import text from '@utils/text'

const styles = StyleSheet.create({
	screenTitle: {
		...text.screenTitle,
		alignSelf: 'center'
	}
})

const HomeScreen = () => {
	return (
		<SafeAreaContainer>
			<Text style={styles.screenTitle}>Mijn Boodschappenlijstjes</Text>
		</SafeAreaContainer>
	)
}

export default HomeScreen
