const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Necessário para ler o formulário

// 1. Configuração do Banco de Dados (SQLite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database_pets.sqlite'
});

// 2. Modelo do Animal (Campos solicitados: Nome, Idade, Status, Vacina, Castração)
const Pet = sequelize.define('Pet', {
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.STRING }, // Idade (ex: "2 anos" ou "Filhote")
  species: { type: DataTypes.STRING, defaultValue: 'Cão' },
  status: { type: DataTypes.STRING, defaultValue: 'Para Adoção' },
  isVaccinated: { type: DataTypes.STRING, defaultValue: 'Não' },
  isNeutered: { type: DataTypes.STRING, defaultValue: 'Não' }, // Castrado
  rescueLocation: { type: DataTypes.STRING }
});

// --- ROTAS DO SISTEMA ---

// ROTA: Página Inicial com o Formulário de Cadastro Completo
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; max-width: 500px; margin: 30px auto; padding: 25px; border-radius: 15px; background: #ffffff; box-shadow: 0px 4px 15px rgba(0,0,0,0.1);">
      <h1 style="text-align: center; color: #2c3e50; margin-bottom: 5px;">🐾 PetCare Manager</h1>
      <p style="text-align: center; color: #7f8c8d; margin-top: 0;">Gestão de Abrigo - ODS 15</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      
      <form action="/cadastrar" method="POST">
        <div style="margin-bottom: 15px;">
          <label style="font-weight: bold;">Nome do Animal:</label><br>
          <input type="text" name="name" placeholder="Ex: Mel" required style="width:100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
        </div>

        <div style="margin-bottom: 15px;">
          <label style="font-weight: bold;">Idade aproximada:</label><br>
          <input type="text" name="age" placeholder="Ex: 2 anos" style="width:100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
        </div>

        <div style="margin-bottom: 15px;">
          <label style="font-weight: bold;">Status do Animal:</label><br>
          <select name="status" style="width:100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
            <option value="Para Adoção">Para Adoção</option>
            <option value="Em Tratamento">Em Tratamento</option>
            <option value="Adotado">Adotado</option>
            <option value="Em Lar Temporário">Em Lar Temporário</option>
          </select>
        </div>

        <div style="margin-bottom: 15px;">
          <label style="font-weight: bold;">Informações de Saúde:</label><br>
          <div style="margin-top: 5px;">
            <input type="checkbox" name="isVaccinated" value="Sim"> <label>Vacinado</label> &nbsp;&nbsp;
            <input type="checkbox" name="isNeutered" value="Sim"> <label>Castrado (Neutered)</label>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="font-weight: bold;">Local de Resgate / Origem:</label><br>
          <input type="text" name="rescueLocation" placeholder="Ex: Praça Central" style="width:100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
        </div>
        
        <button type="submit" style="width:100%; padding:12px; background:#2ecc71; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:bold; font-size:
