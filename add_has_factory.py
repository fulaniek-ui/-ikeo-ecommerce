import os
import re

models_dir = r"c:\laragon\www\final-project-bootcamp\app\Models"

for filename in os.listdir(models_dir):
    if not filename.endswith('.php'):
        continue
    filepath = os.path.join(models_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;' not in content and 'use HasFactory;' not in content and filename != 'User.php':
        # Add import statement after namespace
        content = re.sub(
            r"(namespace App\\Models;.*?)\n",
            r"\1\n\nuse Illuminate\\Database\\Eloquent\\Factories\\HasFactory;",
            content,
            flags=re.DOTALL
        )
        
        # Add trait inside class
        content = re.sub(
            r"(class \w+ extends Model\s*\{.*?)\n",
            r"\1\n    use HasFactory;\n",
            content,
            flags=re.DOTALL
        )
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Added HasFactory to {filename}")
