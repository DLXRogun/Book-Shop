const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allBooks = (req, res) =>{
    let {category_id, news, limit, currentPage} = req.query;

    let offset = limit * (currentPage - 1);

    let sql = "SELECT * FROM books ";
    let values = [];

    if(category_id && news){
        sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
        values = [category_id];
    }else if (category_id){
        sql += " WHERE category_id = ? ";
        values = [category_id];
    }else if(news){
        sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    }

    sql += "LIMIT ? OFFSET ?"; 
    values.push(parseInt(limit), offset);

    conn.query(sql, values, 
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.length){
                return res.status(StatusCodes.OK).json(results);
            }
            else{
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        })
};

const bookDetail = (req, res) =>{
    let {id} = req.params;

    let sql = `SELECT * FROM books LEFT JOIN category 
                ON books.category_id = category.id  WHERE books.id = ?; `;
    conn.query(sql, id, 
        (err, results) => {
            if(err){
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results[0]){
                return res.status(StatusCodes.OK).json(results[0]);
            }
            else{
                return res.status(StatusCodes.NOT_FOUND).end();
            }
    })
};

module.exports = {
    allBooks, 
    bookDetail, 
};