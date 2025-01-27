import React from 'react';
import { Filter, ChevronDown, LayoutGrid, List } from 'lucide-react';
import SearchInput from './SearchInput';

const SearchAndFilterBar = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  viewMode,
  setViewMode,
  profiles,
  showFilter,
  setShowFilter
}) => {
  return (
    <div className="flex gap-4 mb-6">
      {/* Search Input */}
      <SearchInput 
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {/* Filter Dropdown */}
      <div className="relative filter-dropdown">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="px-4 py-3 bg-gray-800/80 backdrop-blur-sm angular-cut flex items-center gap-2 
            hover:bg-gray-700/80 border border-gray-700/50 transition-all"
        >
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="text-gray-300 capitalize">{filterStatus}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transform transition-transform duration-200
              ${showFilter ? 'rotate-180' : ''}`}
          />
        </button>

        {showFilter && (
          <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800/95 backdrop-blur-sm rounded-lg 
            shadow-xl border border-gray-700/50 z-50"
          >
            {['all', 'pending', 'accepted', 'rejected'].map((status) => {
              const count = profiles.filter((p) =>
                status === 'all' ? true : p.status === status
              ).length;

              return (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status);
                    setShowFilter(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-700/50 transition-colors
                    flex items-center justify-between group
                    ${filterStatus === status ? 'text-blue-400' : 'text-gray-300'}`}
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <span className="text-gray-500 text-sm">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 border-l border-gray-700/50 pl-4">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded transition-colors ${
            viewMode === 'grid'
              ? 'bg-blue-500/20 text-blue-400'
              : 'text-gray-400 hover:bg-gray-700/50'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded transition-colors ${
            viewMode === 'list'
              ? 'bg-blue-500/20 text-blue-400'
              : 'text-gray-400 hover:bg-gray-700/50'
          }`}
        >
          <List className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilterBar;