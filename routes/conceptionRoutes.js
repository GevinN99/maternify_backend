const express = require("express")
const conceptionController = require('../controllers/conceptionController')
const auth = require('../middlewares/auth');

const router = express.Router();

router.get("/", auth.authenticate, conceptionController.getConceptionDate);
router.post("/", auth.authenticate, conceptionController.saveConceptionDate);
router.put("/", auth.authenticate, conceptionController.updateConceptionDate);
router.delete("/", auth.authenticate, conceptionController.deleteConceptionDate);

module.exports = router
