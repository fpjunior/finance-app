import * as SQLite from 'expo-sqlite';

export const dbBackup = SQLite.openDatabase('mydatabase.db');

export const saveDataBackup = (dataSalvo: any, nomeArquivo: any, quantidadeRegistros: any) => {
  
    dbBackup.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS backup (id INTEGER PRIMARY KEY, dataSalvo TEXT, nomeArquivo TEXT, quantidadeRegistros INTEGER)',
        []
      );
  
      tx.executeSql(
        'INSERT OR REPLACE INTO backup (id, dataSalvo, nomeArquivo, quantidadeRegistros) VALUES (1, ?, ?, ?)',
        [dataSalvo, nomeArquivo, quantidadeRegistros],
        
        (_, resultSet) => {
        //   setBackupData({ dataSalvo, nomeArquivo, quantidadeRegistros }),
          console.log('Dados de backup salvos com sucesso!');
        },
        (_, error) => {
          console.log('Erro ao salvar dados de backup:', error);
          return false; // Return false to indicate a rollback
        }
      );
    });
  };