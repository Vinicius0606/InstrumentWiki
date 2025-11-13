-- Apaga o banco caso exista
drop database if exists musica;

-- Cria o banco caso não exista
create database if not exists musica;

-- Seleciona o banco para uso
use musica;

-- ============================
--       TABELAS BÁSICAS
-- ============================

-- Tabela de famílias de instrumentos (ex.: cordas, sopro etc.)
create table familia_instrumento(
	ID varchar(12) not null,
    nome varchar(255) not null,
    descricao text null,
    primary key (ID)
);

-- Tabela principal de instrumentos
create table instrumento(
	ID varchar(12) not null,
    familia_id varchar(12) not null,
    nome varchar(100) not null,
    descricao text null,
    historia text null,
    classificacao_sonoridade varchar(20) not null,
    primary key(ID),
    constraint FK_FamiliaInstrumento_Instrumento
    foreign key (familia_id) references familia_instrumento (ID)
    on update cascade
    on delete restrict
);

-- Tabela contendo áudios ligados a instrumentos
create table audio(
	ID varchar(12) not null,
    instrumento_id varchar(12) not null,
    titulo varchar(50) not null,
    descricao text null,
    nota varchar(20) not null,
    oitava int not null,
    bpm int null,
    arquivo varchar(255) not null,
    credito_gravacao varchar(100) null,
    primary key (ID),
    constraint FK_Instrumento_Audio
    foreign key (instrumento_id) references instrumento (ID)
    on update cascade
    on delete restrict
);

-- Técnicas musicais (ex.: vibrato, pizzicato etc.)
create table tecnica(
	ID varchar(12) not null,
    nome varchar(100) not null,
    descricao text null,
    primary key (ID)
);

-- Associação N:N entre áudio e técnica
create table audio_tecnica(
	audio_id varchar(12) not null,
    tecnica_id varchar(12) not null,
    primary key(audio_id, tecnica_id),
    constraint FK_Audio_Associar_Tecnica
    foreign key (audio_id) references audio (ID)
    on update cascade
    on delete cascade,
    constraint FK_Tecnica_Associar_Audio
    foreign key (tecnica_id) references tecnica (ID)
    on update cascade
    on delete cascade
);

-- Alcance sonoro (faixa de notas)
create table alcance_instrumento(
	instrumento_id varchar(12) not null,
    tipo varchar(25) not null,
    nota_min varchar(10) not null,
    nota_max varchar(10) not null,
    primary key (instrumento_id, tipo),
    constraint FK_Instrumento_Alcance
    foreign key (instrumento_id) references instrumento (ID)
    on update cascade
    on delete cascade
);

-- Afinacoes (padrão, baroque etc.)
create table afinacao(
	ID varchar(12) not null,
    nome varchar(100) not null unique,
    descricao text null,
    referencia varchar(50) null,
    primary key (ID)
);

-- Associação N:N instrumento → afinação
create table instrumento_afinacao(
	instrumento_id varchar(12) not null,
    afinacao_id varchar(12) not null,
    contexto varchar(30) not null,
    primary key (instrumento_id, afinacao_id),
    constraint FK_Instrumento_Associar_Afinacao
    foreign key (instrumento_id) references instrumento (ID)
    on update cascade
    on delete cascade,
    constraint FK_Afinacao_Associar_Instrumento
    foreign key (afinacao_id) references afinacao (ID)
    on update cascade
    on delete cascade
);

-- Materiais (madeira, metal etc.)
create table material(
	ID varchar(12) not null,
    nome varchar(100) not null unique,
    descricao text null,
    primary key (ID)
);

-- Partes físicas do instrumento (ex.: boquilha, corpo, arco)
create table parte(
	instrumento_id varchar(12) not null,
    nome varchar(100) not null,
    descricao text null,
    primary key (instrumento_id, nome),
    constraint FK_Instrumento_Parte
    foreign key (instrumento_id) references instrumento (ID)
	on update cascade
    on delete cascade
);

-- Associação entre partes e materiais
create table instrumento_material_parte(
	instrumento_id varchar(12) not null,
    material_id varchar(12) not null,
    parte_nome varchar(100) not null,
    primary key (instrumento_id, material_id, parte_nome),
    constraint FK_Material_Associar_ParteInstrumento
    foreign key (material_id) references material (ID)
	on update cascade
    on delete cascade,
    constraint FK_ParteInstrumento_Associar_Material
    foreign key (instrumento_id, parte_nome) references parte (instrumento_id, nome)
	on update cascade
    on delete cascade
);

