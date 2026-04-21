import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@student.edu');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
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
    <div className="min-h-screen bg-[#fafafa] text-slate-900 p-8 flex justify-center relative overflow-hidden">
      
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
          <Link to="/dashboard" className="text-sm text-[#0ea5e9] hover:underline font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Profile Card */}
          <div className="md:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 bg-white border border-slate-200 shadow-sm rounded-3xl text-center"
            >
              <div className="w-24 h-24 rounded-full bg-[#f0f9ff] border-2 border-[#bae6fd] text-[#0ea5e9] flex items-center justify-center font-bold text-3xl mx-auto mb-4">
                {name.split(' ').map(n => n[0]).join('')}
              </div>
              <h2 className="text-xl font-bold">{name}</h2>
              <p className="text-sm text-slate-500 font-medium mb-6">{email}</p>
              <button onClick={() => alert('Avatar upload logic goes here.')} className="w-full py-2.5 bg-[#fafafa] border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                Change Avatar
              </button>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="p-6 bg-white border border-slate-200 shadow-sm rounded-3xl"
            >
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Subscription</h3>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">Pro Plan</span>
                  <span className="text-[10px] bg-[#e0f2fe] text-[#0ea5e9] px-2 py-0.5 rounded-full font-bold">ACTIVE</span>
                </div>
                <p className="text-xs text-slate-500 font-medium italic">Renews on May 20, 2026</p>
              </div>
              <Link to="/pricing" className="block w-full py-2.5 bg-[#0ea5e9] text-white rounded-xl text-sm font-bold text-center hover:bg-[#0284c7] transition-all shadow-md">
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
              className="p-8 bg-white border border-slate-200 shadow-sm rounded-3xl"
            >
              <h2 className="text-xl font-bold mb-6">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#fafafa] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0ea5e9] focus:outline-none transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#fafafa] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0ea5e9] focus:outline-none transition-all font-medium" 
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3 bg-[#111] text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg min-w-[140px] flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </motion.div>

            {/* Security */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="p-8 bg-white border border-slate-200 shadow-sm rounded-3xl"
            >
              <h2 className="text-xl font-bold mb-6">Security</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#fafafa] rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold">Password</h4>
                    <p className="text-xs text-slate-500 font-medium">Last changed 3 months ago</p>
                  </div>
                  <button onClick={() => alert('Password update logic prompted.')} className="text-sm font-bold text-[#0ea5e9] hover:underline">Update</button>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#fafafa] rounded-2xl border border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold">Two-Factor Authentication</h4>
                    <p className="text-xs text-slate-500 font-medium">Add an extra layer of security</p>
                  </div>
                  <button onClick={() => alert('2FA setup sequence initiated.')} className="text-sm font-bold text-[#0ea5e9] hover:underline">Enable</button>
                </div>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="p-8 bg-white border border-red-100 shadow-sm rounded-3xl bg-red-50/10"
            >
              <h2 className="text-xl font-bold text-red-600 mb-2">Danger Zone</h2>
              <p className="text-sm text-slate-500 font-medium mb-6">Once you delete your account, there is no going back. Please be certain.</p>
              <button 
                onClick={handleDelete}
                className="px-6 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-md shadow-red-100"
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

