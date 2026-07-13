import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [roomType, setRoomType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search, location, roomType });
  };

  const handleReset = () => {
    setSearch("");
    setLocation("");
    setRoomType("");
    onSearch({ search: "", location: "", roomType: "" });
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search by title, college, or keyword..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="search-input search-input-small"
      />

      <select
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
        className="search-select"
      >
        <option value="">All Room Types</option>
        <option value="Single">Single</option>
        <option value="Shared">Shared</option>
        <option value="Dormitory">Dormitory</option>
        <option value="Mess Only">Mess Only</option>
        <option value="Room + Mess">Room + Mess</option>
      </select>

      <button type="submit" className="btn btn-primary">
        Search
      </button>
      <button type="button" className="btn btn-outline" onClick={handleReset}>
        Reset
      </button>
    </form>
  );
};

export default SearchBar;