-- Apelidos de instrumentos (ex.: "tuba mirim")
create table apelidos(
	instrumento_id varchar(12) not null,
    apelido varchar(100) not null,
    primary key (instrumento_id, apelido),
    constraint FK_Instrumento_Apelidos
    foreign key (instrumento_id) references instrumento (ID)
    on update cascade
    on delete cascade
);

-- Especialização: instrumentos harmônicos
create table instrumento_harmonico(
	instrumento_id varchar(12) not null,
    polifonia_max int not null,
    possui_pedal_sustain boolean not null,
    suporta_acordes boolean not null,
    primary key (instrumento_id),
    constraint FK_Instrumento_Harmonico
    foreign key (instrumento_id) references instrumento (ID)
    on update cascade
    on delete restrict
);

-- Especialização: instrumentos melódicos
create table instrumento_melodico(
	instrumento_id varchar(12) not null,
    transpositor boolean not null,
    afinacao_transposicao enum('C', 'Bb', 'Eb', 'F', 'outro') not null,
    microtonalidade_suportada boolean not null,
    primary key (instrumento_id),
    constraint FK_Instrumento_Melodico
    foreign key (instrumento_id) references instrumento (ID)
    on update cascade
    on delete restrict
);

-- Especialização: instrumentos rítmicos
create table instrumento_ritmico(
	instrumento_id varchar(12) not null,
    altura_definida boolean not null,
    categoria_percussao enum('membranofone','idiofone','cordofone','aerofone','eletrofone') not null,
    tocado_com enum('baqueta','mao','hibrido','outro') not null,
    primary key (instrumento_id),
    constraint FK_Instrumento_Ritmico
    foreign key (instrumento_id) references instrumento (ID)
    on update cascade
    on delete restrict
);

-- ============================
--       USUÁRIOS E GRUPOS
-- ============================

-- Grupos com permissões (RBAC simplificado)
create table grupos_usuarios(
	tipo enum('adm', 'user', 'owner') not null,
    adicionar boolean not null,
    editar boolean not null,
    remover boolean not null,
    modificar_permissoes boolean not null,
    primary key(tipo)
);

-- Usuários do sistema
create table usuarios(
	id varchar(32) not null,
    nick varchar(32) unique not null,
    email varchar(128) not null,
    senha varchar(128) not null,
    tipo_permissao enum('adm', 'user', 'owner') not null,
    primary key (id),
    constraint FK_user_permissao
    foreign key (tipo_permissao) references grupos_usuarios (tipo)
    on update cascade
    on delete restrict
);

-- ============================
--       ÍNDICES ÚNICOS
-- ============================

CREATE UNIQUE INDEX material_parte_instrumento_index ON instrumento_material_parte(instrumento_id, material_id, parte_nome);
CREATE UNIQUE INDEX audio_tecnica_index ON audio_tecnica(audio_id, tecnica_id);
CREATE UNIQUE INDEX instrumento_afinacao_index ON instrumento_afinacao(instrumento_id, afinacao_id);
CREATE UNIQUE INDEX apelidos_index ON apelidos(instrumento_id, apelido);
CREATE UNIQUE INDEX parte_index ON parte(instrumento_id, nome);

-- ============================
--       FUNÇÕES
-- ============================

-- Gera IDs genéricos como FAM202500001
DELIMITER //
CREATE FUNCTION Gerar_ID_Generico(prefixo varchar(3))
RETURNS VARCHAR(12)
NOT DETERMINISTIC READS SQL DATA
BEGIN
	DECLARE ano int;    
    DECLARE ultimoID varchar(12);
    
	SET ano = YEAR(CURDATE());
    
    -- Busca último ID existente para incrementar
    CASE
		WHEN prefixo = 'FAM' THEN
			SELECT ID INTO ultimoID FROM familia_instrumento ORDER BY ID DESC LIMIT 1;
        WHEN prefixo = 'AUD' THEN
			SELECT ID INTO ultimoID FROM audio ORDER BY ID DESC LIMIT 1;
        WHEN prefixo = 'INS' THEN
			SELECT ID INTO ultimoID FROM instrumento ORDER BY ID DESC LIMIT 1;
        WHEN prefixo = 'AFI' THEN
			SELECT ID INTO ultimoID FROM afinacao ORDER BY ID DESC LIMIT 1;
        WHEN prefixo = 'TEC' THEN
			SELECT ID INTO ultimoID FROM tecnica ORDER BY ID DESC LIMIT 1;
        WHEN prefixo = 'MAT' THEN
			SELECT ID INTO ultimoID FROM material ORDER BY ID DESC LIMIT 1;
	END CASE;
	    
    IF ultimoID IS NULL THEN
		RETURN CONCAT(UPPER(prefixo), CAST(ano as CHAR), '00001');
	END IF;
	
    RETURN CONCAT(UPPER(prefixo), CAST(ano as CHAR), LPAD(CAST(RIGHT(ultimoID, 5) AS UNSIGNED) + 1, 5, '0'));
