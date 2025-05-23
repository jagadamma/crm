import { useContacts } from "@/store/contactStore";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  getPaginationRowModel,
  type RowSelectionState,
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
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
  Plus,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import type { Contact } from "@/store/contactStore";
import AddContactDrawer from "@/components/AddContactDrawer";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { Checkbox } from "@/components/ui/checkbox";

export default function ContactTable() {
  const {
    contacts,
    fetchContactsFromStore,
    deleteContact,
    deleteMultipleContacts,
    addContact,
  } = useContacts();

  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    const loadContacts = async () => {
      try {
        await fetchContactsFromStore();
      } catch (error) {
        // toast.error("loading  contacts");
        console.error("Fetch contacts error:", error);
      }
    };
    loadContacts();
  }, [fetchContactsFromStore]);

  const filteredContacts = useMemo(() => {
    return contacts
      .filter((c) => {
        const search = searchTerm.toLowerCase();
        return (
          c.name?.toLowerCase().includes(search) ||
          c.email?.toLowerCase().includes(search) ||
          c.companyName?.toLowerCase().includes(search)
        );
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

  const confirmDelete = async () => {
    if (!contactToDelete) return;
    
    try {
      await deleteContact(contactToDelete.id);
      toast.success(`Deleted ${contactToDelete.name}`);
      await fetchContactsFromStore();
    } catch (error) {
      toast.error(" Deleting contact");
      console.error("Delete error:", error);
    } finally {
      setContactToDelete(null);
      setIsDeleteModalOpen(false);
      setRowSelection({});
    }
  };

  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection)
      .filter(id => rowSelection[id])
      .map(rowId => table.getRow(rowId).original.id);

    if (selectedIds.length === 0) {
      toast.error("No contacts selected");
      return;
    }

    try {
      await deleteMultipleContacts(selectedIds);
      toast.success(`Deleted ${selectedIds.length} contacts`);
      await fetchContactsFromStore();
    } catch (error) {
      toast.error("Failed to delete contacts");
      console.error("Bulk delete error:", error);
    } finally {
      setIsBulkDeleteModalOpen(false);
      setRowSelection({});
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<Contact>(worksheet);

      const validContacts = jsonData.filter(c => c.name && c.email);

      if (validContacts.length === 0) {
        toast.error("No valid contacts found");
        return;
      }

      await Promise.all(validContacts.map(contact => 
        addContact({
          name: contact.name,
          email: contact.email,
          phoneNo: contact.phoneNo ?? "",
          companyName: contact.companyName ?? "",
          companySize: contact.companySize ?? "",
          founderName: contact.founderName ?? "",
          companyWebsite: contact.companyWebsite ?? "",
          role: contact.role ?? "",
          industryType: contact.industryType ?? "",
          companyLocation: contact.companyLocation ?? "",
          companyLinkedinUrl: contact.companyLinkedinUrl ?? "",
          linkedinProfileUrl: contact.linkedinProfileUrl ?? "",
          status: contact.status ?? "active",
          image: contact.image,
          address: contact.address,
        })
      ));

      toast.success(`Imported ${validContacts.length} contacts`);
      setImportModalOpen(false);
      setFile(null);
      await fetchContactsFromStore();
    } catch (error) {
      toast.error("Import failed");
      console.error("Import error:", error);
    }
  };

  const columns: ColumnDef<Contact>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-gray-300 dark:border-gray-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
          className="border-gray-300 dark:border-gray-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500"
        />
      ),
      size: 40,
    },
    {
      header: "Contact Person",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-white">
          {row.original.image && (
            <img
              src={row.original.image}
              className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600"
              alt={row.original.name}
            />
          )}
          <span>{row.original.name}</span>
        </div>
      ),
    },
    { 
      header: "Company", 
      accessorKey: "companyName",
      cell: ({ row }) => <span className="text-gray-600 dark:text-gray-300">{row.original.companyName}</span>
    },
    { 
      header: "Location", 
      accessorKey: "companyLocation",
      cell: ({ row }) => <span className="text-gray-600 dark:text-gray-300">{row.original.companyLocation}</span>
    },
    { 
      header: "Industry", 
      accessorKey: "industryType",
      cell: ({ row }) => <span className="text-gray-600 dark:text-gray-300">{row.original.industryType}</span>
    },
    { 
      header: "Size", 
      accessorKey: "companySize",
      cell: ({ row }) => <span className="text-gray-600 dark:text-gray-300">{row.original.companySize}</span>
    },
    { 
      header: "Email", 
      accessorKey: "email",
      cell: ({ row }) => <span className="text-gray-600 dark:text-gray-300">{row.original.email}</span>
    },
    { 
      header: "Phone", 
      accessorKey: "phoneNo",
      cell: ({ row }) => <span className="text-gray-600 dark:text-gray-300">{row.original.phoneNo}</span>
    },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-xs ${
          row.original.status === "active" 
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
        }`}>
          {row.original.status}
        </span>
      ),
      size: 120,
    },
    {
      header: "Action",
      id: "actions",
      cell: ({ row }) => {
        const contact = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end"
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/contacts/${contact.id}/view`);
                }}
                className="text-blue-600 cursor-pointer hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700"
              >
                <Eye className="w-4 h-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingContact(contact);
                  setDrawerOpen(true);
                }}
                className="text-amber-600 cursor-pointer hover:bg-gray-100 dark:text-amber-400 dark:hover:bg-gray-700"
              >
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(contact);
                }}
                className="text-red-600 cursor-pointer hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete
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
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    getRowId: (row) => row.id,
  });

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header and controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Contacts</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] cursor-pointer bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              <SelectItem value="name" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white">
                Name
              </SelectItem>
              <SelectItem value="createdAt" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white">
                Date
              </SelectItem>
              <SelectItem value="companyName" className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white">
                Company
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setImportModalOpen(true)}
            className="gap-2 cursor-pointer border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Upload className="w-4 h-4" /> Import
          </Button>
          <Button
            onClick={() => {
              setEditingContact(undefined);
              setDrawerOpen(true);
            }}
            className="gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" /> Add Contact
          </Button>
        </div>
      </div>

      {/* Selection bar */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
            {selectedCount} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsBulkDeleteModalOpen(true)}
            className="cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Delete Selected
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800 text-center">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200 dark:border-gray-700">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => navigate(`/contacts/${row.original.id}/view`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300"
                      onClick={(e) => {
                        if (
                          cell.column.id === "select" ||
                          cell.column.id === "actions"
                        ) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <Package className="w-12 h-12 mb-2 text-gray-400 dark:text-gray-500" />
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-300">No contacts found</p>
                    <p className="text-sm">
                      {searchTerm ? "Try a different search" : "Add your first contact"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="cursor-pointer border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="cursor-pointer border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Total: {filteredContacts.length} contacts
          </span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px] cursor-pointer bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white">
              <SelectValue placeholder={table.getState().pagination.pageSize}/>
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem 
                  key={size} 
                  value={`${size}`} 
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
            await fetchContactsFromStore();
            setDrawerOpen(false);
            setEditingContact(undefined);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-white">Delete Contact</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-800 dark:text-white">{contactToDelete?.name}</span>?
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
              className="cursor-pointer border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              className="cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog open={isBulkDeleteModalOpen} onOpenChange={setIsBulkDeleteModalOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-white">Delete {selectedCount} Contacts</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 dark:text-gray-300">This action cannot be undone. Are you sure?</p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsBulkDeleteModalOpen(false)}
              className="cursor-pointer border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleBulkDelete}
              className="cursor-pointer bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-white">Import Contacts</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <Input 
              type="file" 
              accept=".csv,.xlsx,.xls" 
              onChange={handleFileChange}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supported formats: CSV, Excel. Required fields: Name, Email.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setImportModalOpen(false)}
              className="cursor-pointer border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleImport} 
              disabled={!file}
              className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}