import { Router } from "express";

const router = Router();

router.get('/api/products', (req, res) => {
  console.log(`Session Id: ${req.session.id}`);
  req.sessionStore.get(req.session.id, (err, sessionData) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(`Retiriving session data: ${sessionData}`);
  });

  console.log(`req.headers.cookie: ${req.headers.cookie}`);
  console.log(`req.cookies: ${req.cookies}`); // With help of cookie parser
  console.log(`req.signedCookies.hello: ${req.signedCookies.hello}`);
  if (req.signedCookies.hello && req.signedCookies.hello === "World")
    return res.send([
      { id: 1, name: "Choco", price: 2.99 },
      { id: 2, name: "Bread", price: 1.99 },
    ]);

  return res.send({ msg: "Sorry! You need the correct cookie" }).status(403);
});


export default router;