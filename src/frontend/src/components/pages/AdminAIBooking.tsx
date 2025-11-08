import React, { useState } from 'react';
import { mcpInvoke } from '../lib/mcpClient';
import { useAuth } from '../AuthContext'; // you uploaded this
// if you added the helper:
export const getNumericUserId = (id: string | number) => {
  const n = typeof id === 'number' ? id : parseInt(String(id).replace(/\D/g, ''), 10);
  return Number.isFinite(n) ? n : 1;
};

const AdminAIBooking: React.FC = () => {
  const { user } = useAuth?.() ?? { user: undefined };
  const token = import.meta.env.VITE_MCP_TOKEN as string | undefined;

  const [timeslotId, setTimeslotId] = useState<number>(42);
  const [candidateRoomIds, setCandidateRoomIds] = useState<string>('101,102,201');
  const [available, setAvailable] = useState<number[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<any>(null);

  const search = async () => {
    setErr(null); setBusy(true); setAvailable(null); setConfirm(null);
    try {
      const ids = candidateRoomIds.split(',').map(s => Number(s.trim())).filter(Boolean);
      const out = await mcpInvoke<{timeslotId:number; candidateRoomIds:number[]}, number[]>('searchRooms', { timeslotId, candidateRoomIds: ids }, token);
      setAvailable(out);
    } catch (e:any) { setErr(e.message ?? String(e)); } finally { setBusy(false); }
  };

  const book = async (roomId: number) => {
    setErr(null); setBusy(true); setConfirm(null);
    try {
      const requestedByUserId = user?.id ? getNumericUserId(user.id as any) : 1;
      const b = await mcpInvoke('bookRoom', { requestedByUserId, roomId, timeslotId, title: 'AI Agent Hold' }, token);
      setConfirm(b);
    } catch (e:any) { setErr(e.message ?? String(e)); } finally { setBusy(false); }
  };

  return (
    <div className="generic-page">
      <header className="page-header">
        <button className="back-button" onClick={() => history.back()}>← Back</button>
        <h1>AI Agent – Room Booking</h1>
      </header>
      <main className="page-content">
        <div className="page-card">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:12 }}>
            <label>
              <div>Timeslot ID</div>
              <input type="number" value={timeslotId} onChange={e=>setTimeslotId(Number(e.target.value))}/>
            </label>
            <label>
              <div>Candidate Room IDs</div>
              <input value={candidateRoomIds} onChange={e=>setCandidateRoomIds(e.target.value)} placeholder="101,102,201" />
            </label>
            <button className="action-button" onClick={search} disabled={busy}>{busy ? 'Searching…' : 'Find Available'}</button>
          </div>

          {err && <div style={{ color:'#c00', marginTop:10 }}>Error: {err}</div>}

          {available && (
            <div style={{ marginTop:16 }}>
              <h3>Available Rooms</h3>
              {available.length === 0 ? (
                <div>No rooms available.</div>
              ) : (
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {available.map(rid => (
                    <button key={rid} className="action-button" onClick={() => book(rid)}>Book Room {rid}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          {confirm && (
            <div style={{ marginTop:16, border:'1px solid #dee2e6', borderRadius:8, padding:12 }}>
              <div style={{ fontWeight:700 }}>Booking confirmed</div>
              <pre style={{ margin:0 }}>{JSON.stringify(confirm, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default AdminAIBooking;
