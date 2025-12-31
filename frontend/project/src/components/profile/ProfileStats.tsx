import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Zap, Flag } from 'lucide-react';
import { User } from '../../types/auth.types';

interface ProfileStatsProps {
    user: User | null;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ user }) => {
    const stats = [
        {
            label: 'Favorite Driver',
            value: user?.favoriteDriver || 'Not Set',
            icon: <Zap className="text-yellow-400" size={24} />,
            color: 'from-yellow-500/10 to-transparent',
            borderColor: 'border-yellow-500/20'
        },
        {
            label: 'Favorite Team',
            value: user?.favoriteTeam || 'Not Set',
            icon: <Flag className="text-red-500" size={24} />,
            color: 'from-red-500/10 to-transparent',
            borderColor: 'border-red-500/20'
        },
        {
            label: 'Races Watched',
            value: '0',
            icon: <Trophy className="text-purple-400" size={24} />,
            color: 'from-purple-500/10 to-transparent',
            borderColor: 'border-purple-500/20'
        },
        {
            label: 'Predictions',
            value: '0',
            icon: <Award className="text-blue-400" size={24} />,
            color: 'from-blue-500/10 to-transparent',
            borderColor: 'border-blue-500/20'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`glass p-4 rounded-xl border ${stat.borderColor} bg-gradient-to-br ${stat.color} hover:shadow-lg transition-all duration-300`}
                >
                    <div className="flex items-start justify-between">
                        <div className="p-2 bg-dark-800/50 rounded-lg">
                            {stat.icon}
                        </div>
                        {/* Visual decoration */}
                        <div className="h-full flex gap-1 items-center opacity-20">
                            <div className="w-1 h-4 bg-white/50 rounded-full"></div>
                            <div className="w-1 h-6 bg-white/50 rounded-full"></div>
                            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold">{stat.label}</p>
                        <p className="text-xl md:text-2xl font-bold text-white mt-1 truncate" title={stat.value}>
                            {stat.value}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default ProfileStats;
