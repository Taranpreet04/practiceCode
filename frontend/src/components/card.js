import { useFormik } from "formik";
import React, {useState} from "react"
import ReactDatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
var valid = require("card-validator");
const Card = () => {

    const [startDate, setStartDate] = useState(new Date());

    const handleDateChange = (date) => {
        // console.log("");
        var dateValidation = valid.expirationDate({ month: '06', year: '24' })
        console.log(date, "dateValidation", dateValidation)
    }

    const validate = values => {
        const errors = {};
        if (!values.cardHolderName) {
            errors.cardHolderName = 'Required';
        } else if (!valid.cardholderName(values?.cardHolderName)?.isPotentiallyValid || !valid.cardholderName(values.cardHolderName)?.isValid) {
            errors.cardHolderName = 'Invalid name';
        }

        if (!values.cardNumber) {
            errors.cardNumber = 'Required';
        } else if (!valid.number(values.cardNumber)?.isPotentiallyValid || !valid.number(values.cardNumber)?.isValid) {
            errors.cardNumber = 'Invalid card number';
        }

        if (!values.cvc) {
            errors.cvc = 'Required';
        } else if (!valid.cvv(values.cvc)?.isPotentiallyValid || !valid.cvv(values.cvc)?.isValid) {
            errors.cvc = "Invalid Cvc"
        }

        if (!values.expiryDate) {
            errors.expiryDate = 'Required';
        }

        return errors;
    };
    const cardDetailsForm = useFormik({
        initialValues: {
            cardHolderName: '',
            cardNumber: "",
            expiryDate: '',
            cvc: ''
        },
        validate,

        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    console.log("cardDetailsForm?.errors", cardDetailsForm?.errors)
    return (
        <>
            <h1>Card</h1>
            <div className="row">
                <div className="credit-card-form">
                    <form onSubmit={cardDetailsForm.handleSubmit}>
                        {/* <FocusError formik={cardDetailsForm} /> */}
                        <div className="col-12">
                            <div className="formfield">
                                <label htmlFor="cardNumber">Card Number</label>
                                <input type="text" id="cardNumber" placeholder="Card number" onChange={cardDetailsForm?.handleChange} />
                            </div>
                            {(cardDetailsForm?.errors.cardNumber && cardDetailsForm?.touched.cardNumber) ? <div>{cardDetailsForm?.errors.cardNumber}</div> : null}
                        </div>
                        <div className="col-12">
                            <div className="formfield">
                                <label htmlFor="cardHolderName">Card Holder</label>
                                <input type="text" id="cardHolderName" placeholder="Card holder's name" onChange={cardDetailsForm?.handleChange} />
                            </div>
                            {(cardDetailsForm?.errors.cardHolderName && cardDetailsForm?.touched.cardNumber) ? <div>{cardDetailsForm?.errors.cardHolderName}</div> : null}
                        </div>
                        <div className="row">

                            <div className="col-md-6 col-12">
                                <div className="formfield">
                                    <label htmlFor="expiry-date">Expiry Date</label>
                                    {/* <input type="date" id="expiry-date"  onChange={(e)=>handleDateChange(e.target.value)} /> */}
                                    <ReactDatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        // peekNextMonth
                                        showMonthYearPicker
                                        dateFormat="MM/yyyy"
                                        dropdownMode="select"
                                    />
                                </div>
                                {/* {cardDetailsForm?.errors.cardHolderName ? <div>{cardDetailsForm?.errors.cardHolderName}</div> : null} */}
                            </div>
                            <div className="col-md-6 col-12">
                                <div className="formfield">
                                    <label htmlFor="cvc">cvc</label>
                                    <input type="text" id="cvc" placeholder="cvc" onChange={cardDetailsForm?.handleChange} />
                                </div>
                                {cardDetailsForm?.errors.cvc ? <div>{cardDetailsForm?.errors.cvc}</div> : null}
                            </div>
                        </div>

                        <button type="submit" className="btn primary-btn click-button">Pay Now</button>

                    </form>

                </div>
            </div>
        </>
    )
}
export default Card