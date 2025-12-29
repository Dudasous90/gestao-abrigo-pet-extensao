const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

// 1. Configuração do Banco de Dados (SQLite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database_pets.sqlite'
});

// 2. Modelo do Animal (Focado na ODS 15 - Vida Terrestre)
const Pet = sequelize.define('Pet', {
  name: { type: DataTypes.STRING, allowNull: false },
  species: { type: DataTypes.ENUM('Cão', 'Gato', 'Outro'), defaultValue: 'Cão' },
  status: { type: DataTypes.ENUM('Para Adoção', 'Tratamento', 'Adotado'), defaultValue: 'Para Adoção' },
  healthInfo: { type: DataTypes.STRING }, 
  rescueLocation: { type: DataTypes.STRING },
  entryDate: { type: DataTypes.DATEONLY, defaultValue: Sequelize.NOW }
});

// --- ROTAS DO SISTEMA ---

// ROTA A: Página Inicial Visual (Para evitar o erro "Cannot GET /")
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px; background-color: #f4f7f6; min-height: 100vh;">
      <h1 style="color: #2c3e50;">🐾 PetCare Manager Online</h1>
      <p style="font-size: 1.2em; color: #7f8c8d;">Projeto Extensionista - ODS 15: Vida Terrestre</p>
      <hr style="width: 50%; margin: 20px auto; border: 1px solid #ddd;">
      
      <div style="margin-top: 30px;">
        <a href="/teste-cadastro" style="padding: 15px 25px; background: #27ae60; color: white; text-decoration: none; border-radius: 8px; margin: 10px; display: inline-block; font-weight: bold;">➕ Simular Cadastro de Pet</a>
        <a href="/pets" style="padding: 15px 25px; background: #2980b9; color: white; text-decoration: none; border-radius: 8px; margin: 10px; display: inline-block; font-weight: bold;">📋 Ver Lista de Animais (JSON)</a>
      </div>
      
      <p style="margin-top: 40px; color: #95a5a6;"><small>Status do Sistema: Operacional ✅</small></p>
    </div>
  `);
});

// ROTA B: Cadastrar via Navegador (Para a tua demonstração rápida)
app.get('/teste-cadastro', async (req, res) => {
  try {
    const nomes = ['Bobby', 'Luna', 'Max', 'Mel', 'Thor', 'Pipoca', 'Bolinha'];
    const nomeSorteado = nomes[Math.floor(Math.random() * nomes.length)];
    
    const novoPet = await Pet.create({
      name: nomeSorteado,
      species: 'Cão',
      healthInfo: 'Saudável - Aguardando vacinação',
      rescueLocation: 'Zona Urbana - Próximo ao Ecossistema Local'
    });
    
    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h2 style="color: #27ae60;">✅ Sucesso!</h2>
        <p style="font-size: 1.2em;">O animal <strong>${novoPet.name}</strong> foi registado no banco de dados.</p>
        <p>Este registo ajuda no controle populacional para a preservação da Vida Terrestre.</p>
        <br>
        <a href="/" style="color: #2980b9; font-weight: bold;">⬅️ Voltar ao Início</a> | 
        <a href="/pets" style="color: #2980b9; font-weight: bold;">Ver Lista Completa ➡️</a>
      </div>
    `);
  } catch (error) {
    res.status(500).send("Erro ao processar o cadastro.");
  }
});

// ROTA C: Listar todos os Pets (Base de dados)
app.get('/pets', async (req, res) => {
  const pets = await Pet.findAll();
  res.json(pets);
});

// ROTA D: Cadastro Manual via API (Método POST - Padrão Profissional)
app.post('/pets', async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json(pet);
  } catch (error) {
    res.status(400).json({ error: "Erro ao cadastrar animal. Verifique os dados." });
  }
});

// 3. Inicialização do Servidor e Banco de Dados
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor PetCare ativo na porta ${PORT}`);
  });
});
