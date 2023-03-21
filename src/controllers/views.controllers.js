import pool from "../db/db.js"

export const getAllCountrys = async (req, res) => {
    let limit = req.query.limit || 2 ;
    let offset = req.query.offset || 0;
    console.log("---------offset--------------")
    console.log(offset)
    console.log("---------limit--------------")
    console.log(limit)

    // if (offset == NaN) { offset = 0 };

    let consulta = await pool.query(`
    SELECT p.nombre, p.continente, p.poblacion, pp.pib_2019, pp.pib_2020 FROM paises p
    join paises_pib pp
    on p.nombre = pp.nombre
    limit ${limit} offset ${offset}
    `)
    console.log(consulta.rows)
    if (consulta) {
        res.render('home', {
            title: 'inicio',
            paises: consulta.rows
        })
    }
}
export const setCountry = async (req, res) => {
    try {
        let { nombre, continente, poblacion, pib_2019, pib_2020 } = req.body
        console.log(nombre, continente, poblacion, pib_2019, pib_2020)
        await pool.query('BEGIN')

        await pool.query(`INSERT INTO paises (nombre, continente, poblacion) VALUES($1, $2, $3)
        `, [nombre, continente, poblacion])

        await pool.query(`
                INSERT INTO paises_pib (nombre, pib_2019, pib_2020) VALUES($1, $2, $3)
            `, [nombre, pib_2019, pib_2020]);

        let paisData = await pool.query("SELECT * FROM paises_data_web WHERE nombre_pais = $1", [nombre]);
        if (paisData.rows.length == 0) {
            //crear registro en paises_data_web
            await pool.query(`
                    INSERT INTO paises_data_web (nombre_pais, accion) VALUES($1, $2)
                `, [nombre, 1]);
        } else {
            //hacemos update en paises_data_web

            await pool.query(`
                    UPDATE paises_data_web SET accion = 1 WHERE nombre_pais = $1
                `, [nombre])
        }
        await pool.query('COMMIT')

        let consulta = await pool.query(`
    SELECT p.nombre, p.continente, p.poblacion, pp.pib_2019, pp.pib_2020 FROM paises p
    join paises_pib pp
    on p.nombre = pp.nombre
    ORDER BY p.nombre
    `)
        console.log(consulta)
        res.render('home', {
            title: 'inicio',
            paises: consulta.rows
        })
    } catch (error) {
        console.log(error)
        await pool.query('ROLLBACK')
    }
}

export const deleteCountry = async (req, res) => {
    try {
        let { nombre } = req.params
        console.log(nombre)
        await pool.query('BEGIN');

        let pais = await pool.query("SELECT * FROM paises WHERE nombre = $1", [nombre]);
        if (pais.rows.length == 0) throw new Error("No existe registrado el país: " + nombre);

        await pool.query(`
               DELETE FROM paises_pib WHERE nombre = $1
               `, [nombre]);

        await pool.query(`
                   DELETE FROM paises WHERE nombre = $1
               `, [nombre]);

        let paisData = await pool.query("SELECT * FROM paises_data_web WHERE nombre_pais = $1", [nombre]);
        if (paisData.rows.length == 0) {

            await pool.query(`
                   INSERT INTO paises_data_web (nombre_pais, accion) VALUES($1, $2)
                   `, [nombre, 0])
        } else {

            await pool.query(`
                       UPDATE paises_data_web SET accion = 0 WHERE nombre_pais = $1
                   `, [nombre])
        }

        await pool.query('COMMIT')

        res.status(200).json({ code: 200, message: 'pais eliminado' })

    } catch (error) {
        await pool.query('ROLLBACK')
        console.log(error)
        res.status(500).json({ code: 500, error })

    }
}