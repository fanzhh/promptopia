'use client';

import { useState, useEffect } from 'react';

import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  let ll = [];
  data.map((post) => {
    ll.push(
      <PromptCard 
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
    );
  })
  return ll;
}

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  // Search states
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext ,"i");

    return allPosts.filter((item) => {
      regex.test(item.creator.username) ||
      regex.test(item.tag) ||
      regex.test(item.prompt)
    });
  }
  
  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.text);
  }

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt", {
      cache: 'no-store'
    });
    console.log('in Feed, will fetchPosts...')
    const data = await response.json();
    console.log('getted data: ', data);
    setAllPosts(data);
  }

  useEffect(() => {
    console.log('in Feed useEffect, will fetch posts...');
    fetchPosts();
  }, []);

  const handleTagClick = (tagName) => { 
    setSearchText(tagName);
    const searResult = filterPrompts(tagName);
    setSearchedResults(searResult);
  }
  
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
        handleTagClick={handleTagClick}
      />
    </section>
  )
}

export default Feed