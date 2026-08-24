import sys

with open("src/pages/ProfilePage.tsx", "r") as f:
    content = f.read()

target_about = """                <div className="glass p-6 rounded-xl border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">About</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-white">{profileData?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="text-white">{profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                  </div>
                </div>"""

replacement_about = """                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass p-6 rounded-xl border border-white/5 bg-gradient-to-b from-dark-800/80 to-transparent hover:border-white/10 transition-colors"
                >
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About
                  </h3>
                  <div className="space-y-4">
                    <div className="group">
                      <p className="text-sm text-gray-500 group-hover:text-primary-400 transition-colors">Email</p>
                      <p className="text-white font-mono text-sm mt-1">{profileData?.email}</p>
                    </div>
                    <div className="group">
                      <p className="text-sm text-gray-500 group-hover:text-primary-400 transition-colors">Member Since</p>
                      <p className="text-white font-mono text-sm mt-1">{profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                  </div>
                </motion.div>"""

target_fav = """                {/* Favorites Card (Redundant with stats but good for layout balance) */}
                <div className="glass p-6 rounded-xl border border-white/5 bg-gradient-to-b from-primary-900/20 to-transparent">
                  <h3 className="text-lg font-bold text-white mb-4">My Favorites</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                      <span className="text-gray-400">Driver</span>
                      <span className="text-primary-400 font-semibold">{profileData?.favoriteDriver || 'None'}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg">
                      <span className="text-gray-400">Team</span>
                      <span className="text-primary-400 font-semibold">{profileData?.favoriteTeam || 'None'}</span>
                    </div>
                  </div>
                </div>"""

replacement_fav = """                {/* Favorites Card (Redundant with stats but good for layout balance) */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass p-6 rounded-xl border border-white/5 bg-gradient-to-br from-primary-900/20 to-dark-900/80 hover:border-primary-500/30 transition-all shadow-[inset_0_0_20px_rgba(255,0,0,0.05)]"
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    My Favorites
                  </h3>
                  <div className="space-y-3">
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-white/5 hover:border-white/10 cursor-pointer">
                      <span className="text-gray-400 text-sm">Driver</span>
                      <span className="text-primary-400 font-semibold truncate max-w-[120px]">{profileData?.favoriteDriver || 'None'}</span>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-3 bg-dark-800/50 rounded-lg border border-white/5 hover:border-white/10 cursor-pointer">
                      <span className="text-gray-400 text-sm">Team</span>
                      <span className="text-primary-400 font-semibold truncate max-w-[120px]">{profileData?.favoriteTeam || 'None'}</span>
                    </motion.div>
                  </div>
                </motion.div>"""

target_feed = """              {/* Right Column: Activity Feed (Placeholder) */}
              <div className="lg:col-span-2">
                <div className="glass p-8 rounded-xl border border-white/5 flex flex-col items-center justify-center min-h-[300px] text-center">
                  <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="6" x2="12" y2="12"></line>
                        <line x1="16" y1="12" x2="12" y2="12"></line>
                      </svg>
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Recent Activity</h3>
                  <p className="text-gray-400 max-w-md">
                    You haven't posted anything yet. Join the discussion on race results or share your predictions!
                  </p>
                  <button className="mt-6 px-6 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-full transition-colors font-medium">
                    Start a Discussion
                  </button>
                </div>
              </div>"""

replacement_feed = """              {/* Right Column: Activity Feed (Placeholder) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2"
              >
                <div className="glass p-8 rounded-xl border border-white/5 flex flex-col items-center justify-center min-h-[100%] text-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-dark-800/40 via-transparent to-transparent relative overflow-hidden group">
                  {/* Subtle animated background element */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500"></div>
                  
                  <div className="w-20 h-20 bg-dark-900/80 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] relative z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 6v6l4 2"></path>
                      </svg>
                    </motion.div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Activity Timeline</h3>
                  <p className="text-gray-400 max-w-md relative z-10 mb-8 leading-relaxed">
                    This space is waiting for your racing journey. Start predicting race outcomes, saving your favorite moments, or joining the fan discussions!
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all font-medium border border-white/10 hover:border-primary-500/50 hover:text-primary-400 relative z-10 backdrop-blur-sm"
                  >
                    Explore Community
                  </motion.button>
                </div>
              </motion.div>"""

content = content.replace(target_about, replacement_about)
content = content.replace(target_fav, replacement_fav)
content = content.replace(target_feed, replacement_feed)

with open("src/pages/ProfilePage.tsx", "w") as f:
    f.write(content)

