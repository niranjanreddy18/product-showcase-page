import { GraduationCap, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  validateUniversityId,
  validateUniversityEmail,
  registerUniversity,
  authenticateUniversity,
} from "@/lib/universities";

type UniversityRegisterFormProps = { onRegistered: (result: string) => void };

const UniversityRegisterForm = ({ onRegistered }: UniversityRegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [certificates, setCertificates] = useState('');
  const [uniId, setUniId] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const tryRegister = () => {
    if (!name || !email || !uniId || !password) { alert('Please fill required fields'); return; }
    if (!validateUniversityEmail(email, name)) { alert('University email must contain the university name and end with .ac.in, .edu.in or .res.in'); return; }
    if (!validateUniversityId(uniId)) { alert('University ID must follow UNI-YYYY-NNNN format'); return; }
    if (password.length < 6) { alert('Password must be at least 6 characters'); return; }
    if (password !== confirm) { alert('Passwords do not match'); return; }
    const result = registerUniversity({ uniId, name, email, address, certificates, password });
    onRegistered(result);
  };

  return (
    <div className="space-y-3">
      <div><Label>University Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" /></div>
      <div><Label>University Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@iitd.ac.in" className="mt-1" /></div>
      <div><Label>Address</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" /></div>
      <div><Label>Verified Certificates (document)</Label><Input type="file" onChange={(e) => { const f = (e.target as HTMLInputElement).files?.[0]; setCertificates(f ? f.name : ''); }} className="mt-1" />{certificates && <p className="text-xs text-muted-foreground mt-1">Selected: {certificates}</p>}</div>
      <div><Label>University ID</Label><Input value={uniId} onChange={(e) => setUniId(e.target.value)} placeholder="UNI-2024-0001" className="mt-1" /></div>
      <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1" /></div>
      <div><Label>Confirm Password</Label><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1" /></div>
      <Button className="w-full bg-accent text-accent-foreground" onClick={tryRegister}>Create Account</Button>
    </div>
  );
};

