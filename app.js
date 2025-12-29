const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Configuração do Banco de Dados
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database_pets.sqlite',
  logging: false 
});

// 2. Modelo do Animal (Mantendo todos os campos anteriores)
const Pet = sequelize.define('Pet', {
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING },
  isVaccinated: { type: DataTypes.STRING },
  isNeutered: { type: DataTypes.STRING },
  rescueLocation: { type: DataTypes.STRING }
});

// 3. Rota da Página Inicial (Interface do Usuário)
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; max-width: 400px; margin: 20px auto; padding: 20px; border: 2px solid #2ecc71; border-radius: 10px; background-color: #f9f9f9;">
      <h2 style="text-align: center; color: #2c3e50;">🐾 Cadastro ODS 15</h2>
      <p style="text-align: center; color: #7f8c8d; font-size: 0.9em;">Vida Terrestre e Proteção Animal</p>
      <hr>
      <form action="/cadastrar" method="POST">
        <label>Nome do Pet:</label>
        <input type="text" name="name" placeholder="Ex: Mel" required style="width:100%; margin-bottom:10px; padding:8px; border-radius:5px; border:1px solid #ccc;">
        
        <label>Idade:</label>
        <input type="text" name="age" placeholder="Ex: 1 ano" style="width:100%; margin-bottom:10px; padding:8px; border-radius:5px; border:1px solid #ccc;">
        
        <label>Status:</label>
        <select name="status" style="width:100%; margin-bottom:10px; padding:8px; border-radius:5px; border:1px solid #ccc;">
          <option>Para Adoção</option>
          <option>Em Tratamento</option>
          <option>Adotado</option>
        </select>
        
        <label>Local do Resgate:</label>
        <input type="text" name="rescueLocation" placeholder="Ex: Rua das Flores" style="width:100%; margin-bottom:10px; padding:8px; border-radius:5px; border:1px solid #ccc;">
        
        <div style="margin: 10px 0;">
          <label><input type="checkbox" name="isVaccinated" value="Sim"> Vacinado</label><br>
          <label><input type="checkbox" name="isNeutered" value="Sim"> Castrado</label>
        </div>
        
        <button type="submit" style="width:100%; padding:12px; background:#2ecc71; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">
          SALVAR ANIMAL
        </button>
      </form>
      <div style="text-align: center; margin-top: 15px;">
        <a href="/pets" style="color: #2980b9; text-decoration: none;">📋 Ver Lista de Pets</a>
      </div>
    </div>
  `);
});

// 4. Rota para Processar o Cadastro
app.post('/cadastrar', async (req, res) => {
  try {
    await Pet.create({
      name: req.body.name,
      age: req.body.age,
      status: req.body.status,
      rescueLocation: req.body.rescueLocation,
      isVaccinated: req.body.isVaccinated || 'Não',
      isNeutered: req.body.isNeutered || 'Não'
    });
    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #27ae60;">✅ Salvo com sucesso!</h1>
        <p>O animal foi registrado no sistema de proteção.</p>
        <a href="/" style="color: #2980b9;">Voltar</a> | <a href="/pets" style="color: #2980b9;">Ver Lista</a>
      </div>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar no banco de dados: ' + err.message);
  }
});

// 5. Rota para Listar Animais (JSON)
app.get('/pets', async (req, res) => {
  const pets = await Pet.findAll();
  res.json(pets);
});

// --- AJUSTE DE PUBLICAÇÃO (A parte nova solicitada) ---
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  // Adicionado "0.0.0.0" para o Replit reconhecer a conexão externa imediatamente
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Sistema pronto e atualizado! Servidor na porta ${PORT}`);
  });
});
