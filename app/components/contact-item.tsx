import { StyleSheet, Text, View } from "react-native";
import { Contact } from "../types";

type Props = {
  contact: Contact;
};

const ContactItem: React.FC<Props> = ({ contact }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.name}>
          {[contact.lastName, contact.firstName, contact.middleName]
            .filter(Boolean)
            .join(" ")}
        </Text>
        <Text style={styles.phone}>{contact.phoneNumbers.join(", ")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
  },
  name: {
    fontWeight: "bold",
    fontSize: 24,
  },
  phone: {
    fontSize: 20,
  },
});

export { ContactItem };
