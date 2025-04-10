import { useState, useEffect,useRef  } from "react";
import axios from "axios";
import ExpenseChart from "../Chart/ExpenseChart";
import { FaTrash,FaEdit } from "react-icons/fa";
import { Listbox } from '@headlessui/react'
import { Menu,X,LogOut,FileText,Download,Airplay,NotepadText,ChartPie,Plus,FileSpreadsheet,FileHeart, Import,SquareChevronDown } from "lucide-react";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";

import { useAuth } from "../Routings/Authentic";

 import ExpenseChartF from "../Chart/FinanceChart";
 import Swal from "sweetalert2";
 import * as XLSX from "xlsx";
 import DataTable from "react-data-table-component";
 import { motion ,AnimatePresence } from "framer-motion";


const ExpenseTracker = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMoved, setIsMoved] = useState(false);

  const [position, setPosition] = useState(4);
  const [filterText] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [activeTab, setActiveTab] = useState("chart");
  const [sortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const [editingExpense, setEditingExpense] = useState(null);
      const [isOpen, setIsOpen] = useState(false);
      const [iOpen, setIOpen] = useState(false);
   

       const { logout } = useAuth();
      


       useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth >= 1024) {
            setDropdownOpen(false);
          }
        };
      
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);
   


      const toggleSidebar = () => {
        setPosition((prev) => (prev === 4 ? 24 : 4)); // Toggle position
        setIsOpen(!isOpen);
        setIsMoved(!isMoved);
      };

      const sidebarRef = useRef(null);
const buttonRef = useRef(null); // ← Add this line

useEffect(() => {
  const handleClickOutside = (event) => {
    const isMobile = window.innerWidth < 768;

    if (
      isMobile &&
      isOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target) // ← Check if click is NOT on button
    ) {
      // Close sidebar on outside click (only on mobile)
      setPosition(4);
      setIsOpen(false);
      setIsMoved(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isOpen]);
    
      const scrollContainerRef = useRef(null);

      useEffect(() => {
        const handleResize = () => {
          const container = scrollContainerRef.current;
          if (container) {
            if (window.innerWidth < 500) {
              container.style.overflowX = 'auto';
            } else {
              container.style.overflowX = 'hidden';
            }
          }
        };
    
        // Set on mount and on resize
        handleResize(); 
        window.addEventListener('resize', handleResize);
    
        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
      


      const Logout = () => {
        Swal.fire({
          title: "Are you sure?",
          text: "You will be logged out!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, logout!",
        }).then((result) => {
          if (result.isConfirmed) {
            logout();
            localStorage.clear(); // Clear authentication state
            sessionStorage.clear();
            caches.keys().then((names) => {
              names.forEach((name) => caches.delete(name));
            });
      
            Swal.fire("Logged Out!", "You have been logged out.", "success").then(
              () => {
                // Prevent forward/back navigation
                window.location.replace("/"); // Hard redirect to clear history
              }
            );
          }
        });
      };
      
      
      

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "RENT",
    date: new Date().toISOString().split("T")[0],
    payment_type: "CASH" // Default value
  });

  useEffect(() => {
    fetchExpenses();
  }, [selectedMonth]);





  const fetchExpenses = async () => {       //making function as async
    try {    //try and catch statement used to prevent from error
      const response = await axios.get(`http://127.0.0.1:5000/expenses?month=${selectedMonth}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };



  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate an API call or actual expense addition logic
    setTimeout(() => {
      setSuccessMessage("Expense added successfully!");
      
      // Hide the message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 500);
    try {
      await axios.post("http://127.0.0.1:5000/expenses", formData);
      fetchExpenses();
      setFormData({
        name: "",
        amount: "",
        category: "RENT",
        date: new Date().toISOString().split("T")[0],
        payment_type: "UPI",
      });
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };



  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:5000/expenses/${id}`);
          fetchExpenses();
          Swal.fire("Deleted!", "The expense has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting expense:", error);
          Swal.fire("Error!", "Failed to delete the expense.", "error");
        }
      }
    });
  };
  const uniqueYears = [...new Set(expenses.map(exp => new Date(exp.date).getFullYear()))].sort((a, b) => b - a);

