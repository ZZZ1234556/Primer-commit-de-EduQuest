export const PREGUNTAS_DATA = [
  { pregunta: '¿Qué significa HTML?', opciones: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Tool Multi Language', 'Home Tool Markup Language'], correcta: 0 },
  { pregunta: '¿Cuál de estos es un lenguaje de programación?', opciones: ['HTML', 'CSS', 'Python', 'HTTP'], correcta: 2 },
  { pregunta: '¿Qué etiqueta se usa para crear un enlace en HTML?', opciones: ['<link>', '<a>', '<href>', '<url>'], correcta: 1 },
  { pregunta: '¿Cómo se declara una variable constante en JavaScript?', opciones: ['var x = 1;', 'let x = 1;', 'const x = 1;', 'constant x = 1;'], correcta: 2 },
  { pregunta: '¿Qué propiedad de CSS cambia el color del texto?', opciones: ['background-color', 'text-color', 'font-color', 'color'], correcta: 3 },
  { pregunta: '¿Qué hace console.log()?', opciones: ['Muestra un valor en la consola', 'Borra la pantalla', 'Crea una variable', 'Cierra el navegador'], correcta: 0 },
  { pregunta: '¿Qué símbolo inicia un comentario de una línea en JavaScript?', opciones: ['//', '#', '<!--', '**'], correcta: 0 },
  { pregunta: '¿Qué etiqueta HTML crea el título más grande?', opciones: ['<h6>', '<head>', '<h1>', '<title>'], correcta: 2 },
];

export const TECLEO_DATA = [
  'const velocidad = 120;', 'let pilotos = ["Neo", "Rex"];', 'if (nivel > 5) { turbo(); }', 'for (let i = 0; i < 3; i++) {}',
  'console.log("Meta alcanzada");', '<button class="boton">Ir</button>', 'document.querySelector(".pista");',
  'function sumar(a, b) { return a + b; }', '.auto { color: orange; margin: 4px; }', 'const dobles = nums.map(n => n * 2);',
];

export const BUGS_DATA = [
  { lineas: ['let total = 0;', 'for (let i = 0; i <= 3; i++) {', '  total += i;', '}', 'console.log(total);'], bug: 1, nota: 'Con <= el ciclo corre una vez de más. Debe ser i < 3.' },
  { lineas: ['const nombre = "Ana";', 'nombre = "Luis";', 'console.log(nombre);'], bug: 1, nota: 'Una const no se puede reasignar. Usa let.' },
  { lineas: ['<ul>', '  <li>Uno</li>', '  <li>Dos<li>', '</ul>'], bug: 2, nota: 'Falta cerrar la etiqueta: </li>.' },
  { lineas: ['if (edad = 18) {', '  console.log("Mayor");', '}'], bug: 0, nota: 'Un solo = asigna. Para comparar usa ===.' },
  { lineas: ['.caja {', '  color: red', '  margin: 10px;', '}'], bug: 1, nota: 'Falta el punto y coma después de red.' },
  { lineas: ['function sumar(a, b) {', '  a + b;', '}', 'console.log(sumar(2, 3));'], bug: 1, nota: 'Falta return: así la función devuelve undefined.' },
  { lineas: ['const frutas = ["pera", "uva"];', 'console.log(frutas[2]);'], bug: 1, nota: 'Los índices empiezan en 0. El último es frutas[1].' },
];

export const TIRO_DATA = [
  { q: "console.log(2 + '2')", ok: '"22"', mal: ['4', 'NaN', 'undefined'] },
  { q: 'typeof 42', ok: '"number"', mal: ['"string"', '"int"', '"digit"'] },
  { q: '[1, 2, 3].length', ok: '3', mal: ['2', '4', 'undefined'] },
  { q: 'Boolean(0)', ok: 'false', mal: ['true', '0', 'null'] },
  { q: "'hola'.toUpperCase()", ok: '"HOLA"', mal: ['"Hola"', '"hola"', 'error'] },
  { q: '10 % 3', ok: '1', mal: ['3', '0', '3.33'] },
  { q: "'5' * 2", ok: '10', mal: ['"52"', 'NaN', '7'] },
  { q: '[1, 2, 3].includes(4)', ok: 'false', mal: ['true', '4', 'undefined'] },
];

export const mezclar = (a) => [...a].sort(() => Math.random() - 0.5);