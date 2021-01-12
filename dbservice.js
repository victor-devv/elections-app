const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

let instance = null;

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log(`DB ${connection.state}`);
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async getLGAs() {
    try {
      const response = await new Promise((resolve, reject) => {
        // const query = `SELECT * FROM lga WHERE lga_id = ?`;
        // connection.query(query, [lga])

        const query = `SELECT * FROM lga`;

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });

      //console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getPollingUnits(lga_id) {
    try {
      const response = await new Promise((resolve, reject) => {
        // const query = `SELECT * FROM lga WHERE lga_id = ?`;
        // connection.query(query, [lga])

        const query = `SELECT * FROM polling_unit WHERE lga_id = ?`;

        connection.query(query, [lga_id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });

      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getLGAResults(lgaId) {
    try {
      const pollingUnitsResults = await new Promise((resolve, reject) => {
        // const query = "SELECT * FROM polling_unit WHERE lga_id = ?";
        // const query =
        //   "SELECT polling_unit.uniqueid, announced_pu_results.party_abbreviation, announced_pu_results.party_score FROM polling_unit INNER JOIN announced_pu_results ON announced_pu_results.polling_unit_uniqueid = polling_unit.uniqueid WHERE lga_id = ?";
        const query =
          "SELECT polling_unit.uniqueid, announced_pu_results.party_abbreviation, announced_pu_results.party_score FROM announced_pu_results INNER JOIN polling_unit ON announced_pu_results.polling_unit_uniqueid = polling_unit.uniqueid WHERE lga_id = ?";

        connection.query(query, [lgaId], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });

      // console.log(pollingUnitsResults);
      //   return {
      //     party_abbreviation: party_abbreviation,
      //     party_score: party_score,
      //   };
      return pollingUnitsResults;
    } catch (error) {
      console.log(error);
    }
  }

  async getPUResults(uniqueId) {
    try {
      const pollingUnitsResults = await new Promise((resolve, reject) => {
        const query =
          "SELECT * FROM announced_pu_results WHERE polling_unit_uniqueid = ?";

        connection.query(query, [uniqueId], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });

      // console.log(pollingUnitsResults);
      return pollingUnitsResults;
    } catch (error) {
      console.log(error);
    }
  }

  async addPUResults(pdp, dpp, acn, ppa, cdc, jp, anpp, labo, cpp) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO announced_pu_results (pdp, dpp, acn, ppa, cdc, jp, anpp, labo, cpp) VALUES = (?, ?, ?, ?, ?, ?, ?, ?, ?);";

        connection.query(
          query,
          [pdp, dpp, acn, ppa, cdc, jp, anpp, labo, cpp],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result.insertId);
          }
        );
      });

      console.log(insertId);
      return insertId;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;
