import sys

with open("src/components/profile/ProfileHeader.tsx", "r") as f:
    content = f.read()

target_cover = 'className="h-48 md:h-64 w-full rounded-b-2xl overflow-hidden relative"'
replacement_cover = 'className="h-64 md:h-80 w-full rounded-b-2xl overflow-hidden relative group"'

target_avatar = 'className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-dark-900 overflow-hidden shadow-2xl bg-dark-800"'
replacement_avatar = 'className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-dark-900 overflow-hidden shadow-[0_0_30px_rgba(255,0,0,0.3)] bg-dark-800 relative z-10"'

content = content.replace(target_cover, replacement_cover)
content = content.replace(target_avatar, replacement_avatar)

target_gradient = '<div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-80"></div>'
replacement_gradient = '<div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-primary-900/30 opacity-90 transition-opacity group-hover:opacity-75"></div>'

content = content.replace(target_gradient, replacement_gradient)

target_edit_btn = 'className="flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-all shadow-lg shadow-primary-900/40"'
replacement_edit_btn = 'className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-full font-medium transition-all shadow-glow-red hover:scale-105 active:scale-95 z-10 relative"'

content = content.replace(target_edit_btn, replacement_edit_btn)

with open("src/components/profile/ProfileHeader.tsx", "w") as f:
    f.write(content)

