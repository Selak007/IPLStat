import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import "./App.css";

const BatterVsBowlerApp = () => {
  const [batter, setBatter] = useState(null);
  const [bowler, setBowler] = useState(null);
  const [batterOptions, setBatterOptions] = useState([]);
  const [bowlerOptions, setBowlerOptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // API base URL based on environment (hardcoded for now)
  const apiBaseUrl =
    window.location.hostname === "localhost" ? "http://localhost:5000" : "https://iplstat.onrender.com";

  const handlePlayerSearch = (inputValue, type) => {
    if (!inputValue) return;
    axios
      .get(`${apiBaseUrl}/search`, {
        params: { query: inputValue },
      })
      .then((response) => {
        const options = response.data.map((player) => ({
          value: player.name,
          label: player.name,
        }));
        if (type === "batter") {
          setBatterOptions(options);
        } else {
          setBowlerOptions(options);
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (batter && bowler) {
      axios
        .get(`${apiBaseUrl}/stats/${batter.value}/${bowler.value}`)
        .then((response) => setStats(response.data))
        .catch((error) => console.error(error));
    }
  }, [batter, bowler, apiBaseUrl]);

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <header className="header">
        <img src="/logo.png" alt="H2H Logo" className="logo" />
        <h1 className="app-title">H2H: Batter vs Bowler</h1>
        <div className="toggle-mode">
          <span>{darkMode ? "🌙" : "☀️"}</span>
          <Toggle
            defaultChecked={darkMode}
            icons={false}
            onChange={() => setDarkMode((prev) => !prev)}
          />
        </div>
      </header>

      <div className="selectors">
        <div className="select-box">
          <label>Select Batter</label>
          <Select
            options={batterOptions}
            onInputChange={(inputValue) => {
              handlePlayerSearch(inputValue, "batter");
              return inputValue;
            }}
            onChange={setBatter}
            placeholder="Type to search batter"
            isClearable
            className="react-select"
          />
        </div>

        <div className="select-box">
          <label>Select Bowler</label>
          <Select
            options={bowlerOptions}
            onInputChange={(inputValue) => {
              handlePlayerSearch(inputValue, "bowler");
              return inputValue;
            }}
            onChange={setBowler}
            placeholder="Type to search bowler"
            isClearable
            className="react-select"
          />
        </div>
      </div>

      {stats && (
        <div className="stats-section">
          <div className="stats-card">
            <h2>Stats Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Batter</th>
                  <th>Bowler</th>
                  <th>Balls</th>
                  <th>Runs</th>
                  <th>Fours</th>
                  <th>Sixes</th>
                  <th>Outs</th>
                  <th>Strike Rate</th>
                  <th>Dismissal Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{stats.batter}</td>
                  <td>{stats.bowler}</td>
                  <td>{stats.balls_faced}</td>
                  <td>{stats.runs_scored}</td>
                  <td>{stats.fours}</td>
                  <td>{stats.sixes}</td>
                  <td>{stats.times_out}</td>
                  <td>{stats.strike_rate}</td>
                  <td>{stats.dismissal_rate}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatterVsBowlerApp;

