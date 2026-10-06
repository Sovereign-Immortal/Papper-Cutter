import React from 'react';

export const StatusBar: React.FC = () => {
  return (
    <div className="android-status-bar">
      <span>09:41</span>
      <div className="camera-cutout" />
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 600 }}>5G</span>
        <span>📶</span>
        <span>🔋 98%</span>
      </div>
    </div>
  );
};
