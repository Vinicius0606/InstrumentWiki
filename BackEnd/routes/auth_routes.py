from flask import Blueprint, request, json, jsonify, current_app, g
import bcrypt
import jwt
import unicodedata
import re
from datetime import datetime, timedelta, timezone
from app.middleware.auth_middleware import jwt_required 
 
def normalizarTexto(texto):

    texto = unicodedata.normalize("NFD", texto)

    texto = ''.join([c for c in texto if not unicodedata.combining(c)]).lower()

    if texto == "familia":
        texto = "familia_instrumento"

    return texto

auth_routes = Blueprint("auth_routes", __name__)
 
@auth_routes.route("/instrumentosGet", methods=["GET"])
@jwt_required
 
def instrumentosGet():
 
    db_connection = current_app.db_connection

    db_connection.ping(reconnect=True)

    redis = current_app.redis
 
    cursor = db_connection.cursor()

    cache_key = "instrumentos:todos"

    cache = redis.get(cache_key)
    if cache:
        return jsonify(json.loads(cache)), 200
    
    try:
 
        cursor.execute(
            """
            SELECT
            i.id,
            i.nome,
            i.descricao,
            i.historia,
            i.classificacao_sonoridade,
            fi.id,
            fi.nome,
            fi.descricao
            FROM instrumento i
            LEFT JOIN familia_instrumento fi
            ON i.familia_id = fi.id;
            """
        )
 
        instrumentoFamilia = list(cursor.fetchall())
 
        cursor.execute(
            """
            SELECT
            instrumento_id,
            tipo,
            nota_min,
            nota_max
            FROM alcance_instrumento;
            """
        )
   
        instrumentoAlcance = list(cursor.fetchall())
 
        cursor.execute(
            """
            SELECT
            ia.instrumento_id,
            a.id,
            a.nome,
            a.descricao,
            a.referencia,
            ia.contexto
            FROM instrumento_afinacao ia
            LEFT JOIN afinacao a
            ON ia.afinacao_id = a.id;
            """
        )
 
        instrumentoAfinacao = list(cursor.fetchall())
 
        cursor.execute(
 
            """
            SELECT
            i.id,
            ih.polifonia_max,
            ih.possui_pedal_sustain,
            ih.suporta_acordes,
            im.transpositor,
            im.afinacao_transposicao,
            im.microtonalidade_suportada,
            ir.altura_definida,
            ir.categoria_percussao,
            ir.tocado_com
            FROM instrumento i
            LEFT JOIN instrumento_harmonico ih
            ON i.id = ih.instrumento_id
            LEFT JOIN instrumento_melodico im
            ON i.id = im.instrumento_id
            LEFT JOIN instrumento_ritmico ir
            ON i.id = ir.instrumento_id;
            """
        )
 
        instrumentoEspecializacao = list(cursor.fetchall())
 
        instrumentosCompletos = list()
 
        for i in instrumentoFamilia:
           
            info = i
            afinacao = []
            especializacao = []
            especializacaoNomes = list()
            alcance = []
 
            for al in instrumentoAlcance:
 
                if al[0] == i[0]:
                    alcance = list(al)
                    break
 
            for af in instrumentoAfinacao:
           
                if af[0] == i[0]:
                    afinacao = list(af)
                    break
           
            for e in instrumentoEspecializacao:
               
                if e[0] == i[0]:
                    especializacao = list(e)
                    print(2)
                    break
           
            if especializacao[1] != None:
                especializacaoNomes = ["harmonico", "polifonia_max", "possui_pedal_sustain", "suporta_acordes"]
 
            elif especializacao[4] != None:
                especializacaoNomes = ["melodico", "transpositor", "afinacao_transposicao", "microtonalidade_suportada"]
                especializacao[1] = especializacao[4]
                especializacao[2] = especializacao[5]
                especializacao[3] = especializacao[6]
 
            elif especializacao[7] != None:
                especializacaoNomes = ["ritmico", "altura_definida", "categoria_percussao", "tocado_com"]
                especializacao[1] = especializacao[7]
                especializacao[2] = especializacao[8]
                especializacao[3] = especializacao[9]
 
            instrumentosCompletos.append(
                {
                    "info": {
 
                        "id": info[0],
                        "nome": info[1],
                        "descricao": info[2]
                    },
 
                    "familia_instrumento": {
 
                        "id": info[5],
                        "nome": info[6],
                        "descricao": info[7]
                    },
 
                    "historia": info[3],
 
                    "classificao_sonoridade": info[4],
 
                    "imagem": None,
 
                    "apelidos": None,
 
                    "audios": None,
                   
                    "partesMateriais": None,
 
                    "alcances": {
                        "tipo": alcance[1] if len(alcance) > 0 else None,
                        "nota_min": alcance[2] if len(alcance) > 0 else None,
                        "nota_max": alcance[3] if len(alcance) > 0 else None
                    },
 
                    "afinacao": {
                        "info": {
                            "id": afinacao[1] if len(afinacao) > 0 else None,
                            "nome": afinacao[2] if len(afinacao) > 0 else None,
                            "descricao": afinacao[3] if len(afinacao) > 0 else None,
                        },
                        "referencia": afinacao[4] if len(afinacao) > 0 else None,
                        "contexto": afinacao[5] if len(afinacao) > 0 else None
                    },
 
                    "especializacoes": {
 
                        "especializacao": especializacaoNomes[0] if len(especializacaoNomes) > 0 else None,
                        "opcao1": especializacao[1] if len(especializacao) > 0 else None,
                        "opcao1Nome": especializacaoNomes[1] if len(especializacaoNomes) > 0 else None,
                        "opcao2": especializacao[2] if len(especializacao) > 0 else None,
                        "opcao2Nome": especializacaoNomes[2] if len(especializacaoNomes) > 0 else None,
                        "opcao3": especializacao[3] if len(especializacao) > 0 else None,
                        "opcao3Nome": especializacaoNomes[3] if len(especializacaoNomes) > 0 else None
                    }
                }
            )

        redis.setex(cache_key, 300, json.dumps(instrumentosCompletos))
 
        return jsonify(instrumentosCompletos), 200
 
    except Exception as e:
 
        print(str(e))
       
        return jsonify("Erro: ", str(e)), 500
   
    finally:
 
        cursor.close()

