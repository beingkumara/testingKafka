import sys

with open("src/components/profile/ProfileStats.tsx", "r") as f:
    content = f.read()

target = """                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`glass p-4 rounded-xl border ${stat.borderColor} bg-gradient-to-br ${stat.color} hover:shadow-lg transition-all duration-300`}
                >"""

replacement = """                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ delay: 0.6 + index * 0.1, type: "spring", stiffness: 300 }}
                    className={`glass p-4 rounded-xl border ${stat.borderColor} bg-gradient-to-br ${stat.color} hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:border-white/20 transition-all duration-300 cursor-pointer`}
                >"""

content = content.replace(target, replacement)

with open("src/components/profile/ProfileStats.tsx", "w") as f:
    f.write(content)

