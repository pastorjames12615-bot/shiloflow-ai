// Vercel serverless placeholder for Shiloflow AI lead/waitlist submissions.
//
// Production integration points:
// - Supabase Auth: identify signed-in workspace users before accepting private workspace data.
// - Supabase Database: insert leads into a `leads` or `waitlist_submissions` table.
// - OpenAI API: generate onboarding summaries or internal lead routing notes after consent.
// - Stripe: connect plan selection, trial creation, and customer billing when pricing launches.
//
// This temporary endpoint intentionally does not persist data yet. It returns success so the
// production frontend can be deployed safely while the real backend is being connected.

const REQUIRED_FIELDS = ['name', 'church', 'email', 'role', 'volume', 'bottleneck'];

function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email || ''));
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
  const missing = REQUIRED_FIELDS.filter((field) => !body[field]);

  if (missing.length > 0) {
    return res.status(400).json({ ok: false, error: 'Missing required fields', missing });
  }

  if (!isValidEmail(body.email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address' });
  }

  const submission = {
    id: `lead_${Date.now()}`,
    receivedAt: new Date().toISOString(),
    status: 'accepted-temporary',
    nextStep: 'Connect this endpoint to Supabase, CRM, email automation, or another production backend.'
  };

  return res.status(202).json({ ok: true, submission });
};
