import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
        //backgroundColor: "#fff7f7"
    },
    image: {
        resizeMode: "contain",
        alignItems: "center",
        width: 100,
        height: 100,
    },
    inputWrapper: (borderColor) => ({
        borderColor: borderColor,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        height: 50,
        flexDirection: "row",
        paddingHorizontal: 15,
        alignItems: "center",
        borderRadius: SIZES.small
    }),
    wraper: {
        marginBottom: 20
    },
    label: {
        fontFamily: 'medium',
        fontSize: SIZES.medium,
        marginBottom: 5,
        marginEnd: 5,
        textAlign: "left"
    },
    errorMessage: {
        color:  COLORS.rose,
        fontFamily: 'medium',
        fontSize: SIZES.small,
        marginTop: 5,
        marginLeft: 5,

    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    } 

})

export default styles