@auth_routes.route("/instrumentosInfoGet", methods=["GET"])
@jwt_required

def instrumentosInfoGet():

    db_connection = current_app.db_connection

    db_connection.ping(reconnect=True)

    redis = current_app.redis
 
    cursor = db_connection.cursor()

    data = request.args

    id = data.get("id", "")

    if not id:
        return jsonify({"erro": "id deve ser enviado"}), 400
    
    cache_key = f"instrumentos:info:{id}"

    cache = redis.get(cache_key)
    if cache:
        return jsonify(json.loads(cache)), 200

    try:
 
        cursor.execute(
            """
            SELECT 
            a.id, 
            a.titulo, 
            a.descricao, 
            a.arquivo, 
            a.nota, 
            a.oitava, 
            a.bpm, 
            a.credito_gravacao  
            FROM instrumento i
            LEFT JOIN audio a
            ON i.id = a.instrumento_id
            WHERE i.id = %s;
            """, (id,)
        )
 
        instrumentoAudio = list(cursor.fetchall())
 
        cursor.execute(
            """
            SELECT
            p.nome, 
            p.descricao, 
            m.id, 
            m.nome, 
            m.descricao 
            FROM instrumento i 
            LEFT JOIN instrumento_material_parte imp 
            ON i.id = imp.instrumento_id 
            LEFT JOIN parte p 
            ON imp.instrumento_id = p.instrumento_id 
            LEFT JOIN material m 
            ON imp.instrumento_id = m.id
            WHERE i.id = %s;
            """, (id,)
        )
   
        instrumentoMaterialParte = list(cursor.fetchall())
 
        cursor.execute(
            """
            SELECT
            a.id,
            a.nome,
            a.descricao,
            a.referencia,
            ia.contexto
            FROM instrumento_afinacao ia
            LEFT JOIN afinacao a
            ON ia.afinacao_id = a.id 
            LEFT JOIN instrumento i 
            ON i.id = ia.instrumento_id 
            WHERE i.id = %s;
            """, (id,)
        )
 
        instrumentoAfinacao = list(cursor.fetchall())
 
        instrumentosCompletos = dict()

        instrumentosCompletos["audios"] = list()

        for audio in instrumentoAudio:

            instrumentosCompletos["audios"].append({
 
                "info": {
                    "id": audio[0] if len(instrumentoAudio) > 0 else None,
                    "nome": audio[1] if len(instrumentoAudio) > 0 else None,
                    "descricao": audio[2] if len(instrumentoAudio) > 0 else None
                    },
                "audio": audio[3] if len(instrumentoAudio) > 0 else None,
                "nota": audio[4] if len(instrumentoAudio) > 0 else None,
                "oitava": audio[5] if len(instrumentoAudio) > 0 else None,
                "bpm": audio[6] if len(instrumentoAudio) > 0 else None,
                "creditos": audio[7] if len(instrumentoAudio) > 0 else None
            })

        instrumentosCompletos["partesMateriais"] = list()
        
        for materialParte in instrumentoMaterialParte:

            instrumentosCompletos["partesMateriais"].append({

                "parteNome": materialParte[0] if len(instrumentoMaterialParte) > 0 else None,
                "parteDescricao": materialParte[1] if len(instrumentoMaterialParte) > 0 else None,
                "materialId": materialParte[2] if len(instrumentoMaterialParte) > 0 else None,
                "materialNome": materialParte[3] if len(instrumentoMaterialParte) > 0 else None,
                "materialDescricao": materialParte[4] if len(instrumentoMaterialParte) > 0 else None
            })

        instrumentosCompletos["afinacao"] = list()
        
        for afinacao in instrumentoAfinacao:

            instrumentosCompletos["afinacao"].append({
    
                "info": {
                    "id": afinacao[0] if len(instrumentoAfinacao) > 0 else None,
                    "nome": afinacao[1] if len(instrumentoAfinacao) > 0 else None,
                    "descricao": afinacao[2] if len(instrumentoAfinacao) > 0 else None,
                    },
                "referencia": afinacao[3] if len(instrumentoAfinacao) > 0 else None,
                "contexto": afinacao[4] if len(instrumentoAfinacao) > 0 else None
            })         

        redis.setex(cache_key, 300, json.dumps(instrumentosCompletos))    

        return jsonify(instrumentosCompletos), 200
 
    except Exception as e:
       
        return jsonify("Erro: ", str(e)), 500
   
    finally:
 
        cursor.close()

