# Comandos de Pancho

Lista completa de los **138 comandos** que trae Pancho, agrupados en las mismas
categorías que ves en el menú contextual (`Clic derecho → Pancho`). Todos también
están disponibles desde la Paleta de comandos como `Pancho:`.

> [!TIP]
> El **hub de comandos** integrado (`Pancho: Mostrar menú de comandos`) lista las
> mismas categorías con sus atajos y tus comandos usados recientemente.

- [Edición](#edición)
  - [Editar](#editar)
  - [Tabulaciones](#tabulaciones)
  - [Fin de línea](#fin-de-línea)
- [Líneas](#líneas)
- [Texto y mayúsculas](#texto-y-mayúsculas)
  - [Mayúsculas y minúsculas](#mayúsculas-y-minúsculas)
  - [Texto general](#texto-general)
- [Convertir](#convertir)
  - [Codificación](#codificación)
  - [Formateo](#formateo)
  - [Hash y binario](#hash-y-binario)
- [Escapar](#escapar)
- [Desarrollo](#desarrollo)
  - [Comentar](#comentar--descomentar)
  - [Insertar](#insertar)
  - [Desarrolladores](#desarrolladores)
  - [Herramientas de desarrollo](#herramientas-de-desarrollo)
- [Macros y columnas](#macros-y-columnas)
  - [Macros](#macros)
  - [Columnas](#columnas)
- [Hub de comandos](#hub-de-comandos)

## Editar

### Editar
| Comando | Descripción |
|---------|-------------|
| `Pancho: Limpiar espacios en blanco` | Elimina espacios múltiples |
| `Pancho: Limpiar saltos de línea` | Normaliza saltos de línea |
| `Pancho: Recortar líneas` | Elimina espacios al inicio/final |
| `Pancho: Convertir saltos de línea a espacios` | Convierte saltos a espacios |
| `Pancho: Ajustar texto...` | Ajusta a ancho de columna |
| `Pancho: Desajustar texto` | Quita saltos de línea |

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

## Líneas
| Comando | Descripción |
|---------|-------------|
| `Pancho: Eliminar líneas duplicadas` | Quita todos los duplicados |
| `Pancho: Eliminar líneas duplicadas consecutivas` | Quita solo adyacentes |
| `Pancho: Ordenar A-Z` | Ordena ascendentemente |
| `Pancho: Ordenar Z-A` | Ordena descendentemente |
| `Pancho: Ordenar natural` | Orden natural (`file2` < `file10`) |
| `Pancho: Ordenar natural descendente` | Orden natural inverso |
| `Pancho: Ordenar por longitud` | Más cortas primero |
| `Pancho: Ordenar por longitud descendente` | Más largas primero |
| `Pancho: Ordenar numérico` | Numérico ascendente |
| `Pancho: Ordenar por columna...` | Ordena filas por una columna (delimitador + índice + numérico) |
| `Pancho: Revertir líneas` | Invierte el orden |
| `Pancho: Aleatorizar líneas` | Mezcla aleatoriamente |
| `Pancho: Unir líneas` | Combina líneas en una |
| `Pancho: Eliminar líneas vacías` | Quita líneas en blanco |

## Texto y mayúsculas

### Mayúsculas y minúsculas
| Comando | Descripción |
|---------|-------------|
| `Pancho: Convertir a MAYÚSCULAS` | TODO EN MAYÚSCULAS |
| `Pancho: Convertir a minúsculas` | todo en minúsculas |
| `Pancho: Convertir a Título` | Cada Palabra Capitalizada |
| `Pancho: Convertir a sentence case` | Sentence case |
| `Pancho: Invertir mayúsculas/minúsculas` | Intercambia may/min |
| `Pancho: Mayúsculas aleatorias` | May/min aleatorio |
| `Pancho: Convertir a camelCase` | camelCase |
| `Pancho: Convertir a PascalCase` | PascalCase |
| `Pancho: Convertir a snake_case` | snake_case |
| `Pancho: Convertir a kebab-case` | kebab-case |
| `Pancho: Convertir a CONSTANT_CASE` | CONSTANT_CASE |

### Texto general
| Comando | Descripción |
|---------|-------------|
| `Pancho: Contar palabras` | Cuenta palabras |
| `Pancho: Contar caracteres` | Cuenta caracteres |
| `Pancho: Contar líneas` | Cuenta líneas |
| `Pancho: Eliminar palabras duplicadas` | Elimina palabras duplicadas |
| `Pancho: Numerar líneas` | Agrega números de línea |
| `Pancho: Quitar números de línea` | Elimina números de línea |
| `Pancho: Generar slug URL` | Genera slug para URL |
| `Pancho: Revertir palabras` | Invierte orden de palabras |
| `Pancho: Aleatorizar líneas` | Mezcla aleatoriamente |
| `Pancho: Pegar sin salto de línea` | Pega sin saltos |
| `Pancho: Copiar a múltiples líneas` | Copia a múltiples líneas |
| `Pancho: Historial de portapapeles...` | Elige y pega una entrada previa del portapapeles |
| `Pancho: Formatear como CSV` | Formatea como CSV |
| `Pancho: Quitar acentos y diacríticos` | Quita acentos |
| `Pancho: Quitar etiquetas HTML` | Quita etiquetas HTML |
| `Pancho: CSV a JSON` | CSV → JSON |
| `Pancho: JSON a CSV` | JSON → CSV |
| `Pancho: CSV a TSV` | CSV → TSV |
| `Pancho: TSV a CSV` | TSV → CSV |
| `Pancho: CSV a tabla Markdown` | CSV → tabla Markdown |
| `Pancho: Tabla Markdown a CSV` | Tabla Markdown → CSV |
| `Pancho: Mantener líneas que coinciden con regex...` | Mantiene solo las líneas que coinciden |
| `Pancho: Eliminar líneas que coinciden con regex...` | Elimina las líneas que coinciden |

## Convertir

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
| `Pancho: Minificar JSON` | JSON en una línea |
| `Pancho: Formatear JSON` | JSON con indentación |
| `Pancho: Minificar HTML` | HTML comprimido |
| `Pancho: Formatear HTML` | HTML con indentación |
| `Pancho: Minificar CSS` | CSS comprimido |
| `Pancho: Formatear CSS` | CSS con indentación |
| `Pancho: Minificar JavaScript` | JS comprimido |
| `Pancho: Formatear JavaScript` | JS con indentación |
| `Pancho: Formatear SQL` | SQL con formato |
| `Pancho: Formatear XML` | XML con indentación |
| `Pancho: Minificar XML` | XML comprimido |

> Para JS/TS/JSON/HTML/CSS, el **Formatear documento** nativo de VS Code es sintáctico y más completo. Los formatters de Pancho son livianos (basados en regex) y aportan el **minificar**, que VS Code no trae.

### Hash y binario
| Comando | Descripción |
|---------|-------------|
| `Pancho: Hash MD5` | Genera hash MD5 |
| `Pancho: Hash SHA-256` | Genera hash SHA-256 |
| `Pancho: Texto a binario` | Convierte a binario |
| `Pancho: Binario a texto` | Convierte de binario |
| `Pancho: Texto a hexadecimal` | Convierte a hexadecimal |
| `Pancho: Hexadecimal a texto` | Convierte de hexadecimal |
| `Pancho: Hex a RGB` | Convierte color hex a RGB |
| `Pancho: RGB a Hex` | Convierte RGB a hex |

## Escapar
| Comando | Descripción |
|---------|-------------|
| `Pancho: Escapar para JSON` | Escapa caracteres JSON |
| `Pancho: Desescapar de JSON` | Desescapa de JSON |
| `Pancho: Escapar para SQL` | Escapa comillas SQL |
| `Pancho: Desescapar de SQL` | Desescapa de SQL |
| `Pancho: Escapar para Regex` | Escapa caracteres regex |
| `Pancho: Escapar para HTML` | Escapa caracteres HTML |
| `Pancho: Desescapar de HTML` | Desescapa de HTML |

## Desarrollo

### Comentar / Descomentar
| Comando | Descripción |
|---------|-------------|
| `Pancho: Comentar línea` | Alterna comentario de línea (delega en VS Code) |
| `Pancho: Comentar bloque` | Alterna comentario de bloque (delega en VS Code) |

### Insertar
| Comando | Descripción |
|---------|-------------|
| `Pancho: Fecha y hora corta` | Inserta fecha/hora corta |
| `Pancho: Fecha y hora larga` | Inserta fecha/hora larga |
| `Pancho: Fecha y hora (dd-MM-yyyy hh:mm:ss)` | Fecha/hora personalizada |
| `Pancho: Generar Lorem Ipsum` | Genera texto dummy |
| `Pancho: Generar UUID` | Genera UUID v4 |
| `Pancho: Generar cadena aleatoria` | Genera string aleatorio |

### Desarrolladores
| Comando | Descripción |
|---------|-------------|
| `Pancho: Duplicar línea` | Duplica línea actual |
| `Pancho: Insertar línea antes` | Inserta línea vacía antes |
| `Pancho: Insertar línea después` | Inserta línea vacía después |
| `Pancho: Mover línea arriba` | Sube línea |
| `Pancho: Mover línea abajo` | Baja línea |
| `Pancho: Eliminar líneas con...` | Elimina líneas por contenido |
| `Pancho: Mantener solo líneas con...` | Mantiene líneas por contenido |
| `Pancho: Transponer caracteres` | Intercambia últimos 2 chars |
| `Pancho: Transponer palabras` | Intercambia últimas 2 palabras |
| `Pancho: Transponer líneas` | Intercambia últimas 2 líneas |
| `Pancho: Alinear por =` | Alinea por igual |
| `Pancho: Alinear por :` | Alinea por dos puntos |
| `Pancho: Alinear por carácter...` | Alinea por carácter custom |

### Herramientas de desarrollo
| Comando | Descripción |
|---------|-------------|
| `Pancho: Decodificar JWT` | Decodifica token JWT |
| `Pancho: Timestamp a ISO` | Timestamp Unix → ISO |
| `Pancho: ISO a timestamp` | ISO → Timestamp Unix |
| `Pancho: Insertar timestamp actual` | Inserta timestamp actual |
| `Pancho: Cifrar con AES...` | Cifra AES-256-GCM |
| `Pancho: Descifrar con AES...` | Descifra AES-256-GCM |
| `Pancho: Información de color` | Muestra HEX + RGB + HSL |
| `Pancho: Probador de regex...` | Prueba rápida de regex desde un input |
| `Pancho: Panel de test de regex` | Panel completo con coincidencias en vivo, grupos y reemplazo |

## Macros y columnas

### Macros
| Comando | Descripción |
|---------|-------------|
| `Pancho: Macro: empezar grabación` | Empieza a grabar una macro |
| `Pancho: Macro: detener grabación` | Detiene y conserva la macro |
| `Pancho: Macro: reproducir` | Reproduce la última macro |
| `Pancho: Macro: guardar...` | Guarda la última macro |
| `Pancho: Macro: cargar...` | Carga una macro guardada |
| `Pancho: Macro: listar guardadas` | Lista las macros guardadas |
| `Pancho: Macro: exportar...` | Exporta las macros guardadas a un archivo JSON |
| `Pancho: Macro: importar...` | Importa macros desde un archivo JSON |

### Columnas
| Comando | Descripción |
|---------|-------------|
| `Pancho: Columna: insertar texto...` | Inserta texto en el bloque de columna |
| `Pancho: Columna: eliminar` | Elimina el bloque de columna |
| `Pancho: Columna: copiar` | Copia el bloque de columna |
| `Pancho: Columna: pegar` | Pega en el bloque de columna |
| `Pancho: Columna: rellenar serie...` | Rellena la columna con una serie incremental |

## Hub de comandos
| Comando | Descripción |
|---------|-------------|
| `Pancho: Mostrar menú de comandos` | Hub (Quick Pick) con todas las categorías y comandos (usados recientemente arriba) |
| `Pancho: Repetir último comando` | Reejecuta el comando anterior de Pancho |
| `Pancho: Repetir último comando N veces...` | Reejecuta el comando anterior N veces |
