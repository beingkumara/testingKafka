import React, { useEffect, useState } from 'react';
import { Map, Train, Star, Eye, Info, Wallet } from 'lucide-react';
import { CircuitGuide } from '../types/f1.types';
import { getCircuitGuide } from '../services/f1/f1Service';

interface GuideTabProps {
    circuitId: string;
}

const GuideTab: React.FC<GuideTabProps> = ({ circuitId }) => {
    const [guide, setGuide] = useState<CircuitGuide | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuide = async () => {
            setLoading(true);
            try {
                const data = await getCircuitGuide(circuitId);
                setGuide(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (circuitId) {
            fetchGuide();
        }
    }, [circuitId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                <div className="text-gray-400 font-mono text-sm animate-pulse">Loading travel intel...</div>
            </div>
        );
    }

    if (!guide) {
        return (
            <div className="p-12 text-center text-gray-500 bg-white/5 rounded-xl border border-dashed border-gray-700">
                <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Travel guide currently unavailable for this circuit.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-800 to-black border border-white/10 shadow-2xl">
                <div className="absolute top-0 right-0 p-32 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="p-8 md:p-10 relative z-10">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest mb-4">
                            <Info size={14} /> Official Guide
                        </div>
                        <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4 italic uppercase tracking-tighter">
                            {guide.circuitName}
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1">
                            <p className="text-lg text-gray-300 leading-relaxed font-light border-l-4 border-red-500 pl-4">
                                {guide.summary}
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-col gap-4 min-w-[200px] w-full md:w-auto">
                            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors h-full flex flex-col justify-center">
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <Wallet size={16} />
                                    <span className="text-xs uppercase tracking-wider">Currency</span>
                                </div>
                                <div className="text-xl font-bold text-white font-mono">{guide.currency}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Where to Sit */}
                <div className="group relative bg-dark-800/50 rounded-2xl p-1 border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(239,68,68,0.2)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                    <div className="h-full bg-dark-900/80 backdrop-blur rounded-xl p-6 relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                                <Eye size={24} />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-white uppercase italic">Where to Sit</h3>
                        </div>
                        <ul className="space-y-4">
                            {guide.bestGrandstands.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 group/item">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2.5 flex-shrink-0 group-hover/item:scale-150 transition-transform shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
                                    <span className="text-gray-300 group-hover/item:text-white transition-colors">{item}</span>
                                </li>
                            ))}
                            {guide.bestGrandstands.length === 0 && <li className="text-gray-500 italic">No viewing points available.</li>}
                        </ul>
                    </div>
                </div>

                {/* Getting There */}
                <div className="group relative bg-dark-800/50 rounded-2xl p-1 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]">
                    <div className="h-full bg-dark-900/80 backdrop-blur rounded-xl p-6 relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                <Train size={24} />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-white uppercase italic">Getting There</h3>
                        </div>
                        <ul className="space-y-4">
                            {guide.transportTips.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 group/item">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5 flex-shrink-0 group-hover/item:scale-150 transition-transform shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                                    <span className="text-gray-300 group-hover/item:text-white transition-colors">{item}</span>
                                </li>
                            ))}
                            {guide.transportTips.length === 0 && <li className="text-gray-500 italic">No transport info available.</li>}
                        </ul>
                    </div>
                </div>

                {/* Local Vibes */}
                <div className="group relative bg-dark-800/50 rounded-2xl p-1 border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]">
                    <div className="h-full bg-dark-900/80 backdrop-blur rounded-xl p-6 relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                <Map size={24} />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-white uppercase italic">Local Vibes</h3>
                        </div>
                        <ul className="space-y-4">
                            {guide.localAttractions.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 group/item">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 flex-shrink-0 group-hover/item:scale-150 transition-transform shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                                    <span className="text-gray-300 group-hover/item:text-white transition-colors">{item}</span>
                                </li>
                            ))}
                            {guide.localAttractions.length === 0 && <li className="text-gray-500 italic">No attractions available.</li>}
                        </ul>
                    </div>
                </div>

                {/* Hidden Gems */}
                <div className="group relative bg-dark-800/50 rounded-2xl p-1 border border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)]">
                    <div className="h-full bg-dark-900/80 backdrop-blur rounded-xl p-6 relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                                <Star size={24} />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-white uppercase italic">Hidden Gems</h3>
                        </div>
                        <ul className="space-y-4">
                            {guide.hiddenGems.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-3 group/item">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2.5 flex-shrink-0 group-hover/item:scale-150 transition-transform shadow-[0_0_10px_rgba(245,158,11,0.5)]"></span>
                                    <span className="text-gray-300 group-hover/item:text-white transition-colors">{item}</span>
                                </li>
                            ))}
                            {guide.hiddenGems.length === 0 && <li className="text-gray-500 italic">No hidden gems found.</li>}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GuideTab;
