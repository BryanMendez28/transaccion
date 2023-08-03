const express = require('express');
const routes = express.Router();
routes.get('/', (req, res) => {
  // Intenta imprimir los parámetros que estás recibiendo para asegurarte de que son correctos
  console.log(req.query);

  const pool = req.pool; // Obtener el pool de conexiones desde el objeto req

  const {
    fechaInicio,
    horaInicio,
    fechaFin,
    horaFin,
    nombreMaquinaFiltro,
    codeProductFiltro
  } = req.query;

  const queryTotalGastadoTarjetaCredito = `
  SELECT SUM(SeValue) AS TotalGastadoTarjetaCredito
  FROM nayax_transacciones
  WHERE MachineSeTimeDateOnly BETWEEN ? AND ?
  AND MachineSeTimeTimeOnly BETWEEN ? AND ?
  AND cliente_id LIKE ?
  AND ProductCodeInMap LIKE ?
  AND PaymentMethodId = 1
`;

const queryTotalGastadoEfectivo = `
  SELECT SUM(SeValue) AS TotalGastadoEfectivo
  FROM nayax_transacciones
  WHERE MachineSeTimeDateOnly BETWEEN ? AND ?
AND MachineSeTimeTimeOnly BETWEEN ? AND ?
  AND cliente_id LIKE ?
  AND ProductCodeInMap LIKE ?
  AND PaymentMethodId = 3
`;

  const queryTotalPiezasVendidas = `
    SELECT COUNT(*) AS TotalPiezasVendidas
    FROM nayax_transacciones
    WHERE MachineSeTimeDateOnly BETWEEN ? AND ?
    AND MachineSeTimeTimeOnly BETWEEN ? AND ?
    AND cliente_id LIKE ?
    AND ProductCodeInMap LIKE ?
  `;

  const queryTarjetaCredito = `
    SELECT COUNT(*) AS TotalTarjetaCredito
    FROM nayax_transacciones
    WHERE MachineSeTimeDateOnly BETWEEN ? AND ?
    AND MachineSeTimeTimeOnly BETWEEN ? AND ?
    AND cliente_id LIKE ?
    AND ProductCodeInMap LIKE ?
    AND PaymentMethodId = 1
  `;

  const queryEfectivo = `
    SELECT COUNT(*) AS TotalEfectivo
    FROM nayax_transacciones
    WHERE MachineSeTimeDateOnly BETWEEN ? AND ?
AND MachineSeTimeTimeOnly BETWEEN ? AND ?
    AND cliente_id LIKE ?
    AND ProductCodeInMap LIKE ?
    AND PaymentMethodId = 3
  `;

  const queryTotalGastado = `
    SELECT SUM(SeValue) AS TotalGastado
    FROM nayax_transacciones
    WHERE MachineSeTimeDateOnly BETWEEN ? AND ?
    AND MachineSeTimeTimeOnly BETWEEN ? AND ?
    AND cliente_id LIKE ?
    AND ProductCodeInMap LIKE ?
  `;


  // Intenta imprimir los queries completos para verificar que la sintaxis sea correcta
  console.log('Query Total Piezas Vendidas:', queryTotalPiezasVendidas);
  console.log('Query Tarjeta Crédito:', queryTarjetaCredito);
  console.log('Query Efectivo:', queryEfectivo);
  console.log('Query Total Gastado:', queryTotalGastado);
  console.log('Query Total Gastado Tarjeta Crédito:', queryTotalGastadoTarjetaCredito);
  console.log('Query Total Gastado Efectivo:', queryTotalGastadoEfectivo);

  pool.query(
    queryTotalPiezasVendidas,
    [fechaInicio,  fechaFin,horaInicio, horaFin, `%${nombreMaquinaFiltro}%`, `%${codeProductFiltro}%`],
    (errTotalPiezasVendidas, rowsTotalPiezasVendidas) => {
      if (errTotalPiezasVendidas) {
        console.error('Error executing query Total Piezas Vendidas:', errTotalPiezasVendidas);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    
      pool.query(
        queryTarjetaCredito,
        [fechaInicio,  fechaFin,horaInicio, horaFin, `%${nombreMaquinaFiltro}%`, `%${codeProductFiltro}%`],
        (errTarjetaCredito, rowsTarjetaCredito) => {
          if (errTarjetaCredito) {
            console.error('Error executing query Tarjeta Crédito:', errTarjetaCredito);
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          pool.query(
            queryEfectivo,
            [fechaInicio,  fechaFin,horaInicio, horaFin, `%${nombreMaquinaFiltro}%`, `%${codeProductFiltro}%`],
            (errEfectivo, rowsEfectivo) => {
              if (errEfectivo) {
                console.error('Error executing query Efectivo:', errEfectivo);
                return res.status(500).json({ error: 'Internal Server Error' });
              }

              pool.query(
                queryTotalGastado,
                [fechaInicio,  fechaFin,horaInicio, horaFin, `%${nombreMaquinaFiltro}%`, `%${codeProductFiltro}%`],
                (errTotalGastado, rowsTotalGastado) => {
                  if (errTotalGastado) {
                    console.error('Error executing query Total Gastado:', errTotalGastado);
                    return res.status(500).json({ error: 'Internal Server Error' });
                  }

                  pool.query(
                    queryTotalGastadoTarjetaCredito,
                    [fechaInicio,  fechaFin,horaInicio, horaFin, `%${nombreMaquinaFiltro}%`, `%${codeProductFiltro}%`],
                    (errTotalGastadoTarjetaCredito, rowsTotalGastadoTarjetaCredito) => {
                      if (errTotalGastadoTarjetaCredito) {
                        console.error('Error executing query Total Gastado Tarjeta Crédito:', errTotalGastadoTarjetaCredito);
                        return res.status(500).json({ error: 'Internal Server Error' });
                      }

                      pool.query(
                        queryTotalGastadoEfectivo,
                        [fechaInicio,  fechaFin,horaInicio, horaFin, `%${nombreMaquinaFiltro}%`, `%${codeProductFiltro}%`],
                        (errTotalGastadoEfectivo, rowsTotalGastadoEfectivo) => {
                          if (errTotalGastadoEfectivo) {
                            console.error('Error executing query Total Gastado Efectivo:', errTotalGastadoEfectivo);
                            return res.status(500).json({ error: 'Internal Server Error' });
                          }
                        

                  // Obtener las cantidades de registros de tarjeta de crédito, efectivo y total de piezas vendidas desde los resultados
                  const totalTarjetaCredito = rowsTarjetaCredito[0].TotalTarjetaCredito;
                  const totalEfectivo = rowsEfectivo[0].TotalEfectivo;
                  const totalPiezasVendidas = rowsTotalPiezasVendidas[0].TotalPiezasVendidas;
                  const totalGastado = rowsTotalGastado[0].TotalGastado;
                  const totalGastadoTarjetaCredito = rowsTotalGastadoTarjetaCredito[0].TotalGastadoTarjetaCredito;
                  const totalGastadoEfectivo =rowsTotalGastadoEfectivo[0].TotalGastadoEfectivo;

                  // Crear el resultado final y enviarlo como respuesta
                  const resultadoFinal = {
                    TotalTarjetaCredito: totalTarjetaCredito,
                    TotalEfectivo: totalEfectivo,
                    TotalPiezasVendidas: totalPiezasVendidas,
                    TotalGastado: totalGastado,
                    TotalGastadoTarjetaCredito: totalGastadoTarjetaCredito,
                    TotalGastadoEfectivo: totalGastadoEfectivo
                  };
                  res.json(resultadoFinal);
                }
              );
            }
          );
        }
      );
    }
  );
        }
  
);
}
);
}
);

module.exports = routes;

routes.get('/consulta-dinamica', (req, res) => {
  const pool = req.pool; // Obtener el pool de conexiones desde el objeto req

  const {
    fechaInicio,
    fechaFin,
    horaInicio,
    horaFin,
    cliente_id,
  } = req.query;

  const query = `
    SELECT 
      ProductCodeInMap,
      COUNT(*) AS TotalRegistros,
      SUM(CASE WHEN PaymentMethodId = 1 THEN 1 ELSE 0 END) AS TotalRegistrosTarjetaCredito,
      SUM(CASE WHEN PaymentMethodId = 3 THEN 1 ELSE 0 END) AS TotalRegistrosEfectivo,
      SUM(CASE WHEN PaymentMethodId = 1 THEN SeValue ELSE 0 END) AS TotalGastadoTarjetaCredito,
      SUM(CASE WHEN PaymentMethodId = 3 THEN SeValue ELSE 0 END) AS TotalGastadoEfectivo,
      SUM(SeValue) AS TotalCosto
    FROM nayax_transacciones  
    WHERE MachineSeTimeDateOnly BETWEEN ? AND ?
      AND MachineSeTimeTimeOnly BETWEEN ? AND ? 
      AND cliente_id = ? 
    GROUP BY ProductCodeInMap;
  `;

  pool.query(
    query,
    [fechaInicio, fechaFin, horaInicio, horaFin, cliente_id],
    (err, rows) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Enviar los resultados como respuesta al frontend
      res.json(rows);
    }
  );
});

routes.get('/consulta-con-filtro', (req, res) => {
  const pool = req.pool; // Obtener el pool de conexiones desde el objeto req

  const {
    fechaInicio,
    horaInicio,
    fechaFin,
    horaFin,
    nombreMaquinaFiltro,
    codeProductFiltro
  } = req.query;

  const query = `
    SELECT 
      cliente_id,
      ProductCodeInMap,
      MachineSeTimeDateOnly ,
      MachineSeTimeTimeOnly
    FROM nayax_transacciones
    WHERE MachineSeTimeDateOnly BETWEEN ? AND ?
AND MachineSeTimeTimeOnly BETWEEN ? AND ?
    AND cliente_id LIKE ?
    AND ProductCodeInMap LIKE ?;
  `;

  pool.query(
    query,
    [fechaInicio,  fechaFin,horaInicio, horaFin, `%${nombreMaquinaFiltro}%`, `%${codeProductFiltro}%`],
    (err, rows) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Enviar los registros como respuesta al frontend
      res.json(rows);
    }
  );
});

routes.post('/', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    conn.query('INSERT INTO books set ?', [req.body], (err, rows) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.send('book added!');
    });
  });
});

routes.delete('/:id', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    conn.query('DELETE FROM books WHERE id = ?', [req.params.id], (err, rows) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.send('book excluded!');
    });
  });
});

routes.put('/:id', (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    conn.query('UPDATE books set ? WHERE id = ?', [req.body, req.params.id], (err, rows) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.send('book updated!');
    });
  });
});

module.exports = routes;
