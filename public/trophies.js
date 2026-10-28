/* Sistema de trofeos de EduQuest.
   Cada juego tiene 7 niveles (novato -> profesional) y un platino al final.
   Para cambiar nombres o metas, edita las filas de abajo: [icono, nombre, descripción, qué se mide, meta].
   La imagen de cada trofeo es /public/trophies/<id>.png (el id es juego-nivel, ej: bugs-medio). */
(function () {
  const TIERS = ['novato', 'aprendiz', 'medio', 'superior', 'mega', 'experto', 'profesional'];
  const tierNombre = { novato: 'Novato', aprendiz: 'Aprendiz', medio: 'Medio', superior: 'Superior', mega: 'Mega superior', experto: 'Experto', profesional: 'Profesional', platino: 'Platino' };
  const groups = [
    { id: 'quiz',       nombre: 'Programación Básica' },
    { id: 'bugs',       nombre: 'Escáner de Bugs' },
    { id: 'tiro',       nombre: 'Tiro al Blanco' },
    { id: 'carrera',    nombre: 'Carrera de Código' },
    { id: 'teclas',     nombre: 'Carrera de Teclas' },
    { id: 'baloncesto', nombre: 'Baloncesto de Código' },
    { id: 'general',    nombre: 'General' }
  ];
  const list = [];
  function juego(game, filas, platino) {
    filas.forEach((f, i) => list.push({ game, id: game + '-' + TIERS[i], tier: TIERS[i], icon: f[0], name: f[1], desc: f[2], stat: f[3], target: f[4] }));
    if (platino) list.push({ game, id: game + '-platino', tier: 'platino', icon: 'trophy', name: platino[0], desc: platino[1], stat: 'juego', target: 0 });
  }

  juego('quiz', [
    ['star',  'Primer paso',         'Completa tu primer quiz.',          'quizzes', 1],
    ['book',  'Estudiante constante','Completa 5 quizzes.',               'quizzes', 5],
    ['quiz',  'Sin fallos',          'Consigue un quiz perfecto.',        'perfectos', 1],
    ['pad',   'Maratón de saber',    'Completa 20 quizzes.',              'quizzes', 20],
    ['medal', 'Mente brillante',     'Consigue 5 quizzes perfectos.',     'perfectos', 5],
    ['bulb',  'Cerebro de código',   'Completa 50 quizzes.',              'quizzes', 50],
    ['trophy','Genio perfecto',      'Consigue 15 quizzes perfectos.',    'perfectos', 15]
  ], ['Platino de Quizzes', 'Consigue todos los trofeos de Programación Básica.']);

  juego('bugs', [
    ['bug', 'Primer bug',           'Atrapa tu primer bug.',    'bugs', 1],
    ['bug', 'Ojo atento',           'Atrapa 10 bugs.',          'bugs', 10],
    ['bug', 'Cazabugs',             'Atrapa 25 bugs.',          'bugs', 25],
    ['bug', 'Detective del código', 'Atrapa 50 bugs.',          'bugs', 50],
    ['bug', 'Exterminador',         'Atrapa 100 bugs.',         'bugs', 100],
    ['bug', 'Plaga cero',           'Atrapa 200 bugs.',         'bugs', 200],
    ['bug', 'Leyenda del debug',    'Atrapa 400 bugs.',         'bugs', 400]
  ], ['Platino de Bugs', 'Consigue todos los trofeos del Escáner de Bugs.']);

  juego('tiro', [
    ['target', 'Primer disparo',     'Acierta tu primer blanco.', 'blancos', 1],
    ['target', 'Mano firme',         'Acierta 10 blancos.',       'blancos', 10],
    ['target', 'Ojo de águila',      'Acierta 30 blancos.',       'blancos', 30],
    ['target', 'Tirador',            'Acierta 60 blancos.',       'blancos', 60],
    ['target', 'Francotirador',      'Acierta 120 blancos.',      'blancos', 120],
    ['target', 'Pulso perfecto',     'Acierta 250 blancos.',      'blancos', 250],
    ['target', 'Leyenda del blanco', 'Acierta 500 blancos.',      'blancos', 500]
  ], ['Platino de Tiro', 'Consigue todos los trofeos de Tiro al Blanco.']);

  juego('carrera', [
    ['racer', 'Pole position',      'Gana una carrera de código.',    'carreras', 1],
    ['racer', 'Piloto de pruebas',  'Gana 2 carreras de código.',     'carreras', 2],
    ['car',   'Piloto veterano',    'Gana 4 carreras de código.',     'carreras', 4],
    ['car',   'Campeón de pista',   'Gana 8 carreras de código.',     'carreras', 8],
    ['car',   'Rey del asfalto',    'Gana 15 carreras de código.',    'carreras', 15],
    ['car',   'Máquina imparable',  'Gana 30 carreras de código.',    'carreras', 30],
    ['car',   'Leyenda del asfalto','Gana 60 carreras de código.',    'carreras', 60]
  ], ['Platino de Carreras', 'Consigue todos los trofeos de Carrera de Código.']);

  juego('teclas', [
    ['keyboard', 'Dedos ágiles',     'Gana una carrera de teclas.',  'teclas', 1],
    ['keyboard', 'Dedos veloces',    'Gana 2 carreras de teclas.',   'teclas', 2],
    ['keyboard', 'Mecanógrafo',      'Gana 4 carreras de teclas.',   'teclas', 4],
    ['keyboard', 'Teclado de acero', 'Gana 8 carreras de teclas.',   'teclas', 8],
    ['keyboard', 'Rayo del teclado', 'Gana 15 carreras de teclas.',  'teclas', 15],
    ['keyboard', 'Manos de fuego',   'Gana 30 carreras de teclas.',  'teclas', 30],
    ['keyboard', 'Maestro de teclas','Gana 60 carreras de teclas.',  'teclas', 60]
  ], ['Platino de Teclas', 'Consigue todos los trofeos de Carrera de Teclas.']);

  juego('baloncesto', [
    ['ball', 'Primera canasta',  'Anota una canasta.',     'canastas', 1],
    ['ball', 'Buen tiro',        'Anota 10 canastas.',     'canastas', 10],
    ['ball', 'Triplista',        'Anota 25 canastas.',     'canastas', 25],
    ['ball', 'Anotador',         'Anota 50 canastas.',     'canastas', 50],
    ['ball', 'Máximo anotador',  'Anota 100 canastas.',    'canastas', 100],
    ['ball', 'Estrella del aro', 'Anota 200 canastas.',    'canastas', 200],
    ['ball', 'Leyenda del aro',  'Anota 400 canastas.',    'canastas', 400]
  ], ['Platino de Baloncesto', 'Consigue todos los trofeos de Baloncesto de Código.']);

  // General: no tiene platino propio, cuenta para el platino grande
  juego('general', [
    ['rocket','Calentando motores','Consigue 500 XP.',                     'xp', 500],
    ['flame', 'Constante',         'Mantén una racha de 3 días.',          'racha', 3],
    ['pad',   'Todoterreno',       'Juega los 6 juegos al menos una vez.', 'juegos', 6],
    ['flame', 'Imparable',         'Consigue 2.000 XP.',                   'xp', 2000],
    ['flame', 'Hábito de hierro',  'Mantén una racha de 7 días.',          'racha', 7],
    ['gem',   'Leyenda viviente',  'Consigue 5.000 XP.',                   'xp', 5000],
    ['trophy','Élite de EduQuest', 'Consigue 10.000 XP.',                  'xp', 10000]
  ]);

  // Platino grande: todos los demás trofeos (incluidos los platinos de cada juego)
  list.push({ game: 'global', id: 'platino', tier: 'platino', icon: 'trophy', name: 'Maestro de EduQuest', desc: 'Desbloquea todos los demás trofeos.', stat: 'todos', target: 0 });

  const JUEGOS = ['quizzes', 'bugs', 'blancos', 'carreras', 'teclas', 'canastas'];
  function valor(tr, u, xp) {
    const s = (u && u.stats) || {};
    if (tr.stat === 'xp') return xp || 0;
    if (tr.stat === 'racha') return (u && u.racha) || 0;
    if (tr.stat === 'juegos') return JUEGOS.filter(k => (s[k] || 0) >= 1).length;
    return s[tr.stat] || 0;
  }
  // los trofeos que hay que tener para ganar un platino
  const otros = tr => list.filter(x => x.id !== tr.id && (tr.game === 'global' || x.game === tr.game));
  const meta = tr => tr.tier === 'platino' ? otros(tr).length : tr.target;
  window.EduTrophies = { groups, list, tierNombre, valor, otros, meta, sonido: true /* pon false para quitar el sonidito */ };
})();
