import { Router } from "express";
import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";
import { cartDao } from "../dao/mongoDao/carts.dao.js";
import { productDao } from "../dao/mongoDao/products.dao.js";

const router = Router();

// Crear un carrito
router.post("/", async (req, res) => {
  try {
    
    const cart = await cartDao.create();
    res.json({ status: "success", payload: cart })

  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

// Obtener un carrito por id
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    
    const cart = await cartDao.getById(cid);
    if (!cart) return res.json({ status: "error", payload: `Carrito con el id ${cid} no existe` })
    res.json({ status: "success", payload: cart })

  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

// Agregar un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    
    // Validar que el producto exista
    const findProduct = await productDao.getById(pid);
    if (!findProduct) return res.json({ status: "error", payload: `Producto con el id ${pid} no existe` })
    
    // Validar que el carrito exista
    const findCart = await cartDao.getById(cid);
    if (!findCart) return res.json({ status: "error", payload: `Carrito con el id ${pid} no existe` })

    const product = findCart.products.find((productCart) => productCart.product === pid);
    if (!product) {
      // Agregar el producto si no existe en el carrito
      findCart.products.push({ product: pid, quantity: 1});
    } else {
      // Incrementar la cantidad en 1 si ya existe
      product.quantity++
    }
  
    const cart = await cartModel.findByIdAndUpdate(cid, { products: findCart.products }, { new: true });
    
    res.json({ status: "success", payload: cart })

  } catch (error) {
    
    console.log(error);
    res.send(error.message);
    
  }
});

// Eliminar un product de un carrito seleccionado
router.delete("/:cid/products/:pid", async (req, res) => {
  const {cid, pid} = req.params;
  try {

    const findProduct = await productDao.getById(pid);
    if(!findProduct) return res.json({ status: "error", message: `Producto con el id ${pid} no encontrado` });

    const findCart = await cartDao.getById(cid);
    if (!findCart) return res.json({ status: "error", payload: `Carrito con el id ${cid} no existe` });

    const cartUpdate = await cartDao.deleteProductInCart( cid, pid );
    res.json({ status: "success", payload: cartUpdate })

  } catch (error) {
    
    console.log(error);
    res.send(error.message);
    
  }
});

// Acutalizar la cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {

    const findProduct = await productDao.getById(pid);
    if(!findProduct) return res.json({ status: "error", message: `Producto con el id ${pid} no encontrado` });

    const findCart = await cartDao.getById(cid);
    if (!findCart) return res.json({ status: "error", payload: `Carrito con el id ${cid} no existe` });

    const cartUpdate = await cartDao.updateProductInCart( cid, pid, quantity );
    res.json({ status: "success", payload: cartUpdate });

  } catch (error) {
    
    console.log(error);
    res.send(error.message);

  }
})

// Borrar productos de un carrito
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    
    const findCart = await cartDao.getById(cid);
    if (!findCart) return res.json({ status: "error", payload: `Carrito con el id ${cid} no existe` });

    const cartUpdate = await cartDao.deleteProductsInCart(cid);
    res.json({ status: "success", payload: cartUpdate });

  } catch (error) {
    
    console.log(error);
    res.send(error.message);

  }
})

export default router;