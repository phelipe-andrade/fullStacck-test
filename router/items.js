const express = require('express');
const router = express.Router();
const mysql = require('../mysql');
const login = require('../middleware/login');
const time = require('../time');
const currentTime = time();

router.get('/', login, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    console.log();
    if (req.user.type === process.env.TYPE_ADM) {
      const query = `SELECT 
                      items.id_item
                      users.email, 
                      items.description,
                      items.deadline  
                      FROM users  
                INNER JOIN items  
                   ON users.id_user = items.id_user;`;

      conn.query(query, (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          quantidade: result.length,
          items: result.map((prod) => {
            return {
              email: prod.email,
              description: prod.description,
              deadline: prod.deadline,
              finish: prod.finish,
            };
          }),
        };
        return res.status(200).send(response);
      });
    } else {
      const query = 'SELECT * FROM items WHERE id_user=?;';
      conn.query(query, [req.user.id], (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          quantidade: result.length,
          items: result.map((prod) => {
            return {
              id: prod.id_item,
              description: prod.description,
              deadline: prod.deadline,
              finish: prod.finish,
            };
          }),
        };
        return res.status(200).send(response);
      });
    }
  });
});

// INSERE UM PRODUTO
router.post('/', login, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      'INSERT INTO items (id_user, description, date_insert, time_insert, deadline) VALUES (?,?,?,?,?);',
      [
        req.user.id,
        req.body.description,
        currentTime.date,
        currentTime.time,
        req.body.deadline,
      ],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = { mensagem: 'Item inserido com sucesso' };
        res.status(201).send(response);
      },
    );
  });
});

//ALTERAR UM PRODUTO
router.patch('/:id_item', login, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `UPDATE items
        SET description=?, deadline=?, date_edit=?, time_edit=?, finish=?, date_finish=?, time_finish=? 
        WHERE id_item=?`,
      [
        req.body.description,
        req.body.deadline,
        currentTime.date,
        currentTime.time,
        req.params.id_item,
      ],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = { mensagem: 'Produto atualizado com sucesso' };
        res.status(202).send(response);
      },
    );
  });
});

//FINALIZA UM ITEM
router.patch('/:id_item', login, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `UPDATE items
        SET finish=?, date_finish=?, time_finish=? 
        WHERE id_item=?`,
      [true, currentTime.date, currentTime.time, req.params.id_item],
      (error, result, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = { mensagem: 'Produto atualizado com sucesso' };
        res.status(202).send(response);
      },
    );
  });
});

//EXCLUI UM PRODUTO
router.delete('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      `DELETE FROM itens WHERE id_item =?`,
      [req.body.id_item],
      (error, resultado, field) => {
        conn.release();

        if (error) {
          return res.status(500).send({ error: error });
        }
        const response = {
          mensagem: 'Item removido com sucesso',
          request: {
            tipo: 'POST',
            descricao: 'Retorna os detalhes do produto',
          },
        };
        res.status(202).send(response);
      },
    );
  });
});

module.exports = router;
