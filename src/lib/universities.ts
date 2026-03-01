export type RegisteredUniversity = {
  uniId: string;
  name: string;
  email: string;
  address?: string;
  certificates?: string;
  password?: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: number;
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
  return /^UNI-\d{4}-\d{4}$/.test(id);
}

export function validateUniversityEmail(email: string, universityName: string) {
  try {
    const lowerEmail = email.toLowerCase();
    const lowerName = universityName.toLowerCase();
    const hasName = lowerEmail.includes(lowerName.split(' ')[0]);
    const hasDomain = lowerEmail.endsWith('.ac.in') || lowerEmail.endsWith('.edu.in') || lowerEmail.endsWith('.res.in');
    return hasName && hasDomain;
  } catch (e) { return false; }
}

export function registerUniversity(u: Omit<RegisteredUniversity, 'status' | 'registeredAt'>): 'pending' | 'exists' {
  if (registeredUniversities[u.uniId]) return 'exists';
  registeredUniversities[u.uniId] = { ...u, status: 'pending', registeredAt: Date.now() };
  saveRegistered(registeredUniversities);
  window.dispatchEvent(new CustomEvent('jh:pending-updated'));
  return 'pending';
}

export function authenticateUniversity(uniId: string, password: string): { ok: boolean; reason?: string } {
  const u = registeredUniversities[uniId];
  if (!u) return { ok: false, reason: 'not_found' };
  if (u.password !== password) return { ok: false, reason: 'wrong_password' };
  if (u.status === 'pending') return { ok: false, reason: 'pending_approval' };
  if (u.status === 'rejected') return { ok: false, reason: 'rejected' };
  return { ok: true };
}

export function getPendingUniversityRegistrations(): RegisteredUniversity[] {
  return Object.values(registeredUniversities).filter(u => u.status === 'pending');
}

export function approveUniversityRegistration(uniId: string) {
  const u = registeredUniversities[uniId];
  if (!u) return false;
  u.status = 'approved';
  saveRegistered(registeredUniversities);
  window.dispatchEvent(new CustomEvent('jh:pending-updated'));
  return true;
}

export function rejectUniversityRegistration(uniId: string) {
  const u = registeredUniversities[uniId];
  if (!u) return false;
  u.status = 'rejected';
  saveRegistered(registeredUniversities);
  window.dispatchEvent(new CustomEvent('jh:pending-updated'));
  return true;
}
