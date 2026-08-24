import sys

with open("src/components/layout/Header.tsx", "r") as f:
    content = f.read()

target = """                  {/* Dropdown */}
                  <div
                    className="absolute right-0 pt-4 w-56 invisible group-hover:visible opacity-0 group-hover:opacity-100 origin-top-right"
                    style={{
                      transition: 'opacity 200ms ease-out, transform 200ms ease-out',
                      transform: 'translateY(8px)',
                    }}
                    // Note: using CSS group-hover approach, no JS transition-all
                  >"""

replacement = """                  {/* Dropdown */}
                  <div
                    className="absolute right-0 top-full pt-2 w-56 invisible group-hover:visible opacity-0 group-hover:opacity-100 origin-top-right transition-all duration-200 translate-y-2 group-hover:translate-y-0"
                    // Removed inline transform to prevent physical gap, using tailwind translate-y
                  >"""

content = content.replace(target, replacement)

with open("src/components/layout/Header.tsx", "w") as f:
    f.write(content)
