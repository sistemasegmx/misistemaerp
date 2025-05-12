import json
from copy import deepcopy

# Paths de entrada y salida
input_path = '/mnt/data/Mi Sistema ERP.postman_collection.json'
output_path = '/mnt/data/Mi Sistema ERP-11-05-2025.postman_collection.json'

# Controladores a agregar
controllers = [
    "prospect", "customer", "contact", "supplier", "employee",
    "salesperson", "distributor", "carrier", "partner", "affiliate",
    "manufacturer", "advisor", "institution"
]

# Plantilla de ítems de ejemplo para "ente"
with open(input_path, 'r', encoding='utf-8') as f:
    collection = json.load(f)
    
# Buscar la carpeta "ente" y clonar su estructura mínima
template_folder = None
for module in collection.get('item', []):
    if module.get('name') == 'Modules':
        for sub in module.get('item', []):
            if sub.get('name') == 'Catalogos':
                for itm in sub.get('item', []):
                    if itm.get('name') == 'ente':
                        template_folder = itm
                        break

if not template_folder:
    raise Exception("No se encontró la carpeta 'ente' en la colección.")

# Limpiar ejemplo de datos específicos
base_items = template_folder['item']

# Crear nuevas carpetas basadas en la plantilla
new_folders = []
for ctrl in controllers:
    folder = {
        "name": ctrl,
        "item": []
    }
    for endpoint in base_items:
        ep = deepcopy(endpoint)
        # Actualizar nombre y rutas
        ep['name'] = ep['name'].replace('ente', ctrl)
        raw_url = ep['request']['url']['raw']
        ep['request']['url']['raw'] = raw_url.replace('/ente', f'/{ctrl}')
        ep['request']['url']['path'] = [ctrl] + ep['request']['url']['path'][1:]
        # Si hay body con raw JSON, limpiar ejemplo
        if 'body' in ep['request'] and ep['request']['body']['mode'] == 'raw':
            ep['request']['body']['raw'] = ""
        folder['item'].append(ep)
    new_folders.append(folder)

# Insertar nuevas carpetas después de 'staff'
for module in collection.get('item', []):
    if module.get('name') == 'Modules':
        for sub in module.get('item', []):
            if sub.get('name') == 'Catalogos':
                catalog_items = sub.setdefault('item', [])
                insert_idx = next((i + 1 for i, itm in enumerate(catalog_items) if itm.get('name') == 'staff'), len(catalog_items))
                for offset, folder in enumerate(new_folders):
                    catalog_items.insert(insert_idx + offset, folder)

# Guardar colección actualizada
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(collection, f, indent=2, ensure_ascii=False)

print(f"Archivo actualizado generado en: {output_path}")
