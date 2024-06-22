import { StyleSheet } from "react-native";
import { SIZES, COLORS, TEXT } from "../../constants/theme";

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
    },
    image: {
        resizeMode: "cover",
        width: SIZES.width,
        height: SIZES.height / 3
    },
    profile: {
        padding: 24,
        alignItems: "center",
        justifyContent: 'center',
    },
    username: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileAvatar: {
        width: 100,
        height: 100,
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: COLORS.white
    },
    profileAvatarWrapper: {
        position: 'relative',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    option: {
        paddingLeft: 20,
        paddingBottom: 5
    },
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: COLORS.white,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    deleteButton: {
        flexDirection: 'row',
        height: 34,
        width: 130,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: COLORS.blue,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextDelete: {
        color: COLORS.blue,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonCancel: {
        flexDirection: 'row',
        height: 34,
        width: 130,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: COLORS.red,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextCancel: {
        color: COLORS.red,
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalText: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        fontSize: TEXT.medium
    },
    textStyle: {
        color: COLORS.darkGrey,
        fontWeight: 'medium',
        textAlign: 'center',
        marginBottom: 15,
        fontSize: TEXT.small
    },
    profileAvatarDelete: {
        width: 60,
        height: 60,
        borderRadius: 9999,
        borderWidth: 2,
        borderColor: COLORS.white
    },
    email: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    centerView: {
        alignItems: 'center',
        alignContent: 'center'
    },
    image: {
        resizeMode: "contain",
        alignItems: "center",
        width: 190,
        height: 190,
    },
    modalViewAbout: {
        margin: 15,
        borderRadius: 20,
        padding: 15,
        shadowColor: COLORS.white,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textStyleAbout: {
        marginBottom: 15,
        fontSize: TEXT.small,
        fontFamily: 'medium'
    },
    enlargedImage: {
        resizeMode: "center",
        width: SIZES.width,
        height: SIZES.height / 1.2,
    }
})

export default styles