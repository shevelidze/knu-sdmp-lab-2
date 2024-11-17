import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import * as Contacts from "expo-contacts";
import { useCallback, useEffect, useState } from "react";
import { Contact } from "../types";
import { ContactItem } from "./contact-item";

const LIFECELL_CODES = ["63", "73", "93"];

const isLifeCellNumber = (phoneNumber: string): boolean => {
  const number = phoneNumber.replace(/\D/g, "");

  const finalNumber = number.startsWith("380") ? number.slice(3) : number;

  return LIFECELL_CODES.some((code) => {
    return finalNumber.startsWith(code);
  });
};

const ContactsTab: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);

  const updateContacts = useCallback(async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      const nextContacts: Contact[] = [];

      for (const contact of data) {
        if (!contact.phoneNumbers) {
          continue;
        }

        const validPhoneNumbers: string[] = [];

        for (const phoneNumber of contact.phoneNumbers) {
          if (phoneNumber.number) {
            validPhoneNumbers.push(phoneNumber.number);
          }
        }

        if (!validPhoneNumbers.some(isLifeCellNumber)) {
          continue;
        }

        nextContacts.push({
          firstName: contact.firstName ?? null,
          lastName: contact.lastName ?? null,
          middleName: contact.middleName ?? null,
          phoneNumbers: validPhoneNumbers,
        });
      }

      setContacts(nextContacts);
    }
  }, []);

  useEffect(() => {
    updateContacts();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Контакти з номерами LifeCell:</Text>
          <View style={styles.section}>
            {contacts.map((contact) => (
              <ContactItem
                key={contact.phoneNumbers.join()}
                contact={contact}
              />
            ))}
          </View>
        </View>

        <Button title="Оновити" onPress={updateContacts} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  section: {
    marginBottom: 60,
  },
});

export { ContactsTab };
