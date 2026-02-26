'use client';

import { useState, useEffect } from 'react';

export default function NotionConnect({ isConnected, connectedAt, notionUrl }) {
  const [status, setStatus] = useState(isConnected ? 'connected' : 'idle');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get('notion');

    if (result === 'connected') setStatus('connected');
    if (result === 'error') setStatus('error');
    if (result === 'declined') setStatus('idle');

    if (result) {
      const url = new URL(window.location.href);
      url.searchParams.delete('notion');
      window.history.replaceState({}, '', url);
    }
  }, []);

  if (status === 'connected') {
    return (
      <div style={styles.card}>
        <div style={styles.row}>
          <span style={styles.icon}>📊</span>
          <div style={{ flex: 1 }}>
            <p style={styles.title}>Notion Connected</p>
            <p style={styles.sub}>
              Your tracker updates automatically with every challenge.
              {connectedAt && ` Connected ${new Date(connectedAt).toLocaleDateString()}.`}
            </p>
          </div>
          <div style={styles.actions}>
            <span style={styles.badge}>Active</span>
            {notionUrl && (
              <a href={notionUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                Open in Notion
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.row}>
        <span style={styles.icon}>📋</span>
        <div style={{ flex: 1 }}>
          <p style={styles.title}>Connect Notion</p>
          <p style={styles.sub}>
            Get a personal tracker in your own Notion workspace.
            Pre-filled with your roadmap and challenges. Updates automatically.
          </p>
        </div>
        <button onClick={() => window.location.href = '/api/notion/connect'} style={styles.btn}>
          Connect Notion
        </button>
      </div>
      {status === 'error' && (
        <p style={styles.error}>Something went wrong. Please try again.</p>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: '#f0f7f1',
    border: '1.5px solid #d4e8d8',
    borderRadius: 12,
    padding: '16px 20px',
    marginBottom: 16,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  icon: {
    fontSize: 28,
    flexShrink: 0,
  },
  title: {
    fontWeight: 700,
    fontSize: 14,
    color: '#1e3d28',
    margin: 0,
  },
  sub: {
    fontSize: 12,
    color: '#64748b',
    margin: '4px 0 0',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    background: '#1e3d28',
    color: '#fff',
    borderRadius: 8,
    padding: '4px 10px',
    fontSize: 11,
    fontWeight: 700,
  },
  link: {
    fontSize: 12,
    color: '#3d6b47',
    fontWeight: 600,
    textDecoration: 'none',
  },
  btn: {
    background: '#1e3d28',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    flexShrink: 0,
  },
  error: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 8,
  },
};