/* ==========================================================
   PERMISSÕES / GRUPOS / USUÁRIOS
   ========================================================== */
INSERT INTO grupos_usuarios (tipo, adicionar, editar, remover, modificar_permissoes) VALUES
('adm', 1,1,1,0),
('user',0,0,0,0),
('owner',1,1,1,1)
ON DUPLICATE KEY UPDATE adicionar=VALUES(adicionar);

INSERT INTO usuarios (id, nick, email, senha, tipo_permissao)tipo_permissao VALUES
(Gerar_ID_Usuario(), 'rubens', 'rubens@exemplo.com', '$2b$12$abcdefghijklmnopqrstuvABCDEFGHIJKLMNOpqrstuvwx123456', 'adm'),
(Gerar_ID_Usuario(), 'ana',    'ana@exemplo.com',    '$2b$12$abcdefghijklmnopqrstuvABCDEFGHIJKLMNOpqrstuvwx123456', 'user'),
(Gerar_ID_Usuario(), 'joao',   'joao@exemplo.com',   '$2b$12$abcdefghijklmnopqrstuvABCDEFGHIJKLMNOpqrstuvwx123456', 'user');

/* ==========================================================
   FAMÍLIAS
   ========================================================== */
INSERT INTO familia_instrumento (ID, nome, descricao) VALUES
(Gerar_ID_Generico('FAM'),'Cordas dedilhadas','Violão, guitarra, harpa, bandolim, etc.'),
(Gerar_ID_Generico('FAM'),'Cordas friccionadas','Violino, viola, cello, contrabaixo.'),
(Gerar_ID_Generico('FAM'),'Teclados','Piano, órgão, cravo, teclados eletrônicos.'),
(Gerar_ID_Generico('FAM'),'Sopros (Madeiras)','Flautas, clarinetes, saxofones, oboé, fagote.'),
(Gerar_ID_Generico('FAM'),'Sopros (Metais)','Trompete, trombone, tuba, trompa, etc.'),
(Gerar_ID_Generico('FAM'),'Percussão','Membranofones e idiofones variados.'),
(Gerar_ID_Generico('FAM'),'Eletrônicos','Sintetizadores e controladores.'),
(Gerar_ID_Generico('FAM'),'Populares','Ukulele, cavaquinho, viola caipira.'),
(Gerar_ID_Generico('FAM'),'Étnicos','Instrumentos tradicionais de várias culturas.'),
(Gerar_ID_Generico('FAM'),'Outros','Categoria geral para diversos.');

/* ==========================================================
    MATERIAIS
   ========================================================== */
INSERT INTO material (ID, nome, descricao) VALUES
(Gerar_ID_Generico('MAT'),'Spruce','Tampo de ressonância leve e rígido'),
(Gerar_ID_Generico('MAT'),'Maple','Fundo e laterais com brilho'),
(Gerar_ID_Generico('MAT'),'Ébano','Escalas e cavaletes'),
(Gerar_ID_Generico('MAT'),'Nylon','Cordas de nylon'),
(Gerar_ID_Generico('MAT'),'Aço','Cordas de aço'),
(Gerar_ID_Generico('MAT'),'Latão','Ligas típicas de metais (trompete)'),
(Gerar_ID_Generico('MAT'),'Bronze','Pratos e ligas sonoras'),
(Gerar_ID_Generico('MAT'),'Pele sintética','Peles de bateria/pandeiro'),
(Gerar_ID_Generico('MAT'),'Bambu','Barras de idiofones e flautas'),
(Gerar_ID_Generico('MAT'),'Alumínio','Partes estruturais'),
(Gerar_ID_Generico('MAT'),'ABS','Componentes leves/plásticos'),
(Gerar_ID_Generico('MAT'),'Jacarandá','Madeira densa para timbre'),
(Gerar_ID_Generico('MAT'),'Cedro','Tampo alternativo ao spruce'),
(Gerar_ID_Generico('MAT'),'Pinho','Madeira para tampos mais acessíveis'),
(Gerar_ID_Generico('MAT'),'Carvalho','Corpos e shells robustos');

/* ==========================================================
   TÉCNICAS
   ========================================================== */
