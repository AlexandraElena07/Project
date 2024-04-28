import { StyleSheet } from "react-native";
import { SIZES, COLORS } from "../../constants/theme";

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
    },
    image: {
        resizeMode: "cover",
        width: SIZES.width,
        height: SIZES.height/3
    },
    profile: {
        padding: 24,
        alignItems: "center",
        justifyContent: 'center',
    },
    profileName: {
        marginTop: 20,
        fontSize: SIZES.medium
    },
    profileAdress: {
        marginTop: 5,
        fontSize: SIZES.small,
    },
    profileAvatar: {
        width: 72,
        height: 72,
        borderRadius: 9999,
    },
    profileAvatarWrapper: {
        position: 'relative',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default styles