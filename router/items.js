const express = require('express');
const router = express.Router();
const mysql = require('../mysql');
const jwt = require('jsonwebtoken');
const login = require('../middleware/login');

router.get('/', login, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      'SELECT * FROM items WHERE id_user=?;',
      [req.user.id_user],
      (error, result, fields) => {
        if (error) {
          return res.status(500).send({ error: error });
        }

        const response = {
          quantidade: result.length,
          produtos: result.map((prod) => {
            return {
              email: prod.email,
              description: prod.description,
              deadline: prod.deadline,
            };
          }),
        };

        return res.status(200).send(response);
      },
    );
  });
});

// INSERE UM PRODUTO
router.post('/items', login, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      'INSERT INTO items (id_user, description, date_insert, time_insert, deadline) VALUES (?,?,?,?,?);',
      [
        req.user.id_user,
        req.body.description,
        req.body.date_insert,
        req.body.time_insert,
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
        req.body.date_edit,
        req.body.time_edit,
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