INSERT INTO tecnica (ID, nome, descricao) VALUES
(Gerar_ID_Generico('TEC'),'Palm muting','Abafar cordas com a mão direita na ponte'),
(Gerar_ID_Generico('TEC'),'Legato','Ligações hammer-on e pull-off'),
(Gerar_ID_Generico('TEC'),'Vibrato','Oscilação controlada da altura'),
(Gerar_ID_Generico('TEC'),'Staccato','Notas curtas/destacadas'),
(Gerar_ID_Generico('TEC'),'Arco détaché','Golpes separados em cordas friccionadas'),
(Gerar_ID_Generico('TEC'),'Glissando','Deslizamento contínuo de altura'),
(Gerar_ID_Generico('TEC'),'Slap','Ataque percussivo em cordas'),
(Gerar_ID_Generico('TEC'),'Roll','Execução contínua percussiva'),
(Gerar_ID_Generico('TEC'),'Tremolo','Repetição rápida da mesma nota'),
(Gerar_ID_Generico('TEC'),'Pizzicato','Beliscar cordas com os dedos');

/* ==========================================================
	AFINAÇÕES
   ========================================================== */
INSERT INTO afinacao (ID, nome, descricao, referencia) VALUES
(Gerar_ID_Generico('AFI'),'Violão Padrão EADGBE','Afinação padrão de violão','A440'),
(Gerar_ID_Generico('AFI'),'Guitarra Padrão EADGBE','Afinação padrão de guitarra','A440'),
(Gerar_ID_Generico('AFI'),'Violino GDAE','Afinação em quintas','A440'),
(Gerar_ID_Generico('AFI'),'Viola CGDA','Afinação em quintas','A440'),
(Gerar_ID_Generico('AFI'),'Cello CGDA','Afinação em quintas','A440'),
(Gerar_ID_Generico('AFI'),'Contrabaixo EADG','Quartas ascendentes','A440'),
(Gerar_ID_Generico('AFI'),'Piano 440Hz','Concert pitch padrão','A440'),
(Gerar_ID_Generico('AFI'),'Sax Alto Eb','Instrumento transpositor em Eb','A440'),
(Gerar_ID_Generico('AFI'),'Clarinete Bb','Instrumento transpositor em Bb','A440'),
(Gerar_ID_Generico('AFI'),'Trompete Bb','Instrumento transpositor em Bb','A440'),
(Gerar_ID_Generico('AFI'),'Trombone C','Costuma não transpor','A440'),
(Gerar_ID_Generico('AFI'),'Ukulele GCEA','Afinação reentrante','A440'),
(Gerar_ID_Generico('AFI'),'Cavaquinho DGBD','Popular no samba/choro','A440'),
(Gerar_ID_Generico('AFI'),'Viola Caipira Cebolão','Variações abertas regionais','A440'),
(Gerar_ID_Generico('AFI'),'Guitarra Drop D','Afinação com 6ª corda em D','A440'),
(Gerar_ID_Generico('AFI'),'Guitarra DADGAD','Aberta modal','A440');

/* ==========================================================
   INSTRUMENTOS
   ========================================================== */
INSERT INTO instrumento (ID, familia_id, nome, descricao, historia, classificacao_sonoridade) VALUES
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Cordas dedilhadas' LIMIT 1), 'Violão','Cordas de nylon/aco, caixa acústica.','Popularizado no séc. XIX.','cordas'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Cordas dedilhadas' LIMIT 1), 'Guitarra','Cordas de aço, corpo maciço/semissólido.','Evoluiu do violão; anos 50+.','eletronico'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Cordas dedilhadas' LIMIT 1), 'Harpa','Cordas múltiplas tocadas com dedos.','Harpa de pedal moderna é orquestral.','cordas'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Cordas friccionadas' LIMIT 1), 'Violino','4 cordas friccionadas com arco.','Consolidado no séc. XVII.','cordas'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Cordas friccionadas' LIMIT 1), 'Viola','Registro mais grave que violino.','Importante na música de câmara.','cordas'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Cordas friccionadas' LIMIT 1), 'Cello','Registro grave e aveludado.','Pilar da família de cordas.','cordas'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Cordas friccionadas' LIMIT 1), 'Contrabaixo','Mais grave da família.','Muito usado no jazz.','cordas'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Teclados' LIMIT 1), 'Piano','Teclado com martelos e cordas.','Desenvolvido séc. XVIII.','teclado'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Teclados' LIMIT 1), 'Órgão','Teclado com tubos/eletrônico.','Tradição litúrgica.','teclado'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Eletrônicos' LIMIT 1), 'Sintetizador','Geração eletrônica de som.','Base da música eletrônica.','eletronico'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Sopros (Madeiras)' LIMIT 1), 'Flauta Transversal','Não usa palheta.','Material moderno em metal.','sopro'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Sopros (Madeiras)' LIMIT 1), 'Clarinete','Palheta simples, tubo cilíndrico.','Afinado em Bb.','sopro'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Sopros (Madeiras)' LIMIT 1), 'Saxofone Alto','Palheta simples, corpo cônico.','Adolphe Sax.','sopro'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Sopros (Metais)' LIMIT 1), 'Trompete','Metal em Bb, som brilhante.','Jazz e orquestra.','sopro'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Sopros (Metais)' LIMIT 1), 'Trombone','Vara deslizante.','Versátil em banda/orquestra.','sopro'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Percussão' LIMIT 1), 'Bateria','Conjunto de tambores e pratos.','Base rítmica da música popular.','percussao'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Percussão' LIMIT 1), 'Xilofone','Barras afinadas (idiofone).','Orquestra/banda sinfônica.','percussao'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Percussão' LIMIT 1), 'Pandeiro','Aro com platinelas.','Samba/choro.','percussao'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Populares' LIMIT 1), 'Ukulele','Cordas dedilhadas, timbre doce.','Originário do Havaí.','cordas'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Populares' LIMIT 1), 'Cavaquinho','Similar ao ukulele, afinação distinta.','Presença no samba.','cordas'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Populares' LIMIT 1), 'Viola Caipira','Curso duplo de cordas.','Tradição brasileira.','cordas'),
(Gerar_ID_Generico('INS'), (SELECT ID FROM familia_instrumento WHERE nome='Outros' LIMIT 1), 'Bandolim','Cordas duplas dedilhadas.','Clássico no choro.','cordas');

