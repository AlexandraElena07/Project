import { StyleSheet } from "react-native";
import { SIZES, COLORS, TEXT } from "../../constants/theme";

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
        backgroundColor: COLORS.black, // Culoarea de fundal a modalității
        justifyContent: 'center',
        alignItems: 'center',
    },
    enlargedImage: {
        width: SIZES.width, // Lățimea imaginii mărite să fie egală cu lățimea ecranului
        height: SIZES.height, // Înălțimea imaginii mărite să fie egală cu înălțimea ecranului
        resizeMode: 'contain', // Modul de redimensionare al imaginii
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        margin: 20,
        backgroundColor: 'white',
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
        elevation: 5,
      },
      deleteButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
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
        backgroundColor: COLORS.white,
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
        color: COLORS.black,
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
})

export default styles