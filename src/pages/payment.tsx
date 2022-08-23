import '../assets/styles/general.css';
import '../assets/styles/form.css';
import visa from '../assets/visa.png';
import amex from '../assets/amex.png';
import mastercard from '../assets/mastercard.png'
import { useEffect, useState } from 'react';
import * as ValidationApi from '../api/api-validation';

function Payment() {
    const [status, setStatus] = useState("");
    const [message, setMessage] = useState("");

    const [cvv, setCVV] = useState("");
    function cvvHandler(e: any) {
        const cvv_length: number = 4;
        setCVV(e.target.value.slice(0, cvv_length));
    }

    const [month, setMonth] = useState("");
    function monthHandler(e: any) {
        setMonth(e.target.value.slice(0, 2));
    }

    const [year, setYear] = useState("");
    function yearHandler(e: any) {
        setYear(e.target.value.slice(0, 2));
    }

    const [cardNumber, setCardNumber] = useState("");
    function cardNumberHandler(e: any) {
        let numLength = e.target.value.length;
        (numLength <= 19 && numLength >= 16) ? 
        setCardNumber(e.target.value.slice(0, numLength)) : 
        setCardNumber(e.target.value.slice(0, 19))
    }

    const [submitState, setSubmitState] = useState(false);
    function validationHandler(e: any) {
        e.preventDefault();
        console.log("submitted");
        setSubmitState(true);
    }

    useEffect(() => {
        if(submitState) {
            console.log("validating");
            let card_info = {
                card_no: cardNumber,
                exp_month: month,
                exp_year: year,
                cvv: cvv
            }
            // console.log(card_info)
            ValidationApi.validate(card_info)
            .then(async (res) => { 
                return await res.json()
            })
            .then((data) => {
                // console.log("data: ", data);
                // console.log("message: ", data.message)
                // console.log("type: ", typeof(data.message))
                setStatus(data.status)
                setMessage(data.message)
            });
            setSubmitState(false);
        }
    },[submitState, cardNumber, month, year, cvv])

    return (
        <div className='center-card'>
            <div className='content-padding-15px'>
                <h3>Payment details</h3>
                <p className='center'>We only accept these cards:</p>
                <div className='logo-list'>
                    <img className='' title="MasterCard" src={mastercard} alt="visa-logo" width={75} height={50} />
                    <img className='logo-ctn' title="Visa" src={visa} alt="visa-logo"/>
                    <img className='logo-ctn' title="American Express" src={amex} alt="visa-logo"/>
                </div>
                <hr />
                <p className='center'>Fill in your credit/debit card information.</p>
                <p className='center alert'>Please check your surrounding from getting your
                    credit/debit card information compromised.</p>
                <form>
                    <table>
                        <tbody>
                            <tr>
                                <td className='label'>
                                    <label>Card Number</label>
                                </td>
                                <td>:</td>
                                <td>
                                    <input 
                                        className="card-number-input" 
                                        type="number" 
                                        pattern="[0-9]{16,19}" 
                                        value={cardNumber} 
                                        onChange={cardNumberHandler} 
                                        required={true} 
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>Expiry Date</label>                              
                                </td>
                                <td>:</td>
                                <td>
                                    <input type="number" value={month} onChange={monthHandler} required={true} />&nbsp;/&nbsp;
                                    <input type="number" value={year} onChange={yearHandler} required={true} />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>CVV</label>
                                </td>
                                <td>:</td>
                                <td>
                                    <input type="number" value={cvv} onChange={cvvHandler} required={true} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {
                        (status == "VALID" || status !== "") ?
                        <div className={`${(status == "VALID") ? "success-box" : "alert-box"}`}>
                            <h4>{status}</h4>
                            <p className="message">{ typeof(message) !== "object" ? message : "This card is valid" }</p>
                        </div> : 
                        <div></div>
                    }
                    {/* <div className="input-section">
                        <label>Card Number: </label>
                        <input className="card-number-input" type="number" pattern="[0-9]{16,19}" value={cardNumber} onChange={cardNumberHandler} required={true} />
                    </div>
                    <div className="input-section">
                        <label>Expiry Date: </label>
                        <input type="number" value={month} onChange={monthHandler} />&nbsp;/&nbsp;
                        <input type="number" value={year} onChange={yearHandler} />
                    </div>
                    <div className="input-section">
                        <label>CVV (Security Code): </label>
                        <input type="number" value={cvv} onChange={cvvHandler} />
                    </div> */}

                    <input type="submit" name="submit" value="Proceed" onClick={validationHandler}/>
                </form>
            </div>
        </div>
    )
}

export default Payment;