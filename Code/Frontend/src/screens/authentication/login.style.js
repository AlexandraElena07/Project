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
        //width: "30%",
        alignItems: "center",
        width: 100,
        height: 100,
         // Reducerea margin-top-ului imaginii
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

    } 

})

export default styles