const UniversityPortal = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [uniId, setUniId] = useState('');
  const [uniPass, setUniPass] = useState('');
  const [pendingMessage, setPendingMessage] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [view, setView] = useState<'dashboard' | 'approved' | 'payments' | 'reports' | 'profile'>('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1] || 'dashboard';
    if (['dashboard', 'approved', 'payments', 'reports', 'profile'].includes(last)) {
      setView(last as any);
    } else if (location.pathname.endsWith('/university')) {
      setView('dashboard');
    }
  }, [location.pathname]);

  const approvedPatients = [
    { name: 'Meena Devi', hospital: 'Fortis Hospital', amount: '₹60,000', status: 'Approved' },
    { name: 'Anjali Verma', hospital: 'Max Healthcare', amount: '₹45,000', status: 'Approved' },
    { name: 'Ravi Kumar', hospital: 'City Hospital', amount: '₹75,000', status: 'Approved' },
  ];
  const paymentHistory = [
    { date: '2026-02-20', patient: 'Meena Devi', amount: '₹60,000', status: 'Paid' },
    { date: '2026-02-18', patient: 'Anjali Verma', amount: '₹45,000', status: 'Paid' },
    { date: '2026-02-15', patient: 'Ravi Kumar', amount: '₹75,000', status: 'Paid' },
  ];
  const reports = [
    { caseId: 'JD-2847', hospital: 'AIIMS Delhi', report: 'View' },
    { caseId: 'JD-2845', hospital: 'CMC Vellore', report: 'View' },
  ];

  if (!loggedIn) {
    return (
      <div className="py-10">
        <div className="container max-w-3xl">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">University Login / Register</h1>
                <p className="text-sm text-muted-foreground">Sign in with your University ID or create a new account</p>
              </div>
            </div>

            {pendingMessage && (
              <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/30 text-sm text-foreground">
                <p className="font-semibold mb-1">⏳ Registration Submitted</p>
                <p>{pendingMessage}</p>
              </div>
            )}

            <div className="flex space-x-2 mb-6">
              <button className={`px-4 py-2 rounded ${mode === 'login' ? 'bg-primary text-primary-foreground' : 'bg-muted/10'}`} onClick={() => { setMode('login'); setPendingMessage(''); }}>Login</button>
              <button className={`px-4 py-2 rounded ${mode === 'register' ? 'bg-primary text-primary-foreground' : 'bg-muted/10'}`} onClick={() => { setMode('register'); setPendingMessage(''); }}>Register</button>
            </div>

            {mode === 'login' ? (
              <div className="p-4 bg-muted/10 rounded-md">
                <h2 className="font-semibold mb-3">University Login</h2>
                <div className="space-y-3">
                  <div><Label>University ID</Label><Input value={uniId} onChange={(e) => setUniId(e.target.value)} placeholder="UNI-2024-0001" className="mt-1" /></div>
                  <div><Label>Password</Label><Input type="password" value={uniPass} onChange={(e) => setUniPass(e.target.value)} className="mt-1" /></div>
                  <Button className="w-full bg-primary text-primary-foreground" onClick={() => {
                    if (!uniId || !uniPass) { alert('Please enter university ID and password'); return; }
                    const result = authenticateUniversity(uniId, uniPass);
                    if (result.ok) {
                      setLoggedIn(true);
                      navigate('/university/dashboard');
                    } else if (result.reason === 'pending_approval') {
                      alert('Your registration is pending admin approval. Please wait for the admin to approve your account.');
                    } else if (result.reason === 'rejected') {
                      alert('Your registration has been rejected by the admin. Please contact support.');
                    } else {
                      alert('Invalid credentials or not registered');
                    }
                  }}>
                    <LogIn className="w-4 h-4 mr-2" /> Sign In
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-muted/10 rounded-md">
                <h2 className="font-semibold mb-3">University Registration</h2>
                <UniversityRegisterForm onRegistered={(result) => {
                  if (result === 'pending') {
                    setPendingMessage('Your registration has been submitted and is awaiting admin approval. You will be able to log in once approved.');
                    setMode('login');
                  } else {
                    alert('Registration failed: university already registered');
                  }
                }} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <nav className="w-64 bg-slate-50 border-r border-border p-6">
        <h2 className="text-lg font-bold mb-6">College Management</h2>
        <ul className="space-y-3 text-sm">
          <li><button className={`w-full text-left ${view === 'dashboard' ? 'font-semibold text-accent' : ''}`} onClick={() => navigate('/university/dashboard')}>Dashboard</button></li>
          <li><button className={`w-full text-left ${view === 'approved' ? 'font-semibold text-accent' : ''}`} onClick={() => navigate('/university/approved')}>Approved Patients</button></li>
          <li><button className={`w-full text-left ${view === 'payments' ? 'font-semibold text-accent' : ''}`} onClick={() => navigate('/university/payments')}>Payments</button></li>
          <li><button className={`w-full text-left ${view === 'reports' ? 'font-semibold text-accent' : ''}`} onClick={() => navigate('/university/reports')}>Reports</button></li>
          <li><button className={`w-full text-left ${view === 'profile' ? 'font-semibold text-accent' : ''}`} onClick={() => navigate('/university/profile')}>Profile</button></li>
        </ul>
      </nav>

      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-foreground">{view.charAt(0).toUpperCase() + view.slice(1)}</h1>
          <Button variant="outline" size="sm" onClick={() => { setLoggedIn(false); navigate('/university'); }}>Sign Out</Button>
        </div>

        {view === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-xl p-5"><p className="text-sm text-muted-foreground">Total Approved</p><p className="text-2xl font-bold">124</p></div>
              <div className="bg-card rounded-xl p-5"><p className="text-sm text-muted-foreground">Total Disbursed</p><p className="text-2xl font-bold">₹48,50,000</p></div>
              <div className="bg-card rounded-xl p-5"><p className="text-sm text-muted-foreground">Payments Done</p><p className="text-2xl font-bold">98</p></div>
              <div className="bg-card rounded-xl p-5"><p className="text-sm text-muted-foreground">Pending Payments</p><p className="text-2xl font-bold">26</p></div>
            </div>
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50"><th className="text-left px-5 py-3 font-medium text-muted-foreground">Patient</th><th className="text-left px-5 py-3 font-medium text-muted-foreground">Hospital</th><th className="text-left px-5 py-3 font-medium text-muted-foreground">Amount</th><th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th></tr></thead>
                <tbody>{approvedPatients.map((p, idx) => (<tr key={idx} className="border-b border-border last:border-0"><td className="px-5 py-3">{p.name}</td><td className="px-5 py-3">{p.hospital}</td><td className="px-5 py-3 font-semibold">{p.amount}</td><td className="px-5 py-3 text-success">{p.status}</td></tr>))}</tbody>
              </table>
            </div>
          </>
        )}

        {view === 'approved' && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50"><th className="text-left px-5 py-3 font-medium text-muted-foreground">Name</th><th className="text-left px-5 py-3 font-medium text-muted-foreground">Hospital</th><th className="text-left px-5 py-3 font-medium text-muted-foreground">Amount</th><th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th></tr></thead>
              <tbody>{approvedPatients.map((p, idx) => (<tr key={idx} className="border-b border-border last:border-0"><td className="px-5 py-3">{p.name}</td><td className="px-5 py-3">{p.hospital}</td><td className="px-5 py-3 font-semibold">{p.amount}</td><td className="px-5 py-3 text-success">{p.status}</td></tr>))}</tbody>
            </table>
          </div>
        )}

        {view === 'payments' && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50"><th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th><th className="text-left px-5 py-3 font-medium text-muted-foreground">Patient</th><th className="text-left px-5 py-3 font-medium text-muted-foreground">Amount</th><th className="text-left px-5 py-3 font-medium text-muted-foreground">Status</th></tr></thead>
              <tbody>{paymentHistory.map((p, idx) => (<tr key={idx} className="border-b border-border last:border-0"><td className="px-5 py-3">{p.date}</td><td className="px-5 py-3">{p.patient}</td><td className="px-5 py-3 font-semibold">{p.amount}</td><td className="px-5 py-3 text-success">{p.status}</td></tr>))}</tbody>
            </table>
          </div>
        )}

        {view === 'reports' && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50"><th className="text-left px-5 py-3 font-medium text-muted-foreground">Case ID</th><th className="text-left px-5 py-3 font-medium text-muted-foreground">Hospital</th><th className="text-left px-5 py-3 font-medium text-muted-foreground">Report</th></tr></thead>
              <tbody>{reports.map((r, idx) => (<tr key={idx} className="border-b border-border last:border-0"><td className="px-5 py-3 font-mono">{r.caseId}</td><td className="px-5 py-3">{r.hospital}</td><td className="px-5 py-3"><Button size="sm" variant="ghost">{r.report}</Button></td></tr>))}</tbody>
            </table>
          </div>
        )}

        {view === 'profile' && (
          <div className="space-y-2">
            <p><strong>University ID:</strong> {uniId}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default UniversityPortal;
