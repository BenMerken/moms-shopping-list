import {Dimensions} from 'react-native'

const fullWidth = Dimensions.get('window').width
const fullHeight = Dimensions.get('window').height

const layout = {
	window: {
		fullWidth,
		fullHeight,
		widthWithMargin: fullWidth * 0.8
	}
}

export default layout
