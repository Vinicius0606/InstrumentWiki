from flask import Blueprint, request, jsonify, current_app, g
import bcrypt
import jwt
import unicodedata


#  arrumar a função de fknullget e get por Id
 
def normalizarTexto(texto):

    texto = unicodedata.normalize("NFD", texto)

    texto = ''.join([c for c in texto if not unicodedata.combining(c)]).lower()

    if texto == "familia":
        texto = "familia_instrumento"

    return texto

auth_routes = Blueprint("auth_routes", __name__)
 
@auth_routes.route("/instrumentosGet", methods=["GET"])
 
def instrumentosGet():
 
    db_connection = current_app.db_connection
 
    cursor = db_connection.cursor()
 
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
 
                        "especializacao": especializacaoNomes[0],
                        "opcao1": especializacao[1],
                        "opcao1Nome": especializacaoNomes[1],
                        "opcao2": especializacao[2],
                        "opcao2Nome": especializacaoNomes[2],
                        "opcao3": especializacao[3],
                        "opcao3Nome": especializacaoNomes[3]
                    }
                }
            )
 
        return jsonify(instrumentosCompletos), 200
 
    except Exception as e:
       
        return jsonify("Erro: ", str(e)), 500
   
    finally:
 
        cursor.close()

@auth_routes.route("/instrumentosInfoGet", methods=["GET"])

def instrumentosInfoGet():

    db_connection = current_app.db_connection
 
    cursor = db_connection.cursor()

    data = request.args

    id = data.get("id")

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
            

        return jsonify(instrumentosCompletos), 200
 
    except Exception as e:
       
        return jsonify("Erro: ", str(e)), 500
   
    finally:
 
        cursor.close()

@auth_routes.route("/idFkNullGet", methods=["GET"])

def idFkNullGet():

    db_connection = current_app.db_connection
 
    cursor = db_connection.cursor()

    retornos = []

    data = request.args

    tabelaNome = data.get("tabelaNome")

    try:

        if tabelaNome == "audio":

            cursor.execute(

                "SELECT id, titulo, descricao FROM audio WHERE instrumento_id IS NULL"
            )
            
        elif tabelaNome == "afinacao":

            cursor.execute(

                "SELECT a.id, a.nome, a.descricao FROM afinacao a" +
                " LEFT JOIN instrumento_afinacao ia" +
                " ON a.id = ia.afinacao_id" +
                " WHERE ia.afinacao_id IS NULL" 
            )

        elif tabelaNome == "tecnica":

            cursor.execute(

                "SELECT t.id, t.nome, t.descricao FROM tecnica t" +
                " LEFT JOIN audio_tecnica at" +
                " ON t.id = at.tecnica_id" +
                " WHERE at.tecnica_id IS NULL" 
            )

        elif tabelaNome == "material":

            cursor.execute(

                "SELECT m.id, m.nome, m.descricao FROM material m" +
                " LEFT JOIN instrumento_material_parte imp" +
                " ON m.id = imp.material_id" +
                " WHERE imp.material_id IS NULL" 
            )


        lista = list(cursor.fetchall())

        for i in lista:

            if tabelaNome == "audio":

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

        return jsonify(retornos), 200

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()
            
@auth_routes.route("/verificarExistenciaGet", methods=["GET"])

def verificarExistenciaGet():

    db_connection = current_app.db_connection
 
    cursor = db_connection.cursor()

    data = request.args

    query = list()
    retornos = dict()

    nomeTabela = data.get("nomeTabela", "")
    id = data.get("id", "")

    nomeTabela = normalizarTexto(nomeTabela)

    try:    

        cursor.execute(
        
        "SELECT id FROM " + nomeTabela + " WHERE id = %s", (id,)  
        )

        query = list(cursor.fetchall())

        if len(query) == 0: retornos["Exists"] = False
        else: retornos["Exists"] = True

        return jsonify(retornos), 200
        
    except Exception as e:
       
        print(str(e))
        return jsonify("Erro: ", str(e)), 500
   
    finally:
 
        cursor.close()

@auth_routes.route("/inserirInstrumentoPost", methods=["POST"])

def inserirInstrumentoPost():

    db_connection = current_app.db_connection
 
    cursor = db_connection.cursor()

    data = request.get_json()

    retornos = {}

    familia_id = data.get("familia_id")
    nome = data.get("nome") 
    descricao = data.get("descricao", "")
    historia = data.get("historia")
    classificacao_sonoridade = data.get("classificacao_sonoridade")

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

        retornos["ID"] = id[0]
        retornos["Codigo"] = 200

        db_connection.commit()

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()

    return retornos


@auth_routes.route("/inserirAudioPost", methods=["POST"])

def inserirAudioPost():

    db_connection = current_app.db_connection
 
    cursor = db_connection.cursor()

    data = request.get_json()

    retornos = {}

    instrumento_id = data.get("instrumento_id")
    titulo = data.get("titulo") 
    descricao = data.get("descricao", "")
    nota = data.get("nota")
    oitava = data.get("oitava")
    bpm = data.get("bpm", "")
    arquivo = data.get("arquivo")
    credito_gravacao = data.get("credito_gravacao", "")

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

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()

    return retornos

@auth_routes.route("/inserirGenericoPost", methods=["POST"])

