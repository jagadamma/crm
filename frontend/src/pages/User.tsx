import { UserCircle } from "lucide-react"; // Import a nice user-related icon

const User = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow flex flex-col items-center justify-center text-center">
        <UserCircle size={60} className="text-indigo-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
          User section coming soon...
        </p>
      </div>
    </div>
  );
};

export default User;
