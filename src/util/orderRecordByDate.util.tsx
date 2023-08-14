export function orderDateByMoreRecentRecorded(a: any, b: any) {
    const dataA: any = new Date(a.originalDate);
    const dataB: any = new Date(b.originalDate);
    return dataB - dataA; // Ordem decrescente para que os registros mais recentes fiquem no início
  }

  export function orderDateByMoreOldRecorded(a: any, b: any) {
    const dataA: any = new Date(a.originalDate);
    const dataB: any = new Date(b.originalDate);
    return dataA - dataB; // Ordem decrescente para que os registros mais recentes fiquem no início
  }