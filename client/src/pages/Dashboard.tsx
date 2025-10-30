import { useState } from 'react';
import { getSummary } from '../api/reports';
import type { ReportSummary } from '../types/reports';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { admin, logout } = useAuth();
  const [report, setReport] = useState<ReportSummary | null>(null);

  async function load() {
    const data = await getSummary();
    setReport(data);
  }

  return (
    <div style={{ padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>Logged in as {admin?.email}</div>
        <button onClick={logout}>Logout</button>
      </header>
      <h2>Report</h2>
      <button onClick={load}>Load Summary</button>
      {report && (
        <pre style={{ marginTop: 16 }}>{JSON.stringify(report, null, 2)}</pre>
      )}
    </div>
  );
}
