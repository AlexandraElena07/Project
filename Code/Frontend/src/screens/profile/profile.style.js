import { StyleSheet } from "react-native";
import { COLORS, SIZES } from "../../constants/theme";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SIZES.large
    },
    content: {
        alignItems: 'center',
    },
    switchContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    switchSelector: {
        width: 200,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: COLORS.red
    },
});

export default styles