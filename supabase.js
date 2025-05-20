// Supabase client initialization
const SUPABASE_URL = 'https://auhlsnznnojyfgfmnbsh.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1aGxzbnpubm9qeWZnZm1uYnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2OTc1NDQsImV4cCI6MjA2MDI3MzU0NH0.GYV4ikLLegv3S3meMWn13CzS2uHspEKwV407akwXZ6g'; // Replace with your Supabase anon key

// Initialize the Supabase client
const createClient = () => {
  const { createClient } = supabase;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
};

// Global variable to track if Supabase is properly connected
let supabaseConnected = false;

// Test Supabase connection on page load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const supabaseClient = createClient();
    
    // First check if we can connect to Supabase at all
    const { error: connectionError } = await supabaseClient.from('beta_signups').select('count').limit(1);
    
    if (connectionError) {
      // If the error is about the table not existing, try to create it
      if (connectionError.message && connectionError.message.includes('does not exist')) {
        console.log('Table beta_signups does not exist. Please create it in your Supabase dashboard.');
      } else {
        console.error('Supabase connection test failed:', connectionError);
      }
    } else {
      console.log('Supabase connection successful!');
      supabaseConnected = true;
    }
  } catch (err) {
    console.error('Exception during Supabase connection test:', err);
  }
});

// Function to save beta sign-up data to Supabase
async function saveBetaSignup(name, email) {
  // If Supabase is not connected, log it but don't block the user experience
  if (!supabaseConnected) {
    console.warn('Supabase is not properly connected. Data will not be saved.');
    // Return true to allow the form submission to continue
    return true;
  }
  
  try {
    const supabaseClient = createClient();
    
    // Insert data into the 'beta_signups' table
    const { data, error } = await supabaseClient
      .from('beta_signups')
      .insert([
        { name: name, email: email, signup_date: new Date().toISOString() }
      ]);
    
    if (error) {
      console.error('Error saving to Supabase:', error);
      // If there's a table not found error, provide a helpful message
      if (error.message && error.message.includes('does not exist')) {
        console.log('The beta_signups table does not exist in your Supabase database.');
        console.log('Please create a table with these columns: name (text), email (text), signup_date (timestamp)');
      }
      return false;
    }
    
    console.log('Successfully saved to Supabase:', data);
    return true;
  } catch (err) {
    console.error('Exception when saving to Supabase:', err);
    return false;
  }
}
