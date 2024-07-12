import {Pool} from 'pg'

const pool = new Pool({
  connectionString: process.env.DICTIONARY_DB,
});

const fetchData = async (SQL, ...params) => {
  const client = await pool.connect();
  try {
    const { rows } = await client.query(SQL, params.length ? params : null);
    return rows;
  } finally {
    client.release();
  }
};

export default fetchData