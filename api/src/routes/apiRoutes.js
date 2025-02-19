const router = require("express").Router();
const userController = require("../controller/userController");

const eventoController = require ('../controller/eventoController');

router.post("/user/", userController.createUser);
router.post("/user/login", userController.loginUser);
router.get("/user/", userController.getAllUsers);
// router.put("/user/", userController.updateUser);
// router.delete("/user/:cpf", userController.deleteUser);

const orgController = require("../controller/orgController");
const ingressoController = require("../controller/ingressoController");

router.post('/organizador', orgController.createOrg);
router.get('/organizador', orgController.getAllOrg);
// router.put('/organizador', orgController.updateOrg);
// router.delete('/organizador/:id', orgController.deleteOrg);

// Rotas eventoController
router.post('/evento', eventoController.createEvento);
router.get('/evento', eventoController.getAllEventos);
router.put('/evento', eventoController.updateEventos);
router.delete('/evento/:id', eventoController.deleteEvento);
router.get('/evento/data', eventoController.getEventosPorData);
router.get('/evento/:data', eventoController.getEventosSemanal);

// Rotas ingressoController
router.post('/ingresso', ingressoController.createIngresso);
router.get('/ingresso', ingressoController.getAllIngressos);
router.put('/ingresso', ingressoController.updateIngressos);
router.delete('/ingresso/:id', ingressoController.deleteIngresso);

module.exports = router;
