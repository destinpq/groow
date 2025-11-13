#!/usr/bin/env python3
import re
import glob
import os

api_dir = "/home/azureuser/Groow/groow/frontend/src/services/api"
fixed_count = 0

for filepath in glob.glob(f"{api_dir}/*.ts"):
    if any(x in filepath for x in ['client.ts', 'index.ts', '.backup']):
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Pattern 1: response.data.data.property → (response?.data?.data || response?.data)?.property
    content = re.sub(
        r'response\.data\.data\.(\w+)',
        r'(response?.data?.data || response?.data)?.\1',
        content
    )
    
    # Pattern 2: return response.data.data; → return response?.data?.data || response?.data;
    content = re.sub(
        r'return response\.data\.data;',
        r'return response?.data?.data || response?.data;',
        content
    )
    
    # Pattern 3: : response.data.data, → : (response?.data?.data || response?.data),
    content = re.sub(
        r':\s*response\.data\.data([,\}])',
        r': (response?.data?.data || response?.data)\1',
        content
    )
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        fixed_count += 1
        print(f"✅ {os.path.basename(filepath)}")

print(f"\n✅ Fixed {fixed_count} files properly!")
