import { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Save,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Settings
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your FlowOps account and preferences.
          </p>
        </div>

        {/* Profile */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-indigo-500/10">
              <User className="w-5 h-5 text-indigo-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Profile
              </h2>

              <p className="text-sm text-slate-400">
                Update your personal information.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {/* Name */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-slate-950/60 border border-slate-800 text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed"
              />
            </div>

          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-medium"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>

            {saved && (
              <span className="text-sm text-emerald-400">
                Changes saved
              </span>
            )}
          </div>
        </section>

        {/* Security */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3">

            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Security
              </h2>

              <p className="text-sm text-slate-400">
                Your account is protected with JWT authentication.
              </p>
            </div>

          </div>

          <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-sm text-slate-300">
              Authentication status
            </p>

            <p className="text-sm text-emerald-400 mt-1">
              ● Authenticated
            </p>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3">

            <div className="p-2 rounded-lg bg-amber-500/10">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Notifications
              </h2>

              <p className="text-sm text-slate-400">
                Notification preferences can be configured here.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}

export default Settings;