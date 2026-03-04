import os

def prepare_cloud():
    src_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend_web/src"))
    
    # 1. Strip hardcoded URLs
    for root, dirs, files in os.walk(src_dir):
        for f in files:
            if f.endswith(".jsx") or f.endswith(".js"):
                path = os.path.join(root, f)
                with open(path, "r", encoding="utf-8") as file:
                    content = file.read()
                
                new_content = content.replace("http://127.0.0.1:5000", "")
                
                if content != new_content:
                    with open(path, "w", encoding="utf-8") as file:
                        file.write(new_content)
                        print(f"Updated {f}")

    # 2. Inject central Axios configuration
    main_path = os.path.join(src_dir, "main.jsx")
    with open(main_path, "r", encoding="utf-8") as f:
        main_content = f.read()

    if "axios.defaults.baseURL" not in main_content:
        inject = "import axios from 'axios';\naxios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';\n"
        main_content = inject + main_content
        with open(main_path, "w", encoding="utf-8") as f:
            f.write(main_content)
        print("Updated main.jsx with Axios defaults.")

    # 3. Add gunicorn for Render production scaling
    req_path = os.path.join(os.path.dirname(__file__), "requirements.txt")
    with open(req_path, "r", encoding="utf-8") as f:
        reqs = f.read()
        
    if "gunicorn" not in reqs.lower():
        with open(req_path, "a", encoding="utf-8") as f:
            f.write("\ngunicorn==21.2.0\n")
        print("Updated requirements.txt with gunicorn.")

if __name__ == "__main__":
    prepare_cloud()
