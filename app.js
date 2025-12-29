const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

// Configuração do Banco de Dados (SQLite - não precisa instalar nada)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './abrigo_pets_database.sqlite'
});

// Modelo do Animal (Focado na ODS 15 - Vida Terrestre)
const Pet = sequelize.define('Pet', {
  name: { type: DataTypes.STRING, allowNull: false },
  species: { type: DataTypes.ENUM('Cão', 'Gato', 'Outro'), defaultValue: 'Cão' },
  status: { type: DataTypes.ENUM('Para Adoção', 'Tratamento', 'Adotado'), defaultValue: 'Para Adoção' },
  healthInfo: { type: DataTypes.STRING }, // Ex: Vacinado, Castrado
  rescueLocation: { type: DataTypes.STRING }, // Local do resgate (importante para o ecossistema local)
  entryDate: { type: DataTypes.DATEONLY, defaultValue: Sequelize.NOW }
});

// --- ROTAS DA API ---

// 1. Cadastrar um novo pet resgatado
app.post('/pets', async (req, res) => {
  try {
    const pet = await Pet.create(req.body);
    res.status(201).json(pet);
  } catch (error) {
    res.status(400).json({ error: "Erro ao cadastrar animal" });
  }
});

// 2. Listar todos os pets (Para protetores e adotantes)
app.get('/pets', async (req, res) => {
  const pets = await Pet.findAll();
  res.json(pets);
});

// 3. Atualizar dados do pet (ex: quando ele for adotado)
app.patch('/pets/:id', async (req, res) => {
  try {
    await Pet.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Dados atualizados com sucesso!" });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar" });
  }
});

// Inicialização do Servidor
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🐾 Sistema PetCare Online na porta ${PORT}`);
  });
});
