import { useContacts } from "@/store/contactStore";

const Leads = () => {
  const contacts = useContacts((state) => state.contacts);
  const interestedLeads = contacts.filter((contact) => contact.status === "Interested");

  return (
    <div className="p-6 max-w-full overflow-x-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Interested Leads</h1>

      {interestedLeads.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No interested leads yet.</p>
      ) : (
        <table className="min-w-[1200px] w-full text-sm border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-left">
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
              <th className="px-4 py-3">Profile</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700">
            {interestedLeads.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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
                <td className="px-4 py-3">{contact.phone || "-"}</td>
                <td className="px-4 py-3">{contact.companyName || "-"}</td>
                <td className="px-4 py-3">{contact.companySize || "-"}</td>
                <td className="px-4 py-3">
                  {contact.companyWebsite ? (
                    <a
                      href={contact.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
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
                      className="text-blue-600 hover:underline"
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
                      className="text-blue-600 hover:underline"
                    >
                      Profile
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leads;
