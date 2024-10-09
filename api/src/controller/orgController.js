const connect = require('../db/connect');

module.exports = class orgController {
  static async createOrg(req, res) {

    // Recebe valores do body da requisição
    const { nome, email, senha, telefone } = req.body;

    // Check se os campos foram preenchidos
    if (!nome || !email || !senha || !telefone) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos." });

    } // Check se o telefone não é feito de números ou não tem 11 digitos
    if (isNaN(telefone) || telefone.length !== 11) {
      return res.status(400).json({
        error: "Telefone inválido. Deve conter exatamente 11 dígitos numéricos.",
      });

    } // Check se o email não possui @
    else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @." });
    }  else {
      // Construção da query INSERT
    const query = `INSERT INTO organizador(telefone, senha, email, nome) VALUES('${telefone}','${senha}','${email}','${nome}')`; 
    // Executando a query criada
    try{
      connect.query(query, function(err, results){
        if(err){
          console.log(err)
          console.log(err.code)
          if(err.code === 'ER_DUP_ENTRY'){
            return res.status(400).json({error: "O email já está vinculado a outro organizador"});
        } else{
          return res.status(500).json({error: "Erro interno do servidor",});
        }
      } else {
        return res.status(201).json({message: "Organizador cadastrado com sucesso"});
      }
      });
    } catch (error){
          console.error(error);
          res.status(500).json({error:"Erro interno do servidor"});
    }

  }
}

  static async getAllOrg(req, res) {
    return res
    .status(200)
    .json({ message: "Exibindo todos os organizadores.", organizador });
  }

  static async updateOrg(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição
    const { id, nome, email, senha, telefone } = req.body;

    //Validar se todos os campos foram preenchidos
    if (!id || !nome || !email || !senha || !telefone) {
        return res
          .status(400)
          .json({ error: "Todos os campos devem ser preenchidos." });
    } // Check se o telefone não é feito de números ou não tem 11 digitos
    else if (isNaN(telefone) || telefone.length !== 11) {
        return res.status(400).json({
          error: "Telefone inválido. Deve conter exatamente 11 dígitos numéricos.",
        });
  
    } // Check se o email não possui @
    else if (!email.includes("@")) {
        return res.status(400).json({ error: "Email inválido. Deve conter @." });
  
    }
    //Procurar o indice do organizador no Array 'organizador' pelo id
    const orgId = organizador.findIndex((org) => org.id === id);

    //Se o usuario não for encontrado orgId se torna -1
    if (orgId === -1) {
      return res
        .status(400)
        .json({ error: "Organizador não encontrado." });

    } //Atualiza os dados do organizador no Array 'organizador' de index orgId
    organizador[orgId] = { id, nome, email, senha, telefone };

    //Mensagem para o usuario
    return res
      .status(200)
      .json({ message: "Organizador atualizado.", user: organizador[orgId] });
  }

  static async deleteOrg(req, res) {
    //Obtem o parametro Id da requisição, que é o email do organizador a ser deletado
    const orgId = req.params.id;

    //Procurar o indice do organizador no Array 'organizador' pelo parametro(id)
    const orgDeleted = organizador.findIndex((org) => org.id == orgId);

    //Se o usuario não for encontrado userDeleted se torna -1
    if (orgDeleted === -1) {
      return res
        .status(400)
        .json({ error: "Organizador não encontrado." });
    }

    //Removendo o organizador do Array 'organizador'
    organizador.splice(orgDeleted, 1);

    return res
        .status(200)
        .json({message:"Organizador deletado com sucesso."});
  }
};
