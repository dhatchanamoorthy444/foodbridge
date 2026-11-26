import os

# Read the file
filepath = os.path.join('d:', 'project', 'collage_project', 'frontend', 'src', 'pages', 'BrowseDonations.tsx')
with open(filepath, 'r', encoding='utf8') as f:
    content = f.read()

# Fix the JSX closing structure - separate ) and } on lines 214 and 216
# The issue is )} on same line which is invalid TypeScript
# We need to ensure proper closing of JSX and function blocks

# Find and fix lines with )} on same line
lines = content.split('\n')
fixed = False
for i, line in enumerate(lines):
    # Fix line ending with )} - separate them
    if line.rstrip().endswith(')}') and '214' in line:
        # Replace )} with } then ) on separate lines
        lines[i] = line.rstrip().replace(')}', '}')
        fixed = True
    elif line.rstrip().endswith(')}') and '216' in line:
        lines[i] = line.rstrip().replace(')}', '}')
        fixed = True

if fixed:
    with open(filepath, 'w', encoding='utf8') as f:
        f.write('\n'.join(lines))
    print('Fixed JSX structure')
else:
    print('No JSX fix patterns found')