const router = require("express").Router();
const userController = require("../controller/userController");

const eventoController = require ('../controller/eventoController');

router.post("/user/", userController.createUser);
// router.get("/user/", userController.getAllUsers);
// router.put("/user/", userController.updateUser);
// router.delete("/user/:cpf", userController.deleteUser);

const orgController = require("../controller/orgController");

router.post('/organizador', orgController.createOrg);
router.get('/organizador', orgController.getAllOrg);
router.put('/organizador', orgController.updateOrg);
// router.delete('/organizador/:id', orgController.deleteOrg);

// Rotas eventoController
router.post('/evento', eventoController.createEvento);
router.get('/evento', eventoController.getAllEventos);
router.put('/evento', eventoController.updateEventos);

module.exports = router;
