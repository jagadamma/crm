import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, ChangeEvent, useEffect } from "react";
import { useContacts } from "@/store/contactStore";
import { X } from "lucide-react";
import type { Contact } from "@/store/contactStore";
import { toast } from "sonner";

// Define ContactForm with correct backend field names
type ContactForm = {
  fullName: string;
  email: string;
  phoneNo: string;
  companyname: string;
  companysize: string;
  website: string;
  founder: string;
  role: string;
  industrytype: string;
  location: string;
  companylinkedin: string;
  linkedinprofile: string;
  image: string;
  status: string;
};

export default function AddContactDrawer({
  onClose,
  contact,
}: {
  onClose: () => void;
  contact?: Contact;
}) {
  const addContact = useContacts((s) => s.addContact);
  const updateContact = useContacts((s) => s.updateContact);

  const [form, setForm] = useState<ContactForm>({
    fullName: "",
    email: "",
    phoneNo: "",
    companyname: "",
    companysize: "",
    website: "",
    founder: "",
    role: "",
    industrytype: "",
    location: "",
    companylinkedin: "",
    linkedinprofile: "",
    image: "",
    status: "Not Engaged",
  });

  const placeholderMap: Record<keyof Omit<ContactForm, "status" | "image">, string> = {
    fullName: "Full Name",
    email: "Email Address",
    phoneNo: "Phone Number",
    companyname: "Company Name",
    companysize: "Company Size",
    website: "Company Website",
    founder: "Founder Name",
    role: "Role",
    industrytype: "Industry Type",
    location: "Company Location",
    companylinkedin: "Company LinkedIn URL",
    linkedinprofile: "LinkedIn Profile URL",
  };

  useEffect(() => {
    if (contact) {
      setForm({
        fullName: contact.name || "",
        email: contact.email || "",
        phoneNo: contact.phone || "",
        companyname: contact.companyname || "",
        companysize: contact.companysize || "",
        website: contact.website || "",
        founder: contact.founder || "",
        role: contact.role || "",
        industrytype: contact.industrytype || "",
        location: contact.location || "",
        companylinkedin: contact.companylinkedin || "",
        linkedinprofile: contact.linkedinprofile || "",
        image: contact.image || "",
        status: contact.status || "Not Engaged",
      });
    }
  }, [contact]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    if (!form.fullName.trim()) {
      toast.error("Full Name is required");
      return;
    }

    const payload = {
      ...form,
      name: form.fullName,
      phone: form.phoneNo,
    };

    try {
      if (contact) {
        await updateContact({
          ...payload,
          id: contact.id,
          createdAt: contact.createdAt,
          activity: contact.activity || [],
        });
        toast.success(`${form.fullName} updated successfully!`);
      } else {
        await addContact(payload);
        toast.success(`${form.fullName} contact added successfully!`);
      }
      onClose();
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
          <div key={field} className="flex flex-col space-y-1">
            <label
              htmlFor={field}
              className="text-sm text-left font-semibold text-gray-700 dark:text-white"
            >
              {placeholderMap[field]}
            </label>
            <Input
              id={field}
              name={field}
              placeholder={placeholderMap[field]}
              value={form[field]}
              onChange={handleChange}
            />
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
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
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