/* ==========================================================
   ALCANCE
   ========================================================== */
INSERT INTO alcance_instrumento (instrumento_id, tipo, nota_min, nota_max)
SELECT i.ID, 'geral', v.min_nota, v.max_nota
FROM instrumento i
JOIN (
  SELECT 'Violão' AS n, 'a' AS min_nota, 'b' AS max_nota UNION ALL
  SELECT 'Guitarra','a','b' UNION ALL
  SELECT 'Harpa','a','b' UNION ALL
  SELECT 'Violino','a','b' UNION ALL
  SELECT 'Viola','a','b' UNION ALL
  SELECT 'Cello','a','b' UNION ALL
  SELECT 'Contrabaixo','a','b' UNION ALL
  SELECT 'Piano','a','b' UNION ALL
  SELECT 'Órgão','a','b' UNION ALL
  SELECT 'Sintetizador','a','b' UNION ALL
  SELECT 'Flauta Transversal','a','b' UNION ALL
  SELECT 'Clarinete','a','b' UNION ALL
  SELECT 'Saxofone Alto','a','b' UNION ALL
  SELECT 'Trompete','a','b' UNION ALL
  SELECT 'Trombone','a','b' UNION ALL
  SELECT 'Bateria','a','b' UNION ALL
  SELECT 'Xilofone','a','b' UNION ALL
  SELECT 'Pandeiro','a','b' UNION ALL
  SELECT 'Ukulele','a','b' UNION ALL
  SELECT 'Cavaquinho','a','b' UNION ALL
  SELECT 'Viola Caipira','a','b' UNION ALL
  SELECT 'Bandolim','a','b'
) v ON v.n = i.nome;

/* ==========================================================
   ESPECIALIZAÇÕES
   ========================================================== */
INSERT INTO instrumento_harmonico (instrumento_id, polifonia_max, possui_pedal_sustain, suporta_acordes)
SELECT ID, polif, sustain, acordes FROM (
  SELECT (SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1) AS ins, 6 AS polif, 0 AS sustain, 1 AS acordes UNION ALL
  SELECT (SELECT ID FROM instrumento WHERE nome='Guitarra' LIMIT 1), 6, 0, 1 UNION ALL
  SELECT (SELECT ID FROM instrumento WHERE nome='Harpa' LIMIT 1), 16, 0, 1 UNION ALL
  SELECT (SELECT ID FROM instrumento WHERE nome='Piano' LIMIT 1), 10, 1, 1 UNION ALL
  SELECT (SELECT ID FROM instrumento WHERE nome='Órgão' LIMIT 1), 10, 1, 1 UNION ALL
  SELECT (SELECT ID FROM instrumento WHERE nome='Sintetizador' LIMIT 1), 16, 1, 1 UNION ALL
  SELECT (SELECT ID FROM instrumento WHERE nome='Ukulele' LIMIT 1), 4, 0, 1 UNION ALL
  SELECT (SELECT ID FROM instrumento WHERE nome='Bandolim' LIMIT 1), 8, 0, 1
) m JOIN instrumento i ON i.ID = m.ins;

