import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
  } from "recharts";
  import { useState, useEffect } from "react";
  
  const AreaCart = ({ expenses }) => {
    const [isSmall, setIsSmall] = useState(false);
    const [chartHeight, setChartHeight] = useState(window.innerWidth < 640 ? 300 : 400);
  
    useEffect(() => {
      const handleResize = () => {
        setChartHeight(window.innerWidth < 640 ? 300 : 400);
      };
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    useEffect(() => {
      const handleResize = () => {
        setIsSmall(window.innerWidth <= 548 && window.innerHeight <= 672);
      };
  
      handleResize(); // run once on load
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    if (!expenses || expenses.length === 0) {
      return (
        <p className="text-center text-gray-500 mt-4 select-none">
          No expenses to display.
        </p>
      );
    }
  
    // Aggregate expenses by category
    const expenseTotals = expenses.reduce((acc, expense) => {
      const category = expense.category || "Others";
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {});
  
    // Format for recharts
    const data = Object.keys(expenseTotals).map((category) => ({
      name: category,
      amount: expenseTotals[category],
    }));
  
    return (
      <div className="w-full ">
        <div style={{ minWidth: "500px" }}>
          <h3 className="hidden lg:block text-xl font-semibold mt-5 -ml-15 text-center">
            
          </h3>
  
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: "#374151", fontSize: 13 }} />
              <YAxis tick={{ fill: "#374151", fontSize: 13 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                }}
              />
              <Legend wrapperStyle={{ paddingBottom: 20 }} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                fill="#93c5fd"
                strokeWidth={2}
                dot
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  export default AreaCart;
  