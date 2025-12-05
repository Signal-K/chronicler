#!/bin/bash

# Function to calculate relative path from one file to another
get_relative_path() {
    local from_file="$1"
    local to_path="$2"
    
    # Get directory of the from_file
    from_dir=$(dirname "$from_file")
    
    # Calculate relative path
    python3 -c "import os; print(os.path.relpath('$to_path', '$from_dir'))"
}

# Find all TypeScript files with @/ imports (excluding node_modules)
find . -name "*.tsx" -o -name "*.ts" | grep -v node_modules | while read file; do
    if grep -q "@/" "$file" 2>/dev/null; then
        echo "Processing: $file"
        
        # Create a temp file
        temp_file="${file}.tmp"
        cp "$file" "$temp_file"
        
        # Replace common @/ patterns with relative paths
        # These are the main categories we need to fix
        
        # Get the directory depth to calculate ../
        depth=$(echo "$file" | tr -cd '/' | wc -c)
        depth=$((depth - 1))  # Subtract 1 because we start from project root
        
        # Build the appropriate number of ../
        rel_prefix=""
        for ((i=0; i<depth; i++)); do
            rel_prefix="../$rel_prefix"
        done
        
        # Replace @/ imports
        sed -i '' \
            -e "s|from '@/components/|from '${rel_prefix}components/|g" \
            -e "s|from '@/hooks/|from '${rel_prefix}hooks/|g" \
            -e "s|from '@/lib/|from '${rel_prefix}lib/|g" \
            -e "s|from '@/types/|from '${rel_prefix}types/|g" \
            -e "s|from '@/constants/|from '${rel_prefix}constants/|g" \
            -e "s|from '@/contexts/|from '${rel_prefix}contexts/|g" \
            -e "s|from '@/utils/|from '${rel_prefix}utils/|g" \
            -e "s|require('@/assets/|require('${rel_prefix}assets/|g" \
            "$file"
        
        rm -f "$temp_file"
    fi
done

echo "Done! All @/ imports have been replaced with relative imports."
