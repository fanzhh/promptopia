'use client';

import { useState, useEffect } from 'react';

import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => {
        <PromptCard 
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      })}
    </div>
  )
}

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  
  const handleSearchChange = (e) => {
  }

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt", {
      cache: 'no-store'
    });
    const data = await response.json();

    setAllPosts(data);
  }

  useEffect(() => {
    fetchPosts();
  });
  
  return (
    <section className="feed">
      <form className='relative w-full flex-center'>
        <input 
          type="text"
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>
      <PromptCardList 
        data={allPosts} 
      />
    </section>
  )
}

export default Feed