const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database_pets.sqlite',
  logging: false // Deixa o console mais limpo
});

const Pet = sequelize.define('Pet', {
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING },
  isVaccinated: { type: DataTypes.STRING },
  isNeutered: { type: DataTypes.STRING },
  rescueLocation: { type: DataTypes.STRING }
});

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; max-width: 400px; margin: 20px auto; padding: 20px; border: 2px solid #2ecc71; border-radius: 10px;">
      <h2 style="text-align: center;">🐾 Cadastro ODS 15</h2>
      <form action="/cadastrar" method="POST">
        <input type="text" name="name" placeholder="Nome do Pet" required style="width:100%; margin-bottom:10px; padding:8px;">
        <input type="text" name="age" placeholder="Idade (ex: 1 ano)" style="width:100%; margin-bottom:10px; padding:8px;">
        <select name="status" style="width:100%; margin-bottom:10px; padding:8px;">
          <option>Para Adoção</option>
          <option>Em Tratamento</option>
        </select>
        <input type="text" name="rescueLocation" placeholder="Local do Resgate" style="width:100%; margin-bottom:10px; padding:8px;">
        <label><input type="checkbox" name="isVaccinated" value="Sim"> Vacinado</label><br>
        <label><input type="checkbox" name="isNeutered" value="Sim"> Castrado</label><br><br>
        <button type="submit" style="width:100%; padding:10px; background:#2ecc71; color:white; border:none; cursor:pointer;">SALVAR ANIMAL</button>
      </form>
    </div>
  `);
});

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
    res.send('<h1>✅ Salvo com sucesso!</h1><a href="/">Voltar</a> | <a href="/pets">Ver Lista</a>');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar: ' + err.message);
  }
});

app.get('/pets', async (req, res) => {
  const pets = await Pet.findAll();
  res.json(pets);
});

// O segredo está aqui: o { alter: true } ajusta o banco automaticamente
sequelize.sync({ alter: true }).then(() => {
  app.listen(3000, () => console.log("🚀 Sistema pronto e atualizado!"));
});
