import { addContact } from "./services/contactsServices.js";

async function testAddContact() {
  try {
    const newContact = await addContact({
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
    });
    console.log("New contact added:", newContact);
  } catch (error) {
    console.error("Error adding contact:", error);
  }
}

testAddContact();
