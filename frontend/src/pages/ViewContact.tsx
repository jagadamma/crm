import { useParams, useNavigate } from "react-router-dom";
import { useContacts } from "@/store/contactStore";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft } from "lucide-react";

export default function ViewContact() {
  const { id } = useParams();
  const navigate = useNavigate();

  const contact = useContacts((s) => s.contacts.find((c) => c.id === id));

  if (!id) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">Invalid Contact ID</h2>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">Contact not found</h2>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="mt-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
      </div>
    );
  }

  // Helper functions
  const formatUrl = (url: string | undefined) => {
    if (!url) return "";
    if (!url.startsWith('http')) return `https://${url}`;
    return url.replace('inkedin.com', 'linkedin.com');
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-4xl relative shadow-lg animate-fade-in">
        {/* Close Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </Button>

        <CardContent className="p-6 space-y-8">
          {/* Profile Section */}
          <div className="flex items-center gap-4 mb-6">
            {/* Profile Image */}
            <img
              src={contact.image || "/default-avatar.png"}
              onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
              alt={`Profile of ${contact.name}`}
              className="w-20 h-20  rounded-full border border-gray-300 shadow-sm"
            />

            {/* Name and Info */}
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-gray-800">
                {contact.name}
              </h2>
              <div className="flex items-center gap-2 text-md text-gray-600">
                <span className="font-medium">{contact.role}</span>
                <Badge 
                  variant={contact.status === "Inactive" ? "destructive" : "outline"} 
                  className="text-xs px-2 py-0.5"
                >
                  {contact.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="Email" value={contact.email} />
              <Info label="Phone Number" value={contact.phoneNo} />
              <Info label="Founder Name" value={contact.founderName || "N/A"} />
              <Info
                label="LinkedIn Profile"
                value={formatUrl(contact.linkedinProfileUrl)}
                isLink
              />
              <Info
                label="Created At"
                value={formatDate(contact.createdAt)}
              />
            </div>

            <h3 className="text-lg font-semibold border-b pb-2 mt-6">
              Company Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Info label="Company Name" value={contact.companyName || "N/A"} />
              <Info label="Company Size" value={contact.companySize || "N/A"} />
              <Info 
                label="Company Website" 
                value={formatUrl(contact.companyWebsite)} 
                isLink 
              />
              <Info label="Industry Type" value={contact.industryType || "N/A"} />
              <Info label="Company Location" value={contact.companyLocation || "N/A"} />
              <Info
                label="Company LinkedIn"
                value={formatUrl(contact.companyLinkedinUrl)}
                isLink
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Info({
  label,
  value,
  isLink = false,
}: {
  label: string;
  value?: string | number;
  isLink?: boolean;
}) {
  const displayValue = String(value ?? "").trim();
  if (!displayValue || displayValue === "N/A") return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 border-b py-2">
      <p className="text-sm font-medium text-gray-600 w-full sm:w-1/3">
        {label}
      </p>
      <div className="text-sm text-gray-900 w-full sm:w-2/3 text-left sm:text-right break-words">
        {isLink ? (
          <a
            href={displayValue}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {displayValue}
          </a>
        ) : (
          displayValue
        )}
      </div>
    </div>
  );
}