import React from 'react';
import { FaSearch } from 'react-icons/fa'; 

interface KeywordSearchFieldProps {
    keyword: string;
    onKeywordChange: (keyword: string) => void;
    onSubmit?: () => void; 
}

const KeywordSearchInput = ({ keyword, onKeywordChange, onSubmit }: KeywordSearchFieldProps) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && onSubmit) {
        event.preventDefault();
        onSubmit();
        }
    };

    return (
        <div className="relative shadow-sm rounded-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-400 dark:text-slate-500" />
        </div>
        <input
            type="text"
            name="keyword-search" 
            aria-label="キーワード検索" 
            placeholder="店名・料理名・エリアなどで検索"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input-base search-input-themed w-full p-4 pl-12 text-lg md:text-xl rounded-xl focus:shadow-lg"
        />
        </div>
    );
};

export default KeywordSearchInput;