# Pancho - Text Toolbox

> Limpia, formatea y transforma texto como Notepad++

## Características

- **60+ comandos** accesibles desde el menú contextual
- **Contadores en barra de estado** (líneas, palabras, caracteres)
- **Atajos de teclado** para operaciones frecuentes
- **Configuración** de tabulación, EOL y más

## Cómo usar

1. Selecciona texto (o no, para aplicar a todo el documento)
2. Clic derecho → **Pancho**
3. Elige la categoría y el comando

## Comandos

### Edición
| Comando | Descripción |
|---------|-------------|
| `Pancho: Limpiar espacios en blanco` | Elimina espacios múltiples |
| `Pancho: Limpiar saltos de línea` | Normaliza saltos de línea |
| `Pancho: Recortar líneas` | Elimina espacios al inicio/final |

### Líneas
| Comando | Descripción |
|---------|-------------|
| `Pancho: Ordenar A-Z` | Ordena líneas alfabéticamente |
| `Pancho: Ordenar Z-A` | Ordena líneas inversamente |
| `Pancho: Eliminar líneas duplicadas` | Quita duplicados |
| `Pancho: Eliminar líneas vacías` | Quita líneas en blanco |
| `Pancho: Unir líneas` | Combina líneas en una |
| `Pancho: Revertir líneas` | Invierte el orden |

### Mayúsculas y minúsculas
| Comando | Descripción |
|---------|-------------|
| `Pancho: Convertir a MAYÚSCULAS` | TODO EN MAYÚSCULAS |
| `Pancho: Convertir a minúsculas` | todo en minúsculas |
| `Pancho: Convertir a Título` | Cada Palabra Capitalizada |

### Tabulaciones
| Comando | Descripción |
|---------|-------------|
| `Pancho: Convertir tabs a espacios` | Reemplaza tabs |
| `Pancho: Convertir espacios a tabs` | Reemplaza espacios |
| `Pancho: Aumentar indentación` | Agrega indentación |
| `Pancho: Disminuir indentación` | Quita indentación |

### Fin de línea
| Comando | Descripción |
|---------|-------------|
| `Pancho: Convertir a Windows (CRLF)` | Formato Windows |
| `Pancho: Convertir a Unix (LF)` | Formato Unix/Mac |
| `Pancho: Convertir a Mac (CR)` | Formato Mac clásico |

### Codificación
| Comando | Descripción |
|---------|-------------|
| `Pancho: Codificar Base64` | Codifica a Base64 |
| `Pancho: Decodificar Base64` | Decodifica Base64 |
| `Pancho: Codificar URL` | Codifica para URLs |
| `Pancho: Decodificar URL` | Decodifica URLs |
| `Pancho: Codificar HTML entities` | Escapa caracteres HTML |
| `Pancho: Decodificar HTML entities` | Desescapa HTML |

### Formateo
| Comando | Descripción |
|---------|-------------|
| `Pancho: Formatear JSON` | JSON con indentación |
| `Pancho: Minificar JSON` | JSON en una línea |
| `Pancho: Formatear HTML` | HTML con indentación |
| `Pancho: Minificar HTML` | HTML comprimido |
| `Pancho: Formatear CSS` | CSS con indentación |
| `Pancho: Formatear JavaScript` | JS con indentación |
| `Pancho: Formatear SQL` | SQL con formato |
| `Pancho: Formatear XML` | XML con indentación |

### Hash y binario
| Comando | Descripción |
|---------|-------------|
| `Pancho: Hash MD5` | Genera hash MD5 |
| `Pancho: Hash SHA-256` | Genera hash SHA-256 |
| `Pancho: Texto a binario` | Convierte a binario |
| `Pancho: Binario a texto` | Convierte de binario |
| `Pancho: Texto a hexadecimal` | Convierte a hex |
| `Pancho: Hex a RGB` | Convierte color hex a RGB |

### Insertar
| Comando | Descripción |
|---------|-------------|
| `Pancho: Fecha y hora corta` | Inserta fecha/hora |
| `Pancho: Fecha y hora larga` | Inserta fecha/hora completa |
| `Pancho: Generar Lorem Ipsum` | Genera texto dummy |
| `Pancho: Generar UUID` | Genera UUID v4 |
| `Pancho: Generar cadena aleatoria` | Genera string aleatorio |

### Comentar / Descomentar
| Comando | Descripción |
|---------|-------------|
| `Pancho: Comentar línea` | Agrega comentario |
| `Pancho: Descomentar línea` | Quita comentario |
| `Pancho: Comentar bloque` | Comenta selección |
| `Pancho: Descomentar bloque` | Descomenta selección |

### Escapar
| Comando | Descripción |
|---------|-------------|
| `Pancho: Escapar para JSON` | Escapa caracteres JSON |
| `Pancho: Escapar para SQL` | Escapa comillas SQL |
| `Pancho: Escapar para Regex` | Escapa caracteres regex |
| `Pancho: Escapar para HTML` | Escapa caracteres HTML |

### Desarrolladores
| Comando | Descripción |
|---------|-------------|
| `Pancho: Duplicar línea` | Duplica línea actual |
| `Pancho: Mover línea arriba` | Sube línea |
| `Pancho: Mover línea abajo` | Baja línea |
| `Pancho: Eliminar líneas con...` | Filtra líneas por contenido |
| `Pancho: Contar coincidencias` | Cuenta ocurrencias |

## Atajos de teclado

| Atajo | Comando |
|-------|---------|
| `Ctrl+Shift+U` | Mayúsculas |
| `Ctrl+Shift+L` | Minúsculas |
| `Ctrl+Shift+T` | Recortar líneas |
| `Ctrl+Shift+W` | Contar palabras |
| `Ctrl+Shift+C` | Contar caracteres |
| `Ctrl+Shift+N` | Contar líneas |
| `Ctrl+Shift+S` | Ordenar A-Z |
| `Ctrl+Shift+D` | Eliminar duplicados |

## Configuración

| Opción | Default | Descripción |
|--------|---------|-------------|
| `pancho.tabSize` | `4` | Tamaño de tabulación |
| `pancho.defaultEOL` | `LF` | Fin de línea por defecto |
| `pancho.statusBarShowCounters` | `true` | Mostrar contadores |
| `pancho.maxFileSizeKB` | `5120` | Tamaño máximo de archivo |

## Contadores en barra de estado

Pancho muestra `L:X P:Y C:Z` (Líneas, Palabras, Caracteres) en la barra de estado. Se actualiza al seleccionar texto.

---

**¿Te gusta Pancho?** Deja una reseña en el Marketplace.
