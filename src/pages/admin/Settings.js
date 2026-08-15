import { useState } from "react";
import { Building2, Clock, Shield, Bell, Users, Save } from "lucide-react";
import { adminSettings as initialSettings } from "../../data/adminData";

const TABS = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "hours", label: "Hours", icon: Clock },
  { id: "policies", label: "Policies", icon: Shield },
  { id: "admins", label: "Admin Users", icon: Users },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function Settings() {
  const [tab, setTab] = useState("company");
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateCompany = (key, value) => setSettings({ ...settings, company: { ...settings.company, [key]: value } });
  const updateHours = (key, value) => setSettings({ ...settings, hours: { ...settings.hours, [key]: value } });
  const updatePolicy = (key, value) => setSettings({ ...settings, policies: { ...settings.policies, [key]: value } });
  const updateNotification = (key, value) => setSettings({ ...settings, notifications: { ...settings.notifications, [key]: value } });
  const updateSecurity = (key, value) => setSettings({ ...settings, security: { ...settings.security, [key]: value } });

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab sidebar */}
        <div className="lg:w-56 shrink-0">
          <div className="flex lg:flex-col gap-2 overflow-x-auto no-scrollbar">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  tab === t.id ? "bg-primary-600 text-white shadow-soft" : "text-ink-600 hover:bg-ink-50"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {/* Company */}
          {tab === "company" && (
            <div className="card p-6">
              <h3 className="font-bold text-ink-900 mb-1">Company Information</h3>
              <p className="text-xs text-ink-500 mb-5">Manage your company details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company Name" value={settings.company.name} onChange={(v) => updateCompany("name", v)} />
                <Field label="Email" value={settings.company.email} onChange={(v) => updateCompany("email", v)} />
                <Field label="Phone" value={settings.company.phone} onChange={(v) => updateCompany("phone", v)} />
                <Field label="Website" value={settings.company.website} onChange={(v) => updateCompany("website", v)} />
                <div className="sm:col-span-2"><Field label="Address" value={settings.company.address} onChange={(v) => updateCompany("address", v)} /></div>
              </div>
              <SaveButton onSave={handleSave} saved={saved} />
            </div>
          )}

          {/* Hours */}
          {tab === "hours" && (
            <div className="card p-6">
              <h3 className="font-bold text-ink-900 mb-1">Operating Hours</h3>
              <p className="text-xs text-ink-500 mb-5">When your business is open</p>
              <div className="space-y-4">
                <Field label="Weekday Hours" value={settings.hours.weekday} onChange={(v) => updateHours("weekday", v)} />
                <Field label="Weekend Hours" value={settings.hours.weekend} onChange={(v) => updateHours("weekend", v)} />
                <Field label="Holiday Hours" value={settings.hours.holiday} onChange={(v) => updateHours("holiday", v)} />
              </div>
              <SaveButton onSave={handleSave} saved={saved} />
            </div>
          )}

          {/* Policies */}
          {tab === "policies" && (
            <div className="card p-6">
              <h3 className="font-bold text-ink-900 mb-1">Cancellation & Deposit Policies</h3>
              <p className="text-xs text-ink-500 mb-5">Manage booking policies</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberField label="Cancellation Window (hours)" value={settings.policies.cancellationWindow} onChange={(v) => updatePolicy("cancellationWindow", v)} />
                <NumberField label="Cancellation Fee (%)" value={settings.policies.cancellationFee} onChange={(v) => updatePolicy("cancellationFee", v)} />
                <NumberField label="Deposit Amount ($)" value={settings.policies.depositAmount} onChange={(v) => updatePolicy("depositAmount", v)} />
                <NumberField label="Deposit Refund (days)" value={settings.policies.depositRefundDays} onChange={(v) => updatePolicy("depositRefundDays", v)} />
              </div>
              <SaveButton onSave={handleSave} saved={saved} />
            </div>
          )}

          {/* Admin Users */}
          {tab === "admins" && (
            <div className="card p-6">
              <h3 className="font-bold text-ink-900 mb-1">Admin Users</h3>
              <p className="text-xs text-ink-500 mb-5">Team members with admin access</p>
              <div className="space-y-3">
                {settings.adminUsers.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-ink-100 hover:bg-ink-50/40">
                    <div className="h-10 w-10 rounded-full bg-primary-50 text-primary-700 flex items-center justify-center font-bold shrink-0">{a.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink-900 text-sm truncate">{a.name}</p>
                      <p className="text-xs text-ink-500 truncate">{a.email}</p>
                    </div>
                    <span className="badge bg-primary-50 text-primary-700 shrink-0">{a.role}</span>
                    <span className="text-xs text-ink-400 hidden sm:block shrink-0">Last active: {a.lastActive}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary mt-4">+ Add Admin User</button>
            </div>
          )}

          {/* Security */}
          {tab === "security" && (
            <div className="card p-6">
              <h3 className="font-bold text-ink-900 mb-1">Security Settings</h3>
              <p className="text-xs text-ink-500 mb-5">Protect your admin panel</p>
              <div className="space-y-4">
                <Toggle label="Two-Factor Authentication" desc="Require a second verification step" checked={settings.security.twoFactor} onChange={(v) => updateSecurity("twoFactor", v)} />
                <NumberField label="Session Timeout (minutes)" value={settings.security.sessionTimeout} onChange={(v) => updateSecurity("sessionTimeout", v)} />
                <NumberField label="Password Expiry (days)" value={settings.security.passwordExpiry} onChange={(v) => updateSecurity("passwordExpiry", v)} />
                <NumberField label="Max Login Attempts" value={settings.security.loginAttempts} onChange={(v) => updateSecurity("loginAttempts", v)} />
              </div>
              <SaveButton onSave={handleSave} saved={saved} />
            </div>
          )}

          {/* Notifications */}
          {tab === "notifications" && (
            <div className="card p-6">
              <h3 className="font-bold text-ink-900 mb-1">Notification Preferences</h3>
              <p className="text-xs text-ink-500 mb-5">Choose what alerts you receive</p>
              <div className="space-y-3">
                {Object.entries(settings.notifications).map(([key, val]) => (
                  <Toggle key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())} checked={val} onChange={(v) => updateNotification(key, v)} />
                ))}
              </div>
              <SaveButton onSave={handleSave} saved={saved} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label className="label text-xs">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="form-field" />
    </div>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <div>
      <label className="label text-xs">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="form-field" />
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-semibold text-ink-900">{label}</p>
        {desc && <p className="text-xs text-ink-500 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-primary-600" : "bg-ink-200"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "left-0.5 translate-x-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function SaveButton({ onSave, saved }) {
  return (
    <div className="mt-6 flex items-center gap-3">
      <button onClick={onSave} className="btn btn-primary"><Save className="h-4 w-4" /> Save Changes</button>
      {saved && <span className="text-sm text-success-600 font-medium">Saved successfully</span>}
    </div>
  );
}
