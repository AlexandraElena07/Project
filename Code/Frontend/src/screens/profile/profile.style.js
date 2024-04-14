import { StyleSheet } from "react-native";
import { SIZES, COLORS } from "../../constants/theme";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    image: {
        resizeMode: "cover",
        width: SIZES.width,
        height: SIZES.height/3
    },
    stack: {
        alignItems: "center"
    }
})

export default styles