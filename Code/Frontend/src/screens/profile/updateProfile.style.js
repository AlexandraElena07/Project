import { StyleSheet } from "react-native";
import { SIZES, COLORS } from "../../constants/theme";

const styles = StyleSheet.create({
    container: {
        margin: 17
    },
    image: {
        resizeMode: "cover",
        width: SIZES.width,
        height: SIZES.height/3,
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
    buttonAdd: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        height: 34,
        width: 170,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: COLORS.blue,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonTextAdd: {
        color: COLORS.blue,
        fontSize: 16,
        fontWeight: 'bold',
      },
      buttonRemove: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        height: 34,
        width: 170,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: COLORS.red,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonTextRemove: {
        color: COLORS.red,
        fontSize: 16,
        fontWeight: 'bold',
      },
      input: {
        borderWidth: 1,
        borderRadius: 9,
        borderColor: COLORS.grey,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: SIZES.medium,
        marginBottom: 10,
    },
    inputEmail: {
        borderWidth: 1,
        borderRadius: 9,
        borderColor: COLORS.grey,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: SIZES.medium,
        marginBottom: 10,
        backgroundColor: COLORS.white
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: COLORS.grey,
        borderRadius: 9999, 
        width: 30, 
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        fontSize: 24,
        color: COLORS.darkGrey

    },
})

export default styles