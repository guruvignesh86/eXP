import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-4">
      <Lock size={60} className="text-gray-500 mb-4" />
      <h1 className="text-2xl font-semibold text-gray-800">Access Restricted</h1>
      <p className="text-gray-600 max-w-md mt-2">
        You don’t have permission to view this link, or the link may not be
        available. Please contact the owner and ask to invite you, or switch
        accounts.
      </p>
      <Link to="/">
      <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">

      Click Here

      </button>
      </Link>
    </div>
  );
};

export default AccessDenied;
