import http.server
import socketserver
import json
import subprocess
import urllib.parse
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class GravityHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/list_cases':
            cases_dir = os.path.join(DIRECTORY, 'cases')
            if not os.path.exists(cases_dir):
                os.makedirs(cases_dir)
            
            files = [f for f in os.listdir(cases_dir) if f.endswith('.json')]
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"cases": files}).encode('utf-8'))
            return
            
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        # Handle API calls from the Dashboard
        if self.path.startswith('/api/save_case'):
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            case_name = data.get('name', 'untitled')
            filename = f"{case_name}.json"
            cases_dir = os.path.join(DIRECTORY, 'cases')
            
            if not os.path.exists(cases_dir):
                os.makedirs(cases_dir)
                
            filepath = os.path.join(cases_dir, filename)
            
            with open(filepath, 'w') as f:
                json.dump(data['content'], f, indent=4)
                
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "saved", "file": filename}).encode('utf-8'))
            return

        if self.path.startswith('/api/execute'):
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request = json.loads(post_data.decode('utf-8'))
            
            command = request.get('command')
            target = request.get('target')
            
            response = self.execute_system_command(command, target)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            return
            
        return http.server.SimpleHTTPRequestHandler.do_POST(self)

    def execute_system_command(self, cmd, target):
        """
        Executes REAL shell commands securely.
        """
        print(f"[SYSTEM] Executing: {cmd} on {target}")
        
        try:
            output = ""
            if cmd == 'ping':
                # Windows uses -n, Linux uses -c
                flag = '-n' if os.name == 'nt' else '-c'
                # Run ping command
                output = subprocess.check_output(['ping', flag, '2', target], stderr=subprocess.STDOUT, timeout=5)
                
            elif cmd == 'nslookup':
                output = subprocess.check_output(['nslookup', target], stderr=subprocess.STDOUT, timeout=5)
                
            elif cmd == 'tracert':
                # Quick trace (max 15 hops to be fast)
                exe = 'tracert' if os.name == 'nt' else 'traceroute'
                output = subprocess.check_output([exe, '-h', '5', target], stderr=subprocess.STDOUT, timeout=10)

            elif cmd == 'scan_network':
                target = target or '192.168.1.0/24'
                # Try Nmap first (Power User)
                try:
                    output = subprocess.check_output(['nmap', '-sn', target], stderr=subprocess.STDOUT, timeout=10)
                    if isinstance(output, bytes): output = output.decode('utf-8', errors='ignore')
                except (FileNotFoundError, subprocess.CalledProcessError):
                    # Fallback to ARP table (Standard User)
                    output = subprocess.check_output(['arp', '-a'], stderr=subprocess.STDOUT, timeout=5)
                    if isinstance(output, bytes): output = output.decode('utf-8', errors='ignore')
                    output = "[INFO] Nmap not found. Using ARP Table:\n" + output

            # Decode bytes to string
            if isinstance(output, bytes):
                return {"status": "success", "output": output.decode('utf-8', errors='ignore')}
            return {"status": "success", "output": output}
            
        except subprocess.TimeoutExpired:
            return {"status": "error", "output": "Critical: Operation Timed Out."}
        except Exception as e:
            return {"status": "error", "output": str(e)}

print(f"GRAVITY CORE SERVER ONLINE :: PORT {PORT}")
print(f"Serving directory: {DIRECTORY}")
print("Waiting for Dashboard Uplink...")

# Allow reuse of address to prevent 'Address already in use' errors
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), GravityHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[SHUTDOWN] Gravity Core Terminated.")
