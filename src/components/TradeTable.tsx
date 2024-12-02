import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

type Trade = {
  id: number;
  date_of_trade: string;
  ticker: string;
  strategy_id: number;
  time_horizon: string;
  price: number;
  units: number;
  matched_trade_ids?: string | null;
  pnl?: number;
  qty: number;
  current_price: number;
  open_qty: number;
  unrealised_pnl?: number;
  realised_pnl?: number;
};

type Strategy = {
  id: number;
  name: string;
};

const TradeTable: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedTrades, setSelectedTrades] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchTradesAndStrategies = async () => {
      try {
        setLoading(true);
        if (!backendUrl) {
          throw new Error("NEXT_PUBLIC_BACKEND_URL is not set in the environment variables.");
        }

        // Fetch Trades
        const tradeResponse = await axios.get(`${backendUrl}/trades/`);
        setTrades(tradeResponse.data);

        // Fetch Strategies
        const strategyResponse = await axios.get(`${backendUrl}/strategies/`);
        setStrategies(strategyResponse.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching data:", error.response?.data || error.message);
        } else {
          console.error("Unknown error:", error);
        }
        alert("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchTradesAndStrategies();
  }, [backendUrl]);

  const handleCheckboxChange = (tradeId: number) => {
    if (selectedTrades.includes(tradeId)) {
      setSelectedTrades(selectedTrades.filter((id) => id !== tradeId));
    } else if (selectedTrades.length < 2) {
      setSelectedTrades([...selectedTrades, tradeId]);
    } else {
      alert("You can select a maximum of 2 trades for comparison.");
    }
  };

  const handleCompareTrades = async () => {
    if (selectedTrades.length !== 2) {
      alert("Please select exactly 2 trades for comparison.");
      return;
    }

    try {
      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL is not set in the environment variables.");
      }

      const payload = { trade_ids: selectedTrades };
      const { data } = await axios.post(`${backendUrl}/trades/compare`, payload);

      const updatedTrades = trades.map((trade) =>
        data.updated_trades.find((updatedTrade: Trade) => updatedTrade.id === trade.id) || trade
      );
      setTrades(updatedTrades);
      alert("Comparison Successful!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error comparing trades:", error.response?.data || error.message);
        alert("Failed to compare trades. Please check your connection or server.");
      } else {
        console.error("Unknown error:", error);
        alert("An unknown error occurred while comparing trades.");
      }
    }
  };

  const handleDeleteTrade = async (tradeId: number) => {
    if (!window.confirm("Are you sure you want to delete this trade?")) return;

    try {
      if (!backendUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_URL is not set in the environment variables.");
      }

      await axios.delete(`${backendUrl}/trades/${tradeId}`);
      setTrades(trades.filter((trade) => trade.id !== tradeId));
      alert("Trade deleted successfully!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting trade:", error.response?.data || error.message);
        alert("Failed to delete trade. Please check your connection or server.");
      } else {
        console.error("Unknown error:", error);
        alert("An unknown error occurred while deleting the trade.");
      }
    }
  };

  const getStrategyName = (strategyId: number): string => {
    const strategy = strategies.find((s) => s.id === strategyId);
    return strategy ? strategy.name : "N/A";
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ overflowX: "auto", marginBottom: "20px" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Date</th>
            <th>Ticker</th>
            <th>Strategy</th>
            <th>Time Horizon</th>
            <th>Price</th>
            <th>Units</th>
            <th>Qty</th>
            <th>Current Price</th>
            <th>PNL</th>
            <th>Unrealised PNL</th>
            <th>Open Qty</th>
            <th>Matched Trade IDs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade) => (
            <tr
              key={trade.id}
              style={{
                backgroundColor: trade.matched_trade_ids ? "lightgreen" : "",
                borderBottom: "1px solid #ddd",
              }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedTrades.includes(trade.id)}
                  onChange={() => handleCheckboxChange(trade.id)}
                />
              </td>
              <td>{trade.id}</td>
              <td>{trade.date_of_trade}</td>
              <td>{trade.ticker}</td>
              <td>{getStrategyName(trade.strategy_id)}</td>
              <td>{trade.time_horizon}</td>
              <td>{trade.price.toFixed(2)}</td>
              <td>{trade.units}</td>
              <td>{trade.qty}</td>
              <td>{trade.current_price.toFixed(2)}</td>
              <td>{trade.pnl?.toFixed(2)}</td>
              <td>{trade.unrealised_pnl?.toFixed(2) || "N/A"}</td>
              <td>{trade.open_qty}</td>
              <td>{trade.matched_trade_ids || "N/A"}</td>
              <td>
                <div style={{ display: "flex", gap: "10px" }}>
                  <Link href={`/trades/edit/${trade.id}`} legacyBehavior>
                    <a
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        textDecoration: "none",
                        fontSize: "14px",
                      }}
                    >
                      Edit
                    </a>
                  </Link>
                  <button
                    onClick={() => handleDeleteTrade(trade.id)}
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedTrades.length === 2 && (
        <button
          onClick={handleCompareTrades}
          style={{
            marginTop: "10px",
            backgroundColor: "#28a745",
            color: "white",
            padding: "8px 15px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Compare Trades
        </button>
      )}
    </div>
  );
};

export default TradeTable;