@auth_routes.route("/idFkNullGet", methods=["GET"])
@jwt_required

def idFkNullGet():

    db_connection = current_app.db_connection

    db_connection.ping(reconnect=True)
    
    redis = current_app.redis
 
    cursor = db_connection.cursor()

    retornos = []

    data = request.args

    nomeTabela = data.get("nomeTabela", "")

    if not nomeTabela:
        return jsonify({"erro": "nomeTabela deve ser enviado"}), 400

    nomeTabela = normalizarTexto(nomeTabela)

    cache_key = f"fknull:{nomeTabela}"

    cache = redis.get(cache_key)
    if cache:
        return jsonify(json.loads(cache)), 200

    try:

        if nomeTabela == "audio":

            cursor.execute(

                "SELECT id, titulo, descricao FROM audio WHERE instrumento_id IS NULL"
            )
            
        elif nomeTabela == "afinacao":

            cursor.execute(

                "SELECT a.id, a.nome, a.descricao FROM afinacao a" +
                " LEFT JOIN instrumento_afinacao ia" +
                " ON a.id = ia.afinacao_id" +
                " WHERE ia.afinacao_id IS NULL" 
            )

        elif nomeTabela == "tecnica":

            cursor.execute(

                "SELECT t.id, t.nome, t.descricao FROM tecnica t" +
                " LEFT JOIN audio_tecnica at" +
                " ON t.id = at.tecnica_id" +
                " WHERE at.tecnica_id IS NULL" 
            )

        elif nomeTabela == "material":

            cursor.execute(

                "SELECT m.id, m.nome, m.descricao FROM material m" +
                " LEFT JOIN instrumento_material_parte imp" +
                " ON m.id = imp.material_id" +
                " WHERE imp.material_id IS NULL" 
            )


        lista = list(cursor.fetchall())

        for i in lista:

            if nomeTabela == "audio":

                retornos.append({

                "id": i[0],
                "titulo": i[1],
                "descricao": i[2]
                })
            
            else:

                retornos.append({

                "id": i[0],
                "nome": i[1],
                "descricao": i[2]
                })

        db_connection.commit()

        redis.setex(cache_key, 300, json.dumps(retornos))

        return jsonify(retornos), 200

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()
            
@auth_routes.route("/verificarExistenciaGet", methods=["GET"])
@jwt_required

def verificarExistenciaGet():

    db_connection = current_app.db_connection

    db_connection.ping(reconnect=True)

    redis = current_app.redis
 
    cursor = db_connection.cursor()

    data = request.args

    query = list()
    retornos = dict()

    nomeTabela = data.get("nomeTabela", "")
    id = data.get("id", "")

    if not nomeTabela:
        return jsonify({"erro": "nomeTabela deve ser enviado"}), 400
    
    if not id:
        return jsonify({"erro": "id deve ser enviado"}), 400

    nomeTabela = normalizarTexto(nomeTabela)

    cache_key = f"exists:{nomeTabela}:{id}"

    cache = redis.get(cache_key)
    if cache:
        return jsonify(json.loads(cache)), 200

    try:    

        cursor.execute(
        
        "SELECT id FROM " + nomeTabela + " WHERE id = %s", (id,)  
        )

        query = list(cursor.fetchall())

        if len(query) == 0: retornos["Exists"] = False
        else: retornos["Exists"] = True

        redis.setex(cache_key, 60, json.dumps(retornos))

        return jsonify(retornos), 200
        
    except Exception as e:
       
        print(str(e))
        return jsonify("Erro: ", str(e)), 500
   
    finally:
 
        cursor.close()

