import { StyleSheet } from "react-native";
import { SIZES, COLORS } from "../../constants/theme";

const styles = StyleSheet.create({
    container: {
        margin: 17,
        flexGrow: 1
    },
    firstView: {
        margin: 25
    }, 
    textStyle: {
        color: COLORS.lightBlue
    },
    secondView: {
        margin: 25
    },
    inputEmail: {
        borderWidth: 1,
        borderRadius: 9,
        borderColor: COLORS.grey,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: SIZES.medium,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderRadius: 9,
        borderColor: COLORS.grey,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: SIZES.medium,
        marginBottom: 10,
        height: 120
    }
})

export default styles