def inserirGenericoPost():

    db_connection = current_app.db_connection
 
    cursor = db_connection.cursor()

    data = request.get_json()

    retornos = {}

    tabelaNome = data.get("tabelaNome")
    nome = data.get("nome")
    descricao = data.get("descricao", "")
    referencia = data.get("referencia", "")

    tabelaNome = str(tabelaNome)

    query = "INSERT INTO " + tabelaNome

    tabelaNome = tabelaNome[0:3].upper()

    try:

        cursor.execute(

            
            "SELECT Gerar_ID_Generico('"+ tabelaNome +"') FROM audio limit 1"
            
        )

        id = list(cursor.fetchone())

        if tabelaNome == "afinacao":

            cursor.execute(

                query + "(id, nome, descricao, referencia) VALUES " +
                "(%s, %s, %s, %s)",(id[0], nome, descricao, referencia)
            )

        else:

            cursor.execute(

                query + "(id, nome, descricao) VALUES " +
                "(%s, %s, %s)",(id[0], nome, descricao)
            )

        retornos["ID"] = id[0]
        retornos["Codigo"] = 200

        db_connection.commit()

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()

    return retornos

@auth_routes.route("/atualizarInstrumentoPut", methods=["PUT"])

def atualizarInstrumentoPut():

    db_connection = current_app.db_connection
 
    cursor = db_connection.cursor()

    data = request.get_json()

    retornos = dict()
   
    familia_id = data.get("familia_id")
    nome = data.get("nome") 
    descricao = data.get("descricao", "")
    historia = data.get("historia", "")
    classificacao_sonoridade = data.get("classificacao_sonoridade")
    id = data.get("id")

    query = "UPDATE instrumento"

    try:

        cursor.execute(

            query + " SET familia_id = %s, nome = %s, descricao = %s, historia = %s, classificacao_sonoridade = %s" +
            " WHERE id = %s", (familia_id, nome, descricao, historia, classificacao_sonoridade, id)
        )

        retornos["Codigo"] = 200

        db_connection.commit()

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()
             
    return retornos

@auth_routes.route("/atualizarAudioPut", methods=["PUT"])

def atualizarAudioPut():

    db_connection = current_app.db_connection
 
    cursor = db_connection.cursor()

    data = request.get_json()

    retornos = dict()
   
    instrumento_id = data.get("instrumento_id")
    titulo = data.get("titulo") 
    descricao = data.get("descricao", "")
    nota = data.get("nota", "")
    oitava = data.get("oitava")
    bpm = data.get("bpm", "")
    arquivo = data.get("arquivo")
    credito_gravacao = data.get("credito_gravacao", "")
    id = data.get("id")

    query = "UPDATE audio"

    try:

        cursor.execute(

            query + " SET instrumento_id = %s, titulo = %s, descricao = %s, nota = %s, oitava = %s," +
            " bpm = %s, arquivo = %s, credito_gravacao = %s"
            " WHERE id = %s", (instrumento_id, titulo, descricao, nota, oitava, bpm, arquivo, credito_gravacao, id)
        )

        retornos["Codigo"] = 200

        db_connection.commit()

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()
             
    return retornos

@auth_routes.route("/atualizarGenericoPut", methods=["PUT"])

def atualizarGenericoPut():

    db_connection = current_app.db_connection
 
    cursor = db_connection.cursor()

    data = request.get_json()

    retornos = {}

    tabelaNome = data.get("tabelaNome")
    nome = data.get("nome")
    descricao = data.get("descricao", "")
    referencia = data.get("referencia", "")
    id = data.get("id")

    query = "UPDATE " + tabelaNome

    try:

        if tabelaNome == "afinacao":

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

    except Exception as e:
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()
             
    return retornos

@auth_routes.route("/deletar", methods=["DELETE"])

def deletar():

    db_connection = current_app.db_connection
 
    cursor = db_connection.cursor()

    data = request.args

    query = "DELETE FROM "
    retornos = dict()

    nomeTabela = data.get("nomeTabela")
    especializacao = data.get("especializacao", "")
    id = data.get("id")

    especializacao = normalizarTexto(especializacao)
    nomeTabela = normalizarTexto(nomeTabela)

    try:

        if nomeTabela == "instrumento":

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

            #404: Precisa deletar o registro em audio
            if len(verificaAudio) != 0:
                retornos = {"Codigo": 404}

                return jsonify(retornos), 404


        cursor.execute(

            query + nomeTabela + " WHERE id = %s", (id,)
        )

        retornos = {"Codigo": 200}

        db_connection.commit()

    except Exception as e:

        print(str(e))
       
        db_connection.rollback()
        return jsonify("Erro: ", str(e)), 500
   
    finally:
        
        cursor.close()
             
    return jsonify(retornos),200

@auth_routes.route("/retornarIDsGenerico", methods=["GET"])

def retornarIDsGenerico():

    db_connection = current_app.db_connection
 
    cursor = db_connection.cursor()

    data = request.args

    nomeTabela = data.get("nomeTabela", "")

    if not nomeTabela:
        return jsonify({"Erro: ": "o nome da tabela deve ser enviado"}), 404

    nomeTabela = normalizarTexto(nomeTabela)

    query = "SELECT "

    try:

        if(nomeTabela == "Áudio"):

            query += "id, titulo, descricao "
        
        else:

            query += "id, nome, descricao "

        query += "FROM " + nomeTabela

        cursor.execute(query)

        dadosTabela = list(cursor.fetchall())

        retorno = list()

        for dado in dadosTabela:

            retorno.append({
                "id": dado[0],
                "nome": dado[1],
                "descricao": dado[2]
            })

        return jsonify(retorno), 200
    
    except Exception as e:

        print(str(e))

        return jsonify({"Erro: ": str(e)}), 500
    
    finally:

        cursor.close()


