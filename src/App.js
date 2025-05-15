import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import axios from 'axios';

function App() {
  const getProducts = async () => {
    const response = await axios.get("http://localhost:8080/api/v1/products");
    return response.data;
  }
  useEffect(() => {
     getProducts()
       .then((data) => {
         console.log(data);
       })
       .catch((error) => {
         console.error("Error fetching products:", error);
       });
  },[])
  return (
     <div>
       <h1>This is the app customize app page </h1>
     </div>
  );
}

export default App;
