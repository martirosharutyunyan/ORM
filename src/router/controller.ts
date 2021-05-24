import express from 'express';
const router = express.Router();
        
router.use('/authentification', require('./Authentification/Registration'))

module.exports = router;