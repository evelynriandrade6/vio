const connect = require("../db/connect");

module.exports = class eventoController {
  // Criação de um evento
  static async createEvento(req, res) {
    const { nome, descricao, data_hora, local, fk_id_organizador } = req.body;

    // Validação genérica de todos os atributos
    if (!nome || !descricao || !data_hora || !local || !fk_id_organizador) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos." });
    }

    const query = `insert into evento (nome, descricao, data_hora, local, fk_id_organizador) values (?, ?, ?, ?, ?)`;
    const values = [nome, descricao, data_hora, local, fk_id_organizador];
    try {
      connect.query(query, values, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao criar o evento!" });
        }
        return res.status(201).json({ message: "Evento criado com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  } // Fim do create

  // Visualizar todos os eventos cadastrados
  static async getAllEventos(req, res) {

    const query = `select * from evento`

    try{
        connect.query(query, (err, results) => {
            if(err){
                console.log(err);
                return res.status(500).json({error: "Erro ao buscar eventos"});
            }
            return res.status(200).json({message: "Eventos listados com sucessso!", events: results});
         })
        
    } catch(error){
        console.log("Erro ao executar a query: ", error);
        return res.status(500).json({error: "Erro interno do servidor"});
    }
  };

  static async updateEventos(req, res) {
    const { nome, descricao, data_hora, local, fk_id_organizador, id_evento } = req.body;
    // Validação genérica de todos os atributos
    if (!nome || !descricao || !data_hora || !local || !fk_id_organizador || !id_evento) {
        return res
          .status(400)
          .json({ error: "Todos os campos devem ser preenchidos!" });
      }
      const query = `update evento set nome=?, descricao=?, data_hora=?, local=?, fk_id_organizador=? where id_evento=?`;
      const values = [nome, descricao, data_hora, local, fk_id_organizador, id_evento];

      try {
        connect.query(query, values, (err, results) => {
            console.log("Resultados: ", results);
            if(err) {
                console.log(err);
                return res.status(500).json ({ error: "Erro ao atualizar o evento! "});
            }
            if(results.affectedRows === 0){
                return res.status(404).json({error: "Evento não encontrado!"});
            }
            return res.status(201).json({ message: "Evento atualizado com sucesso!"})
        });
      } catch (error) {
        console.log("Erro ao executar consulta:", error);
        return res.status(500).json({ message: "Erro interno do servidor!"})
      }
    } // Fim do update

};
