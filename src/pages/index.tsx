import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import StrategyTable from "../components/StrategyTable";
import TradeTable from "../components/TradeTable";
import { useState, useEffect } from "react";

type Trade = {
  id: number;
  date_of_trade: string;
  ticker: string;
  strategy_id: number;
  time_horizon: string;
  price: number;
  units: number;
  open_qty: number;
  pnl: number;
  realised_pnl: number;
  unrealised_pnl: number;
};

type Strategy = {
  id: number;
  name: string;
};

const Home = ({ initialTrades }: { initialTrades: Trade[] }) => {
  const [trades, setTrades] = useState(initialTrades);
  const [groupedTrades, setGroupedTrades] = useState<Record<string, Trade[]>>({});
  const [filters, setFilters] = useState({
    date: "",
    strategy: "",
    ticker: "",
  });

  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch strategies from the API
  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        if (!backendUrl) {
          throw new Error("NEXT_PUBLIC_BACKEND_URL is not set in the environment variables.");
        }

        const { data } = await axios.get<Strategy[]>(`${backendUrl}/strategies/`);
        setStrategies(data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching strategies:", error.response?.data || error.message);
        } else {
          console.error("Unknown error:", error);
        }
        alert("Failed to fetch strategies.");
      }
    };
    fetchStrategies();
  }, [backendUrl]);

  // Apply filters and group trades dynamically
  useEffect(() => {
    const filteredTrades = trades.filter((trade) => {
      const dateMatch = filters.date ? trade.date_of_trade === filters.date : true;
      const strategyMatch = filters.strategy
        ? strategies.find((s) => s.name === filters.strategy)?.id === trade.strategy_id
        : true;
      const tickerMatch = filters.ticker ? trade.ticker.includes(filters.ticker) : true;
      return dateMatch && strategyMatch && tickerMatch;
    });

    const grouped = filteredTrades.reduce((acc, trade) => {
      const groupKey = `${trade.date_of_trade}-${trade.strategy_id}-${trade.ticker}-${trade.time_horizon}`;
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(trade);
      return acc;
    }, {} as Record<string, Trade[]>);

    setGroupedTrades(grouped);

    // Set the filtered trades in case it's needed elsewhere
    setTrades(filteredTrades);
  }, [filters, strategies]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const getStrategyName = (strategyId: number) => {
    return strategies.find((s) => s.id === strategyId)?.name || "N/A";
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 className="centerAlign"><b>Trade Tracker</b></h1>
        <p className="centerAlign">
          Manage your strategies and track your trades efficiently.
        </p>

        <h2>Strategies</h2>
        <StrategyTable />

        <h1>Trades</h1>
        <TradeTable />

        {/* Filters */}
        <div style={{ marginBottom: "20px", padding: "10px" }}>
          <h1>Filter Grouped Trades</h1>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            placeholder="Filter by Date"
            style={{ marginRight: "10px", padding: "5px" }}
          />
          <select
            name="strategy"
            value={filters.strategy}
            onChange={handleFilterChange}
            style={{ marginRight: "10px", padding: "5px" }}
          >
            <option value="">Filter by Strategy</option>
            {strategies.map((strategy) => (
              <option key={strategy.id} value={strategy.name}>
                {strategy.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="ticker"
            value={filters.ticker}
            onChange={handleFilterChange}
            placeholder="Filter by Ticker"
            style={{ padding: "5px" }}
          />
        </div>

        {/* Display Grouped Trades */}
        <div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Strategy</th>
                <th>Ticker</th>
                <th>Time Horizon</th>
                <th>Open Qty</th>
                <th>Realised PnL</th>
                <th>Unrealised PnL</th>
                <th>Total PnL</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedTrades).map(([key, group]) => {
                const totalOpenQty = group.reduce((acc, trade) => acc + trade.open_qty, 0);
                const totalRealisedPnL = group.reduce((acc, trade) => acc + trade.realised_pnl, 0);
                const totalUnrealisedPnL = group.reduce((acc, trade) => acc + trade.unrealised_pnl, 0);

                return (
                  <tr key={key}>
                    <td>{group[0].date_of_trade}</td>
                    <td>{getStrategyName(group[0].strategy_id)}</td>
                    <td>{group[0].ticker}</td>
                    <td>{group[0].time_horizon}</td>
                    <td>{totalOpenQty}</td>
                    <td>{totalRealisedPnL.toFixed(2)}</td>
                    <td>{totalUnrealisedPnL.toFixed(2)}</td>
                    <td>{(totalRealisedPnL + totalUnrealisedPnL).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps = async () => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not set in the environment variables.");
  }

  try {
    const { data } = await axios.get<Trade[]>(`${backendUrl}/trades/`);
    return {
      props: {
        initialTrades: data,
      },
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching trades:", error.response?.data || error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return {
      props: {
        initialTrades: [],
      },
    };
  }
};

export default Home;
