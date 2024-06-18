import {mockUsers} from "./constants.mjs";
export const resolveIndexByUserId = (req, res, next) => {
    const { params: { id } } = req;
    const parsedId = parseInt(id); //converting it into int
    if (isNaN(parsedId)) return res.status(400).send({ msg: "Bad request: Invalid Id!" });
    
    console.log(mockUsers);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) return res.sendStatus(400).send({ msg: "Bad request: Invalid Id!" });
    req.findUserIndex = findUserIndex; // attaching findUserIndex to request so it can be accessed

    next();
  }