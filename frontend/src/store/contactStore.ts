import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// Contact type
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyname: string;
  companysize: string;
  founder: string;
  website: string;
  role: string;
  industrytype: string;
  location: string;
  companylinkedin: string;
  linkedinprofile: string;
  status: string;
  image?: string;
  createdAt: string;
  activity?: string[];
}

// Store type
interface ContactStore {
  contacts: Contact[];
  fetchContacts: () => Promise<void>;
  addContact: (
    contact: Omit<Contact, "id" | "createdAt" | "activity">
  ) => Promise<void>;
  updateContact: (contact: Contact) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  getContactById: (id: string) => Promise<Contact | undefined>;
  addActivityToContact: (id: string, activity: string) => Promise<void>;
}

const API = `${process.env.REACT_APP_BASE_API_URL}api/contacts`;

export const useContacts = create<ContactStore>()(
  persist(
    (set, _get) => ({
      contacts: [],

      fetchContacts: async () => {
        try {
          const res = await axios.get(`${API}/getall`);
          console.log("📦 API Response:", res.data);
          set({ contacts: Array.isArray(res.data) ? res.data : [] });
        } catch (error) {
          console.error("Failed to fetch contacts:", error);
        }
      },

      addContact: async (contact) => {
        try {
          console.log('Sending contact data:', contact); // Log contact data
          const res = await axios.post(`${API}/create`, contact);
          const newContact = {
            ...res.data,
            activity: ["Contact created"],
          };
          set((state) => ({
            contacts: [...state.contacts, newContact],
          }));
        } catch (error) {
          console.error("Failed to add contact:", error);
        }
      },


      updateContact: async (contact) => {
        try {
          const res = await axios.put(`${API}/edit/${contact.id}`, contact);
          const updatedContact: Contact = {
            ...res.data,
            activity: contact.activity
              ? [...contact.activity, "Contact updated"]
              : ["Contact updated"],
          };
          set((state) => ({
            contacts: state.contacts.map((c) =>
              c.id === contact.id ? updatedContact : c
            ),
          }));
        } catch (error) {
          console.error("Failed to update contact:", error);
        }
      },

      deleteContact: async (id) => {
        try {
          await axios.delete(`${API}/delete/${id}`);
          set((state) => ({
            contacts: state.contacts.filter((c) => c.id !== id),
          }));
        } catch (error) {
          console.error("Failed to delete contact:", error);
        }
      },

      getContactById: async (id: string) => {
        try {
          const res = await axios.get(`${API}/get/${id}`);
          return res.data;
        } catch (error) {
          console.error(`Failed to fetch contact with ID ${id}:`, error);
          return undefined;
        }
      },

      addActivityToContact: async (id: string, newActivity: string) => {
        try {
          await axios.post(`${API}/${id}/activity`, { activity: newActivity });

          // Update state
          set((state) => ({
            contacts: state.contacts.map((contact) =>
              contact.id === id
                ? {
                  ...contact,
                  activity: [...(contact.activity || []), newActivity],
                }
                : contact
            ),
          }));
        } catch (error) {
          console.error(`Failed to add activity to contact ${id}:`, error);
        }
      },
    }),
    {
      name: "crm-contacts", // localStorage key
    }
  )
);