/* melódicos */
INSERT INTO instrumento_melodico (instrumento_id, transpositor, afinacao_transposicao, microtonalidade_suportada) VALUES
((SELECT ID FROM instrumento WHERE nome='Flauta Transversal' LIMIT 1), 0, 'C', 0),
((SELECT ID FROM instrumento WHERE nome='Clarinete' LIMIT 1), 1, 'Bb', 0),
((SELECT ID FROM instrumento WHERE nome='Saxofone Alto' LIMIT 1), 1, 'Eb', 0),
((SELECT ID FROM instrumento WHERE nome='Trompete' LIMIT 1), 1, 'Bb', 0),
((SELECT ID FROM instrumento WHERE nome='Trombone' LIMIT 1), 0, 'C', 0);

/* rítmicos */
INSERT INTO instrumento_ritmico (instrumento_id, altura_definida, categoria_percussao, tocado_com) VALUES
((SELECT ID FROM instrumento WHERE nome='Bateria' LIMIT 1), 0, 'membranofone', 'baqueta'),
((SELECT ID FROM instrumento WHERE nome='Xilofone' LIMIT 1), 1, 'idiofone', 'baqueta'),
((SELECT ID FROM instrumento WHERE nome='Pandeiro' LIMIT 1), 0, 'membranofone', 'mao');

/* ==========================================================
   PARTES
   ========================================================== */
INSERT INTO parte (instrumento_id, nome, descricao) VALUES
((SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1),'tampo','Tampo de spruce'),
((SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1),'fundo','Fundo de maple'),
((SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1),'lateral','Laterais de maple'),
((SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1),'escala','Escala de ébano'),
((SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1),'cordas','Cordas nylon/aço'),

((SELECT ID FROM instrumento WHERE nome='Guitarra' LIMIT 1),'corpo','Corpo sólido/semissólido'),
((SELECT ID FROM instrumento WHERE nome='Guitarra' LIMIT 1),'escala','Ébano ou rosewood'),
((SELECT ID FROM instrumento WHERE nome='Guitarra' LIMIT 1),'cordas','Cordas de aço'),

((SELECT ID FROM instrumento WHERE nome='Violino' LIMIT 1),'tampo','Tampo esculpido'),
((SELECT ID FROM instrumento WHERE nome='Violino' LIMIT 1),'espelho','Espelho de ébano'),
((SELECT ID FROM instrumento WHERE nome='Violino' LIMIT 1),'cordas','Cordas de aço'),

((SELECT ID FROM instrumento WHERE nome='Piano' LIMIT 1),'teclas','Mecanismo de teclas/martelos'),
((SELECT ID FROM instrumento WHERE nome='Piano' LIMIT 1),'cordas','Cordas internas'),

((SELECT ID FROM instrumento WHERE nome='Bateria' LIMIT 1),'bumbo','Tambor grave'),
((SELECT ID FROM instrumento WHERE nome='Bateria' LIMIT 1),'caixa','Tambor principal'),
((SELECT ID FROM instrumento WHERE nome='Bateria' LIMIT 1),'pratos','Conjunto de pratos'),

((SELECT ID FROM instrumento WHERE nome='Xilofone' LIMIT 1),'barras','Barras afinadas'),
((SELECT ID FROM instrumento WHERE nome='Pandeiro' LIMIT 1),'pele','Membrana do pandeiro');

/* ==========================================================
   INSTRUMENTO x MATERIAL x PARTE
   ========================================================== */
INSERT INTO instrumento_material_parte (instrumento_id, material_id, parte_nome) VALUES
((SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1),   (SELECT ID FROM material WHERE nome='Spruce' LIMIT 1), 'tampo'),
((SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1),   (SELECT ID FROM material WHERE nome='Maple' LIMIT 1),  'fundo'),
((SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1),   (SELECT ID FROM material WHERE nome='Maple' LIMIT 1),  'lateral'),
((SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1),   (SELECT ID FROM material WHERE nome='Ébano' LIMIT 1),  'escala'),
((SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1),   (SELECT ID FROM material WHERE nome='Nylon' LIMIT 1),  'cordas'),

