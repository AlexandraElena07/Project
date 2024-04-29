import { StyleSheet } from "react-native";
import { SIZES } from "../constants/theme";

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
    },
  });

  export default styles