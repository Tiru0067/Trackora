const SettingsPage = () => {
  return (
    <div>
      <header className="page-header">
        <span className="page-section">§ Account</span>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences and application settings</p>
      </header>
      
      <div className="p-4 rounded-xl border border-(--line) bg-(--bg-card)">
        <p className="text-(--ink-soft)">Settings content will go here.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