END //
DELIMITER ;

-- Gera IDs de usuários usando SHA2 + UUID
DELIMITER //
CREATE FUNCTION Gerar_ID_Usuario()
RETURNS VARCHAR(32)
DETERMINISTIC
BEGIN
	DECLARE ID VARCHAR(32);
    SET ID = LEFT( SHA2( CONCAT(UUID(), RAND(), NOW() ), 256), 32);
    RETURN ID;
END //
DELIMITER ;

-- ============================
--       TRIGGERS
-- ============================

-- Garante que o instrumento só tenha uma especialização (harmônico)
DELIMITER //
CREATE TRIGGER instrumento_harmonico_uma_especializacao_somente
BEFORE INSERT ON instrumento_harmonico
FOR EACH ROW
BEGIN	
    IF EXISTS(SELECT 1 FROM instrumento_melodico WHERE instrumento_id = NEW.instrumento_id)
    OR EXISTS(SELECT 1 FROM instrumento_ritmico WHERE instrumento_id = NEW.instrumento_id)
    THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Esse instrumento já tem uma especialização.';
    END IF;
END //
DELIMITER ;

-- Mesma regra para instrumentos melódicos
DELIMITER //
CREATE TRIGGER instrumento_melodico_uma_especializacao_somente
BEFORE INSERT ON instrumento_melodico
FOR EACH ROW
BEGIN	
    IF EXISTS(SELECT 1 FROM instrumento_harmonico WHERE instrumento_id = NEW.instrumento_id)
    OR EXISTS(SELECT 1 FROM instrumento_ritmico WHERE instrumento_id = NEW.instrumento_id)
    THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Esse instrumento já tem uma especialização.';
    END IF;
END //
DELIMITER ;

-- Mesma regra para instrumentos rítmicos
DELIMITER //
CREATE TRIGGER instrumento_ritmico_uma_especializacao_somente
BEFORE INSERT ON instrumento_ritmico
FOR EACH ROW
BEGIN	
    IF EXISTS(SELECT 1 FROM instrumento_harmonico WHERE instrumento_id = NEW.instrumento_id)
    OR EXISTS(SELECT 1 FROM instrumento_melodico WHERE instrumento_id = NEW.instrumento_id)
    THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Esse instrumento já tem uma especialização.';
    END IF;
END //
DELIMITER ;

-- Impede apelidos duplicados no mesmo instrumento
DELIMITER //
CREATE TRIGGER apelidos_repetidos
BEFORE INSERT ON apelidos
FOR EACH ROW
BEGIN
	SET NEW.apelido = TRIM(NEW.apelido);
    
    IF EXISTS(SELECT 1 FROM apelidos WHERE NEW.instrumento_id = instrumento_id AND NEW.apelido = apelido) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Esse instrumento já tem esse apelido';
    END IF;
END //
DELIMITER ;

-- Validação do alcance musical
DELIMITER //
CREATE TRIGGER Validar_Alcance_Min_Max
BEFORE INSERT ON alcance_instrumento
FOR EACH ROW
BEGIN	
	IF NEW.nota_min >= NEW.nota_max THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A nota minima é maior que a nota maxima';
    END IF;
    
    IF EXISTS(SELECT 1 FROM alcance_instrumento WHERE NEW.tipo = tipo AND NEW.instrumento_id = instrumento_id) THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Já existe esse tipo de alcance para este instrumento';
	END IF;
END //
DELIMITER ;

-- Valida se a senha já vem em hash Bcrypt
DELIMITER //
CREATE TRIGGER confirmar_hash_senha
BEFORE INSERT ON usuarios
FOR EACH ROW
BEGIN    
    IF NEW.senha NOT LIKE '$2a$%' 
       AND NEW.senha NOT LIKE '$2b$%' 
       AND NEW.senha NOT LIKE '$2y$%' 
    THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'A senha precisa vir com hash';
    END IF;
END //
DELIMITER ;

-- ============================
--       PROCEDURES
-- ============================

-- Cria instrumento completo com alcance + especialização
DELIMITER //
CREATE PROCEDURE registrar_instrumento_completo(
    in i_familia_id varchar(12), 
    in i_nome varchar(100), 
    in i_descricao text, 
    in i_historia text, 
    in i_classificacao_sonoridade varchar(20), 
    in a_tipo varchar(25), 
    in a_nota_min varchar(10),
    in a_nota_max varchar(10), 
    in especializacao varchar(32), 
    in opcao1 varchar(100), 
    in opcao2 varchar(100), 
    in opcao3 varchar(100))
