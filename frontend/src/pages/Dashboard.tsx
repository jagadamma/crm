// src/pages/Dashboard.jsx
import { Boxes } from "lucide-react"; // Icon import

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow flex flex-col items-center justify-center text-center text-gray-600 dark:text-gray-300">
        <Boxes size={48} className="text-indigo-500 mb-4" /> {/* Colorful icon */}
        <p className="text-lg font-medium">Dashboard coming soon...</p>
      </div>
    </div>
  );
};

export default Dashboard;
