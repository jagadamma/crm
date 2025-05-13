import { useContacts } from "@/store/contactStore";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Contact } from "@/store/contactStore";
import AddContactDrawer from "@/components/AddContactDrawer";

export default function ContactTable() {
  const deleteContact = useContacts((state) => state.deleteContact);
  const contacts = useContacts((s) => s.contacts);
  const fetchContactsFromStore = useContacts((state) => state.fetchContacts);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchContactsFromStore();
        console.log("✅ Contacts fetched from store:", useContacts.getState().contacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast.error("Failed to load contacts.");
      }
    };
    fetchData();
  }, [fetchContactsFromStore]);

  const filteredContacts = useMemo(() => {
    if (!Array.isArray(contacts)) return [];
    return contacts
      .filter((c) => {
        const nameMatch = c.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const createdAtMatch = c.createdAt?.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || createdAtMatch;
      })
      .sort((a, b) => {
        const aVal = a[sortBy as keyof Contact];
        const bVal = b[sortBy as keyof Contact];
        return String(aVal ?? "").localeCompare(String(bVal ?? ""));
      });
  }, [contacts, searchTerm, sortBy]);

  const handleDeleteClick = (contact: Contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      deleteContact(contactToDelete.id);
      toast.success(`${contactToDelete.name} deleted successfully`);
      setContactToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const columns: ColumnDef<Contact>[] = [
    {
      header: "Contact Person",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-bold">
          {row.original.image && (
            <img
              src={row.original.image}
              className="w-8 h-8 rounded-full object-cover"
              alt={row.original.name}
            />
          )}
          <span className="uppercase">{row.original.name}</span>
        </div>
      ),
    },
    { header: "Email", accessorKey: "email" },
    { header: "Company", accessorKey: "companyName" },
    { header: "Phone", accessorKey: "phone" },
    { header: "Size", accessorKey: "companySize" },
    { header: "Website", accessorKey: "companyWebsite" },
    { header: "Founder", accessorKey: "founderName" },
    { header: "Role", accessorKey: "role" },
    { header: "Industry", accessorKey: "industryType" },
    { header: "Location", accessorKey: "companyLocation" },
    { header: "Linkedin", accessorKey: "companyLinkedinUrl" },
    { header: "Profile", accessorKey: "linkedinProfileUrl" },
    { header: "Status", accessorKey: "status" },

    { header: "Created", accessorKey: "createdAt" },
    {
      header: "Action",
      id: "actions",
      cell: ({ row }) => {
        const contact = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => toast(`Previewing ${contact.name}`)}>
                <Eye className="w-4 h-4 mr-2 text-blue-500" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditingContact(contact);
                  setDrawerOpen(true);
                }}
              >
                <Pencil className="w-4 h-4 mr-2 text-purple-500" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteClick(contact)}>
                <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredContacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Contacts</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="createdAt">Date</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setDrawerOpen(true)} className="bg-green-600 hover:bg-green-700">
            Add Contact
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-100 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Drawer */}
     {drawerOpen && (
  <AddContactDrawer
    contact={editingContact}
    onClose={() => {
      setDrawerOpen(false);
      setEditingContact(undefined);
    }}
    onSave={async () => {
      await fetchContactsFromStore(); // ✅ This will refresh the contact list
      setDrawerOpen(false);
      setEditingContact(undefined);
    }}
  />
)}


      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="w-80">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Do you really want to delete{" "}
              <span className="font-semibold text-black">{contactToDelete?.name}</span>?
            </p>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