BEGIN
	DECLARE i_id VARCHAR(12);
		
	SET i_id = Gerar_ID_Generico('INS');
    
    -- Valida família existente
    IF NOT EXISTS (SELECT 1 FROM familia_instrumento WHERE id = i_familia_id) THEN		
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Esse id de familia instrumento não existe';
	END IF;
    
	-- Cria instrumento
	INSERT INTO instrumento(instrumento_id, familia_id, nome, descricao, historia, classificacao_sonoridade) VALUES
	(i_id, i_familia_id, i_nome, i_descricao, i_historia, i_classificacao_sonoridade);
    
    -- Cria alcance sonoro
    INSERT INTO alcance_instrumento(instrumento_id, tipo, nota_min, nota_max) VALUES
    (i_id, a_tipo, a_nota_min, a_nota_max);
    
    -- Insere especialização conforme tipo
    CASE
		WHEN especializacao = 'harmonico' THEN
            INSERT INTO instrumento_harmonico(instrumento_id, polifonia_max, possui_pedal_sustain, suporta_acordes) VALUES
            (i_id, CAST(opcao1 AS UNSIGNED), CAST(opcao2 AS UNSIGNED), CAST(opcao3 AS UNSIGNED));
		
        WHEN especializacao = 'ritmico' THEN
			INSERT INTO instrumento_ritmico(instrumento_id, altura_definida, categoria_percussao, tocado_com) VALUES
            (i_id, CAST(opcao1 AS UNSIGNED), opcao2, opcao3);
            
		WHEN especializacao = 'melodico' THEN
			INSERT INTO instrumento_melodico(instrumento_id, transpositor, afinacao_transposicao, microtonalidade_suportada) VALUES
			(i_id, CAST(opcao1 AS UNSIGNED), opcao2, CAST(opcao3 AS UNSIGNED));
	END CASE;
    
END //
DELIMITER ;

-- Cria áudio com técnica associada automaticamente
DELIMITER //
CREATE PROCEDURE registrar_audio_completo(
    in a_instrumento_id varchar(12), 
    in a_titulo varchar(50), 
    in a_descricao text,
	in a_nota varchar(20), 
    in a_oitava int, 
    in a_bpm int, 
    in a_arquivo varchar(255), 
    in a_credito_gravacao varchar(100),
    in t_nome varchar(100), 
    in t_descricao text)
BEGIN
	
    DECLARE a_id VARCHAR(12);
    DECLARE t_id VARCHAR(12);

    SET a_id = Gerar_ID_Generico('AUD');
    SET t_id = Gerar_ID_Generico('TEC');
    
	INSERT INTO audio(ID, instrumento_id, titulo, descricao, nota, oitava, bpm, arquivo, credito_gravacao) VALUES
    (a_id, a_instrumento_id, a_titulo, a_descricao, a_nota, a_oitava, a_bpm, a_arquivo, a_credito_gravacao);
    
    INSERT INTO tecnica(ID, nome, descricao) VALUES
	(t_id, t_nome, t_descricao);
    
    INSERT INTO audio_tecnica(audio_id, tecnica_id) VALUES
    (a_id, t_id);
    
END //
DELIMITER ;

-- Cria parte e material automaticamente
DELIMITER //
CREATE PROCEDURE registrar_parte_material(
    in p_instrumento_id varchar(12), 
    in p_nome varchar(100), 
    in p_descricao text, 
	in m_nome varchar(100), 
    in m_descricao text)
BEGIN
	DECLARE m_id varchar(12);
    
    SET m_id = Gerar_ID_Generico('MAT');
    
    INSERT INTO parte(instrumento_id, nome, descricao) VALUES
    (p_instrumento_id, p_nome, p_descricao);
    
    INSERT INTO material(ID, nome, descricao) VALUES
    (m_id, m_nome, m_descricao);
    
    INSERT INTO instrumento_material_parte(instrumento_id, material_id, parte_nome) VALUES
    (p_instrumento_id, m_id, p_nome);
	
END //
DELIMITER ;

-- Normaliza textos removendo espaços duplos
DELIMITER //
CREATE FUNCTION normalizar_textos(texto text)
RETURNS VARCHAR(32)
DETERMINISTIC
BEGIN
	DECLARE resultado TEXT;
    
    SET resultado = TRIM(texto);
    
    WHILE INSTR(resultado, '  ') > 0 DO
		SET resultado = REPLACE(resultado, '  ', ' ');
	END WHILE;
    
	RETURN resultado;
