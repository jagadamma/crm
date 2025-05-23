import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

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
  address?: string;
}

interface ContactStore {
  contacts: Contact[];
  fetchContactsFromStore: () => Promise<void>;
  addContact: (contact: Omit<Contact, "id" | "createdAt" | "activity">) => Promise<void>;
  updateContact: (contact: Contact) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  deleteMultipleContacts: (ids: string[]) => Promise<void>;
  getContactById: (id: string) => Promise<Contact | undefined>;
  addActivityToContact: (id: string, activity: string) => Promise<void>;
}

const API = `api/contacts`;

export const useContacts = create<ContactStore>()(
  persist(
    (set, get) => ({
      contacts: [],

      fetchContactsFromStore: async () => {
        try {
          const res = await axios.get(`${API}/getall`);
          const rawContacts = (res.data.contacts as Array<{
            id: string | number;
            firstName: string;
            lastName: string;
            email?: string;
            phoneNo?: string;
            companyName?: string;
            companySize?: string;
            founderName?: string;
            companyWebsite?: string;
            role?: string;
            industryType?: string;
            companyLocation?: string;
            companyLinkedinUrl?: string;
            linkedinProfileUrl?: string;
            status?: string;
            createdAt: string;
            activity?: string[];
            image?: string;
            address?: string;
          }>) || [];

          const formattedContacts: Contact[] = rawContacts.map((c) => ({
            id: c.id.toString(),
            name: `${c.firstName} ${c.lastName}`.trim(),
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
            address: c.address ?? "",
          }));

          set({ contacts: formattedContacts });
        } catch (error) {
          console.error("Failed to fetch contacts:", error);
          throw error;
        }
      },

      addContact: async (contact) => {
        try {
          const [firstName, ...rest] = contact.name.trim().split(" ");
          const lastName = rest.join(" ");

          const existingContacts = get().contacts;

          const isDuplicate = existingContacts.some(
            (c) =>
              c.email.toLowerCase() === contact.email.toLowerCase() ||
              c.phoneNo === contact.phoneNo
          );

          if (isDuplicate) {
            throw new Error("Duplicate contact detected");
          }

          const payload = {
            firstName,
            lastName,
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
            image: contact.image,
            address: contact.address,
          };


          // ✅ Token ghe ani headers madhe lav
          const token = localStorage.getItem('accessToken');
          console.log("Token:", token);

          const res = await axios.post(`${API}/create`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

          const newContact: Contact = {
            id: res?.data?.id?.toString() || Date.now().toString(),
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
            address: contact.address,
          };

          set((state) => ({
            contacts: [...state.contacts, newContact],
          }));
        } catch (error) {
          console.error("Failed to add contact:", error);
          throw error;
        }
      },

      updateContact: async (contact) => {
        try {
          const [firstName, ...rest] = contact.name.trim().split(" ");
          const lastName = rest.join(" ");

          const payload = {
            firstName,
            lastName,
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
            image: contact.image,
            address: contact.address,
          };

          await axios.put(`${API}/edit/${contact.id}`, payload);

          const updatedContact: Contact = {
            ...contact,
            ...payload,
            name: `${firstName} ${lastName}`,
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
          throw error;
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
          throw error;
        }
      },

      deleteMultipleContacts: async (ids) => {
        try {
          await Promise.all(ids.map(id => axios.delete(`${API}/delete/${id}`)));
          set((state) => ({
            contacts: state.contacts.filter((contact) => !ids.includes(contact.id)),
          }));
        } catch (error) { 
          console.error("Failed to delete multiple contacts:", error);
          throw error;
        }
      },

      getContactById: async (id) => {
        try {
          const res = await axios.get(`${API}/get/${id}`);
          const contact = res.data;
          
          return {
            ...contact,
            id: contact.id.toString(),
            name: `${contact.firstName} ${contact.lastName}`.trim(),
            createdAt: new Date(contact.createdAt).toLocaleDateString(),
            address: contact.address ?? "",
          };
        } catch (error) {
          console.error(`Failed to fetch contact with ID ${id}:`, error);
          throw error;
        }
      },

      addActivityToContact: async (id, newActivity) => {
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
          throw error;
        }
      },
    }),
    {
      name: "crm-contacts",
    }
  )
);