import './App.css'
import {useEffect, useRef, useState} from "react";

function App() {
  const [data, setData] = useState([]);
  const dataFetched = useRef(false);
  
  const fetchData = async (): Promise<void> => {
    try {
      const data = await fetch('http://localhost:4000/default').then(res => res.json());
      setData(data);
    } catch (err) {
      console.error(err);
    }
  }
  
  useEffect(() => {
    if (!dataFetched.current) {
      fetchData();
      dataFetched.current = true;
    }
  }, []);
  
  return (
    <div>
        <h1>App VITE</h1>
        <code>{JSON.stringify(data)}</code>
    </div>
  )
}

export default App
