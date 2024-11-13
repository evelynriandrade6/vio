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
    const query = `select * from evento`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        }
        return res
          .status(200)
          .json({ message: "Eventos listados com sucessso!", events: results });
      });
    } catch (error) {
      console.log("Erro ao executar a query: ", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateEventos(req, res) {
    const { nome, descricao, data_hora, local, fk_id_organizador, id_evento } =
      req.body;
    // Validação genérica de todos os atributos
    if (
      !nome ||
      !descricao ||
      !data_hora ||
      !local ||
      !fk_id_organizador ||
      !id_evento
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos!" });
    }
    const query = `update evento set nome=?, descricao=?, data_hora=?, local=?, fk_id_organizador=? where id_evento=?`;
    const values = [
      nome,
      descricao,
      data_hora,
      local,
      fk_id_organizador,
      id_evento,
    ];

    try {
      connect.query(query, values, (err, results) => {
        console.log("Resultados: ", results);
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Erro ao atualizar o evento! " });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Evento não encontrado!" });
        }
        return res
          .status(201)
          .json({ message: "Evento atualizado com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  } // Fim do update

  // Exclusão de eventos
  static async deleteEvento(req, res) {
    const idEvento = req.params.id;

    const query = `delete from evento where id_evento=?`;

    try {
      connect.query(query, idEvento, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao excluir evento!" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Evento não encontrado!" });
        }
        return res
          .status(200)
          .json({ message: "Evento excluído com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar a consulta!", error);
      res.status(500).json({ error: "Erro interno do servidor!" });
    }
  }

  static async getEventosPorData(req, res) {
    const query = `SELECT * FROM evento`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar eventos!" });
        }
        const dataEvento = new Date(results[0].data_hora);
        const dia = dataEvento.getDate();
        const mes = dataEvento.getMonth() + 1;
        const ano = dataEvento.getFullYear();
        console.log(dia + "/" + mes + "/" + ano);

        const now = new Date();
        const eventosPassados = results.filter(
          (evento) => new Date(evento.data_hora) < now
        );
        const eventosFuturos = results.filter(
          (evento) => new Date(evento.data_hora) >= now
        );
        const diferencaMs = eventosFuturos[0].data_hora.getTime() - now.getTime()
        const dias = Math.floor(diferencaMs/(1000*60*60*24));
        const horas = Math.floor((diferencaMs%(1000*60*60*24))/(1000*60*60));
        console.log(diferencaMs,'Falta: ' +dias+ ' dias, '  +horas+ ' horas ' );

        // Comparando datas
        const dataFiltro = new Date('2024-12-15').toISOString().split('T');
        const eventosDia = results.filter(evento => new Date(evento.data_hora).toISOString().split("T")[0] === dataFiltro[0]);
        console.log("Eventos: ", eventosDia);

        return res
          .status(200)
          .json({ message: "Ok", eventosPassados, eventosFuturos});
      });



    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar eventos!" });
    }
  }

  static async getEventosSemanal(req, res) {
    const DiaInicial = new Date(req.params.data).toISOString().split('T')[0];
    const query = `SELECT * FROM evento WHERE TIMESTAMPDIFF(DAY, ?, data_hora) BETWEEN 0 AND 6 ORDER BY data_hora ASC`;

    try {
      connect.query(query, DiaInicial, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro ao buscar eventos!" });
        }
        return res.status(200).json({message: "Eventos: ", eventos:results})
      })
    }catch(error){
      console.error(error);
          return res.status(500).json({ error: "Erro ao buscar eventos!" });
      }
    }
  }
