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
};

export default function AddContactDrawer({
  onClose,
  onSave, // ✅ New prop
  contact,
}: {
  onClose: () => void;
  onSave: () => void; // ✅ New prop
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
  });

  const placeholderMap: Record<keyof Omit<ContactForm, "status" | "image">, string> = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phoneNo: "Phone Number",
    companyName: "Company Name",
    companySize: "Company Size",
    companyWebsite: "Company Website",
    founderName: "Founder Name",
    role: "Role",
    industryType: "Industry Type",
    location: "Company Location",
    companyLinkedinUrl: "Company LinkedIn URL",
    linkedinProfileUrl: "LinkedIn Profile URL",
  };

  useEffect(() => {
    if (contact) {
      const [firstName = "", lastName = ""] = (contact.name || "").split(" ");

      setForm({
        firstName,
        lastName,
        email: contact.email || "",
        phoneNo: contact.phone || "",
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
      });
    }
  }, [contact]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
  if (!form.firstName.trim()) {
    toast.error("First Name is required");
    return;
  }

  const payload = {
    ...form,
    name: `${form.firstName} ${form.lastName}`.trim(),
    phone: form.phoneNo,
    companyLocation: form.location,
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

    onSave(); // ✅ Notify parent to refresh list
    onClose(); // ✅ Close drawer
  } catch (err) {
    toast.error("Something went wrong!");
    console.error("Submission error:", err);
  }
};

  return (
    <div className="fixed top-0 right-0 w-full max-w-[500px] h-full bg-white dark:bg-black z-50 p-6 overflow-y-auto space-y-4 shadow-lg border-l">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {contact ? "Edit Contact" : "Add Contact"}
        </h2>
        <button onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(Object.keys(placeholderMap) as Array<keyof typeof placeholderMap>).map((field) => (
          <div key={field} className="flex flex-col space-y-1 col-span-1">
            <label
              htmlFor={field}
              className="text-sm text-left font-semibold text-gray-700 dark:text-white"
            >
              {placeholderMap[field]}
            </label>

            {field === "location" ? (
              <select
                id={field}
                name={field}
                value={form.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 dark:bg-black dark:text-white"
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
          </div>
        ))}

        <div className="col-span-2 flex flex-col space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-white">
            Profile Image (JPG/PNG)
          </label>
          <Input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageUpload}
          />
          {form.image && (
            <img
              src={form.image}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded-full border"
            />
          )}
        </div>

        <div className="col-span-2 flex flex-col space-y-1">
          <label className="text-sm font-semibold text-gray-700 dark:text-white">
            Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 dark:bg-black dark:text-white"
          >
            <option value="Not Engaged">Not Engaged</option>
            <option value="Interested">Interested</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Call Later">Call Later</option>
            <option value="No Answer">No Answer</option>
            <option value="Not the Right Contact">Not the Right Contact</option>
          </select>
        </div>
      </div>

      <Button onClick={handleSubmit} className="mt-4 w-full">
        Save
      </Button>
    </div>
  );
}
