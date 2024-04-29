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
})

export default styles