((SELECT ID FROM instrumento WHERE nome='Guitarra' LIMIT 1), (SELECT ID FROM material WHERE nome='Ébano' LIMIT 1),  'escala'),
((SELECT ID FROM instrumento WHERE nome='Guitarra' LIMIT 1), (SELECT ID FROM material WHERE nome='Aço' LIMIT 1),    'cordas'),
((SELECT ID FROM instrumento WHERE nome='Guitarra' LIMIT 1), (SELECT ID FROM material WHERE nome='Alumínio' LIMIT 1),'corpo'),

((SELECT ID FROM instrumento WHERE nome='Violino' LIMIT 1),  (SELECT ID FROM material WHERE nome='Ébano' LIMIT 1),  'espelho'),
((SELECT ID FROM instrumento WHERE nome='Violino' LIMIT 1),  (SELECT ID FROM material WHERE nome='Aço' LIMIT 1),    'cordas'),
((SELECT ID FROM instrumento WHERE nome='Violino' LIMIT 1),  (SELECT ID FROM material WHERE nome='Spruce' LIMIT 1), 'tampo'),

((SELECT ID FROM instrumento WHERE nome='Piano' LIMIT 1),    (SELECT ID FROM material WHERE nome='Alumínio' LIMIT 1),'teclas'),
((SELECT ID FROM instrumento WHERE nome='Piano' LIMIT 1),    (SELECT ID FROM material WHERE nome='Aço' LIMIT 1),    'cordas'),

((SELECT ID FROM instrumento WHERE nome='Bateria' LIMIT 1),  (SELECT ID FROM material WHERE nome='Pele sintética' LIMIT 1),'bumbo'),
((SELECT ID FROM instrumento WHERE nome='Bateria' LIMIT 1),  (SELECT ID FROM material WHERE nome='Pele sintética' LIMIT 1),'caixa'),
((SELECT ID FROM instrumento WHERE nome='Bateria' LIMIT 1),  (SELECT ID FROM material WHERE nome='Bronze' LIMIT 1), 'pratos'),

((SELECT ID FROM instrumento WHERE nome='Xilofone' LIMIT 1), (SELECT ID FROM material WHERE nome='Bambu' LIMIT 1),  'barras'),
((SELECT ID FROM instrumento WHERE nome='Pandeiro' LIMIT 1), (SELECT ID FROM material WHERE nome='Pele sintética' LIMIT 1),'pele');

/* ==========================================================
   INSTRUMENTO x AFINAÇÃO
   ========================================================== */
INSERT INTO instrumento_afinacao (instrumento_id, afinacao_id, contexto) VALUES
((SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1),        (SELECT ID FROM afinacao WHERE nome='Violão Padrão EADGBE' LIMIT 1), 'padrao'),
((SELECT ID FROM instrumento WHERE nome='Guitarra' LIMIT 1),      (SELECT ID FROM afinacao WHERE nome='Guitarra Padrão EADGBE' LIMIT 1), 'padrao'),
((SELECT ID FROM instrumento WHERE nome='Guitarra' LIMIT 1),      (SELECT ID FROM afinacao WHERE nome='Guitarra Drop D' LIMIT 1), 'alternativa'),
((SELECT ID FROM instrumento WHERE nome='Guitarra' LIMIT 1),      (SELECT ID FROM afinacao WHERE nome='Guitarra DADGAD' LIMIT 1), 'alternativa'),
((SELECT ID FROM instrumento WHERE nome='Violino' LIMIT 1),       (SELECT ID FROM afinacao WHERE nome='Violino GDAE' LIMIT 1), 'padrao'),
((SELECT ID FROM instrumento WHERE nome='Viola' LIMIT 1),         (SELECT ID FROM afinacao WHERE nome='Viola CGDA' LIMIT 1), 'padrao'),
((SELECT ID FROM instrumento WHERE nome='Cello' LIMIT 1),         (SELECT ID FROM afinacao WHERE nome='Cello CGDA' LIMIT 1), 'padrao'),
((SELECT ID FROM instrumento WHERE nome='Contrabaixo' LIMIT 1),   (SELECT ID FROM afinacao WHERE nome='Contrabaixo EADG' LIMIT 1), 'padrao'),
((SELECT ID FROM instrumento WHERE nome='Piano' LIMIT 1),         (SELECT ID FROM afinacao WHERE nome='Piano 440Hz' LIMIT 1), 'padrao'),
((SELECT ID FROM instrumento WHERE nome='Órgão' LIMIT 1),         (SELECT ID FROM afinacao WHERE nome='Piano 440Hz' LIMIT 1), 'referencia'),
((SELECT ID FROM instrumento WHERE nome='Saxofone Alto' LIMIT 1), (SELECT ID FROM afinacao WHERE nome='Sax Alto Eb' LIMIT 1), 'padrao'),
((SELECT ID FROM instrumento WHERE nome='Clarinete' LIMIT 1),     (SELECT ID FROM afinacao WHERE nome='Clarinete Bb' LIMIT 1), 'padrao'),
((SELECT ID FROM instrumento WHERE nome='Trompete' LIMIT 1),      (SELECT ID FROM afinacao WHERE nome='Trompete Bb' LIMIT 1), 'padrao');

