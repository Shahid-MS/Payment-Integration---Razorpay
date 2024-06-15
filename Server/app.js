const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const Crypto = require("crypto");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).json({
    success: false,
    msg: "Server is running",
  });
});

app.post("/order", async (req, res) => {
  try {
    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, receiptNo } = req.body;
    // console.log("amount " + amount + " reciept " + receiptNo);

    var razorpayOptions = {
      amount,
      currency: "INR",
      receipt: receiptNo,
    };

    const order = await razorpayInstance.orders.create(razorpayOptions);
    // console.log("order", order);
    if (!order) {
      res.status(400).json({
        success: false,
        msg: "Bad Request",
      });
    }

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "Something went wrong",
    });
  }
});

app.post("/validate-payment", async (req, res) => {
  try {
    // console.log(req.body);
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    const sha = Crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);

    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({
        msg: "Transaction is not legit",
      });
    }

    return res.json({
      msg: "Transaction successful",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "Transaction is unsuccessful",
    });
  }
});

app.listen(port, () => {
  console.log(`App is listening on port : ${port}`);
});
