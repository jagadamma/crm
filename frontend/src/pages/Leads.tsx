import { useState } from "react";
import { useContacts } from "@/store/contactStore";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Leads = () => {
  const contacts = useContacts((state) => state.contacts);
  const interestedLeads = contacts.filter(
    (contact) => contact.status === "Interested"
  );
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
  // Calculate pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = interestedLeads.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(interestedLeads.length / recordsPerPage);

  // Change page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-6 max-w-full overflow-x-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Interested Leads
      </h1>

      <table className="min-w-[1200px] w-full text-sm border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg overflow-hidden mb-4">
        <thead className="bg-gray-100 dark:bg-gray-800 text-center">
          <tr>
            <th className="px-4 py-3">Image</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone No</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Website</th>
            <th className="px-4 py-3">Founder</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Industry</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Company LinkedIn</th>
            <th className="px-4 py-3">LinkedIn Profile</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700">
          {currentRecords.length === 0 ? (
            <tr>
              <td colSpan={13} className="py-10">
                <div className="flex flex-col items-center justify-center text-center text-gray-500">
                  <Package size={48} className="text-indigo-500 mb-2" />{" "}
                  <span className="text-lg font-medium">
                    No interested leads yet
                  </span>      
                </div>
              </td>
            </tr>
          ) : (
            currentRecords.map((contact) => (
              <tr
                key={contact.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                <td className="px-4 py-3">
                  {contact.image ? (
                    <img
                      src={contact.image}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
                  )}
                </td>
                <td className="px-4 py-3">{contact.name || "-"}</td>
                <td className="px-4 py-3">{contact.email || "-"}</td>
                <td className="px-4 py-3">{contact.phoneNo || "-"}</td>
                <td className="px-4 py-3">{contact.companyName || "-"}</td>
                <td className="px-4 py-3">{contact.companySize || "-"}</td>
                <td className="px-4 py-3">
                  {contact.companyWebsite ? (
                    <a
                      href={contact.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Website
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3">{contact.founderName || "-"}</td>
                <td className="px-4 py-3">{contact.role || "-"}</td>
                <td className="px-4 py-3">{contact.industryType || "-"}</td>
                <td className="px-4 py-3">{contact.companyLocation || "-"}</td>
                <td className="px-4 py-3">
                  {contact.companyLinkedinUrl ? (
                    <a
                      href={contact.companyLinkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      LinkedIn
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3">
                  {contact.linkedinProfileUrl ? (
                    <a
                      href={contact.linkedinProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline cursor-pointer"
                    >
                      Profile
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={currentPage === 1}
            className="cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Total: {interestedLeads.length} records
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Show</span>
            <Select
              value={`${recordsPerPage}`}
              onValueChange={(value) => {
                setRecordsPerPage(Number(value));
                setCurrentPage(1); // Reset to first page when changing page size
              }}
            >
              <SelectTrigger className="h-8 w-[70px] cursor-pointer">
                <SelectValue placeholder={recordsPerPage} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={`${pageSize}`}
                    className="cursor-pointer"
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Leads;