@auth_routes.route("/retornarIDsGenerico", methods=["GET"])
@jwt_required

def retornarIDsGenerico():

    db_connection = current_app.db_connection

    db_connection.ping(reconnect=True)

    redis = current_app.redis
 
    cursor = db_connection.cursor()

    data = request.args

    nomeTabela = data.get("nomeTabela", "")

    if not nomeTabela:
        return jsonify({"Erro: ": "o nomeaTabela deve ser enviado"}), 404

    nomeTabela = normalizarTexto(nomeTabela)

    cache_key = f"ids:{nomeTabela}"

    cache = redis.get(cache_key)
    if cache:
        return jsonify(json.loads(cache)), 200

    query = "SELECT "

    try:

        if(nomeTabela == "Áudio"):

            query += "id, titulo, descricao "
        
        else:

            query += "id, nome, descricao "

        query += "FROM " + nomeTabela

        cursor.execute(query)

        dadosTabela = list(cursor.fetchall())

        retornos = list()

        for dado in dadosTabela:

            retornos.append({
                "id": dado[0],
                "nome": dado[1],
                "descricao": dado[2]
            })
        
        redis.setex(cache_key, 300, json.dumps(retornos))

        return jsonify(retornos), 200
    
    except Exception as e:

        print(str(e))

        return jsonify({"Erro: ": str(e)}), 500
    
    finally:

        cursor.close()

@auth_routes.route("/testarToken", methods=["GET"])
@jwt_required
 
def testarToken():
   
    db_connection = current_app.db_connection

    db_connection.ping(reconnect=True)
 
    cursor = db_connection.cursor()
 
    try:
 
        cursor.execute(
            """
            SELECT gc.tipo, gc.adicionar, gc.editar, gc.remover, gc.modificar_permissoes
            FROM usuarios u
            LEFT JOIN grupos_usuarios gc ON u.tipo_permissao = gc.tipo
            WHERE u.id = %s
            """, (g.user_id)
        )
 
        resultado = cursor.fetchone()
 
        if(len(resultado) != 5):
 
            tipo = "adm"
            adicionar = True
            editar = True
            remover = True
            modificar_permissao = True
 
        else:
 
            tipo, adicionar, editar, remover, modificar_permissao = resultado
       
        return jsonify({
            "tipo": tipo,
            "nick": g.nick,
            "adicionar": adicionar,
            "editar": editar,
            "remover": remover,
            "modificar_permissao": modificar_permissao
            }), 200
   
    except Exception as e:
 
        print(e)
        return jsonify({"Erro: ": str(e)}), 500
   
    finally:
 
        cursor.close()

@auth_routes.route("/inserirInstrumentoPost", methods=["POST"])
@jwt_required

