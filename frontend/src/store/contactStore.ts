import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// Contact type
export interface Contact {
  id: string;
  name: string;
  email: string;
  phoneNo: string;
  companyName: string;
  companySize: string;
  founderName: string;
  companyWebsite: string;
  role: string;
  industryType: string;
  companyLocation: string;
  companyLinkedinUrl: string;
  linkedinProfileUrl: string;
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

const API = `api/contacts`;

export const useContacts = create<ContactStore>()(
  persist(
    (set, _get) => ({
      contacts: [],

      fetchContacts: async () => {
        try {
          const res = await axios.get(`${API}/getall`);
          const rawContacts = res.data.contacts || [];

          const formattedContacts: Contact[] = rawContacts.map((c: any) => ({
            id: c.id.toString(),
            name: `${c.firstName} ${c.lastName}`,
            email: c.email ?? "",
            phoneNo: c.phoneNo ?? "",
            companyName: c.companyName ?? "",
            companySize: c.companySize ?? "",
            founderName: c.founderName ?? "",
            companyWebsite: c.companyWebsite ?? "",
            role: c.role ?? "",
            industryType: c.industryType ?? "",
            companyLocation: c.companyLocation ?? "",
            companyLinkedinUrl: c.companyLinkedinUrl ?? "",
            linkedinProfileUrl: c.linkedinProfileUrl ?? "",
            status: c.status ?? "active",
            createdAt: new Date(c.createdAt).toLocaleDateString(),
            activity: c.activity ?? [],
            image: c.image ?? undefined,
          }));

          set({ contacts: formattedContacts });
        } catch (error) {
          console.error("Failed to fetch contacts:", error);
        }
      },

      addContact: async (contact) => {
        try {
          const [firstName, ...rest] = contact.name.trim().split(" ");
          const lastName = rest.join(" ");

          const payload = {
            ...contact,
            firstName,
            lastName,
            phoneNo: contact.phoneNo,
          };

          delete (payload as any).name;
          delete (payload as any).phone;

          const res = await axios.post(`${API}/create`, payload);

          const newContact: Contact = {
            id: res.data.id.toString(),
            name: `${firstName} ${lastName}`,
            email: contact.email,
            phoneNo: contact.phoneNo,
            companyName: contact.companyName,
            companySize: contact.companySize,
            founderName: contact.founderName,
            companyWebsite: contact.companyWebsite,
            role: contact.role,
            industryType: contact.industryType,
            companyLocation: contact.companyLocation,
            companyLinkedinUrl: contact.companyLinkedinUrl,
            linkedinProfileUrl: contact.linkedinProfileUrl,
            status: contact.status,
            createdAt: new Date().toLocaleDateString(),
            activity: ["Contact created"],
            image: contact.image,
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
          const {
            id,
            name,
            email,
            phoneNo,
            companyName,
            companySize,
            founderName,
            companyWebsite,
            role,
            industryType,
            companyLocation,
            companyLinkedinUrl,
            linkedinProfileUrl,
            status,
            image,
          } = contact;

          const [firstName, ...rest] = name.trim().split(" ");
          const lastName = rest.join(" ");

          const payload = {
            firstName,
            lastName,
            email,
            phoneNo: phoneNo,
            companyName,
            companySize,
            founderName,
            companyWebsite,
            role,
            industryType,
            companyLocation,
            companyLinkedinUrl,
            linkedinProfileUrl,
            status,
            image,
          };

          await axios.put(`${API}/edit/${id}`, payload);

          const updatedContact: Contact = {
            ...contact,
            ...payload,
            name: `${firstName} ${lastName}`,
            phoneNo: phoneNo,
            activity: contact.activity
              ? [...contact.activity, "Contact updated"]
              : ["Contact updated"],
          };

          set((state) => ({
            contacts: state.contacts.map((c) =>
              c.id === id ? updatedContact : c
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
