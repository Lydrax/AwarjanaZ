import React, { useEffect } from "react";
import Routes from "./Routes";
import { supabase } from './lib/supabase'; // Import the client

function App() {
  useEffect(() => {
    // Simple test query
    const testConnection = async () => {
      console.log("🔍 Testing Supabase connection from App.jsx...");
      console.log("Using URL:", import.meta.env.VITE_SUPABASE_URL); // This will show if the env var is loaded

      const { data, error } = await supabase
        .from('memorials')
        .select('count') // Just get a count, it's efficient
        .eq('privacy', 'public');

      if (error) {
        console.error('❌ Supabase Connection Error:', error);
      } else {
        console.log('✅ Supabase Connection Successful! Public memorials count:', data);
      }
    };

    testConnection();
  }, []); // Run once when the app loads

  return (
    <Routes />
  );
}

export default App;