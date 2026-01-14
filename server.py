
#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 80
Handler = http.server.SimpleHTTPRequestHandler

# Mudar para o diretório atual
os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Servidor rodando na porta {PORT}")
    print("Acesse através do preview do Replit")
    httpd.serve_forever()
