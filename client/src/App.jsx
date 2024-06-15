import "./App.css";

function App() {
  const paymentHandler = async () => {
    // alert("Payment success");
    const amount = 500;
    const receiptNo = "gdghd6481627";
    try {
      const response = await fetch("http://localhost:8080/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100,
          receiptNo,
        }),
      });

      const order = await response.json();
      console.log(order);

      var options = {
        key: import.meta.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "MS 2.O",
        description: "Test Transaction",
        image:
          "https://img.freepik.com/free-vector/e-wallet-concept-illustration_114360-7561.jpg?size=626&ext=jpg",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response) {
          // alert(response.razorpay_payment_id);
          // alert(response.razorpay_order_id);
          // alert(response.razorpay_signature);

          // alert(
          //   `Transaction Successful : payment_id ${response.razorpay_payment_id} , order_id :  ${response.razorpay_order_id}, signature : ${response.razorpay_signature} `
          // );

          const body = { ...response };

          const validatePayment = await fetch(
            "http://localhost:8080/validate-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            }
          );

          const validatePaymentJson = await validatePayment.json();
          console.log(validatePaymentJson);
          alert(validatePaymentJson.orderId);
          alert(validatePaymentJson.paymentId);

          alert(validatePaymentJson.msg);
        },
        prefill: {
          name: "MS",
          email: "ms@gmail.com",
          contact: "9008473740",
        },
        notes: {
          address: "MS Residence",
        },
        theme: {
          color: "#3399cc",
        },
      };

      var rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="product">
        <h1>Razorpay Payment gateway</h1>
        <button onClick={paymentHandler}>Pay now</button>
      </div>
    </>
  );
}

export default App;
