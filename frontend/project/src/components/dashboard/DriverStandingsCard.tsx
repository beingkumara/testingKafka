import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight } from 'lucide-react';
import { DriverStanding } from '../../types/f1.types';

interface DriverStandingsCardProps {
  drivers: DriverStanding[];
}

// Map team names to their brand colors for the left-bar accent
const getTeamAccentColor = (team: string): string => {
  const t = (team || '').toLowerCase();
  if (t.includes('red bull')) return '#0600EF';
  if (t.includes('ferrari')) return '#E80020';
  if (t.includes('mercedes')) return '#00D2BE';
  if (t.includes('mclaren')) return '#FF8000';
  if (t.includes('aston')) return '#229971';
  if (t.includes('alpine')) return '#0090FF';
  if (t.includes('williams')) return '#64C4FF';
  if (t.includes('racing bulls') || t.includes('rb ')) return '#1634CB';
  if (t.includes('audi') || t.includes('sauber')) return '#52E252';
  if (t.includes('haas') || t.includes('cadillac')) return '#B6BABD';
  return '#E10600';
};

const rowVariants = {
  hidden: { x: -16, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const DriverStandingsCard: React.FC<DriverStandingsCardProps> = ({ drivers }) => {
  const maxPoints = drivers[0]?.points || 1;

  return (
    <div className="telemetry-card flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary-500" />
          <h2 className="font-heading text-sm tracking-widest uppercase text-white">Driver Championship</h2>
        </div>
        <span className="tabular-nums font-mono text-[10px] text-primary-500 border border-primary-500/30 px-2 py-0.5 rounded bg-primary-900/20">
          {new Date().getFullYear()}
        </span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-gray-600 uppercase tracking-wider mb-2 px-3 shrink-0">
        <div className="col-span-1">Pos</div>
        <div className="col-span-6">Driver</div>
        <div className="col-span-3 text-right">Pts</div>
        <div className="col-span-2 text-center">W</div>
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto min-h-0 pr-1">
        {drivers.map((driver, index) => {
          const teamColor = getTeamAccentColor(driver.team);
          const pct = maxPoints > 0 ? (driver.points / maxPoints) * 100 : 0;

          return (
            <motion.div
              key={driver.id}
              custom={index}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded relative overflow-hidden group"
              style={{
                background: index === 0 ? 'rgba(225,6,0,0.06)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${index === 0 ? 'rgba(225,6,0,0.25)' : 'rgba(255,255,255,0.05)'}`,
                transition: 'background 200ms ease-out, border-color 200ms ease-out',
              }}
            >
              {/* Team color left bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ backgroundColor: teamColor, opacity: index === 0 ? 1 : 0.6 }}
              />

              {/* Points bar background */}
              <div
                className="absolute left-0 top-0 bottom-0 pointer-events-none"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(to right, ${teamColor}08, transparent)`,
                }}
              />

              {/* Position */}
              <div className="col-span-1 tabular-nums font-heading text-base text-white z-10">
                {driver.position}
              </div>

              {/* Driver Info */}
              <div className="col-span-6 z-10 min-w-0">
                <Link
                  to={`/drivers/${driver.id}`}
                  className="block"
                  style={{ transition: 'color 200ms ease-out' }}
                >
                  <div className="font-bold text-sm text-white truncate group-hover:text-primary-400" style={{ transition: 'color 200ms ease-out' }}>
                    {driver.name}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate font-mono">{driver.team}</div>
                </Link>
              </div>

              {/* Points */}
              <div className="col-span-3 text-right z-10">
                <span className="tabular-nums font-mono text-base font-bold text-white">{driver.points}</span>
                <span className="text-[9px] text-gray-600 ml-0.5">pts</span>
              </div>

              {/* Wins */}
              <div className="col-span-2 flex justify-center z-10">
                {driver.wins > 0 ? (
                  <span className="tabular-nums flex items-center gap-0.5 font-bold text-sm text-tertiary-500">
                    <Trophy className="w-3 h-3" />
                    {driver.wins}
                  </span>
                ) : (
                  <span className="text-gray-700 text-sm">–</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
        <Link
          to="/standings"
          className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-white group/link"
          style={{ transition: 'color 200ms ease-out' }}
        >
          Full Standings
          <ChevronRight className="w-3 h-3 text-primary-500 group-hover/link:translate-x-0.5" style={{ transition: 'transform 200ms ease-out' }} />
        </Link>
      </div>
    </div>
  );
};

export default DriverStandingsCard;
