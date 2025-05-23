"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, ChangeEvent, useEffect } from "react";
import { useContacts } from "@/store/contactStore";
import { X } from "lucide-react";
import type { Contact } from "@/store/contactStore";
import { toast } from "sonner";
type ContactForm = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  companyName: string;
  companySize: string;
  companyWebsite: string;
  founderName: string;
  role: string;
  industryType: string;
  location: string;
  companyLinkedinUrl: string;
  linkedinProfileUrl: string;
  image: string;
  status: string;
  address: string;
};
export default function AddContactDrawer({
  onClose,
  onSave,
  contact,
}: {
  onClose: () => void;
  onSave: () => Promise<void>;
  contact?: Contact;
}) {
  const addContact = useContacts((s) => s.addContact);
  const updateContact = useContacts((s) => s.updateContact);
  const [form, setForm] = useState<ContactForm>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    companyName: "",
    companySize: "",
    companyWebsite: "",
    founderName: "",
    role: "",
    industryType: "",
    location: "",
    companyLinkedinUrl: "",
    linkedinProfileUrl: "",
    image: "",
    status: "Not Engaged",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "phoneNo",
    "companyName",
    "companySize",
  ];
  const placeholderMap: Record<keyof Omit<ContactForm, "status" | "image">, string> = {
    companyName: "Company Name",
    companySize: "Company Size (e.g., 10-50, 100+, etc.)",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phoneNo: "Phone Number",
    linkedinProfileUrl: "LinkedIn Profile URL",
    role: "Role",
    companyWebsite: "Company Website",
    companyLinkedinUrl: "Company LinkedIn URL",
    founderName: "Founder Name",
    industryType: "Industry Type",
    location: "Company Location",
    address: "Address",
  };
  useEffect(() => {
    if (contact) {
      const [firstName = "", lastName = ""] = (contact.name || "").split(" ");
      setForm({
        firstName,
        lastName,
        email: contact.email || "",
        phoneNo: contact.phoneNo || "",
        companyName: contact.companyName || "",
        companySize: contact.companySize || "",
        companyWebsite: contact.companyWebsite || "",
        founderName: contact.founderName || "",
        role: contact.role || "",
        industryType: contact.industryType || "",
        location: contact.companyLocation || "",
        companyLinkedinUrl: contact.companyLinkedinUrl || "",
        linkedinProfileUrl: contact.linkedinProfileUrl || "",
        image: contact.image || "",
        status: contact.status || "Not Engaged",
        address: contact.address || "",
      });
    }
  }, [contact]);
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isValidType = ["image/jpeg", "image/png"].includes(file.type);
    if (!isValidType) {
      toast.error("Only JPG and PNG images are allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };
  const handleSubmit = async () => {
    // Basic validation
    if (!form.firstName.trim()) {
      toast.error("First Name is required");
      return;
    }
    if (!form.companySize.trim()) {
      toast.error("Company Size is required");
      return;
    }
    // Duplicate check
    const contacts = useContacts.getState().contacts;
    const duplicate = contacts.find(
      (c) =>
        (c.email === form.email || c.phoneNo === form.phoneNo) &&
        c.id !== contact?.id
    );
    if (duplicate) {
      toast.error("Email or Phone Number already exists.");
      return;
    }
    const payload = {
      ...form,
      name: `${form.firstName} ${form.lastName}`.trim(),
      phone: form.phoneNo,
      companyLocation: form.location,
      address: form.address
    };
    try {
      if (contact) {
        await updateContact({
          ...payload,
          id: contact.id,
          createdAt: contact.createdAt,
          activity: contact.activity || [],
        });
        toast.success(`${form.firstName} updated successfully!`);
      } else {
        await addContact(payload);
        toast.success(`${form.firstName} contact added successfully!`);
      }
      await onSave();
      onClose();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong!";
      toast.error(message);
      console.error("Submission error:", err);
    }
  };
  return (
    <div className="fixed top-0 right-0 w-full max-w-[500px] h-full bg-white dark:bg-black z-50 p-6 overflow-y-auto space-y-4 shadow-lg border-l">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {contact ? "Edit Contact" : "Add Contact"}
        </h2>
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {(Object.keys(placeholderMap) as Array<keyof typeof placeholderMap>).map((field) => (
          <div key={field} className="flex flex-col space-y-1 col-span-1">
            <label
              htmlFor={field}
              className="text-sm font-semibold text-gray-700 dark:text-white"
            >
              {placeholderMap[field]}
              {requiredFields.includes(field) && <span className="text-red-500"> *</span>}
            </label>
            {field === "location" ? (
              <select
                id={field}
                name={field}
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 dark:bg-black dark:text-white cursor-pointer"
              >
                <option value="">Select Location</option>
                <option value="USA">USA</option>
                <option value="CANADA">CANADA</option>
                <option value="UAE">UAE</option>
                <option value="INDIA">INDIA</option>
                <option value="EUROPE">EUROPE</option>
              </select>
            ) : (
              <Input
                id={field}
                name={field}
                placeholder={placeholderMap[field]}
                value={form[field]}
                onChange={handleChange}
              />
            )}
            {errors[field] && (
              <span className="text-xs text-red-500">{errors[field]}</span>
            )}
          </div>
        ))}
        <div className="col-span-2 flex flex-col space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-white">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 dark:bg-black dark:text-white cursor-pointer"
          >
            <option value="Not Engaged">Not Engaged</option>
            <option value="Interested">Interested</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Call Later">Call Later</option>
            <option value="No Answer">No Answer</option>
            <option value="Not the Right Contact">Not the Right Contact</option>
          </select>
        </div>
        <div className="col-span-2 flex flex-col space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-white">
            Profile Image (JPG/PNG)
          </label>
          <Input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageUpload}
            className="cursor-pointer"
          />
          {form.image && (
            <img
              src={form.image}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-full border"
            />
          )}
        </div>
      </div>
      <Button onClick={handleSubmit} className="mt-4 w-full cursor-pointer">
        Save
      </Button>
    </div>
  );
}