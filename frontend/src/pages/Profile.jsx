import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();
  const location = useLocation();
  const backPath = location.state?.from || '/dashboard';
  
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [prevUser, setPrevUser] = useState(null);

  // Sync state when user loads (during render to avoid useEffect warnings)
  if (user !== prevUser) {
    setPrevUser(user);
    if (user && !profileData.name) {
      const data = { name: user.name, email: user.email };
      setProfileData(data);
      setEditForm(data);
    }
  }
  
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setEditForm({ name: profileData.name, email: profileData.email });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setProfileData({ name: editForm.name, email: editForm.email });
      setIsSaving(false);
      setIsEditing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  const handleDelete = () => {
    if (window.confirm('Are you absolutely sure? This will permanently delete your account and all associated data.')) {
      alert('Account deletion process initiated.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 flex justify-center relative overflow-hidden transition-colors duration-300 pb-24 md:pb-8">
      
      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 font-bold text-sm"
          >
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px]">✓</div>
            Changes saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl relative z-10">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <Link to={backPath} className="text-sm text-[#0ea5e9] hover:text-[#0284c7] dark:text-[#38bdf8] dark:hover:text-[#7dd3fc] font-semibold flex items-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {backPath === '/' ? 'Back to Home' : 'Back to Dashboard'}
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="md:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 bg-card border border-theme shadow-sm rounded-3xl text-center transition-colors duration-300"
            >
              <div className="w-24 h-24 rounded-full bg-[#f0f9ff] dark:bg-zinc-800 border-2 border-[#bae6fd] dark:border-zinc-700 text-[#0ea5e9] dark:text-[#38bdf8] flex items-center justify-center font-bold text-3xl mx-auto mb-4 overflow-hidden">
                {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <p className="text-sm text-muted-foreground font-medium mb-6">{profileData.email}</p>
              <button 
                onClick={() => alert('Avatar upload logic goes here.')} 
                className="w-full py-2.5 bg-background-alt border border-theme rounded-xl text-sm font-bold text-foreground hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Change Avatar
              </button>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="p-6 bg-card border border-theme shadow-sm rounded-3xl transition-colors duration-300"
            >
              <h3 className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-4 px-2">Subscription</h3>
              <div className="p-4 bg-background-alt rounded-2xl border border-theme mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-foreground">Pro Plan</span>
                  <span className="text-[10px] bg-[#e0f2fe] dark:bg-sky-950/50 text-[#0ea5e9] dark:text-[#38bdf8] px-2 py-0.5 rounded-full font-bold border border-[#bae6fd] dark:border-sky-900/50">ACTIVE</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium italic">Renews on May 20, 2026</p>
              </div>
              <Link to="/pricing" className="block w-full py-2.5 bg-[#0ea5e9] dark:bg-[#38bdf8] text-white dark:text-zinc-950 rounded-xl text-sm font-bold text-center hover:bg-[#0284c7] dark:hover:bg-[#7dd3fc] transition-all shadow-md">
                Manage Plan
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Details & Settings */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-card border border-theme shadow-sm rounded-3xl transition-colors duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Personal Information</h2>
                {!isEditing && (
                  <button onClick={handleEdit} className="text-sm font-bold text-[#0ea5e9] dark:text-[#38bdf8] hover:underline flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Edit
                  </button>
                )}
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-foreground/80 mb-2 px-1">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editForm.name} 
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-input border border-theme rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0ea5e9] focus:outline-none transition-all font-medium text-foreground" 
                    />
                  ) : (
                    <div className="w-full bg-transparent border border-transparent px-2 py-3 text-sm font-bold text-foreground">
                      {profileData.name}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground/80 mb-2 px-1">Email Address</label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={editForm.email} 
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      className="w-full bg-input border border-theme rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0ea5e9] focus:outline-none transition-all font-medium text-foreground" 
                    />
                  ) : (
                    <div className="w-full bg-transparent border border-transparent px-2 py-3 text-sm font-bold text-foreground">
                      {profileData.email}
                    </div>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-8 flex justify-end gap-3">
                  <button 
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all border border-theme"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg min-w-[140px] flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Security */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="p-8 bg-card border border-theme shadow-sm rounded-3xl transition-colors duration-300"
            >
              <h2 className="text-xl font-bold mb-6">Security</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background-alt rounded-2xl border border-theme">
                  <div>
                    <h4 className="text-sm font-bold">Password</h4>
                    <p className="text-xs text-muted-foreground font-medium">Last changed 3 months ago</p>
                  </div>
                  <button onClick={() => alert('Password update logic prompted.')} className="text-sm font-bold text-[#0ea5e9] dark:text-[#38bdf8] hover:underline">Update</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-background-alt rounded-2xl border border-theme">
                  <div>
                    <h4 className="text-sm font-bold">Two-Factor Authentication</h4>
                    <p className="text-xs text-muted-foreground font-medium">Add an extra layer of security</p>
                  </div>
                  <button onClick={() => alert('2FA setup sequence initiated.')} className="text-sm font-bold text-[#0ea5e9] dark:text-[#38bdf8] hover:underline">Enable</button>
                </div>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="p-8 bg-card border border-red-500/20 dark:border-red-900/30 shadow-sm rounded-3xl bg-red-50/5 dark:bg-red-900/5"
            >
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
              <p className="text-sm text-muted-foreground font-medium mb-6">Once you delete your account, there is no going back. Please be certain.</p>
              <button 
                onClick={handleDelete}
                className="px-6 py-2.5 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-md shadow-red-100 dark:shadow-none"
              >
                Delete Account
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

