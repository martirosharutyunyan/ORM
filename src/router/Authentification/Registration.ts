import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';

router.post('/registerLegalPerson', async (req, res):Promise<void> => {
    try{
        const { mail } = req.body
    } catch(err:any){
        console.log(err)
        res.send({message:'error'})
    }
})

module.exports = router;