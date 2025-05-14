// src/pages/ContactDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useContacts } from "@/store/contactStore";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useActivityStore } from "@/store/activityStore";

const ContactPersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = useContacts((state) =>
    state.contacts.find((c) => c.id === id)
  );

  const [type, setType] = useState("");
  const [text, setText] = useState("");

  const { addActivity, getActivitiesByContact, deleteActivity } = useActivityStore();

  const handleAddActivity = () => {
    if (!type || !text.trim()) return;
    addActivity({ contactId: id!, type, text });
    setText("");
  };

  if (!contact) {
    return <div className="p-6 text-center text-red-500">Contact not found</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Contact Info */}
      <Card className="flex flex-col md:flex-row gap-6 p-6 items-center">
        <img
          src={contact.image || "https://via.placeholder.com/150"}
          alt={contact.name}
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-bold">{contact.name}</h2>
          <p className="text-sm text-gray-600 dark:text-white">{contact.email}</p>
          <p className="text-sm text-gray-600 dark:text-white">{contact.phoneNo}</p>
          <Badge className="mt-2 capitalize">{contact.status}</Badge>
        </div>
      </Card>

      {/* Company Details */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-xl font-semibold">Company Details</h3>
          <Separator />
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-white">
            <p><strong>Company Name:</strong> {contact.companyName || "N/A"}</p>
            <p><strong>Company Size:</strong> {contact.companySize || "N/A"}</p>
            <p><strong>Founder:</strong> {contact.founderName || "N/A"}</p>
            <p><strong>Role:</strong> {contact.role || "N/A"}</p>
            <p><strong>Industry:</strong> {contact.industryType || "N/A"}</p>
            <p><strong>Location:</strong> {contact.companyLocation ? contact.companyLocation : "N/A"}</p>
            <p>
              <strong>Website:</strong>{" "}
              {contact.companyWebsite ? (
                <a href={contact.companyWebsite} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {contact.companyWebsite}
                </a>
              ) : "N/A"}
            </p>
            <p>
              <strong>Company LinkedIn:</strong>{" "}
              {contact.companyLinkedinUrl ? (
                <a href={contact.companyLinkedinUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {contact.companyLinkedinUrl}
                </a>
              ) : "N/A"}
            </p>
            <p>
              <strong>Profile LinkedIn:</strong>{" "}
              {contact.linkedinProfileUrl ? (
                <a href={contact.linkedinProfileUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {contact.linkedinProfileUrl}
                </a>
              ) : "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Select onValueChange={(val) => setType(val)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="message">Message</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Activity details"
              className="flex-grow"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button onClick={handleAddActivity}>Add</Button>
          </div>

          {/* Activity List */}
          {getActivitiesByContact(id!).length > 0 ? (
            getActivitiesByContact(id!).map((act) => (
              <div
                key={act.id}
                className="bg-gray-100 p-3 rounded text-sm flex justify-between items-start gap-3"
              >
                <div>
                  <p>
                    <Badge variant="outline" className="capitalize mr-2">{act.type}</Badge>
                    {act.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{act.date}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => deleteActivity(act.id)}
                >
                  🗑
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No activities yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="text-right">
        <Button variant="outline" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>
    </div>
  );
};

export default ContactPersonDetails;