END //
DELIMITER ;

-- ============================
--          VIEWS
-- ============================

-- Áudios com técnicas e instrumentos
CREATE OR REPLACE VIEW instrumentos_audios AS
SELECT 
i.id AS intrumento_id, 
i.nome AS instrumento_nome, 
a.id AS audio_id, 
a.titulo AS audio_titulo, 
a.descricao AS audio_descricao, 
t.nome AS tecnica_nome, 
t.descricao AS tecnica_descricao 
FROM audio a
LEFT JOIN instrumento i on i.id = a.instrumento_id
LEFT JOIN audio_tecnica aut ON aut.audio_id = a.id
LEFT JOIN tecnica t ON aut.tecnica_id = t.id;

-- Informações completas sobre alcance e afinação
CREATE OR REPLACE VIEW instrumento_parte_musical AS
SELECT 
i.id AS instrumento_id,
i.nome AS instrumento_nome, 
f.nome AS familia_instrumento, 
al.tipo AS alcance_tipo, 
al.nota_min AS alcance_nota_min, 
al.nota_max AS alcance_nota_max, 
af.nome AS afinacao_nome, 
ia.contexto AS afinacao_contexto, 
af.referencia AS afinacao_referencia
FROM instrumento i
LEFT JOIN familia_instrumento f ON i.familia_id = f.id
LEFT JOIN alcance_instrumento al ON al.instrumento_id = i.id
LEFT JOIN instrumento_afinacao ia ON ia.instrumento_id = i.id
LEFT JOIN afinacao af ON ia.afinacao_id = af.id;

-- Informações extras das especializações e apelidos
CREATE OR REPLACE VIEW instrumento_informacoes_extras AS
SELECT 
i.id AS instrumento_id, 
i.nome AS instrumento_nome, 
a.apelido AS instrumento_apelido, 
ih.polifonia_max AS instrumento_harmonico_polifonia_max, 
ih.possui_pedal_sustain AS instrumento_harmonico_possui_pedal_sustain, 
ih.suporta_acordes AS instrumento_harmonico_suporta_acordes, 
im.transpositor AS instrumento_melodico_transpositor,
im.afinacao_transposicao AS instrumento_melodico_afinacao_transposicao, 
im.microtonalidade_suportada AS instrumento_melodico_microtonalidade_suportada, 
ir.altura_definida AS instrumento_ritmico_altura_definida, 
ir.categoria_percussao AS instrumento_ritmico_categoria_percussao, 
ir.tocado_com AS instrumento_ritmico_tocado_com
FROM instrumento i
LEFT JOIN instrumento_harmonico ih ON ih.instrumento_id = i.id
LEFT JOIN instrumento_melodico im ON im.instrumento_id = i.id
LEFT JOIN instrumento_ritmico ir ON ir.instrumento_id = i.id
LEFT JOIN apelidos a ON a.instrumento_id = i.id;

-- ============================
--        USUÁRIOS SQL
-- ============================

-- Administrador completo
CREATE USER 'admin_geral'@'localhost' IDENTIFIED BY 'ADMIN1415';
GRANT ALL PRIVILEGES ON musica.* TO 'admin_geral'@'localhost';

-- Usuário com acesso total às tabelas de dados
CREATE USER 'gerenciador_dados'@'localhost' IDENTIFIED BY 'GERENCIADOR1415';

-- Permissões CRUD (read/write) para tabelas de domínio
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.afinacao TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.alcance_instrumento TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.apelidos TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.audio TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.audio_tecnica TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.familia_instrumento TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.instrumento TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.instrumento_afinacao TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.instrumento_harmonico TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.instrumento_material_parte TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.instrumento_melodico TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.instrumento_ritmico TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.material TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.parte TO 'gerenciador_dados'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.tecnica TO 'gerenciador_dados'@'localhost';

-- Usuário somente consulta
CREATE USER 'consultas'@'localhost' IDENTIFIED BY 'CONSULTAS1415';

-- Permissões somente SELECT
GRANT SELECT ON musica.* TO 'consultas'@'localhost';

GRANT SELECT ON musica.instrumentos_audios TO 'consultas'@'localhost';
GRANT SELECT ON musica.instrumento_parte_musical TO 'consultas'@'localhost';
GRANT SELECT ON musica.instrumento_informacoes_extras TO 'consultas'@'localhost';

-- Usuário gestor de usuários
CREATE USER 'gerenciar_usuarios'@'localhost' IDENTIFIED BY 'USUARIOS1415';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.usuarios TO 'gerenciar_usuarios'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON musica.grupos_usuarios TO 'gerenciar_usuarios'@'localhost';
