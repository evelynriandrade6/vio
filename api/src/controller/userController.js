let users = [];

module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, password, name } = req.body;

    if (!cpf || !email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(cpf) || cpf.length !== 11) {
      return res.status(400).json({
        error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    }

    // Verifica se já existe um usuário com o mesmo CPF
    const existingUser = users.find((user) => user.cpf === cpf);
    if (existingUser) {
      return res.status(400).json({ error: "CPF já cadastrado" });
    }

    // Cria e adiciona novo usuário
    const newUser = { cpf, email, password, name };
    users.push(newUser);

    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso", user: newUser });
  }

  static async getAllUsers(req, res) {
    return res
      .status(200)
      .json({ message: "Obtendo todos os usuários", users });
  }

  static async updateUser(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição
    const { cpf, email, password, name } = req.body;
    //Validar se todos os campos foram preenchidos
    if (!cpf || !email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    //Procurar o indice do usuario no Array 'users' pelo cpf
    const userIndex = users.findIndex((user) => user.cpf === cpf);
    //Se o usuario não for encontrado userIndex se torna -1
    if (userIndex === -1) {
      return res
        .status(400)
        .json({ error: "Usuário não encontrado" });
    }

    //Atualiza os dados do usuario no Array 'users' de index userIndex
    users[userIndex] = { cpf, email, password, name };

    //Mensagem para o usuario
    return res
      .status(200)
      .json({ message: "Usuário atualizado", user: users[userIndex] });
  }

  static async deleteUser(req, res) {
    //Obtem o parametro Id da requisição, que é o cpf do user a ser deletado
    const userId = req.params.cpf;

    //Procurar o indice do usuario no Array 'users' pelo parametro(cpf)
    const userDeleted = users.findIndex((user) => user.cpf === userId);
    //Se o usuario não for encontrado userDeleted se torna -1
    if (userDeleted === -1) {
      return res
        .status(400)
        .json({ error: "Usuário não encontrado" });
    }

    //Removendo o usuario do Array 'users'
    users.splice(userDeleted, 1);

    return res
        .status(200)
        .json({message:"Usuário deletado com sucesso"});
  }
};