def inserirInstrumentoPost():

    db_connection = current_app.db_connection

    db_connection.ping(reconnect=True)

    redis = current_app.redis
 
    cursor = db_connection.cursor()

    data = request.get_json()

    retornos = {}

    familia_id = data.get("familia_id", "")
    nome = data.get("nome", "") 
    descricao = data.get("descricao", "") #opcional
    historia = data.get("historia", "")
    classificacao_sonoridade = data.get("classificacao_sonoridade", "")
    atributoEspecializacao1 = data.get("atributoEspecializacao1", "")
    atributoEspecializacao2 = data.get("atributoEspecializacao2", "")
    atributoEspecializacao3 = data.get("atributoEspecializacao3", "")

    if not familia_id:
        return jsonify({"Erro: ": "familia_id deve ser enviado"}), 404
    
    if not nome:
        return jsonify({"Erro: ": "o nome deve ser enviado"}), 404
    
    if not historia:
        return jsonify({"Erro: ": "a historia deve ser enviada"}), 404
    
    if not classificacao_sonoridade:
        return jsonify({"Erro: ": "a classificacao_sonoridade deve ser enviada"}), 404
    
    if not atributoEspecializacao1:
        return jsonify({"Erro: ": "atributoEspecialiazacao1 deve ser enviado"}), 404
    
    if not atributoEspecializacao2:
        return jsonify({"Erro: ": "atributoEspecialiazacao2 deve ser enviado"}), 404
    
    if not atributoEspecializacao3:
        return jsonify({"Erro: ": "atributoEspecialiazacao3 deve ser enviado"}), 404
    

    query = "INSERT INTO instrumento" 

    try:

        cursor.execute(

            """
            SELECT Gerar_ID_Generico('INS') FROM instrumento limit 1
            """
        )

        id = list(cursor.fetchone())

        cursor.execute(

            query + " (id, familia_id, nome, descricao, historia, classificacao_sonoridade) VALUES " +
            "(%s, %s, %s, %s, %s, %s)",(id[0], familia_id, nome, descricao, historia, classificacao_sonoridade)
        )

        cursor.execute(
               
            """
            SELECT ih.instrumento_id, im.instrumento_id, ir.instrumento_id FROM instrumento i 
            LEFT JOIN instrumento_harmonico ih 
            ON i.id = ih.instrumento_id 
            LEFT JOIN instrumento_melodico im 
            ON i.id = im.instrumento_id 
            LEFT JOIN instrumento_ritmico ir 
            ON i.id = ir.instrumento_id
            """
            )

        verificarEspecializacao = list(cursor.fetchall())
        especializacao = ""

        for i in verificarEspecializacao:

                if i[0] != None: especializacao = "instrumento_harmonico"
                elif i[1] != None: especializacao = "instrumento_melodico"
                else: especializacao = "instrumento_ritmico"

        if especializacao == "instrumento_harmonico":

            cursor.execute(

                query + " (instrumento_id, polifonia_max, possui_pedal_sustain, suporta_acordes) VALUES " +
                "(%s, %s, %s, %s)",(id[0], atributoEspecializacao1, atributoEspecializacao2, atributoEspecializacao3)
            )

        elif especializacao == "instrumento_melodico":

            cursor.execute(

                query + " (instrumento_id, transpositor, afinacao_transposicao, microtonalidade_suportada) VALUES " +
                "(%s, %s, %s, %s)",(id[0], atributoEspecializacao1, atributoEspecializacao2, atributoEspecializacao3)
            )
        
        else:

            cursor.execute(

                query + " (instrumento_id, altura_definida, categoria_percussao, tocado_com) VALUES " +
                "(%s, %s, %s, %s)",(id[0], atributoEspecializacao1, atributoEspecializacao2, atributoEspecializacao3)
            )

        retornos["ID"] = id[0]
        retornos["Codigo"] = 200

        db_connection.commit()

        redis.delete("instrumentos:todos")
        redis.delete(f"instrumentos:info:{id[0]}")

        return jsonify(retornos), 200

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()


@auth_routes.route("/inserirAudioPost", methods=["POST"])
@jwt_required

def inserirAudioPost():

    db_connection = current_app.db_connection

    db_connection.ping(reconnect=True)

    redis = current_app.redis
 
    cursor = db_connection.cursor()

    data = request.get_json()

    retornos = {}

    instrumento_id = data.get("instrumento_id", "")
    titulo = data.get("titulo", "") 
    descricao = data.get("descricao", "") #opcional
    nota = data.get("nota", "")
    oitava = data.get("oitava", "")
    bpm = data.get("bpm", "") #opcional
    arquivo = data.get("arquivo", "")
    credito_gravacao = data.get("credito_gravacao", "") #opcional

    if not instrumento_id:
        return jsonify({"Erro: ": "instrumento_id deve ser enviado"}), 404
    
    if not titulo:
        return jsonify({"Erro: ": "o titulo deve ser enviado"}), 404
    
    if not nota:
        return jsonify({"Erro: ": "a nota deve ser enviada"}), 404
    
    if not oitava:
        return jsonify({"Erro: ": "a oitava deve ser enviada"}), 404
    
    if not arquivo:
        return jsonify({"Erro: ": "o arquivo deve ser enviado"}), 404
    

    query = "INSERT INTO audio" 

    try:

        cursor.execute(

            """
            SELECT Gerar_ID_Generico('AUD') FROM audio limit 1
            """
        )

        id = list(cursor.fetchone())

        cursor.execute(

            query + " (id, instrumento_id, titulo, descricao, nota, oitava, bpm, arquivo, credito_gravacao) VALUES " +
            "(%s, %s, %s, %s, %s, %s, %s, %s, %s)",(id[0], instrumento_id, titulo, descricao, nota, oitava, bpm, arquivo, credito_gravacao)
        )

        retornos["ID"] = id[0]
        retornos["Codigo"] = 200

        db_connection.commit()

        
        redis.delete(f"instrumentos:info:{instrumento_id}")

        return jsonify(retornos), 200

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()

@auth_routes.route("/inserirGenericoPost", methods=["POST"])
@jwt_required

