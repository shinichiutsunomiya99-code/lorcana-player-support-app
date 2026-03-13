import React, { useRef } from 'react';
import { Download, Upload, Trash2, Smartphone, ShieldCheck, AlertTriangle } from 'lucide-react';

const Settings = ({ data }) => {
  const { exportData, importData } = data;
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lorcana_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm('データを復元しますか？現在のデータはすべて上書きされます。')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importData(event.target.result);
      if (success) {
        alert('データを復元しました。アプリを再起動します。');
      } else {
        alert('復元に失敗しました。ファイル形式が正しくない可能性があります。');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('【警告】すべてのデータを削除しますか？この操作は取り消せません。')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="settings-page fade-in">
      <h1 style={{ fontFamily: 'Cinzel, serif', letterSpacing: '1px' }}>Settings & Magic</h1>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
          <Smartphone size={24} color="var(--accent)" />
          <div>
            <div style={{ fontWeight: 700 }}>PWA運用・オフライン</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>このアプリは端末にインストールして使用できます。</div>
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
          ブラウザの「ホーム画面に追加」メニューからインストールすると、オフラインでも快適に動作し、フルスクリーンで利用可能です。
        </p>
      </div>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} /> データ管理
        </h2>
        <div className="card">
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1.5rem' }}>
            データはブラウザのLocalStorageに保存されています。端末変更やデータ消失に備えて、定期的なファイルバックアップを推奨します。
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={handleExport} style={{ justifyContent: 'center' }}>
              <Download size={18} />
              <span>データをエクスポート</span>
            </button>
            <button className="btn card" onClick={() => fileInputRef.current?.click()} style={{ justifyContent: 'center', border: '1px solid var(--border)' }}>
              <Upload size={18} />
              <span>データから復元 (Import)</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".json" 
              onChange={handleImport} 
            />
          </div>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={20} /> 危険な操作
        </h2>
        <div className="card" style={{ border: '1px solid #ef444433' }}>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1rem' }}>
            すべてのデータ（デッキ、試合、プロフ等）をリセットします。
          </p>
          <button className="btn" onClick={clearAllData} style={{ color: '#ef4444', width: '100%', justifyContent: 'center' }}>
            <Trash2 size={18} />
            <span>全データを削除</span>
          </button>
        </div>
      </section>

      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', opacity: 0.4 }}>
        Disney Lorcana Player Support v1.2<br />
        Built with Antigravity
      </div>
    </div>
  );
};

export default Settings;
