import db from "../connection";
import devData from "../data/development-data/index";
import seed from "./seed";

const runSeed = () => {
  return seed(devData).then(() => db.end());
};

runSeed();
