type RegisteredUniversity = {
  uniId: string;
  name: string;
  email: string;
  address?: string;
  certificates?: string;
  password?: string;
};

const REGISTERED_KEY = 'jh_registered_universities_v1';

function loadRegistered(): Record<string, RegisteredUniversity> {
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {};
}

function saveRegistered(m: Record<string, RegisteredUniversity>) {
  try { localStorage.setItem(REGISTERED_KEY, JSON.stringify(m)); } catch (e) {}
}

export const registeredUniversities: Record<string, RegisteredUniversity> = loadRegistered();

export function validateUniversityId(id: string) {
  // Expected format: UNI-YYYY-NNNN (similar to hospitals)
  return /^UNI-\d{4}-\d{4}$/.test(id);
}

export function validateUniversityEmail(email: string, universityName: string) {
  try {
    const lowerEmail = email.toLowerCase();
    const lowerName = universityName.toLowerCase();
    // Email must contain university name and end with professional university domain
    const hasName = lowerEmail.includes(lowerName.split(' ')[0]); // check first word of university name
    const hasDomain = lowerEmail.endsWith('.ac.in') || lowerEmail.endsWith('.edu.in') || lowerEmail.endsWith('.res.in');
    return hasName && hasDomain;
  } catch (e) { return false; }
}

export function registerUniversity(u: RegisteredUniversity) {
  // local fallback registration (used for hospitals or offline mode)
  if (registeredUniversities[u.uniId]) return false;
  registeredUniversities[u.uniId] = u;
  saveRegistered(registeredUniversities);
  return true;
}

export function authenticateUniversity(uniId: string, password: string) {
  // local authentication fallback
  const u = registeredUniversities[uniId];
  if (!u) return false;
  return u.password === password;
}

// --- new API helper functions ------------------------------------------------

// wrapper around fetch to our Django API endpoints
async function apiFetch(path: string, options: RequestInit = {}) {
  const url = `${window.location.origin}/accounts/${path}`;
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/**
 * Register using backend instead of localStorage.
 * Returns true on success, false on failure.
 */
export async function apiRegisterUniversity(u: RegisteredUniversity) {
  const resp = await apiFetch('register/', { method: 'POST', body: JSON.stringify({
    username: u.uniId,
    password: u.password,
    email: u.email,
    university_info: {
      university_name: u.name,
      university_registration_number: u.uniId,
      address: u.address,
      registration_certificate_file: u.certificates,
    },
  })});
  return resp.ok;
}

/**
 * Authenticate against backend JWT login endpoint.
 * On success stores token in localStorage and returns true.
 */
export async function apiLoginUniversity(uniId: string, password: string) {
  const resp = await apiFetch('login/', { method: 'POST', body: JSON.stringify({ username: uniId, password }) });
  if (resp.ok && resp.data.access) {
    try { localStorage.setItem('jh_university_token', resp.data.access); } catch (e) {}
    return true;
  }
  return false;
}
