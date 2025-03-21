import sequelize from "../config/config.js";
import { getAllArmadas } from "../controller/armadaController.js";

const Armada = {
  // Get all Armada
  getAllArmada: async (page = 1, per_page = 10) => {
    try {
      const offset = (page - 1) * per_page;
      const query = `
        SELECT
          armada.id_armada,
          armada.id_jenis_kendaraan,
          armada.nopol_armada,
          armada.lokasi_terakhir,
          armada.status_armada,
          jenis_kendaraan.nama_jenis_kendaraan
        FROM
          armada
        LEFT JOIN
          jenis_kendaraan
        ON
          armada.id_jenis_kendaraan = jenis_kendaraan.id_jenis_kendaraan
        LIMIT :per_page OFFSET :offset;
      `;
      const data = await sequelize.query(query, {
        replacements: {
          per_page: parseInt(per_page),
          offset: parseInt(offset)
        },
        type: sequelize.QueryTypes.SELECT,
      });

      const countQuery = `
        SELECT COUNT(*) AS total
        FROM armada
      `;

      const [countResult] = await sequelize.query(countQuery, {
        type: sequelize.QueryTypes.SELECT,
      });

      console.log('Count Query Result:', countResult);

      return {
        data,
        total: countResult.total,
        page,
        per_page,
      };
    } catch (error) {
      throw new Error("Error fetching paginated data: " + error.message);
    }
  },

  getAllArmadas: async () => {
    const [results] = await sequelize.query(`
      SELECT
        armada.*,
        jenis_kendaraan.nama_jenis_kendaraan
      FROM armada
      LEFT JOIN
        jenis_kendaraan ON armada.id_jenis_kendaraan = jenis_kendaraan.id_jenis_kendaraan
      WHERE status_armada = 'TERSEDIA'
    `);
    return results;
  },

  // Get Armada by ID
  getArmadaById: async (id_armada) => {
    const [results] = await sequelize.query(
      `
      SELECT 
        id_armada,
        id_jenis_kendaraan,
        nopol_armada,
        lokasi_terakhir,
        status_armada
      FROM armada
      WHERE id_armada = ?
    `,
      { replacements: [id_armada] }
    );
    return results[0];
  },

  // Get Armada by Jenis Kendaraan ID
  getArmadaByJenisKendaraan: async (id_jenis_kendaraan) => {
    const [results] = await sequelize.query(
      `
      SELECT 
        id_armada,
        id_jenis_kendaraan,
        nopol_armada,
        lokasi_terakhir,
        status_armada
      FROM armada
      WHERE id_jenis_kendaraan = ?
    `,
      { replacements: [id_jenis_kendaraan] }
    );
    return results;
  },

  // Get Armada by Nopol
  getArmadaByNopol: async (nopol_armada) => {
    const [results] = await sequelize.query(
      `
      SELECT 
        id_armada,
        id_jenis_kendaraan,
        nopol_armada,
        lokasi_terakhir,
        status_armada
      FROM armada
      WHERE nopol_armada = ?
    `,
      { replacements: [nopol_armada] }
    );
    return results;
  },

  // Add a new Armada
  addArmada: async (armadaData) => {
    const { id_jenis_kendaraan, nopol_armada, lokasi_terakhir, status_armada } = armadaData;
    const [result] = await sequelize.query(
      `
      INSERT INTO armada (id_jenis_kendaraan, nopol_armada, lokasi_terakhir, status_armada)
      VALUES (?, ?, ?, ?)
    `,
      {
        replacements: [id_jenis_kendaraan, nopol_armada, lokasi_terakhir, status_armada],
      }
    );
    return { id_armada: result.insertId, ...armadaData };
  },

      // Memperbarui Status Armada
      updateStatusArmada: async (id_armada, armadaData) => {
        const { status_armada } = armadaData;
        const [result] = await sequelize.query(
          `
          UPDATE armada
          SET status_armada = ?
          WHERE id_armada = ?
        `,
          {
            replacements: [status_armada, id_armada],
          }
        );
        return result.affectedRows > 0;
      },

  // Update Armada
  updateArmada: async (id_armada, armadaData) => {
    const { id_jenis_kendaraan, nopol_armada, lokasi_terakhir, status_armada } = armadaData;
    const [result] = await sequelize.query(
      `
      UPDATE armada
      SET id_jenis_kendaraan = ?, nopol_armada = ?, lokasi_terakhir = ?, status_armada = ?
      WHERE id_armada = ?
    `,
      {
        replacements: [id_jenis_kendaraan, nopol_armada, lokasi_terakhir, status_armada, id_armada],
      }
    );
    return result.affectedRows > 0;
  },

  // Delete Armada
  deleteArmada: async (id_armada) => {
    const [result] = await sequelize.query(
      `DELETE FROM armada WHERE id_armada = ?`,
      { replacements: [id_armada] }
    );
    return result.affectedRows > 0;
  },

  getArmadaAvailability: async () => {
    const [ tersedia ] = await sequelize.query("SELECT COUNT(*) AS tersedia FROM armada WHERE status_armada = 'TERSEDIA';");
    console.log(tersedia);
    const [ muat ] = await sequelize.query("SELECT COUNT(*) AS muat FROM armada WHERE status_armada = 'MUAT';");
    console.log(muat);
    const [ bongkar ] = await sequelize.query("SELECT COUNT(*) AS bongkar FROM armada WHERE status_armada = 'BONGKAR';");
    console.log(bongkar);
    const [ selesai ] = await sequelize.query("SELECT COUNT(*) AS selesai FROM armada WHERE status_armada = 'SELESAI';");
    console.log(selesai);

    return { tersedia, muat, bongkar, selesai };
  },
};

export default Armada;
