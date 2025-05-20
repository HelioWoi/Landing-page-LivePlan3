// Supabase client initialization
const SUPABASE_URL = 'https://auhlsnznnojyfgfmnbsh.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1aGxzbnpubm9qeWZnZm1uYnNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2OTc1NDQsImV4cCI6MjA2MDI3MzU0NH0.GYV4ikLLegv3S3meMWn13CzS2uHspEKwV407akwXZ6g'; // Replace with your Supabase anon key

// Initialize the Supabase client
const createClient = () => {
  console.log('Creating Supabase client with URL:', SUPABASE_URL);
  console.log('Anon key starts with:', SUPABASE_ANON_KEY.substring(0, 10) + '...');
  
  try {
    const { createClient } = supabase;
    const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client created successfully');
    return client;
  } catch (err) {
    console.error('Error creating Supabase client:', err);
    throw err;
  }
};

// Global variable to track if Supabase is properly connected
let supabaseConnected = false;

// Test Supabase connection on page load
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Testing Supabase connection...');
  try {
    console.log('Supabase URL:', SUPABASE_URL);
    console.log('Using Supabase client library version:', supabase.version || 'unknown');
    
    const supabaseClient = createClient();
    console.log('Supabase client created');
    
    // First check if we can connect to Supabase at all
    console.log('Attempting to query beta_signups table...');
    const { data, error: connectionError } = await supabaseClient.from('beta_signups').select('count').limit(1);
    
    if (connectionError) {
      // If the error is about the table not existing, try to create it
      if (connectionError.message && connectionError.message.includes('does not exist')) {
        console.log('Table beta_signups does not exist. Please create it in your Supabase dashboard.');
      } else {
        console.error('Supabase connection test failed:', connectionError);
      }
    } else {
      console.log('Supabase connection successful! Data:', data);
      supabaseConnected = true;
    }
  } catch (err) {
    console.error('Exception during Supabase connection test:', err);
    console.error('Error details:', JSON.stringify(err));
  }
});

// Function to save beta sign-up data to Supabase
async function saveBetaSignup(name, email) {
  console.log('Attempting to save signup data for:', name, email);
  console.log('Current timestamp:', new Date().toISOString());
  
  // Always try to save data regardless of connection status
  // This helps us debug issues even if the initial connection test failed
  console.log('Supabase connection status:', supabaseConnected ? 'Connected' : 'Not connected');
  console.log('Will attempt to save data anyway for debugging purposes');
  
  try {
    console.log('Creating Supabase client...');
    const supabaseClient = createClient();
    
    const signupData = { name: name, email: email, signup_date: new Date().toISOString() };
    console.log('Preparing to insert data:', signupData);
    
    // Insert data into the 'beta_signups' table
    console.log('Inserting data into beta_signups table...');
    
    // Try a different approach - first check if we can query the table
    console.log('First checking if we can query the table...');
    const { data: testData, error: testError } = await supabaseClient
      .from('beta_signups')
      .select('*')
      .limit(1);
      
    if (testError) {
      console.error('Error querying table:', testError);
    } else {
      console.log('Successfully queried table, now attempting insert...');
    }
    
    // Try the simplest possible insert approach
    console.log('Attempting basic insert operation...');
    const { data, error } = await supabaseClient
      .from('beta_signups')
      .insert({
        name: name,
        email: email,
        signup_date: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error saving to Supabase:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      
      // If there's a table not found error, provide a helpful message
      if (error.message && error.message.includes('does not exist')) {
        console.log('The beta_signups table does not exist in your Supabase database.');
        console.log('Please create a table with these columns: name (text), email (text), signup_date (timestamp)');
      }
      // If there's a permission error
      else if (error.message && (error.message.includes('permission denied') || error.message.includes('new row violates'))) {
        console.log('Permission denied. You need to configure Row Level Security (RLS) in Supabase:');
        console.log('1. Go to Authentication > Policies in your Supabase dashboard');
        console.log('2. Find the beta_signups table');
        console.log('3. Click "New Policy" and create an INSERT policy with this SQL:');
        console.log('   CREATE POLICY "Enable inserts for everyone" ON "public"."beta_signups" FOR INSERT TO anon WITH CHECK (true);');
        console.log('4. Or temporarily enable "Bypass RLS" for development in the table settings');
      }
      return false;
    }
    
    console.log('Successfully saved to Supabase!');
    console.log('Response data:', data);
    return true;
  } catch (err) {
    console.error('Exception when saving to Supabase:', err);
    console.error('Error details:', JSON.stringify(err));
    return false;
  }
}
