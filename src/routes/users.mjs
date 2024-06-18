import { Router } from "express";
import { query, validationResult, body, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import {User} from '../mongoose/schemas/user.mjs';
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

//GET
router.get('/api/users',
    query('filter').isString()
        .notEmpty().withMessage("Must not be Empty")
        .isLength({ min: 3, max: 10 }).withMessage("Must be between 3 to 10 characters.")
    , (req, res) => {
        const result = validationResult(req);
        console.log(result);

        console.log(`Query string: ${req.query}`); // query string: /api/users?filter=34&name=dax
        const { query: { filter, value } } = req; // getting filter and value from the query string
        if (!filter && !value) return res.send(mockUsers);
        if (filter && value)
            return res.send(
                mockUsers.filter((user) => user[filter].includes(value))
            );
        return res.send(mockUsers);
    });

router.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
    // console.log(req.params);

    // const parsedId = parseInt(req.params.id); //converting it into int
    // if(isNaN(parsedId)) return res.status(400).send({msg: "Bad request: Invalid Id!"});
    // const findUser = mockUsers.find((user)=> user.id ===parsedId);

    // using middleware, to keep things consistent
    const { findUserIndex } = req;
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return res.sendStatus(404);
    return res.send(findUser);
})

// POST Requests
router.post('/api/users',
    checkSchema(createUserValidationSchema)
    , async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty())
            return res.send({ errors: result.array() }).status(400);

        const data = matchedData(req);
        data.password = await hashPassword(data.password);
        const newUser = new User(data);
        try{
            const savedUser = await newUser.save();
            return res.status(200).send(savedUser);
        }catch(err){
            console.log(err);
            return res.sendStatus(400);
        }
    });


// PUT Requests
// updates entire record
router.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
    // without using middleware
    // const {body, params:{id}} = req;
    // const parsedId = parseInt(id); //converting it into int
    // if(isNaN(parsedId)) return res.status(400).send({msg: "Bad request: Invalid Id!"});
    // const findUserIndex = mockUsers.findIndex((user)=>user.id===parsedId);
    // if(findUserIndex===-1) return res.sendStatus(400).send({msg: "Bad request: Invalid Id!"});
    // req.findUserIndex = findUserIndex; // attaching findUserIndex to request so it can be accessed

    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body } // Overwrites the record with the contents from the request body
    return res.sendStatus(204);
})

// PATCH Requests
// Updates record partially
router.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;

    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }; // all fields part of body will overwite the default mockUser fields
    return res.sendStatus(204);
})

// DELETE Requests
router.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
})

export default router;