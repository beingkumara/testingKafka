import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy, Calendar, Flag, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDriverStandings, getConstructorStandings, getRaces } from '../services';
import { DriverStanding, ConstructorStanding, Race } from '../types/f1.types';
import { getRaceTrackImage } from '../utils/imageUtils';

// Team color helper
const getTeamColor = (team: string): string => {
  const t = (team || '').toLowerCase();
  if (t.includes('red bull')) return '#0600EF';
  if (t.includes('ferrari')) return '#E80020';
  if (t.includes('mercedes')) return '#00D2BE';
  if (t.includes('mclaren')) return '#FF8000';
  if (t.includes('aston')) return '#229971';
  if (t.includes('alpine')) return '#0090FF';
  if (t.includes('williams')) return '#64C4FF';
  if (t.includes('racing bulls') || t.includes('rb ')) return '#1634CB';
  if (t.includes('audi') || t.includes('sauber') || t.includes('kick')) return '#52E252';
  if (t.includes('haas') || t.includes('cadillac')) return '#B6BABD';
  return '#E10600';
};

const MOCK_DRIVER_STANDINGS: DriverStanding[] = [
  { id: 1, name: 'Max Verstappen', team: 'Red Bull Racing', points: 393, position: 1 },
  { id: 2, name: 'Lando Norris', team: 'McLaren', points: 331, position: 2 },
  { id: 3, name: 'Charles Leclerc', team: 'Ferrari', points: 307, position: 3 },
  { id: 4, name: 'Oscar Piastri', team: 'McLaren', points: 262, position: 4 },
  { id: 5, name: 'Carlos Sainz', team: 'Ferrari', points: 244, position: 5 },
];

const MOCK_CONSTRUCTOR_STANDINGS: ConstructorStanding[] = [
  { id: 1, name: 'McLaren', points: 593, position: 1, wins: 5 },
  { id: 2, name: 'Ferrari', points: 557, position: 2, wins: 5 },
  { id: 3, name: 'Red Bull Racing', points: 544, position: 3, wins: 7 },
  { id: 4, name: 'Mercedes', points: 382, position: 4, wins: 3 },
  { id: 5, name: 'Aston Martin', points: 86, position: 5, wins: 0 },
];

