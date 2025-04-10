import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const ExpenseChart = ({ expenses }) => {
  const [chartWidth, setChartWidth] = useState(window.innerWidth > 640 ? 320 : 250);

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth > 640 ? 320 : 250); // Adjust for mobile
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!expenses || expenses.length === 0) {
    return <p className="text-center text-gray-500 mt-4 select-none">No expenses to display.</p>;
  }

  const expenseTotals = expenses.reduce((acc, expense) => {
    const category = expense.category || "Others";
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  const categories = Object.keys(expenseTotals);
  const values = Object.values(expenseTotals);

  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: categories,
    colors: ["#ff4757", "#ffa502", "#2ed573", "#1e90ff", "#5352ed"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(1)}%`,
    },
    tooltip: {
      y: {
        formatter: (value) => `₹${value.toFixed(2)}`,
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { width: 250 },
        },
      },
    ],
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-4 rounded-lg mt-2 mb-2 ">
      <h3 className="text-lg font-semibold mb-2 -ml-2 text-center">Expense Breakdown</h3>
      <div className="flex justify-center">
        <Chart options={chartOptions} series={values} type="donut" width={chartWidth} />
      </div>
    </div>
  );
};

export default ExpenseChart;








// import React from "react";
// import Chart from "react-apexcharts";

// const ExpenseChart = ({ expenses }) => {
//   if (!expenses || expenses.length === 0) {              //making expenses as falsed using ! but on real it has []

//                                                       //so it checks condition expenses is null we sets up 
//                                                       //   || expenses.length === 0 (Is it empty?) we dont know  n/a so condition true
//                                                       // if db on it fetches the data 
//     return <p className="text-center text-gray-500 mt-4 select-none">No expenses to display.</p>;
//   }

//   // Aggregate expenses by category                       //used to display amount and category in chart
//   const expenseTotals = expenses.reduce((acc, expense) => {
//     const category = expense.category || "Others";
//     acc[category] = (acc[category] || 0) + expense.amount;
//     return acc;                     //display the category and amount
//   }, {});

//   // Prepare data for ApexCharts
//   const categories = Object.keys(expenseTotals);
//   const values = Object.values(expenseTotals);

//   const chartOptions = {
//     chart: {
//       type: "donut",
//     },
//     labels: categories,
//     colors: ["#ff4757", "#ffa502", "#2ed573", "#1e90ff", "#5352ed"],
//     legend: {
//       position: "bottom",
//     },
//     dataLabels: {
//       enabled: true,
//       formatter: (val) => `${val.toFixed(1)}%`,
//     },
//     tooltip: {
//       y: {
//         formatter: (value) => `ரூ${value.toFixed(2)}`,
//       },
//     },
//   };

//   return (
//     <div className="w-full flex justify-center items-center bg-gray-100 p-4 rounded-lg mt-4  ml-5 shadow-lg">
//       <div className="text-center">
//         <h3 className="text-lg font-semibold mb-2">Expense Breakdown</h3>
//         <div className="flex justify-center">
//           <Chart options={chartOptions} series={values} type="donut" width="320" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExpenseChart;








// if (expenses.length === 0) {
//   console.log("No expenses available");
// }




