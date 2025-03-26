import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

export function MobileNav() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/issues?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search issues, representatives..."
          className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="absolute left-3 top-2.5 text-gray-400"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
    </div>
  );
}
