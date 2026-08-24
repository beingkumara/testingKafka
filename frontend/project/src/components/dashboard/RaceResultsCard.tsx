import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Timer, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RaceResult } from '../../types/f1.types';

interface RaceResultsCardProps {
  results: RaceResult[];
}

// Podium styling for P1/P2/P3
const podiumStyle = (index: number) => {
  if (index === 0) return { leftColor: '#FFD700', bg: 'rgba(255,215,0,0.06)', border: 'rgba(255,215,0,0.2)' };
  if (index === 1) return { leftColor: '#C0C0C0', bg: 'rgba(192,192,192,0.05)', border: 'rgba(192,192,192,0.15)' };
  if (index === 2) return { leftColor: '#CD7F32', bg: 'rgba(205,127,50,0.05)', border: 'rgba(205,127,50,0.15)' };
  return { leftColor: 'transparent', bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.05)' };
};

const rowVariants = {
  hidden: { x: -16, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const RaceResultsCard: React.FC<RaceResultsCardProps> = ({ results }) => {
  const raceName = results.length > 0 ? results[0].raceName : 'Recent Race';
  const raceDate = results.length > 0
    ? new Date(results[0].date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    : '';

  return (
    <div className="telemetry-card flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/8 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Flag className="h-4 w-4 text-primary-500 flex-shrink-0" />
          <div className="min-w-0">
            <h2 className="font-heading text-sm tracking-widest uppercase text-white truncate">Last Race</h2>
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider truncate block">
              {raceName} · {raceDate}
            </span>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-600 font-mono text-xs">
          No race data available
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div className="grid grid-cols-12 gap-2 text-[10px] font-mono text-gray-600 uppercase tracking-wider mb-2 px-3 shrink-0">
            <div className="col-span-1">P</div>
            <div className="col-span-6">Driver</div>
            <div className="col-span-3 text-right">Time</div>
            <div className="col-span-2 text-center">Pts</div>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto min-h-0 pr-1">
            {results.map((result, index) => {
              const { leftColor, bg, border } = podiumStyle(index);

              return (
                <motion.div
                  key={`${result.driver}-${index}`}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded relative overflow-hidden"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  {/* Podium left bar */}
                  {leftColor !== 'transparent' && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px]"
                      style={{ backgroundColor: leftColor }}
                    />
                  )}

                  {/* Position */}
                  <div className="col-span-1 z-10">
                    <span
                      className="tabular-nums font-heading text-base font-bold"
                      style={{ color: leftColor !== 'transparent' ? leftColor : '#9ca3af' }}
                    >
                      {result.position}
                    </span>
                  </div>

                  {/* Driver Info */}
                  <div className="col-span-6 min-w-0 z-10">
                    <div className="font-bold text-sm text-white truncate">{result.driver}</div>
                    <div className="text-[10px] text-gray-500 truncate font-mono">{result.team}</div>
                  </div>

                  {/* Time */}
                  <div className="col-span-3 text-right z-10">
                    <div className="flex items-center justify-end gap-1">
                      {index === 0 && <Timer className="w-2.5 h-2.5 text-primary-500 flex-shrink-0" />}
                      <span className="tabular-nums text-[10px] text-gray-300 font-mono truncate">
                        {result.time || result.status}
                      </span>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="col-span-2 text-center z-10">
                    <span className={`tabular-nums font-mono font-bold text-sm ${result.points > 0 ? 'text-white' : 'text-gray-700'}`}>
                      {result.points > 0 ? result.points : '–'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
        <Link
          to="/race-results"
          className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-gray-500 hover:text-white group/link"
          style={{ transition: 'color 200ms ease-out' }}
        >
          Full Results
          <ChevronRight
            className="w-3 h-3 text-primary-500 group-hover/link:translate-x-0.5"
            style={{ transition: 'transform 200ms ease-out' }}
          />
        </Link>
      </div>
    </div>
  );
};

export default RaceResultsCard;
