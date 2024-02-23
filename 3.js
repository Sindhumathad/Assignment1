//posts.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/posts?page=${page}`);
        setPosts((prevPosts) => [...prevPosts, ...response.data]);
        setLoading(false);
      } catch (error) {
        setErrors(error.response.data);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

    if (scrollHeight - scrollTop === clientHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div onScroll={handleScroll} style={{ height: '100vh', overflow: 'auto' }}>
      {errors && <p>{errors.message}</p>}
      {posts.map((post) => (
        <div key={post.id} className="p-4 border-b border-gray-300">
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <p>{post.body}</p>
        </div>
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Posts;

//app.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Signup from './Signup';
import Posts from './Posts';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/" component={Posts} />
      </Switch>
    </Router>
  );
}

export default App;