const handleSubmits = async (e) => {
  e.preventDefault();

  try {
    
    await axios.post("http://127.0.0.1:5000/expenses", formData);
    

    Swal.fire({
      title: "Success!",
      text: "Expense added successfully!",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {

      setIOpen(false);
    });;


    setFormData({
      name: "",
      amount: "",
      category: "RENT",
      date: "",
      payment_type: "UPI",
    });

    // Refresh Expenses (If needed)
    fetchExpenses();
    
  } catch (error) {
    console.error("Error adding expense:", error);

    // Show error message in Swal
    Swal.fire({
      title: "Error!",
      text: "Failed to add expense. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

  const handleAddClick = (e) => {
    e.preventDefault(); // Prevent default form submission

    // Call the submit function
    handleSubmits();

    // Show SweetAlert2 success message
    Swal.fire({
      title: "Success!",
      text: "Expense added successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });
  };



    const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditingExpense({ ...editingExpense, [e.target.name]: e.target.value });
  };
  const handleEditChange1 = (e) => {
    const { name, value } = e.target;
    setEditingExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    // Show success message after change (optional, can be moved to a "Save" button)
    Swal.fire({
      title: "Updated!",
      text: `SUCCESS`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:5000/expenses/${editingExpense.id}`, editingExpense);
      fetchExpenses();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingExpense(null);
  };


  const sortedExpenses = [...expenses]
    .filter((expense) => expense.date.startsWith(selectedMonth))
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortBy === "date") {
        return sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      }
      if (sortBy === "amount") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });

  const totalExpense = sortedExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);







  
//     // ✅ Function to filter expenses for the selected month
const filterExpensesByMonth = () => {
  if (!selectedMonth) return expenses;

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const expenseYearMonth = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, "0")}`;
    return expenseYearMonth === selectedMonth;
  });
};

const generatePDF = () => {
  let filteredExpenses = filterExpensesByMonth();

  if (!filteredExpenses.length) {
    console.error("No expenses found for the selected month.");
    return;
  }

  // ✅ Sort expenses by date (oldest to newest)
  filteredExpenses = filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));

  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.text(`Monthly Expense Report - ${selectedMonth}`, 14, 10);

  const tableColumn = ["S.No", "Name", "Amount (Rs.)", "Category", "Date", "Payment Type"];
  const tableRows = filteredExpenses.map((expense, index) => [
    index + 1,
    expense.name,
    `Rs. ${parseFloat(expense.amount).toFixed(2)}`,
    expense.category,
    new Date(expense.date).toLocaleDateString("en-GB"), // ✅ Convert to DD/MM/YYYY
    expense.payment_type,
  ]);

  // ✅ Calculate Total Spent in the Month
  const totalSpent = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  // ✅ Add Total Row
  tableRows.push(["", "Total", `Rs. ${totalSpent.toFixed(2)}`, "", "", ""]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    styles: { fontSize: 12 },
    headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  // ✅ Save file as "Expense_Report_YYYY-MM.pdf"
  doc.save(`Expense_Report_${selectedMonth}.pdf`);
};
// YEAR PDF
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString()); // Store only YYYY



const generateXLS = () => {
  let filteredExpenses = filterExpensesByMonth();

  if (!filteredExpenses.length) {
    console.error("No expenses found for the selected month.");
    return;
  }

  // ✅ Sort expenses by date (oldest to newest)
  filteredExpenses = filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));

  // ✅ Define table columns
  const tableColumn = ["S.No", "Name", "Amount (Rs.)", "Category", "Date", "Payment Type"];

  // ✅ Format table data
  const tableRows = filteredExpenses.map((expense, index) => [
    index + 1,
    expense.name,
    `Rs. ${parseFloat(expense.amount).toFixed(2)}`,
    expense.category,
    new Date(expense.date).toLocaleDateString("en-GB"), // ✅ Convert to DD/MM/YYYY
    expense.payment_type,
  ]);

  // ✅ Calculate Total Spent in the Month
  const totalSpent = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  // ✅ Add Total Row
  tableRows.push(["", "Total", `Rs. ${totalSpent.toFixed(2)}`, "", "", ""]);

  // ✅ Create a worksheet
  const ws = XLSX.utils.aoa_to_sheet([tableColumn, ...tableRows]);

  // ✅ Create a workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Expenses");

  // ✅ Save file as "Expense_Report_YYYY-MM.xlsx"
  XLSX.writeFile(wb, `Expense_Report_${selectedMonth}.xlsx`);
};


const filterExpensesByYear = () => {
  if (!selectedYear) return expenses;

  return expenses.filter((expense) => {
    const expenseYear = new Date(expense.date).getFullYear().toString(); // Get YYYY
    return expenseYear === selectedYear; // ✅ Correctly compare years
  });
};


const generateYearlyPDF = () => {
  let filteredExpenses = filterExpensesByYear();

  if (!filteredExpenses.length) {
    console.error("No expenses found for the selected year.");
    return;
  }

  // ✅ Sort by date (oldest to newest)
  filteredExpenses = filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));

  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.text(`Annual Expense Report - ${selectedYear}`, 14, 10);

  const tableColumn = ["S.No", "Name", "Amount (Rs.)", "Category", "Date", "Payment Type"];
  const tableRows = filteredExpenses.map((expense, index) => [
    index + 1,
    expense.name,
    `Rs. ${parseFloat(expense.amount).toFixed(2)}`,
    expense.category,
    new Date(expense.date).toLocaleDateString("en-GB"), // ✅ Convert to DD/MM/YYYY
    expense.payment_type,
  ]);

  // ✅ Calculate Total Spent in the Year
  const totalSpent = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  // ✅ Add Total Row
  tableRows.push(["", "Total", `Rs. ${totalSpent.toFixed(2)}`, "", "", ""]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
    styles: { fontSize: 12 },
    headStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  doc.save(`Annual_Expense_Report_${selectedYear}.pdf`);
};



const generateYearlyXLS = () => {
  let filteredExpenses = filterExpensesByYear();

  if (!filteredExpenses.length) {
    console.error("No expenses found for the selected year.");
    return;
  }

  // ✅ Sort by date (oldest to newest)
  filteredExpenses = filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));


  const tableData = filteredExpenses.map((expense, index) => ({
    "S.No": index + 1,
    "Name": expense.name,
    "Amount (Rs.)": `Rs. ${parseFloat(expense.amount).toFixed(2)}`,
    "Category": expense.category,
    "Date": new Date(expense.date).toLocaleDateString("en-GB"), // DD/MM/YYYY
    "Payment Type": expense.payment_type,
  }));

  // ✅ Calculate total spent
  const totalSpent = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  // ✅ Add total row
  tableData.push({
    "S.No": "",
    "Name": "Total",
    "Amount (Rs.)": `Rs. ${totalSpent.toFixed(2)}`,
    "Category": "",
    "Date": "",
    "Payment Type": "",
  });


  const ws = XLSX.utils.json_to_sheet(tableData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Annual Report ${selectedYear}`);


  XLSX.writeFile(wb, `Annual_Expense_Report_${selectedYear}.xlsx`);
};
const columns = [
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Amount",
    selector: (row) => row.amount,
    sortable: true,
    format: (row) => `Rs. ${row.amount.toFixed(2)}`,
  },
  {
    name: "Category",
    selector: (row) => row.category,
    sortable: true,
  },
  {
    name: "Date",
    selector: (row) => row.date,
    sortable: true,
  },
  {
    name: "Payment Type",
    selector: (row) => row.payment_type,
  },
  {
    name: "Actions",
    cell: (row) => (
      <div className="flex space-x-2">
        <button
          onClick={() => handleEditClick(row)}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          <FaEdit className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleDelete(row.id)}
          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
        >
          <FaTrash className="h-4 w-4" />
        </button>
      </div>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];
const filteredExpenses = expenses.filter((expense) => {
  const expenseMonth = new Date(expense.date).toISOString().slice(0, 7); // Extract YYYY-MM format
  return (
    expenseMonth === selectedMonth && // Filter by selected month
    (expense.name.toLowerCase().includes(filterText.toLowerCase()) ||
      expense.category.toLowerCase().includes(filterText.toLowerCase()) ||
      expense.payment_type.toLowerCase().includes(filterText.toLowerCase()))
  );
});


  return (
    
    
    <div className="w-screen h-screen overflow md:overflow-auto" ref={scrollContainerRef}>



<div className="relative">
      
   
<motion.button
  onClick={toggleSidebar} ref={buttonRef}
  className="fixed top-1 text-black p-3 rounded-md z-70  sm:block"
  animate={{ x: isMoved ? 200 : 0, y: isMoved ? 10 : 0 }}
  transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
>
  <Menu size={24} />
</motion.button>




         <div  ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-white w-64 p-6 shadow-md z-61 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
     
 




        <ul className="mt-10 space-y-4"> 
        <h1 className="flex items-center gap-2 text-xl font-bold mb-6 mt-7">
  <Airplay className="w-6 h-6 ml-3" /> 
  <span>ADMIN DB</span>
</h1>
        
        <li
  className="p-3 rounded-md cursor-pointer text-black hover:bg-gray-100 transition flex items-center gap-2"
  onClick={() => setActiveTab("chart")}
>
  <ChartPie size={20} /> 
  <span>Dashboard</span>
</li>
   



<li
  className="p-3 rounded-md cursor-pointer text-black hover:bg-gray-100 transition flex items-center gap-2"
  onClick={() => setActiveTab("table")}
>
<FileText/>  Expenses
</li>
<li 
    onClick={Logout} 
    className="flex items-center gap-2 p-3 ml-1 mt-5  text-black rounded-md  transition cursor-pointer w-fit"
  >
    <LogOut size={20} />
    <span>Logout</span>
  </li>


    </ul>

        
        {/*  */}
       








    
       
    
    
    

      </div>

      
    </div>


      

    
   


    
{isOpen && (
  <div className="fixed inset-0 bg-white/30 backdrop-blur-md z-60 block md:hidden"></div>
)}



      <div
  className={`flex-1 p-6 bg-white space-x-6 ${
    isOpen ? "ml-55" : "ml-0"
  } lg:transition-all lg:duration-300`}ref={sidebarRef}
>

      
        {activeTab === "chart" && (
          <h1 className="
  text-center 
  font-bold 
  bg-white 
  text-gray-800 
  py-4 
  z-10 
  pointer-events-none
  text-lg md:text-xl lg:text-2xl 
  block
  relative lg:fixed top-0 left-0 w-full
">
  EDUCER EXPENSES
</h1>








)}
<div className="flex flex-col md:flex-row lg:flex-row md:justify-center lg:justify-center gap-6 mt-6 px-4 ">

  <div className="w-full md:w-1/2 ml-1">
    {activeTab === "chart" && <ExpenseChart expenses={sortedExpenses} />}
    
    {totalExpense > 50000 && (
      <div className="mt-4 text-red-600 font-semibold bg-red-100 p-2 rounded-lg text-center">
        ⚠ Warning: Expenses exceeded Rs. 50,000! Please review your budget.
      </div>
    )}
    
  </div>

  <div className="w-1/2 md:w-1/2 -ml-20 mr-10 ">
    {activeTab === "chart" && <ExpenseChartF expenses={sortedExpenses} />}
  </div>
</div>



{activeTab === "chart" && (
  <>
<h1 className="hidden md:flex items-center gap-2 text-xl font-bold mb-6 -mt-5 ml-5">
  <NotepadText className="w-6 h-6" /> 
  <span>Annual Report</span>
</h1>


    <div className="flex items-center justify-between mb-6">
  

      <div className="hidden sm:flex items-center gap-4 ml-5">

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white ml-2 text-gray-700 shadow-sm transition focus:ring focus:ring-blue-300 focus:border-blue-500 hover:bg-gray-100"
          aria-label="Select Year"
        >
          <option value="" disabled className="text-gray-500">
            Select Year
          </option>
          {[...new Set(expenses.map((expense) => new Date(expense.date).getFullYear()))]
            .sort((a, b) => b - a)
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>

    
        <button
          onClick={generateYearlyPDF}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-lg transition hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none"
        >
          <Download className="w-5 h-5" />
          <span>Download PDF</span>
        </button>

        
        <button
          onClick={generateYearlyXLS}
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-500 rounded-lg transition hover:bg-green-600 focus:ring-2 focus:ring-green-300 focus:outline-none"
        >
          <Download className="w-5 h-5" />
          <span>Download XLS</span>
        </button>
      </div>

      <div className="sm:hidden fixed top-20 right-0 z-10 mt-5 ">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 px-4 py-2 text-white bg-white-800 rounded-lg transition   focus:outline-none"
        >
          <Import className="w-5 h-5 text-black " />
          <span className="text-black "> </span>
        </button>

        {mobileMenuOpen && (
          <div className="absolute z-10 mt-2 right-5 w-60 bg-white border border-gray-300 rounded-lg shadow-lg p-4 space-y-3 -ml-28">
        <Listbox value={selectedYear} onChange={setSelectedYear}>
  <div className="relative">
    <Listbox.Button className="w-full px-4 py-2 border border-gray-300 rounded-lg">
      {selectedYear || 'Select Year'}
    </Listbox.Button>
    <Listbox.Options className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50">
      {uniqueYears.map((year) => (
        <Listbox.Option
          key={year}
          value={year}
          className={({ active }) =>
            `px-4 py-2 cursor-pointer ${active ? 'bg-blue-100' : ''}`
          }
        >
          {year}
        </Listbox.Option>
      ))}
    </Listbox.Options>
  </div>
</Listbox>

            <button
              onClick={() => {
                generateYearlyPDF();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>

            <button
              onClick={() => {
                generateYearlyXLS();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
            >
              <Download className="w-4 h-4" />
              XLS
            </button>
          </div>
        )}
      </div>

    </div>
  </>
)}







 
        <div className="w-1/2 bg-white p-6  rounded-lg ml-30">
          {activeTab === "add" && (
            <>
              <h2 className="text-2xl font-bold mb-4 text-center">Add Expense</h2>
            

<form onSubmit={handleSubmit} className="space-y-4">
  <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder="Expense Name"
    required
    className="w-full p-2 border rounded-md"
  autoComplete="off"
  
  />
  <input
    type="number"
    name="amount"
    value={formData.amount}
    onChange={handleChange}
    placeholder="Amount"
    required
    className="w-full p-2 border rounded-md"
  />
  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    required
    className="w-full p-2 border rounded-md"
  >
    {["RENT", "SALARY", "UTILITIES", "FOOD", "OTHERS"].map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>
  <input
    type="date"
    name="date"
    value={formData.date}
    onChange={handleChange}
    required
    className="w-full p-2 border rounded-md"
  />
  <p>PAYMENT TYPE:</p>
  <select
    name="payment_type"
    value={formData.payment_type}
    onChange={handleChange}
    required
    className="w-full p-2 border rounded-md"
  >

    {["UPI", "CASH"].map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>



 





  <button
    type="submit"
    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
  >
    Add Expense
  </button>


     {successMessage && (
        <div className="mt-2 p-2 text-green-700 bg-green-200 rounded-md">
          {successMessage}
        </div>
      )}
  
</form>


            </>
          )}
</div>

<div className="ml-20 -mt-20">
      
          {activeTab === "table" && (
            
            
            <>



<h1 className=" top-0 z-50 w-full  -ml-8   text-center text-gray-800 font-bold py-4 text-base sm:text-lg md:text-xl lg:text-2xl">
  EDUCER EXPENSES TABLE
</h1>






{/* Sticky Controls */}
<div className="top-16 bg-white  z-30 p-4  -ml-15">

  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ">
    
    {/* Desktop Date Picker */}
    <div className=" hidden lg:flex items-center gap-2 ">
      <label className="text-base font-medium text-gray-700 tracking-wide ml-5">Select Month:</label>
      <input 
        type="month" 
        value={selectedMonth} 
        onChange={handleMonthChange} 
        className="p-2 border rounded-md"
      />
    </div>

    {/* Desktop Buttons */}
    <div className="hidden lg:flex gap-3 flex-wrap mr-5">
      <li onClick={() => setIOpen(true)} className="flex items-center gap-2 px-4 py-2 bg text-black rounded-md hover:bg-teal-200 cursor-pointer">
        <Plus size={20} />
        <span>Add Expense</span>
      </li>

      <li onClick={generatePDF} className="flex items-center gap-2 px-4 py-2  text-black rounded-md hover:bg-red-200 cursor-pointer">
        <FileHeart />
        <span>Generate PDF</span>
      </li>

      <li onClick={generateXLS} className="flex items-center gap-2 px-4 py-2  text-black rounded-md hover:bg-green-200 cursor-pointer">
        <FileSpreadsheet className="w-5 h-5" />
        <span>Generate XLS</span>
      </li>
    </div>

    {/* Mobile Menu */}
    <div className="lg:hidden ">
  <button
    onClick={() => setDropdownOpen(!dropdownOpen)}
    className="fixed top-4 -right-4 z-10 flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-800  w-[15%] max-w-[300px]"

  >
    <SquareChevronDown className="w-5 h-5 " />

  </button>

  <AnimatePresence>
  {dropdownOpen && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.25 }}
    className="fixed top-20 right-4 z-40 w-[90%] max-w-[300px] flex flex-col gap-3 bg-white p-4 border border-gray-200 rounded-xl shadow"
  >
    <label className="text-base font-medium text-gray-700 ">Select Month:</label>
    <input
      type="month"
      value={selectedMonth}
      onChange={handleMonthChange}
      className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-teal-400"
    />

    <li
      onClick={() => setIOpen(true)}
      className="flex items-center gap-2 px-4 py-2  text-black rounded-md hover:bg-teal-500 hover:text-white cursor-pointer hover:bg-gray-100"
    >
      <Plus size={20} />
      <span>Add Expense</span>
    </li>

    <li
      onClick={generatePDF}
      className="flex items-center gap-2 px-4 py-2 text-black rounded-md hover:bg-red-500 hover:text-white cursor-pointer"
    >
      <FileHeart />
      <span>Generate PDF</span>
    </li>

    <li
      onClick={generateXLS}
      className="flex items-center gap-2 px-4 py-2  text-black rounded-md hover:bg-green-600 hover:text-white cursor-pointer"
    >
      <FileSpreadsheet className="w-5 h-5" />
      <span>Generate XLS</span>
    </li>
  </motion.div>
)}

  </AnimatePresence>
</div>

  </div>
</div>

<div className="w-full  h-full overflow-x-auto lg:overflow-x-hidden overflow-y-hidden -ml-8 sm:-ml-10 md:-ml-11 scroll-smooth">

  {/* content */}


  <div className="min-w-[600px] lg:min-w-full ">


    <DataTable
      columns={columns}
      data={filteredExpenses}
      responsive
      pagination
      highlightOnHover
      defaultSortFieldId={1}
      customStyles={{
        table: {
          style: {
            width: "100%",
          },
        },
        tableWrapper: {
          style: {
            width: "100%",
            overflowX: "auto",
          },
        },
        headCells: {
          style: {
            backgroundColor: "#f3f4f6",
            color: "#374151",
            fontWeight: "bold",
            textTransform: "uppercase",
          },
        },
        rows: {
          style: {
            "&:nth-of-type(odd)": {
              backgroundColor: "#f9fafb",
            },
          },
        },
      }}
    />
  </div>
  <div className="text-sm lg:text-lg font-semibold -mt-18">
  Total Expenses: 
  <span className={`ml-2 ${totalExpense > 50000 ? "text-red-600 font-bold" : "text-blue-600"}`}>
    RS.{totalExpense.toFixed(2)}
  </span>
</div>

</div>




              
            </>
          )}

        </div>

       





      </div>
      
   
     
   {isEditModalOpen && (
 
          <div className="fixed inset-0  bg-opacity-50 flex items-start justify-center pt-10 z-60">



          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">Edit Expense</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input type="text" name="name" value={editingExpense.name} onChange={handleEditChange} className="w-full p-2 border rounded-md" />
              <input type="number" name="amount" value={editingExpense.amount} onChange={handleEditChange} className="w-full p-2 border rounded-md" />
              <select name="category" value={editingExpense.category} onChange={handleEditChange} className="w-full p-2 border rounded-md">
                {["RENT", "SALARY", "UTILITIES", "FOOD", "OTHERS"].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input type="date" name="date" value={editingExpense.date} onChange={handleEditChange} className="w-full p-2 border rounded-md" />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={closeEditModal} className="bg-gray-400 text-white p-2 rounded-md hover:bg-gray-500">Cancel</button>
                <button type="submit" onClick={handleEditChange1} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
       <>
  
     

       {iOpen && (
  <div
    className="fixed inset-0  bg-opacity-50 flex items-start justify-center pt-10 z-60  backdrop-blur-md"
    onClick={() => setIOpen(false)}
  >
    <div
      className="bg-white w-full max-w-sm md:max-w-md lg:max-w-lg p-6 mx-4 rounded-lg shadow-lg relative mt-10"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Add Expense</h2>

      <form onSubmit={handleSubmits} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Expense Name"
          required
          className="p-2 border rounded-md w-full"
          autoComplete="off"
        />

        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
          className="w-full p-2 border rounded-md"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        >
          {["RENT", "SALARY", "UTILITIES", "FOOD", "OTHERS"].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        />

        <p>PAYMENT TYPE:</p>
        <select
          name="payment_type"
          value={formData.payment_type}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded-md"
        >
          {["UPI", "CASH"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Add Here
        </button>

        {successMessage && (
          <div className="mt-2 p-2 text-green-700 bg-green-200 rounded-md">
            {successMessage}
          </div>
        )}
      </form>
    </div>
  </div>
)}


    </>
   
   
   
   
   
    </div>







  );
};

export default ExpenseTracker;


