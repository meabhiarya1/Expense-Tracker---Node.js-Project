const Razorpay = require("razorpay");
const Order = require("../models/orders");

exports.purchasePremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: "rzp_test_RGdChsnm8S5udb",
            key_secret: "93DbrQOf4JdBXZLaB6ZuYmNx",
        });
        const amount = 2500;
        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            if (err) {

                throw new Error(JSON.stringify(err));
            }
            await req.user.createOrder({ orderId: order.id, status: "PENDING" });
            return res.status(201).json({ order, key_id: rzp.key_id });
        });
    } catch (error) {
        res.status(403).json({ message: "something went wrong" });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderId: order_id } });

        const promise1 = order.update({ paymentId: payment_id, status: "SUCCESSFUL" });

        const promise2 = req.user.update({ isPremium: true });

        Promise.all([promise1, promise2])
            .then(() => {
                return res.status(202).json({ message: "Transaction Successful" });
            }).catch((err) => {
                throw new Error(err);
            });
    } catch (error) {
        return res.status(403).json({ message: "Something went wrong" });
    }
};