def inserirGenericoPost():

    db_connection = current_app.db_connection

    db_connection.ping(reconnect=True)

    redis = current_app.redis
 
    cursor = db_connection.cursor()

    data = request.get_json()

    retornos = {}

    nomeTabela = data.get("nomeTabela", "")
    nome = data.get("nome", "")
    descricao = data.get("descricao", "") #opcional
    referencia = data.get("referencia", "") #opcional

    if not nomeTabela:
        return jsonify({"Erro: ": "nomeTabela deve ser enviado"}), 404
    
    if not nome:
        return jsonify({"Erro: ": "nome deve ser enviado"}), 404
    

    nomeTabela = normalizarTexto(nomeTabela)

    nomeTabela = str(nomeTabela)

    query = "INSERT INTO " + nomeTabela

    nomeTabela = nomeTabela[0:3].upper()

    try:

        cursor.execute(

            
            "SELECT Gerar_ID_Generico('"+ nomeTabela +"') FROM audio limit 1"
            
        )

        id = list(cursor.fetchone())

        if nomeTabela == "afinacao":

            cursor.execute(

                query + "(id, nome, descricao, referencia) VALUES " +
                "(%s, %s, %s, %s)",(id[0], nome, descricao, referencia)
            )

        else:

            cursor.execute(

                query + "(id, nome, descricao) VALUES " +
                "(%s, %s, %s)",(id[0], nome, descricao)
            )
        
        db_connection.commit()

        retornos["ID"] = id[0]
        retornos["Codigo"] = 200

        redis.delete(f"ids:{nomeTabela}")
        redis.delete(f"fknull:{nomeTabela}")
        redis.delete(f"exists:{nomeTabela}:{id[0]}")

        return jsonify(retornos), 200

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()

@auth_routes.route("/registerPost", methods=["POST"])
 