/* ==========================================================
	ÁUDIOS
   ========================================================== */
INSERT INTO audio (ID, instrumento_id, titulo, descricao, nota, oitava, bpm, arquivo, credito_gravacao) VALUES
(Gerar_ID_Generico('AUD'), (SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1), 'Arpejos em E maior','Exemplo de arpejos no violão','E',4,96,'/audios/violao_e_arpejos.mp3','Estúdio A'),
(Gerar_ID_Generico('AUD'), (SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1), 'Bossa Nova groove','Padrão bossa em nylon','A',4,120,'/audios/violao_bossa.mp3','Prod. X'),
(Gerar_ID_Generico('AUD'), (SELECT ID FROM instrumento WHERE nome='Guitarra' LIMIT 1), 'Riff Rock','Palhetada alternada','E',3,140,'/audios/guitarra_riff.mp3','Studio Z'),
(Gerar_ID_Generico('AUD'), (SELECT ID FROM instrumento WHERE nome='Piano' LIMIT 1), 'Prelúdio','Trecho lento com sustain','C',4,72,'/audios/piano_preludio.mp3','Pianista Y'),
(Gerar_ID_Generico('AUD'), (SELECT ID FROM instrumento WHERE nome='Flauta Transversal' LIMIT 1), 'Escala maior','Execução clara','G',5,84,'/audios/flauta_maior.mp3','Flautista K'),
(Gerar_ID_Generico('AUD'), (SELECT ID FROM instrumento WHERE nome='Bateria' LIMIT 1), 'Groove pop','Beat 4/4 padrão','-',0,110,'/audios/bateria_pop.mp3','Drummer Q'),
(Gerar_ID_Generico('AUD'), (SELECT ID FROM instrumento WHERE nome='Xilofone' LIMIT 1), 'Passagem rápida','Barras agudas','F',5,132,'/audios/xilofone_fast.mp3','Perc. W'),
(Gerar_ID_Generico('AUD'), (SELECT ID FROM instrumento WHERE nome='Trompete' LIMIT 1), 'Chamada de metal','Frase curta','C',5,126,'/audios/trompete_call.mp3','Metais Sec.'),
(Gerar_ID_Generico('AUD'), (SELECT ID FROM instrumento WHERE nome='Ukulele' LIMIT 1), 'Ilhas','Strumming reentrante','C',5,92,'/audios/ukulele_ilhas.mp3','Ukulele Lab'),
(Gerar_ID_Generico('AUD'), (SELECT ID FROM instrumento WHERE nome='Cavaquinho' LIMIT 1), 'Partido alto','Levadas típicas','D',5,120,'/audios/cavaquinho_partido.mp3','Ritmo B');

/* ==========================================================
   ÁUDIO x TÉCNICA
   ========================================================== */
INSERT INTO audio_tecnica (audio_id, tecnica_id)
SELECT a.ID, t.ID FROM
(SELECT ID FROM audio ORDER BY ID ASC LIMIT 10) a
JOIN tecnica t
ON t.nome IN ('Vibrato','Legato','Palm muting','Staccato','Glissando','Slap','Roll','Tremolo','Pizzicato','Arco détaché')
LIMIT 10;

/* ==========================================================
	APELIDOS
   ========================================================== */

INSERT INTO apelidos (instrumento_id, apelido) VALUES
((SELECT ID FROM instrumento WHERE nome='Violão' LIMIT 1),'violão clássico'),
((SELECT ID FROM instrumento WHERE nome='Guitarra' LIMIT 1),'guita'),
((SELECT ID FROM instrumento WHERE nome='Violino' LIMIT 1),'fiddle'),
((SELECT ID FROM instrumento WHERE nome='Bateria' LIMIT 1),'kit'),
((SELECT ID FROM instrumento WHERE nome='Pandeiro' LIMIT 1),'pandeirola');