const MOCK_NEXT_RACE: Race = {
  id: 21,
  round: 21,
  name: 'Las Vegas Grand Prix',
  circuit: 'Las Vegas Strip Circuit',
  country: 'United States',
  date: '2026-11-23',
  time: '06:00:00Z',
  completed: false,
  image: ''
};

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const reduceMotion = useReducedMotion();

  // Data fetching
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [nextRace, setNextRace] = useState<Race | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setDriverStandings(MOCK_DRIVER_STANDINGS);
        setConstructorStandings(MOCK_CONSTRUCTOR_STANDINGS);
        setNextRace(MOCK_NEXT_RACE);
        return;
      }

      try {
        const [driversData, constructorsData, racesData] = await Promise.all([
          getDriverStandings(),
          getConstructorStandings(),
          getRaces()
        ]);
        setDriverStandings(driversData.slice(0, 5)); // Top 5
        setConstructorStandings(constructorsData.slice(0, 5)); // Top 5
        const upcoming = racesData.filter(r => !r.completed);
        if (upcoming.length > 0) setNextRace(upcoming[0]);
      } catch (err) {
        console.error("Failed to load homepage data", err);
      }
    };
    fetchData();
  }, [isAuthenticated]);

  // Countdown for Next Race
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  useEffect(() => {
    if (!nextRace) return;
    const timer = setInterval(() => {
      const raceDate = new Date(`${nextRace.date}T${nextRace.time}`);
      const diff = raceDate.getTime() - new Date().getTime();
      if (diff > 0) {
        setTimeLeft({
          days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0'),
          hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, '0'),
          minutes: String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, '0'),
          seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, '0')
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextRace]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#e10600] selection:text-white pb-32">
      {/* VIGNETTE & TEXTURE (Mission Control Vibe) */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[#050505]"></div>
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
         <div className="absolute top-0 inset-x-0 h-[60vh] bg-[radial-gradient(ellipse_at_top,rgba(225,6,0,0.08),transparent_70%)]"></div>
         {/* Subtle scanline overlay for premium technical feel */}
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] opacity-50 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 container-f1 max-w-[1400px] mx-auto px-4 pt-24">
        
        {/* BENTO BOX GRID */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-24"
        >
          
          {/* 1. HERO CELL (col-span-full) */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-4 lg:col-span-6 flex flex-col md:flex-row items-center justify-between py-12 px-8 liquid-glass-card relative group overflow-hidden">
             {/* Ambient glow behind hero */}
             <div className="absolute -inset-10 bg-gradient-radial from-[#e10600]/20 to-transparent blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             
             <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-3 mb-4 px-4 py-1.5 bg-black/40 border border-white/10 rounded-full">
                  <div className="w-2 h-2 bg-[#e10600] rounded-full animate-pulse shadow-[0_0_8px_#e10600]"></div>
                  <span className="text-xs font-mono text-gray-300 tracking-[0.2em] uppercase font-bold">Global Telemetry Online</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter mb-2">
                  RACE CONTROL
                </h1>
                <p className="text-lg md:text-xl text-gray-400 tracking-[0.3em] font-light uppercase">
                  Live Data Center
                </p>
             </div>
             
             <div className="mt-8 md:mt-0">
               <motion.div whileTap={{ scale: 0.97 }}>
                 <Link 
                   to={isAuthenticated ? "/dashboard" : "/signup"}
                   className="group/btn flex items-center gap-3 py-4 px-8 bg-[#e10600] rounded-lg relative overflow-hidden transition-[box-shadow,background-color] duration-300 hover:bg-[#ff1e18] hover:shadow-[0_0_30px_rgba(225,6,0,0.4)]"
                 >
                   <span className="font-heading font-black text-xl text-white uppercase tracking-widest relative z-10">
                     {isAuthenticated ? 'Enter Paddock' : 'Initialize'}
                   </span>
                   <ChevronRight className="w-6 h-6 text-white relative z-10 opacity-90 group-hover/btn:translate-x-1 transition-transform duration-300" />
                 </Link>
               </motion.div>
             </div>
          </motion.div>

          <div className="col-span-1 md:col-span-4 lg:col-span-6 relative">
            {!isAuthenticated && (
              <div className="absolute inset-0 z-20 backdrop-blur-[6px] bg-[#050505]/40 flex flex-col items-center justify-center rounded-2xl border border-white/5 transition-all duration-500">
                <div className="bg-black/60 p-8 rounded-2xl border border-white/10 flex flex-col items-center max-w-md text-center shadow-[0_0_50px_rgba(225,6,0,0.15)]">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-3xl font-heading font-black text-white uppercase tracking-wider mb-3">Telemetry Locked</h3>
                  <p className="text-gray-400 mb-8 font-light leading-relaxed">
                    Initialize your connection to the paddock to access real-time race data, live driver standings, and interactive constructor battles.
                  </p>
                  <Link to="/signup" className="group/btn flex items-center gap-3 py-3 px-6 bg-[#e10600] rounded-lg relative overflow-hidden transition-[box-shadow,background-color] duration-300 hover:bg-[#ff1e18] hover:shadow-[0_0_20px_rgba(225,6,0,0.4)] w-full justify-center">
                    <span className="font-heading font-bold text-lg text-white uppercase tracking-widest relative z-10">
                      Sign Up Free
                    </span>
                    <ChevronRight className="w-5 h-5 text-white relative z-10 opacity-90 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <div className="mt-6 text-sm text-gray-500 font-mono">
                    Already authorized? <Link to="/login" className="text-white hover:text-[#e10600] transition-colors underline underline-offset-4">Sign In</Link>
                  </div>
                </div>
              </div>
            )}
            
            <div className={`grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 ${!isAuthenticated ? 'opacity-40 pointer-events-none select-none' : ''}`}>
              {/* 2. NEXT RACE CELL */}
              <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-2 relative group h-[500px]">
                 {/* Red ambient glow */}
                 <div className="absolute -inset-2 bg-gradient-radial from-[#e10600]/30 to-transparent blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 <div className="liquid-glass-card h-full flex flex-col relative">
                    {/* Header */}
                    <div className="p-6 pb-0 flex justify-between items-start border-b border-white/5 pb-4">
                       <div className="flex items-center gap-2 text-white font-mono text-sm font-bold tracking-widest uppercase">
                         <Calendar className="w-4 h-4 text-[#e10600]" /> Next Race
                       </div>
                       <span className="live-indicator text-[10px] tracking-[0.2em]">LIVE</span>
                    </div>
                    
                    {nextRace ? (
                      <>
                        <div className="flex-1 relative flex items-center justify-center overflow-hidden p-6">
                          <div className="absolute top-0 right-0 p-4 z-10 pointer-events-none">
                            <span className="tabular-nums font-display text-8xl font-black text-white/[0.03] leading-none">{String(nextRace.round).padStart(2, '0')}</span>
                          </div>
                          <img
                            src={getRaceTrackImage(nextRace.round) || nextRace.image}
                            alt={nextRace.circuit}
                            className="object-contain h-full w-full max-h-[200px] relative z-0 opacity-90 invert mix-blend-screen transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => e.currentTarget.style.display = 'none'}
                          />
                        </div>
                        <div className="p-6 bg-black/40 border-t border-white/5 backdrop-blur-md">
                          <div className="text-[10px] text-[#e10600] font-bold uppercase tracking-[0.2em] mb-1">{nextRace.country}</div>
                          <h3 className="text-2xl font-heading font-black text-white uppercase leading-tight mb-4 truncate" title={nextRace.name}>{nextRace.name.replace('Grand Prix', 'GP')}</h3>
                          
                          <div className="grid grid-cols-4 gap-1 text-center">
                            {[{l: 'D', v: timeLeft.days}, {l: 'H', v: timeLeft.hours}, {l: 'M', v: timeLeft.minutes}, {l: 'S', v: timeLeft.seconds}].map((t, i) => (
                               <div key={t.l} className="bg-white/5 rounded border border-white/10 p-2">
                                 <div className="tabular-nums font-display font-black text-xl text-white">{t.v}</div>
                                 <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">{t.l}</div>
                               </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-gray-500 font-mono text-sm">Loading Calendar...</div>
                    )}
                 </div>
              </motion.div>

              {/* 3. DRIVER STANDINGS CELL */}
              <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-2 relative group h-[500px]">
                 {/* Gold ambient glow */}
                 <div className="absolute -inset-2 bg-gradient-radial from-[#d4af37]/20 to-transparent blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 <div className="liquid-glass-card h-full flex flex-col">
                    <div className="p-6 flex justify-between items-center border-b border-white/5">
                       <div className="flex items-center gap-2 text-white font-mono text-sm font-bold tracking-widest uppercase">
                         <Trophy className="w-4 h-4 text-tertiary-400" /> Drivers Top 5
                       </div>
                       <Link to="/standings" className="text-gray-500 hover:text-white transition-colors"><ChevronRight className="w-5 h-5"/></Link>
                    </div>
                    
                    <div className="p-4 flex flex-col gap-2 flex-1 justify-center">
                      {driverStandings.length > 0 ? driverStandings.map((driver, index) => (
                        <Link to={`/drivers/${driver.id}`} key={driver.id}>
                          <div className="group/row flex items-center justify-between p-3 bg-black/20 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all duration-200 relative overflow-hidden">
                            {/* Interactive colored glass highlight */}
                            <div className="absolute inset-0 opacity-0 group-hover/row:opacity-10 transition-opacity duration-300" style={{ backgroundColor: getTeamColor(driver.team) }}></div>
                            
                            <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r" style={{ backgroundColor: getTeamColor(driver.team) }} />
                            <div className="flex items-center gap-4 pl-3 relative z-10">
                              <span className="tabular-nums font-heading text-2xl font-black opacity-30 w-6 text-center">{index + 1}</span>
                              <div>
                                <div className="font-bold text-white text-md leading-none mb-1">{driver.name}</div>
                                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">{driver.team}</div>
                              </div>
                            </div>
                            <div className="text-right flex items-baseline gap-1 relative z-10">
                              <span className="tabular-nums font-mono text-xl font-bold text-white">{driver.points}</span>
                              <span className="text-[9px] text-gray-500 uppercase tracking-widest">PTS</span>
                            </div>
                          </div>
                        </Link>
                      )) : (
                        Array.from({length: 5}).map((_, i) => <div key={i} className="h-[60px] bg-white/5 rounded-lg border border-white/5 animate-pulse" />)
                      )}
                    </div>
                 </div>
              </motion.div>

              {/* 4. CONSTRUCTOR STANDINGS CELL */}
              <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-2 relative group h-[500px]">
                 {/* Blue ambient glow */}
                 <div className="absolute -inset-2 bg-gradient-radial from-blue-500/20 to-transparent blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 <div className="liquid-glass-card h-full flex flex-col">
                    <div className="p-6 flex justify-between items-center border-b border-white/5">
                       <div className="flex items-center gap-2 text-white font-mono text-sm font-bold tracking-widest uppercase">
                         <Flag className="w-4 h-4 text-accent-400" /> Constructors
                       </div>
                       <Link to="/standings" className="text-gray-500 hover:text-white transition-colors"><ChevronRight className="w-5 h-5"/></Link>
                    </div>
                    
                    <div className="p-4 flex flex-col gap-2 flex-1 justify-center">
                      {constructorStandings.length > 0 ? constructorStandings.map((team, index) => (
                        <div key={team.id} className="group/row flex items-center justify-between p-3 bg-black/20 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all duration-200 relative overflow-hidden">
                          {/* Interactive colored glass highlight */}
                          <div className="absolute inset-0 opacity-0 group-hover/row:opacity-10 transition-opacity duration-300" style={{ backgroundColor: getTeamColor(team.name) }}></div>
                          
                          <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r" style={{ backgroundColor: getTeamColor(team.name) }} />
                          <div className="flex items-center gap-4 pl-3 relative z-10">
                            <span className="tabular-nums font-heading text-2xl font-black opacity-30 w-6 text-center">{index + 1}</span>
                            <div>
                              <div className="font-bold text-white text-md leading-none mb-1">{team.name}</div>
                              <div className="flex items-center gap-2">
                                 <div className="text-[10px] font-mono text-tertiary-400 uppercase tracking-wider">{team.wins} WINS</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex items-baseline gap-1 relative z-10">
                            <span className="tabular-nums font-mono text-xl font-bold text-white">{team.points}</span>
                            <span className="text-[9px] text-gray-500 uppercase tracking-widest">PTS</span>
                          </div>
                        </div>
                      )) : (
                        Array.from({length: 5}).map((_, i) => <div key={i} className="h-[60px] bg-white/5 rounded-lg border border-white/5 animate-pulse" />)
                      )}
                    </div>
                 </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default HomePage;