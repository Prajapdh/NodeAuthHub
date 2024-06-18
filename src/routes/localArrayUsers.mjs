import { Router } from "express";
import { query, validationResult, body, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";

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
    // [
    //   body('username').notEmpty().withMessage("Username cannot be empty.")
    //   .isLength({min:5, max:32}).withMessage("Username must be between 5 to 32 characters long.")
    //   .isString().withMessage("Username must be a string."),
    //   body('displayName').notEmpty().withMessage("displayName cannot be empty."),
    // ]
    checkSchema(createUserValidationSchema)
    , (req, res) => {
        const result = validationResult(req);
        console.log(result);
        if (!result.isEmpty())
            return res.send({ errors: result.array() }).status(400);

        const data = matchedData(req);
        // using unvalidated data directly from body
        // const {body} = req;
        // const newUser = {id: mockUsers[mockUsers.length-1].id+1, ...body};

        // using validated data
        const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
        mockUsers.push(newUser);
        console.log(mockUsers);
        return res.send(newUser).status(201);
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