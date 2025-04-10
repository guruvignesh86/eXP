import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Tooltip,
    Legend,
  } from "recharts";
  import { useState, useEffect } from "react";
  
  const RadarCart = ({ expenses }) => {
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
      category,
      amount: expenseTotals[category],
    }));
  
    return (
      <div className="w-full ">
        <div style={{ minWidth: "500px" }}>
          <h3 className="hidden lg:block text-xl font-semibold mt-5 text-center">
       
          </h3>
  
          <ResponsiveContainer width="100%" height={chartHeight}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" tick={{ fill: "#374151", fontSize: 13 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: "#374151" }} />
              <Tooltip />
              <Legend />
              <Radar
                name="Amount"
                dataKey="amount"
                stroke="#3b82f6"
                fill="#93c5fd"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  export default RadarCart;
  