import type { ToolbarProps } from '@/types/ui';

export function Toolbar({ selectedTool, onSelectTool }: ToolbarProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '10px',
      padding: '10px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    }}>
      <button
        onClick={() => onSelectTool(selectedTool === 'grass' ? null : 'grass')}
        style={{
          padding: '10px 20px',
          fontSize: '24px',
          cursor: 'pointer',
          border: selectedTool === 'grass' ? '3px solid green' : '1px solid #ccc',
          borderRadius: '4px',
          background: selectedTool === 'grass' ? '#e8f5e9' : 'white',
        }}
        title="Plant Grass"
      >
        🌱
      </button>
    </div>
  );
}