def registerPost():
    data = request.get_json()
 
    nick = data.get("nick", "").replace(" ", "")
    email = data.get("email", "").replace(" ", "").lower()
    raw_password = data.get("password", "").strip()
 
    email_template = r"^[\w\.-]+@[\w\.-]+\.\w+$"
 
    password_template = {
        "length": len(raw_password) >= 8,
        "uppercase": bool(re.search(r"[A-Z]", raw_password)),
        "lowercase": bool(re.search(r"[a-z]", raw_password)),
        "number": bool(re.search(r"\d", raw_password)),
        "special": bool(re.search(r"[^\w]", raw_password))        
    }
 
    if not re.match(r"^\w+$", nick):
        return jsonify({"error": "Nick só pode conter letras, números e underline."}), 400
 
    if not nick or not email or not raw_password:
        return jsonify({"error": "Todos os campos são obrigatórios."}), 400
 
    if not re.match(email_template, email):
        return jsonify({"error": "E-mail invalido."}), 400
   
    if len(nick) < 3 or len(nick) > 32:
 
        return jsonify({"error": "Tamanho do nick inválido."}), 400
 
    if not all(password_template.values()):
       
        erros = [crit for crit, ok in password_template.items() if not ok]
 
        return jsonify({"error": "Senha inválida.", "requisitos_nao_atendidos": erros}), 400
 
    hashed_password = bcrypt.hashpw(raw_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
 
    DbConnection = current_app.db_connection

    DbConnection.ping(reconnect=True)
    cursor = DbConnection.cursor()
 
    try:
        cursor.execute("""
            SELECT id FROM usuarios WHERE nick = %s
        """, (nick,))
 
        existing_user_nick = cursor.fetchone()
 
        if existing_user_nick:
            return jsonify({"error": "Nick já está em uso."}), 409
 
        cursor.execute("""
            SELECT id FROM usuarios WHERE email = %s
        """, (email,))
 
        existing_user_email = cursor.fetchone()
 
        if existing_user_email:
            return jsonify({"error": "E-mail já está em uso."}), 409
       
        cursor.execute("""
            INSERT INTO usuarios (id, nick, email, senha, tipo_permissao)
            VALUES (Gerar_ID_Usuario(), %s, %s, %s, %s)
        """, (nick, email, hashed_password, "user"))
 
        DbConnection.commit()
   
    except Exception as e:
       
        DbConnection.rollback()

        print(e)
       
        return jsonify({"error": "Erro ao registrar usuário", "details": str(e)}), 400
   
    finally:
 
        cursor.close()
 
    return jsonify({"message": "Usuário registrado com sucesso!"}), 201
 
@auth_routes.route("/loginPost",methods=["POST"])
 
def loginPost():
 
    data = request.get_json()
 
    nick = data.get("nick", "").strip()
    raw_password = data.get("password", "").strip().encode("utf-8")
 
    Dbconnection = current_app.db_connection

    Dbconnection.ping(reconnect=True)
    cursor = Dbconnection.cursor()
 
    try:
 
        cursor.execute("""
            SELECT id, senha FROM usuarios
            WHERE nick = %s
        """, (nick,))
   
        result = cursor.fetchone()
 
        if not result:
            return jsonify({"error": "Usuário ou senha inexistentes. Acesso negado!"}), 401
 
        user_id, hashed_password = result
 
        hashed_password = hashed_password.encode("utf-8")
 
        if bcrypt.checkpw(raw_password, hashed_password):
 
            payload = {
                "user_id": user_id,
                "nick": nick,
                "iat": datetime.now(timezone.utc),
                "nbf": datetime.now(timezone.utc),
                "exp": datetime.now(timezone.utc) + timedelta(hours=2),
            }
 
            token = jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")
           
            exp_time = datetime.now(timezone.utc) + timedelta(hours=2)
 
            response = jsonify({"message": "Usuário e senha corretos."})
            response.set_cookie(
                "token",
                token,
                httponly=True,
                secure=False,
                samesite="Lax",
                expires=exp_time
            )
 
            return response
       
        else:
            return jsonify({"error": "Usuário ou senha inexistentes. Acesso negado!"}), 401
 
    except Exception as e:
 
        return jsonify({"erro": str(e)}), 500
   
    finally:
 
        cursor.close()
 
 
@auth_routes.route("/logoutPost", methods=["POST"])
@jwt_required
 
def logoutPost():
 
    retorno = jsonify({"message": "Logout realizado com sucesso"})
    retorno.set_cookie(
                "token",
                "",
                httponly=True,
                secure=False,
                samesite="Lax",
                expires=0
            )
   
    return retorno

@auth_routes.route("/atualizarInstrumentoPut", methods=["PUT"])
@jwt_required

def atualizarInstrumentoPut():

    db_connection = current_app.db_connection

    db_connection.ping(reconnect=True)

    redis = current_app.redis
 
    cursor = db_connection.cursor()

    data = request.get_json()

    retornos = dict()
   
    familia_id = data.get("familia_id", "")
    nome = data.get("nome", "") 
    descricao = data.get("descricao", "") #opcinal
    historia = data.get("historia", "") #opcional
    classificacao_sonoridade = data.get("classificacao_sonoridade", "")
    id = data.get("id", "")

    if not familia_id:
        return jsonify({"Erro: ": "familia_id deve ser enviado"}), 404
    
    if not nome:
        return jsonify({"Erro: ": "o nome deve ser enviado"}), 404
    
    if not classificacao_sonoridade:
        return jsonify({"Erro: ": "a classificacao_sonoridade deve ser enviada"}), 404
    
    if not id:
        return jsonify({"Erro: ": "id deve ser enviada"}), 404

    query = "UPDATE instrumento"

    try:

        cursor.execute(

            query + " SET familia_id = %s, nome = %s, descricao = %s, historia = %s, classificacao_sonoridade = %s" +
            " WHERE id = %s", (familia_id, nome, descricao, historia, classificacao_sonoridade, id)
        )

        retornos["Codigo"] = 200

        db_connection.commit()

        redis.delete("instrumentos:todos")
        redis.delete(f"instrumentos:info:{id}")

        return jsonify(retornos), 200

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()

@auth_routes.route("/atualizarAudioPut", methods=["PUT"])
@jwt_required

def atualizarAudioPut():

    db_connection = current_app.db_connection

    db_connection.ping(reconnect=True)

    redis = current_app.redis
 
    cursor = db_connection.cursor()

    data = request.get_json()

    retornos = dict()
   
    instrumento_id = data.get("instrumento_id", "")
    titulo = data.get("titulo", "") 
    descricao = data.get("descricao", "") #opcional
    nota = data.get("nota", "")
    oitava = data.get("oitava", "")
    bpm = data.get("bpm", "") #opcional
    arquivo = data.get("arquivo", "")
    credito_gravacao = data.get("credito_gravacao", "") #opcional
    id = data.get("id", "")

    if not instrumento_id:
        return jsonify({"Erro: ": "instrumento_id deve ser enviado"}), 404
    
    if not titulo:
        return jsonify({"Erro: ": "o titulo deve ser enviado"}), 404
    
    if not nota:
        return jsonify({"Erro: ": "a nota deve ser enviada"}), 404
    
    if not oitava:
        return jsonify({"Erro: ": "a oitava deve ser enviada"}), 404
    
    if not arquivo:
        return jsonify({"Erro: ": "o arquivo deve ser enviado"}), 404
    
    if not id:
        return jsonify({"Erro: ": "id deve ser enviado"}), 404

    query = "UPDATE audio"

    try:

        cursor.execute(

            query + " SET instrumento_id = %s, titulo = %s, descricao = %s, nota = %s, oitava = %s," +
            " bpm = %s, arquivo = %s, credito_gravacao = %s"
            " WHERE id = %s", (instrumento_id, titulo, descricao, nota, oitava, bpm, arquivo, credito_gravacao, id)
        )

        retornos["Codigo"] = 200

        db_connection.commit()

        redis.delete(f"instrumentos:info:{instrumento_id}")

        return jsonify(retornos), 200

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()

@auth_routes.route("/atualizarGenericoPut", methods=["PUT"])
@jwt_required

def atualizarGenericoPut():

    db_connection = current_app.db_connection

    db_connection.ping(reconnect=True)

    redis = current_app.redis
 
    cursor = db_connection.cursor()

    data = request.get_json()

    retornos = {}

    nomeTabela = data.get("nomeTabela", "")
    nome = data.get("nome", "")
    descricao = data.get("descricao", "") #opcional
    referencia = data.get("referencia", "") #opcional
    id = data.get("id", "")

    
    if not nomeTabela:
        return jsonify({"Erro: ": "nomeTabela deve ser enviado"}), 404
    
    if not nome:
        return jsonify({"Erro: ": "nome deve ser enviado"}), 404
    
    
    if not id:
        return jsonify({"Erro: ": "id deve ser enviado"}), 404


    query = "UPDATE " + nomeTabela

    try:

        if nomeTabela == "afinacao":

            cursor.execute(

                query + " SET nome = %s, descricao = %s, referencia = %s" +
                " WHERE id = %s", (nome, descricao, referencia, id)
            )

        else:

            cursor.execute(

                query + " SET nome = %s, descricao = %s" +
                " WHERE id = %s", (nome, descricao, id)
            )

        retornos["Codigo"] = 200

        db_connection.commit()

        redis.delete(f"ids:{nomeTabela}")
        redis.delete(f"fknull:{nomeTabela}")
        redis.delete(f"exists:{nomeTabela}:{id}")

        return jsonify(retornos), 200

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()

@auth_routes.route("/deletar", methods=["DELETE"])
@jwt_required

def deletar():

    db_connection = current_app.db_connection

    db_connection.ping(reconnect=True)

    redis = current_app.redis
 
    cursor = db_connection.cursor()

    data = request.args

    query = "DELETE FROM "
    retornos = dict()

    nomeTabela = data.get("nomeTabela", "")
    id = data.get("id", "")

    if not nomeTabela:
        return jsonify({"Erro: ": "nomeTabela deve ser enviado"}), 404
    
    if not id:
        return jsonify({"Erro: ": "id deve ser enviado"}), 404

    nomeTabela = normalizarTexto(nomeTabela)

    try:

        if nomeTabela == "instrumento":

            cursor.execute(
               
               """
               SELECT ih.instrumento_id, im.instrumento_id, ir.instrumento_id FROM instrumento i 
               LEFT JOIN instrumento_harmonico ih 
               ON i.id = ih.instrumento_id 
               LEFT JOIN instrumento_melodico im 
               ON i.id = im.instrumento_id 
               LEFT JOIN instrumento_ritmico ir 
               ON i.id = ir.instrumento_id
               """
            )

            verificarEspecializacao = list(cursor.fetchall())
            especializacao = ""

            for i in verificarEspecializacao:

                if i[0] != None: especializacao = "instrumento_harmonico"
                elif i[1] != None: especializacao = "instrumento_melodico"
                else: especializacao = "instrumento_ritmico"

            cursor.execute(
               
               query + "instrumento_" + especializacao + " WHERE instrumento_id = %s", (id,)
            )
            
            cursor.execute(
                """
                SELECT a.id FROM audio a 
                LEFT JOIN  instrumento i 
                ON i.id = a.instrumento_id 
                WHERE i.id = %s
                """, (id,)
            )

            verificaAudio = list(cursor.fetchall())

            cursor.execute(
                """
                SELECT fi.id FROM INSTRUMENTO i 
                LEFT JOIN  familia_instrumento fi 
                ON i.familia_id = fi.id 
                WHERE i.familia_id = %s
                """, (id,)
            )

            verificaFamilia = list(cursor.fetchall())

            #404: Precisa deletar o registro em audio
            if len(verificaAudio) != 0 or len(verificaFamilia) != 0:

                if len(verificaAudio) != 0:
                    retornos["Codigo"] = 404
                    retornos["ID"] = verificaAudio[0]

                if len(verificaFamilia) != 0:
                    if 404 not in retornos: retornos["Codigo"] = 404
                    retornos["ID"] = verificaFamilia[0]

                return jsonify(retornos), 404


        cursor.execute(

            query + nomeTabela + " WHERE id = %s", (id,)
        )

        retornos = {"Codigo": 200}

        db_connection.commit()

        redis.delete(f"ids:{nomeTabela}")
        redis.delete(f"fknull:{nomeTabela}")
        redis.delete(f"exists:{nomeTabela}:{id}")

        if nomeTabela == "instrumento":
            redis.delete("instrumentos:todos")
            redis.delete(f"instrumentos:info:{id}")

        return jsonify(retornos), 200

    except Exception as e:

        print(str(e))
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()