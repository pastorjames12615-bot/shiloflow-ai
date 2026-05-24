// Future backend integration placeholders for Shiloflow AI.
// This file documents where production services should be wired after GitHub/Vercel upload.

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSupabaseConfig() {
  return {
    url: getRequiredEnv('SUPABASE_URL'),
    serviceRoleKey: getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
    anonKey: process.env.SUPABASE_ANON_KEY || ''
  };
}

function getOpenAIConfig() {
  return {
    apiKey: getRequiredEnv('OPENAI_API_KEY')
  };
}

function getStripeConfig() {
  return {
    secretKey: getRequiredEnv('STRIPE_SECRET_KEY'),
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
  };
}

module.exports = {
  getSupabaseConfig,
  getOpenAIConfig,
  getStripeConfig
};
