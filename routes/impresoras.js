var express = require('express');
var router = express.Router();
const pug = require('pug');

const db = require('../db');

router.get('/', function(req, res, next) {
  db.query('SELECT * FROM impresora', (err, result) => {
      if (err) {
          console.log(err);
          res.status(500).send('Error al obtener las impresoras.');
      } else {
        // const jsonResults = JSON.stringify(result);
        // res.json(jsonResults);
          //res.render('index', { impresoras: result });
          res.send(result);
      }
  });
});

/*router.get('/enviar', function(req, res, next) {
  console.log(req.query.texto)
  res.render('index', { title: 'Express' });
});*/

router.get('/:id', function(req, res, next) {
  try {
    const idImpresora = req.params.id;

    db.query(`SELECT * FROM impresora WHERE id = '${idImpresora}'`, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error al obtener la impresora.');
      } else {
        const impresora = result[0];

        let nivelesTinta = {
          negro: impresora.negro - 2,
          amarillo: impresora.amarillo - 2,
          cyan: impresora.cyan - 2,
          magenta: impresora.magenta - 2,
          idImpresora: idImpresora
        };

        if (nivelesTinta.negro < 0 || nivelesTinta.amarillo < 0 || nivelesTinta.cyan < 0 || nivelesTinta.magenta < 0) {
          res.status(400).send('Los niveles de tinta no pueden ser negativos.');
          return;
        }        

        db.query(
          `UPDATE impresora SET negro = ${nivelesTinta.negro}, amarillo = ${nivelesTinta.amarillo}, cyan = ${nivelesTinta.cyan}, magenta = ${nivelesTinta.magenta} WHERE id = '${nivelesTinta.idImpresora}'`
        );

        const updatedImpresora = {
          id: idImpresora,
          negro: impresora.negro - 2,
          amarillo: impresora.amarillo - 2,
          cyan: impresora.cyan - 2,
          magenta: impresora.magenta - 2,
        };
        
        res.json(updatedImpresora);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al actualizar la impresora.');
  }
});

router.get('/enviar', function(req, res, next) {
  console.log(req.query.texto)
  
});


module.exports = router;
