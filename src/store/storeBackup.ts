import * as SQLite from 'expo-sqlite';

export const dbBackup = SQLite.openDatabase('mydatabase.db');

export const saveDataBackup = (dataSalvo: string, nomeArquivo: string, quantidadeRegistros: number, isBackup: number, rangeDateBackup: string, pathBackup: string) => {
  
    dbBackup.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS backup (id INTEGER PRIMARY KEY, dataSalvo TEXT, nomeArquivo TEXT, quantidadeRegistros INTEGER, isBackup INTEGER, rangeDateBackup TEXT, pathBackup TEXT)',
        []
      );
  
      tx.executeSql(
        'INSERT OR REPLACE INTO backup (id, dataSalvo, nomeArquivo, quantidadeRegistros, isBackup, rangeDateBackup, pathBackup) VALUES (1, ?, ?, ?, ?, ?, ?)',
        [dataSalvo, nomeArquivo, quantidadeRegistros, isBackup, rangeDateBackup, pathBackup],
        
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

  export const restoreDataBackup = (dataRestore: any, nomeArquivoRestore: any, quantidadeRegistrosRestore: any, isBackup: number, rangeDateRestore: string, pathRestore: string) => {
  
    dbBackup.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS restore (id INTEGER PRIMARY KEY, dataRestore TEXT, nomeArquivoRestore TEXT, quantidadeRegistrosRestore INTEGER, isBackup INTEGER, rangeDateRestore TEXT, pathRestore TEXT)',
        []
      );
  
      tx.executeSql(
        'INSERT OR REPLACE INTO restore (id, dataRestore, nomeArquivoRestore, quantidadeRegistrosRestore, isBackup, rangeDateRestore, pathRestore) VALUES (1, ?, ?, ?, ?, ?, ?)',
        [dataRestore, nomeArquivoRestore, quantidadeRegistrosRestore, isBackup, rangeDateRestore, pathRestore],
        
        (_, resultSet) => {
        //   setBackupData({ dataRestore, nomeArquivoRestore, quantidadeRegistrosRestore }),
          console.log('Dados de restore salvos com sucesso!');
        },
        (_, error) => {
          console.log('Erro ao salvar dados de backup:', error);
          return false; // Return false to indicate a rollback
        }
      );
    });
  };

  