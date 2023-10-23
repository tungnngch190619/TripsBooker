import { DOC_NOT_FOUND, SUCCESS, UNKNOWN_ERROR } from "../../constants/messages.js";
import Customer from "./models.js";
import AutoIncrement from "../../config/AutoIncrement.js"
import { CUSTOMER_COL } from "../../constants/collections.js";
import { customerLogger } from "../../config/logger.js";

export async function createNewCustomer( req, res ) {
    const customerId = await AutoIncrement(CUSTOMER_COL);
    const customer = new Customer({
        _id: customerId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    });
    try {
        const result = await customer.save();
        return res.status(200).json({
            message: SUCCESS,
            data: result
        })
    } catch(err) {
        customerLogger.error(err);
        return res.status(500).json({
            message: UNKNOWN_ERROR
        });
    };  
};

export function getAllCustomers(req, res) {
    Customer.find({})
    .then(result => {
        return res.status(200).send(result);
    }).catch(err => {
        return res.status(500).json({
            message: "Có lỗi xảy ra"
        });
    });
};

export function getOneCustomer(req, res) {
    Customer.findOne({customer_id: req.params.customerId})
    .then(result => {
        return res.status(200).send(result);
    }).catch(err => {
        return res.status(500).json({
            message: DOC_NOT_FOUND,
            error: err
        });
    });
};

export function updateOneCustomer(req, res) {
    Customer.updateOne({customer_id: req.body.customerId})
    .then(result => {
        return res.status(200).json({
            message: SUCCESS,
            data: result
        });
    }).catch(err => {
        return res.status(500).json({
            message: DOC_NOT_FOUND,
            error: err
        });
    });
};

export function deleteOneCustomer (req, res) {
    Customer.updateOne({customer_id: req.params.customerId})
    .then(() => {
        return res.status(200).json({
            message: SUCCESS
        })
    }).catch( () => {
        return res.status(500).json({
            message: UNKNOWN_ERROR
        });
    });
};
